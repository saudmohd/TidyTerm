import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { defaultTemplates, processTemplate } from "./templates";
import { documentGenerationSchema } from "@shared/schema";
import { randomUUID } from "crypto";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed data
  await seedData();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Platform routes
  app.get('/api/platforms', async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });

  // Template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const { platformId } = req.query;
      const templates = platformId 
        ? await storage.getTemplatesByPlatform(platformId as string)
        : await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Document routes
  app.get('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = documentGenerationSchema.parse(req.body);
      
      const template = await storage.getTemplate(validatedData.templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Check if user has access to premium templates
      const user = await storage.getUser(userId);
      if (template.isPremium && user?.subscriptionStatus !== 'active') {
        return res.status(403).json({ message: "Premium subscription required" });
      }

      // Process template with variables
      const processedContent = processTemplate(template.content, {
        ...validatedData.variables,
        currentDate: new Date().toLocaleDateString(),
      });

      const document = await storage.createDocument({
        userId,
        templateId: validatedData.templateId,
        title: validatedData.title,
        type: template.type,
        content: processedContent,
        variables: validatedData.variables,
        isPublic: true,
      });

      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  app.get('/api/documents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (document.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.put('/api/documents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const document = await storage.getDocument(req.params.id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      if (document.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedDocument = await storage.updateDocument(req.params.id, req.body);
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete('/api/documents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteDocument(req.params.id, userId);
      res.json({ message: "Document deleted" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Public document view
  app.get('/api/public/documents/:shareToken', async (req, res) => {
    try {
      const document = await storage.getDocumentByShareToken(req.params.shareToken);
      
      if (!document || !document.isPublic) {
        return res.status(404).json({ message: "Document not found" });
      }

      await storage.incrementViewCount(document.id);
      res.json(document);
    } catch (error) {
      console.error("Error fetching public document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
          res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
          });
          return;
        }
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No email on file' });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_1234567890',
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

      const latestInvoice = subscription.latest_invoice;
      const clientSecret = typeof latestInvoice === 'object' && latestInvoice?.payment_intent 
        ? typeof latestInvoice.payment_intent === 'object'
          ? latestInvoice.payment_intent.client_secret
          : null
        : null;

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(400).json({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function seedData() {
  try {
    const platforms = await storage.getPlatforms();
    
    if (platforms.length === 0) {
      // Create platforms
      const gumroad = await storage.createPlatform({
        name: "gumroad",
        displayName: "Gumroad", 
        icon: "fas fa-shopping-bag",
        description: "Digital products marketplace"
      });

      const carrd = await storage.createPlatform({
        name: "carrd",
        displayName: "Carrd",
        icon: "fas fa-globe", 
        description: "Simple landing pages"
      });

      const notion = await storage.createPlatform({
        name: "notion",
        displayName: "Notion", 
        icon: "fas fa-file-alt",
        description: "Content and productivity"
      });

      // Create templates
      await storage.createTemplate({
        name: "Gumroad Terms of Service",
        type: "terms",
        platformId: gumroad.id,
        content: defaultTemplates.gumroad.terms,
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          productTypes: { type: "string", required: false },
          refundPolicy: { type: "string", required: false }
        },
        isPremium: false
      });

      await storage.createTemplate({
        name: "Gumroad Privacy Policy", 
        type: "privacy",
        platformId: gumroad.id,
        content: defaultTemplates.gumroad.privacy,
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          collectsEmail: { type: "boolean", required: true },
          collectsPurchaseHistory: { type: "boolean", required: true },
          collectsAnalytics: { type: "boolean", required: false },
          gdprApplies: { type: "boolean", required: false },
          ccpaApplies: { type: "boolean", required: false }
        },
        isPremium: false
      });

      await storage.createTemplate({
        name: "Carrd Terms of Service",
        type: "terms", 
        platformId: carrd.id,
        content: defaultTemplates.carrd.terms,
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          websiteUrl: { type: "url", required: false },
          serviceDescription: { type: "string", required: false },
          offersServices: { type: "boolean", required: false },
          refundPolicy: { type: "string", required: false }
        },
        isPremium: false
      });

      await storage.createTemplate({
        name: "Carrd Privacy Policy",
        type: "privacy",
        platformId: carrd.id, 
        content: defaultTemplates.carrd.privacy,
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          websiteUrl: { type: "url", required: false },
          collectsEmail: { type: "boolean", required: true },
          collectsFormData: { type: "boolean", required: false },
          collectsName: { type: "boolean", required: false },
          collectsAnalytics: { type: "boolean", required: false }
        },
        isPremium: false
      });

      await storage.createTemplate({
        name: "Notion Terms of Service",
        type: "terms",
        platformId: notion.id,
        content: defaultTemplates.notion.terms, 
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          contentType: { type: "string", required: false },
          offersTemplates: { type: "boolean", required: false },
          membershipSite: { type: "boolean", required: false },
          refundPolicy: { type: "string", required: false }
        },
        isPremium: true
      });

      await storage.createTemplate({
        name: "Notion Privacy Policy",
        type: "privacy",
        platformId: notion.id,
        content: defaultTemplates.notion.privacy,
        variables: {
          businessName: { type: "string", required: true },
          contactEmail: { type: "email", required: true },
          collectsEmail: { type: "boolean", required: true },
          collectsProfile: { type: "boolean", required: false },
          collectsUsage: { type: "boolean", required: false },
          collectsPayment: { type: "boolean", required: false }
        },
        isPremium: true
      });

      console.log("Seed data created successfully");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export const defaultTemplates = {
  gumroad: {
    terms: `# Terms of Service

**Effective Date:** {{currentDate}}

## 1. Agreement to Terms

By purchasing products from {{businessName}} through Gumroad, you agree to these Terms of Service.

## 2. Products and Services

We offer digital products including but not limited to:
- {{productTypes}}

## 3. Payment and Refunds

{{#if refundPolicy}}
**Refund Policy:** {{refundPolicy}}
{{else}}
All sales are final. No refunds will be provided except as required by law.
{{/if}}

## 4. Intellectual Property

All products sold remain the intellectual property of {{businessName}}. You receive a license to use the products as intended.

## 5. Prohibited Uses

You may not:
- Resell or redistribute our products
- Share products with unauthorized parties
- Use products for illegal purposes

## 6. Contact Information

For questions about these Terms, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`,

    privacy: `# Privacy Policy

**Effective Date:** {{currentDate}}

## 1. Information We Collect

At {{businessName}}, we collect the following information:

{{#if collectsEmail}}
- **Email addresses** when you make a purchase or subscribe to our newsletter
{{/if}}
{{#if collectsPurchaseHistory}}  
- **Purchase history** and transaction details for order fulfillment
{{/if}}
{{#if collectsAnalytics}}
- **Analytics data** through cookies to improve our services
{{/if}}

## 2. How We Use Your Information

We use your information to:
- Process and fulfill your orders
- Send important updates about your purchases  
- Provide customer support
{{#if collectsAnalytics}}
- Analyze website usage and improve our services
{{/if}}

## 3. Information Sharing

We do not sell or rent your personal information. We may share information with:
- Gumroad (our payment processor) to complete transactions
- Service providers who assist in our operations
- Law enforcement when required by law

## 4. Data Security

We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.

## 5. Your Rights

{{#if gdprApplies}}
Under GDPR, you have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data
- Object to data processing
{{/if}}

{{#if ccpaApplies}}
Under CCPA, you have the right to:
- Know what personal information we collect
- Delete your personal information
- Opt-out of the sale of personal information
{{/if}}

## 6. Contact Information

For questions about this Privacy Policy, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`
  },

  carrd: {
    terms: `# Terms of Service

**Effective Date:** {{currentDate}}

## 1. Acceptance of Terms

By accessing {{businessName}} ({{websiteUrl}}), you agree to these Terms of Service.

## 2. Website Use

This website provides {{serviceDescription}}. You may use our website for lawful purposes only.

## 3. User Responsibilities

You agree to:
- Provide accurate information when requested
- Use our website in compliance with applicable laws
- Respect our intellectual property rights

## 4. Content and Intellectual Property

All content on this website, including text, graphics, logos, and images, is owned by {{businessName}} and protected by copyright laws.

{{#if offersServices}}
## 5. Services and Payment

{{#if refundPolicy}}
**Refund Policy:** {{refundPolicy}}
{{else}}
All sales are final unless otherwise specified.
{{/if}}
{{/if}}

## 6. Limitation of Liability

{{businessName}} shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.

## 7. Changes to Terms

We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.

## 8. Contact Information

For questions about these Terms, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`,

    privacy: `# Privacy Policy

**Effective Date:** {{currentDate}}

## 1. Information Collection

{{businessName}} ({{websiteUrl}}) collects information when you:

{{#if collectsEmail}}
- Subscribe to our newsletter or contact us
{{/if}}
{{#if collectsFormData}}
- Fill out forms on our website
{{/if}}
{{#if collectsAnalytics}}
- Visit our website (through cookies and analytics)
{{/if}}

## 2. Types of Information

We may collect:
{{#if collectsEmail}}
- Email addresses
{{/if}}
{{#if collectsName}}
- Names and contact information
{{/if}}
{{#if collectsAnalytics}}
- Website usage data and IP addresses
{{/if}}

## 3. Use of Information

We use collected information to:
- Respond to inquiries and provide requested services
- Send updates and newsletters (with your consent)
- Improve our website and user experience
- Comply with legal obligations

## 4. Information Sharing

We do not sell your personal information. We may share data with:
- Service providers who help operate our website
- Analytics services (Google Analytics, etc.)
- Legal authorities when required by law

## 5. Cookies

Our website uses cookies to enhance user experience and collect analytics data. You can disable cookies in your browser settings.

## 6. Data Security

We implement reasonable security measures to protect your information, though no method is completely secure.

## 7. Your Rights

You have the right to:
- Request access to your personal data
- Request correction or deletion of your data
- Withdraw consent for data processing
- Opt-out of marketing communications

## 8. Contact Information

For privacy-related questions, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`
  },

  notion: {
    terms: `# Terms of Service

**Effective Date:** {{currentDate}}

## 1. Agreement

By accessing content from {{businessName}}, you agree to these Terms of Service.

## 2. Content and Services

We provide:
{{#if contentType}}
- {{contentType}}
{{else}}
- Digital content and resources
{{/if}}

## 3. Content Usage Rights

Unless otherwise specified:
- Content is for personal use only
- You may not redistribute or resell our content
- Attribution may be required as specified

{{#if offersTemplates}}
## 4. Template Usage

Our Notion templates are provided "as is" and may be used for personal or business purposes unless otherwise restricted.
{{/if}}

{{#if membershipSite}}
## 5. Membership Terms

{{#if refundPolicy}}
**Refund Policy:** {{refundPolicy}}
{{else}}
Membership fees are non-refundable except as required by law.
{{/if}}

Access to premium content requires active membership.
{{/if}}

## 6. Intellectual Property

All content remains the property of {{businessName}}. Users receive limited usage rights as specified.

## 7. Prohibited Activities

You may not:
- Share premium content with non-members
- Attempt to circumvent access restrictions
- Use content for illegal purposes
- Impersonate our brand or services

## 8. Disclaimer

Content is provided for informational purposes. {{businessName}} makes no warranties about accuracy or completeness.

## 9. Contact

For questions about these Terms, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`,

    privacy: `# Privacy Policy

**Effective Date:** {{currentDate}}

## 1. Information We Collect

{{businessName}} collects information when you:

{{#if collectsEmail}}
- Subscribe to our content or services
{{/if}}
{{#if collectsProfile}}
- Create an account or profile
{{/if}}
{{#if collectsUsage}}
- Access and interact with our Notion content
{{/if}}

## 2. Data Types

We may collect:
{{#if collectsEmail}}
- Email addresses and contact information
{{/if}}
{{#if collectsProfile}}
- Profile information and preferences
{{/if}}
{{#if collectsUsage}}
- Usage patterns and content interaction data
{{/if}}
{{#if collectsPayment}}
- Payment information (processed securely by third parties)
{{/if}}

## 3. How We Use Data

Information is used to:
- Provide access to content and services
- Send updates and notifications
- Improve our content and user experience
- Process payments and manage subscriptions
- Communicate with subscribers

## 4. Data Sharing

We do not sell personal information. We may share data with:
- Payment processors for transaction handling
- Email service providers for communications
- Analytics services to understand usage
- Legal authorities when required

## 5. Data Storage and Security

- Data is stored securely using industry-standard practices
- We implement appropriate technical safeguards
- No method of storage or transmission is 100% secure

## 6. Third-Party Services

Our services may integrate with:
- Notion (for content delivery)
- Payment processors
- Email marketing platforms
- Analytics services

Each has their own privacy policies governing data use.

## 7. Your Rights

You may:
- Request access to your personal data
- Update or correct your information
- Request deletion of your data
- Unsubscribe from communications
- Withdraw consent for data processing

## 8. Contact Information

For privacy questions, contact us at {{contactEmail}}.

---
*Last updated: {{currentDate}}*`
  }
};

export function processTemplate(template: string, variables: Record<string, any>): string {
  let processed = template;
  
  // Replace simple variables
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value || '');
  }
  
  // Process conditional blocks
  processed = processed.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    return variables[condition] ? content : '';
  });
  
  // Clean up any remaining template tags
  processed = processed.replace(/{{.*?}}/g, '');
  
  return processed.trim();
}

import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PlatformSelector from "@/components/platform-selector";
import BusinessInfoForm from "@/components/business-info-form";
import DataPolicyForm from "@/components/data-policy-form";
import DocumentPreview from "@/components/document-preview";

type Step = 'platform' | 'business' | 'policy' | 'preview';

export default function Generator() {
  const [currentStep, setCurrentStep] = useState<Step>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [documentType, setDocumentType] = useState<'terms' | 'privacy'>('terms');
  const [businessInfo, setBusinessInfo] = useState<Record<string, any>>({});
  const [policyInfo, setPolicyInfo] = useState<Record<string, any>>({});
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: platforms = [] } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['/api/templates', selectedPlatform],
    enabled: !!selectedPlatform,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { 
      templateId: string; 
      title: string; 
      variables: Record<string, any> 
    }) => {
      const response = await apiRequest('POST', '/api/documents', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Generated!",
        description: "Your legal document has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate document",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    const template = templates.find((t: any) => 
      t.platformId === selectedPlatform && t.type === documentType
    );
    
    if (!template) {
      toast({
        title: "Template Not Found",
        description: "Please select a valid platform and document type.",
        variant: "destructive",
      });
      return;
    }

    const variables = {
      ...businessInfo,
      ...policyInfo,
      currentDate: new Date().toLocaleDateString(),
    };

    generateMutation.mutate({
      templateId: template.id,
      title: `${businessInfo.businessName || 'Business'} - ${documentType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}`,
      variables,
    });
  };

  const stepTitles = {
    platform: "Choose Your Platform",
    business: "Business Information", 
    policy: "Data & Policies",
    preview: "Review & Generate"
  };

  const steps: Step[] = ['platform', 'business', 'policy', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Generator
          </h1>
          <p className="text-gray-600">
            Create professional legal documents in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index <= currentStepIndex 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepTitles[step]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button
              variant={documentType === 'terms' ? 'default' : 'outline'}
              onClick={() => setDocumentType('terms')}
            >
              <i className="fas fa-file-contract mr-2"></i>
              Terms of Service
            </Button>
            <Button
              variant={documentType === 'privacy' ? 'default' : 'outline'}
              onClick={() => setDocumentType('privacy')}
            >
              <i className="fas fa-user-shield mr-2"></i>
              Privacy Policy
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Steps */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{stepTitles[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 'platform' && (
                  <PlatformSelector
                    platforms={platforms}
                    selectedPlatform={selectedPlatform}
                    onSelect={setSelectedPlatform}
                  />
                )}

                {currentStep === 'business' && (
                  <BusinessInfoForm
                    data={businessInfo}
                    onChange={setBusinessInfo}
                  />
                )}

                {currentStep === 'policy' && (
                  <DataPolicyForm
                    data={policyInfo}
                    onChange={setPolicyInfo}
                    documentType={documentType}
                  />
                )}

                {currentStep === 'preview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Platform</h3>
                      <p className="text-gray-600">
                        {platforms.find((p: any) => p.id === selectedPlatform)?.displayName}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Name</h3>
                      <p className="text-gray-600">{businessInfo.businessName}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Email</h3>
                      <p className="text-gray-600">{businessInfo.contactEmail}</p>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending}
                    >
                      {generateMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Generating Document...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-contract mr-2"></i>
                          Generate Document
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prevIndex = currentStepIndex - 1;
                      if (prevIndex >= 0) {
                        setCurrentStep(steps[prevIndex]);
                      }
                    }}
                    disabled={currentStepIndex === 0}
                  >
                    Previous
                  </Button>

                  {currentStep !== 'preview' && (
                    <Button
                      onClick={() => {
                        if (currentStep === 'platform' && !selectedPlatform) {
                          toast({
                            title: "Platform Required",
                            description: "Please select a platform to continue.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const nextIndex = currentStepIndex + 1;
                        if (nextIndex < steps.length) {
                          setCurrentStep(steps[nextIndex]);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24">
            <DocumentPreview
              selectedPlatform={selectedPlatform}
              documentType={documentType}
              businessInfo={businessInfo}
              policyInfo={policyInfo}
              templates={templates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

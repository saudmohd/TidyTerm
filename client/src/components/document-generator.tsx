import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Platform {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
}

interface Template {
  id: string;
  name: string;
  type: 'terms' | 'privacy';
  platformId: string;
  content: string;
  variables: any;
  isPremium: boolean;
}

interface DocumentGeneratorProps {
  platforms: Platform[];
  templates: Template[];
  onGenerate: (data: {
    templateId: string;
    title: string;
    variables: Record<string, any>;
  }) => void;
  isGenerating: boolean;
}

type Step = 'platform' | 'business' | 'policy' | 'preview';

export default function DocumentGenerator({
  platforms,
  templates,
  onGenerate,
  isGenerating
}: DocumentGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [documentType, setDocumentType] = useState<'terms' | 'privacy'>('terms');
  const [businessInfo, setBusinessInfo] = useState<Record<string, any>>({});
  const [policyInfo, setPolicyInfo] = useState<Record<string, any>>({});

  const steps: Step[] = ['platform', 'business', 'policy', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);

  const stepTitles = {
    platform: "Choose Your Platform",
    business: "Business Information", 
    policy: "Data & Policies",
    preview: "Review & Generate"
  };

  const updateBusinessInfo = (field: string, value: any) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePolicyInfo = (field: string, value: any) => {
    setPolicyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    const template = templates.find((t: Template) => 
      t.platformId === selectedPlatform && t.type === documentType
    );
    
    if (!template) return;

    const variables = {
      ...businessInfo,
      ...policyInfo,
      currentDate: new Date().toLocaleDateString(),
    };

    onGenerate({
      templateId: template.id,
      title: `${businessInfo.businessName || 'Business'} - ${documentType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}`,
      variables,
    });
  };

  const processPreview = (content: string) => {
    if (!content) return '';
    
    let processed = content;
    
    const variables = {
      businessName: businessInfo.businessName || '[Business Name]',
      contactEmail: businessInfo.contactEmail || '[Contact Email]',
      websiteUrl: businessInfo.websiteUrl || '[Website URL]',
      currentDate: new Date().toLocaleDateString(),
      ...policyInfo
    };
    
    // Simple variable replacement
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
    
    // Process conditional blocks
    processed = processed.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
      return variables[condition as keyof typeof variables] ? content : '';
    });
    
    // Clean up remaining template tags
    processed = processed.replace(/{{.*?}}/g, '');
    
    return processed;
  };

  const selectedTemplate = templates.find((t: Template) => 
    t.platformId === selectedPlatform && t.type === documentType
  );

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
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

      {/* Document Type Selection */}
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Steps */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{stepTitles[currentStep]}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Platform Selection */}
              {currentStep === 'platform' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Choose the platform where you'll be using your legal documents
                  </p>
                  
                  <div className="grid md:grid-cols-1 gap-4">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`platform-card ${
                          selectedPlatform === platform.id ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedPlatform(platform.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <i className={`${platform.icon} text-2xl ${
                            selectedPlatform === platform.id 
                              ? 'text-primary' 
                              : 'text-gray-400'
                          }`}></i>
                          <div>
                            <div className="font-medium text-gray-900">
                              {platform.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {platform.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Information */}
              {currentStep === 'business' && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Tell us about your business so we can customize your legal documents
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Your business name"
                        value={businessInfo.businessName || ''}
                        onChange={(e) => updateBusinessInfo('businessName', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@yourbusiness.com"
                        value={businessInfo.contactEmail || ''}
                        onChange={(e) => updateBusinessInfo('contactEmail', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://yourbusiness.com"
                        value={businessInfo.websiteUrl || ''}
                        onChange={(e) => updateBusinessInfo('websiteUrl', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessLocation">Business Location</Label>
                      <Select 
                        value={businessInfo.businessLocation || ''} 
                        onValueChange={(value) => updateBusinessInfo('businessLocation', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your business location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="united_states">United States</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                          <SelectItem value="european_union">European Union</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="productTypes">What do you sell?</Label>
                      <Input
                        id="productTypes"
                        placeholder="e.g., Digital downloads, Templates, Courses"
                        value={businessInfo.productTypes || ''}
                        onChange={(e) => updateBusinessInfo('productTypes', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Policy */}
              {currentStep === 'policy' && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    {documentType === 'privacy' 
                      ? 'Tell us about the data you collect and how you use it'
                      : 'Configure your terms of service and business policies'
                    }
                  </p>
                  
                  <div className="space-y-6">
                    {documentType === 'privacy' && (
                      <>
                        <div>
                          <Label className="text-base font-medium">What data do you collect?</Label>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="collectsEmail"
                                checked={policyInfo.collectsEmail || false}
                                onCheckedChange={(checked) => updatePolicyInfo('collectsEmail', checked)}
                              />
                              <Label htmlFor="collectsEmail" className="font-normal">
                                Email addresses
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="collectsPurchaseHistory"
                                checked={policyInfo.collectsPurchaseHistory || false}
                                onCheckedChange={(checked) => updatePolicyInfo('collectsPurchaseHistory', checked)}
                              />
                              <Label htmlFor="collectsPurchaseHistory" className="font-normal">
                                Purchase history and transaction details
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="collectsAnalytics"
                                checked={policyInfo.collectsAnalytics || false}
                                onCheckedChange={(checked) => updatePolicyInfo('collectsAnalytics', checked)}
                              />
                              <Label htmlFor="collectsAnalytics" className="font-normal">
                                Website analytics and cookies
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-medium">Compliance Requirements</Label>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="gdprApplies"
                                checked={policyInfo.gdprApplies || false}
                                onCheckedChange={(checked) => updatePolicyInfo('gdprApplies', checked)}
                              />
                              <Label htmlFor="gdprApplies" className="font-normal">
                                GDPR compliance (EU customers)
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="ccpaApplies"
                                checked={policyInfo.ccpaApplies || false}
                                onCheckedChange={(checked) => updatePolicyInfo('ccpaApplies', checked)}
                              />
                              <Label htmlFor="ccpaApplies" className="font-normal">
                                CCPA compliance (California customers)
                              </Label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {documentType === 'terms' && (
                      <>
                        <div>
                          <Label htmlFor="refundPolicy">Refund Policy</Label>
                          <Select 
                            value={policyInfo.refundPolicy || ''} 
                            onValueChange={(value) => updatePolicyInfo('refundPolicy', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select your refund policy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30_day">30-day money back guarantee</SelectItem>
                              <SelectItem value="14_day">14-day refund policy</SelectItem>
                              <SelectItem value="7_day">7-day refund policy</SelectItem>
                              <SelectItem value="no_refunds">No refunds (all sales final)</SelectItem>
                              <SelectItem value="custom">Custom refund policy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-base font-medium">Service Features</Label>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="offersServices"
                                checked={policyInfo.offersServices || false}
                                onCheckedChange={(checked) => updatePolicyInfo('offersServices', checked)}
                              />
                              <Label htmlFor="offersServices" className="font-normal">
                                I offer services in addition to products
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="offersTemplates"
                                checked={policyInfo.offersTemplates || false}
                                onCheckedChange={(checked) => updatePolicyInfo('offersTemplates', checked)}
                              />
                              <Label htmlFor="offersTemplates" className="font-normal">
                                I sell templates or digital downloads
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="membershipSite"
                                checked={policyInfo.membershipSite || false}
                                onCheckedChange={(checked) => updatePolicyInfo('membershipSite', checked)}
                              />
                              <Label htmlFor="membershipSite" className="font-normal">
                                I run a membership or subscription site
                              </Label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Preview & Generate */}
              {currentStep === 'preview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Platform</h3>
                    <p className="text-gray-600">
                      {platforms.find((p: Platform) => p.id === selectedPlatform)?.displayName}
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
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
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
          <Card className="document-preview">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Document Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={documentType === 'terms' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDocumentType('terms')}
                  >
                    Terms
                  </Button>
                  <Button
                    variant={documentType === 'privacy' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDocumentType('privacy')}
                  >
                    Privacy
                  </Button>
                </div>
              </div>
              {selectedTemplate?.isPremium && (
                <Badge variant="secondary" className="w-fit">
                  <i className="fas fa-crown mr-1"></i>
                  Pro Template
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto p-6">
                {selectedTemplate ? (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ 
                      __html: processPreview(selectedTemplate.content)
                        .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-gray-900 mb-3">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-gray-900 mb-2">$1</h2>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p class="mb-3">')
                        .replace(/\n/g, '<br>')
                    }} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-file-alt text-gray-400 text-xl"></i>
                    </div>
                    <p className="text-gray-500">
                      {selectedPlatform 
                        ? 'Preview will appear here as you fill out the form'
                        : 'Select a platform to see a preview'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {selectedTemplate && (
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    This is a preview. The final document will include all your information.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

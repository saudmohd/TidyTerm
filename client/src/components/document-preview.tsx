import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentPreviewProps {
  selectedPlatform: string;
  documentType: 'terms' | 'privacy';
  businessInfo: Record<string, any>;
  policyInfo: Record<string, any>;
  templates: any[];
}

export default function DocumentPreview({
  selectedPlatform,
  documentType,
  businessInfo,
  policyInfo,
  templates
}: DocumentPreviewProps) {
  const template = templates.find((t: any) => 
    t.platformId === selectedPlatform && t.type === documentType
  );

  const processPreview = (content: string) => {
    if (!content) return '';
    
    let processed = content;
    
    // Replace variables with actual values or placeholders
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
    
    // Process conditional blocks (simplified)
    processed = processed.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
      return variables[condition as keyof typeof variables] ? content : '';
    });
    
    // Clean up remaining template tags
    processed = processed.replace(/{{.*?}}/g, '');
    
    // Convert markdown-like syntax to HTML
    processed = processed
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mb-3">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^\n/, '<p class="mb-4">')
      .replace(/\n$/, '</p>');
    
    return processed;
  };

  return (
    <Card className="document-preview">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Document Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={documentType === 'terms' ? 'default' : 'ghost'}
              size="sm"
            >
              Terms
            </Button>
            <Button
              variant={documentType === 'privacy' ? 'default' : 'ghost'}
              size="sm"
            >
              Privacy
            </Button>
          </div>
        </div>
        {template?.isPremium && (
          <Badge variant="secondary" className="w-fit">
            <i className="fas fa-crown mr-1"></i>
            Pro Template
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto p-6">
          {template ? (
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: processPreview(template.content) 
              }}
            />
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
        
        {template && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              This is a preview. The final document will include all your information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

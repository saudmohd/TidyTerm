import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentView() {
  const [match, params] = useRoute("/document/:shareToken");
  const shareToken = params?.shareToken;

  const { data: document, isLoading, error } = useQuery({
    queryKey: [`/api/public/documents/${shareToken}`],
    enabled: !!shareToken,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Document Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The document you're looking for doesn't exist or is no longer available.
            </p>
            <Button asChild>
              <a href="/">Go to Homepage</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const downloadAsHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([document.content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    // Could add a toast here if we had access to it
    alert('Embed code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {document.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(document.updatedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyEmbedCode}
              >
                <i className="fas fa-code mr-2"></i>
                Embed
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsHTML}
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </Button>
              
              <div className="text-sm text-gray-500">
                <i className="fas fa-eye mr-1"></i>
                {document.viewCount || 0} views
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: document.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, match => {
                  const level = match.trim().length;
                  return `<h${level} class="text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'} font-bold text-gray-900 mt-6 mb-3">`;
                }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </CardContent>
        </Card>

        {/* Powered by TidyTerms */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a 
              href="/" 
              className="text-primary hover:text-primary/80 font-medium"
            >
              TidyTerms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

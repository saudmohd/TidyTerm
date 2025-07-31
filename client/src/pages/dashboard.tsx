import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['/api/documents'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest('DELETE', `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Document Deleted",
        description: "The document has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const copyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}/document/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard.",
    });
  };

  const totalViews = documents.reduce((sum: number, doc: any) => sum + (doc.viewCount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Documents
            </h1>
            <p className="text-gray-600">
              Manage your Terms of Service and Privacy Policies
            </p>
          </div>
          <Button onClick={() => setLocation('/generate')}>
            <i className="fas fa-plus mr-2"></i>
            New Document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <i className="fas fa-file-contract text-blue-500 mr-2"></i>
                Active Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {documents.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <i className="fas fa-eye text-green-500 mr-2"></i>
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {totalViews.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <i className="fas fa-crown text-purple-500 mr-2"></i>
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {user?.subscriptionStatus === 'active' ? 'Pro' : 'Free'}
              </div>
              {user?.subscriptionStatus !== 'active' && (
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setLocation('/subscribe')}
                >
                  Upgrade
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === 'terms' 
                          ? 'bg-blue-100' 
                          : 'bg-purple-100'
                      }`}>
                        <i className={`fas ${
                          doc.type === 'terms' 
                            ? 'fa-file-contract text-blue-500' 
                            : 'fa-user-shield text-purple-500'
                        }`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            Updated {new Date(doc.updatedAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary">
                            Active
                          </Badge>
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-eye mr-1"></i>
                            {doc.viewCount || 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShareLink(doc.shareToken)}
                        title="Copy Share Link"
                      >
                        <i className="fas fa-link text-gray-400"></i>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const element = document.createElement('a');
                          const file = new Blob([doc.content], { type: 'text/html' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${doc.title}.html`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        title="Download"
                      >
                        <i className="fas fa-download text-gray-400"></i>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(`/document/${doc.shareToken}`)}
                        title="View Document"
                      >
                        <i className="fas fa-external-link-alt text-gray-400"></i>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this document?')) {
                            deleteMutation.mutate(doc.id);
                          }
                        }}
                        title="Delete"
                        disabled={deleteMutation.isPending}
                      >
                        <i className="fas fa-trash text-red-400"></i>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-contract text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No documents yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first legal document to get started
              </p>
              <Button onClick={() => setLocation('/generate')}>
                <i className="fas fa-plus mr-2"></i>
                Create Your First Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

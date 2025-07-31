import { useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/documents'],
  });

  const { data: platforms = [] } = useQuery({
    queryKey: ['/api/platforms'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Creator'}!
          </h1>
          <p className="text-gray-600">
            Manage your legal documents and generate new ones for your platforms.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {documents.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {documents.reduce((sum: number, doc: any) => sum + (doc.viewCount || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
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

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Documents</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation('/dashboard')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.slice(0, 3).map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className={`fas ${doc.type === 'terms' ? 'fa-file-contract' : 'fa-user-shield'} text-primary text-sm`}></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{doc.title}</div>
                          <div className="text-sm text-gray-500">
                            {doc.viewCount || 0} views
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-external-link-alt text-gray-400"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-file-contract text-gray-400 text-xl"></i>
                  </div>
                  <p className="text-gray-500 mb-4">No documents yet</p>
                  <Button onClick={() => setLocation('/generate')}>
                    Create Your First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate New Document */}
          <Card>
            <CardHeader>
              <CardTitle>Generate New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Create legal documents tailored for your platform
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform: any) => (
                    <div key={platform.id} className="platform-card text-center">
                      <i className={`${platform.icon} text-gray-400 text-2xl mb-2`}></i>
                      <div className="text-sm font-medium text-gray-700">
                        {platform.displayName}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setLocation('/generate')}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Start Generator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

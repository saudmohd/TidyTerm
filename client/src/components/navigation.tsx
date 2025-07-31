import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-contract text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-gray-900">TidyTerms</span>
              </div>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-8">
                  <Link 
                    href="/dashboard" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === '/dashboard' 
                        ? 'text-primary' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/generate" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === '/generate' 
                        ? 'text-primary' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Generate
                  </Link>
                  {user?.subscriptionStatus !== 'active' && (
                    <Link 
                      href="/subscribe" 
                      className="text-secondary-500 hover:text-secondary-600 px-3 py-2 text-sm font-medium"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <a href="/api/login">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/api/login">Start Free Trial</a>
                </Button>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {user?.firstName || user?.email}
                  </span>
                </div>
                <Button variant="ghost" asChild>
                  <a href="/api/logout">Sign Out</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

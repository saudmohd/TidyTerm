import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Legal Documents Made Simple for <span className="text-primary">Creators</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate professional Terms of Service and Privacy Policies tailored for your Gumroad, Carrd, or Notion business in minutes, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild>
                  <a href="/api/login">Generate My Documents</a>
                </Button>
                <Button variant="outline" size="lg">
                  <i className="fas fa-play mr-2"></i>Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>No legal knowledge required</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Ready in 5 minutes</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Platform-specific templates</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-2xl">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-500 ml-4">Terms of Service Generator</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Platform Selection</h3>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-check text-green-600 text-xs"></i>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-primary bg-blue-50 rounded-lg p-3 text-center">
                        <i className="fas fa-shopping-bag text-primary mb-2"></i>
                        <div className="text-xs font-medium">Gumroad</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 text-center">
                        <i className="fas fa-globe text-gray-400 mb-2"></i>
                        <div className="text-xs text-gray-500">Carrd</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 text-center">
                        <i className="fas fa-file-alt text-gray-400 mb-2"></i>
                        <div className="text-xs text-gray-500">Notion</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Compliant
            </h2>
            <p className="text-xl text-gray-600">
              Built specifically for creators selling on modern platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-cogs text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform-Specific Templates</h3>
              <p className="text-gray-600">Tailored legal language for Gumroad, Carrd, Notion, and other creator platforms with their specific requirements.</p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-code text-secondary-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Embeddable Snippets</h3>
              <p className="text-gray-600">Get clean HTML snippets and shareable links to easily add your legal documents anywhere on your site.</p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-sync-alt text-green-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Auto-Updates</h3>
              <p className="text-gray-600">When laws change or you update your business details, we'll regenerate your documents automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more documents
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="pricing-card">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
                <div className="text-gray-500">Forever free</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">2 document generations per month</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Basic platform templates</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">HTML & PDF downloads</span>
                </li>
              </ul>
              
              <Button variant="outline" size="lg" className="w-full" asChild>
                <a href="/api/login">Get Started Free</a>
              </Button>
            </div>

            <div className="pricing-card featured">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$19</div>
                <div className="text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Unlimited document generations</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">All platform templates</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Automatic updates</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-gray-700">Custom branding</span>
                </li>
              </ul>
              
              <Button size="lg" className="w-full" asChild>
                <a href="/api/login">Start 14-Day Free Trial</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Your Legal Documents Sorted?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who've simplified their legal compliance with TidyTerms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/api/login">Start Free Trial</a>
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-file-contract text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold">TidyTerms</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Legal documents made simple for creators. Generate professional Terms of Service and Privacy Policies in minutes, not hours.
            </p>
            <div className="text-gray-400 text-sm">
              © 2024 TidyTerms. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

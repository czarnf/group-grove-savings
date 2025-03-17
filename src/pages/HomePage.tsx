
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, CircleDollarSign, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Group Savings Made Simple
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                Pool funds with friends, family, or colleagues and distribute on a rotating basis.
                An easier way to save together.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed">
              Our platform simplifies group savings with a transparent, fair and secure process for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
              <div className="p-2 bg-brand-primary/10 rounded-full">
                <Users className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold">Create or Join a Group</h3>
              <p className="text-gray-500 text-center">
                Start your own savings group or join an existing one. Set contribution amounts and frequency.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
              <div className="p-2 bg-brand-secondary/10 rounded-full">
                <CircleDollarSign className="h-6 w-6 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold">Select Your Number</h3>
              <p className="text-gray-500 text-center">
                Each member chooses a unique number from the pool for the distribution selection process.
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-white">
              <div className="p-2 bg-brand-accent/10 rounded-full">
                <CalendarClock className="h-6 w-6 text-brand-accent" />
              </div>
              <h3 className="text-xl font-bold">Receive on Rotation</h3>
              <p className="text-gray-500 text-center">
                Each cycle, one member receives the full pot. Everyone gets a turn before the cycle resets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose GroupGrove?
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed">
                Our platform provides a secure and transparent way to save money with people you trust.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                  <span>Fair distribution with transparent number selection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                  <span>Automated reminders for contributions and distributions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                  <span>Detailed tracking of all group activities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                  <span>Mobile-friendly design for savings on the go</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                  <span>Secure platform with privacy built-in</span>
                </li>
              </ul>
              
              <div className="pt-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                    Start Saving Today
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="People saving together"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Start Saving Together?
              </h2>
              <p className="mx-auto max-w-[600px] text-lg">
                Join thousands of people who are already using GroupGrove to achieve their financial goals through collective saving.
              </p>
            </div>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">GroupGrove</h3>
              <p className="text-sm">
                Empowering communities through collaborative savings.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm hover:text-white">About Us</a></li>
                <li><a href="#" className="text-sm hover:text-white">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm hover:text-white">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-sm hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-sm hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-sm hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-sm hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} GroupGrove. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

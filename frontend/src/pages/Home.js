import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-black/60 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1691435828932-911a7801adfb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxzZXJ2ZXIlMjByb29tJTIwZGFyayUyMGJsdWV8ZW58MHx8fHwxNzc2MzI3NzI4fDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-500 mb-6" data-testid="hero-overline">ACGC Assessment Platform</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-50 mb-6" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="hero-heading">
              Leading Australia's Cyber Community
            </h1>
            <p className="text-base text-zinc-300 leading-relaxed mb-8 max-w-2xl" data-testid="hero-description">
              Creating solutions by championing collaboration, innovation, entrepreneurship and enterprise. Access professional cyber security assessments and training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="hero-cta-login"
              >
                Access Assessment Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="hero-cta-learn"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-500 mb-4">Our Platform</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>
              Professional Assessment Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm hover:border-zinc-700 transition-colors duration-150" data-testid="feature-secure">
              <Shield className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-zinc-100 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Secure Assessments</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Industry-standard security protocols ensure the integrity of all assessments and protect candidate data.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm hover:border-zinc-700 transition-colors duration-150" data-testid="feature-certified">
              <Award className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-zinc-100 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Certified Programs</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Access to IRAP-compliant training and assessment programs recognized across Australia.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm hover:border-zinc-700 transition-colors duration-150" data-testid="feature-support">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-zinc-100 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Expert Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Dedicated support team to assist candidates and administrators throughout the assessment process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-50 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>
            Ready to Get Started?
          </h2>
          <p className="text-base text-zinc-400 mb-8">
            If you have received a link to access an assessment, please login to begin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm transition-colors duration-150"
              data-testid="cta-login"
            >
              Login to Portal
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 px-6 py-3 rounded-sm transition-colors duration-150"
              data-testid="cta-contact"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

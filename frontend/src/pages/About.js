import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-4">About Us</div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="about-heading">
              Australian Cyber Collaboration Centre
            </h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
              We are dedicated to leading the creation and sustainability of Australia's cyber community, creating solutions by championing collaboration, innovation, entrepreneurship and enterprise.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}}>
                  Our Mission
                </h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  The Australian Cyber Collaboration Centre is at the forefront of cyber security education and assessment in Australia. We provide comprehensive training programs and assessment services that meet the highest industry standards.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Our platform enables organizations to conduct secure, reliable assessments for cyber security professionals, ensuring they meet the rigorous requirements of IRAP and other certification programs.
                </p>
              </div>
              <div className="relative h-64 lg:h-auto rounded-sm overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1758518731706-be5d5230e5a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBwcm9mZXNzaW9uYWxzJTIwbWVldGluZ3xlbnwwfHx8fDE3NzYzMjc3NDR8MA&ixlib=rb-4.1.0&q=85"
                  alt="Professional team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="value-innovation">
                <Building2 className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Innovation</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We continuously innovate our assessment platform to provide the most effective and secure testing environment.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="value-excellence">
                <Target className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Excellence</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our commitment to excellence ensures that every assessment meets the highest standards of quality and integrity.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="value-community">
                <Heart className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>Community</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Building a strong cyber security community through collaboration and shared knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>
                Find Us
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                The Centre is located at Lot Fourteen in the heart of Adelaide, a city recognized as one of the world's most progressive places.
              </p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-sm max-w-2xl mx-auto">
              <p className="text-base text-gray-600 mb-2"><strong className="text-gray-900">Address:</strong></p>
              <p className="text-sm text-gray-500 mb-4">Ground Floor, TechCentral Building<br />Lot Fourteen, Frome Road<br />Adelaide SA 5000</p>
              <p className="text-base text-gray-600 mb-2"><strong className="text-gray-900">Phone:</strong></p>
              <p className="text-sm text-gray-500">+61 8 8155 5320</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

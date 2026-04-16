import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, BookOpen, Award, FileCheck, Users2, GraduationCap } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Shield,
      title: 'IRAP Assessment',
      description: 'Comprehensive Information Security Registered Assessors Program (IRAP) assessments conducted by certified professionals.',
      features: ['Security assessments', 'Compliance verification', 'Risk analysis', 'Detailed reporting']
    },
    {
      icon: GraduationCap,
      title: 'Training Programs',
      description: 'Industry-leading cyber security training programs designed to meet Australian standards and international best practices.',
      features: ['Hands-on learning', 'Expert instructors', 'Flexible scheduling', 'Online and in-person']
    },
    {
      icon: Award,
      title: 'Certification Services',
      description: 'Professional certification programs that validate cyber security expertise and compliance with industry standards.',
      features: ['Industry recognition', 'Career advancement', 'Skill validation', 'Continuing education']
    },
    {
      icon: FileCheck,
      title: 'Assessment Platform',
      description: 'Secure online assessment platform for conducting professional cyber security examinations and evaluations.',
      features: ['Secure testing environment', 'Automated scoring', 'Real-time monitoring', 'Detailed analytics']
    },
    {
      icon: Users2,
      title: 'Corporate Solutions',
      description: 'Tailored assessment and training solutions for organizations seeking to upskill their cyber security teams.',
      features: ['Bulk registration', 'Custom assessments', 'Progress tracking', 'Team management']
    },
    {
      icon: BookOpen,
      title: 'Consulting Services',
      description: 'Expert consulting services to help organizations navigate cyber security challenges and compliance requirements.',
      features: ['Strategic planning', 'Policy development', 'Compliance guidance', 'Risk management']
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-4">Our Services</div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="services-heading">
              Professional Cyber Security Services
            </h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
              Comprehensive assessment, training, and certification services designed to meet the highest standards in cyber security education and compliance.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 p-6 rounded-sm hover:border-gray-300 hover:shadow-sm transition-all duration-150"
                    data-testid={`service-${index}`}
                  >
                    <Icon className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-3" style={{fontFamily: 'Outfit, sans-serif'}}>
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1 h-1 bg-blue-600 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>
              Ready to Begin Your Assessment?
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Access our secure assessment platform or contact us to learn more about our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="cta-access-platform"
              >
                Access Platform
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="cta-contact-us"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

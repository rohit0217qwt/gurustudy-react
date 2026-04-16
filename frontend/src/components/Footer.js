import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>ACGC</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Leading the creation and sustainability of Australia's cyber community through innovation and collaboration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-zinc-100 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Home</Link></li>
              <li><Link to="/about" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">About</Link></li>
              <li><Link to="/services" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Services</Link></li>
              <li><Link to="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors duration-150">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-medium text-zinc-100 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Services</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-zinc-400">IRAP Assessment</span></li>
              <li><span className="text-sm text-zinc-400">Training Programs</span></li>
              <li><span className="text-sm text-zinc-400">Certification</span></li>
              <li><span className="text-sm text-zinc-400">Consulting</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-zinc-100 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-400">Lot Fourteen, Frome Road<br />Adelaide SA 5000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-zinc-400">+61 8 8155 5320</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-zinc-400">info@acgc.com.au</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Australian Cyber Collaboration Centre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

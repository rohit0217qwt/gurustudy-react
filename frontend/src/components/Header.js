import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../App';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="bg-blue-600 p-2 rounded-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight" style={{fontFamily: 'Outfit, sans-serif'}}>ACGC Assessment</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150" data-testid="nav-home">Home</Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150" data-testid="nav-about">About</Link>
            <Link to="/services" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150" data-testid="nav-services">Services</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150" data-testid="nav-contact">Contact</Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout} 
                  className="text-sm bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-gray-900 text-gray-600 px-4 py-2 rounded-sm transition-colors duration-150"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm transition-colors duration-150"
                data-testid="nav-login"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-500 hover:text-gray-900"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-gray-200" data-testid="mobile-menu">
            <Link to="/" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">Home</Link>
            <Link to="/about" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">About</Link>
            <Link to="/services" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">Services</Link>
            <Link to="/contact" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">Contact</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">
                  Dashboard
                </Link>
                <button onClick={logout} className="block w-full text-left text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-center transition-colors duration-150">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

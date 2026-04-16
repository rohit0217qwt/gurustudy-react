import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { Mail, User, MessageSquare, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API}/contact`, formData);
      setStatus({ type: 'success', message: 'Thank you for your message. We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-4">Contact Us</div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="contact-heading">
              Get in Touch
            </h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
              Have questions about our assessment platform or services? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}}>
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                      placeholder="Your name"
                      data-testid="contact-name-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none transition-colors duration-150"
                      placeholder="your.email@example.com"
                      data-testid="contact-email-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-600 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none transition-colors duration-150 resize-none"
                      placeholder="How can we help you?"
                      data-testid="contact-message-input"
                    />
                  </div>

                  {status.message && (
                    <div 
                      className={`p-4 rounded-sm border ${
                        status.type === 'success' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                      data-testid="contact-status-message"
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-sm transition-colors duration-150 flex items-center justify-center gap-2"
                    data-testid="contact-submit-button"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}}>
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Location</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Ground Floor, TechCentral Building<br />
                      Lot Fourteen, Frome Road<br />
                      Adelaide SA 5000<br />
                      Australia
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Phone</h3>
                    <p className="text-sm text-gray-500">
                      +61 8 8155 5320
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Email</h3>
                    <p className="text-sm text-gray-500">
                      info@acgc.com.au
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Business Hours</h3>
                    <p className="text-sm text-gray-500">
                      Monday - Friday: 9:00 AM - 5:00 PM ACST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

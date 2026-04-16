import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Calendar, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/user/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'text-green-600';
      case 'missed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-2">Student Portal</div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-2" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="dashboard-heading">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-gray-500">Manage your assessments and view your progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-total">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total Assessments</p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-completed">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Completed</p>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-pending">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.filter(r => r.status === 'registered').length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>

          {/* Assessments List */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>My Assessments</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm font-mono uppercase tracking-wider">LOADING...</div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No assessments assigned yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Assessment</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Version</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Exam Date</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Score</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((reg, index) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors duration-150" data-testid={`assessment-row-${index}`}>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.assessment_title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{reg.exam_version}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(reg.exam_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(reg.status)}
                            <span className={`text-sm font-medium ${getStatusColor(reg.status)} capitalize`}>
                              {reg.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {reg.score !== null ? `${reg.score}%` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          {reg.status === 'registered' && (
                            <Link 
                              to={`/assessment/${reg.assessment_id}`}
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-sm transition-colors duration-150"
                              data-testid={`start-assessment-${index}`}
                            >
                              <PlayCircle className="w-4 h-4" />
                              Start
                            </Link>
                          )}
                          {reg.status === 'completed' && (
                            <span className="text-sm text-gray-400">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'text-green-500';
      case 'missed':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-500 mb-2">Student Portal</div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-2" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="dashboard-heading">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-zinc-400">Manage your assessments and view your progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm" data-testid="stat-total">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-semibold text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.length}
                </span>
              </div>
              <p className="text-sm text-zinc-400">Total Assessments</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm" data-testid="stat-completed">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-semibold text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <p className="text-sm text-zinc-400">Completed</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm" data-testid="stat-pending">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-semibold text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>
                  {registrations.filter(r => r.status === 'registered').length}
                </span>
              </div>
              <p className="text-sm text-zinc-400">Pending</p>
            </div>
          </div>

          {/* Assessments List */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="text-xl font-medium text-zinc-50" style={{fontFamily: 'Outfit, sans-serif'}}>My Assessments</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-zinc-400 text-sm font-mono uppercase tracking-wider">LOADING...</div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-zinc-400">No assessments assigned yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-950 border-b border-zinc-800">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Assessment</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Version</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Exam Date</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Score</th>
                      <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {registrations.map((reg, index) => (
                      <tr key={reg.id} className="hover:bg-zinc-950/50 transition-colors duration-150" data-testid={`assessment-row-${index}`}>
                        <td className="px-6 py-4 text-sm text-zinc-300">{reg.assessment_title}</td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{reg.exam_version}</td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
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
                        <td className="px-6 py-4 text-sm text-zinc-300">
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
                            <span className="text-sm text-zinc-500">Completed</span>
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

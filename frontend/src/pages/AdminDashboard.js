import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Plus, Users, FileText, Calendar, Upload } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [assessments, setAssessments] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create Assessment State
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    version: '',
    duration_minutes: 60,
    available_from: '',
    available_until: '',
    questions: []
  });

  // Bulk Registration State
  const [bulkCandidates, setBulkCandidates] = useState([
    { name: '', email: '', assessment_id: '', exam_date: '' }
  ]);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'assessments') {
      fetchAssessments();
    }
    if (activeTab === 'overview' || activeTab === 'candidates') {
      fetchRegistrations();
    }
  }, [activeTab]);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/assessments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessments(response.data);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/admin/assessments`, newAssessment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Assessment created successfully');
      setNewAssessment({
        title: '',
        description: '',
        version: '',
        duration_minutes: 60,
        available_from: '',
        available_until: '',
        questions: []
      });
      fetchAssessments();
      setActiveTab('assessments');
    } catch (error) {
      alert('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/admin/bulk-register`,
        { candidates: bulkCandidates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Candidates registered successfully');
      setBulkCandidates([{ name: '', email: '', assessment_id: '', exam_date: '' }]);
      fetchRegistrations();
    } catch (error) {
      alert('Failed to register candidates');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setNewAssessment({
      ...newAssessment,
      questions: [...newAssessment.questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...newAssessment.questions];
    updated[index] = { ...updated[index], [field]: value };
    setNewAssessment({ ...newAssessment, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...newAssessment.questions];
    updated[qIndex].options[oIndex] = value;
    setNewAssessment({ ...newAssessment, questions: updated });
  };

  const addCandidate = () => {
    setBulkCandidates([...bulkCandidates, { name: '', email: '', assessment_id: '', exam_date: '' }]);
  };

  const updateCandidate = (index, field, value) => {
    const updated = [...bulkCandidates];
    updated[index] = { ...updated[index], [field]: value };
    setBulkCandidates(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-blue-600 mb-2">Admin Portal</div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-2" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="admin-heading">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Manage assessments, candidates, and registrations</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-6 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'assessments', label: 'Assessments' },
                { key: 'create', label: 'Create Assessment' },
                { key: 'bulk-register', label: 'Bulk Register' },
                { key: 'candidates', label: 'Candidates' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 border-b-2 transition-colors duration-150 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                  data-testid={`tab-${tab.key}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-total-assessments">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                      {assessments.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Total Assessments</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-total-registrations">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                      {registrations.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Total Registrations</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-sm" data-testid="stat-completed-assessments">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>
                      {registrations.filter(r => r.status === 'completed').length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('create')}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 hover:border-gray-300 p-4 rounded-sm transition-colors duration-150 text-left"
                    data-testid="quick-action-create"
                  >
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Create New Assessment</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bulk-register')}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 hover:border-gray-300 p-4 rounded-sm transition-colors duration-150 text-left"
                    data-testid="quick-action-bulk"
                  >
                    <Upload className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Bulk Register Candidates</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>All Assessments</h2>
              </div>
              {assessments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No assessments created yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Title</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Version</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Questions</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Duration</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Available Until</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assessments.map((assessment, index) => (
                        <tr key={assessment.id} className="hover:bg-gray-50 transition-colors duration-150" data-testid={`assessment-${index}`}>
                          <td className="px-6 py-4 text-sm text-gray-700">{assessment.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{assessment.version}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{assessment.questions.length}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{assessment.duration_minutes} min</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(assessment.available_until).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}}>Create New Assessment</h2>
              <form onSubmit={handleCreateAssessment} className="space-y-6" data-testid="create-assessment-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Title</label>
                    <input
                      type="text"
                      value={newAssessment.title}
                      onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none"
                      data-testid="assessment-title-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Version</label>
                    <input
                      type="text"
                      value={newAssessment.version}
                      onChange={(e) => setNewAssessment({ ...newAssessment, version: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none"
                      data-testid="assessment-version-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Description</label>
                  <textarea
                    value={newAssessment.description}
                    onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none resize-none"
                    data-testid="assessment-description-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newAssessment.duration_minutes}
                      onChange={(e) => setNewAssessment({ ...newAssessment, duration_minutes: parseInt(e.target.value) })}
                      required
                      min="1"
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none"
                      data-testid="assessment-duration-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Available From</label>
                    <input
                      type="datetime-local"
                      value={newAssessment.available_from}
                      onChange={(e) => setNewAssessment({ ...newAssessment, available_from: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none"
                      data-testid="assessment-from-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Available Until</label>
                    <input
                      type="datetime-local"
                      value={newAssessment.available_until}
                      onChange={(e) => setNewAssessment({ ...newAssessment, available_until: e.target.value })}
                      required
                      className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 focus:ring-offset-white text-gray-900 px-4 py-3 rounded-sm outline-none"
                      data-testid="assessment-until-input"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>Questions</h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-sm transition-colors duration-150"
                      data-testid="add-question-button"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  {newAssessment.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 border border-gray-200 p-4 rounded-sm mb-4" data-testid={`question-${qIndex}`}>
                      <label className="block text-sm text-gray-600 mb-2">Question {qIndex + 1}</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none mb-4"
                      />
                      
                      <div className="space-y-2 mb-3">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correct_answer === oIndex}
                              onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              required
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1 bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">Select the correct answer by clicking the radio button</p>
                    </div>
                  ))}

                  {newAssessment.questions.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">No questions added yet. Click "Add Question" to begin.</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || newAssessment.questions.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                  data-testid="create-assessment-submit"
                >
                  {loading ? 'Creating...' : 'Create Assessment'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'bulk-register' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6" style={{fontFamily: 'Outfit, sans-serif'}}>Bulk Register Candidates</h2>
              <form onSubmit={handleBulkRegister} className="space-y-6" data-testid="bulk-register-form">
                {bulkCandidates.map((candidate, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-sm" data-testid={`candidate-${index}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Name</label>
                        <input
                          type="text"
                          value={candidate.name}
                          onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                          required
                          className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Email</label>
                        <input
                          type="email"
                          value={candidate.email}
                          onChange={(e) => updateCandidate(index, 'email', e.target.value)}
                          required
                          className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Assessment</label>
                        <select
                          value={candidate.assessment_id}
                          onChange={(e) => updateCandidate(index, 'assessment_id', e.target.value)}
                          required
                          className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none"
                        >
                          <option value="">Select Assessment</option>
                          {assessments.map((a) => (
                            <option key={a.id} value={a.id}>{a.title} - {a.version}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Exam Date</label>
                        <input
                          type="datetime-local"
                          value={candidate.exam_date}
                          onChange={(e) => updateCandidate(index, 'exam_date', e.target.value)}
                          required
                          className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 px-4 py-2 rounded-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCandidate}
                  className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-600 px-4 py-3 rounded-sm transition-colors duration-150 flex items-center justify-center gap-2"
                  data-testid="add-candidate-button"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Candidate
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                  data-testid="bulk-register-submit"
                >
                  {loading ? 'Registering...' : 'Register All Candidates'}
                </button>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                  <p className="text-xs text-gray-500 mb-2">Note: Default password for new candidates is <code className="text-blue-600 font-mono">Password123</code></p>
                  <p className="text-xs text-gray-400">Email notifications will be sent to all registered candidates.</p>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900" style={{fontFamily: 'Outfit, sans-serif'}}>All Candidates</h2>
              </div>
              {registrations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No candidates registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Assessment</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Exam Date</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-mono uppercase tracking-wider text-gray-400">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registrations.map((reg, index) => (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors duration-150" data-testid={`candidate-${index}`}>
                          <td className="px-6 py-4 text-sm text-gray-700">{reg.user_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{reg.user_email}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{reg.assessment_title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(reg.exam_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium capitalize ${
                              reg.status === 'completed' ? 'text-green-600' :
                              reg.status === 'missed' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {reg.score !== null ? `${reg.score}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

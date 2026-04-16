import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TakeAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchAssessment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/user/assessment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessment(response.data);
      setAnswers(new Array(response.data.questions.length).fill(-1));
      setTimeLeft(response.data.duration_minutes * 60);
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      alert('Failed to load assessment');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/user/submit-assessment`,
        { assessment_id: id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">LOADING...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm text-center" data-testid="assessment-result">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4" style={{fontFamily: 'Outfit, sans-serif'}}>
                Assessment Submitted
              </h1>
              <p className="text-gray-500 mb-8">Your assessment has been submitted successfully.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                  <div className="text-2xl font-semibold text-gray-900 mb-1" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="result-score">
                    {result.score}%
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                  <div className="text-2xl font-semibold text-gray-900 mb-1" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="result-correct">
                    {result.correct}
                  </div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                  <div className="text-2xl font-semibold text-gray-900 mb-1" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="result-total">
                    {result.total}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-sm transition-colors duration-150"
                data-testid="return-dashboard-button"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Assessment Header */}
          <div className="bg-white border border-gray-200 p-6 rounded-sm mb-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2" style={{fontFamily: 'Outfit, sans-serif'}} data-testid="assessment-title">
                  {assessment?.title}
                </h1>
                <p className="text-sm text-gray-500">{assessment?.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-3 rounded-sm" data-testid="timer">
                <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`} />
                <span className={`text-xl font-mono font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-6">
            {assessment?.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white border border-gray-200 p-6 rounded-sm" data-testid={`question-${qIndex}`}>
                <div className="flex gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-sm flex items-center justify-center font-semibold text-sm">
                    {qIndex + 1}
                  </span>
                  <p className="text-gray-800 flex-1">{q.question}</p>
                </div>
                
                <div className="space-y-3 ml-11">
                  {q.options.map((option, oIndex) => (
                    <label 
                      key={oIndex}
                      className="flex items-start gap-3 cursor-pointer group"
                      data-testid={`question-${qIndex}-option-${oIndex}`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={answers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-150">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-white border border-gray-200 p-6 rounded-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Please review your answers before submitting. Once submitted, you cannot change your responses.
                </p>
                <p className="text-sm text-gray-500">
                  Answered: {answers.filter(a => a !== -1).length} / {assessment?.questions.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-sm transition-colors duration-150"
              data-testid="submit-assessment-button"
            >
              {submitted ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

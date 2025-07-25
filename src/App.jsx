import { useState } from 'react';
import './App.css';

const DUMMY_USER = {
  username: 'user',
  password: 'pass123'
};

const QUESTIONS = [
  {
    icon: '🧍‍♂️',
    question: 'How would you describe your grooming and hygiene habits?',
    answers: [
      'I shower daily and dress appropriately for work.',
      'I haven’t bathed in days and don’t care about how I look.'
    ]
  },
  {
    icon: '🧠',
    question: 'Can you tell me the date and where we are right now?',
    answers: [
      `It’s ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}, and we’re in Hyderabad.`,
      `I’m not sure… maybe it’s still ${new Date().toLocaleString('en-IN', { month: 'long' })}?`
    ]
  },
  {
    icon: '🗣️',
    question: 'Is speech clear, coherent, and appropriate in volume and rate?',
    answers: [
      'Normal rate and tone, coherent sentences.',
      'Slurred, rapid, or incoherent speech.'
    ]
  },
  {
    icon: '😐',
    question: 'How have you been feeling emotionally?',
    answers: [
      'I’ve been feeling okay, a bit stressed but managing.',
      'I feel numb all the time. Nothing makes me happy.'
    ]
  },
  {
    icon: '🔄',
    question: 'Can you describe your thoughts lately?',
    answers: [
      'I’ve been thinking about work and planning a vacation.',
      'My thoughts jump around and I can’t focus.'
    ]
  },
  {
    icon: '🔍',
    question: 'Have you had any unusual or disturbing thoughts?',
    answers: [
      'No, nothing out of the ordinary.',
      'I sometimes think people are watching me.'
    ]
  },
  {
    icon: '👁️',
    question: 'Have you seen or heard things others don’t?',
    answers: [
      'No, I haven’t.',
      'I hear voices telling me I’m worthless.'
    ]
  },
  {
    icon: '🧠',
    question: 'Do you think you might need help with your mental health?',
    answers: [
      'Yes, I’ve noticed some changes and want to talk to someone.',
      'No, I’m fine. Everyone else is the problem.'
    ]
  }
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('savedUsername') || '');
  const [password, setPassword] = useState(localStorage.getItem('savedPassword') || '');
  const [savePassword, setSavePassword] = useState(!!localStorage.getItem('savedPassword'));
  const [currentQueue, setCurrentQueue] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
      setLoggedIn(true);
      setShowTerms(true);
      if (savePassword) {
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedPassword');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  // Queue response handler
  const handleResponse = (answer) => {
    setResponses([...responses, answer]);
    setCurrentQueue(currentQueue + 1);
  };

  // Reset for demo
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword(savePassword ? localStorage.getItem('savedPassword') || '' : '');
    setCurrentQueue(0);
    setResponses([]);
  };

  const handleTermsSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setShowTerms(false);
      setLoading(false);
    }, 700);
  };

  // Report view
  if (loggedIn && currentQueue >= QUESTIONS.length) {
    return (
      <div className="container">
        <h2>Report</h2>
        <ul>
          {QUESTIONS.map((q, i) => (
            <li key={i}><strong>{q.icon} {q.question}</strong>: {responses[i]}</li>
          ))}
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // Overlay Terms and Conditions after login, before queue cards
  if (loggedIn && showTerms) {
    return (
      <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="terms-overlay">
          <h2>Acknowledgement</h2>
          <p>By continuing, you acknowledge and accept the following Terms and Conditions:</p>
          <ul style={{textAlign: 'left'}}>
            <li>Your responses are confidential and used only for assessment purposes.</li>
            <li>This is a demo application; do not enter sensitive personal information.</li>
            <li>By submitting, you agree to participate voluntarily.</li>
          </ul>
          <button style={{marginTop: '24px', width: '100%'}} onClick={handleTermsSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit & Continue'}
          </button>
        </div>
      </div>
    );
  }

  // Home/Queue view
  if (loggedIn && !showTerms) {
    const queue = QUESTIONS[currentQueue];
    return (
      <div className="container">
        <h2>Queue {currentQueue + 1} of {QUESTIONS.length}</h2>
        <div className="card" style={{animation: 'fadeIn 0.5s'}}>
          <h3>{queue.icon} {queue.question}</h3>
          {queue.answers.map((ans, idx) => (
            <button key={idx} onClick={() => handleResponse(ans)} style={{margin: '8px'}}>{ans}</button>
          ))}
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{width: '220px'}}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{width: '220px'}}
        />
        <label style={{margin: '8px 0', alignSelf: 'flex-start'}}>
          <input
            type="checkbox"
            checked={savePassword}
            onChange={e => setSavePassword(e.target.checked)}
          />
          Save password in browser
        </label>
        <label style={{margin: '8px 0', alignSelf: 'flex-start'}}>
          <input
            type="checkbox"
            checked={!!localStorage.getItem('savedUsername')}
            onChange={e => {
              if (e.target.checked) {
                localStorage.setItem('savedUsername', username);
              } else {
                localStorage.removeItem('savedUsername');
              }
            }}
          />
          Remember username
        </label>
        <button type="submit" style={{width: '220px'}}>Login</button>
      </form>
    </div>
  );
}

export default App;

import { useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import './App.css'

function App() {
  const [currentForm, setCurrentForm] = useState<'login' | 'signup'>('signup');

  const switchToLogin = () => setCurrentForm('login');
  const switchToSignup = () => setCurrentForm('signup');

  return (
    <div className="App">
      {currentForm === 'login' ? (
        <LoginForm onSwitchToSignup={switchToSignup} />
      ) : (
        <SignupForm onSwitchToLogin={switchToLogin} />
      )}
    </div>
  )
}

export default App

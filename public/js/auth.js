const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authMessage = document.getElementById('auth-message');

function setMessage(type, text) {
  authMessage.classList.remove('error', 'success');
  if (type) authMessage.classList.add(type);
  authMessage.textContent = text || '';
}

if (loginTab && signupTab) {
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    setMessage('', '');
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    setMessage('', '');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('', 'Logging in...');
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage('error', data.message || 'Login failed.');
        return;
      }
      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem('vicare_token', data.token);
        console.log('Token stored in localStorage');
        console.log('Token (first 20 chars):', data.token.substring(0, 20) + '...');
      } else {
        console.error('No token received from server!');
        console.error('Response data:', data);
      }
      setMessage('success', 'Login successful. Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 500);
    } catch (err) {
      setMessage('error', 'Network error while logging in.');
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('', 'Creating your account...');
    const formData = new FormData(signupForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage('error', data.message || 'Sign up failed.');
        return;
      }
      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem('vicare_token', data.token);
        console.log('Token stored in localStorage');
        console.log('Token (first 20 chars):', data.token.substring(0, 20) + '...');
      } else {
        console.error('No token received from server!');
        console.error('Response data:', data);
      }
      setMessage('success', 'Account created! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 500);
    } catch (err) {
      setMessage('error', 'Network error while signing up.');
    }
  });
}

const forgotBtn = document.getElementById('forgot-password-btn');

if (forgotBtn) {
  forgotBtn.addEventListener('click', () => {
    setMessage(
      'error',
      'Password reset by email is not available yet. Please contact support in Settings after logging in.'
    );
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const avatarForm = document.getElementById('avatar-form');
  const supportForm = document.getElementById('support-form');
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  const settingsMessage = document.getElementById('settings-message');
  const toggleThemeBtn = document.getElementById('toggle-theme-btn');

  // Helper function to get auth token
  function getAuthToken() {
    return localStorage.getItem('vicare_token');
  }

  // Helper function to get auth headers
  function getAuthHeaders() {
    const token = getAuthToken();
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  function setSettingsMessage(type, text) {
    settingsMessage.classList.remove('error', 'success');
    if (type) settingsMessage.classList.add(type);
    settingsMessage.textContent = text || '';
  }

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('hidden');
      setSettingsMessage('', '');
    });
  }

  // Theme toggle (light / dark)
  function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (toggleThemeBtn) toggleThemeBtn.textContent = 'Disable dark mode';
    } else {
      body.classList.remove('dark-mode');
      if (toggleThemeBtn) toggleThemeBtn.textContent = 'Enable dark mode';
    }
  }

  const savedTheme = localStorage.getItem('vicare_theme') || 'light';
  applyTheme(savedTheme);

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('vicare_theme', next);
      applyTheme(next);
    });
  }

  if (avatarForm) {
    avatarForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(avatarForm);
      try {
        const res = await fetch('/api/avatar', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setSettingsMessage('error', data.message || 'Error updating profile.');
          return;
        }
        setSettingsMessage('success', 'Profile updated.');
      } catch {
        setSettingsMessage('error', 'Network error updating profile.');
      }
    });
  }

  if (supportForm) {
    supportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(supportForm);
      const payload = Object.fromEntries(formData.entries());
      try {
        const res = await fetch('/api/support', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setSettingsMessage('error', data.message || 'Error sending support message.');
          return;
        }
        setSettingsMessage('success', 'Support message sent.');
        supportForm.reset();
      } catch {
        setSettingsMessage('error', 'Network error sending support message.');
      }
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      if (!window.confirm('Are you sure you want to delete your account?')) return;
      try {
        const res = await fetch('/api/account', { 
          method: 'DELETE', 
          headers: getAuthHeaders() 
        });
        const data = await res.json();
        if (!res.ok) {
          setSettingsMessage('error', data.message || 'Error deleting account.');
          return;
        }
        setSettingsMessage('success', 'Account deleted. Redirecting...');
        localStorage.removeItem('vicare_token');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } catch {
        setSettingsMessage('error', 'Network error deleting account.');
      }
    });
  }
});



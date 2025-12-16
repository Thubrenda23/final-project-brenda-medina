const dashMessage = document.getElementById('dashboard-message');

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('vicare_token');
}

// Helper function to get auth headers
function getAuthHeaders(includeContentType = true) {
  const token = getAuthToken();
  if (!token) {
    console.error('No token found in localStorage');
    return includeContentType ? { 'Content-Type': 'application/json' } : {};
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function setDashMessage(type, text) {
  if (!dashMessage) return;
  dashMessage.classList.remove('error', 'success');
  if (type) dashMessage.classList.add(type);
  dashMessage.textContent = text || '';
}

function renderList(target, items, type) {
  target.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item-row';

    const left = document.createElement('div');
    const right = document.createElement('div');

    if (type === 'medicine') {
      left.innerHTML = `<span>${item.name}</span><span class="meta">${item.dose || ''} ${
        item.frequency || ''
      }</span>`;
    } else if (type === 'vaccine') {
      const d = item.date ? new Date(item.date).toLocaleDateString() : '';
      left.innerHTML = `<span>${item.name}</span><span class="meta">${d} ${
        item.provider || ''
      }</span>`;
    } else if (type === 'appointment') {
      const d = item.date ? new Date(item.date) : null;
      const dateStr = d ? d.toLocaleDateString() : '';

      const now = new Date();
      const diffDays = d ? (d - now) / (1000 * 60 * 60 * 24) : null;
      if (diffDays !== null && diffDays >= 0 && diffDays <= 7) {
        li.classList.add('appointment-upcoming');
      }

      left.innerHTML = `<span>${item.doctor}</span><span class="meta">${dateStr} ${
        item.location || ''
      }</span>`;
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', async () => {
      const label =
        type === 'medicine'
          ? 'Delete this medicine?'
          : type === 'vaccine'
          ? 'Delete this vaccine?'
          : 'Delete this appointment?';
      if (!window.confirm(label)) return;

      let url = '';
      if (type === 'medicine') url = `/api/medicines/${item._id}`;
      if (type === 'vaccine') url = `/api/vaccines/${item._id}`;
      if (type === 'appointment') url = `/api/appointments/${item._id}`;

      const res = await fetch(url, { 
        method: 'DELETE', 
        headers: getAuthHeaders() 
      });
      if (res.ok) {
        loadAll();
      }
    });

    right.appendChild(delBtn);
    li.appendChild(left);
    li.appendChild(right);
    target.appendChild(li);
  });
}

function renderReminderList(target, items, type) {
  target.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'item-row';
    li.innerHTML = `<span class="meta">No upcoming ${type === 'appointment' ? 'appointments' : 'vaccines'}.</span>`;
    target.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item-row';

    const left = document.createElement('div');

    if (type === 'appointment') {
      const d = item.date ? new Date(item.date) : null;
      const dateStr = d ? d.toLocaleDateString() : '';
      const now = new Date();
      const diffDays = d ? Math.round((d - now) / (1000 * 60 * 60 * 24)) : null;
      const label = diffDays === 0 ? 'Today' : `In ${diffDays} day(s)`;
      left.innerHTML = `<span>${item.doctor}</span><span class="meta">${dateStr} · ${label}</span>`;
    } else if (type === 'vaccine') {
      const d = item.date ? new Date(item.date) : null;
      const dateStr = d ? d.toLocaleDateString() : '';
      const now = new Date();
      const diffDays = d ? Math.round((d - now) / (1000 * 60 * 60 * 24)) : null;
      const label = diffDays === 0 ? 'Today' : `In ${diffDays} day(s)`;
      left.innerHTML = `<span>${item.name}</span><span class="meta">${dateStr} · ${label}</span>`;
    }

    li.appendChild(left);
    target.appendChild(li);
  });
}

async function loadAll() {
  // Load user profile for greeting + avatar
  try {
    const meRes = await fetch('/api/auth/me', { 
      headers: getAuthHeaders() 
    });
    if (meRes.ok) {
      const me = await meRes.json();
      const greeting = document.getElementById('nav-greeting');
      const avatar = document.getElementById('nav-avatar');
      if (greeting && me.name) {
        greeting.textContent = `Hi, ${me.name} 👋`;
      }
      if (avatar && me.avatarUrl) {
        avatar.src = me.avatarUrl;
        avatar.classList.remove('hidden');
      }
      // Optionally, prefill emergency contacts later on the settings screen.
    }
  } catch {
    // ignore profile load errors; main data load will still run
  }

  const [medRes, vacRes, appRes] = await Promise.all([
    fetch('/api/medicines', { headers: getAuthHeaders() }),
    fetch('/api/vaccines', { headers: getAuthHeaders() }),
    fetch('/api/appointments', { headers: getAuthHeaders() }),
  ]);
  if (!medRes.ok || !vacRes.ok || !appRes.ok) {
    setDashMessage('error', 'Could not load data. Please log in again.');
    return;
  }
  const [medicines, vaccines, appointments] = await Promise.all([
    medRes.json(),
    vacRes.json(),
    appRes.json(),
  ]);

  renderList(document.getElementById('medicines-list'), medicines, 'medicine');
  renderList(document.getElementById('vaccines-list'), vaccines, 'vaccine');
  renderList(document.getElementById('appointments-list'), appointments, 'appointment');

  // Reminders: upcoming appointments (next 7 days) and vaccines (next 30 days)
  const now = new Date();
  const upcomingAppointments = appointments.filter((a) => {
    if (!a.date) return false;
    const d = new Date(a.date);
    const diffDays = (d - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });
  const upcomingVaccines = vaccines.filter((v) => {
    if (!v.date) return false;
    const d = new Date(v.date);
    const diffDays = (d - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  });

  renderReminderList(
    document.getElementById('reminders-appointments'),
    upcomingAppointments,
    'appointment'
  );
  renderReminderList(
    document.getElementById('reminders-vaccines'),
    upcomingVaccines,
    'vaccine'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const medicineForm = document.getElementById('medicine-form');
  const vaccineForm = document.getElementById('vaccine-form');
  const appointmentForm = document.getElementById('appointment-form');
  const logoutBtn = document.getElementById('logout-btn');

  loadAll();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        headers: getAuthHeaders() 
      });
      localStorage.removeItem('vicare_token');
      window.location.href = '/';
    });
  }

  if (medicineForm) {
    medicineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(medicineForm);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch {}
        setDashMessage('error', data.message || 'Could not add medicine.');
        return;
      }
      setDashMessage('success', 'Medicine added.');
      medicineForm.reset();
      loadAll();
    });
  }

  if (vaccineForm) {
    vaccineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(vaccineForm);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/api/vaccines', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch {}
        setDashMessage('error', data.message || 'Could not add vaccine.');
        return;
      }
      setDashMessage('success', 'Vaccine added.');
      vaccineForm.reset();
      loadAll();
    });
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(appointmentForm);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch {}
        setDashMessage('error', data.message || 'Could not add appointment.');
        return;
      }
      setDashMessage('success', 'Appointment added.');
      appointmentForm.reset();
      loadAll();
    });
  }
});



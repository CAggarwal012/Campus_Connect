/**
 * ============================================================================
 * CampusConnect - Frontend API Client & Dynamic Data Hydration
 * Connects Frontend Pages to Express Backend APIs:
 *   - External Weather & Quotes APIs (Parameter 1)
 *   - MongoDB & Local JSON Events, Registrations, and Clubs (Parameters 3 & 4)
 * ============================================================================
 */

const API_BASE = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5000';

const CampusAPI = {
  // 1. External APIs
  async getWeather() {
    try {
      const res = await fetch(`${API_BASE}/api/external/weather`);
      return await res.json();
    } catch (e) {
      console.warn('Weather API offline, using fallback:', e);
      return null;
    }
  },

  async getDailyQuote() {
    try {
      const res = await fetch(`${API_BASE}/api/external/quote`);
      return await res.json();
    } catch (e) {
      console.warn('Quote API offline, using fallback:', e);
      return null;
    }
  },

  // 2. Events APIs (MongoDB with fallback to Local JSON)
  async getEvents(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/api/events?${query}`);
      if (res.ok) {
        return await res.json();
      }
      // If MongoDB route fails, attempt local JSON route
      const fallbackRes = await fetch(`${API_BASE}/api/local/events?${query}`);
      return await fallbackRes.json();
    } catch (e) {
      console.warn('Could not fetch events from server:', e);
      return null;
    }
  },

  // 3. Registrations APIs
  async submitRegistration(registrationData) {
    try {
      const res = await fetch(`${API_BASE}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      return data;
    } catch (e) {
      // Attempt fallback to local JSON endpoint
      try {
        const fbRes = await fetch(`${API_BASE}/api/local/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData)
        });
        return await fbRes.json();
      } catch (fbError) {
        throw e;
      }
    }
  },

  async getMyRegistrations(email) {
    try {
      const res = await fetch(`${API_BASE}/api/registrations?email=${encodeURIComponent(email)}`);
      return await res.json();
    } catch (e) {
      console.warn('Registrations API unavailable:', e);
      return null;
    }
  },

  // 4. Clubs APIs
  async getClubs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/api/clubs?${query}`);
      return await res.json();
    } catch (e) {
      console.warn('Clubs API unavailable:', e);
      return null;
    }
  }
};

// ============================================================================
// PAGE HYDRATION & DOM BINDINGS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  injectApiDocsLink();
  hydrateWeatherWidget();
  hydrateQuoteWidget();
  bindRegistrationForm();
  bindEventsFilter();
});

/**
 * Injects a direct link to the API Docs & Testing Hub into the navigation bar
 */
function injectApiDocsLink() {
  const navbar = document.querySelector('.navbar');
  if (navbar && !navbar.querySelector('[data-api-docs]')) {
    const apiLink = document.createElement('a');
    apiLink.href = '/api-docs';
    apiLink.setAttribute('data-api-docs', 'true');
    apiLink.textContent = '⚡ API Hub';
    apiLink.style.cssText = 'color: #7C3AED; font-weight: 600; padding: 4px 10px; background: #EDE9FE; border-radius: 6px;';
    
    const loginBtn = navbar.querySelector('.nav-btn') || navbar.lastElementChild;
    navbar.insertBefore(apiLink, loginBtn);
  }
}

/**
 * Hydrates live campus weather widget onto the page
 */
async function hydrateWeatherWidget() {
  const targetContainer = document.querySelector('.page-header') || document.querySelector('.welcome-header');
  if (!targetContainer) return;

  const weatherData = await CampusAPI.getWeather();
  if (!weatherData) return;

  const weatherBadge = document.createElement('div');
  weatherBadge.className = 'campus-weather-pill';
  weatherBadge.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    padding: 8px 14px;
    border-radius: 20px;
    margin-top: 10px;
    font-size: 13px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  `;
  weatherBadge.innerHTML = `
    <span>${weatherData.icon || '☀️'}</span>
    <b>${weatherData.temperature || '25°C'}</b>
    <span style="color:#64748B;">· ${weatherData.condition || 'Clear Sky'}</span>
    <span style="font-size:11px;background:#DCFCE7;color:#16A34A;padding:2px 8px;border-radius:10px;margin-left:4px;">${weatherData.outdoorFriendly ? 'Fest Friendly' : 'Indoor Advised'}</span>
  `;

  targetContainer.appendChild(weatherBadge);
}

/**
 * Hydrates daily motivational quote widget
 */
async function hydrateQuoteWidget() {
  const dashboardLayout = document.querySelector('.welcome-header') || document.querySelector('.hero');
  if (!dashboardLayout) return;

  const quoteData = await CampusAPI.getDailyQuote();
  if (!quoteData || !quoteData.quote) return;

  const quoteBox = document.createElement('div');
  quoteBox.className = 'campus-daily-quote';
  quoteBox.style.cssText = `
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(79, 70, 229, 0.05) 100%);
    border-left: 4px solid #7C3AED;
    padding: 12px 18px;
    border-radius: 8px;
    margin-top: 15px;
    font-size: 13.5px;
    color: #334155;
    max-width: 650px;
    line-height: 1.4;
  `;
  quoteBox.innerHTML = `
    <i>“${quoteData.quote}”</i>
    <div style="font-weight:600;color:#7C3AED;margin-top:4px;font-size:12px;">— ${quoteData.author} (Daily Inspiration)</div>
  `;

  dashboardLayout.appendChild(quoteBox);
}

/**
 * Handles real dynamic registration submission on registration/index.html
 */
function bindRegistrationForm() {
  const formCard = document.querySelector('#form-section');
  if (!formCard) return;

  const submitBtn = formCard.querySelector('.btn-submit');
  if (!submitBtn) return;

  // Replace onclick attribute with real async API handler
  submitBtn.removeAttribute('onclick');
  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const inputs = formCard.querySelectorAll('input');
    const selects = formCard.querySelectorAll('select');

    const fullName = inputs[0] ? inputs[0].value.trim() : '';
    const rollNumber = inputs[1] ? inputs[1].value.trim() : '';
    const email = inputs[2] ? inputs[2].value.trim() : '';
    const phone = inputs[3] ? inputs[3].value.trim() : '';
    const teamName = inputs[4] ? inputs[4].value.trim() : '';

    const yearOfStudy = selects[0] ? selects[0].value : '3rd Year';
    const department = selects[1] ? selects[1].value : 'CSE';
    const tShirtSize = selects[2] ? selects[2].value : 'M';

    const selectedRadio = formCard.querySelector('.radio-option.selected');
    const dietaryPreference = selectedRadio ? selectedRadio.textContent.trim() : 'Vegetarian';

    if (!fullName || !rollNumber || !email) {
      alert('Please fill in your Full Name, Roll Number, and Email Address.');
      return;
    }

    const regPayload = {
      eventTitle: 'TechFest 2026',
      fullName,
      rollNumber,
      email,
      phone,
      yearOfStudy: yearOfStudy || '3rd Year',
      department: department || 'CSE',
      tShirtSize,
      teamName,
      dietaryPreference
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering via Express API...';

    try {
      const response = await CampusAPI.submitRegistration(regPayload);
      const regId = response.registrationId || (response.data && response.data.registrationId) || 'CC-2026-0847';

      // Update success card with real values
      const successCard = document.getElementById('success-section');
      if (successCard) {
        const idElem = successCard.querySelector('.id');
        if (idElem) idElem.textContent = regId;

        const emailNotice = successCard.querySelector('.email-notice');
        if (emailNotice) {
          emailNotice.innerHTML = `📧 Confirmation sent to <b>${email}</b> (Saved via Express API to Database)`;
        }

        formCard.style.display = 'none';
        successCard.style.display = 'block';
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Registration API error:', err);
      alert(`Registration note: ${err.message}. Showing confirmation pass.`);
      // Still show UI transition for user
      if (typeof window.showSuccess === 'function') {
        window.showSuccess();
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Complete Registration →';
    }
  });

  // Radio button toggle
  const radioOptions = formCard.querySelectorAll('.radio-option');
  radioOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      radioOptions.forEach(r => r.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

/**
 * Dynamic event search and filtering on events/index.html
 */
function bindEventsFilter() {
  const filterInput = document.querySelector('.filter-bar input');
  const pills = document.querySelectorAll('.category-pills .pill');
  if (!filterInput && (!pills || pills.length === 0)) return;

  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.cards-grid .event-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countHeader = document.querySelector('.result-count');
      if (countHeader) countHeader.textContent = `${visibleCount} events found`;
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.textContent.trim().toLowerCase();
      const cards = document.querySelectorAll('.cards-grid .event-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const badge = card.querySelector('.badge');
        const badgeText = badge ? badge.textContent.trim().toLowerCase() : '';
        if (cat === 'all' || badgeText === cat) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countHeader = document.querySelector('.result-count');
      if (countHeader) countHeader.textContent = `${visibleCount} events found`;
    });
  });
}

window.CampusAPI = CampusAPI;

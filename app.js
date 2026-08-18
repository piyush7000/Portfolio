/**
 * Main Application Logic & Interactivity for Piyush Saxena's 2026 AI Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initHeroCard3D();
  initAudioHaptics();
  initCopyButtons();
  initSkillsFilter();
  initAgentTerminal();
  initModals();
  initContactForm();
});

/* ==========================================================================
   1. CUSTOM CURSOR & GLOW
   ========================================================================== */
function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });
}

/* ==========================================================================
   2. HEADER SCROLL & MOBILE NAV
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link highlight
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  menu.querySelectorAll('.nav-link, button').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });

  // Close menu when tapping anywhere outside
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. 3D CARD TILT INTERACTION (HERO)
   ========================================================================== */
function initHeroCard3D() {
  const card = document.getElementById('heroCard3d');
  if (!card) return;

  // Disable 3D tilt on touch devices for silky performance
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   5. WEB AUDIO API HAPTICS & SOUND FX
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioHaptics() {
  const soundToggle = document.getElementById('soundToggle');

  const playClickTone = (freq = 600, duration = 0.05, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  };

  // Add click sound to all interactive elements
  document.querySelectorAll('button, .btn, .nav-link, .preset-btn, .copy-chip').forEach(item => {
    item.addEventListener('click', () => playClickTone(750, 0.06, 'triangle'));
  });

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundToggle.querySelector('i');
      if (soundEnabled) {
        icon.className = 'fa-solid fa-volume-high';
        playClickTone(880, 0.1);
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }
}

/* ==========================================================================
   6. COPY TO CLIPBOARD CHIPS
   ========================================================================== */
function initCopyButtons() {
  const chips = document.querySelectorAll('.copy-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          const tooltip = chip.querySelector('.copy-tooltip');
          if (tooltip) {
            const orig = tooltip.textContent;
            tooltip.textContent = 'Copied to Clipboard!';
            tooltip.style.opacity = '1';
            setTimeout(() => {
              tooltip.textContent = orig;
              tooltip.style.opacity = '';
            }, 1800);
          }
        });
      }
    });
  });
}

/* ==========================================================================
   7. SKILLS FILTER TABS
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. REAL LIVE AI AGENT TERMINAL (FASTAPI + GOOGLE GEMINI ENGINE)
   ========================================================================== */
function initAgentTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const liveConfigBtn = document.getElementById('liveConfigBtn');
  const liveConfigModal = document.getElementById('liveConfigModal');
  const closeConfigBtn = document.getElementById('closeConfigBtn');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const keyStatusMsg = document.getElementById('keyStatusMsg');
  const keyBtnText = document.getElementById('keyBtnText');

  if (!terminalForm || !terminalOutput) return;

  // Load saved Gemini Key from localStorage
  const savedKey = localStorage.getItem('piyush_gemini_api_key') || '';
  if (geminiApiKeyInput && savedKey) {
    geminiApiKeyInput.value = savedKey;
    if (keyBtnText) keyBtnText.textContent = 'Gemini Live ✓';
  }

  // Config modal event listeners
  if (liveConfigBtn && liveConfigModal) {
    liveConfigBtn.addEventListener('click', () => {
      liveConfigModal.classList.add('active');
      document.body.classList.add('modal-open');
    });
  }

  if (closeConfigBtn && liveConfigModal) {
    closeConfigBtn.addEventListener('click', () => {
      liveConfigModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }

  if (saveApiKeyBtn && geminiApiKeyInput) {
    saveApiKeyBtn.addEventListener('click', () => {
      const val = geminiApiKeyInput.value.trim();
      if (val) {
        localStorage.setItem('piyush_gemini_api_key', val);
        if (keyStatusMsg) keyStatusMsg.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> Gemini API Key saved! Live AI enabled.</span>`;
        if (keyBtnText) keyBtnText.textContent = 'Gemini Live ✓';
        setTimeout(() => {
          liveConfigModal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }, 1200);
      }
    });
  }

  if (clearApiKeyBtn) {
    clearApiKeyBtn.addEventListener('click', () => {
      localStorage.removeItem('piyush_gemini_api_key');
      if (geminiApiKeyInput) geminiApiKeyInput.value = '';
      if (keyBtnText) keyBtnText.textContent = 'Gemini Key';
      if (keyStatusMsg) keyStatusMsg.innerHTML = `<span style="color:#e5c07b;">Key cleared. Reverting to FastAPI local engine.</span>`;
    });
  }

  const appendMessage = (type, tag, content) => {
    const msg = document.createElement('div');
    msg.className = `term-msg ${type}`;
    msg.innerHTML = `<span class="term-tag">${tag}</span> ${content}`;
    terminalOutput.appendChild(msg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return msg;
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:2px 5px; border-radius:4px; color:#e5c07b;">$1</code>')
      .replace(/^\s*[\-\*]\s+(.*)$/gm, '<li style="margin-left:1.2rem;">$1</li>')
      .replace(/\n/g, '<br>');
  };

  const processQuery = async (query) => {
    appendMessage('user', '[USER]', query);

    const apiKey = localStorage.getItem('piyush_gemini_api_key') || '';

    // Show initial real-time thinking status
    const thoughtMsg = appendMessage('thought', '[THOUGHT]', '<i class="fa-solid fa-spinner fa-spin"></i> Initializing Chain-of-Thought reasoning & tool selection...');

    try {
      // 1. Try Live FastAPI Backend First (runs on port 8000)
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          api_key: apiKey || undefined,
          model: 'gemini-2.5-flash'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.response || data.raw_text || data.answer || '';

        // Display thought
        thoughtMsg.innerHTML = `<span class="term-tag">[THOUGHT]</span> ${data.thought || 'Synthesized real-time Gemini LLM inference across Piyush\'s resume knowledge base.'}`;
        
        // Display tool call
        if (data.tool_call) {
          appendMessage('system', '[TOOL_CALL]', `Executed <span class="tool-chip">${data.tool_call}</span>`);
        }

        // Display formatted agent response
        appendMessage('assistant', '[AGENT]', formatMarkdown(rawContent));
        return;
      }
    } catch (e) {
      console.warn('FastAPI backend offline or error, trying direct/local fallback:', e);
    }

    // Default intelligent local fallback
    setTimeout(() => {
      const q = query.toLowerCase();
      thoughtMsg.innerHTML = `<span class="term-tag">[THOUGHT]</span> Parsed intent: Knowledge lookup on Piyush Saxena's projects, internships & skills.`;
      
      if (q.includes('lstm') || q.includes('stock') || q.includes('predict')) {
        appendMessage('system', '[TOOL_CALL]', 'Executing <span class="tool-chip">StockPredictor.forecast(ticker="AAPL", model="LSTM_v2", days=5)</span>...');
        setTimeout(() => {
          appendMessage('assistant', '[AGENT]', `
            <strong>Stock Price Prediction Analysis:</strong><br>
            • <strong>Model Architecture:</strong> Multi-layer LSTM recurrent network with Scikit-learn feature scaler and dropout regularization.<br>
            • <strong>Data Pipeline:</strong> Pandas feature engineering with 14-day RSI and 50-day moving average.<br>
            • <strong>Performance Benchmark:</strong> LSTM achieved a <strong>14.2% lower RMSE</strong> compared to baseline Linear Regression.<br>
            • <strong>Source Code:</strong> <a href="https://github.com/piyush7000/StockPrediction" target="_blank" style="color:#e5c07b;">github.com/piyush7000/StockPrediction</a>
          `);
        }, 600);
      } else if (q.includes('google') || q.includes('intern') || q.includes('experience')) {
        appendMessage('system', '[TOOL_CALL]', 'Executing <span class="tool-chip">ExperienceLookup.getSummary(category="internships")</span>...');
        setTimeout(() => {
          appendMessage('assistant', '[AGENT]', `
            <strong>Piyush Saxena's Virtual Internships Summary:</strong><br>
            1. <strong>Google Cloud Generative AI Virtual Internship (Apr 2025 – Jun 2025):</strong> Applied cloud LLMs, multi-modal prompt tuning, and AI APIs across guided project modules.<br>
            2. <strong>Google Android Developer Virtual Internship (Jan 2025 – Mar 2025):</strong> Designed functional multi-screen layouts and modern Android core features.<br>
            3. <strong>Python Full Stack Developer Internship — AICTE (Oct 2024 – Dec 2024):</strong> Shipped client-facing full-stack Python features and reduced internal workflow bottlenecks.
          `);
        }, 600);
      } else if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
        appendMessage('system', '[TOOL_CALL]', 'Executing <span class="tool-chip">SkillLookup.fetchTopCompetencies()</span>...');
        setTimeout(() => {
          appendMessage('assistant', '[AGENT]', `
            <strong>Piyush's Technical Stack:</strong><br>
            • <strong>Core Languages:</strong> Python, JavaScript, HTML5, CSS3.<br>
            • <strong>AI & Data Science:</strong> Generative AI, Agentic AI, LLM APIs, Machine Learning, Prompt Engineering.<br>
            • <strong>Frameworks & Tools:</strong> FastAPI, Scikit-learn, Keras, Pandas, NumPy, Jupyter, VS Code, Git/GitHub.
          `);
        }, 600);
      } else {
        appendMessage('system', '[TOOL_CALL]', 'Executing <span class="tool-chip">CandidateMatcher.evaluate(candidate="Piyush Saxena")</span>...');
        setTimeout(() => {
          appendMessage('assistant', '[AGENT]', `
            <strong>Candidate Evaluation:</strong><br>
            Piyush Saxena is an engineering-driven Data Science and Python Developer pursuing B.Tech in IT (2023–2027) at ITM Group of Institutions.<br>
            • Demonstrated ability to build autonomous tool-calling AI agents with FastAPI.<br>
            • Hands-on deep learning experience with time-series ML (LSTM vs Linear Regression).<br>
            • 3 verified internships with Google and AICTE.<br>
            • <strong>Verdict:</strong> High potential candidate for Data Science, Data Analytics, and Python Backend / AI Developer positions.
          `);
        }, 600);
      }
    }, 700);
  };

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = terminalInput.value.trim();
    if (!query) return;
    terminalInput.value = '';
    processQuery(query);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        terminalInput.value = prompt;
        processQuery(prompt);
      }
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = `
        <div class="term-msg system">
          <span class="term-tag">[SYSTEM]</span> Agent context reset. Memory buffer cleared.
        </div>
        <div class="term-msg assistant">
          <span class="term-tag">[AGENT]</span> Ready for your next query. How can I assist you today?
        </div>
      `;
    });
  }
}

/* ==========================================================================
   9. MODALS (RESUME & PROJECT DETAILS)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      document.body.classList.add('modal-open');
    });
  }

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }

  // Close when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
    const projModal = document.getElementById('projectModal');
    if (e.target === projModal) {
      projModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
}

// Open project deep-dive details
window.openProjectModal = function(type) {
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('projectModalContent');
  if (!modal || !content) return;

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  if (type === 'agent') {
    content.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-wrap">
          <i class="fa-solid fa-brain gold-text"></i>
          <h3>Autonomous AI Agent using LLM APIs & FastAPI</h3>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.classList.remove('modal-open');">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <h4 style="color:#e5c07b; margin-bottom:0.5rem;">System Architecture & Design</h4>
        <p style="color:#a0a6bd; margin-bottom:1.2rem; font-size:0.92rem;">
          This system implements an autonomous decision-making loop where an LLM is equipped with specialized programmatic tools (calculators, web scrapers, data formatters, and database connectors).
        </p>

        <div style="background:rgba(0,0,0,0.4); padding:1.2rem; border-radius:8px; border:1px solid rgba(255,255,255,0.08); margin-bottom:1.2rem;">
          <h5 style="color:#fff; margin-bottom:0.6rem; font-family:var(--font-mono); font-size:0.85rem;"><i class="fa-solid fa-diagram-project gold-text"></i> Execution Pipeline:</h5>
          <ol style="color:#abb2bf; font-size:0.85rem; padding-left:1.2rem; line-height:1.7;">
            <li><strong>User Input Ingestion:</strong> FastAPI async endpoint receives structured request payload.</li>
            <li><strong>Chain-of-Thought Deconstruction:</strong> Agent generates intermediate reasoning steps to break down complex queries.</li>
            <li><strong>Tool-Calling Dispatcher:</strong> Selects appropriate internal Python routines and extracts strictly typed arguments.</li>
            <li><strong>Memory Buffer Integration:</strong> Multi-turn context is saved and weighted to maintain context throughout the conversation.</li>
            <li><strong>Final Synthesis:</strong> Result is validated against JSON schemas before returning to client.</li>
          </ol>
        </div>

        <div style="display:flex; gap:0.8rem; margin-top:1.5rem;">
          <a href="#playground" class="btn btn-gold btn-sm" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.classList.remove('modal-open');">
            <i class="fa-solid fa-play"></i> Test in Interactive Terminal
          </a>
        </div>
      </div>
    `;
  } else if (type === 'stock') {
    content.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-wrap">
          <i class="fa-solid fa-arrow-trend-up gold-text"></i>
          <h3>Stock Price Prediction (LSTM vs. Linear Regression)</h3>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.classList.remove('modal-open');">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <h4 style="color:#e5c07b; margin-bottom:0.5rem;">Model Benchmarks & Methodology</h4>
        <p style="color:#a0a6bd; margin-bottom:1.2rem; font-size:0.92rem;">
          A machine learning and time-series deep learning comparison on historical equity data cleaned and normalized via Pandas & NumPy.
        </p>

        <div class="modal-grid-2col" style="display:grid; gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
            <h5 style="color:#00f2fe; margin-bottom:0.4rem;">Linear Regression</h5>
            <p style="font-size:0.82rem; color:#abb2bf;">Baseline statistical regression on moving averages and lagged features. Fast convergence, but struggles with non-linear market volatility.</p>
          </div>
          <div style="background:rgba(229,192,123,0.08); padding:1rem; border-radius:8px; border:1px solid rgba(229,192,123,0.3);">
            <h5 style="color:#e5c07b; margin-bottom:0.4rem;">LSTM Deep Neural Network</h5>
            <p style="font-size:0.82rem; color:#abb2bf;">Sequential memory gates capture multi-day temporal dependencies, resulting in significantly higher next-day prediction fidelity.</p>
          </div>
        </div>

        <div style="display:flex; gap:0.8rem; margin-top:1.5rem;">
          <a href="https://github.com/piyush7000/StockPrediction" target="_blank" rel="noreferrer" class="btn btn-gold btn-sm">
            <i class="fa-brands fa-github"></i> Open Repository on GitHub
          </a>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
};

/* ==========================================================================
   10. CONTACT FORM SUBMISSION (REAL WEB3FORMS INTEGRATION)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Dispatch';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    }

    status.innerHTML = `<span style="color:#e5c07b;"><i class="fa-solid fa-spinner fa-spin"></i> Transmitting directly to Piyush's inbox...</span>`;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        status.innerHTML = `<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Success! Your message has been delivered to Piyush's inbox.</span>`;
        form.reset();
      } else {
        status.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> ${result.message || 'Transmission failed. Please email directly.'}</span>`;
      }
    } catch (error) {
      status.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Network error. Please email directly at piyushsaxena172003@gmail.com</span>`;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
      setTimeout(() => {
        status.innerHTML = '';
      }, 7000);
    }
  });
}

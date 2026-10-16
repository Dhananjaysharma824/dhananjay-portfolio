/**
 * DHANANJAY SHARMA — INTERACTION SYSTEM
 * Custom cursor, skills filtering, clipboard copier, drawer, accessible controls
 */

(function () {
  'use strict';

  // 1. Custom Smooth Cursor with Dynamic Labels
  function initCustomCursor() {
    // Only initialize on pointer: fine (desktop mice)
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      return;
    }

    const cursorDot = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    const cursorText = cursorFollower ? cursorFollower.querySelector('span') : null;

    if (!cursorDot || !cursorFollower) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Smooth spring physics for follower
    function animateFollower() {
      const ease = 0.18;
      followerX += (mouseX - followerX) * ease;
      followerY += (mouseY - followerY) * ease;

      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    // Contextual Hover Triggers
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skill-tag, .pillar-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorFollower.classList.add('hovering');

        const cursorLabel = el.getAttribute('data-cursor');
        if (cursorLabel && cursorText) {
          cursorText.textContent = cursorLabel;
        } else if (cursorText) {
          cursorText.textContent = el.tagName === 'A' ? 'Open' : 'Action';
        }
      });

      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
        if (cursorText) cursorText.textContent = '';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorFollower.style.opacity = '1';
    });
  }

  // 2. Interactive Skills Directory Filtering
  function initSkillsFilter() {
    const tabButtons = document.querySelectorAll('.skills-tab-btn');
    const skillCards = document.querySelectorAll('.skill-category-card');

    if (!tabButtons.length || !skillCards.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-category');

        // Update active tab button
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        skillCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (targetCategory === 'all' || targetCategory === cardCategory) {
            card.style.display = 'block';
            card.classList.add('highlighted');
            setTimeout(() => card.classList.remove('highlighted'), 800);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. One-Click Clipboard Copy with Feedback
  function initClipboardCopy() {
    const copyButtons = document.querySelectorAll('[data-copy]');

    copyButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          btn.classList.add('copied');
          const tooltip = btn.querySelector('.tooltip');
          const originalText = tooltip ? tooltip.textContent : '';
          if (tooltip) tooltip.textContent = 'Copied!';

          setTimeout(() => {
            btn.classList.remove('copied');
            if (tooltip) tooltip.textContent = originalText;
          }, 2200);
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
      });
    });
  }

  // 4. Mobile Navigation Menu Toggle
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 5. Scroll to Top Button
  function initScrollToTop() {
    const scrollTopBtn = document.getElementById('btn-scroll-top');
    if (!scrollTopBtn) return;

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Interactive Contact Message Box Form
  function initContactForm() {
    const form = document.getElementById('contact-message-form');
    const alertBox = document.getElementById('form-status-alert');
    const submitBtn = document.getElementById('btn-submit-message');

    if (!form || !alertBox || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value || 'Portfolio Inquiry';
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) return;

      // Update UI to sending state
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span>Dispatching transmission...</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
      `;

      alertBox.className = 'form-status-alert sending';
      alertBox.style.display = 'block';
      alertBox.textContent = 'Transmitting direct message to dhananjay42819@gmail.com...';

      // Update hidden subject for fallback
      const subjectHidden = document.getElementById('form-subject-hidden');
      if (subjectHidden) {
        subjectHidden.value = `Portfolio Inquiry: ${subject} from ${name}`;
      }

      const payload = {
        name: name,
        email: email,
        _subject: `Portfolio Message: ${subject} from ${name}`,
        _replyto: email,
        _captcha: 'false',
        _template: 'table',
        inquiry_type: subject,
        message: message
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/dhananjay42819@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          alertBox.className = 'form-status-alert success';
          alertBox.innerHTML = `<strong>✓ Transmission Dispatched!</strong><br>Thank you <strong>${name}</strong>, your message has been delivered directly to <strong>dhananjay42819@gmail.com</strong>. Dhananjay will review it and reply back to <em>${email}</em> promptly.`;
          form.reset();
        } else {
          throw new Error(data.message || 'Server returned unsuccessful response');
        }
      } catch (err) {
        console.warn('AJAX delivery encountered an issue, attempting direct submission fallback:', err);
        // Fallback: If running locally without webserver or if AJAX fails, submit standard form
        if (window.location.protocol === 'file:') {
          form.submit();
          return;
        }

        const mailtoUrl = `mailto:dhananjay42819@gmail.com?subject=${encodeURIComponent('Portfolio Message: ' + subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        alertBox.className = 'form-status-alert error';
        alertBox.innerHTML = `Notice: Web transmission paused. <a href="${mailtoUrl}" style="color: var(--accent-rust); text-decoration: underline; font-weight: 600;">Click here to send directly via Email</a> or email directly at <strong style="color: var(--ink-primary);">dhananjay42819@gmail.com</strong>.`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // 7. Real-Time Skills Search Bar
  function initSkillsSearch() {
    const searchInput = document.getElementById('skills-search-input');
    const skillTags = document.querySelectorAll('.skill-tag');
    const allTabBtn = document.querySelector('.skills-tab-btn[data-category="all"]');

    if (!searchInput || !skillTags.length) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        // Automatically switch to All Categories so matching skills are visible
        if (allTabBtn && !allTabBtn.classList.contains('active')) {
          allTabBtn.click();
        }

        skillTags.forEach(tag => {
          const text = tag.textContent.trim().toLowerCase();
          if (text.includes(query)) {
            tag.classList.add('search-match');
          } else {
            tag.classList.remove('search-match');
          }
        });
      } else {
        skillTags.forEach(tag => tag.classList.remove('search-match'));
      }
    });
  }

  // 8. 3D Cursor Parallax & Specular Light System
  function initCursorParallax() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll('[data-cursor-tilt]');
    tiltCards.forEach(card => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const maxTilt = 6; // subtle, high-end editorial feel
        const rotateY = percentX * maxTilt;
        const rotateX = -percentY * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 9. Interactive Hero Developer Terminal
  function initInteractiveTerminal() {
    const screen = document.getElementById('hero-terminal-screen');
    const tabs = document.querySelectorAll('.term-tab');
    const quickBtns = document.querySelectorAll('.quick-cmd-btn');

    if (!screen) return;

    const terminalData = {
      profile: {
        cmd: 'cat profile.sh',
        lines: [
          '<span class="term-highlight">Engineer:</span> Dhananjay Sharma',
          '<span class="term-highlight">Degree:</span> B.Tech in Information Technology (2022–2026)',
          '<span class="term-highlight">Affiliation:</span> Hindustan College of Science &amp; Technology, Mathura (AKTU)',
          '<span class="term-highlight">Current Role:</span> Frontend Developer Intern @ SafexNet World Pvt. Ltd.',
          '<span class="term-highlight">Prior Intern:</span> Web Development Intern @ CodeAlpha',
          '<span class="term-highlight">Status:</span> Open to Full Stack, Frontend &amp; Web Designing Roles'
        ]
      },
      stack: {
        cmd: 'cat stack.json',
        lines: [
          '<span class="term-highlight">Core:</span> React.js, Node.js, Express.js, MongoDB',
          '<span class="term-highlight">Languages:</span> Java (Core &amp; OOP), JavaScript (ES6+), TypeScript, SQL, Python',
          '<span class="term-highlight">State &amp; UI:</span> Redux Toolkit, Context API, Tailwind CSS, Vanilla CSS3',
          '<span class="term-highlight">DevOps &amp; Tools:</span> Docker, Git, GitHub, Postman, Vercel, Netlify',
          '<span class="term-highlight">Foundations:</span> DSA, DBMS, Operating Systems, Computer Networks'
        ]
      },
      projects: {
        cmd: 'git log --oneline -n 3',
        lines: [
          '<span class="term-highlight">a49f12c</span> [PROD] NetraDeep — Real-time object detection SPA w/ Node backend',
          '<span class="term-highlight">81e3d09</span> [PROD] TaskFlow — MERN task manager w/ JWT auth &amp; dynamic filters',
          '<span class="term-highlight">c02b881</span> [PROD] React AI Chatbot — Conversational AI assistant w/ real-time streaming',
          '<span class="term-highlight">Deployments:</span> 100% verified live demos on Vercel &amp; Render'
        ]
      },
      contact: {
        cmd: 'cat contact.vcf',
        lines: [
          '<span class="term-highlight">Email:</span> dhananjay42819@gmail.com',
          '<span class="term-highlight">Phone:</span> +91 7536054568',
          '<span class="term-highlight">Location:</span> Agra, Uttar Pradesh, India',
          '<span class="term-highlight">GitHub:</span> github.com/Dhananjaysharma824',
          '<span class="term-highlight">LinkedIn:</span> linkedin.com/in/dhananjay-sharma-629771288'
        ]
      }
    };

    function runCommand(key) {
      const data = terminalData[key];
      if (!data) return;

      tabs.forEach(t => {
        if (t.getAttribute('data-cmd') === key) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      screen.innerHTML = `
        <div class="term-line prompt-line">
          <span class="term-user">dhananjay@portfolio</span>:<span class="term-dir">~</span>$ <span class="term-cmd-text">${data.cmd}</span>
        </div>
        <div class="term-line output-line">
          ${data.lines.join('<br>')}
        </div>
        <div class="term-line prompt-line term-cursor-line">
          <span class="term-user">dhananjay@portfolio</span>:<span class="term-dir">~</span>$ <span class="terminal-cursor">_</span>
        </div>
      `;
      screen.scrollTop = screen.scrollHeight;
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cmdKey = tab.getAttribute('data-cmd');
        runCommand(cmdKey);
      });
    });

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-run');
        if (action === 'whoami') runCommand('profile');
        else if (action === 'stack') runCommand('stack');
        else if (action === 'projects') runCommand('projects');
        else if (action === 'clear') {
          screen.innerHTML = `
            <div class="term-line prompt-line term-cursor-line">
              <span class="term-user">dhananjay@portfolio</span>:<span class="term-dir">~</span>$ <span class="terminal-cursor">_</span>
            </div>
          `;
        }
      });
    });
  }

  // 10. Interactive Tech Constellation Physics Canvas (Moves with Cursor)
  function initTechOrbitCanvas() {
    const canvas = document.getElementById('tech-orbit-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = Math.min(canvas.parentElement ? canvas.parentElement.clientWidth : 360, window.innerWidth);
    let height = canvas.height = 250;

    function resizeCanvas() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 320;
      height = canvas.height = 250;
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    const nodes = [
      { name: 'React.js', color: '#CC5500', radius: 24, x: width * 0.25, y: height * 0.35, vx: 0.3, vy: -0.2 },
      { name: 'Node.js', color: '#9CAF88', radius: 24, x: width * 0.75, y: height * 0.4, vx: -0.3, vy: 0.25 },
      { name: 'Express', color: '#ECEAE4', radius: 20, x: width * 0.5, y: height * 0.7, vx: 0.2, vy: 0.3 },
      { name: 'MongoDB', color: '#9CAF88', radius: 22, x: width * 0.8, y: height * 0.75, vx: -0.25, vy: -0.2 },
      { name: 'Docker', color: '#CC5500', radius: 20, x: width * 0.2, y: height * 0.75, vx: 0.25, vy: -0.25 },
      { name: 'TypeScript', color: '#ECEAE4', radius: 22, x: width * 0.45, y: height * 0.25, vx: -0.2, vy: 0.2 },
      { name: 'Java', color: '#CC5500', radius: 18, x: width * 0.65, y: height * 0.2, vx: 0.2, vy: -0.3 }
    ];

    let mouse = { x: -1000, y: -1000, active: false };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      mouse.active = false;
    }, { passive: true });

    const pills = document.querySelectorAll('.orbit-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const techName = pill.getAttribute('data-tech');
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Burst impulse to matching node
        nodes.forEach(n => {
          if (n.name.toLowerCase().includes(techName.toLowerCase())) {
            n.vx += (Math.random() - 0.5) * 4;
            n.vy += (Math.random() - 0.5) * 4;
            n.radius = 30;
            setTimeout(() => n.radius = 24, 600);
          }
        });
      });
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and connect nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off canvas boundaries
        if (node.x - node.radius < 0) { node.x = node.radius; node.vx *= -1; }
        if (node.x + node.radius > width) { node.x = width - node.radius; node.vx *= -1; }
        if (node.y - node.radius < 0) { node.y = node.radius; node.vy *= -1; }
        if (node.y + node.radius > height) { node.y = height - node.radius; node.vy *= -1; }

        // Mouse interaction: Nodes are drawn towards or repelled by cursor
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist && dist > 1) {
            // Draw magnetic laser line to cursor
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(204, 85, 0, ${0.45 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Spring force
            const force = (1 - dist / maxDist) * 0.08;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        // Draw inter-node connection links
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(156, 175, 136, ${0.28 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Node Glow Halo
        const glow = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, node.radius + 6);
        glow.addColorStop(0, node.color === '#CC5500' ? 'rgba(204, 85, 0, 0.4)' : 'rgba(156, 175, 136, 0.35)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        // Node Circle
        ctx.fillStyle = '#1A1D18';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#ECEAE4';
        ctx.font = '600 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      }

      // Draw cursor orbit ring if mouse is active
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(204, 85, 0, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // 11. Interactive Contact Quick-Prompt autofill
  function initContactQuickPrompts() {
    const promptBtns = document.querySelectorAll('.quick-prompt-btn');
    const subjectSelect = document.getElementById('contact-subject');
    const messageTextarea = document.getElementById('contact-message');

    if (!promptBtns.length || !subjectSelect || !messageTextarea) return;

    const templates = {
      'mern': {
        subject: 'Full Stack MERN Role',
        text: 'Hi Dhananjay, I reviewed your portfolio and verified resume. We have an opportunity for a Full Stack MERN Developer and would love to discuss your experience with React, Node.js, and MongoDB.'
      },
      'frontend': {
        subject: 'Frontend Development Role',
        text: 'Hello Dhananjay, I was impressed by your frontend UI work and single-page applications. We are currently looking for a Frontend Developer / Web Designer to join our engineering team.'
      },
      'project': {
        subject: 'Freelance or Consulting',
        text: 'Hi Dhananjay, I would like to consult with you on building a scalable web application. Let us connect to discuss scope and timelines.'
      }
    };

    promptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-prompt');
        const template = templates[type];
        if (template) {
          subjectSelect.value = template.subject;
          messageTextarea.value = template.text;
          messageTextarea.focus();
        }
      });
    });
  }

  // 12. Tactile Kinetic Physics Sandbox (Located below Contact Message Box)
  function initTactilePhysicsSandbox() {
    const canvas = document.getElementById('tactile-physics-canvas');
    const stageWrapper = document.querySelector('.sandbox-canvas-stage');
    const btnDrop = document.getElementById('btn-dock-drop');
    const btnTumble = document.getElementById('btn-dock-tumble');
    const btnReset = document.getElementById('btn-dock-reset');

    if (!canvas || !stageWrapper) return;

    const ctx = canvas.getContext('2d');

    let width = 560;
    let height = 250;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animating = true;

    // Physics constants
    const gravity = 0.42;
    const airFriction = 0.993;
    const surfaceFriction = 0.88;
    const bounce = 0.38;

    // Side shelf platform ("block utha ke rakhne ka side me")
    let shelf = { x: 390, y: 120, w: 150, h: 12 };

    function updateShelf() {
      const shelfW = Math.min(150, Math.max(110, width * 0.30));
      shelf.w = shelfW;
      shelf.x = width - shelfW - 8;
      shelf.y = Math.round(height * 0.48);
      shelf.h = 12;
    }

    function resizeCanvas() {
      const rect = stageWrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      updateShelf();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Cohesive, elegant, non-emoji palette matching portfolio
    const palette = [
      { bg: '#1C1F19', border: '#3B4336', text: '#ECEAE4' }, // Deep Ink Charcoal
      { bg: '#FAF8F4', border: '#2B3026', text: '#1A1D17' }, // Paper White with Ink border
      { bg: '#873606', border: '#CC5500', text: '#FFFFFF' }, // Tactile Rust Accent
      { bg: '#3C4936', border: '#5F7455', text: '#FFFFFF' }, // Muted Sage
      { bg: '#252F37', border: '#465764', text: '#FFFFFF' }, // Slate Blue
      { bg: '#54412C', border: '#8A6C4A', text: '#FFFFFF' }  // Warm Ochre
    ];

    const techLabels = [
      'REACT', 'NODE.JS', 'MONGODB', 'EXPRESS',
      'JAVA', 'DOCKER', 'REST_API', 'SYSTEM',
      'NEXT.JS', 'VITE', 'REDUX', 'DEV_OPS'
    ];

    let blocks = [];

    function createBlock(x, y, w, h, label, color) {
      return {
        id: Math.random().toString(36).substring(2, 9),
        x: x,
        y: y,
        w: w,
        h: h,
        vx: 0,
        vy: 0,
        vRot: 0,
        label: label,
        bg: color.bg,
        border: color.border,
        text: color.text,
        isDragging: false,
        isHovered: false
      };
    }

    function initDefaultBlocks() {
      blocks = [];
      const bw = Math.min(84, Math.max(68, width * 0.17));
      const bh = 30;

      // 1. Stack on left floor
      blocks.push(createBlock(22, height - bh - 4, bw, bh, 'REACT', palette[2]));
      blocks.push(createBlock(26, height - (bh * 2) - 8, bw - 6, bh, 'NODE.JS', palette[3]));

      // 2. Stack in center floor
      const midX = Math.round(width * 0.32);
      blocks.push(createBlock(midX, height - bh - 4, bw + 6, bh, 'MONGODB', palette[0]));
      blocks.push(createBlock(midX + 6, height - (bh * 2) - 8, bw - 4, bh, 'EXPRESS', palette[1]));

      // 3. Pre-stacked on the Side Shelf ("block utha ke rakhne ka side me")
      const shelfX = shelf.x + 12;
      blocks.push(createBlock(shelfX, shelf.y - bh - 2, bw - 6, bh, 'JAVA', palette[4]));
      blocks.push(createBlock(shelfX + 6, shelf.y - (bh * 2) - 6, bw - 12, bh, 'DOCKER', palette[5]));
    }

    initDefaultBlocks();

    // Mouse / Cursor state
    let mouse = { x: -1000, y: -1000, active: false };
    let draggedBlock = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = 0;
    let flingVx = 0;
    let flingVy = 0;

    function getCoords(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function findBlockAt(x, y) {
      for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i];
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
          return b;
        }
      }
      return null;
    }

    function handlePointerDown(clientX, clientY, e) {
      const c = getCoords(clientX, clientY);
      const hit = findBlockAt(c.x, c.y);

      if (hit) {
        if (e && e.cancelable) e.preventDefault();
        draggedBlock = hit;
        hit.isDragging = true;
        hit.vx = 0;
        hit.vy = 0;
        hit.vRot = 0;

        dragOffsetX = c.x - hit.x;
        dragOffsetY = c.y - hit.y;

        lastMouseX = c.x;
        lastMouseY = c.y;
        lastTime = performance.now();
        flingVx = 0;
        flingVy = 0;

        stageWrapper.classList.add('grabbing');

        // Move to top of rendering order
        const idx = blocks.indexOf(hit);
        if (idx !== -1) {
          blocks.splice(idx, 1);
          blocks.push(hit);
        }
      }
    }

    function handlePointerMove(clientX, clientY, e) {
      const c = getCoords(clientX, clientY);
      mouse.x = c.x;
      mouse.y = c.y;
      mouse.active = true;

      // Update hover state
      if (!draggedBlock) {
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          b.isHovered = (c.x >= b.x && c.x <= b.x + b.w && c.y >= b.y && c.y <= b.y + b.h);
        }
      }

      if (draggedBlock) {
        if (e && e.cancelable) e.preventDefault();
        const now = performance.now();
        const dt = Math.max(now - lastTime, 8);

        const dx = c.x - lastMouseX;
        const dy = c.y - lastMouseY;
        flingVx = (dx / dt) * 15;
        flingVy = (dy / dt) * 15;

        flingVx = Math.max(-26, Math.min(26, flingVx));
        flingVy = Math.max(-26, Math.min(26, flingVy));

        lastMouseX = c.x;
        lastMouseY = c.y;
        lastTime = now;

        draggedBlock.x = c.x - dragOffsetX;
        draggedBlock.y = c.y - dragOffsetY;

        // Keep inside bounds while dragging
        draggedBlock.x = Math.max(0, Math.min(width - draggedBlock.w, draggedBlock.x));
        draggedBlock.y = Math.max(0, Math.min(height - draggedBlock.h, draggedBlock.y));
      }
    }

    function handlePointerUp() {
      if (draggedBlock) {
        draggedBlock.isDragging = false;
        draggedBlock.vx = flingVx;
        draggedBlock.vy = flingVy;
        draggedBlock.vRot = flingVx * 0.007;

        draggedBlock = null;
        stageWrapper.classList.remove('grabbing');
      }
    }

    // Mouse Listeners
    canvas.addEventListener('mousedown', (e) => handlePointerDown(e.clientX, e.clientY, e));
    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY, e));
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
      blocks.forEach(b => b.isHovered = false);
    });

    // Touch Listeners
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (draggedBlock && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    // Double-click to drop new block
    canvas.addEventListener('dblclick', (e) => {
      const c = getCoords(e.clientX, e.clientY);
      spawnBlock(c.x - 35, c.y - 15);
    });

    function spawnBlock(x, y) {
      const randomLabel = techLabels[Math.floor(Math.random() * techLabels.length)];
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      const bw = Math.min(84, Math.max(68, width * 0.17));
      const bh = 30;

      const clampedX = Math.max(8, Math.min(width - bw - 8, x));
      const clampedY = Math.max(6, Math.min(height - bh - 10, y));

      const newB = createBlock(clampedX, clampedY, bw, bh, randomLabel, randomColor);
      newB.vy = -1.5;
      newB.vx = (Math.random() - 0.5) * 4;
      blocks.push(newB);
    }

    // Tool Buttons
    if (btnDrop) {
      btnDrop.addEventListener('click', () => {
        const dropX = Math.random() * (width - 150) + 20;
        spawnBlock(dropX, 10);
      });
    }

    if (btnTumble) {
      btnTumble.addEventListener('click', () => {
        blocks.forEach(b => {
          b.vx = (Math.random() - 0.5) * 20;
          b.vy = -(Math.random() * 10 + 4);
          b.vRot = (Math.random() - 0.5) * 0.2;
        });
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        initDefaultBlocks();
      });
    }

    // Physics Update
    function updatePhysics() {
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.isDragging) continue;

        // Apply gravity & friction
        b.vy += gravity;
        b.vx *= airFriction;
        b.vy *= airFriction;
        b.vRot *= 0.96;

        // Cursor magnetic proximity effect (alive feel when cursor moves past blocks)
        if (mouse.active && !draggedBlock) {
          const bMidX = b.x + b.w / 2;
          const bMidY = b.y + b.h / 2;
          const dx = mouse.x - bMidX;
          const dy = mouse.y - bMidY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75 && dist > 2) {
            const push = (1 - dist / 75) * 0.35;
            b.vx -= (dx / dist) * push;
            b.vy -= (dy / dist) * (push * 0.5);
          }
        }

        b.x += b.vx;
        b.y += b.vy;

        // Boundary: Floor
        if (b.y + b.h >= height) {
          b.y = height - b.h;
          b.vy = -b.vy * bounce;
          b.vx *= surfaceFriction;
          if (Math.abs(b.vy) < 0.3) b.vy = 0;
        }

        // Boundary: Ceiling
        if (b.y <= 0) {
          b.y = 0;
          b.vy = -b.vy * bounce;
        }

        // Boundary: Walls
        if (b.x <= 0) {
          b.x = 0;
          b.vx = -b.vx * bounce;
        }
        if (b.x + b.w >= width) {
          b.x = width - b.w;
          b.vx = -b.vx * bounce;
        }

        // Shelf Platform Collisions ("block utha ke rakhne ka side me")
        const prevY = b.y - b.vy;
        const prevX = b.x - b.vx;

        // Land on shelf top
        if (
          b.y + b.h >= shelf.y &&
          prevY + b.h <= shelf.y + 10 &&
          b.x + b.w > shelf.x &&
          b.x < shelf.x + shelf.w
        ) {
          b.y = shelf.y - b.h;
          b.vy = -b.vy * bounce;
          b.vx *= surfaceFriction;
          if (Math.abs(b.vy) < 0.3) b.vy = 0;
        }
        // Shelf left edge bounce
        else if (
          b.x + b.w >= shelf.x &&
          prevX + b.w <= shelf.x + 8 &&
          b.y + b.h > shelf.y &&
          b.y < shelf.y + shelf.h
        ) {
          b.x = shelf.x - b.w;
          b.vx = -b.vx * bounce;
        }
      }

      // Block-to-Block AABB Collision & Stacking
      for (let i = 0; i < blocks.length; i++) {
        const a = blocks[i];
        for (let j = i + 1; j < blocks.length; j++) {
          const b = blocks[j];

          const aMidX = a.x + a.w / 2;
          const aMidY = a.y + a.h / 2;
          const bMidX = b.x + b.w / 2;
          const bMidY = b.y + b.h / 2;

          const dx = bMidX - aMidX;
          const dy = bMidY - aMidY;

          const halfW = (a.w + b.w) / 2;
          const halfH = (a.h + b.h) / 2;

          const overlapX = halfW - Math.abs(dx);
          const overlapY = halfH - Math.abs(dy);

          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              const sign = dx > 0 ? 1 : -1;
              const push = overlapX * 0.5;
              if (!a.isDragging) a.x -= sign * push;
              if (!b.isDragging) b.x += sign * push;

              const vRel = a.vx - b.vx;
              if (!a.isDragging) a.vx -= vRel * 0.5 * (1 + bounce);
              if (!b.isDragging) b.vx += vRel * 0.5 * (1 + bounce);
            } else {
              const sign = dy > 0 ? 1 : -1;
              const push = overlapY * 0.5;
              if (!a.isDragging) a.y -= sign * push;
              if (!b.isDragging) b.y += sign * push;

              const vRel = a.vy - b.vy;
              if (!a.isDragging) {
                a.vy -= vRel * 0.5 * (1 + bounce);
                a.vx *= surfaceFriction;
              }
              if (!b.isDragging) {
                b.vy += vRel * 0.5 * (1 + bounce);
                b.vx *= surfaceFriction;
              }
            }
          }
        }
      }
    }

    // Helper: Rounded Rect
    function drawRect(c, x, y, w, h, r) {
      if (c.roundRect) {
        c.beginPath();
        c.roundRect(x, y, w, h, r);
        c.fill();
        c.stroke();
      } else {
        c.beginPath();
        c.rect(x, y, w, h);
        c.fill();
        c.stroke();
      }
    }

    // Canvas Render
    function render() {
      ctx.clearRect(0, 0, width, height);

      // Technical Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 20;
      ctx.beginPath();
      for (let x = 0; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Floor baseline
      ctx.strokeStyle = 'rgba(204, 85, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height - 1);
      ctx.lineTo(width, height - 1);
      ctx.stroke();

      // Side Shelf Platform
      // Support brace underneath
      ctx.fillStyle = '#1D211A';
      ctx.strokeStyle = '#32392E';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(shelf.x + 15, shelf.y + shelf.h);
      ctx.lineTo(shelf.x + 15, shelf.y + shelf.h + 20);
      ctx.lineTo(shelf.x + 35, shelf.y + shelf.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shelf plank
      ctx.fillStyle = '#22271F';
      ctx.strokeStyle = '#CC5500';
      ctx.lineWidth = 1.2;
      drawRect(ctx, shelf.x, shelf.y, shelf.w, shelf.h, 2);

      // Shelf Mono Tag
      ctx.fillStyle = '#CC5500';
      ctx.font = '700 8px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('[DOCK_SHELF]', shelf.x + shelf.w - 6, shelf.y - 3);

      // Render Blocks
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];

        ctx.save();
        ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
        const rot = b.isDragging ? 0.04 : Math.max(-0.12, Math.min(0.12, b.vx * 0.02));
        ctx.rotate(rot);

        // Shadow
        if (b.isDragging) {
          ctx.shadowColor = 'rgba(204, 85, 0, 0.4)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetY = 2;
        }

        // Body
        ctx.fillStyle = b.bg;
        ctx.strokeStyle = b.isHovered || b.isDragging ? '#CC5500' : b.border;
        ctx.lineWidth = b.isHovered || b.isDragging ? 2 : 1;
        drawRect(ctx, -b.w / 2, -b.h / 2, b.w, b.h, 3);

        // Subtle top bevel highlight
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-b.w / 2 + 3, -b.h / 2 + 1);
        ctx.lineTo(b.w / 2 - 3, -b.h / 2 + 1);
        ctx.stroke();

        // Monospace technical label (NO EMOJIS)
        ctx.fillStyle = b.text;
        ctx.font = '600 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, 0, 0);

        ctx.restore();
      }

      // Fling momentum vector line
      if (draggedBlock && (Math.abs(flingVx) > 1 || Math.abs(flingVy) > 1)) {
        ctx.strokeStyle = 'rgba(204, 85, 0, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(draggedBlock.x + draggedBlock.w / 2, draggedBlock.y + draggedBlock.h / 2);
        ctx.lineTo(
          draggedBlock.x + draggedBlock.w / 2 + flingVx * 3.5,
          draggedBlock.y + draggedBlock.h / 2 + flingVy * 3.5
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    function animate() {
      if (!animating) return;
      updatePhysics();
      render();
      requestAnimationFrame(animate);
    }

    animate();
  }

  // 14. Tactile Editorial Dark Mode Toggle System
  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    const themeLabel = document.getElementById('theme-toggle-label');
    const mobileThemeLabel = document.getElementById('mobile-theme-text');

    function getCurrentTheme() {
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }

    function applyTheme(theme, animateTransition) {
      if (animateTransition) {
        document.documentElement.classList.add('theme-transitioning');
        window.clearTimeout(window.__themeTransitionTimeout);
        window.__themeTransitionTimeout = window.setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 340);
      }

      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);

      // Update meta theme-color for mobile browser chrome
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#131511' : '#F4F2EC');
      }

      // Update UI button labels
      const isDark = theme === 'dark';
      if (themeLabel) {
        themeLabel.textContent = isDark ? 'LIGHT' : 'DARK';
      }
      if (mobileThemeLabel) {
        mobileThemeLabel.textContent = isDark ? 'SWITCH TO LIGHT MODE' : 'SWITCH TO DARK MODE';
      }

      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      }
      if (mobileThemeBtn) {
        mobileThemeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      }
    }

    // Initialize UI state
    applyTheme(getCurrentTheme(), false);

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (mobileThemeBtn) {
      mobileThemeBtn.addEventListener('click', toggleTheme);
    }

    // Listen to OS system preference changes if user hasn't explicitly selected
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
          applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }
  }

  window.PortfolioInteractions = {
    init: function () {
      initThemeToggle();
      initCustomCursor();
      initSkillsFilter();
      initClipboardCopy();
      initMobileMenu();
      initScrollToTop();
      initContactForm();
      initSkillsSearch();
      initCursorParallax();
      initInteractiveTerminal();
      initTechOrbitCanvas();
      initContactQuickPrompts();
      initTactilePhysicsSandbox();
    }
  };
})();


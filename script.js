/* =========================================================
   ISHAAN DWIVEDI – Portfolio Scripts
   ========================================================= */

'use strict';

// ── Typing effect ──────────────────────────────────────────
const roles = [
  'Full-Stack Engineer',
  'Cloud Architect',
  'Open Source Enthusiast',
  'Problem Solver',
  'System Designer',
];
let roleIdx = 0;
let charIdx = 0;
let deleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 800);
});


// ── Particle canvas ────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 5;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.6 + 0.15);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5
      ? `rgba(0,212,255,${this.alpha})`
      : `rgba(124,58,237,${this.alpha})`;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -5) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => { resize(); });
resize();
initParticles();
animateParticles();


// ── Navbar scroll effect ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});


// ── Hamburger menu ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
const navResume = document.querySelector('.nav-resume-btn');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  if (navResume) navResume.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    if (navResume) navResume.classList.remove('open');
  });
});


// ── Scroll animations (Intersection Observer) ─────────────
const observerOpts = { threshold: 0.15 };

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.timeline-item, .fade-in-up').forEach(el => {
  fadeObserver.observe(el);
});


// ── Back to top ────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── Active nav highlighting ────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchor = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAnchor.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


// ── Contact form (demo) ────────────────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name    = form.querySelector('#name').value.trim();
  const email   = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    status.textContent = '⚠️ Please fill in all fields.';
    status.style.color = '#f59e0b';
    return;
  }

  // Simulate send
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    status.textContent = '✅ Message sent! I\'ll get back to you soon.';
    status.style.color = 'var(--accent3)';
    form.reset();
    setTimeout(() => { status.textContent = ''; }, 5000);
  }, 1400);
});


// ── Skill chips – hover glow ───────────────────────────────
document.querySelectorAll('.skill-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.boxShadow = '0 0 12px rgba(0,212,255,0.25)';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.boxShadow = '';
  });
});


// ── Resume download button ─────────────────────────────────
const dlBtn = document.getElementById('download-resume-btn');
if (dlBtn) {
  dlBtn.addEventListener('click', () => {
    const link = document.getElementById('download-link');
    if (link) link.click();
  });
}


// ── Smooth section reveal on load ─────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

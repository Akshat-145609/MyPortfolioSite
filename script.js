/* ====== CURSOR GLOW ====== */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ====== MOBILE NAV TOGGLE ====== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ====== ACTIVE NAV LINK ON SCROLL ====== */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));

/* ====== COUNTER ANIMATION ====== */
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step  = target / 50;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 30);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ====== REVEAL ON SCROLL ====== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ====== SKILL BARS ====== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.pill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-group').forEach(g => skillObserver.observe(g));

/* ====== SMOOTH TYPED EFFECT FOR HERO TITLE ====== */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTitle.textContent += text[i++];
      setTimeout(type, 35);
    }
  };
  setTimeout(type, 800);
}

/* ====== PARALLAX BLOBS ====== */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.blob').forEach((b, i) => {
    const factor = (i + 1) * 0.5;
    b.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ====== PROJECT CARD 3D TILT ====== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    card.style.transform = `translateY(-6px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ====== GLITCH TEXT EFFECT ON LOGO ====== */
const logo = document.querySelector('.nav-logo');
if (logo) {
  let glitchTimer;
  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'none';
    let count = 0;
    glitchTimer = setInterval(() => {
      logo.style.letterSpacing = (Math.random() * 4 - 2) + 'px';
      if (++count > 8) { clearInterval(glitchTimer); logo.style.letterSpacing = ''; }
    }, 60);
  });
}

// Like Button
  document.querySelector(".like-btn").addEventListener("click", function () {
  
  this.classList.toggle("liked");

  this.innerHTML = this.classList.contains("liked")
    ? "❤️ Liked"
    : "👍 Like";

});

  // Share Button
  document.querySelector(".share-btn").addEventListener("click", function() {
    if (navigator.share) {
      navigator.share({
        title: "My Portfolio",
        text: "Check out my portfolio!",
        url: window.location.href
      });
    } else {
      alert("Sharing not supported. Copy this link: " + window.location.href);
    }
  });
  

function openSitemap() {
    window.location.href = "https://akshat-881236.github.io/SitemapGeneratorXml/";
}
function openGPT() {
    window.location.href = "https://chatgpt.com/g/g-69650dace81481918f8d3eeecb576469-akshat-network-hub";
}
function openPNG() {
    window.location.href = "https://akshat-881236.github.io/Quizzone/pngGenerator.htm";
}
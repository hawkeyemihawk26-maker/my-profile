import './style.css'

// Initialize Lucide Icons
lucide.createIcons();

// GSAP Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Hero Animations
const heroTl = gsap.timeline();
heroTl.from(".hero-title span", {
  y: 100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power4.out"
})
.from(".hero-sub", {
  opacity: 0,
  duration: 0.8
}, "-=0.5");

// 2. Bento Grid 3D Tilt Effect
const bentoItems = document.querySelectorAll('.bento-item');

bentoItems.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(item, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });
  });
  
  item.addEventListener('mouseleave', () => {
    gsap.to(item, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });
});

// 3. Stats Animated Counters
const stats = document.querySelectorAll('.stat-value');

stats.forEach(stat => {
  const target = parseInt(stat.getAttribute('data-target'));
  
  ScrollTrigger.create({
    trigger: stat,
    start: "top 80%",
    onEnter: () => {
      gsap.to(stat, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
        onUpdate: function() {
          stat.innerHTML = Math.ceil(this.targets()[0].innerText).toLocaleString() + "+";
        }
      });
    }
  });
});

// 4. Reveal Animations for sections
gsap.from("#vault .section-title", {
  scrollTrigger: {
    trigger: "#vault",
    start: "top 80%"
  },
  y: 50,
  opacity: 0,
  duration: 1
});

gsap.from(".bento-item", {
  scrollTrigger: {
    trigger: ".bento-grid",
    start: "top 80%"
  },
  scale: 0.9,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "back.out(1.7)"
});

// 5. Brand Hub reveal
gsap.from(".brand-hub", {
  scrollTrigger: {
    trigger: "#brand",
    start: "top 80%"
  },
  y: 100,
  opacity: 0,
  duration: 1.2,
  ease: "power4.out"
});

// 6. Interactive Cursor Glow
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

// Add cursor glow styles dynamically
const style = document.createElement('style');
style.textContent = `
  .cursor-glow {
    position: fixed;
    top: 0;
    left: 0;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 242, 255, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s;
  }
`;
document.head.appendChild(style);

window.addEventListener('mousemove', (e) => {
  gsap.to(glow, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.8,
    ease: "power2.out"
  });
});

import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.8,
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

// 2. Pre-loader & Initial Reveal
const loaderTl = gsap.timeline();
window.addEventListener('load', () => {
    loaderTl.to(".loader-bar", { width: "100%", duration: 0.8, ease: "power2.inOut" })
    .to(".loader-text", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
    .to(".loader", { 
        y: "-100%", 
        duration: 1.2, 
        ease: "power4.inOut", 
        delay: 0.5,
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
            startHeroAnimations();
        }
    });
});

// 3. Hero Animations
function startHeroAnimations() {
    const heroTl = gsap.timeline();
    heroTl.from(".hero-headline span", {
        y: "110%",
        duration: 1.5,
        stagger: 0.15,
        ease: "expo.out"
    })
    .from(".hero-subtext, .year-badge, .scroll-explore", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=1")
    .to(".sticky-nav", { opacity: 1, y: 0, duration: 1 }, "-=0.5");
}

// 4. Custom Cursor with Magnetic Effect
const cursor = document.querySelector('.cursor');
// Create ultra-fast setters for real-time tracking
const xTo = gsap.quickTo(cursor, "x", { duration: 0.01, ease: "none" });
const yTo = gsap.quickTo(cursor, "y", { duration: 0.01, ease: "none" });

window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);

    // Magnetic Elements Logic
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const strength = el.dataset.strength || 40;

        if (distance < 100) {
            gsap.to(el, {
                x: distanceX * (strength / 100),
                y: distanceY * (strength / 100),
                duration: 0.4,
                ease: "power2.out"
            });
            cursor.classList.add('active');
        } else {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            cursor.classList.remove('active');
        }
    });
});

// 5. Section Specific Animations

// Origin Story Pinned Year
gsap.to(".pinned-year", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrub
        pin: ".left-pin",
        anticipatePin: 1
    },
    innerText: 2026,
    opacity: 1, // Fade in to full opacity
    scale: 1.1, // Slight zoom
    "-webkit-text-stroke": "2px rgba(255, 255, 255, 0.4)", // Thicker, brighter stroke
    snap: { innerText: 1 },
    ease: "power1.inOut"
});

// Story Blocks Parallax Reveal
document.querySelectorAll('.story-block').forEach(block => {
    gsap.from(block, {
        scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "top 20%",
            scrub: 1
        },
        opacity: 0,
        y: 100,
        scale: 0.95
    });
});

// Tech Stack staggered reveal with 3D feel
gsap.from(".skill-card", {
    scrollTrigger: {
        trigger: ".skills-section",
        start: "top 60%",
    },
    rotationY: 45,
    transformPerspective: 1000,
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out"
});

// 6. Projects Horizontal Scroll with Image Parallax
const projectsWrapper = document.querySelector('.projects-wrapper');
if (projectsWrapper) {
    const totalWidth = projectsWrapper.scrollWidth - window.innerWidth;
    
    const horizontalScrollTween = gsap.to(projectsWrapper, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-scroll-container",
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // Background parallax inside projects
    document.querySelectorAll('.project-frame').forEach(frame => {
        const bg = frame.querySelector('.project-bg');
        gsap.to(bg, {
            x: "20%",
            ease: "none",
            scrollTrigger: {
                trigger: frame,
                containerAnimation: horizontalScrollTween,
                start: "left right",
                end: "right left",
                scrub: true
            }
        });
    });
}

// 7. Mosaic Grid Reveal with Scale
gsap.from(".mosaic-item", {
    scrollTrigger: {
        trigger: ".mosaic-grid",
        start: "top 80%",
    },
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
    stagger: {
        each: 0.1,
        from: "random"
    },
    ease: "expo.out"
});

// 8. Interactive Elements
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    el.classList.add('magnetic');
});

// Initialize Lucide Icons
if (window.lucide) {
    window.lucide.createIcons();
}

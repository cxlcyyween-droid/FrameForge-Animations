/* ==========================================================================
   animations-data.js — the CSS Animation Library dataset

   Every entry is fully self-contained: its class names and @keyframes are
   uniquely prefixed ("ff-" + a unique slug) so it can run on the page at
   the same time as every other animation without any collisions.

   To add a new animation, just push another object onto ANIMATIONS below —
   nothing else in the app needs to change.

   Fields:
     id          unique slug
     name        display name
     category    one of ANIMATION_CATEGORIES ids (below)
     description short one-line description
     html        the exact markup used for the live preview AND shown in
                  the "View Code" modal
     css         the exact CSS used for the live preview AND shown in the
                  "View Code" modal / copied by "Copy CSS"
   ========================================================================== */

const ANIMATION_CATEGORIES = [
  { id: 'all',        label: 'All',        fullLabel: 'All animations' },
  { id: 'text',       label: 'Text',       fullLabel: 'Text Animations' },
  { id: 'buttons',    label: 'Buttons',    fullLabel: 'Button Animations' },
  { id: 'hover',      label: 'Hover',      fullLabel: 'Hover Effects' },
  { id: 'loading',    label: 'Loading',    fullLabel: 'Loading Animations' },
  { id: 'entrance',   label: 'Entrance',   fullLabel: 'Entrance Animations' },
  { id: 'exit',       label: 'Exit',       fullLabel: 'Exit Animations' },
  { id: 'cards',      label: 'Cards',      fullLabel: 'Card Animations' },
  { id: 'background', label: 'Background', fullLabel: 'Background Animations' },
  { id: 'icons',      label: 'Icons',      fullLabel: 'Icon Animations' }
];

const ANIMATIONS = [

  /* ======================= TEXT ANIMATIONS ======================= */
  {
    id: 'text-typing',
    name: 'Typing Effect',
    category: 'text',
    description: 'A classic typewriter effect with a blinking text cursor.',
    html: `<div class="ff-typing">
  <span class="ff-typing-text">Hello, FrameForge!</span>
</div>`,
    css: `.ff-typing {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #4fd1c5;
}

.ff-typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #4fd1c5;
  width: 0;
  animation:
    ff-typing-type 3.5s steps(19, end) infinite,
    ff-typing-blink 0.75s step-end infinite;
}

@keyframes ff-typing-type {
  0%, 8%   { width: 0; }
  50%, 85% { width: 19ch; }
  100%     { width: 19ch; }
}

@keyframes ff-typing-blink {
  50% { border-color: transparent; }
}`
  },
  {
    id: 'text-glitch',
    name: 'Glitch Text',
    category: 'text',
    description: 'Retro digital distortion effect, looping continuously.',
    html: `<div class="ff-glitch" data-text="GLITCH">GLITCH</div>`,
    css: `.ff-glitch {
  position: relative;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: 2px;
  color: #eef1f8;
}

.ff-glitch::before,
.ff-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.ff-glitch::before {
  color: #4fd1c5;
  clip-path: inset(0 0 55% 0);
  animation: ff-glitch-top 2.5s infinite linear alternate-reverse;
}

.ff-glitch::after {
  color: #f2777a;
  clip-path: inset(55% 0 0 0);
  animation: ff-glitch-bottom 2.5s infinite linear alternate-reverse;
}

@keyframes ff-glitch-top {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-3px, -1px); }
  40%  { transform: translate(3px, 1px); }
  60%  { transform: translate(-2px, 1px); }
  80%  { transform: translate(2px, -1px); }
  100% { transform: translate(0, 0); }
}

@keyframes ff-glitch-bottom {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(3px, 1px); }
  40%  { transform: translate(-3px, -1px); }
  60%  { transform: translate(2px, -1px); }
  80%  { transform: translate(-2px, 1px); }
  100% { transform: translate(0, 0); }
}`
  },
  {
    id: 'text-reveal',
    name: 'Text Reveal',
    category: 'text',
    description: 'Each letter slides up into place in a staggered sequence.',
    html: `<div class="ff-reveal">
  <span>R</span><span>E</span><span>V</span><span>E</span><span>A</span><span>L</span>
</div>`,
    css: `.ff-reveal {
  display: flex;
  gap: 2px;
  overflow: hidden;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #eef1f8;
}

.ff-reveal span {
  display: inline-block;
  animation: ff-reveal-up 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

.ff-reveal span:nth-child(1) { animation-delay: 0s; }
.ff-reveal span:nth-child(2) { animation-delay: 0.1s; }
.ff-reveal span:nth-child(3) { animation-delay: 0.2s; }
.ff-reveal span:nth-child(4) { animation-delay: 0.3s; }
.ff-reveal span:nth-child(5) { animation-delay: 0.4s; }
.ff-reveal span:nth-child(6) { animation-delay: 0.5s; }

@keyframes ff-reveal-up {
  0%, 10%  { transform: translateY(120%); opacity: 0; }
  30%, 70% { transform: translateY(0);    opacity: 1; }
  90%,100% { transform: translateY(-120%); opacity: 0; }
}`
  },

  /* ======================= BUTTON ANIMATIONS ======================= */
  {
    id: 'btn-ripple',
    name: 'Ripple Button',
    category: 'buttons',
    description: 'A material-style ripple that pulses outward automatically.',
    html: `<button class="ff-ripple-btn">
  Click Me
  <span class="ff-ripple"></span>
</button>`,
    css: `.ff-ripple-btn {
  position: relative;
  overflow: hidden;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  background: #4fd1c5;
  color: #04120f;
  font-weight: 700;
}

.ff-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ff-ripple-out 1.8s ease-out infinite;
}

@keyframes ff-ripple-out {
  0%   { width: 10px;  height: 10px;  opacity: 0.6; }
  100% { width: 220px; height: 220px; opacity: 0; }
}`
  },
  {
    id: 'btn-glow',
    name: 'Glow Button',
    category: 'buttons',
    description: 'A soft pulsing glow that breathes around the button.',
    html: `<button class="ff-glow-btn">Glow Button</button>`,
    css: `.ff-glow-btn {
  padding: 12px 28px;
  border: 1px solid #4fd1c5;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 700;
  animation: ff-glow-pulse 2s ease-in-out infinite;
}

@keyframes ff-glow-pulse {
  0%, 100% { box-shadow: 0 0 6px rgba(79, 209, 197, 0.4); }
  50%      { box-shadow: 0 0 26px rgba(79, 209, 197, 0.9); }
}`
  },
  {
    id: 'btn-3d-press',
    name: '3D Press Button',
    category: 'buttons',
    description: 'A chunky 3D button that presses down and springs back.',
    html: `<button class="ff-3d-btn">Press Me</button>`,
    css: `.ff-3d-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  background: #4fd1c5;
  color: #04120f;
  font-weight: 700;
  box-shadow: 0 6px 0 #2f8f86;
  animation: ff-3d-press 1.8s ease-in-out infinite;
}

@keyframes ff-3d-press {
  0%, 80%, 100% { transform: translateY(0);   box-shadow: 0 6px 0 #2f8f86; }
  90%           { transform: translateY(6px); box-shadow: 0 0 0 #2f8f86; }
}`
  },

  /* ======================= HOVER EFFECTS ======================= */
  {
    id: 'hover-scale',
    name: 'Scale Up',
    category: 'hover',
    description: 'The element gently scales and lifts on hover.',
    html: `<div class="ff-scale-card">Hover me</div>`,
    css: `.ff-scale-card {
  padding: 28px 36px;
  border-radius: 14px;
  background: #141a2e;
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #eef1f8;
  font-weight: 600;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}

.ff-scale-card:hover,
.ff-scale-card.ff-preview {
  transform: scale(1.08) translateY(-4px);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.5);
}`
  },
  {
    id: 'hover-shine',
    name: 'Shine Sweep',
    category: 'hover',
    description: 'A light beam sweeps across the surface on hover.',
    html: `<button class="ff-shine-btn">Shine</button>`,
    css: `.ff-shine-btn {
  position: relative;
  overflow: hidden;
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  background: #232b47;
  color: #eef1f8;
  font-weight: 700;
}

.ff-shine-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
}

.ff-shine-btn:hover::after,
.ff-shine-btn.ff-preview::after {
  left: 125%;
}`
  },
  {
    id: 'hover-underline',
    name: 'Underline Reveal',
    category: 'hover',
    description: 'An underline grows in from the left on hover.',
    html: `<a href="#" class="ff-underline-link">Read more</a>`,
    css: `.ff-underline-link {
  position: relative;
  color: #4fd1c5;
  font-weight: 600;
  text-decoration: none;
}

.ff-underline-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: #4fd1c5;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.ff-underline-link:hover::after,
.ff-underline-link.ff-preview::after {
  width: 100%;
}`
  },

  /* ======================= LOADING ANIMATIONS ======================= */
  {
    id: 'load-spinner',
    name: 'Spinner',
    category: 'loading',
    description: 'A classic rotating ring loader.',
    html: `<div class="ff-spinner"></div>`,
    css: `.ff-spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(79, 209, 197, 0.2);
  border-top-color: #4fd1c5;
  border-radius: 50%;
  animation: ff-spin 0.9s linear infinite;
}

@keyframes ff-spin {
  to { transform: rotate(360deg); }
}`
  },
  {
    id: 'load-dots',
    name: 'Dot Pulse',
    category: 'loading',
    description: 'Three dots bounce in sequence, one after another.',
    html: `<div class="ff-dots">
  <span></span><span></span><span></span>
</div>`,
    css: `.ff-dots {
  display: flex;
  gap: 8px;
}

.ff-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4fd1c5;
  animation: ff-dot-bounce 1.2s ease-in-out infinite;
}

.ff-dots span:nth-child(2) { animation-delay: 0.15s; }
.ff-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes ff-dot-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40%           { transform: scale(1);   opacity: 1; }
}`
  },
  {
    id: 'load-bar',
    name: 'Loading Bar',
    category: 'loading',
    description: 'An indeterminate progress bar sliding across its track.',
    html: `<div class="ff-bar-track">
  <div class="ff-bar-fill"></div>
</div>`,
    css: `.ff-bar-track {
  width: 180px;
  height: 8px;
  border-radius: 999px;
  background: #232b47;
  overflow: hidden;
}

.ff-bar-fill {
  width: 40%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #4fd1c5, #8b8ff0);
  animation: ff-bar-slide 1.4s ease-in-out infinite;
}

@keyframes ff-bar-slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}`
  },

  /* ======================= ENTRANCE ANIMATIONS ======================= */
  {
    id: 'enter-fade-up',
    name: 'Fade In Up',
    category: 'entrance',
    description: 'The element fades in while sliding up into place.',
    html: `<div class="ff-fade-up">I fade in</div>`,
    css: `.ff-fade-up {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-fade-up 2.2s ease-in-out infinite;
}

@keyframes ff-fade-up {
  0%       { opacity: 0; transform: translateY(24px); }
  25%, 75% { opacity: 1; transform: translateY(0); }
  100%     { opacity: 0; transform: translateY(24px); }
}`
  },
  {
    id: 'enter-slide-left',
    name: 'Slide In Left',
    category: 'entrance',
    description: 'The element slides in smoothly from the left edge.',
    html: `<div class="ff-slide-left">Sliding in</div>`,
    css: `.ff-slide-left {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-slide-left 2.2s ease-in-out infinite;
}

@keyframes ff-slide-left {
  0%       { opacity: 0; transform: translateX(-60px); }
  25%, 75% { opacity: 1; transform: translateX(0); }
  100%     { opacity: 0; transform: translateX(-60px); }
}`
  },
  {
    id: 'enter-bounce-in',
    name: 'Bounce In',
    category: 'entrance',
    description: 'The element bounces into view with a springy scale.',
    html: `<div class="ff-bounce-in">Boing!</div>`,
    css: `.ff-bounce-in {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-bounce-in 2.4s ease-in-out infinite;
}

@keyframes ff-bounce-in {
  0%       { opacity: 0; transform: scale(0.3); }
  15%      { opacity: 1; transform: scale(1.15); }
  30%      { transform: scale(0.95); }
  45%, 80% { opacity: 1; transform: scale(1); }
  100%     { opacity: 0; transform: scale(0.3); }
}`
  },

  /* ======================= EXIT ANIMATIONS ======================= */
  {
    id: 'exit-fade-out',
    name: 'Fade Out',
    category: 'exit',
    description: 'The element gently fades away, then resets.',
    html: `<div class="ff-fade-out">Goodbye</div>`,
    css: `.ff-fade-out {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-fade-out 2.2s ease-in-out infinite;
}

@keyframes ff-fade-out {
  0%       { opacity: 1; transform: scale(1); }
  60%      { opacity: 0; transform: scale(0.85); }
  100%     { opacity: 0; transform: scale(0.85); }
}`
  },
  {
    id: 'exit-slide-out',
    name: 'Slide Out Right',
    category: 'exit',
    description: 'The element slides away to the right, then resets.',
    html: `<div class="ff-slide-out">Sliding away</div>`,
    css: `.ff-slide-out {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-slide-out 2.2s ease-in-out infinite;
}

@keyframes ff-slide-out {
  0%   { opacity: 1; transform: translateX(0); }
  60%  { opacity: 0; transform: translateX(60px); }
  100% { opacity: 0; transform: translateX(60px); }
}`
  },
  {
    id: 'exit-shrink',
    name: 'Shrink Out',
    category: 'exit',
    description: 'The element shrinks down to nothing, then resets.',
    html: `<div class="ff-shrink-out">Shrinking</div>`,
    css: `.ff-shrink-out {
  padding: 14px 22px;
  border-radius: 10px;
  background: #141a2e;
  color: #eef1f8;
  font-weight: 600;
  animation: ff-shrink-out 2.2s ease-in-out infinite;
}

@keyframes ff-shrink-out {
  0%   { opacity: 1; transform: scale(1); }
  60%  { opacity: 0; transform: scale(0); }
  100% { opacity: 0; transform: scale(0); }
}`
  },

  /* ======================= CARD ANIMATIONS ======================= */
  {
    id: 'card-float',
    name: 'Floating Card',
    category: 'cards',
    description: 'The card gently floats up and down, forever.',
    html: `<div class="ff-float-card">Floating</div>`,
    css: `.ff-float-card {
  padding: 24px 30px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4fd1c5, #8b8ff0);
  color: #04120f;
  font-weight: 700;
  animation: ff-float 3s ease-in-out infinite;
}

@keyframes ff-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}`
  },
  {
    id: 'card-flip',
    name: 'Flip Card',
    category: 'cards',
    description: 'The card flips to reveal its back side on hover.',
    html: `<div class="ff-flip-wrap">
  <div class="ff-flip-card">
    <div class="ff-flip-front">Front</div>
    <div class="ff-flip-back">Back</div>
  </div>
</div>`,
    css: `.ff-flip-wrap {
  perspective: 800px;
}

.ff-flip-card {
  position: relative;
  width: 130px;
  height: 90px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.ff-flip-wrap:hover .ff-flip-card,
.ff-flip-wrap.ff-preview .ff-flip-card {
  transform: rotateY(180deg);
}

.ff-flip-front,
.ff-flip-back {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  backface-visibility: hidden;
  font-weight: 700;
  color: #eef1f8;
}

.ff-flip-front { background: #232b47; }
.ff-flip-back  { background: #4fd1c5; color: #04120f; transform: rotateY(180deg); }`
  },
  {
    id: 'card-glow',
    name: 'Glowing Card',
    category: 'cards',
    description: "The card's border glows and cycles color softly.",
    html: `<div class="ff-glow-card">Glow Card</div>`,
    css: `.ff-glow-card {
  padding: 24px 30px;
  border-radius: 14px;
  background: #141a2e;
  border: 2px solid #4fd1c5;
  color: #eef1f8;
  font-weight: 700;
  animation: ff-card-glow 2.4s ease-in-out infinite;
}

@keyframes ff-card-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(79, 209, 197, 0.35); border-color: #4fd1c5; }
  50%      { box-shadow: 0 0 28px rgba(139, 143, 240, 0.55); border-color: #8b8ff0; }
}`
  },

  /* ======================= BACKGROUND ANIMATIONS ======================= */
  {
    id: 'bg-gradient',
    name: 'Animated Gradient',
    category: 'background',
    description: 'A smooth, continuously shifting gradient background.',
    html: `<div class="ff-gradient-bg"></div>`,
    css: `.ff-gradient-bg {
  width: 100%;
  height: 90px;
  border-radius: 14px;
  background: linear-gradient(270deg, #4fd1c5, #8b8ff0, #f2b866, #4fd1c5);
  background-size: 600% 600%;
  animation: ff-gradient-shift 6s ease infinite;
}

@keyframes ff-gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`
  },
  {
    id: 'bg-shapes',
    name: 'Floating Shapes',
    category: 'background',
    description: 'Soft, blurred shapes drift slowly across the background.',
    html: `<div class="ff-shapes-bg">
  <span></span><span></span><span></span>
</div>`,
    css: `.ff-shapes-bg {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 14px;
  background: #141a2e;
  overflow: hidden;
}

.ff-shapes-bg span {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.7;
  animation: ff-shape-drift 5s ease-in-out infinite;
}

.ff-shapes-bg span:nth-child(1) { width: 40px; height: 40px; background: #4fd1c5; left: 10%; top: 20%; }
.ff-shapes-bg span:nth-child(2) { width: 26px; height: 26px; background: #8b8ff0; left: 50%; top: 50%; animation-delay: 1s; }
.ff-shapes-bg span:nth-child(3) { width: 32px; height: 32px; background: #f2b866; left: 75%; top: 15%; animation-delay: 2s; }

@keyframes ff-shape-drift {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(10px, -16px); }
}`
  },
  {
    id: 'bg-stripes',
    name: 'Moving Stripes',
    category: 'background',
    description: 'Diagonal stripes glide continuously across the surface.',
    html: `<div class="ff-stripes-bg"></div>`,
    css: `.ff-stripes-bg {
  width: 100%;
  height: 90px;
  border-radius: 14px;
  background-color: #141a2e;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(79, 209, 197, 0.25) 0 10px,
    transparent 10px 20px
  );
  background-size: 56px 56px;
  animation: ff-stripes-move 2s linear infinite;
}

@keyframes ff-stripes-move {
  0%   { background-position: 0 0; }
  100% { background-position: 56px 0; }
}`
  },

  /* ======================= ICON ANIMATIONS ======================= */
  {
    id: 'icon-shake',
    name: 'Shake Icon',
    category: 'icons',
    description: 'The icon shakes side to side to grab attention.',
    html: `<div class="ff-icon-shake">🔔</div>`,
    css: `.ff-icon-shake {
  display: inline-block;
  font-size: 2.2rem;
  animation: ff-shake 1.6s ease-in-out infinite;
}

@keyframes ff-shake {
  0%, 100% { transform: rotate(0); }
  10%      { transform: rotate(-14deg); }
  20%      { transform: rotate(12deg); }
  30%      { transform: rotate(-10deg); }
  40%      { transform: rotate(8deg); }
  50%      { transform: rotate(-4deg); }
  60%      { transform: rotate(0); }
}`
  },
  {
    id: 'icon-spin',
    name: 'Spin Icon',
    category: 'icons',
    description: 'The icon rotates continuously at a steady pace.',
    html: `<div class="ff-icon-spin">⚙️</div>`,
    css: `.ff-icon-spin {
  display: inline-block;
  font-size: 2.2rem;
  animation: ff-icon-spin 2.5s linear infinite;
}

@keyframes ff-icon-spin {
  to { transform: rotate(360deg); }
}`
  },
  {
    id: 'icon-pulse-glow',
    name: 'Pulse Glow Icon',
    category: 'icons',
    description: 'The icon pulses in size with a soft glowing halo.',
    html: `<div class="ff-icon-pulse">❤️</div>`,
    css: `.ff-icon-pulse {
  display: inline-block;
  font-size: 2.2rem;
  animation: ff-icon-pulse 1.4s ease-in-out infinite;
}

@keyframes ff-icon-pulse {
  0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 2px rgba(242, 119, 122, 0.5)); }
  50%      { transform: scale(1.25); filter: drop-shadow(0 0 14px rgba(242, 119, 122, 0.9)); }
}`
  }
];

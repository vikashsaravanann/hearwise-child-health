import re

# 1. Update index.html
with open('index.html', 'r') as f:
    html = f.read()

html = re.sub(
    r'<meta name="viewport".*?>', 
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />', 
    html
)
with open('index.html', 'w') as f:
    f.write(html)

# 2. Update index.css
with open('src/index.css', 'r') as f:
    css = f.read()

global_styles = """/* ============================================
   HEARWISE — GLOBAL MOBILE-FIRST BASE STYLES
   ============================================ */

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  /* Fluid font scaling: 14px on mobile → 16px on desktop */
  font-size: clamp(14px, 2vw, 16px);
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
  width: 100%;
  min-width: 320px;
}

/* Prevent any element from overflowing on mobile */
img, video, canvas, svg {
  max-width: 100%;
  height: auto;
}

/* Fix iOS tap highlight */
button, a, [role="button"] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Minimum touch target size — 44px (Apple HIG standard) */
button, a, input[type="button"], input[type="submit"] {
  min-height: 44px;
}

/* Fix horizontal scroll caused by full-width sections */
section, div, main {
  max-width: 100vw;
}

/* Fluid heading sizes */
h1 { font-size: clamp(1.75rem, 6vw, 4.5rem); }
h2 { font-size: clamp(1.4rem, 4vw, 3rem); }
h3 { font-size: clamp(1.1rem, 3vw, 1.75rem); }
h4 { font-size: clamp(1rem, 2.5vw, 1.25rem); }
p  { font-size: clamp(0.875rem, 1.8vw, 1rem); line-height: 1.65; }

/* Scrollbar styling for desktop */
@media (min-width: 1024px) {
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #020817; }
  ::-webkit-scrollbar-thumb { background: #14b8a6; border-radius: 3px; }
}

/* Custom breakpoint helpers (use with Tailwind) */
/* xs: 320px | sm: 480px | md: 768px | lg: 1024px | xl: 1280px */

"""

if "HEARWISE — GLOBAL MOBILE-FIRST BASE STYLES" not in css:
    css = global_styles + css
    with open('src/index.css', 'w') as f:
        f.write(css)

# 3. Update tailwind.config.ts
with open('tailwind.config.ts', 'r') as f:
    tw = f.read()

# Add screens and spacing if not exists
if "'xs': '320px'" not in tw:
    screens_spacing = """
      screens: {
        'xs': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
"""
    tw = tw.replace('extend: {', 'extend: {' + screens_spacing)
    with open('tailwind.config.ts', 'w') as f:
        f.write(tw)

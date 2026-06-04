import os
import glob
import re

PAGES_DIR = 'src/pages'
COMPONENTS_DIR = 'src/components'

def update_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content, flags=re.DOTALL)
        
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {path}")

def phase6_login():
    path = os.path.join(PAGES_DIR, 'Login.tsx')
    if not os.path.exists(path): return
    
    replacements = [
        # Reduce padding on mobile
        (r'px-12 py-16', r'px-6 sm:px-12 py-8 sm:py-16'),
        # OTP inputs larger on mobile
        (r'className="w-10 h-12 rounded-lg', r'className="w-10 h-12 sm:w-11 sm:h-14 rounded-xl'),
        # Pill Tab text size
        (r'text-\[13px\]', r'text-xs sm:text-[13px]')
    ]
    update_file(path, replacements)

def phase5_ocean_test():
    path = os.path.join(PAGES_DIR, 'OceanTestPage.tsx')
    if not os.path.exists(path): return
    
    replacements = [
        # Larger touch targets for left/right
        (r'p-6 rounded-\[2\.5rem\]', r'py-6 sm:py-8 px-4 rounded-3xl sm:rounded-[2.5rem]'),
        (r'text-2xl md:text-3xl font-black', r'text-xl sm:text-2xl md:text-3xl font-black'),
        # Top padding for fixed nav
        (r'min-h-screen px-4 py-20', r'min-h-screen px-4 pt-24 pb-20')
    ]
    update_file(path, replacements)

def phase5_active_test():
    path = os.path.join(PAGES_DIR, 'ActiveTestPage.tsx')
    if not os.path.exists(path): return
    
    replacements = [
        # Touch pearl scaling
        (r'h-44 w-44', r'h-36 w-36 sm:h-44 sm:w-44'),
        (r'h-24 w-24', r'h-20 w-20 sm:h-24 sm:w-24'),
        # Top padding
        (r'pt-6 flex justify-between', r'pt-20 pb-4 flex justify-between')
    ]
    update_file(path, replacements)

def phase8_dashboard():
    path = os.path.join(PAGES_DIR, 'Dashboard.tsx')
    if not os.path.exists(path): return
    
    replacements = [
        # Sidebar to top bar on mobile
        (r'className="w-64 bg-black/40', r'className="lg:w-64 w-full bg-black/40'),
        (r'min-h-screen bg-\[\#020817\] text-white flex"', r'min-h-screen bg-[#020817] text-white flex flex-col lg:flex-row"'),
        (r'className="flex-1 flex flex-col overflow-hidden"', r'className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0"'),
        # Stats Grid
        (r'grid-cols-1 md:grid-cols-2 lg:grid-cols-4', r'grid-cols-2 lg:grid-cols-4'),
        # Stats padding
        (r'p-6 rounded-2xl', r'p-4 sm:p-6 rounded-2xl'),
        (r'text-sm text-slate-400 font-semibold', r'text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-widest')
    ]
    update_file(path, replacements)

def phase9_hearbot():
    path = os.path.join(COMPONENTS_DIR, 'HearBot.tsx')
    if not os.path.exists(path): return
    
    replacements = [
        # Chat window sizing
        (r'w-\[380px\]', r'w-[calc(100vw-24px)] sm:w-[380px]'),
        (r'h-\[600px\]', r'h-[min(540px,calc(100vh-120px))] sm:h-[600px]'),
        # Floating button
        (r'w-16 h-16', r'w-14 h-14 sm:w-16 sm:h-16')
    ]
    update_file(path, replacements)

def phase10_lazy_load():
    # We will do this globally across all tsx
    for root, _, files in os.walk('src'):
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Simple heuristic: add loading="lazy" decoding="async" to <img ... >
                # Only if not already present and not eager
                if '<img' in content:
                    def replace_img(match):
                        img_tag = match.group(0)
                        if 'loading=' not in img_tag:
                            # Avoid adding if it's the logo in Navbar or LandingPage hero
                            if 'owlMascot' in img_tag or 'logo' in img_tag.lower():
                                return img_tag.replace('<img', '<img loading="eager"')
                            return img_tag.replace('<img', '<img loading="lazy" decoding="async"')
                        return img_tag
                    
                    new_content = re.sub(r'<img[^>]+>', replace_img, content)
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Lazy loaded images in {path}")

def phase7_global_rules():
    # We will apply R2-R7 (fluid text, padding, grid) where obvious
    for root, _, files in os.walk(PAGES_DIR):
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                # R3: Fluid Headings
                new_content = re.sub(r'text-3xl(?!\s+sm:)', r'text-2xl sm:text-3xl', new_content)
                new_content = re.sub(r'text-4xl(?!\s+sm:)', r'text-3xl sm:text-4xl', new_content)
                new_content = re.sub(r'text-5xl(?!\s+md:)', r'text-4xl md:text-5xl', new_content)
                
                # R4: Padding
                new_content = re.sub(r'p-6(?!\s+sm:)', r'p-5 sm:p-6', new_content)
                new_content = re.sub(r'p-8(?!\s+sm:)', r'p-6 sm:p-8', new_content)
                
                # R2: Grid
                # If we see grid-cols-2 without md:, we add md:
                new_content = re.sub(r'grid-cols-2(?!\s+lg:|\s+md:)', r'grid-cols-1 sm:grid-cols-2', new_content)
                new_content = re.sub(r'grid-cols-3(?!\s+lg:|\s+md:)', r'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', new_content)
                
                # R8: Table overflow wrapper
                if '<table' in new_content and 'overflow-x-auto' not in new_content:
                    new_content = re.sub(r'(<table[^>]*>.*?</table>)', r'<div className="overflow-x-auto w-full -mx-4 sm:mx-0">\1</div>', new_content, flags=re.DOTALL)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Applied R1-R10 rules to {path}")

if __name__ == '__main__':
    phase6_login()
    phase5_ocean_test()
    phase5_active_test()
    phase8_dashboard()
    phase9_hearbot()
    phase7_global_rules()
    phase10_lazy_load()
    print("All phases completed.")

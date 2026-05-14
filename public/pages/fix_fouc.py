import os
import glob

css_file = r"d:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\css\style.css"
about_file = r"d:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\pages\about.html"
pages_dir = r"d:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\pages"

# Replace in style.css
with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace('body.dark-mode', 'html.dark-mode')
css_content = css_content.replace('body:not(.dark-mode)', 'html:not(.dark-mode)')

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Updated style.css")

# Replace in about.html
with open(about_file, 'r', encoding='utf-8') as f:
    about_content = f.read()

about_content = about_content.replace('body:not(.dark-mode)', 'html:not(.dark-mode)')

with open(about_file, 'w', encoding='utf-8') as f:
    f.write(about_content)

print("Updated about.html")

# Inject inline script to ALL html files in public/pages
html_files = glob.glob(os.path.join(pages_dir, '*.html'))

inline_script = """<script>
        (function() {
            const theme = localStorage.getItem('an-luxury-theme') || 'dark';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark-mode');
            }
        })();
    </script>
</head>"""

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if script is already there
    if "localStorage.getItem('an-luxury-theme')" not in content[:2000]: # check head area
        new_content = content.replace("</head>", inline_script)
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected FOUC script into {os.path.basename(file_path)}")


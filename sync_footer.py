import os
import re

html_dir = r"f:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\pages"
index_path = os.path.join(html_dir, 'index.html')

with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

footer_match = re.search(r'(<footer class="footer">.*?</footer>)', index_content, flags=re.DOTALL)
if not footer_match:
    print("Could not find footer in index.html")
    exit(1)

good_footer = footer_match.group(1)

for filename in os.listdir(html_dir):
    if filename.endswith('.html') and filename != 'index.html':
        filepath = os.path.join(html_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content, count = re.subn(r'<footer[^>]*>.*?</footer>', good_footer, content, flags=re.DOTALL)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Synced footer in {filename}")
        else:
            print(f"No footer found to replace in {filename}")

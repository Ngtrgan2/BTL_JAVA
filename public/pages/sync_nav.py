import os
import re
import glob

html_dir = r"d:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\pages"

# Get theme button from index.html
with open(os.path.join(html_dir, 'index.html'), 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract button block
match = re.search(r'(<!-- Theme Toggle Button -->.*?</button>)', index_content, re.DOTALL)
if not match:
    print("Could not find theme button in index.html")
    exit(1)
theme_btn_code = match.group(1)

# Find all html files
html_files = glob.glob(os.path.join(html_dir, '*.html'))

for file_path in html_files:
    if os.path.basename(file_path) in ['index.html', 'index_temp.html']:
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # 1. Add theme toggle button
    if 'id="theme-toggle"' not in content:
        # Find the end of nav-icons container
        # Typically looks like:
        # <div class="nav-icon"><a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a><span class="cart-count">0</span></div>
        # </div>
        # </div>
        # <!-- Collapsed Menu Icon -->
        
        # Regex to find the last closing div of nav-icons, right before the closing div of the header-container
        # We look for "cart.html" or "fa-cart-shopping" block, then its closing div, then the next closing div
        
        # Actually, simpler: replace the exact closing sequence of nav-icons
        # We can find `            </div>\n        </div>\n        <!-- Collapsed Menu Icon -->`
        # and insert the button right before the first `</div>`
        pattern = r'(\s*)</div>\s*</div>\s*<!-- Collapsed Menu Icon -->'
        def repl(m):
            indent = m.group(1)
            # We want to add the button with the same indentation, plus 4 spaces
            button_indented = theme_btn_code.replace('\n', '\n' + indent + '    ')
            return f"{indent}    {button_indented}\n{indent}</div>\n        </div>\n        <!-- Collapsed Menu Icon -->"

        new_content, count = re.subn(pattern, repl, content, count=1)
        if count > 0:
            content = new_content
            modified = True
            print(f"Added theme button to {os.path.basename(file_path)}")
        else:
            print(f"Warning: Could not find insertion point for button in {os.path.basename(file_path)}")
    
    # 2. Add theme.js script
    if 'theme.js' not in content:
        script_tag = '<script src="../js/theme.js"></script>\n</body>'
        new_content, count = re.subn(r'</body>', script_tag, content, count=1)
        if count > 0:
            content = new_content
            modified = True
            print(f"Added theme.js to {os.path.basename(file_path)}")
        else:
            print(f"Warning: Could not find </body> in {os.path.basename(file_path)}")
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

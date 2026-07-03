import os
import re

project_dir = "/Users/jinholee/.gemini/antigravity/scratch/hebrew-learning-app"
index_path = os.path.join(project_dir, "index.html")
style_path = os.path.join(project_dir, "style.css")
data_path = os.path.join(project_dir, "data/hebrew_data.js")
chapters_path = os.path.join(project_dir, "data/chapters_text.js")
app_path = os.path.join(project_dir, "app.js")
output_path = os.path.join(project_dir, "hebrew_learning_ipad.html")

print("Building single file for iPad Playgrounds...")

# Read components
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(style_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(data_path, "r", encoding="utf-8") as f:
    hebrew_data = f.read()

with open(chapters_path, "r", encoding="utf-8") as f:
    chapters_text = f.read()

with open(app_path, "r", encoding="utf-8") as f:
    app_js = f.read()

# Inline CSS
css_tag = f"<style>\n{css}\n</style>"
# Use lambda replacement to avoid backslash escaping issues
html = re.sub(r'<link rel="stylesheet" href="style\.css">', lambda m: css_tag, html)

# Inline JS
js_content = ""
js_content += f"<script>\n{hebrew_data}\n</script>\n"
js_content += f"<script>\n{chapters_text}\n</script>\n"
js_content += f"<script>\n{app_js}\n</script>\n"

# Replace script tags at the bottom using lambda
script_regex = r'<script src="data/hebrew_data\.js"></script>\s*<script src="data/chapters_text\.js"></script>\s*<script src="app\.js"></script>'
html = re.sub(script_regex, lambda m: js_content, html)

# Write output
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Successfully built single integrated file at: {output_path}")

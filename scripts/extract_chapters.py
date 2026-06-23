import os
import glob
import pypdf
import json
import re

pdf_dir = "/Users/jinholee/Documents/Codex/2026-05-18/files-mentioned-by-the-user-300/outputs/hebrew-study-plan/chapters/"
output_js = "/Users/jinholee/.gemini/antigravity/scratch/hebrew-learning-app/data/chapters_text.js"

# List of chapter PDF files in logical order
chapter_files = [
    ("1부_01_히브리어의 유전자_PDF22-30.pdf", "ch1"),
    ("1부_02_히브리어 자음_PDF31-72.pdf", "ch2"),
    ("1부_03_히브리어 모음_PDF73-95.pdf", "ch3"),
    ("1부_04_음절 개념_PDF96-104.pdf", "ch4"),
    ("1부_05_액센트 법칙_PDF105-117.pdf", "ch5"),
    ("2부_00_히브리어의 뼈대 개요_PDF118-124.pdf", "ch6"),
    ("2부_01_정관사와 접속사_PDF125-129.pdf", "ch7"),
    ("2부_02_명사(형용사) 변화_PDF130-166.pdf", "ch8"),
    ("2부_03_인칭대명사_PDF167-185.pdf", "ch9"),
    ("2부_04_지시대명사_PDF186-186.pdf", "ch10"),
    ("2부_05_동사_PDF187-348.pdf", "ch11"),
    ("3부_00_히브리어의 살 개요_PDF349-350.pdf", "ch12"),
    ("3부_01_명사_ 추가적 사항들_PDF351-363.pdf", "ch13"),
    ("3부_02_동사_ 상태 동사_PDF364-367.pdf", "ch14"),
    ("3부_03_동사_ 약동사_PDF368-482.pdf", "ch15"),
]

def clean_text(text):
    # Basic PDF extraction cleanup
    # Fix broken Korean spellings from PDF extraction
    text = text.replace("명At", "명사")
    text = text.replace("명人H", "명사")
    text = text.replace("명人", "명사")
    text = text.replace("동 사", "동사")
    text = text.replace("사호띨로", "사항들로")
    text = text.replace("소릿 값", "소릿값")
    text = text.replace("알파뱃", "알파벳")
    text = text.replace("흡사하기 때문에", "흡사하기 때문에")
    
    # Fix spaces inserted between Korean characters (e.g. "합 니다" -> "합니다")
    # This regex looks for a Korean character followed by a space, followed by another Korean character
    # that commonly ends words or grammatical particles.
    text = re.sub(r'([가-힣])\s+(니다|니다만|니다며|니다만은|니다가|니다로|니다는|니다를|니다에|니다와|니다과|니다가)', r'\1\2', text)
    text = re.sub(r'([가-힣])\s+(합니다|적입니다|들입니다|것입니다|합니다만|하겠습|하겠습니|습니)', r'\1\2', text)
    text = re.sub(r'(합|습)\s+(니다)', r'\1\2', text)
    text = re.sub(r'(이|하)\s+(였습니다|였다|였다면|여서|여)', r'\1\2', text)
    
    # Replace multiple spaces with a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Replace multiple newlines with double newlines for paragraph spacing
    text = re.sub(r'\n+', '\n', text)
    
    return text.strip()

chapters_data = {}

print("Extracting and cleaning text from PDFs...")
for filename, ch_key in chapter_files:
    filepath = os.path.join(pdf_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        chapters_data[ch_key] = f"설명 파일을 찾을 수 없습니다: {filename}"
        continue
        
    try:
        reader = pypdf.PdfReader(filepath)
        print(f"Processing {filename} ({len(reader.pages)} pages)...")
        pages_content = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            cleaned_page = clean_text(page_text)
            pages_content.append(f"### Page {i+1}\n\n{cleaned_page}")
        
        chapters_data[ch_key] = "\n\n".join(pages_content)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        chapters_data[ch_key] = f"텍스트 추출 중 오류가 발생했습니다: {e}"

# Write to JS file
with open(output_js, "w", encoding="utf-8") as f:
    f.write("/**\n * Auto-generated chapter explanations extracted from PDF\n */\n\n")
    f.write("const CHAPTERS_TEXT = ")
    json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    f.write(";\n\n")
    f.write("if (typeof module !== 'undefined' && module.exports) {\n")
    f.write("  module.exports = CHAPTERS_TEXT;\n")
    f.write("} else {\n")
    f.write("  window.CHAPTERS_TEXT = CHAPTERS_TEXT;\n")
    f.write("}\n")

print(f"Successfully wrote clean text data to {output_js}!")

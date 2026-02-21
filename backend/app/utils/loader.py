import pdfplumber

def extract_text_from_pdf(file_path:str)->str:
    text = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            content = page.extract_text()
            if content:
                text.append(content)
    
    return "\n".join(text)
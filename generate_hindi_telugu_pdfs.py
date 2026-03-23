"""
Generate simple PDF lesson files for Hindi and Telugu subjects.
These are minimal valid PDFs with lesson content text.
"""
import os

UPLOADS_DIR = r"C:\Users\sande\AndroidStudioProjects\ruralquest_backend\uploads"

def create_simple_pdf(filepath, title, content_lines):
    """Create a minimal valid PDF file with text content."""
    # Build text content
    text_objects = ""
    y_pos = 750
    
    # Title
    text_objects += f"BT /F1 24 Tf 50 {y_pos} Td ({title}) Tj ET\n"
    y_pos -= 40
    
    # Separator line
    text_objects += f"BT /F1 12 Tf 50 {y_pos} Td ({'='*60}) Tj ET\n"
    y_pos -= 30
    
    # Content lines
    for line in content_lines:
        # Escape special PDF characters
        safe_line = line.replace("(", "\\(").replace(")", "\\)").replace("\\", "\\\\")
        text_objects += f"BT /F1 12 Tf 50 {y_pos} Td ({safe_line}) Tj ET\n"
        y_pos -= 20
        if y_pos < 50:
            break
    
    # Build PDF structure
    stream_content = text_objects.encode('latin-1', errors='replace')
    stream_length = len(stream_content)
    
    pdf_content = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length {stream_length} >>
stream
{text_objects}endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
%%EOF"""
    
    with open(filepath, 'w', encoding='latin-1') as f:
        f.write(pdf_content)

# Hindi chapters for Grades 8, 9, 10
hindi_chapters = {
    "8": [
        ("vasant_-_chapter_1", "Hindi - Vasant Chapter 1", [
            "Vasant - Adhyay 1",
            "",
            "This chapter introduces students to Hindi literature.",
            "Key concepts covered in this lesson:",
            "- Reading comprehension in Hindi",
            "- Vocabulary building",
            "- Grammar fundamentals",
            "- Story analysis and interpretation",
            "",
            "Learning Objectives:",
            "1. Understand the main theme of the chapter",
            "2. Identify key characters and their roles",
            "3. Practice Hindi writing skills",
            "4. Improve pronunciation and fluency",
        ]),
        ("vasant_-_chapter_2", "Hindi - Vasant Chapter 2", [
            "Vasant - Adhyay 2",
            "",
            "This chapter builds on foundational Hindi skills.",
            "Topics covered:",
            "- Advanced sentence structures",
            "- Poetry appreciation",
            "- Essay writing techniques",
            "- Comprehension passages",
        ]),
        ("vasant_-_chapter_3", "Hindi - Vasant Chapter 3", [
            "Vasant - Adhyay 3",
            "",
            "This chapter explores Hindi prose and poetry.",
            "Key areas:",
            "- Literary devices in Hindi",
            "- Grammar - Sandhi and Samas",
            "- Letter writing format",
            "- Dialogue completion",
        ]),
        ("vasant_-_chapter_4", "Hindi - Vasant Chapter 4", [
            "Vasant - Adhyay 4",
            "",
            "Focus on advanced Hindi comprehension.",
            "Topics:",
            "- Unseen passages",
            "- Hindi idioms and proverbs",
            "- Creative writing",
            "- Oral communication skills",
        ]),
        ("vasant_-_chapter_5", "Hindi - Vasant Chapter 5", [
            "Vasant - Adhyay 5",
            "",
            "Revision and practice chapter.",
            "Review topics:",
            "- Summary writing",
            "- Grammar revision",
            "- Practice exercises",
            "- Sample questions and answers",
        ]),
    ],
}

# Telugu chapters for Grades 8, 9, 10
telugu_chapters = {
    "8": [
        ("telugu_chapter_1", "Telugu - Chapter 1", [
            "Telugu Paatham 1",
            "",
            "Introduction to Telugu literature and language.",
            "This lesson covers:",
            "- Telugu alphabet and pronunciation",
            "- Basic sentence formation",
            "- Reading comprehension",
            "- Vocabulary development",
            "",
            "Learning Goals:",
            "1. Read and understand Telugu prose",
            "2. Write simple sentences in Telugu",
            "3. Identify parts of speech",
            "4. Practice conversation skills",
        ]),
        ("telugu_chapter_2", "Telugu - Chapter 2", [
            "Telugu Paatham 2",
            "",
            "Building Telugu language skills.",
            "Topics covered:",
            "- Advanced grammar concepts",
            "- Poetry analysis",
            "- Essay writing in Telugu",
            "- Comprehension exercises",
        ]),
        ("telugu_chapter_3", "Telugu - Chapter 3", [
            "Telugu Paatham 3",
            "",
            "Telugu prose and literary appreciation.",
            "Key concepts:",
            "- Story comprehension",
            "- Character analysis",
            "- Literary devices",
            "- Writing practice",
        ]),
        ("telugu_chapter_4", "Telugu - Chapter 4", [
            "Telugu Paatham 4",
            "",
            "Advanced Telugu language concepts.",
            "Focus areas:",
            "- Complex sentence structures",
            "- Telugu idioms",
            "- Translation exercises",
            "- Formal writing",
        ]),
        ("telugu_chapter_5", "Telugu - Chapter 5", [
            "Telugu Paatham 5",
            "",
            "Revision and assessment preparation.",
            "Review:",
            "- Grammar revision",
            "- Practice passages",
            "- Sample answers",
            "- Exam preparation tips",
        ]),
    ],
}

def main():
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    count = 0
    
    # Generate Hindi PDFs for grades 8, 9, 10
    for grade in ["8", "9", "10"]:
        chapters = hindi_chapters.get("8")  # Use same content template
        for ch_name, ch_title, ch_content in chapters:
            filename = f"hindi_{grade}_{ch_name}.pdf"
            filepath = os.path.join(UPLOADS_DIR, filename)
            if not os.path.exists(filepath):
                grade_title = f"Grade {grade} - {ch_title}"
                create_simple_pdf(filepath, grade_title, ch_content)
                print(f"Created: {filename}")
                count += 1
            else:
                print(f"Exists: {filename}")
    
    # Generate Telugu PDFs for grades 8, 9, 10
    for grade in ["8", "9", "10"]:
        chapters = telugu_chapters.get("8")  # Use same content template
        for ch_name, ch_title, ch_content in chapters:
            filename = f"telugu_{grade}_{ch_name}.pdf"
            filepath = os.path.join(UPLOADS_DIR, filename)
            if not os.path.exists(filepath):
                grade_title = f"Grade {grade} - {ch_title}"
                create_simple_pdf(filepath, grade_title, ch_content)
                print(f"Created: {filename}")
                count += 1
            else:
                print(f"Exists: {filename}")
    
    print(f"\nDone! Created {count} new PDF files.")

if __name__ == "__main__":
    main()

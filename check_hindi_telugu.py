import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_NAME = os.getenv("MYSQL_DB", "ruralquest_db")

def check_hindi_telugu():
    try:
        db = MySQLdb.connect(host=DB_HOST, user=DB_USER, passwd=DB_PASSWORD, db=DB_NAME)
        cur = db.cursor()
        
        cur.execute("""
            SELECT s.grade, s.title, c.title, c.pdf_url 
            FROM subjects s 
            JOIN chapters c ON s.id = c.subject_id 
            WHERE s.title IN ('Hindi', 'Telugu')
            ORDER BY s.grade, s.title, c.chapter_number
        """)
        results = cur.fetchall()
        
        uploads = r"C:\Users\sande\AndroidStudioProjects\ruralquest_backend\uploads"
        
        for res in results:
            pdf_filename = res[3].replace("/api/pdfs/", "") if res[3] else "NONE"
            exists = os.path.exists(os.path.join(uploads, pdf_filename)) if res[3] else False
            status = "OK" if exists else "MISSING"
            print(f"[{status}] Grade {res[0]} | {res[1]} | {res[2]} -> {res[3]}")
            
        cur.close()
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_hindi_telugu()

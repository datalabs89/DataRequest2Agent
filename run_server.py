import os
import sys

# Force UTF-8 on Windows stdout
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

if __name__ == "__main__":
    import uvicorn
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    sys.path.insert(0, backend_dir)
    os.chdir(base_dir)

    print("=" * 65)
    print("Menjalankan DataRequestStudio Server...")
    print("Buka browser Anda di: http://127.0.0.1:8000")
    print("=" * 65)

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=False)

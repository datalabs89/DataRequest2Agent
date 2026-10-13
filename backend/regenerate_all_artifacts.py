import os
import sys
import base64
import json
import re
import shutil

# Tambahkan backend ke sys.path
sys.path.insert(0, os.path.dirname(__file__))

from coordinator import PipelineCoordinator
from cod_generator import CertificateOfDestructionGenerator

def run():
    print("=== REGENERATING ALL PIPELINE ARTIFACTS (EXCEL 4-SHEETS + SUBTOTAL + NO UNDERLINE) ===")
    coordinator = PipelineCoordinator()
    
    samples = [
        ("samples/Permohonan_Data_Internal_Bea_dan_Cukai.pdf", "REQ-2026-BC-089", "20261011_221106"),
        ("samples/Permohonan_Data_Internal_Kemenkeu.pdf", "REQ-2026-KMK-114", "20261011_221106"),
        ("samples/Permohonan_Data_Eksternal_Kemenkeu.pdf", "REQ-2026-EKS-042", "20261011_221106"),
    ]
    
    generated_certs = {}
    
    for sample_path, req_id, ts in samples:
        safe_id = req_id.replace("-", "_")
        mock_cert_filename = f"Sertifikat_Otorisasi_{safe_id}_{ts}.pdf"
        mock_excel_filename = f"DataExport_{safe_id}_{ts}.xlsx"
        mock_csv_filename = f"DataExport_{safe_id}_{ts}.csv"
        mock_json_filename = f"DataExport_{safe_id}_{ts}.json"
        mock_zip_filename = f"DataFulfillment_{safe_id}_{ts}.zip"
        
        print(f"\nProcessing {req_id} ({sample_path})...")
        res = coordinator.process_request(sample_path)
        cert_path = res.execution.certificate_path
        excel_path = res.execution.excel_path
        csv_path = res.execution.csv_path
        json_path = res.execution.json_path
        zip_path = res.execution.zip_path
        
        print(f"  Generated cert at : {cert_path}")
        print(f"  Generated excel at: {excel_path}")
        
        # Salin ke frontend/outputs/
        frontend_out_dir = os.path.join("frontend", "outputs")
        os.makedirs(frontend_out_dir, exist_ok=True)
        
        # 1. Sertifikat PDF
        target_cert = os.path.join(frontend_out_dir, mock_cert_filename)
        shutil.copyfile(cert_path, target_cert)
        with open(target_cert, "rb") as f:
            pdf_bytes = f.read()
        generated_certs[mock_cert_filename] = base64.b64encode(pdf_bytes).decode("ascii")
        
        # 2. Excel Multi-Sheet (dengan Sheet 4 Profiling & Subtotal)
        target_excel = os.path.join(frontend_out_dir, mock_excel_filename)
        shutil.copyfile(excel_path, target_excel)
        print(f"  Saved Excel to {target_excel}")
        
        # 3. CSV & JSON
        target_csv = os.path.join(frontend_out_dir, mock_csv_filename)
        shutil.copyfile(csv_path, target_csv)
        target_json = os.path.join(frontend_out_dir, mock_json_filename)
        shutil.copyfile(json_path, target_json)
        
        # 4. ZIP
        target_zip = os.path.join(frontend_out_dir, mock_zip_filename)
        shutil.copyfile(zip_path, target_zip)
        
    # Generate Berita Acara Pemusnahan (CoD) sampel
    print("\nGenerating Certificate of Destruction (CoD) Sample...")
    cod_gen = CertificateOfDestructionGenerator()
    cod_out_path = os.path.join("frontend", "outputs", "Berita_Acara_Pemusnahan_REQ_2026_BC_089_Test.pdf")
    cod_gen.generate_cod(
        output_path=cod_out_path,
        request_id="REQ-2026-BC-089",
        document_title="Formulir Resmi Permohonan Akses & Ekstraksi Data Kepabeanan",
        requester_name="Ahmad Fauzi, S.Kom",
        requester_department="Direktorat Penindakan dan Penyidikan (P2)",
        row_count=1250,
        granted_date="10 Oktober 2026",
        destruction_method="Cryptographic Erasure & Secure Sanitization (NIST SP 800-88 R1)",
        reviewer_name="Hendra Gunawan, S.Kom",
        reviewer_role="Kepala Seksi Analisa dan Layanan Data",
        dpo_name="Tim PPDP / DPO DIKC DJBC",
        dpo_role="Pejabat Pelaksana Fungsi Pelindungan Data Pribadi"
    )
    print(f"Generated CoD at: {cod_out_path}")
        
    # Update frontend/mock_data.js
    print("\nUpdating frontend/mock_data.js with fresh base64 certs...")
    mock_data_path = os.path.join("frontend", "mock_data.js")
    with open(mock_data_path, "r", encoding="utf-8") as f:
        mock_text = f.read()
        
    for fname, b64 in generated_certs.items():
        pattern = rf'("{re.escape(fname)}":\s*")[^"]+(")'
        if re.search(pattern, mock_text):
            mock_text = re.sub(pattern, rf'\g<1>{b64}\g<2>', mock_text)
            print(f"Updated base64 for {fname} in mock_data.js")
            
    with open(mock_data_path, "w", encoding="utf-8") as f:
        f.write(mock_text)
    print("Successfully wrote updated mock_data.js!")

if __name__ == "__main__":
    run()

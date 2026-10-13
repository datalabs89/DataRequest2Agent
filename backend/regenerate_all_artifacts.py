import os
import sys
import base64
import json
import re

# Tambahkan backend ke sys.path
sys.path.insert(0, os.path.dirname(__file__))

from coordinator import PipelineCoordinator
from cod_generator import CertificateOfDestructionGenerator
from breach_notification_generator import BreachNotificationGenerator

def run():
    print("=== REGENERATING ALL PIPELINE ARTIFACTS WITH NO UNDERLINE ===")
    coordinator = PipelineCoordinator()
    
    samples = [
        ("samples/Permohonan_Data_Internal_Bea_dan_Cukai.pdf", "REQ-2026-BC-089", "Sertifikat_Otorisasi_REQ_2026_BC_089_20261011_221106.pdf"),
        ("samples/Permohonan_Data_Internal_Kemenkeu.pdf", "REQ-2026-KMK-114", "Sertifikat_Otorisasi_REQ_2026_KMK_114_20261011_221106.pdf"),
        ("samples/Permohonan_Data_Eksternal_Kemenkeu.pdf", "REQ-2026-EKS-042", "Sertifikat_Otorisasi_REQ_2026_EKS_042_20261011_221106.pdf"),
    ]
    
    generated_certs = {}
    
    for sample_path, req_id, mock_cert_filename in samples:
        print(f"\nProcessing {req_id} ({sample_path})...")
        res = coordinator.process_request(sample_path)
        cert_path = res.execution.certificate_path
        print(f"Generated cert at: {cert_path}")
        
        # Baca bytes dari cert_path
        with open(cert_path, "rb") as f:
            pdf_bytes = f.read()
            
        # Simpan juga ke frontend/outputs/mock_cert_filename
        frontend_out_path = os.path.join("frontend", "outputs", mock_cert_filename)
        with open(frontend_out_path, "wb") as f:
            f.write(pdf_bytes)
        print(f"Saved to {frontend_out_path} ({len(pdf_bytes)} bytes)")
        
        # Simpan base64
        b64_str = base64.b64encode(pdf_bytes).decode("ascii")
        generated_certs[mock_cert_filename] = b64_str
        
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
        # Pola: "fname": "..."
        # Replace base64 string
        pattern = rf'("{re.escape(fname)}":\s*")[^"]+(")'
        if re.search(pattern, mock_text):
            mock_text = re.sub(pattern, rf'\g<1>{b64}\g<2>', mock_text)
            print(f"Updated base64 for {fname} in mock_data.js")
        else:
            print(f"Pattern for {fname} not found in mock_data.js!")
            
    with open(mock_data_path, "w", encoding="utf-8") as f:
        f.write(mock_text)
    print("Successfully wrote updated mock_data.js!")

if __name__ == "__main__":
    run()

import os
import json
import datetime
from typing import List, Dict, Any, Optional

class DSRManager:
    """
    Manajer Pemenuhan Hak Subjek Data (Data Subject Rights - DSR).
    Diterbitkan berdasarkan:
    1. Pasal 5 - 15 Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP):
       - Pasal 5: Hak Memperoleh Informasi
       - Pasal 6: Hak Melengkapi / Memperbarui (Koreksi)
       - Pasal 7: Hak Mengakses & Memperoleh Salinan Data
       - Pasal 8: Hak Mengakhiri Pemrosesan / Menghapus / Memusnahkan
       - Pasal 9: Hak Menarik Kembali Persetujuan
       - Pasal 10: Hak Mengajukan Keberatan atas Pemrosesan Otomatis
       - Pasal 11: Hak Menunda / Membatasi Pemrosesan
    2. Pasal 32 - 40 PP No. 33 Tahun 2026: Batas Waktu Pemenuhan Hak Subjek Data maksimal 3 x 24 jam.
    """

    def __init__(self, data_file: str = "outputs/dsr_registry.json"):
        self.data_file = data_file
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        self._ensure_seed_data()

    def _ensure_seed_data(self):
        if not os.path.exists(self.data_file):
            initial_records = [
                {
                    "id": "DSR-2026-001",
                    "subject_name": "Budi Santoso (Direktur CV Nusantara Jaya)",
                    "subject_identifier": "3171051204850001 / NPWP: 01.234.567.8-054.000",
                    "right_type": "HAK_KOREKSI",
                    "legal_basis": "Pasal 6 UU PDP (Hak Melengkapi/Koreksi)",
                    "related_req_id": "REQ-2026-BC-089",
                    "submission_date": "2026-10-10 14:20:00",
                    "due_date": "2026-10-13 14:20:00 (Maks 3 x 24 Jam)",
                    "description": "Pengkinian alamat domisili usaha dan nomor telepon penanggung jawab pabean pada sistem pelaporan ekspor.",
                    "status": "SELESAI",
                    "action_taken": "Data identitas NPWP telah diperbarui pada master data CEISA. Notifikasi dikirim ke pemohon.",
                    "handler_name": "Tim PPDP / DPO DIKC DJBC"
                },
                {
                    "id": "DSR-2026-002",
                    "subject_name": "Siti Rahmawati (Importir Perseorangan)",
                    "subject_identifier": "3201085509920003 / NPWP: 02.876.543.1-012.000",
                    "right_type": "HAK_HAPUS_MUSNAH",
                    "legal_basis": "Pasal 8 UU PDP (Hak Mengakhiri/Pemusnahan Data)",
                    "related_req_id": "REQ-2026-BC-090",
                    "submission_date": "2026-10-12 09:15:00",
                    "due_date": "2026-10-15 09:15:00 (Maks 3 x 24 Jam)",
                    "description": "Permohonan penarikan data transaksi masa lalu pasca berakhirnya kewajiban audit kepabeanan.",
                    "status": "DALAM_PROSES",
                    "action_taken": "Sedang diteliti masa retensi hukum sesuai UU Kepabeanan (10 tahun) vs UU PDP.",
                    "handler_name": "Hendra Gunawan, S.Kom (Seksi Analisa Data)"
                },
                {
                    "id": "DSR-2026-003",
                    "subject_name": "PT Sinar Logistik Internasional",
                    "subject_identifier": "NPWP: 01.999.888.7-043.000",
                    "right_type": "HAK_AKSES_SALINAN",
                    "legal_basis": "Pasal 7 UU PDP (Hak Akses Salinan Data Pribadi)",
                    "related_req_id": "REQ-2026-BC-091",
                    "submission_date": "2026-10-13 08:30:00",
                    "due_date": "2026-10-16 08:30:00 (Maks 3 x 24 Jam)",
                    "description": "Permintaan salinan rekap data transaksi kepabeanan yang diproses dalam rangka rekonsiliasi internal.",
                    "status": "MENUNGGU_VERIFIKASI",
                    "action_taken": "Menunggu verifikasi keabsahan surat kuasa pemohon.",
                    "handler_name": "Tim PPDP / DPO DIKC DJBC"
                }
            ]
            self._save_all(initial_records)

    def _load_all(self) -> List[Dict[str, Any]]:
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _save_all(self, records: List[Dict[str, Any]]):
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)

    def get_all(self) -> List[Dict[str, Any]]:
        return self._load_all()

    def record_request(
        self,
        subject_name: str,
        subject_identifier: str,
        right_type: str,
        description: str,
        related_req_id: str = "-",
        handler_name: str = "Tim PPDP / DPO DIKC DJBC"
    ) -> Dict[str, Any]:
        records = self._load_all()
        now = datetime.datetime.now()
        due = now + datetime.timedelta(days=3)
        new_id = f"DSR-2026-{(len(records) + 1):03d}"

        legal_map = {
            "HAK_INFORMASI": "Pasal 5 UU PDP (Hak Memperoleh Informasi)",
            "HAK_KOREKSI": "Pasal 6 UU PDP (Hak Melengkapi / Koreksi)",
            "HAK_AKSES_SALINAN": "Pasal 7 UU PDP (Hak Akses Salinan)",
            "HAK_HAPUS_MUSNAH": "Pasal 8 UU PDP (Hak Mengakhiri/Pemusnahan)",
            "HAK_TARIK_PERSETUJUAN": "Pasal 9 UU PDP (Hak Penarikan Persetujuan)",
            "HAK_KEBERATAN_OTOMASI": "Pasal 10 UU PDP (Hak Keberatan Profiling/Otomasi)",
            "HAK_BATASI_PROSES": "Pasal 11 UU PDP (Hak Pembatasan Pemrosesan)"
        }

        record = {
            "id": new_id,
            "subject_name": subject_name,
            "subject_identifier": subject_identifier,
            "right_type": right_type,
            "legal_basis": legal_map.get(right_type, "Pasal 5-11 UU PDP"),
            "related_req_id": related_req_id,
            "submission_date": now.strftime("%Y-%m-%d %H:%M:%S"),
            "due_date": due.strftime("%Y-%m-%d %H:%M:%S (Maks 3 x 24 Jam)"),
            "description": description,
            "status": "MENUNGGU_VERIFIKASI",
            "action_taken": "Telah dicatatkan dalam Buku Register Hak Subjek Data. Sedang dalam verifikasi DPO.",
            "handler_name": handler_name
        }
        records.insert(0, record)
        self._save_all(records)
        return record

    def update_status(self, dsr_id: str, status: str, action_taken: str) -> Optional[Dict[str, Any]]:
        records = self._load_all()
        for r in records:
            if r.get("id") == dsr_id:
                r["status"] = status
                r["action_taken"] = action_taken
                r["updated_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self._save_all(records)
                return r
        return None

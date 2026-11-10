from pathlib import Path

PIPELINE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = PIPELINE_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
INTERIM_DIR = DATA_DIR / "interim"
PROCESSED_DIR = DATA_DIR / "processed"
STAGES = {"raw": RAW_DIR, "interim":INTERIM_DIR, "processed": PROCESSED_DIR}

HF_ORG = "RevolutionCrossroads"

PENSION_COLUMNS = [
    "NAID", "title", "pageNumber",
    "transcriptionText", "RevX_OCR_text", "fs_extractedText",
    "pageImageURL",
]
NER_COLUMNS = [
    "record_id", "page", "block_id", "entity_type",
    "entity_text_normalised", "block_text", "block_bbox",
]
NEWS_COLUMNS = [
    "lccn", "newspaper_title", "place_of_publication", "issue_date",
    "edition_order", "Page", "RevX_OCR_text", "ca_ocr_text",
]

DATASETS = {
    "pension": {
        "repo": f"{HF_ORG}/nara_revolutionary_war_pension_files",
        "revision": "90f90867333c320af57a2ed1f43d5187c6685893",
        "files": [f"data/train-{i:05d}-of-00012.parquet" for i in range(12)],
        "columns": PENSION_COLUMNS,
        "glob": "data/train-*.parquet",
    },
    "ner_pension": {
        "repo": f"{HF_ORG}/RevX_NER_Entity_Occurrences",
        "revision": "54b6ea35ae2eaeacc70988606d9bab689e3e2ec1",
        "files": ["parquet/collection=pension/part-00000.parquet"],
        "columns": NER_COLUMNS,
        "glob": "parquet/collection=pension/part-00000.parquet",
    },
    "news": {
        "repo": f"{HF_ORG}/loc_chronicling_america_1770-1810",
        "revision": "0b97906ad32e269376872934820357fc333151d8",
        "files": [f"data/train-{i:05d}-of-00006.parquet" for i in range(6)],
        "columns": NEWS_COLUMNS,
        "glob": "data/train-*.parquet",
    },
    "ner_chronam": {
        "repo": f"{HF_ORG}/RevX_NER_Entity_Occurrences",
        "revision": "54b6ea35ae2eaeacc70988606d9bab689e3e2ec1",
        "files": ["parquet/collection=chronam/part-00000.parquet"],
        "columns": NER_COLUMNS,
        "glob": "parquet/collection=chronam/part-00000.parquet",
    },
}

TEXT_PRIORITY = ["transcriptionText", "RevX_OCR_text", "fs_extractedText"]
NER_PLACE_TYPES = ["geographic_location", "named_place"]
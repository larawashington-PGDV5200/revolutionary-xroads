"""Tiny DuckDB runner: python run.py file.sql [export_table=out.json ...]
Registers views over the downloaded parquet, runs every statement, prints SELECT results,
and optionally exports tables to JSON for the prototypes."""
import duckdb, sys, os, json, datetime, decimal
S = os.path.dirname(os.path.abspath(__file__))
con = duckdb.connect(f"{S}/rx.duckdb")
con.execute("SET threads=8")
con.execute(f"""
create or replace view pension_raw as select * from read_parquet('{S}/d/pension/*.parquet');
create or replace view pension as select NAID, title, pageNumber,
  coalesce(transcriptionText, RevX_OCR_text, fs_extractedText) txt,
  case when transcriptionText is not null then 'human transcription'
       when RevX_OCR_text is not null then 'Chandra OCR' else 'FamilySearch OCR' end src
  from pension_raw;
create or replace view news as select * from read_parquet('{S}/d/news/*.parquet');
create or replace view ner_n as select * from read_parquet('{S}/d/ner/chronam.parquet');
create or replace view si as select * from read_parquet('{S}/d/si/si.parquet');
""")

def conv(v):
    if isinstance(v, (datetime.date, datetime.datetime)): return v.isoformat()[:10]
    if isinstance(v, decimal.Decimal): return float(v)
    if isinstance(v, list): return [conv(x) for x in v]
    if isinstance(v, dict): return {k: conv(x) for k, x in v.items()}
    return v

import re
sql = re.sub(r"(?m)^\s*--.*$", "", open(sys.argv[1]).read())
W = int(os.environ.get("W", "140"))
for stmt in [s for s in sql.split(";") if s.strip() and not all(l.strip().startswith('--') or not l.strip() for l in s.splitlines())]:
    print(">>", " ".join(l for l in stmt.split() )[:140])
    r = con.sql(stmt)
    if r is None: continue
    rows = r.limit(int(os.environ.get("N", "25"))).fetchall()
    print(" | ".join(r.columns))
    for row in rows: print(" | ".join(str(v).replace("\n", " ")[:W] for v in row))
    print()

for arg in sys.argv[2:]:
    table, out = arg.split("=")
    r = con.sql(f"select * from {table}")
    cols = r.columns
    data = [dict(zip(cols, map(conv, row))) for row in r.fetchall()]
    var, path = out.split(":") if ":" in out else (table, out)
    with open(path, "a") as f:
        f.write(f"const {var} = " + json.dumps(data, separators=(",", ":")) + ";\n")
    print(f"exported {len(data)} rows of {table} -> {path} as const {var}")

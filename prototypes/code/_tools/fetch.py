import json, os, subprocess, urllib.request
R = "https://huggingface.co/datasets/RevolutionCrossroads"
def tree(ds, path):
    return json.load(urllib.request.urlopen(f"https://huggingface.co/api/datasets/RevolutionCrossroads/{ds}/tree/main/{path}"))
jobs = []
for f in tree("nara_revolutionary_war_pension_files", "data"):
    jobs.append((f"{R}/nara_revolutionary_war_pension_files/resolve/main/{f['path']}", f"d/pension/{os.path.basename(f['path'])}", f["size"]))
for f in tree("loc_chronicling_america_1770-1810", "data"):
    jobs.append((f"{R}/loc_chronicling_america_1770-1810/resolve/main/{f['path']}", f"d/news/{os.path.basename(f['path'])}", f["size"]))
for f in tree("RevX_NER_Entity_Occurrences", "parquet/collection=chronam"):
    jobs.append((f"{R}/RevX_NER_Entity_Occurrences/resolve/main/{f['path']}", "d/ner/chronam.parquet", f["size"]))
# remove old differently-named shards
for d in ("d/pension", "d/news"):
    for fn in os.listdir(d):
        if fn.startswith(("p0", "n0")): os.remove(os.path.join(d, fn))
procs = []
for url, out, size in jobs:
    if os.path.exists(out) and os.path.getsize(out) == size: continue
    procs.append((subprocess.Popen(["curl", "-sL", "--retry", "8", "--retry-all-errors", "-o", out, url]), out, size))
for p, out, size in procs: p.wait()
bad = [(out, os.path.getsize(out), size) for _, out, size in jobs if os.path.getsize(out) != size]
print("files", len(jobs), "refetched", len(procs), "bad", bad)

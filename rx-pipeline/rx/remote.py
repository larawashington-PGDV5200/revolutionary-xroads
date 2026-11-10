import duckdb
import config

def hf_url(name: str) -> str:
    #hf_url('pension') -> 'hf://datasets/<repo>@<revision>/data/train-*.parquet
    d = config.DATASETS[name]
    return f"hf://datasets/{d['repo']}@{d['revision']}/{d['glob']}"

def connect() -> duckdb.DuckDBPyConnection:
    return duckdb.connect()
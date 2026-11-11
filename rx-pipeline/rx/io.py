import pandas as pd
import config

def stage_path(stage: str, name: str):
    if stage not in config.STAGES:
        raise ValueError(f"stage must be one of {list(config.STAGES)}, got {stage!r}")
    return config.STAGES[stage] / f"{name}.parquet"

def read_stage(stage: str, name: str, columns=None) -> pd.DataFrame:
     return pd.read_parquet(stage_path(stage, name), columns=columns)

def write_stage(df: pd.DataFrame, stage: str, name: str):
    if stage == "raw":
        raise ValueError("raw is read-only: write to interim or processed")
    path = stage_path(stage, name)
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path, index=False)
    return path
      

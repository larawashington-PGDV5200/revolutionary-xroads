import pandas as pd
import config

def has_text(s: pd.Series) -> pd.Series:
    return (s.astype("string").str.strip().str.len() > 0).fillna(False)

def coalesce_text(df: pd.DataFrame, cols=None):
    cols = cols or config.TEXT_PRIORITY
    text = pd.Series(pd.NA, index=df.index, dtype="string")
    source = pd.Series(pd.NA, index=df.index, dtype="string")
    for col in cols:
        fill = text.isna() & has_text(df[col])
        text[fill] = df.loc[fill, col]
        source[fill] = col
    return text, source

def normalise_whitespace(s: pd.Series) -> pd.Series:
    return s.astype("string").str.replace(r"\s+", " ", regex=True).str.strip()

def strip_boilerplate(s: pd.Series) -> pd.Series:
    raise NotImplementedError


        
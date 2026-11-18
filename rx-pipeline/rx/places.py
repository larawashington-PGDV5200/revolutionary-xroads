import re
import pandas as pd

STATE_PATTERNS = [
    (r"^(mass|massachusetts)", "MA"), (r"^(conn|connecticut)", "CT"),
    (r"^(n\.? ?y|new york)", "NY"),   (r"^(n\.? ?j|new jersey)", "NJ"),
    (r"^(penn|pa\b|pennsylvania)", "PA"), (r"^(va|virginia)", "VA"),
    (r"^(n\.? ?c|north carolina)", "NC"), (r"^(s\.? ?c|south carolina)", "SC"),
    (r"^(n\.? ?h|new hampshire)", "NH"), (r"^(vt|vermont)", "VT"),
    (r"^(md|maryland)", "MD"), (r"^(del|delaware)", "DE"), (r"^(ga|georgia)", "GA"),
    (r"^(r\.? ?i|rhode)", "RI"), (r"^(me\b|maine)", "ME"), (r"^(ky|kentucky)", "KY"),
    (r"^(tenn|tennessee)", "TN"), (r"^ohio", "OH"), (r"^(ind|indiana)", "IN"),
    (r"^(ill|illinois)", "IL"), (r"^(mo\b|missouri)", "MO"), (r"^(ala|alabama)", "AL"),
    (r"^(miss|mississippi)", "MS"), (r"^(mich|michigan)", "MI"), (r"^(la\b|louisiana)", "LA"),
    (r"^cont", "Cont"),               # Continental line, not a state
    (r"^(ark|arkansas)", "AR"), (r"^(wis|wisconsin)", "WI"), (r"^iowa", "IA"), 
    (r"^(fla|florida)", "FL"), (r"^(tex|texas)", "TX"), (r"^(d\.? ?c|district of columbia)", "DC"),
]
_COMPILED = [(re.compile(p), code) for p, code in STATE_PATTERNS]

def normalise_state(raw):
    if not isinstance(raw, str):
        return None
    s = raw.strip().lower()
    for pattern, code in _COMPILED:
        if pattern.match(s):
            return code
    return None

def normalise_state_series(s: pd.Series) -> pd.Series:
    return s.map(normalise_state).astype("string")
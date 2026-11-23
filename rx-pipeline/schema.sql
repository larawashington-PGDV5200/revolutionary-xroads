-- Views over the parquet tables (derived data: no second copy).
-- Load: con.sql(open(config.PIPELINE_DIR / "schema.sql").read())
-- after registering `residences` and `households` (see A08_outputs).

-- moves: consecutive residence rows for one person where the state changes.
-- move_after = date of the earlier row, move_before = date of the later one (a range, often open).
create or replace view moves as
with r as (
  select NAID, person, seq, place_id, state, date, kind,
         lag(place_id) over w as from_place_id, lag(state) over w as from_state,
         lag(date) over w as from_date, lag(kind) over w as from_kind
  from residences
  window w as (partition by NAID, person order by seq))
select NAID, person, from_place_id, place_id as to_place_id, from_state, state as to_state,
       from_date as move_after, date as move_before, from_kind, kind as to_kind
from r
where from_place_id is not null and from_state is distinct from state;

-- place_period: the viz table. Households that moved, by final place and application decade.
-- precision: state-level rows (place_id = 'NY') sit beside county rows; map counties, list states.
create or replace view place_period as
select final_place_id as place_id, final_precision as precision, (application_year // 10) * 10 as decade,
       count(*) as households,
       count(*) filter (where declarant = 'widow') as widow_declarants,
       count(*) filter (where moved_west) as moved_west
from households
where final_place_id is not null and moved
group by all;

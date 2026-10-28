-- PROTOTYPE 1 — reprinted news. Source: RevX_NER_Entity_Occurrences (chronam) block_text,
-- i.e. Chandra-OCR layout blocks that contain >=1 named entity; plus newspaper metadata.
-- Method: two blocks are "the same text" if they share an identical 80-character window
-- (letters only, lower-cased) at offset 0/80/160/240; clusters = connected components.
create or replace table papers as
  select lccn, any_value(newspaper_title) title, any_value(place_of_publication) place from news group by lccn;

create or replace table rb as
select row_number() over (order by record_id, block_id) bid, record_id, split_part(record_id,'_',1) lccn,
       try_cast(split_part(record_id,'_',2) as date) d, block_id, bt,
       trim(regexp_replace(regexp_replace(lower(bt),'[^a-z ]',' ','g'),'\s+',' ','g')) nt
from (select record_id, block_id, any_value(block_text) bt from ner_n
      where block_type='Text' and length(block_text) >= 300 group by all);

create or replace table rk as
select bid, lccn, k from (
  select bid, lccn, unnest([substr(nt,1,80), substr(nt,81,80), substr(nt,161,80), substr(nt,241,80)]) k from rb)
where length(k) = 80;

-- keys shared across >=2 papers, but not boilerplate shared by hundreds of blocks (acts, oaths, forms)
create or replace table kk as
select k from rk join rb using (bid, lccn) group by k
having count(distinct lccn) >= 2 and count(*) <= 40 and date_diff('day', min(d), max(d)) <= 365
   and not regexp_matches(k, '^(in testimony whereof|be it (further )?enacted|and be it further enacted|resolved by the senate and house|given under my hand|by the president of the united states|done at the city|approved|sec \\d|section \\d)');
create or replace table rk2 as select bid, k from rk join kk using (k);

create or replace table lab as select distinct bid, bid comp from rk2;
create or replace table lab as with km as (select k, min(comp) c from rk2 join lab using (bid) group by k) select bid, min(c) comp from rk2 join km using (k) group by bid;
create or replace table lab as with km as (select k, min(comp) c from rk2 join lab using (bid) group by k) select bid, min(c) comp from rk2 join km using (k) group by bid;
create or replace table lab as with km as (select k, min(comp) c from rk2 join lab using (bid) group by k) select bid, min(c) comp from rk2 join km using (k) group by bid;
create or replace table lab as with km as (select k, min(comp) c from rk2 join lab using (bid) group by k) select bid, min(c) comp from rk2 join km using (k) group by bid;

create or replace table app as
select l.comp, b.record_id, b.lccn, p.title, p.place, b.d, b.bt from lab l join rb b using (bid) join papers p using (lccn);

-- story-level stats: the spreading "wave" = printings within 120 days of the first; later re-runs counted separately
create or replace table app as select a.*, date_diff('day', min(d) over (partition by comp), d) lag from app a;
create or replace table story0 as
select comp, count(distinct lccn) filter (where lag <= 120) n_papers, count(distinct record_id) filter (where lag <= 120) n_prints,
       count(distinct record_id) filter (where lag > 120) n_later, min(d) first_d, max(d) filter (where lag <= 120) last_d,
       max(lag) filter (where lag <= 120) span_days,
       max(per_paper) max_per_paper, count(*) n_blocks
from (select *, count(distinct record_id) over (partition by comp, lccn) per_paper from app)
group by comp;
create or replace table story as
select s.*, e.bt first_text, e.title first_paper, e.place first_place,
  case when regexp_matches(lower(left(e.bt,400)), 'enacted|resolved|proclamation|congress|senate|house of representatives|treaty|ordinance|message|legislature|assembly|committee|secretary of|president of the united states|governor') then 'official / political'
       when regexp_matches(left(e.bt,120), '^\W*(LONDON|PARIS|DUBLIN|EDINBURGH|AMSTERDAM|HAGUE|MADRID|LISBON|VIENNA|BERLIN|HAMBURG|ST\.? PETERSBURG|CONSTANTINOPLE|ROME|NAPLES|CADIZ|BORDEAUX|LIVERPOOL|GLASGOW|CORK|KINGSTON|HAVANNA|CAPE FRANCOIS|PORT.AU.PRINCE|QUEBEC|HALIFAX)') or regexp_matches(lower(left(e.bt,300)),'london papers|from europe|foreign intelligence|british parliament|house of commons|house of lords|bonaparte|french republic|his majesty') then 'foreign'
       else 'other news / essays / letters' end kind
from story0 s join (select comp, bt, title, place, row_number() over (partition by comp order by d, record_id) rn from app) e
  on e.comp = s.comp and e.rn = 1
where s.n_papers >= 3 and s.max_per_paper <= 4 and s.n_blocks <= 80
  and not regexp_matches(lower(e.bt), 'for sale|to be sold|subscriber|reward|ran away|lottery|for freight|tickets');
select kind, count(*) stories, median(n_papers) med_papers, max(n_papers) max_papers, median(span_days) med_span from story group by 1;
select count(*) stories, sum(n_prints) prints, median(n_papers) med_papers, max(n_papers) max_papers,
       median(span_days) med_span_days, quantile_cont(span_days, 0.9) p90_span from story;
select n_papers, count(*) stories from story group by 1 order by 1;
select year(first_d) y, count(*) stories from story group by 1 order by 1;
select n_papers, n_prints, first_d, span_days, first_place, left(first_text, 110) txt from story order by n_papers desc, n_prints desc limit 12;

-- per-paper first appearance for each story (rows of the detail chart)
create or replace table story_app as
select a.comp, a.lccn, a.title, a.place, list(distinct a.d order by a.d) dates, min(a.d) first_d
from app a join story s using (comp) where a.lag <= 120 group by all;

-- how long after first printing does each new paper pick it up?
select quantile_cont(lag, [0.25,0.5,0.75,0.9]) lag_days_quartiles from (
  select date_diff('day', s.first_d, a.first_d) lag from story_app a join story s using (comp) where a.first_d > s.first_d);

-- export shapes (compact): papers lookup + one row per story with [paperIndex, lag days...] per paper
create or replace table out_papers as select row_number() over (order by lccn) - 1 pid, lccn, title, place from papers;
create or replace table out_story as
select s.comp id, s.kind, s.n_papers, s.n_prints, s.n_later, s.first_d, s.span_days, s.first_paper, s.first_place, left(s.first_text, 220) text,
  (select list([p.pid] || list_transform(a.dates, lambda x: date_diff('day', s.first_d, x)) order by a.first_d)
     from story_app a join out_papers p using (lccn) where a.comp = s.comp) rows
from story s;
create or replace table out_year as select year(issue_date) y, count(*) pages, count(distinct lccn) papers from news group by 1 order by 1;

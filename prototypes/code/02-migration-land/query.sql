-- PROTOTYPE 2 — where veterans served vs. where they applied from; land ads for western / military / Native land.
create or replace macro normst(s) as case
 when s ~ '^(mass|massachusetts)' then 'MA' when s ~ '^(conn|connecticut)' then 'CT' when s ~ '^(n\.? ?y|new york)' then 'NY'
 when s ~ '^(n\.? ?j|new jersey)' then 'NJ' when s ~ '^(penn|pa\b|pennsylvania)' then 'PA' when s ~ '^(va|virginia)' then 'VA'
 when s ~ '^(n\.? ?c|north carolina)' then 'NC' when s ~ '^(s\.? ?c|south carolina)' then 'SC' when s ~ '^(n\.? ?h|new hampshire)' then 'NH'
 when s ~ '^(vt|vermont)' then 'VT' when s ~ '^(md|maryland)' then 'MD' when s ~ '^(del|delaware)' then 'DE' when s ~ '^(ga|georgia)' then 'GA'
 when s ~ '^(r\.? ?i|rhode)' then 'RI' when s ~ '^(me\b|maine)' then 'ME' when s ~ '^(ky|kentucky)' then 'KY' when s ~ '^(tenn|tennessee)' then 'TN'
 when s ~ '^ohio' then 'OH' when s ~ '^(ind|indiana)' then 'IN' when s ~ '^(ill|illinois)' then 'IL' when s ~ '^(mo\b|missouri)' then 'MO'
 when s ~ '^(ala|alabama)' then 'AL' when s ~ '^(miss|mississippi)' then 'MS' when s ~ '^(mich|michigan)' then 'MI' when s ~ '^(la\b|louisiana)' then 'LA'
 when s ~ '^(cont)' then 'Cont' else null end;

-- 1) state of service = last comma-segment of the NARA file title ("…File S. 11801, Samuel Willington, Mass.")
create or replace table files as select NAID, any_value(title) title from pension group by NAID;
create or replace table fserve as select NAID, title, regexp_extract(title,'File\s+([A-Z]+)',1) ftype,
  normst(lower(trim(regexp_extract(title, ',\s*([^,]+)$',1)))) served from files;

-- 2) state applied from: "State of X" on the first declaration page ("personally appeared"); fallback = most frequent "State of X" in file
create or replace table decl as select NAID, min(pageNumber) pg from pension where regexp_matches(lower(txt),'personally appeared') group by NAID;
create or replace table res_decl as select p.NAID, normst(regexp_extract(lower(p.txt),'state of ((?:north |south |new )?[a-z]+)',1)) st
  from pension p join decl d on p.NAID=d.NAID and p.pageNumber=d.pg;
create or replace table res_freq as select NAID, st from (
  select NAID, st, row_number() over (partition by NAID order by count(*) desc) rn from (
    select NAID, normst(m) st from (select NAID, unnest(regexp_extract_all(lower(txt),'state of ((?:north |south |new )?[a-z]+)',1)) m from pension))
  where st is not null and st<>'Cont' group by NAID, st) where rn=1;
create or replace table fres as select f.NAID,
  coalesce(nullif(d.st,'Cont'), r.st) lived, case when d.st is not null and d.st<>'Cont' then 'declaration page' when r.st is not null then 'most frequent' end method
  from files f left join res_decl d using (NAID) left join res_freq r using (NAID);

select method, count(*) files from fres group by 1;
create or replace table flows as
select s.served, r.lived, count(*) n, sum((s.ftype='S')::int) n_S, sum((s.ftype='W')::int) n_W, sum((s.ftype='R')::int) n_R
from fserve s join fres r using (NAID) where s.served is not null and s.served<>'Cont' and r.lived is not null group by all;
select sum(n) files, sum(case when served<>lived then n else 0 end) moved, round(100.0*sum(case when served<>lived then n else 0 end)/sum(n),1) pct_moved from flows;
select served, lived, n from flows where served<>lived order by n desc limit 12;

-- 3) bounty land destinations named in pension files
create or replace table bl_dest as
select dest, count(distinct NAID) files from (
  select NAID, unnest(regexp_extract_all(lower(txt),'virginia military district|military district|military tract|ohio|kentucky|tennessee|indiana|illinois|missouri|genesee|onondaga')) dest
  from pension where regexp_matches(lower(txt),'bounty land|land warrant|warrant for \d+ acres')) group by dest order by files desc;
select * from bl_dest;

-- 4) newspaper land-sale ads (one layout block = one ad), destination of the land, military/Native flags
create or replace table papers as select lccn, any_value(newspaper_title) title, any_value(place_of_publication) place from news group by lccn;
create or replace macro paperst(p) as case when p ilike '%Va.%' or p ilike '%Virginia%' then 'VA' when p ilike '%Pa.%' then 'PA' when p ilike '%N.H.%' then 'NH'
  when p ilike '%Md.%' then 'MD' when p ilike '%Del%' then 'DE' when p ilike '%N.J.%' then 'NJ' when p ilike '%N.Y.%' then 'NY' when p ilike '%Ky.%' then 'KY'
  when p ilike '%Me.%' then 'ME' when p ilike '%D.C.%' then 'DC' when p ilike '%Mass%' then 'MA' when p ilike '%Conn%' then 'CT' when p ilike '%Vt%' then 'VT'
  when p ilike '%Ohio%' then 'OH' when p ilike '%Tenn%' then 'TN' when p ilike '%S.C.%' then 'SC' when p ilike '%N.C.%' then 'NC' when p ilike '%Ga.%' then 'GA' when p ilike '%La.%' then 'LA' else null end;
create or replace table landads as
select record_id, split_part(record_id,'_',1) lccn, try_cast(split_part(record_id,'_',2) as date) d, block_id, any_value(block_text) bt
from ner_n where regexp_matches(lower(block_text),'\d+ acres|tract of land|lands? for sale') and regexp_matches(lower(block_text),'for sale|to be sold|will be sold|at private sale|public sale')
group by all;
create or replace table landads2 as
select a.*, p.title, p.place, paperst(p.place) paper_st,
  regexp_matches(lower(bt),'military lands?|military district|military tract|military bounty|bounty lands?|land warrants?') military,
  regexp_matches(lower(bt),'indian (?:title|claim|lands?|boundary|purchase|treaty)|lands? (?:lately )?ceded|purchased of the indians|treaty of greenville|cession') native,
  list_distinct(list_transform(regexp_extract_all(lower(bt),'kentucky|ohio|scioto|miami|muskingum|north.?western territory|virginia military district|tennessee|cumberland|indiana territory|mississippi territory|georgia western|yazoo|genesee|military tract|louisiana|holland (?:land )?company'),
    lambda x: case when x in ('kentucky') then 'KY' when x in ('ohio','scioto','miami','muskingum','virginia military district') or x ~ 'western territory' then 'OH'
              when x in ('tennessee','cumberland') then 'TN' when x='indiana territory' then 'IN' when x in ('mississippi territory','yazoo','georgia western') then 'MS'
              when x in ('genesee','military tract') or x ~ 'holland' then 'NY-west' when x='louisiana' then 'LA' end)) dests
from landads a join papers p using (lccn);
select count(*) land_ads, sum(military::int) military, sum(native::int) native, sum((len(dests)>0)::int) with_western_dest from landads2;
create or replace table landflows as
select paper_st, dest, year(d) y, count(*) n, sum(military::int) n_military, sum(native::int) n_native
from (select *, unnest(dests) dest from landads2) where paper_st is not null group by all;
select paper_st, dest, sum(n) n, sum(n_military) mil, sum(n_native) nat from landflows group by 1,2 order by n desc limit 12;

-- exports
create or replace table out_flows as select * from flows;
create or replace table out_landflows as select * from landflows;
create or replace table out_bl as select * from bl_dest;
create or replace table out_landads as
select d, title, place, military, native, dests, left(bt, 700) text from landads2
where (military or native) and len(dests) > 0 order by d;

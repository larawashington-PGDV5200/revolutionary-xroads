-- PROTOTYPE 3 — weather in print (newspapers, written at the time) vs. in memory (pension testimony, 1818–1850s).
-- Single words are matched lower-case only so surnames (Snow, Frost, Flood) don't count.
create or replace table wtypes as select * from (values
 ('cold',    '(?i:hard winter|severe winter|cold winter|severity of the (?:weather|season|winter)|severe cold|intense cold|extreme cold|excessive cold|frozen over|froze over|obstructed by (?:the )?ice|closed by (?:the )?ice|frost[- ]?bit\w*|barefoot|bare foot)|\b(?:snow|frost|froze|frozen)\b'),
 ('storm',   '(?i:hurricane|tremendous gale|violent gale|dreadful storm|violent storm|great storm|tremendous storm|severe storm|equinoctial gale)'),
 ('flood',   '(?i:freshet|inundat\w*|great flood)|\bflood\b'),
 ('drought', '(?i:drought|drouth|want of rain|dry season)'),
 ('heat',    '(?i:excessive heat|extreme heat|intense heat|excessively hot|heat of the (?:weather|season|day)|sultry)'),
 ('dark day','(?i:dark day|uncommon darkness|remarkable darkness|extraordinary darkness)')) t(wtype, pat);

-- newspapers: share of pages per month mentioning each type
create or replace table nt as select lccn, newspaper_title, place_of_publication place, issue_date::date d, Page, coalesce(RevX_OCR_text, ca_ocr_text) t from news;
create or replace table nmonth_tot as select date_trunc('month', d) m, count(*) pages from nt group by 1;
create or replace table nhit as select n.*, w.wtype, w.pat from nt n, wtypes w where regexp_matches(n.t, w.pat);
create or replace table out_news_month as
select strftime(h.m,'%Y-%m') ym, h.wtype, h.hits, t.pages from
 (select date_trunc('month', d) m, wtype, count(*) hits from nhit group by all) h join nmonth_tot t using (m) order by ym;

-- pensions: pages/files per type; remembered year = a 1760–1799 year within the excerpt
create or replace table phit as select p.NAID, p.title, p.pageNumber, p.src, w.wtype,
  regexp_extract(p.txt, '(?s)(.{0,320}(?:' || w.pat || ').{0,320})', 1) ctx
from pension p, wtypes w where regexp_matches(p.txt, w.pat);
create or replace table phit2 as select *, try_cast(regexp_extract(ctx, '(17[6-9]\d)', 1) as int) yr, regexp_extract(title,'File\s+([A-Z]+)',1) ftype from phit;
select wtype, count(*) pages, count(distinct NAID) files, count(yr) with_year from phit2 group by 1 order by 2 desc;
create or replace table out_pension_year as select yr, wtype, count(distinct NAID) files from phit2 where yr is not null group by all order by yr;
select ftype, count(distinct NAID) files from phit2 group by 1 order by 2 desc limit 4;

-- excerpts for impact categories + sentiment (scored in the browser); sample capped per type
create or replace table nctx as select 'newspaper' source, d::varchar dt, year(d) yr, wtype, newspaper_title who, place,
  regexp_extract(t, '(?s)(.{0,320}(?:' || pat || ').{0,320})', 1) ctx from nhit;
create or replace table out_excerpts as
select * from (
  select source, dt, yr, wtype, who, place, ctx, row_number() over (partition by wtype order by hash(dt||who||ctx)) rn from nctx where length(ctx) > 100)
where rn <= 500
union all
select * from (
  select 'pension' source, null dt, yr, wtype, title who, src place, ctx,
    row_number() over (partition by wtype order by (src='human transcription') desc, hash(NAID, pageNumber)) rn from phit2 where length(ctx) > 100)
where rn <= 500;
select source, wtype, count(*) from out_excerpts group by all order by 1,2;

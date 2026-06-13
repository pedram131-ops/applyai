export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(updateSources(env)); },
  async fetch(request, env) {
    const rows = await env.DB.prepare('SELECT * FROM opportunities ORDER BY published_at DESC LIMIT 1000').all();
    return Response.json(rows.results, {headers:{'Access-Control-Allow-Origin':'*'}});
  }
}
async function updateSources(env){
  // این فایل اسکلت اتصال واقعی است. برای هر منبع رسمی باید API/RSS مجاز اضافه شود.
  // نمونه‌ها: EURES API/RSS, JobBank Canada, USAJobs API, DAAD feeds, Erasmus pages.
  const demo = {
    id: crypto.randomUUID(), type:'job', title:'Official source sample', title_fa:'نمونه فرصت از منبع رسمی',
    description_fa:'پس از اتصال API واقعی، شرح فارسی اینجا ذخیره می‌شود.', requirements_fa:'رزومه، مدرک، زبان، شرایط ویزا',
    country:'آلمان', city:'برلین', source:'EURES', source_url:'https://eures.europa.eu', published_at:new Date().toISOString(),
    published_jalali:'', deadline_at:'', deadline_jalali:'', remote_type:'حضوری', degree_required:'کارشناسی', visa_support:'نامشخص', international_acceptance:'پذیرش بین‌المللی', eu_status:'خارج از اتحادیه اروپا هم مجاز'
  };
  await env.DB.prepare(`INSERT OR REPLACE INTO opportunities (id,type,title,title_fa,description_fa,requirements_fa,country,city,source,source_url,published_at,published_jalali,deadline_at,deadline_jalali,remote_type,degree_required,visa_support,international_acceptance,eu_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(...Object.values(demo)).run();
}

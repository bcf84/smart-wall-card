/* Smart Wall Card 3 – Konfigurations-Kurzschreibweisen
   - "map"/"status_map": "an-Text|aus-Text"  → {on:'an-Text', off:'aus-Text'}
   - in nav_alerts: "@lights", "@plugs", "@covers", "@windows", "@climate_temps" → Entitäten aus der übrigen Konfiguration */
function swExpandCfg(c){if(!c||typeof c!=='object')return c;
  const grp=l=>(l||[]).map(g=>typeof g==='string'?{entities:[g]}:g);const eid=e=>typeof e==='string'?e:e&&e.entity;
  const uniq=a=>[...new Set(a.filter(Boolean))];
  const D={
    '@lights':()=>uniq(grp(c.lights).flatMap(g=>(g.entities||[]).map(eid))),
    '@plugs':()=>uniq(grp(c.lights).flatMap(g=>(g.plugs||[]).map(eid))),
    '@covers':()=>uniq(grp(c.covers).flatMap(g=>(g.entities||[]).map(eid))),
    '@windows':()=>uniq(grp(c.windows).flatMap(g=>(g.entities||[]).map(eid))),
    '@climate_temps':()=>uniq(grp(c.climates).map(g=>g.temperature))};
  const walk=(o,k,inNav)=>{
    if(Array.isArray(o)){const out=[];o.forEach(x=>{if(inNav&&typeof x==='string'&&D[x])out.push(...D[x]());else out.push(walk(x,null,inNav));});return out;}
    if(o&&typeof o==='object'){const r={};for(const kk in o)r[kk]=walk(o[kk],kk,inNav||kk==='nav_alerts');return r;}
    if((k==='map'||k==='status_map')&&typeof o==='string'&&o.includes('|')){const [on,off]=o.split('|');return {on,off};}
    return o;};
  return walk(c,null,false);}

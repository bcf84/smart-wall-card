/* Smart Wall Card – Erweiterung: Verkehrsmeldungen Stadt v1.0 (TomTom Traffic Incident Details v5)
   city_traffic: {key, lat, lon, radius (km, 8), min_jam (1–3, 2), min_delay (min, 3), acute_days (2), zoom (Karte, 12), hide_closures ([Straßennummern, Sperrungen dort nie zeigen]), title ('Stau'), interval (s, 300), skip_roads ([...])} */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCity)return;C.prototype.__swCity=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* TomTom iconCategory */
const CAT={1:['Unfall','car-emergency',3],2:['Nebel','weather-fog',0],3:['Gefahr','alert-outline',2],4:['Regen','weather-pouring',0],5:['Glätte','snowflake-alert',2],6:['Stau','car-multiple',1],7:['Fahrstreifen gesperrt','road-variant',1],8:['Straße gesperrt','sign-direction-remove',3],9:['Baustelle','cone',1],10:['Wind','weather-windy',0],11:['Überflutung','home-flood',3],14:['Pannenfahrzeug','car-wrench',1]};
const MAG={1:'leicht',2:'mittel',3:'stark'};
const dt=t=>{const d=new Date(t);return isNaN(d)?'–':d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});};
const hm=t=>{const d=new Date(t);return isNaN(d)?'':d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});};
const until=t=>{const d=new Date(t);if(isNaN(d))return '';const n=new Date();const sameDay=d.toDateString()===n.toDateString();const tm=new Date(n);tm.setDate(n.getDate()+1);
  if(sameDay)return 'bis '+hm(d);if(d.toDateString()===tm.toDateString())return 'bis morgen '+hm(d);if(d-n>60*864e5)return '';return 'bis '+d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});};
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v;}catch(e){return d;}};const SS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const gpt=g=>{if(!g||!g.coordinates)return null;let c=g.coordinates;if(g.type==='LineString'&&c.length)c=c[Math.floor(c.length/2)];return Array.isArray(c)&&typeof c[0]==='number'?[c[1],c[0]]:null;};
const WP=(lat,lon,z)=>{const n=256*Math.pow(2,z);const s=Math.sin(lat*Math.PI/180);return [(lon+180)/360*n,(0.5-Math.log((1+s)/(1-s))/(4*Math.PI))*n];};
const MAPCSS=`<style>.ctmap{position:relative;height:280px;overflow:hidden;background:#1d2a33;margin:0 0 16px;border:1px solid rgba(255,255,255,.12)}.ctmap .w{position:absolute}.ctmap img{position:absolute;width:256px;height:256px;display:block;user-select:none;-webkit-user-drag:none}.ctmap .fl{opacity:.9}.ctpin{position:absolute;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;color:#fff;font:600 12px/24px sans-serif;text-align:center;box-shadow:0 0 0 2px rgba(0,0,0,.55);cursor:pointer;z-index:2;transition:transform .15s}.ctpin.sel{transform:translate(-50%,-50%) scale(1.45);box-shadow:0 0 0 3px #fff;z-index:4}.cthome{position:absolute;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#2196F3;box-shadow:0 0 0 3px #fff;z-index:3}.ctzm{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:5}.ctzm div{width:36px;height:36px;background:rgba(0,0,0,.6);color:#fff;font:600 20px/36px sans-serif;text-align:center;cursor:pointer;border:1px solid rgba(255,255,255,.3)}.ctattr{position:absolute;right:4px;bottom:2px;font-size:10px;opacity:.7;z-index:5;background:rgba(0,0,0,.4);padding:0 4px}.ctit{transition:background .15s;cursor:pointer}.ctit.sel{background:rgba(255,255,255,.08)}.ctno{display:inline-block;min-width:20px;height:20px;border-radius:50%;color:#fff;font:600 11px/20px sans-serif;text-align:center}</style>`;
const NR=r=>String(r).toUpperCase().replace(/[\s-]/g,'');
const sig=i=>{const r=(i.roads||[]).map(NR).sort();return r.length?[i.cat,r.join('/')].join('|'):[i.cat,i.from||'',i.to||''].join('|');};
C.prototype._ctCfg=function(){const T=this._cfg.city_traffic;if(!T||!T.key)return null;const h=this._hass&&this._hass.states&&this._hass.states['zone.home'];const A=h?h.attributes:{};
  return Object.assign({radius:8,min_jam:2,min_delay:3,acute_days:2,title:'Stau',interval:300,lat:A.latitude,lon:A.longitude,skip_roads:(this._cfg.traffic&&this._cfg.traffic.roads)||[]},T);};
C.prototype._ctLoad=function(){const T=this._ctCfg();if(!T||T.lat==null)return;const now=Date.now();const c=this._ct2;if(c&&(c.busy||now-c.t<T.interval*1000))return;
  this._ct2=Object.assign(c||{items:null},{busy:true,t:now});
  const dLat=T.radius/111,dLon=T.radius/(111*Math.cos(T.lat*Math.PI/180));const bbox=[T.lon-dLon,T.lat-dLat,T.lon+dLon,T.lat+dLat].map(x=>x.toFixed(5)).join(',');
  const fields='{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,lastReportTime}}}';
  const url='https://api.tomtom.com/traffic/services/5/incidentDetails?key='+encodeURIComponent(T.key)+'&bbox='+bbox+'&fields='+encodeURIComponent(fields)+'&language=de-DE&timeValidityFilter=present';
  fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(j=>{
    const skip=(T.skip_roads||[]).map(NR);const hc=(T.hide_closures||[]).map(NR);
    const items=(j.incidents||[]).map(f=>{const p=f.properties||{};const cat=CAT[p.iconCategory]||['Meldung','alert-circle-outline',1];return {id:p.id,cat:p.iconCategory,name:cat[0],icon:cat[1],sev:cat[2],mag:p.magnitudeOfDelay||0,
        txt:(p.events||[]).map(e=>e.description).filter(Boolean),from:p.from||'',to:p.to||'',delay:p.delay||0,len:p.length||0,roads:p.roadNumbers||[],start:p.startTime,end:p.endTime,pt:gpt(f.geometry)};})
      .filter(i=>{if(i.roads.length&&i.roads.every(r=>skip.includes(NR(r))))return false;
        if(hc.length&&(i.cat===7||i.cat===8||i.cat===9)&&(i.roads.some(r=>hc.includes(NR(r)))||hc.some(h=>NR(i.from+' '+i.to+' '+i.txt.join(' ')).includes(h))))return false;const now=Date.now(),D=864e5;
        if(i.cat===6)return i.mag>=T.min_jam&&i.delay>=T.min_delay*60;
        if(i.cat===1)return true;
        if(i.cat===8){if(i.txt.some(t=>/bau|baustelle|bauarbeit|sanierung|erneuerung/i.test(t)))return false;const st=i.start?new Date(i.start).getTime():NaN,en=i.end?new Date(i.end).getTime():NaN;if(!isNaN(en))return en-now<=T.acute_days*D;return !isNaN(st)&&now-st<=T.acute_days*D;}
        return false;})
      .map(i=>Object.assign(i,{sig:sig(i),score:i.sev*1000+(i.mag===4?3:i.mag)*100+Math.min(99,Math.round(i.delay/60))}))
      .sort((a,b)=>b.score-a.score);
    const now2=Date.now(),D=864e5;const seen=LS('sw-ct-seen',{});const hid=LS('sw-ct-hidden',[]);
    items.forEach(i=>{const e=seen[i.sig];if(!e||now2-e.l>30*D)seen[i.sig]={f:now2,l:now2};else e.l=now2;i.seenSince=seen[i.sig].f;});
    Object.keys(seen).forEach(k=>{if(now2-seen[k].l>30*D)delete seen[k];});SS('sw-ct-seen',seen);
    const vis=items.filter(i=>!hid.includes(i.sig)&&!(i.cat===8&&now2-i.seenSince>T.acute_days*D));
    this._ct2={t:Date.now(),items:vis,all:items,busy:false,err:null};this._render(true);this._ctRefresh();})
  .catch(e=>{this._ct2=Object.assign(this._ct2||{},{busy:false,err:String(e&&e.message||e)});});};
C.prototype._ctItems=function(){return (this._ct2&&this._ct2.items)||[];};
/* Startseite: Blase nur bei Meldungen */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const T=this._ctCfg();if(!T)return out;try{this._ctLoad();}catch(e){}const L=this._ctItems();
  if(!L.length&&!this._cfg.alerts_test)return out;const hard=L.some(i=>i.cat===8||i.cat===1||i.mag>=3);
  const top=L[0];const kind=i=>i.cat===8?'GESPERRT':i.cat===1?'UNFALL':'STAU';const where=i=>(i.roads[0]||i.from||'').split(/[,/(]/)[0].trim();
  const unit=!top?'MELDUNGEN':(L.length===1?kind(top):'MELDUNGEN');let sub=top?(L.length===1?(where(top)+(top.cat===6&&top.delay>=60?' +'+Math.round(top.delay/60)+' MIN':'')):where(top)+' '+kind(top)):'FREI';
  sub=sub.trim();if(sub.length>16)sub=sub.slice(0,15).trim()+'…';
  return out+this._bub(L.length,unit,{cap:T.title,txt:sub.toUpperCase()},L.length?(hard?'#F44336':'#FF9800'):null,'pop:ctraffic');};
/* Popup */
const COL=i=>(i.cat===8||i.cat===1||i.mag>=3)?'#F44336':'#FF9800';
C.prototype._ctMap=function(T,L){if(!T||!T.key||T.lat==null)return '';let z0=T.zoom||12;if(!this._ctZ){const P=L.filter(i=>i.pt);while(z0>9&&P.some(i=>{const [hx,hy]=WP(T.lat,T.lon,z0),[px,py]=WP(i.pt[0],i.pt[1],z0);return Math.abs(px-hx)>250||Math.abs(py-hy)>120;}))z0--;}const z=Math.max(9,Math.min(16,this._ctZ||z0));this._ctZc=z;const [cx,cy]=WP(T.lat,T.lon,z);const x0=Math.floor((cx-330)/256),x1=Math.floor((cx+330)/256),y0=Math.floor((cy-150)/256),y1=Math.floor((cy+150)/256);const k=encodeURIComponent(T.key);let t='';
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const l=(x-x0)*256,tp=(y-y0)*256;t+=`<img src="https://api.tomtom.com/map/1/tile/basic/night/${z}/${x}/${y}.png?key=${k}" style="left:${l}px;top:${tp}px" alt=""><img class="fl" src="https://api.tomtom.com/traffic/map/4/tile/flow/relative0-dark/${z}/${x}/${y}.png?key=${k}" style="left:${l}px;top:${tp}px" alt="">`;}
  const pins=L.map((i,n)=>{if(!i.pt)return '';const [px,py]=WP(i.pt[0],i.pt[1],z);return `<div class="ctpin${this._ctSel===n+1?' sel':''}" data-a="ctpin" data-n="${n+1}" style="left:${(px-x0*256).toFixed(1)}px;top:${(py-y0*256).toFixed(1)}px;background:${COL(i)}">${n+1}</div>`;}).join('');
  return MAPCSS+`<div class="ctmap"><div class="w" style="left:calc(50% - ${(cx-x0*256).toFixed(1)}px);top:calc(50% - ${(cy-y0*256).toFixed(1)}px)">${t}<div class="cthome" style="left:${(cx-x0*256).toFixed(1)}px;top:${(cy-y0*256).toFixed(1)}px"></div>${pins}</div><div class="ctzm"><div data-a="ctzoom" data-d="1">+</div><div data-a="ctzoom" data-d="-1">–</div></div><div class="ctattr">© TomTom</div></div>`;};
C.prototype._ctBody=function(){const T=this._ctCfg();const L=this._ctItems();const MAP=this._ctMap(T,L);
  if(!L.length){const nh=LS('sw-ct-hidden',[]).length;return MAP+`<div class="muted">${this._ct2&&this._ct2.err?'Meldungen konnten nicht geladen werden ('+esc(this._ct2.err)+').':'Derzeit keine akuten Staus oder Sperrungen im Umkreis von '+(T?T.radius:8)+' km.'}</div>`+(nh?`<div class="pmut">${nh} ausgeblendet · <span data-a="ctunhide" style="cursor:pointer;text-decoration:underline">wieder zeigen</span></div>`:'');}
  let h=MAP+L.map((i,n)=>{const col=COL(i);const road=i.roads.join(', ');
    const where=[i.from,i.to].filter(Boolean);const meta=[i.delay>=60?'+'+Math.round(i.delay/60)+' min':'',i.mag&&i.mag<4&&i.cat===6?MAG[i.mag]:'',i.len>=100?(i.len>=1000?(i.len/1000).toFixed(1).replace('.',',')+' km':Math.round(i.len/10)*10+' m'):'',until(i.end)].filter(Boolean).join(' · ');
    const extra=i.txt.filter(t=>t&&t.toLowerCase()!==i.name.toLowerCase()).join(' · ');
    return `<div class="ctit${this._ctSel===n+1?' sel':''}" data-a="ctpin" data-n="${n+1}" style="border-left:4px solid ${col};padding:2px 0 2px 12px;margin:0 0 14px"><div class="hk" style="display:flex;align-items:center;gap:8px">${i.pt?`<span class="ctno" style="background:${col}">${n+1}</span>`:''}<ha-icon icon="mdi:${i.icon}" style="--mdc-icon-size:22px;color:${col}"></ha-icon>${esc((road?road+' · ':'')+i.name)}</div>`
      +(where.length?`<div class="ht">${esc(where.join(' → '))}</div>`:'')+(extra?`<div class="ht" style="opacity:.85">${esc(extra)}</div>`:'')+(meta?`<div class="ht" style="opacity:.7;font-size:12px">${esc(meta)}</div>`:'')
      +`<div class="ht" style="opacity:.55;font-size:11px;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span>${esc(['TomTom: '+(i.start?'seit '+dt(i.start):'ohne Beginn'),i.end?'bis '+dt(i.end):'ohne Ende','auf der Wand seit '+dt(i.seenSince)].join(' · '))}</span><button data-a="cthide" data-k="${esc(i.sig)}" style="all:unset;cursor:pointer;border:1px solid rgba(255,255,255,.45);padding:3px 10px;font-size:11px;letter-spacing:.08em;opacity:1">AUSBLENDEN</button></div></div>`;}).join('');
  const t=this._ct2&&this._ct2.t;const nh=LS('sw-ct-hidden',[]).length;h+=`<div class="pmut">Umkreis ${T.radius} km · Daten: TomTom${t?' · Stand '+hm(t):''}${nh?` · ${nh} ausgeblendet <span data-a="ctunhide" style="cursor:pointer;text-decoration:underline">wieder zeigen</span>`:''}</div>`;return h;};
C.prototype._ctRefresh=function(){if(this._popKind!=='ctraffic')return;const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p||!p.classList.contains('open'))return;const b=p.querySelector('.pbody');const nb=this._ctBody();if(b&&b.__ct!==nb){b.innerHTML=nb;b.__ct=nb;}};
const ocl=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&['cthide','ctunhide','ctzoom','ctpin'].includes(n.dataset.a));
    if(el&&el.dataset.a==='ctzoom'){const T=this._ctCfg();this._ctZ=Math.max(9,Math.min(16,(this._ctZ||this._ctZc||T.zoom||12)+(+el.dataset.d)));this._ctRefresh();return;}
    if(el&&el.dataset.a==='ctpin'){const n=+el.dataset.n;this._ctSel=this._ctSel===n?0:n;const r=this.shadowRoot;r.querySelectorAll('.ctpin,.ctit').forEach(x=>x.classList.toggle('sel',+x.dataset.n===this._ctSel));const b=r.querySelector('#swpop .pbody');if(b)b.__ct=null;
      if(el.classList.contains('ctpin')&&this._ctSel){const it=r.querySelector('.ctit[data-n="'+n+'"]');if(it)it.scrollIntoView({block:'nearest',behavior:'smooth'});}return;}
    if(el){if(el.dataset.a==='cthide'){const h=LS('sw-ct-hidden',[]);if(!h.includes(el.dataset.k))h.push(el.dataset.k);SS('sw-ct-hidden',h);}else SS('sw-ct-hidden',[]);
      if(this._ct2&&this._ct2.all){const hid=LS('sw-ct-hidden',[]);const T=this._ctCfg();const now=Date.now();this._ct2.items=this._ct2.all.filter(i=>!hid.includes(i.sig)&&!(i.cat===8&&now-i.seenSince>T.acute_days*864e5));}
      this._ctRefresh();this._render(true);return;}}
  return ocl.call(this,ev);};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(String(kind)==='ctraffic'&&this._ctCfg()){const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p)return;this._popKind='ctraffic';this._ctZ=0;this._ctSel=0;const T=this._ctCfg();const body=this._ctBody();
    p.innerHTML=`<div class="panel" style="width:min(600px,100%)"><div class="pt">${esc(T.title)}</div><div class="pbody" style="max-height:min(72vh,620px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__ct=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
});})();

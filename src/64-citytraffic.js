/* Smart Wall Card – Erweiterung: Verkehrsmeldungen Stadt v1.0 (TomTom Traffic Incident Details v5)
   city_traffic: {key, lat, lon, radius (km, 8), min_jam (1–3, 2), min_delay (min, 3), acute_days (2), title ('Stau'), interval (s, 300), skip_roads ([...])} */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCity)return;C.prototype.__swCity=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* TomTom iconCategory */
const CAT={1:['Unfall','car-emergency',3],2:['Nebel','weather-fog',0],3:['Gefahr','alert-outline',2],4:['Regen','weather-pouring',0],5:['Glätte','snowflake-alert',2],6:['Stau','car-multiple',1],7:['Fahrstreifen gesperrt','road-variant',1],8:['Straße gesperrt','sign-direction-remove',3],9:['Baustelle','cone',1],10:['Wind','weather-windy',0],11:['Überflutung','home-flood',3],14:['Pannenfahrzeug','car-wrench',1]};
const MAG={1:'leicht',2:'mittel',3:'stark'};
const hm=t=>{const d=new Date(t);return isNaN(d)?'':d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});};
const until=t=>{const d=new Date(t);if(isNaN(d))return '';const n=new Date();const sameDay=d.toDateString()===n.toDateString();const tm=new Date(n);tm.setDate(n.getDate()+1);
  if(sameDay)return 'bis '+hm(d);if(d.toDateString()===tm.toDateString())return 'bis morgen '+hm(d);if(d-n>60*864e5)return '';return 'bis '+d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});};
C.prototype._ctCfg=function(){const T=this._cfg.city_traffic;if(!T||!T.key)return null;const h=this._hass&&this._hass.states&&this._hass.states['zone.home'];const A=h?h.attributes:{};
  return Object.assign({radius:8,min_jam:2,min_delay:3,acute_days:2,title:'Stau',interval:300,lat:A.latitude,lon:A.longitude,skip_roads:(this._cfg.traffic&&this._cfg.traffic.roads)||[]},T);};
C.prototype._ctLoad=function(){const T=this._ctCfg();if(!T||T.lat==null)return;const now=Date.now();const c=this._ct2;if(c&&(c.busy||now-c.t<T.interval*1000))return;
  this._ct2=Object.assign(c||{items:null},{busy:true,t:now});
  const dLat=T.radius/111,dLon=T.radius/(111*Math.cos(T.lat*Math.PI/180));const bbox=[T.lon-dLon,T.lat-dLat,T.lon+dLon,T.lat+dLat].map(x=>x.toFixed(5)).join(',');
  const fields='{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,lastReportTime}}}';
  const url='https://api.tomtom.com/traffic/services/5/incidentDetails?key='+encodeURIComponent(T.key)+'&bbox='+bbox+'&fields='+encodeURIComponent(fields)+'&language=de-DE&timeValidityFilter=present';
  fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(j=>{
    const skip=(T.skip_roads||[]).map(x=>String(x).toUpperCase());
    const items=(j.incidents||[]).map(f=>{const p=f.properties||{};const cat=CAT[p.iconCategory]||['Meldung','alert-circle-outline',1];return {id:p.id,cat:p.iconCategory,name:cat[0],icon:cat[1],sev:cat[2],mag:p.magnitudeOfDelay||0,
        txt:(p.events||[]).map(e=>e.description).filter(Boolean),from:p.from||'',to:p.to||'',delay:p.delay||0,len:p.length||0,roads:p.roadNumbers||[],start:p.startTime,end:p.endTime};})
      .filter(i=>{if(i.roads.length&&i.roads.every(r=>skip.includes(String(r).toUpperCase())))return false;const now=Date.now(),D=864e5;
        if(i.cat===6)return i.mag>=T.min_jam&&i.delay>=T.min_delay*60;
        if(i.cat===1)return true;
        if(i.cat===8){const st=i.start?new Date(i.start).getTime():NaN,en=i.end?new Date(i.end).getTime():NaN;return (!isNaN(st)&&now-st<=T.acute_days*D)||(!isNaN(en)&&en-now<=T.acute_days*D);}
        return false;})
      .map(i=>Object.assign(i,{score:i.sev*1000+(i.mag===4?3:i.mag)*100+Math.min(99,Math.round(i.delay/60))}))
      .sort((a,b)=>b.score-a.score);
    this._ct2={t:Date.now(),items,busy:false,err:null};this._render(true);this._ctRefresh();})
  .catch(e=>{this._ct2=Object.assign(this._ct2||{},{busy:false,err:String(e&&e.message||e)});});};
C.prototype._ctItems=function(){return (this._ct2&&this._ct2.items)||[];};
/* Startseite: Blase nur bei Meldungen */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const T=this._ctCfg();if(!T)return out;try{this._ctLoad();}catch(e){}const L=this._ctItems();
  if(!L.length&&!this._cfg.alerts_test)return out;const hard=L.some(i=>i.cat===8||i.cat===1||i.mag>=3);
  const top=L[0];const short=i=>i.cat===8?'gesperrt':i.cat===1?'Unfall':(i.delay>=60?'+'+Math.round(i.delay/60)+' min':'Stau');const txt=top?((top.roads[0]||top.from||'').split(/[,/]/)[0].trim()+' '+short(top)).trim():'FREI';
  return out+this._bub(L.length,L.length===1?'MELDUNG':'MELDUNGEN',{cap:T.title,txt:txt.toUpperCase()},L.length?(hard?'#F44336':'#FF9800'):null,'pop:ctraffic');};
/* Popup */
C.prototype._ctBody=function(){const T=this._ctCfg();const L=this._ctItems();
  if(!L.length)return `<div class="muted">${this._ct2&&this._ct2.err?'Meldungen konnten nicht geladen werden ('+esc(this._ct2.err)+').':'Derzeit keine akuten Staus oder Sperrungen im Umkreis von '+(T?T.radius:8)+' km.'}</div>`;
  let h=L.map(i=>{const col=(i.cat===8||i.cat===1||i.mag>=3)?'#F44336':'#FF9800';const road=i.roads.join(', ');
    const where=[i.from,i.to].filter(Boolean);const meta=[i.delay>=60?'+'+Math.round(i.delay/60)+' min':'',i.mag&&i.mag<4&&i.cat===6?MAG[i.mag]:'',i.len>=100?(i.len>=1000?(i.len/1000).toFixed(1).replace('.',',')+' km':Math.round(i.len/10)*10+' m'):'',until(i.end)].filter(Boolean).join(' · ');
    const extra=i.txt.filter(t=>t&&t.toLowerCase()!==i.name.toLowerCase()).join(' · ');
    return `<div style="border-left:4px solid ${col};padding:2px 0 2px 12px;margin:0 0 14px"><div class="hk" style="display:flex;align-items:center;gap:8px"><ha-icon icon="mdi:${i.icon}" style="--mdc-icon-size:22px;color:${col}"></ha-icon>${esc((road?road+' · ':'')+i.name)}</div>`
      +(where.length?`<div class="ht">${esc(where.join(' → '))}</div>`:'')+(extra?`<div class="ht" style="opacity:.85">${esc(extra)}</div>`:'')+(meta?`<div class="ht" style="opacity:.7;font-size:12px">${esc(meta)}</div>`:'')+`</div>`;}).join('');
  const t=this._ct2&&this._ct2.t;h+=`<div class="pmut">Umkreis ${T.radius} km · Daten: TomTom${t?' · Stand '+hm(t):''}</div>`;return h;};
C.prototype._ctRefresh=function(){if(this._popKind!=='ctraffic')return;const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p||!p.classList.contains('open'))return;const b=p.querySelector('.pbody');const nb=this._ctBody();if(b&&b.__ct!==nb){b.innerHTML=nb;b.__ct=nb;}};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(String(kind)==='ctraffic'&&this._ctCfg()){const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p)return;this._popKind='ctraffic';const T=this._ctCfg();const body=this._ctBody();
    p.innerHTML=`<div class="panel" style="width:min(600px,100%)"><div class="pt">${esc(T.title)}</div><div class="pbody" style="max-height:min(72vh,620px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__ct=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
});})();

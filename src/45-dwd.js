/* Smart Wall Card – Erweiterung: Wetterwarnungen v1.0 (DWD: Blase auf der Startseite in Warnfarbe · Popup mit Zeitraum, Beschreibung und Handlungsempfehlungen) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swDwd)return;C.prototype.__swDwd=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LV={0:'Vorabinformation',1:'Wetterwarnung',2:'Markante Wetterwarnung',3:'Unwetterwarnung',4:'Extreme Unwetterwarnung'};
const COL={0:'#90a4ae',1:'#ffeb3b',2:'#fb8c00',3:'#e53935',4:'#880e4f'};
const ICO=ev=>{const e=String(ev||'').toUpperCase();return /GEWITTER/.test(e)?'mdi:weather-lightning':/HAGEL/.test(e)?'mdi:weather-hail':/GLÄTTE|GLATTEIS|FROST/.test(e)?'mdi:snowflake-alert':/SCHNEE/.test(e)?'mdi:weather-snowy-heavy':/REGEN/.test(e)?'mdi:weather-pouring':/STURM|WIND|BÖEN|ORKAN/.test(e)?'mdi:weather-windy':/NEBEL/.test(e)?'mdi:weather-fog':/HITZE/.test(e)?'mdi:thermometer-alert':/UV/.test(e)?'mdi:weather-sunny-alert':'mdi:alert-outline';};
const t0=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
const when=ts=>{const d=new Date(ts);if(isNaN(d))return '';const n=Math.round((t0(d)-t0(new Date()))/864e5);const hm=d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
  if(hm==='00:00'&&n>=1)return (n===1?'heute':n===2?'morgen':d.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}))+' 24:00';
  return (n===0?'heute':n===1?'morgen':n===-1?'gestern':d.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}))+' '+hm;};
const hm=ts=>{const d=new Date(ts);if(isNaN(d))return '';const s=d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});return s==='00:00'?'24:00':s;};

/* Konfiguration: weather_warnings: {current, advance, name} · false = aus · ohne Angabe: DWD-Sensoren automatisch finden */
C.prototype._dwdCfg=function(){const W=this._cfg.weather_warnings;if(W===false||!this._hass)return null;const w=Object.assign({name:'Wetter',min_level:0},W||{});
  /* min_level darf auch ein Helfer sein (z. B. input_number.wetterwarnung_ab_stufe), dann gilt dessen Wert */
  if(typeof w.min_level==='string'){w.min_entity=w.min_level;const ms=this._hass.states[w.min_level];const mv=ms?parseFloat(ms.state):NaN;w.min_level=isNaN(mv)?0:mv;}
  if(!w.current&&!w.advance){const st=this._hass.states;const n=Object.keys(st).length;
    if(!this._dwdAuto||this._dwdAuto.n!==n){const ids=Object.keys(st).filter(id=>id.startsWith('sensor.')&&st[id].attributes&&/DWD/.test(String(st[id].attributes.attribution||''))&&'warning_count' in st[id].attributes);
      this._dwdAuto={n,cur:ids.find(id=>!/vorwarn|advance/i.test(id))||null,adv:ids.find(id=>/vorwarn|advance/i.test(id))||null};}
    w.current=this._dwdAuto.cur;w.advance=this._dwdAuto.adv;}
  return (w.current||w.advance)?w:null;};

/* Aktive und kommende Warnungen, stärkste zuerst */
C.prototype._dwdData=function(){const w=this._dwdCfg();if(!w)return [];const now=Date.now();const out=[];
  [[w.current,false],[w.advance,true]].forEach(([id,pre])=>{const s=id&&this._st(id);if(!s||!s.attributes)return;const a=s.attributes;const n=Number(a.warning_count)||0;
    for(let i=1;i<=n;i++){const x=a['warning_'+i];const o=(x&&typeof x==='object')?x:{event:a['warning_'+i+'_name'],headline:a['warning_'+i+'_headline'],description:a['warning_'+i+'_description'],instruction:a['warning_'+i+'_instruction'],start_time:a['warning_'+i+'_start'],end_time:a['warning_'+i+'_end'],level:a['warning_'+i+'_level'],color:a['warning_'+i+'_color'],parameters:a['warning_'+i+'_parameters']};
      const end=o.end_time?new Date(o.end_time).getTime():Infinity;if(end<now)continue;const lv=Number(o.level)||0;if(lv<(w.min_level||0))continue;
      out.push({ev:String(o.event||'Warnung'),head:o.headline||'',desc:o.description||'',instr:o.instruction||'',start:o.start_time,end:o.end_time,lv,col:o.color||COL[lv]||COL[1],params:o.parameters||null,pre,active:!o.start_time||new Date(o.start_time).getTime()<=now,region:a.region_name||''});}});
  out.sort((a,b)=>(b.active-a.active)||(b.lv-a.lv)||(new Date(a.start)-new Date(b.start)));return out;};

/* Neu zeichnen, wenn sich die Warnlage ändert */
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const w=this._dwdCfg();if(w)ids.push(w.current,w.advance,w.min_entity);return ids.filter(Boolean);};

/* Einstellungen: Wetterwarnungen ab Stufe (nur wenn min_level ein Helfer ist) */
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){let h=ops.call(this);const w=this._dwdCfg();const ms=w&&w.min_entity&&this._st(w.min_entity);if(!ms)return h;if(/Keine Einstellungen konfiguriert/.test(h))h='';
  const cur=Math.round(parseFloat(ms.state));const L=[[1,'Alle','Wetterwarnung'],[2,'Markant','ab Orange'],[3,'Unwetter','ab Rot'],[4,'Extrem','nur Violett']];
  h+=`<div class="sect"><div class="label">Wetterwarnungen</div><div class="muted" style="margin-bottom:10px">Auf der Startseite erscheinen nur DWD-Warnungen ab dieser Stufe</div><div class="grid">${L.map(([n,lab,sub])=>`<div class="tile ${cur===n?'on':''}" data-a="svc" data-d="input_number" data-s="set_value" data-e="${esc(ms.entity_id)}" data-x="${esc(JSON.stringify({value:n}))}"><ha-icon icon="mdi:alert-circle" style="color:${COL[n]};opacity:1"></ha-icon><div style="min-width:0"><div class="n">${n} · ${lab}</div><div class="st">${cur===n?'Aktiv':sub}</div></div></div>`).join('')}</div></div>`;
  return h;};

/* Blase auf der Startseite (nur bei Warnung) */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const w=this._dwdCfg();if(!w)return out;const d=this._dwdData();if(!d.length&&!this._cfg.alerts_test)return out;
  if(!d.length)return out+this._bub(0,'KEINE WARNUNG',{cap:w.name,txt:''},null,'pop:dwd');
  const top=d[0];const unit=d.length===1?top.ev.toUpperCase():'WARNUNGEN';const txt=d.length>1?top.ev.toUpperCase():top.active?(top.end?'BIS '+hm(top.end):'AKTIV'):'AB '+hm(top.start);
  return out+this._bub(d.length===1?'!':d.length,unit,{cap:w.name,txt},top.col,'pop:dwd');};

/* Popup mit allen Warnungen */
C.prototype._dwdPop=function(){const pp=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!pp)return;this._popKind=null;const w=this._dwdCfg()||{name:'Wetter'};const d=this._dwdData();
  let body=d.map(x=>{const par=x.params&&typeof x.params==='object'?Object.entries(x.params).map(([k,v])=>`${esc(k)}: ${esc(v)}`).join(' · '):'';
    return `<div style="border-left:4px solid ${esc(x.col)};padding:2px 0 2px 12px;margin:0 0 16px">
      <div class="hk" style="display:flex;align-items:center;gap:8px"><ha-icon icon="${ICO(x.ev)}" style="--mdc-icon-size:22px;color:${esc(x.col)}"></ha-icon>${esc(x.head||x.ev)}</div>
      <div class="ht" style="opacity:.8">${esc(x.pre?'Vorabinformation':(LV[x.lv]||'Warnung'))} · ${x.active?'aktiv':'ab '+esc(when(x.start))}${x.end?' bis '+esc(when(x.end)):''}</div>
      ${x.desc?`<div class="ht" style="margin-top:6px">${esc(x.desc)}</div>`:''}
      ${par?`<div class="ht" style="opacity:.7;font-size:12px">${par}</div>`:''}
      ${x.instr?`<div class="ht" style="margin-top:6px;white-space:pre-line;opacity:.9">${esc(String(x.instr).replace(/\n\s*\n/g,'\n'))}</div>`:''}</div>`;}).join('');
  if(!body)body='<div class="muted">Derzeit keine amtlichen Warnungen.</div>';
  const reg=d.length?d[0].region:'';
  body+=`<div class="pmut">Amtliche Warnungen des Deutschen Wetterdienstes${reg?' für '+esc(reg):''}.</div>`;
  pp.innerHTML=`<div class="panel" style="width:min(560px,100%)" data-dwdpop="1"><div class="pt">${esc(w.name)}warnungen</div><div class="pbody">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;pp.classList.add('open');};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(String(kind)==='dwd')return this._dwdPop();return oop.call(this,kind);};
});})();

/* Smart Wall Card – Erweiterung: Weihnachten v1.0 (Weihnachtsnamen für Steckdosen/Lichter, solange ein Schalter an ist · Abschnitt „Weihnachten“ in den Einstellungen mit Automatik- und Namen-Schalter) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swXmas)return;C.prototype.__swXmas=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Konfiguration:
   xmas: {names_entity: input_boolean.weihnachtsnamen, automation_entity: input_boolean.weihnachtsbeleuchtung,
          names: {light.x: "Lichterkette Schlafzimmer", ...}} */
C.prototype._xmasName=function(id){const X=this._cfg.xmas;if(!X||!X.names||!X.names[id])return null;const s=X.names_entity&&this._st(X.names_entity);return s&&s.state==='on'?X.names[id]:null;};
const ot=C.prototype._tile;
C.prototype._tile=function(id,icon,strip,action,name,...r){return ot.call(this,id,icon,strip,action,this._xmasName(id)||name,...r);};
/* Weihnachts-Raum: xmas.rooms: {light.x: "Wohnzimmer"} verschiebt den Stecker, solange die Namen an sind */
const opp=C.prototype._pPlug;
C.prototype._pPlug=function(){const X=this._cfg.xmas;const s=X&&X.rooms&&X.names_entity&&this._st(X.names_entity);if(!s||s.state!=='on')return opp.call(this);
  const L=this._cfg.lights;const eid=e=>typeof e==='string'?e:e&&e.entity;const mv=[];
  const nl=(L||[]).map(g=>{if(!g||typeof g!=='object'||!g.plugs)return g;const keep=[];g.plugs.forEach(e=>{const to=X.rooms[eid(e)];if(to&&to!==g.room)mv.push([to,e]);else keep.push(e);});return Object.assign({},g,{plugs:keep});});
  mv.forEach(([to,e])=>{let g=nl.find(x=>x&&x.room===to);if(!g){g={room:to,plugs:[]};nl.push(g);}else if(!g.plugs){const i=nl.indexOf(g);g=nl[i]=Object.assign({},g,{plugs:[]});}g.plugs=[...g.plugs,e];});
  this._cfg.lights=nl;try{return opp.call(this);}finally{this._cfg.lights=L;}};
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const X=this._cfg.xmas;if(X)ids.push(X.names_entity,X.automation_entity,...(X.times||[]).map(o=>o&&o.entity),...(X.numbers||[]).map(o=>o&&o.entity));return ids.filter(Boolean);};
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){let h=ops.call(this);const X=this._cfg.xmas;if(!X)return h;
  const tile=(id,ic,lab,onTxt,offTxt,confOff)=>{const s=id&&this._st(id);if(!s)return '';const on=s.state==='on';
    return `<div class="tile ${on?'on':''}" style="height:auto;min-height:64px;grid-column:span 2" data-a="svc" data-d="input_boolean" data-s="${on?'turn_off':'turn_on'}" data-e="${esc(id)}"${on&&confOff?` data-c="${esc(confOff)}"`:''}><ha-icon icon="mdi:${ic}"></ha-icon><div style="min-width:0"><div class="n" style="overflow-wrap:anywhere">${esc(lab)}</div><div class="st">${on?onTxt:offTxt}</div></div></div>`;};
  const t=tile(X.automation_entity,'pine-tree','Weihnachtsbeleuchtung','Automatik an','Aus','Weihnachtsbeleuchtung beenden? Alle Weihnachts-Steckdosen werden ausgeschaltet.')+tile(X.names_entity,'string-lights','Weihnachtsnamen','Lichterketten-Namen','Normale Namen');
  /* Uhrzeit (input_datetime) mit −/+ in 15-Minuten-Schritten: xmas.times: [{entity, name}] */
  const tm=(X.times||[]).map(o=>{const s=o&&o.entity&&this._st(o.entity);if(!s)return '';const [hh,mm]=String(s.state).split(':').map(Number);if(isNaN(hh)||isNaN(mm))return '';
    const at=d=>{const m=((hh*60+mm+d)%1440+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')+':00';};
    const btn=(d,ic)=>`<button class="btn" data-a="svc" data-d="input_datetime" data-s="set_datetime" data-e="${esc(o.entity)}" data-x="${esc(JSON.stringify({time:at(d)}))}"><ha-icon icon="mdi:${ic}"></ha-icon></button>`;
    return `<div class="li"><ha-icon icon="${esc(o.icon||s.attributes.icon||'mdi:clock-outline')}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${esc(o.name||s.attributes.friendly_name||o.entity)}</div><div class="i">${esc(at(0).slice(0,5))} Uhr</div></div>${btn(-15,'minus')}${btn(15,'plus')}</div>`;}).join('');
  /* Zahlen (input_number) mit −/+ um den Helfer-Schritt: xmas.numbers: [{entity, name, unit}] */
  const nm=(X.numbers||[]).map(o=>{const s=o&&o.entity&&this._st(o.entity);if(!s)return '';const v=parseFloat(s.state);
    const btn=(sv,ic)=>`<button class="btn" data-a="svc" data-d="input_number" data-s="${sv}" data-e="${esc(o.entity)}"><ha-icon icon="mdi:${ic}"></ha-icon></button>`;
    return `<div class="li"><ha-icon icon="${esc(o.icon||s.attributes.icon||'mdi:counter')}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${esc(o.name||s.attributes.friendly_name||o.entity)}</div><div class="i">${isNaN(v)?'–':String(v).replace('.',',')+' '+esc(o.unit||s.attributes.unit_of_measurement||'')}</div></div>${btn('decrement','minus')}${btn('increment','plus')}</div>`;}).join('');
  const rows=tm+nm;
  if(!t&&!rows)return h;if(/Keine Einstellungen konfiguriert/.test(h))h='';
  return h+`<div class="sect"><div class="label">Weihnachten</div>${t?`<div class="grid">${t}</div>`:''}${rows?`<div style="margin-top:10px">${rows}</div>`:''}</div>`;};
});})();

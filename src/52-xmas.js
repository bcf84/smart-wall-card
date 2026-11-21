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
C.prototype._relevant=function(){const ids=orl.call(this);const X=this._cfg.xmas;if(X)ids.push(X.names_entity,X.automation_entity);return ids.filter(Boolean);};
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){let h=ops.call(this);const X=this._cfg.xmas;if(!X)return h;
  const tile=(id,ic,lab,onTxt,offTxt,confOff)=>{const s=id&&this._st(id);if(!s)return '';const on=s.state==='on';
    return `<div class="tile ${on?'on':''}" data-a="svc" data-d="input_boolean" data-s="${on?'turn_off':'turn_on'}" data-e="${esc(id)}"${on&&confOff?` data-c="${esc(confOff)}"`:''}><ha-icon icon="mdi:${ic}"></ha-icon><div style="min-width:0"><div class="n">${esc(lab)}</div><div class="st">${on?onTxt:offTxt}</div></div></div>`;};
  const t=tile(X.automation_entity,'pine-tree','Weihnachtsbeleuchtung','Automatik an','Aus','Weihnachtsbeleuchtung beenden? Alle Weihnachts-Steckdosen werden ausgeschaltet.')+tile(X.names_entity,'string-lights','Weihnachtsnamen','Lichterketten-Namen','Normale Namen');
  if(!t)return h;if(/Keine Einstellungen konfiguriert/.test(h))h='';
  return h+`<div class="sect"><div class="label">Weihnachten</div><div class="grid">${t}</div></div>`;};
});})();

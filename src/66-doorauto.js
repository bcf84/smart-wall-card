/* Smart Wall Card – Erweiterung: Haustür automatisch öffnen v1.0
   door_auto: {automation: automation.xxx, name: 'Automatisch öffnen', bubble: true}
   Haustür als geteilte Kachel (links öffnen, rechts „Auto“ mit Rückfrage); Türkacheln so breit wie die Kamerabilder; Blase auf der Startseite, solange sie an ist. */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swDoorAuto)return;C.prototype.__swDoorAuto=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
C.prototype._daCfg=function(){const D=this._cfg.door_auto;if(!D)return null;return typeof D==='string'?{automation:D}:D;};
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const D=this._daCfg();if(D)ids.push(D.automation);return ids.filter(Boolean);};
const CSS=`.doors.swda{display:flex;flex-wrap:wrap;gap:10px}
.doors.swda>.door2{flex:0 1 440px;max-width:440px;width:440px;box-sizing:border-box}
.door2 .d2main .i{font-size:11px}
.door2 .d2main.on{background:rgba(255,255,255,.18)}
.door2 .d2open.auto{background:rgba(255,152,0,.32)}
.door2 .d2open.auto ha-icon{color:#FFB74D}
@media (max-width:900px){.doors.swda>.door2{flex:1 1 100%;max-width:none;width:100%}}`;
const sty=sr=>{if(sr&&!sr.getElementById('swdacss')){const x=document.createElement('style');x.id='swdacss';x.textContent=CSS;sr.appendChild(x);}};
const block=(h,from)=>{const re=/<div\b[^>]*>|<\/div>/g;re.lastIndex=from;let depth=0,m;while((m=re.exec(h))){if(m[0][1]==='/'){depth--;if(depth===0)return m.index+6;}else depth++;}return -1;};
const ops=C.prototype._pSec;
C.prototype._pSec=function(){let h=ops.apply(this,arguments);const c=this._cfg;const D=this._daCfg();sty(this.shadowRoot);
  h=h.replace('<div class="doors">','<div class="doors swda">');
  /* Haustür als geteilte Kachel wie die Wohnungstür: links öffnen, rechts Automatik */
  const oi=h.indexOf('data-a="opener"');if(oi<0)return h;const bi=h.lastIndexOf('<div class="big',oi);if(bi<0)return h;const be=block(h,bi);if(be<0)return h;
  const op=this._st(c.door_opener);const run=op&&(op.state==='on'||this._opLock);const na=!op||op.state==='unavailable';
  const s=D&&this._st(D.automation);const on=s&&s.state==='on';
  const auto=s?`<div class="d2open ${on?'auto':''}" data-a="svc" data-d="automation" data-s="${on?'turn_off':'turn_on'}" data-e="${esc(D.automation)}" data-c="${esc(on?'Automatisches Öffnen beenden?':'Haustür automatisch öffnen, sobald unten jemand klingelt?\n\nSchaltet sich nach 3 Stunden und beim Schlafengehen von selbst wieder aus.')}"><ha-icon icon="mdi:${on?'bell-ring':'bell-outline'}"></ha-icon><div class="ol">Auto ${on?'an':'aus'}</div></div>`:'';
  const tile=`<div class="door2 ${na?'na':''}"><div class="d2main ${run?'on':''}" data-a="opener" data-e="${esc(c.door_opener)}"><ha-icon icon="mdi:${run?'door-open':'door-closed'}"></ha-icon><div><div class="n">${esc(c.door_opener_name||'Haustür')}</div><div class="i">${run?'Öffnet …':(on?'Öffnet auch beim Klingeln':'Tippen zum Öffnen · 1 Sekunde')}</div></div></div>${auto}</div>`;
  return h.slice(0,bi)+tile+h.slice(be);};
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const D=this._daCfg();const s=D&&this._st(D.automation);if(!s||D.bubble===false||s.state!=='on')return out;
  return out+this._bub('!','AUTO-ÖFFNEN',{cap:'Haustür',txt:'AN'},'#FF9800','security');};
});})();

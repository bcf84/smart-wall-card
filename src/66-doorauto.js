/* Smart Wall Card – Erweiterung: Haustür automatisch öffnen v1.0
   door_auto: {automation: automation.xxx, name: 'Automatisch öffnen', bubble: true}
   Kachel rechts neben der Haustür (Sicherheit) schaltet die Automation mit Rückfrage; Blase auf der Startseite, solange sie an ist. */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swDoorAuto)return;C.prototype.__swDoorAuto=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
C.prototype._daCfg=function(){const D=this._cfg.door_auto;if(!D)return null;return typeof D==='string'?{automation:D}:D;};
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const D=this._daCfg();if(D)ids.push(D.automation);return ids.filter(Boolean);};
const ops=C.prototype._pSec;
C.prototype._pSec=function(){let h=ops.apply(this,arguments);const D=this._daCfg();const s=D&&this._st(D.automation);if(!s)return h;const on=s.state==='on';
  const tile=`<div class="big ${on?'on':''}" data-a="svc" data-d="automation" data-s="${on?'turn_off':'turn_on'}" data-e="${esc(D.automation)}" data-c="${esc(on?'Automatisches Öffnen beenden?':'Haustür automatisch öffnen, sobald unten jemand klingelt?\n\nSchaltet sich nach 3 Stunden und beim Schlafengehen von selbst wieder aus.')}"${on?' style="background:rgba(255,152,0,.28)"':''}><ha-icon icon="mdi:${on?'door-open':'bell-ring-outline'}"${on?' style="color:#FFB74D"':''}></ha-icon><div><div class="n">${esc(D.name||'Automatisch öffnen')}</div><div class="i" style="font-size:11px">${on?'An · öffnet beim Klingeln':'Aus · tippen zum Einschalten'}</div></div></div>`;
  const k='<div class="doors">';const i=h.indexOf(k);if(i<0)return h;
  const re=/<div\b[^>]*>|<\/div>/g;re.lastIndex=i+k.length;let depth=0,m;
  while((m=re.exec(h))){if(m[0][1]==='/'){if(depth===0)return h.slice(0,m.index)+tile+h.slice(m.index);depth--;}else depth++;}
  return h;};
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const D=this._daCfg();const s=D&&this._st(D.automation);if(!s||D.bubble===false||s.state!=='on')return out;
  return out+this._bub('!','AUTO-ÖFFNEN',{cap:'Haustür',txt:'AN'},'#FF9800','security');};
});})();

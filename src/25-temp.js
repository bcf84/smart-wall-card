/* Smart Wall Card – Erweiterung: schnelle Temperaturregelung v1.2 (Temperatur: sofortige Anzeige + Blinken bis Bestätigung; Homematic-Meldungen mit Gerätenamen) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swTemp)return;C.prototype.__swTemp=true;
const oc=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a);if(el&&el.dataset.a==='temp'){const id=el.dataset.e,h=this._hass,s=this._st(id);if(!s||!h)return;const a=s.attributes;const step=a.target_temp_step||0.5;this._tp=this._tp||{};this._tpT=this._tpT||{};const pd=this._tp[id];const now=Date.now();const base=(pd&&now-pd.t<15000)?pd.v:(a.temperature!=null?a.temperature:20);let t=Math.round((base+step*Number(el.dataset.dir))*10)/10;if(a.min_temp!=null)t=Math.max(a.min_temp,t);if(a.max_temp!=null)t=Math.min(a.max_temp,t);const p={v:t,t:now,sent:false};this._tp[id]=p;this._tpApply();clearTimeout(this._tpT[id]);this._tpT[id]=setTimeout(()=>{p.sent=true;p.t=Date.now();h.callService('climate','set_temperature',{entity_id:id,temperature:t});setTimeout(()=>this._tpApply(),15100);if(s.attributes.temperature===t)this._tpApply();},700);return;}}return oc.call(this,ev);};
const orr=C.prototype._render;
C.prototype._render=function(f){const r=orr.call(this,f);try{this._tpApply();}catch(e){}return r;};
C.prototype._tpVal=function(id){const b=this.shadowRoot&&this.shadowRoot.querySelector('button[data-a="temp"][data-e="'+id+'"]');const cd=b&&b.closest('.cl');return cd&&cd.querySelector('.val');};
C.prototype._tpFlash=function(vv,col){if(!vv)return;vv.style.animation='';vv.style.color=col;vv.style.transition='color .4s';setTimeout(()=>{vv.style.color='';},1800);};
C.prototype._tpApply=function(){const sr=this.shadowRoot;if(!sr)return;if(!sr.getElementById('swtpcss')){const st=document.createElement('style');st.id='swtpcss';st.textContent='@keyframes swtpb{0%,100%{opacity:1}50%{opacity:.25}}';sr.appendChild(st);}const P=this._tp;if(!P)return;
  for(const id in P){const p=P[id];const s=this._st(id);const vv=this._tpVal(id);if(!s){delete P[id];continue;}const cur=s.attributes.temperature;
    if(p.sent&&cur===p.v){delete P[id];this._tpFlash(vv,'#9ccc65');continue;}
    if(Date.now()-p.t>15000){delete P[id];if(vv)vv.textContent=cur!=null?Number(cur).toFixed(1)+'°':'–';this._tpFlash(vv,'#FF9800');continue;}
    if(vv){const txt=Number(p.v).toFixed(1)+'°';if(vv.textContent!==txt)vv.textContent=txt;if(!vv.style.animation)vv.style.animation='swtpb 1s ease-in-out infinite';}}};

/* Homematic-Meldungen: Gerätename statt Modell+Seriennummer */
const ohr=C.prototype._hmRoom;
C.prototype._hmName=function(txt){const m=String(txt).match(/^(\S+)\s+([0-9A-F]{14}|[A-Z]{3}[0-9]{7})\b/);if(!m||!this._hass)return '';const sn=m[2].toLowerCase();const h=this._hass;let dev=null,room='';for(const eid in (h.entities||{})){if(eid.includes(sn)){const e=h.entities[eid];dev=e.device_id&&h.devices?h.devices[e.device_id]:null;room=this._area(eid)||'';break;}}if(dev&&dev.name_by_user)return dev.name_by_user;const ty=this._devType(m[1]);return ty.t?(ty.t+(room?' '+room:'')):(room?m[1]+' '+room:'');};
C.prototype._hmRoom=function(txt){return this._hmName(txt)||ohr.call(this,txt);};
const swE=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SW_HMSYS=[[/copro-lost/i,'Das Funkmodul der CCU war kurz nicht erreichbar. Passiert meist bei einem Neustart der CCU. Läuft die Funkverbindung wieder, kannst du die Meldung in der CCU bestätigen.'],[/^WatchDog/i,'Der Überwachungsdienst der CCU hat ein internes Problem gemeldet. Einmalig harmlos – tritt es öfter auf, die CCU neu starten.']];
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){const r=oop.call(this,kind);if(kind==='homematic'&&this.shadowRoot)this.shadowRoot.querySelectorAll('#swpop .ht').forEach(el=>{const raw=el.textContent;const sys=SW_HMSYS.find(x=>x[0].test(raw));if(sys){el.innerHTML=swE(sys[1])+'<div style="opacity:.55;font-size:11px;margin-top:3px">CCU-System · '+swE(raw)+'</div>';return;}el.textContent=raw.replace(/^\S+\s+([0-9A-F]{14}|[A-Z]{3}[0-9]{7})(:\d+)?:?\s*/,'');});return r;};
});})();
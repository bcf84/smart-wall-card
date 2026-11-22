/* Smart Wall Card – Erweiterung: Integration ein/aus im Bereich Heizbetrieb v1.0
   settings.heating.ac_entry: <config entry id>  (optional ac_name)
   Benennt den Bereich in „Heizen & Kühlen“ um und ergänzt eine Kachel „Klimaanlage“. Braucht Administratorrechte. */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swETog)return;C.prototype.__swETog=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const unauth=err=>err&&(err.code==='unauthorized'||/unauthori/i.test(err.message||''));
C.prototype._etLoad=function(id,force){const c=this._et||(this._et={});const now=Date.now();if(!force&&c.id===id&&(c.busy||now-c.t<30000))return;const h=this._hass;if(!h||!h.callWS)return;
  Object.assign(c,{id,busy:true,t:now});
  h.callWS({type:'config_entries/get'}).then(L=>{const e=(L||[]).find(x=>x.entry_id===id);c.busy=false;c.err=e?null:'Integration nicht gefunden';c.state=e?e.state:null;c.disabled=e?!!e.disabled_by:null;if(this._page==='settings')this._render(true);})
   .catch(err=>{c.busy=false;c.err=unauth(err)?'Keine Berechtigung':String(err&&err.message||err);if(this._page==='settings')this._render(true);});};
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){let h=ops.call(this);const H=(this._cfg.settings||{}).heating;if(!H||!H.ac_entry)return h;
  const L='<div class="label">Heizbetrieb</div>';const li=h.indexOf(L);if(li<0)return h;this._etLoad(H.ac_entry);const c=this._et||{};
  const on=c.disabled===false;const known=c.disabled!=null;
  const st=c.switching?'Schaltet …':c.err?c.err:!known?'Lädt …':on?(c.state==='loaded'?'Integration an':'An · '+c.state):'Integration aus';
  const tile=`<div class="tile ${on?'on':''}" data-a="etog" data-k="${esc(H.ac_entry)}"><ha-icon icon="mdi:${on?'air-conditioner':'snowflake-off'}"></ha-icon><div style="min-width:0"><div class="n">${esc(H.ac_name||'Klimaanlage')}</div><div class="st">${esc(st)}</div></div></div>`;
  h=h.slice(0,li)+'<div class="label">Heizen &amp; Kühlen</div>'+h.slice(li+L.length);
  const gi=h.indexOf('<div class="grid">',li);if(gi<0)return h;const start=gi+'<div class="grid">'.length;
  const re=/<div\b[^>]*>|<\/div>/g;re.lastIndex=start;let depth=0,m;
  while((m=re.exec(h))){if(m[0][1]==='/'){if(depth===0)return h.slice(0,m.index)+tile+h.slice(m.index);depth--;}else depth++;}
  return h;};
const ocl=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a==='etog');
    if(el){const id=el.dataset.k;const c=this._et||{};const h=this._hass;if(c.switching||c.disabled==null)return;const turnOff=c.disabled===false;
      if(turnOff&&!window.confirm('Klimaanlage-Integration ausschalten? Das Gerät verschwindet aus Home Assistant, bis du sie wieder einschaltest.'))return;
      c.switching=true;this._render(true);
      h.callWS({type:'config_entries/disable',entry_id:id,disabled_by:turnOff?'user':null}).then(()=>{c.switching=false;this._etLoad(id,true);setTimeout(()=>this._etLoad(id,true),3000);})
       .catch(err=>{c.switching=false;c.err=unauth(err)?'Keine Berechtigung':String(err&&err.message||err);this._render(true);});
      return;}}
  return ocl.call(this,ev);};
});})();

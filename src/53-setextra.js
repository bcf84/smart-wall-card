/* Smart Wall Card – Erweiterung: zusätzliche Einstellungsbereiche v1.0
   settings_extra: [{title, hint, items:[{entity, name, icon, on, off, confirm_off}]}]
   input_boolean → Schalter-Kachel · input_select → je Option eine Kachel */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swSetX)return;C.prototype.__swSetX=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=i=>String(i||'').startsWith('mdi:')?i:'mdi:'+(i||'toggle-switch-outline');
const T='height:auto;min-height:64px;grid-column:span 2';
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);if(this._page==='settings')(this._cfg.settings_extra||[]).forEach(S=>(S.items||[]).forEach(o=>ids.push(o&&o.entity)));return ids.filter(Boolean);};
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){let h=ops.call(this);const L=this._cfg.settings_extra;if(!Array.isArray(L)||!L.length)return h;let add='';
  L.forEach(S=>{const parts=(S.items||[]).map(o=>{const s=o&&o.entity&&this._st(o.entity);if(!s)return '';const dom=o.entity.split('.')[0];const nm=o.name||s.attributes.friendly_name||o.entity;
      if(dom==='input_select'||dom==='select'){return {sel:nm,h:(s.attributes.options||[]).map(op=>{const on=s.state===op;return `<div class="tile ${on?'on':''}" style="${T}" data-a="svc" data-d="${dom}" data-s="select_option" data-e="${esc(o.entity)}" data-x="${esc(JSON.stringify({option:op}))}"><ha-icon icon="${esc(ico((o.icons&&o.icons[op])||o.icon||s.attributes.icon))}"></ha-icon><div style="min-width:0"><div class="n" style="overflow-wrap:anywhere">${esc(op)}</div><div class="st">${on?'Aktiv':'&nbsp;'}</div></div></div>`;}).join('')};}
      const on=s.state==='on';
      return {h:`<div class="tile ${on?'on':''}" style="${T}" data-a="svc" data-d="${dom==='switch'?'switch':'input_boolean'}" data-s="${on?'turn_off':'turn_on'}" data-e="${esc(o.entity)}"${on&&o.confirm_off?` data-c="${esc(o.confirm_off)}"`:''}${!on&&o.confirm_on?` data-c="${esc(o.confirm_on)}"`:''}><ha-icon icon="${esc(ico(o.icon||s.attributes.icon))}"></ha-icon><div style="min-width:0"><div class="n" style="overflow-wrap:anywhere">${esc(nm)}</div><div class="st">${esc(on?(o.on||'An'):(o.off||'Aus'))}</div></div></div>`};}).filter(Boolean);
    const tg=parts.filter(x=>!x.sel).map(x=>x.h).join('');const sg=parts.filter(x=>x.sel).map(x=>`<div class="sub">${esc(x.sel)}</div><div class="grid">${x.h}</div>`).join('');
    if(tg||sg)add+=`<div class="sect"><div class="label">${esc(S.title||'Einstellungen')}</div>${S.hint?`<div class="muted" style="margin-bottom:10px">${esc(S.hint)}</div>`:''}${tg?`<div class="grid">${tg}</div>`:''}${sg}</div>`;});
  if(!add)return h;if(/Keine Einstellungen konfiguriert/.test(h))h='';return h+add;};
});})();

/* Smart Wall Card – Erweiterung: einklappbare Einstellungen v1.0 (jeder Abschnitt der Einstellungsseite klappt per Tipp auf die Überschrift auf und zu; Zustand bleibt pro Gerät gespeichert) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCol)return;C.prototype.__swCol=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='sw-settings-open';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){return {};}};
const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o));}catch(_){}};
const CSS='<style>.swcol:not(.open)>:not(.label){display:none}.swch{cursor:pointer;display:flex;align-items:center;gap:6px;user-select:none}.swch ha-icon{--mdc-icon-size:18px;opacity:.7;flex:none}.swcol:not(.open)>.swch{margin-bottom:0;opacity:.85}</style>';
/* Konfiguration: settings_collapsible: false = alles offen wie bisher */
const ops=C.prototype._pSettings;
C.prototype._pSettings=function(){const h=ops.call(this);if(this._cfg.settings_collapsible===false)return h;const open=this._setOpen||(this._setOpen=load());
  const out=h.replace(/<div class="sect"><div class="label">([^<]*)/g,(m,lab)=>{const k=lab.trim();const o=!!open[k];
    return `<div class="sect swcol${o?' open':''}"><div class="label swch" data-a="swsect" data-k="${esc(k)}"><ha-icon icon="mdi:chevron-${o?'down':'right'}"></ha-icon>${lab}`;});
  return out===h?h:CSS+out;};
const oc=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a==='swsect');
    if(el){const o=this._setOpen||(this._setOpen=load());const k=el.dataset.k;o[k]=!o[k];save(o);this._render(true);return;}}
  return oc.call(this,ev);};
});})();

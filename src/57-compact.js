/* Smart Wall Card – Erweiterung: etwas engere Licht- und Steckdosen-Seite v1.1 (gleiches Layout wie bisher, nur kleinere Abstände und flachere Kacheln, lange Namen machen die Kachel höher statt überzustehen; compact_lights: false = Originalmaße) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCompact)return;C.prototype.__swCompact=true;
const CSS='<style>'
 +'.swc .sect{margin-top:12px}'
 +'.swc .rh{margin-bottom:6px}'
 +'.swc>.sect>.label{margin-bottom:6px}'
 +'.swc .grid{gap:6px}'
 +'.swc .tile{height:auto;min-height:56px;padding:8px 12px}'
 +'</style>';
const wrap=h=>h.indexOf('class="sect"')>=0?CSS+'<div class="swc">'+h+'</div>':h;
const ol=C.prototype._pLightCfg;
C.prototype._pLightCfg=function(){const h=ol.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
const op=C.prototype._pPlug;
C.prototype._pPlug=function(){const h=op.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
});})();

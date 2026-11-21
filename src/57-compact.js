/* Smart Wall Card – Erweiterung: kompakte Licht- und Steckdosen-Seite v1.0 (Raumname links, Kacheln in einer Zeile daneben, flachere Kacheln – damit möglichst alle Räume ohne Scrollen passen; schmale Bildschirme bleiben untereinander) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCompact)return;C.prototype.__swCompact=true;
const CSS='<style>'
 +'.swc .sect{display:grid;grid-template-columns:150px 1fr;gap:6px 14px;align-items:center;margin-top:8px}'
 +'.swc .sect:first-child{margin-top:0}'
 +'.swc .rh{flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;margin:0}'
 +'.swc .label{margin:0;font-size:12px;letter-spacing:.18em;text-align:left;padding-left:0}'
 +'.swc .rh .chip{font-size:10px;padding:3px 6px;letter-spacing:.12em}'
 +'.swc .sub{margin:0;font-size:11px;opacity:.6}'
 +'.swc .grid{grid-template-columns:repeat(auto-fill,minmax(178px,1fr));gap:6px}'
 +'.swc .tile{height:50px;min-height:50px;padding:8px 12px;gap:10px}'
 +'.swc .tile ha-icon{--mdc-icon-size:20px}'
 +'.swc .tile .n{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 +'.swc .tile .st{font-size:12px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 +'@media (max-width:700px){.swc .sect{display:block;margin-top:16px}.swc .rh{flex-direction:row;align-items:center;justify-content:space-between;margin-bottom:8px}.swc .label{margin-bottom:8px}.swc .rh .label{margin-bottom:0}}'
 +'</style>';
const wrap=h=>h.indexOf('class="sect"')>=0?CSS+'<div class="swc">'+h+'</div>':h;
const ol=C.prototype._pLightCfg;
C.prototype._pLightCfg=function(){const h=ol.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
const op=C.prototype._pPlug;
C.prototype._pPlug=function(){const h=op.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
});})();

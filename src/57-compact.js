/* Smart Wall Card – Erweiterung: etwas engere Licht- und Steckdosen-Seite v1.1 (gleiches Layout wie bisher, nur kleinere Abstände und flachere Kacheln, alle Kacheln gleich hoch, lange Namen in zwei Zeilen; compact_lights: false = Originalmaße) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCompact)return;C.prototype.__swCompact=true;
const CSS='<style>'
 +'.swc .sect{margin-top:8px}'
 +'.swc .rh{margin-bottom:6px}'
 +'.swc>.sect>.label{margin-bottom:6px}'
 +'.swc .grid{gap:6px}'
 +'.swc .tile{height:64px;min-height:64px;padding:8px 12px}'
 +'.swc .tile .n{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.2;white-space:normal}'
 +'.swc .tile .st{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 +'</style>';
const wrap=h=>h.indexOf('class="sect"')>=0?CSS+'<div class="swc">'+h+'</div>':h;
const ol=C.prototype._pLightCfg;
C.prototype._pLightCfg=function(){const h=ol.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
const op=C.prototype._pPlug;
C.prototype._pPlug=function(){const h=op.call(this);return this._cfg.compact_lights===false?h:wrap(h);};
/* Batterien-Kachel im Haushalt: auch ohne schwache Batterien eine Zeile mit den drei niedrigsten Ständen – gleich hoch wie die anderen Kacheln */
/* Haushalt: alle Kacheln gleich hoch (jede Zeile so hoch wie die höchste Kachel der Seite) */
const opa2=C.prototype._pApp;
C.prototype._pApp=function(list){const h=opa2.apply(this,arguments);if(list||this._cfg.compact_lights===false)return h;return h.replace(/<div class="apps"/g,'<div class="apps" style="grid-auto-rows:1fr"');};
const obt=C.prototype._batTile;
if(obt)C.prototype._batTile=function(a){const h=obt.call(this,a);if(h.indexOf('class="chips"')>=0||!this._lowBatteries)return h;
  const all=this._lowBatteries(100).filter(x=>!String(x.id).startsWith('binary_sensor.')&&!isNaN(parseFloat(x.v))).sort((p,q)=>parseFloat(p.v)-parseFloat(q.v)).slice(0,3);if(!all.length)return h;
  const chips=`<div class="chips">${all.map(x=>`<span class="ci" data-a="openpop" data-p="bat" style="cursor:pointer">${swEsc(x.n)}: <b>${Math.round(parseFloat(x.v))}${x.u?' '+swEsc(x.u):''}</b></span>`).join('')}</div>`;
  const i=h.lastIndexOf('</div>');return h.slice(0,i)+chips+h.slice(i);};
});})();

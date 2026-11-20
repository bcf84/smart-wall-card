/* Smart Wall Card – Erweiterung: Gruppen-Dimmer v1.0 (Regler einer Lichtgruppe dimmt nur die Lampen, die gerade an sind; sind alle aus, wie bisher alle) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swGrpDim)return;C.prototype.__swGrpDim=true;
const osb=C.prototype._setBri;
C.prototype._setBri=function(id,pct){if(!this._hass)return;const g=this._st(id);
  if(g&&g.attributes&&Array.isArray(g.attributes.entity_id)&&pct>0){const on=g.attributes.entity_id.filter(m=>{const s=this._st(m);return s&&s.state==='on';});
    if(on.length){this._hass.callService('light','turn_on',{entity_id:on,brightness_pct:pct});return;}}
  return osb.call(this,id,pct);};
});})();

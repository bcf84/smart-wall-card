/* Smart Wall Card 3 – weniger Rechenarbeit:
   Batterie-Suche einmal pro HA-Zustand, Liste relevanter Entitäten pro Seite gemerkt */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swPerf)return;C.prototype.__swPerf=true;
const olb=C.prototype._lowBatteries;
C.prototype._lowBatteries=function(th){const h=this._hass;const k=String(th);let c=this._lbC;
  if(!c||c.h!==h)c=this._lbC={h,v:{}};
  if(!(k in c.v))c.v[k]=olb.call(this,th);
  return c.v[k].map(x=>Object.assign({},x));};
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const now=Date.now();const c=this._relC;const q=this._page==='search'?this._q:'';
  if(c&&c.p===this._page&&c.q===q&&c.cfg===this._cfg&&now-c.t<60000)return c.ids;
  const ids=[...new Set(orl.call(this))];this._relC={p:this._page,q,cfg:this._cfg,t:now,ids};return ids;};
});})();

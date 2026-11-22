/* Smart Wall Card – Erweiterung: Energie-Popup v1.0 (Energiefluss jetzt, Heute mit Anteilen, Verlauf 24 h / 7 Tage, Akku-Details, Gesamtbilanz) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swEnergy)return;C.prototype.__swEnergy=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const de=(n,d)=>(n==null||isNaN(n))?'–':Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
const DAYS=['So','Mo','Di','Mi','Do','Fr','Sa'];
const COL={solar:'#ffd54f',bat:'#9ccc65',grid:'#ef9a9a',house:'#81d4fa',feed:'#ce93d8'};
const BST={charge:'Lädt',charging:'Lädt',discharge:'Entlädt',discharging:'Entlädt',bypass:'Bypass',standby:'Standby',idle:'Bereit',full:'Voll',off:'Aus',normal:'Normal',fully_charged:'Voll geladen',cold_wakeup:'Aufwärmen',protection_charge:'Schutzladung',unavailable:'Nicht erreichbar',unknown:'–'};
const fW=v=>v==null||isNaN(v)?'–':(Math.abs(v)>=1000?de(v/1000,1)+' kW':Math.round(v)+' W');
const CSS=`
.enw{width:min(680px,100%)!important}
.enw .prow span{text-transform:none}
.ensec{font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:.6;margin:18px 0 8px;display:flex;align-items:center;justify-content:space-between}
.ensec:first-child{margin-top:6px}
.enflow{position:relative;width:100%;aspect-ratio:600/270;margin-top:2px}
.enflow svg{position:absolute;inset:0;width:100%;height:100%}
.enflow .nd{position:absolute;transform:translate(-50%,-50%);width:22%;display:flex;flex-direction:column;align-items:center;text-align:center}
.enflow .nd .ci{width:58px;height:58px;border-radius:50%;border:2px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.18)}
.enflow .nd ha-icon{--mdc-icon-size:28px}
.enflow .nd .v{font-size:15px;font-weight:600;margin-top:5px;white-space:nowrap}
.enflow .nd .l{font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.65;margin-top:1px}
.enflow .fl{fill:none;stroke-width:3;stroke-linecap:round}
.enflow .fl.off{stroke:rgba(255,255,255,.12)!important}
.enflow .fl.on{stroke-dasharray:8 10;animation:enDash 1.1s linear infinite}
.enflow .wl{font-size:13px;font-weight:600;fill:#fff}
@keyframes enDash{to{stroke-dashoffset:-18}}
.entoday{display:flex;align-items:center;gap:22px}
.enring{position:relative;width:128px;height:128px;flex:none}
.enring svg{width:100%;height:100%;transform:rotate(-90deg)}
.enring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.enring .b{font-size:28px;font-weight:300;line-height:1}
.enring .s{font-size:10px;letter-spacing:.14em;opacity:.7;margin-top:6px}
.enleg{flex:1;min-width:0;display:grid;grid-template-columns:1fr auto;gap:5px 12px;font-size:13px}
.enleg .k{display:flex;align-items:center;gap:8px;opacity:.85;min-width:0}
.enleg .k i{width:10px;height:10px;border-radius:50%;flex:none}
.enleg .r{text-align:right;font-weight:600;white-space:nowrap}
.enleg .hr{grid-column:1/-1;height:1px;background:rgba(255,255,255,.12);margin:3px 0}
.entabs{display:flex;gap:4px}
.entab{all:unset;cursor:pointer;font-size:11px;letter-spacing:.06em;padding:4px 11px;border-radius:12px;background:rgba(255,255,255,.1);opacity:1;text-transform:none;font-weight:500}
.entab.on{background:#81d4fa;color:#1d2427;font-weight:600}
.eng{position:relative;background:rgba(0,0,0,.12);padding:8px 10px 4px}
.eng svg{display:block;width:100%;height:120px}
.eng .gl{display:flex;justify-content:space-between;font-size:11px;opacity:.6;margin-top:2px}
.eng .gk{display:flex;gap:14px;font-size:11px;opacity:.8;margin-bottom:4px}
.eng .gk span{display:inline-flex;align-items:center;gap:5px}
.eng .gk i{width:9px;height:9px;border-radius:2px}
.eng .gx{position:absolute;top:8px;right:10px;font-size:11px;opacity:.6}
.eng.empty{font-size:12px;opacity:.5;text-align:center;padding:40px 0}
.enbars{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;height:120px;align-items:end}
.enbars .d{display:flex;gap:2px;align-items:end;justify-content:center;height:100%}
.enbars .d div{width:38%;min-height:1px}
.enbl{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;font-size:11px;text-align:center;margin-top:3px}
.enbl .t{opacity:.6}
.enbl .v{font-weight:600;font-size:11px}
.enbat{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.enbc{background:rgba(255,255,255,.07);padding:10px 12px}
.enbc .h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;letter-spacing:.06em}
.enbc .h b{font-size:20px;font-weight:300;letter-spacing:0}
.enbc .bar{height:8px;background:rgba(255,255,255,.12);margin:7px 0 6px;overflow:hidden}
.enbc .bar div{height:100%}
.enbc .i{font-size:12px;opacity:.75;line-height:1.5;font-style:normal;text-transform:none;letter-spacing:.02em}
.enbc .h span{font-style:normal}
.entip{font-size:12px;opacity:.8;background:rgba(255,255,255,.07);padding:9px 11px;margin-top:8px;line-height:1.45}
.entot{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.entot .c{background:rgba(255,255,255,.07);padding:10px 6px;text-align:center;cursor:pointer}
.entot ha-icon{--mdc-icon-size:22px;opacity:.85}
.entot .v{font-size:17px;font-weight:600;margin-top:4px}
.entot .l{font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.65;margin-top:2px}
.enlink{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;height:40px;margin-top:16px;border:1px solid rgba(255,255,255,.4);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.enlink ha-icon{--mdc-icon-size:18px}
@media (max-width:600px){.enbat{grid-template-columns:1fr}.entoday{flex-direction:column;align-items:stretch}.enring{margin:0 auto}}
`;
const sty=sr=>{if(sr&&!sr.getElementById('swencss')){const x=document.createElement('style');x.id='swencss';x.textContent=CSS;sr.appendChild(x);}};
C.prototype._enCfg=function(){const E=this._cfg.energy;if(!E||this._cfg.energy_popup===false||E.popup===false)return null;return Object.assign({},E,{P:E.popup||{}});};
C.prototype._enN=function(id){if(!id)return NaN;const s=this._st(id);if(!s||['unavailable','unknown',''].includes(s.state))return NaN;return parseFloat(s.state);};
C.prototype._enSum=function(L,k){let s=0,any=false;(L||[]).forEach(b=>{const v=this._enN(b[k]);if(!isNaN(v)){s+=v;any=true;}});return any?s:NaN;};
/* Statistik aus dem Recorder (5 min / Tag), zwischengespeichert */
C.prototype._enStat=function(ids,period,startMs,types,ttl){this._enH=this._enH||{};const k=ids.join(',')+'|'+period+'|'+types.join(',');const c=this._enH[k];if(c&&(Date.now()-c.t<ttl||c.busy))return c.d;
  const cc=this._enH[k]=Object.assign(c||{d:null},{busy:true,t:Date.now()});const h=this._hass;if(!h||!h.callWS){cc.busy=false;return cc.d;}
  h.callWS({type:'recorder/statistics_during_period',start_time:new Date(startMs).toISOString(),statistic_ids:ids,period,types}).then(r=>{const out={};ids.forEach(id=>{out[id]=(r&&r[id]||[]).map(x=>{const o={t:typeof x.start==='number'?x.start:new Date(x.start).getTime()};types.forEach(ty=>o[ty]=x[ty]);return o;});});cc.d=out;cc.busy=false;this._enRefresh();}).catch(()=>{cc.d=cc.d||{};cc.busy=false;this._enRefresh();});return cc.d;};
/* 1 · Energiefluss jetzt */
C.prototype._enFlow=function(E){const P=E.P,B=P.batteries||[];const sol=this._enN(E.solar),house=this._enN(E.house),grid=this._enN(E.grid);
  const chg=this._enSum(B,'charge'),dis=this._enSum(B,'discharge');const invS=this._enN(P.inverter);
  const inv=!isNaN(invS)?invS:(isNaN(sol)?NaN:Math.max(0,sol-(chg||0)+(dis||0)));
  const solHouse=isNaN(inv)?NaN:Math.max(0,inv-(isNaN(dis)?0:dis));
  const soc=!isNaN(this._enN(E.battery))?this._enN(E.battery):(B.length?this._enSum(B,'soc')/B.length:NaN);
  const N={solar:[18,17],bat:[18,80],house:[56,48],grid:[88,48]};const px=p=>[p[0]*6,p[1]*2.7];
  const ln=(a,b,w,col,rev)=>{const A=px(N[a]),Bp=px(N[b]);const on=!isNaN(w)&&w>=3;const pa=rev?Bp:A,pb=rev?A:Bp;
    const dx=pb[0]-pa[0],dy=pb[1]-pa[1],L=Math.hypot(dx,dy),o1=44,o2=46;let x1=pa[0]+dx*o1/L,y1=pa[1]+dy*o1/L,x2=pb[0]-dx*o2/L,y2=pb[1]-dy*o2/L;
    const mx=(x1+x2)/2,my=(y1+y2)/2;const vert=Math.abs(dx)<1;const o1b=vert?62:o1;const x1b=pa[0]+dx*o1b/L,y1b=pa[1]+dy*o1b/L;if(vert){const e=pb[1]-dy*76/L;x2=pb[0];y2=e;}const tx=vert?mx+12:mx,ty=vert?(y1b+y2)/2+5:my-8;return `<line class="fl ${on?'on':'off'}" x1="${x1b.toFixed(1)}" y1="${y1b.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}"/>${on?`<text class="wl" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${vert?'start':'middle'}">${esc(fW(w))}</text>`:''}`;};
  const exp=!isNaN(grid)&&grid<0;
  const svg=`<svg viewBox="0 0 600 230">${ln('solar','house',solHouse,COL.solar)}${ln('solar','bat',chg,COL.bat)}${ln('bat','house',dis,COL.bat)}${ln('grid','house',exp?NaN:grid,COL.grid)}${exp?ln('grid','house',-grid,COL.feed,true):''}</svg>`;
  const bi=isNaN(soc)?'battery-unknown':soc>=95?'battery':soc<5?'battery-outline':'battery-'+Math.round(soc/10)*10;
  const nd=(k,ic,v,l,col,on)=>`<div class="nd" style="left:${N[k][0]}%;top:${N[k][1]}%"><div class="ci" style="${on?`border-color:${col}`:''}"><ha-icon icon="mdi:${ic}"${on?` style="color:${col}"`:''}></ha-icon></div><div class="v">${v}</div><div class="l">${l}</div></div>`;
  const batTxt=isNaN(soc)?'–':Math.round(soc)+' %';const batSub=!isNaN(dis)&&dis>=3?'Akku · entlädt':(!isNaN(chg)&&chg>=3?'Akku · lädt':'Akku');
  return `<div class="enflow">${svg}${nd('solar','solar-power-variant',fW(sol),'Solar',COL.solar,sol>=3)}${nd('bat',bi,batTxt,batSub,COL.bat,(dis>=3)||(chg>=3))}${nd('house','home-lightning-bolt-outline',fW(house),'Haus',COL.house,true)}${nd('grid','transmission-tower',fW(exp?-grid:grid),exp?'Einspeisung':'Netz',exp?COL.feed:COL.grid,!isNaN(grid)&&Math.abs(grid)>=3)}</div>`;};
/* 2 · Heute */
C.prototype._enToday=function(E){const P=E.P;const H=this._enN(E.today_house),G=this._enN(E.today_grid);
  let self=!isNaN(H)&&!isNaN(G)?Math.max(0,H-G):NaN;const sS=this._enN(P.share_solar),sB=this._enN(P.share_battery);
  let fS=!isNaN(sS)&&!isNaN(sB)&&sS+sB>0?sS/(sS+sB):1;const eS=isNaN(self)?NaN:self*fS,eB=isNaN(self)?NaN:self*(1-fS);
  const pct=x=>!isNaN(H)&&H>0&&!isNaN(x)?Math.max(0,Math.min(100,x/H*100)):0;const pS=pct(eS),pB=pct(eB),pG=pct(G);const aut=!isNaN(H)&&H>0?Math.round(pS+pB):NaN;
  const R=54,Cc=2*Math.PI*R;let off=0;const seg=(p,col)=>{if(p<=0.3)return '';const s=`<circle cx="64" cy="64" r="${R}" fill="none" stroke="${col}" stroke-width="10" stroke-dasharray="${(Cc*p/100).toFixed(2)} ${Cc.toFixed(2)}" stroke-dashoffset="${(-Cc*off/100).toFixed(2)}"/>`;off+=p;return s;};
  const ring=`<div class="enring"><svg viewBox="0 0 128 128"><circle cx="64" cy="64" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10"/>${seg(pS,COL.solar)}${seg(pB,COL.bat)}${seg(pG,COL.grid)}</svg><div class="in"><div class="b">${isNaN(aut)?'–':aut+' %'}</div><div class="s">AUTARK</div></div></div>`;
  const kwh=v=>isNaN(v)?'–':de(v,v<10?2:1)+' kWh';const eur=id=>{const v=this._enN(id);return isNaN(v)?'':de(v,2)+' €';};
  const row=(col,l,v,ex)=>`<div class="k">${col?`<i style="background:${col}"></i>`:''}<span>${esc(l)}</span></div><div class="r">${v}${ex?` <span style="opacity:.6;font-weight:400">· ${ex}</span>`:''}</div>`;
  let leg=row(COL.solar,'Solar direkt',kwh(eS),!isNaN(H)&&H>0?Math.round(pS)+' %':'')+row(COL.bat,'Aus dem Akku',kwh(eB),!isNaN(H)&&H>0?Math.round(pB)+' %':'')+row(COL.grid,'Aus dem Netz',kwh(G),eur(E.today_grid_cost))+'<div class="hr"></div>'+row('', 'Verbrauch Haus',kwh(H));
  const ts=this._enN(E.today_solar);if(!isNaN(ts))leg+=row('','Solarertrag',kwh(ts));
  const sv=eur(E.today_save);if(sv)leg+=row('','Ersparnis',`<span style="color:${COL.bat}">${sv}</span>`);
  return `<div class="entoday">${ring}<div class="enleg">${leg}</div></div>`;};
/* 3 · Verlauf */
const lines=(series,o)=>{const all=series.flatMap(s=>s.pts);if(all.length<2)return `<div class="eng empty">${o.loading?'Verlauf lädt …':'Kein Verlauf vorhanden'}</div>`;
  const W=600,H=120,P=4;const t0=o.t0,t1=o.t1;let mx=Math.max(10,...all.map(p=>p[1]));mx=Math.ceil(mx/50)*50;
  const X=t=>P+(W-2*P)*(t-t0)/Math.max(1,t1-t0),Y=v=>H-P-(H-2*P)*Math.max(0,v)/mx;
  const paths=series.map(s=>{if(s.pts.length<2)return '';const d=s.pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ');const a=s.pts[0][0],b=s.pts[s.pts.length-1][0];return `<path d="${d} L${X(b).toFixed(1)} ${H} L${X(a).toFixed(1)} ${H} Z" fill="${s.col}" opacity=".13"/><path d="${d}" fill="none" stroke="${s.col}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;}).join('');
  const grid=[.5].map(f=>`<line x1="0" x2="${W}" y1="${Y(mx*f).toFixed(1)}" y2="${Y(mx*f).toFixed(1)}" stroke="rgba(255,255,255,.12)" stroke-dasharray="4 4"/>`).join('');
  return `<div class="eng"><div class="gk">${series.map(s=>`<span><i style="background:${s.col}"></i>${esc(s.name)}</span>`).join('')}</div><div class="gx">max ${esc(fW(mx))}</div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}${paths}</svg><div class="gl"><span>${hm(t0)}</span><span>${hm((t0+t1)/2)}</span><span>jetzt</span></div></div>`;};
C.prototype._enHist=function(E){const view=this._enView||'24h';let h='';
  if(view==='24h'){const ids=[E.house,E.solar].filter(Boolean);const now=Date.now(),t0=now-24*3600e3;const S=this._enStat(ids,'5minute',t0,['mean'],300000);
    const ser=[{id:E.house,name:'Haus',col:COL.house},{id:E.solar,name:'Solar',col:COL.solar}].filter(s=>s.id).map(s=>{const pts=(S&&S[s.id]||[]).filter(x=>x.mean!=null).map(x=>[x.t+150000,x.mean]);const v=this._enN(s.id);if(pts.length&&!isNaN(v))pts.push([now,v]);return Object.assign(s,{pts});});
    h=lines(ser,{t0,t1:now,loading:!S});}
  else{const ids=[E.today_house,E.today_solar,E.today_grid].filter(Boolean);const d0=new Date();d0.setHours(0,0,0,0);d0.setDate(d0.getDate()-6);const S=this._enStat(ids,'day',d0.getTime(),['change'],600000);
    if(!S)h='<div class="eng empty">Verlauf lädt …</div>';else{const days=[];for(let i=0;i<7;i++){const d=new Date(d0);d.setDate(d0.getDate()+i);days.push(d.getTime());}
      const get=(id,t)=>{const r=(S[id]||[]).find(x=>Math.abs(x.t-t)<3*3600e3);return r&&r.change!=null?Math.max(0,r.change):NaN;};
      const today=days[6];const vals=days.map(t=>({t,h:t===today&&!isNaN(this._enN(E.today_house))?this._enN(E.today_house):get(E.today_house,t),s:t===today&&!isNaN(this._enN(E.today_solar))?this._enN(E.today_solar):get(E.today_solar,t)}));
      const mx=Math.max(0.5,...vals.flatMap(v=>[v.h,v.s].filter(x=>!isNaN(x))));const bh=v=>isNaN(v)?0:Math.max(1,v/mx*100);
      h=`<div class="eng"><div class="gk"><span><i style="background:${COL.house}"></i>Haus kWh</span><span><i style="background:${COL.solar}"></i>Solar kWh</span></div><div class="gx">max ${de(mx,1)} kWh</div><div class="enbars">${vals.map(v=>`<div class="d"><div style="height:${bh(v.h)}%;background:${COL.house}"></div><div style="height:${bh(v.s)}%;background:${COL.solar}"></div></div>`).join('')}</div><div class="enbl">${vals.map(v=>{const d=new Date(v.t);return `<div><div class="t">${v.t===today?'Heute':DAYS[d.getDay()]}</div><div class="v">${isNaN(v.h)?'–':de(v.h,1)}</div><div class="v" style="color:${COL.solar}">${isNaN(v.s)?'–':de(v.s,v.s<1?2:1)}</div></div>`;}).join('')}</div></div>`;}}
  return h;};
/* 4 · Akku */
C.prototype._enBat=function(E){const P=E.P,B=(P.batteries||[]).filter(b=>b.soc&&this._st(b.soc));if(!B.length)return '';
  const cards=B.map((b,i)=>{const soc=this._enN(b.soc);const s=b.state&&this._st(b.state);const stT=s?(BST[s.state]||s.state):'';const tp=this._enN(b.temp);const ch=this._enN(b.charge),dc=this._enN(b.discharge),lim=this._enN(b.output_limit);
    const col=isNaN(soc)?'rgba(255,255,255,.3)':soc<15?'#FF9800':COL.bat;const pw=!isNaN(dc)&&dc>=3?'Entlädt mit '+fW(dc):(!isNaN(ch)&&ch>=3?'Lädt mit '+fW(ch):'');
    const info=[pw||stT,[!isNaN(tp)?de(tp,0)+' °C':'',!isNaN(lim)?'Einspeisung '+Math.round(lim)+' W':''].filter(Boolean).join(' · ')].filter(Boolean).map(esc).join('<br>');
    return `<div class="enbc" data-a="more" data-e="${esc(b.soc)}" style="cursor:pointer"><div class="h"><span>${esc(b.name||('Speicher '+(i+1)))}</span><b>${isNaN(soc)?'–':Math.round(soc)+' %'}</b></div><div class="bar"><div style="width:${isNaN(soc)?0:Math.max(1,Math.min(100,soc))}%;background:${col}"></div></div><div class="i">${info}</div></div>`;}).join('');
  const en=this._enSum(B,'energy'),dis=this._enSum(B,'discharge'),ch=this._enSum(B,'charge'),lim=this._enSum(B,'output_limit');
  let tip='';if(!isNaN(dis)&&dis>=3&&!isNaN(en)){const hrs=en/dis;tip=`Reicht bei ${fW(dis)} noch etwa <b>${hrs>=1?de(hrs,hrs<10?1:0)+' Stunden':Math.round(hrs*60)+' Minuten'}</b> (${de(en/1000,2)} kWh gespeichert).`;}
  else if(!isNaN(ch)&&ch>=3&&!isNaN(en))tip=`Lädt gerade mit ${fW(ch)} · ${de(en/1000,2)} kWh gespeichert.`;
  else if(!isNaN(en))tip=`${de(en/1000,2)} kWh gespeichert${!isNaN(lim)?` · Einspeisevorgabe gesamt ${Math.round(lim)} W`:''}.`;
  return `<div class="enbat">${cards}</div>${tip?`<div class="entip">${tip}</div>`:''}`;};
/* 7 · Gesamtbilanz */
C.prototype._enTot=function(E){const T=(E.P.totals||[]).filter(t=>t.e&&this._st(t.e));if(!T.length)return '';
  return `<div class="entot">${T.map(t=>{const s=this._st(t.e);const v=this._enN(t.e);const u=t.u||s.attributes.unit_of_measurement||'';return `<div class="c" data-a="more" data-e="${esc(t.e)}"><ha-icon icon="mdi:${esc(t.icon||'counter')}"></ha-icon><div class="v">${isNaN(v)?esc(s.state):de(v,v>=100?0:1)+(u?' '+esc(u):'')}</div><div class="l">${esc(t.l||this._nm(t.e))}</div></div>`;}).join('')}</div>`;};
C.prototype._enBody=function(){const E=this._enCfg();if(!E)return '';const v=this._enView||'24h';
  let h=`<div class="ensec">Jetzt</div>${this._enFlow(E)}`;
  h+=`<div class="ensec">Heute</div>${this._enToday(E)}`;
  h+=`<div class="ensec"><span>Verlauf</span><span class="entabs"><button class="entab ${v==='24h'?'on':''}" data-a="enview" data-v="24h">24 h</button><button class="entab ${v==='7d'?'on':''}" data-a="enview" data-v="7d">7 Tage</button></span></div>${this._enHist(E)}`;
  const b=this._enBat(E);if(b)h+=`<div class="ensec">Akku</div>${b}`;
  const t=this._enTot(E);if(t)h+=`<div class="ensec">Gesamtbilanz</div>${t}`;
  if(E.P.link!==false)h+=`<button class="enlink" data-a="ennav" data-u="${esc(E.path||'/energy')}"><ha-icon icon="mdi:chart-box-outline"></ha-icon>Energie-Dashboard öffnen</button>`;
  return h;};
C.prototype._enRefresh=function(){if(this._popKind!=='en')return;const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p||!p.classList.contains('open'))return;const b=p.querySelector('.pbody');const nb=this._enBody();if(b&&b.__en!==nb){const sc=b.scrollTop;b.innerHTML=nb;b.__en=nb;b.scrollTop=sc;}};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(String(kind)==='en'&&this._enCfg()){const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p)return;sty(sr);this._popKind='en';this._enView='24h';this._relC=null;const body=this._enBody();
    p.innerHTML=`<div class="panel enw"><div class="pt">Energie</div><div class="pbody" style="max-height:min(76vh,700px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__en=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
const ocl=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&(n.dataset.a==='enview'||n.dataset.a==='ennav'));
    if(el){if(el.dataset.a==='enview'){this._enView=el.dataset.v;this._enRefresh();}else{const u=el.dataset.u;this._closeCt();history.pushState(null,'',u);window.dispatchEvent(new CustomEvent('location-changed',{detail:{replace:false}}));}return;}}
  return ocl.call(this,ev);};
const occ=C.prototype._closeCt;
C.prototype._closeCt=function(){if(this._popKind==='en')this._relC=null;return occ.apply(this,arguments);};
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);if(this._popKind==='en'){const E=this._enCfg();if(E){const P=E.P;ids.push(E.solar,E.house,E.grid,E.battery,E.today_house,E.today_grid,E.today_grid_cost,E.today_solar,E.today_save,P.inverter,P.share_solar,P.share_battery,...(P.batteries||[]).flatMap(b=>[b.soc,b.state,b.temp,b.charge,b.discharge,b.energy,b.output_limit]),...(P.totals||[]).map(t=>t.e));}}return ids.filter(Boolean);};
const orr=C.prototype._render;
C.prototype._render=function(f){const r=orr.apply(this,arguments);try{this._enRefresh();}catch(e){}return r;};
/* Energie-Sektion auf dem Home-Screen öffnet das Popup */
const oeh=C.prototype._energyHtml;
C.prototype._energyHtml=function(){const h=oeh.apply(this,arguments);if(!h||!this._enCfg())return h;return h.replace(/<div class="energy" data-a="hanav" data-u="[^"]*">/,'<div class="energy" data-a="openpop" data-p="en">');};
});})();

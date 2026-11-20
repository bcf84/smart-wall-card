/* Smart Wall Card – Erweiterung: Sauger-, Geschirrspüler-, Airfryer- & Kaffee-, Kühl-, Statistik-Popup v1.8.0 (benötigt smart-wall-card ≥ 2.70.0) */
(function(){
const CSS=`
.panel.wide{width:min(760px,100%)}
.panel.wide .pbody{max-height:min(74vh,720px)}
.vtop{display:flex;align-items:center;gap:14px;margin:10px 0 4px}
.vtop ha-icon{--mdc-icon-size:36px;flex:none}
.vtop .vs{font-size:13px;font-style:italic;opacity:.85}
.vtop .vb{margin-left:auto;font-size:24px;font-weight:300;white-space:nowrap}
.vmap{display:block;width:100%;max-height:260px;object-fit:contain;background:rgba(0,0,0,.18);margin:10px 0 2px;cursor:pointer}
.vsec{margin-top:16px}
.vsec>.sub{margin:0 0 8px}
.vchips{display:flex;flex-wrap:wrap;gap:6px}
.vchips .tbtn{height:38px}
.vchips .tbtn.sel,.vrow .tbtn.sel{background:rgba(255,255,255,.85);color:#111;border-color:transparent}
.vrow{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
.vgo{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;background:rgba(156,204,101,.35);border:1px solid #9ccc65;font-size:12px;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.vgo.dis{opacity:.35;pointer-events:none}
.vcons{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}
.vcon{background:rgba(255,255,255,.08);padding:10px 12px;display:flex;flex-direction:column;gap:6px}
.vcon .h{font-size:12px}
.vcon .vv{font-size:18px;font-weight:300}
.vcon.warn{box-shadow:inset 3px 0 0 #FF9800}
.vcon.warn .vv{color:#FF9800}
.vcon .pbar{height:3px}
.vcon .tbtn{height:30px;padding:0 8px;font-size:10px;align-self:flex-start}
.vstats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0 18px}
.vset .li{padding:8px 0}
.vcon .ov{font-size:11px;color:#FF9800;font-weight:600;letter-spacing:.05em}
.vdock .chips{margin-bottom:10px}
`;
const L={vacuum:'Saugen',vac_and_mop:'Saugen + Wischen',mop:'Wischen',smart_mode:'Smart',custom:'Individuell',quiet:'Leise',balanced:'Ausgewogen',turbo:'Turbo',max:'Max',max_plus:'Max+',off:'Aus',mild:'Leicht',standard:'Standard',intense:'Intensiv',extreme:'Extrem',fast:'Schnell',light:'Leicht',deep:'Gründlich',deep_plus:'Gründlich+'};
const T={docked:'Angedockt',cleaning:'Reinigt',returning:'Fährt zur Basis',paused:'Pausiert',idle:'Bereit',error:'Fehler',charging:'Lädt',charging_completed:'Geladen',unavailable:'Nicht verfügbar'};
const swP=n=>String(n).padStart(2,'0');
const DWCSS=`
.dwhero{display:flex;align-items:center;gap:22px;margin:14px 0 10px}
.dwring{position:relative;width:132px;height:132px;flex:none}
.dwring svg{width:100%;height:100%;transform:rotate(-90deg)}
.dwring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.dwring .big{font-size:32px;font-weight:300;letter-spacing:.04em;line-height:1;display:block;background:none;padding:0;margin:0;max-width:none;width:auto;cursor:default;box-sizing:content-box;flex:none}
.dwring .sm{font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;margin-top:6px}
.dwinfo .st{font-size:22px;font-weight:300;letter-spacing:.04em}
.dwinfo .su{font-size:13px;opacity:.75;margin-top:4px}
.dwsteps{display:flex;gap:4px;margin-top:14px}
.dwsteps div{flex:1;text-align:center;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding-top:7px;border-top:3px solid rgba(255,255,255,.18);opacity:.45}
.dwsteps div.done{border-color:rgba(255,255,255,.7);opacity:.8}
.dwsteps div.cur{border-color:#9ccc65;opacity:1;font-weight:600}
.dwprogs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.dwp{all:unset;cursor:pointer;box-sizing:border-box;background:rgba(255,255,255,.08);padding:12px 12px 10px;display:flex;flex-direction:column;gap:4px;min-height:96px;transition:background .15s}
.dwp:active{background:rgba(255,255,255,.2)}
.dwp ha-icon{--mdc-icon-size:24px;opacity:.85;margin-bottom:2px}
.dwp .n{font-size:13px;font-weight:600;letter-spacing:.04em}
.dwp .d{font-size:11px;opacity:.65;line-height:1.3}
.dwp.sel{background:rgba(255,255,255,.92);color:#1d2427}
.dwp.sel ha-icon{opacity:1;color:#558b2f}
.dwopts{display:flex;flex-wrap:wrap;gap:6px}
.dwopt{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 15px;border-radius:19px;background:rgba(255,255,255,.1);font-size:12px;letter-spacing:.04em;transition:background .15s}
.dwopt.on{background:#9ccc65;color:#1d2427;font-weight:600}
.dwopt ha-icon{--mdc-icon-size:16px}
.dwtime{font-size:13px;opacity:.85;margin-top:10px}
.dwtime b{font-weight:600}
.dwcta{all:unset;cursor:pointer;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;margin-top:20px;background:#9ccc65;color:#1d2427;font-size:14px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.dwcta ha-icon{--mdc-icon-size:22px}
.dwcta:active{filter:brightness(.9)}
.dwcta.dis{opacity:.35;pointer-events:none}
.dwcta.stop{background:transparent;color:#ff8a80;border:1px solid #ff8a80;margin-top:14px}
.dwbars{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.dwbar .h{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.75;display:flex;justify-content:space-between}
.dwbar .pbar{margin-top:6px}
.dwtoggle{all:unset;cursor:pointer;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;opacity:.7;display:flex;align-items:center;gap:8px;margin-top:20px}
.dwtoggle ha-icon{--mdc-icon-size:18px}
.dwset select.sel{flex:0 1 190px}
.dwcols{display:block}
.dwcol>.vsec:first-child{margin-top:0}
@media (min-width:1000px){.panel.wide.dwx{width:min(1180px,96vw);padding:26px 30px 20px}.panel.wide.dwx .pbody{max-height:min(80vh,860px)}.dwcols{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:36px;align-items:start}.dwx .dwprogs{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))}.dwx .dwhero{margin-top:6px}}
.csec{border-top:1px solid rgba(255,255,255,.12)}
.csec:last-child{border-bottom:1px solid rgba(255,255,255,.12)}
.csh{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;padding:14px 2px;min-height:52px}
.csh .t{font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;flex:none}
.csh .s{margin-left:auto;font-size:13px;opacity:.7;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.csh .s.w{color:#FF9800;opacity:1;font-weight:600}
.csh ha-icon{--mdc-icon-size:20px;opacity:.6;flex:none}
.csb{padding:2px 0 16px}
.panel.wide::after{content:'Popup v1.9.0';display:block;text-align:center;font-size:9px;letter-spacing:.1em;opacity:.3;margin-top:8px}
.cmprogs{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))!important}
.cmprogs .dwp{min-height:78px;justify-content:center}
.dwp.sel ha-icon{color:#8d5524}
.dwcta.cmcta{background:#c69c6d}
.dwdet{margin-top:6px;padding-top:4px;border-top:1px solid rgba(255,255,255,.1)}
@media (max-width:500px){.dwhero{flex-direction:column;text-align:center}.dwprogs{grid-template-columns:1fr 1fr}}
`;
const DWP={favorite_001:{i:'heart-outline',d:'Dein gespeichertes Programm'},auto2:{n:'Auto 45–65°',i:'auto-fix',d:'Passt sich der Verschmutzung an'},eco50:{n:'Eco 50°',i:'leaf',d:'Sparsam, für den Alltag'},intensiv70:{n:'Intensiv 70°',i:'pot-steam-outline',d:'Töpfe & Eingebranntes'},super60:{n:'Super 60°',i:'lightning-bolt-outline',d:'Gründlich in kurzer Zeit'},quick65:{n:'Schnell 65°',i:'clock-fast',d:'Leicht verschmutzt, schnell fertig'},prerinse:{n:'Vorspülen',i:'water-outline',d:'Kurz abbrausen, später spülen'},machinecare:{n:'Maschinenpflege',i:'wrench-outline',d:'Reinigt die Maschine (leer laufen lassen)'}};
const DWS={inactive:'Aus',ready:'Bereit',delayedstart:'Startzeit gesetzt',run:'Läuft',pause:'Pausiert',actionrequired:'Eingriff nötig',finished:'Fertig',error:'Fehler',aborting:'Bricht ab',unavailable:'Nicht erreichbar'};
const DWPH={prerinse:'Vorspülen',mainwash:'Reinigen',finalrinse:'Klarspülen',drying:'Trocknen'};
const DWE={drain_pump_blocked:'Laugenpumpe blockiert',draining_not_possible:'Abpumpen nicht möglich',waterheater_calcified:'Heizung verkalkt',check_filter_system:'Filter prüfen',machine_care_and_filter_cleaning_reminder:'Maschinenpflege & Filter fällig',smart_filter_cleaning_reminder:'Filter reinigen',machine_care_reminder:'Maschinenpflege fällig',low_voltage:'Unterspannung',program_aborted:'Programm abgebrochen'};
const DWV={full:'voll',empty:'leer',nearly_empty:'fast leer',ok:'OK',present:'OK',off:'zu',on:'offen'};
const dwOpt=o=>{const m=String(o).match(/^([rh])0?(\d)$/);if(m)return m[1]==='r'?(m[2]==='0'?'Aus':'Stufe '+m[2]):'Stufe '+m[2];return ({off:'Aus',allprograms:'Alle Programme',ecoasdefault:'Eco',lastprogram:'Letztes Programm',coldwater:'Kaltwasser',hotwater:'Warmwasser',standard:'Standard',sensitive:'Empfindlich',verysensitive:'Sehr empfindlich',monitoring:'Nur anzeigen',manualremotestart:'Fernstart einmalig',permanentremotestart:'Fernstart dauerhaft'})[o]||o;};
const AFCSS=`
.afrow{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.afl{font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;opacity:.7;width:110px;flex:none}
.afstep{display:flex;align-items:center;gap:8px}
.afstep .v{font-size:26px;font-weight:300;min-width:96px;text-align:center;letter-spacing:.04em}
.afstep .btn{width:42px;height:42px;font-size:12px;font-weight:600}
.dwcta.af2{background:rgba(255,255,255,.14);color:#fff}
.dwp.sel ha-icon{color:#e65100}
`;
const AFS={standby:'Standby',mainmenu:'Bereit',parasetting:'Bereit',cooking:'Gart',precook:'Bereit zum Start',preheating:'Heizt vor',preheat:'Heizt vor',pause:'Pausiert',paused:'Pausiert',finish:'Fertig',keepwarm:'Warmhalten',keep_warm:'Warmhalten',unavailable:'Aus'};
const AFN={shake:'Jetzt schütteln/wenden',turn:'Jetzt wenden',drawer_open:'Schublade offen'};
const AFPROBE=[['Rind rosa',56],['Rind medium',60],['Schwein',63],['Fisch',60],['Geflügel',74]];
const CMW={americano:'Americano',blackeye:'Black Eye',cafeaulait:'Café au Lait',cafeconleche:'Café con Leche',cafecortado:'Café Cortado',coldbrew:'Cold Brew',coldbrewmacchiato:'Cold Brew Macchiato',cortado:'Cortado',deadeye:'Dead Eye',doppio:'Doppio',flatwhite:'Flat White',galao:'Galão',garoto:'Garoto',grosserbrauner:'Großer Brauner',kaapi:'Kaapi',kleinerbrauner:'Kleiner Brauner',koffieverkeerd:'Koffie Verkeerd',redeye:'Red Eye',slowbrew:'Slow Brew',verlaengerter:'Verlängerter',verlaengerterbraun:'Verlängerter Braun',wienermelange:'Wiener Melange'};
const CMB={espresso:'Espresso',coffee:'Kaffee',caffegrande:'Caffè Grande',coffeepot:'Kaffeekanne',hotwater:'Heißwasser',caffelatte:'Caffè Latte',cappuccino:'Cappuccino',espressodoppio:'Espresso doppio',espressomacchiato:'Espresso Macchiato',lattemacchiato:'Latte Macchiato',milkfroth:'Milchschaum',ristretto:'Ristretto',warmmilk:'Warme Milch',xlcoffee:'XL-Kaffee'};
const CMI=[[/tee|tea/,'tea-outline'],[/heißwasser|hotwater|wasser/,'kettle-steam-outline'],[/milchschaum|milkfroth|warme milch|warmmilk/,'cup-outline'],[/latte|macchiato|melange|galão|galao|au lait|con leche|verkeerd/,'glass-mug-variant'],[/cappuccino|flat white|cortado|brauner/,'coffee'],[/espresso|ristretto|doppio|eye/,'coffee-outline'],[/xl|grande|pot|kanne|americano|verlängert|brew/,'coffee-to-go-outline']];
const CMO={mild:'Mild',normal:'Normal',strong:'Stark',verystrong:'Sehr stark',fine:'Fein',balanced:'Ausgewogen',distinctive:'Kräftig',high:'Hoch',max:'Max',small:'Klein',medium:'Mittel',large:'Groß',verylarge:'Sehr groß',double:'Doppelt',triple:'Dreifach','70c':'70°','80c':'80°','90c':'90°','97c':'97°',firstmilk:'Erst Milch',firstcoffee:'Erst Kaffee',min:'Minimal','10sec':'10 s','5sec':'5 s',lastselected:'Zuletzt gewählt',favorites:'Favoriten',classics:'Klassiker',coffeeworld:'Kaffeewelt',numberofuses:'Am häufigsten',newestfirst:'Neueste zuerst',oldestfirst:'Älteste zuerst',color:'Farbe','00hours15minutes':'15 min','00hours30minutes':'30 min','01hours00minutes':'1 h','02hours00minutes':'2 h','03hours00minutes':'3 h',on:'An',standby:'Standby'};
const CMV={full:'voll',ok:'OK',empty:'leer',nearly_empty:'fast leer',critically_empty:'leer',not_inserted:'fehlt',on:'leer',off:'OK'};
const CMM={water_tank_empty:'Wassertank leer',water_critically_empty:'Wassertank leer',water_tank_nearly_empty:'Wassertank fast leer',water_tank_not_inserted:'Wassertank fehlt',refill_empty_water_tank:'Wasser nachfüllen',fill_watertank:'Wasser nachfüllen',drip_tray_full:'Tropfschale leeren',empty_drip_tray:'Tropfschale leeren',drip_tray_not_inserted:'Tropfschale fehlt',empty_drip_tray_remove_container:'Tropfschale leeren',pomace_cave_full:'Tresterbehälter leeren',bean_container_empty:'Bohnen nachfüllen',refill_empty_bean_container:'Bohnen nachfüllen',brewing_unit_is_missing:'Brüheinheit fehlt',clean_brewing_unit:'Brüheinheit reinigen',device_should_be_descaled:'Bitte entkalken',device_descaling_overdue:'Entkalken überfällig',device_should_be_cleaned:'Bitte reinigen',device_cleaning_overdue:'Reinigung überfällig',device_should_be_calcn_cleaned:'Calc’n’Clean fällig',device_calcn_clean_overdue:'Calc’n’Clean überfällig',water_filter_should_be_changed:'Wasserfilter wechseln',close_door:'Tür schließen',coffee_outlet_missing:'Auslauf fehlt',clean_milk_tank:'Milchbehälter reinigen',keep_milk_tank_cool:'Milch kühl stellen',place_container_under_outlet:'Gefäß unter den Auslauf stellen',adjust_grind_setting:'Mahlgrad anpassen',program_finished:'Fertig',software_update_available:'Software-Update verfügbar',appliance_switches_off:'Schaltet sich aus'};
const DE={no_dustbin_or_filter:'Staubbehälter/Filter fehlt',auto_empty_dock_fan_error:'Absauggebläse',duct_blockage:'Absaugkanal verstopft',auto_empty_dock_voltage_error:'Spannungsfehler',water_empty:'Frischwasser leer',waste_water_tank_full:'Schmutzwasser voll',maintenance_brush_jammed:'Stationsbürste blockiert',dirty_tank_latch_open:'Schmutzwassertank-Verschluss offen',no_dustbin:'Staubbehälter fehlt',cleaning_tank_full_or_blocked:'Reinigungswanne voll/verstopft'};
const sec=(t,h)=>h?`<div class="vsec"><div class="sub">${t}</div>${h}</div>`:'';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ext={
  _sty(id,t){const sr=this.shadowRoot;if(!sr.getElementById(id)){const x=document.createElement('style');x.id=id;x.textContent=t;sr.appendChild(x);}},
  _vacIds(P){if(P&&(P.type==='fridge'||P.type==='stats'))return [P.run,P.energy,P.ratio,...(P.rows||[]).map(c=>c.e)].filter(Boolean);if(P&&P.type==='coffee')return [P.power,P.status,P.program,P.active_program,P.progress,P.message,...(P.adjust||[]).map(c=>c.e),...(P.care||[]).map(c=>c.e),...(P.stats||[]).map(c=>c.e),...(P.settings||[]).map(c=>c.e)].filter(Boolean);if(P&&P.type==='airfryer')return [P.power,P.status,P.remaining,P.total,P.temp_now,P.temp_target,P.preheat_state,P.probe_now,P.probe_target,P.probe_disconnected,P.drawer,P.notification,P.error_code,P.keepwarm_time,P.keepwarm_temp].filter(Boolean);if(P&&P.type==='dishwasher')return [P.power,P.program,P.status,P.phase,P.progress,P.remaining,P.active_program,P.start_in,P.door,P.remote_allowed,P.error,P.energy,P.water,P.count,...(P.options||[]).map(c=>c.e),...(P.care||[]).map(c=>c.e),...(P.settings||[]).map(c=>c.e)].filter(Boolean);if(!P||P.type!=='vacuum')return [];return [P.entity,P.map,P.mode,P.mop_intensity,P.mop_mode,P.dnd,P.volume,P.room,P.child_lock,P.dock_mode,P.dock_error,P.dry_time,...(P.dock_info||[]).map(c=>c.e),...(P.dock_actions||[]).map(c=>c.e),...(P.consumables||[]).map(c=>c.e),...(P.stats||[]).map(c=>c.e)].filter(Boolean);},
  _vacCfg(){const k=String(this._popKind||'');if(!k.startsWith('vac:'))return null;const a=(this._cfg.appliances||[])[Number(k.slice(4))];return a&&a.popup?Object.assign({name:a.name,battery:a.battery,status:a.status,icon:a.icon,power:a.power,program:a.program,programs:a.programs,start:a.start,progress:a.progress,remaining:a.remaining,temp_now:a.value},a.popup):null;},
  _ctlHtml(list){const sr=this.shadowRoot;if(!sr.getElementById('swctlcss')){const x=document.createElement('style');x.id='swctlcss';x.textContent='.ctlg .tbtn.sel{background:rgba(255,255,255,.9);color:#1d2427;border-color:transparent}.ctlg .tbtn{height:36px}.ctlg .cv.pend{opacity:.6}';sr.appendChild(x);}
    const now=Date.now();const P=this._pend||(this._pend={});const CF=this._ctlCfg||(this._ctlCfg={});let o='';
    list.forEach(c=>{const s=this._st(c.e);if(!s||['unavailable','unknown'].includes(s.state))return;CF[c.e]=c;if(c.hide){const hs=this._st(c.hide.e);if(hs&&(c.hide.states||[]).includes(hs.state))return;}let v=parseFloat(s.state);const p=P[c.e];let pend=false;
      if(p){if(now-p.t<9000&&Math.abs(p.v-v)>1e-6){v=p.v;pend=true;}else delete P[c.e];}
      const pre=c.pre?` data-p="${esc(c.pre)}"`:'';
      if(c.opts){o+=`<span class="ctlg">${c.opts.map(([val,l])=>`<button class="tbtn ${Math.round(v)===val?'sel':''}" data-a="ctlset" data-e="${c.e}" data-v="${val}"${pre}>${esc(l)}</button>`).join('')}</span>`;return;}
      const b=(d,i)=>`<button class="btn" data-a="ctlstep" data-e="${c.e}" data-d="${d}"${pre}><ha-icon icon="mdi:${i}"></ha-icon></button>`;
      o+=`<span class="ctlg">${b(-1,'minus')}<span class="cv${pend?' pend':''}">${esc(c.l||'')}${v>0?Math.round(v):'–'}${esc(c.u||'')}</span>${b(1,'plus')}</span>`;});
    return o;},
  _ctlSend(e,h){const p=this._pend&&this._pend[e];if(!p)return;const c=(this._ctlCfg||{})[e]||{};const go=()=>{const q=this._pend[e];if(!q)return;q.t=Date.now();h.callService('number','set_value',{entity_id:e,value:q.v});};
    if(c.pre){const [pe,po]=String(c.pre).split(':');const ps=this._st(pe);if(ps&&ps.state!==po){if(Date.now()-(this._preT||0)<4000){setTimeout(go,1500);return;}this._preT=Date.now();Promise.resolve(h.callService('select','select_option',{entity_id:pe,option:po})).then(()=>setTimeout(go,1500),()=>setTimeout(go,1500));return;}}go();},
  _ctlSet(e,v,h,delay){this._pend=this._pend||{};this._pend[e]={v,t:Date.now()};this._ctlT=this._ctlT||{};clearTimeout(this._ctlT[e]);this._ctlT[e]=setTimeout(()=>this._ctlSend(e,h),delay);if(this._render)this._render(true);},
  _cs(k,t,sum,body,warn){if(!body)return '';const o=(this._vopen||(this._vopen=new Set())).has(k);return `<div class="csec"><button class="csh" data-a="vsec" data-k="${k}"><span class="t">${t}</span><span class="s${warn?' w':''}">${esc(sum||'')}</span><ha-icon icon="mdi:chevron-${o?'up':'down'}"></ha-icon></button>${o?`<div class="csb">${body}</div>`:''}</div>`;},
  _extClick(d,el,h){
    if(d.a==='ctlstep'||d.a==='ctlset'){const s=this._st(d.e);if(!s)return;const A=s.attributes;const c=(this._ctlCfg||{})[d.e]||{};let v;
      if(d.a==='ctlset')v=Number(d.v);else{const p=this._pend&&this._pend[d.e];let base=(p&&Date.now()-p.t<9000)?p.v:parseFloat(s.state);const k=A.step||1;v=!(base>0)?(c.def||A.min):base+Number(d.d)*k;v=Math.max(A.min,Math.min(A.max,Math.round(v/k)*k));}
      this._ctlSet(d.e,v,h,d.a==='ctlset'?150:900);return;}
    if(d.a==='vsec'){const o=this._vopen||(this._vopen=new Set());if(o.has(d.k))o.delete(d.k);else o.add(d.k);this._vacPop();return;}
    if(d.a==='vacroom'){const id=Number(d.r);this._vacRooms=this._vacRooms||new Set();if(this._vacRooms.has(id))this._vacRooms.delete(id);else this._vacRooms.add(id);this._vacPop();}
    else if(d.a==='vacrep'){this._vacRep=Number(d.n)||1;this._vacPop();}
    else if(d.a==='vacgo'){const P=this._vacCfg();if(!P||!this._vacRooms||!this._vacRooms.size)return;const ids=[...this._vacRooms];const nm=(P.rooms||[]).filter(r=>ids.includes(Number(r.id))).map(r=>r.name).join(', ');if(!confirm(nm+' reinigen?'))return;h.callService('vacuum','send_command',{entity_id:P.entity,command:'app_segment_clean',params:[{segments:ids,repeat:this._vacRep||1}]});this._vacRooms=new Set();this._vacPop();}
    else if(d.a==='dwprog'){const P=this._vacCfg();if(!P)return;const pw=this._st(P.power);const go=()=>h.callService('select','select_option',{entity_id:P.program,option:d.v});if(pw&&pw.state==='off'){h.callService('switch','turn_on',{entity_id:P.power});setTimeout(go,3000);}else go();}
    else if(d.a==='dwdelay'){this._dwDelay=Number(d.n)||0;this._vacPop();}
    else if(d.a==='cmstart'){const P=this._vacCfg();if(P&&!this._cmBusy)this._cmStart(P,h);}
    else if(d.a==='dwstart'){const P=this._vacCfg();if(P&&!this._dwBusy)this._dwStart(P,h);}
    else if(d.a==='dwset'){this._dwSet=!this._dwSet;this._vacPop();}
    else if(d.a==='afpre'){const P=this._vacCfg();const x=P&&(P.presets||[])[Number(d.n)];if(!x)return;this._af={preset:Number(d.n),t:x.temp,m:x.time||(x.probe?30:15),a:x.air||2,pre:!!x.preheat,probe:!!x.probe,pt:x.probe||63};this._vacPop();}
    else if(d.a==='afadj'){const a=this._af;if(!a)return;const L={t:[40,200,5],m:[1,60,1],pt:[40,100,1]}[d.k];const dd=Number(d.d)*(d.k==='t'?L[2]:1);a[d.k]=Math.max(L[0],Math.min(L[1],a[d.k]+dd));a.preset=null;this._vacPop();}
    else if(d.a==='afset'){const a=this._af;if(!a)return;a[d.k]=Number(d.v);if(d.k==='pre'||d.k==='probe')a[d.k]=!!Number(d.v);a.preset=null;this._vacPop();}
    else if(d.a==='afstart'){const P=this._vacCfg();if(P&&!this._afBusy)this._afStart(P,h);}
    else if(d.a==='prenum'){const [pe,po]=String(d.p).split(':');const ps=this._st(pe);let x={};try{x=JSON.parse(d.x||'{}');}catch(_){}const go=()=>h.callService('number','set_value',Object.assign({entity_id:d.e},x));if(ps&&ps.state!==po){Promise.resolve(h.callService('select','select_option',{entity_id:pe,option:po})).then(()=>setTimeout(go,1500),()=>setTimeout(go,1500));}else go();}
    else if(d.a==='vacmap'){const P=this._vacCfg();if(P&&P.map)this._more(P.map);}
  },
  _cmPop(P,p,first){const st=id=>id?this._st(id):null;const sr=this.shadowRoot;
    this._sty('swdwcss',DWCSS);
    this._sty('swafcss',AFCSS);
    const num=id=>{const s=st(id);const v=s?parseFloat(s.state):NaN;return isNaN(v)?null:v;};const ok=s=>s&&!['unavailable','unknown'].includes(s.state);
    const S=st(P.status);const state=S?S.state:'unavailable';const pw=st(P.power);const off=!pw||pw.state!=='on';
    const running=['run','pause','aborting'].includes(state);const pr=st(P.program);const ap=st(P.active_program);
    const cur=running&&ok(ap)?ap.state:(pr?pr.state:'');
    const name=k=>{if(P.programs&&P.programs[k])return P.programs[k];const m=String(k).match(/coffeeworld_(\w+)$/);if(m)return CMW[m[1]]||m[1];const b=String(k).match(/beverage_(\w+)$/);if(b)return CMB[b[1]]||b[1];return String(k).replace(/^.*_/,'');};
    const icon=k=>{const n=String(k).toLowerCase()+' '+name(k).toLowerCase();for(const [re,ic] of CMI)if(re.test(n))return ic;return 'coffee';};
    let h='';
    // ---------- Hero ----------
    const prog=num(P.progress)||0;const R=56,C=2*Math.PI*R;let pct=0,big='',sm='',title='',sub='';
    if(running){pct=Math.max(0,Math.min(100,prog));big=Math.round(pct)+'%';sm='Zubereitung';title=name(cur);sub=state==='pause'?'Pausiert':'Wird zubereitet …';}
    else if(state==='finished'){pct=100;big='✓';sm='fertig';title='Wohl bekommt’s!';sub=name(cur)+' ist fertig';}
    else{big='☕';sm=off?'Standby':'Bereit';title=off?'Standby':name(cur)||'Bereit';sub=off?'Getränk wählen – Maschine schaltet sich ein':'Bereit zur Zubereitung';}
    const ringCol=running||state==='finished'?'#c69c6d':'rgba(255,255,255,.35)';
    h+=`<div class="dwhero"><div class="dwring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="${ringCol}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="big">${esc(big)}</div><div class="sm">${esc(sm)}</div></div></div><div class="dwinfo" style="flex:1;min-width:0"><div class="st">${esc(title)}</div><div class="su">${esc(sub)}</div></div></div>`;
    // Hinweise
    const hints=[];(P.care||[]).forEach(c=>{const s=st(c.e);if(!ok(s))return;const w=(c.warn||[]).includes(s.state)||(c.warn_below!=null&&parseFloat(s.state)<c.warn_below);if(w)hints.push(c.l+': '+((c.map&&c.map[s.state])||CMV[s.state]||(c.u?s.state+' '+c.u:s.state)));});
    const gm=st(P.message);if(ok(gm)&&gm.state!=='none')hints.unshift(CMM[gm.state]||String(gm.state).replace(/_/g,' '));
    if(hints.length)h+=`<div class="chips" style="margin:6px 0 4px">${hints.map(x=>`<span class="ci warn">${esc(x)}</span>`).join('')}</div>`;
    let hl='';
    if(running){h+=`<div style="display:flex;gap:8px;margin-top:18px">${P.pause&&state!=='pause'?`<button class="dwcta af2" style="flex:1;margin-top:0" data-a="press" data-e="${P.pause}"><ha-icon icon="mdi:pause"></ha-icon>Pause</button>`:''}${P.resume&&state==='pause'?`<button class="dwcta" style="flex:1;margin-top:0" data-a="press" data-e="${P.resume}"><ha-icon icon="mdi:play"></ha-icon>Weiter</button>`:''}<button class="dwcta stop" style="flex:1;margin-top:0" data-a="press" data-e="${P.cancel}" data-c="Zubereitung abbrechen?"><ha-icon icon="mdi:stop"></ha-icon>Abbrechen</button></div>`;hl=h;h='';}
    else{const opts=pr?(pr.attributes.options||[]):[];
      const tile=k=>`<button class="dwp ${k===cur?'sel':''}" data-a="dwprog" data-v="${esc(k)}"><ha-icon icon="mdi:${icon(k)}"></ha-icon><div class="n">${esc(name(k))}</div></button>`;
      const main=P.programs?Object.keys(P.programs).filter(k=>opts.includes(k)):[];
      h+=sec('Getränk',`<div class="dwprogs cmprogs">${main.map(tile).join('')}</div>`);
      const world=opts.filter(k=>/coffeeworld_/.test(k));
      if(world.length)h+=this._cs('world','Kaffeewelt',world.includes(cur)?name(cur):world.length+' Spezialitäten',`<div class="dwprogs cmprogs">${world.map(tile).join('')}</div>`);
      hl=h;h='';
      // ---------- Anpassen ----------
      const chipSel=(e,lab,map)=>{const s=st(e);if(!ok(s))return '';return `<div class="afrow"><div class="afl">${lab}</div><div class="dwopts">${(s.attributes.options||[]).map(o=>`<button class="dwopt ${o===s.state?'on':''}" data-a="svc" data-d="select" data-s="select_option" data-e="${e}" data-x="${esc(JSON.stringify({option:o}))}">${esc((map&&map[o])||CMO[o]||o)}</button>`).join('')}</div></div>`;};
      let an='';(P.adjust||[]).forEach(a=>{if(a.e.startsWith('select.'))an+=chipSel(a.e,a.l,a.map);
        else if(a.e.startsWith('number.')){const s=st(a.e);if(!ok(s))return;const at=s.attributes;const v=parseFloat(s.state);const vals=[];for(let x=at.min;x<=at.max+1e-9&&vals.length<12;x+=at.step||1)vals.push(Math.round(x));an+=`<div class="afrow"><div class="afl">${a.l}</div><div class="dwopts">${vals.map(x=>`<button class="dwopt ${x===Math.round(v)?'on':''}" data-a="svc" data-d="number" data-s="set_value" data-e="${a.e}" data-x="${esc(JSON.stringify({value:x}))}">${x}${a.u?' '+a.u:''}</button>`).join('')}</div></div>`;}
        else if(a.e.startsWith('switch.')){const s=st(a.e);if(!ok(s))return;an+=`<div class="afrow"><div class="afl">${a.l}</div><div class="dwopts"><button class="dwopt ${s.state==='on'?'on':''}" data-a="toggle" data-e="${a.e}"><ha-icon icon="mdi:${s.state==='on'?'check':a.icon||'plus'}"></ha-icon>${s.state==='on'?'An':'Aus'}</button></div></div>`;}});
      h+=sec('Anpassen',an||'<div class="muted" style="font-style:normal">Für dieses Getränk gibt es keine Einstellungen.</div>');
      const busy=this._cmBusy;const dis=busy||!cur||hints.some(x=>/leer|voll|fehlt|nicht eingesetzt/i.test(x));
      h+=`<button class="dwcta cmcta ${dis?'dis':''}" data-a="cmstart"><ha-icon icon="mdi:${busy?'progress-clock':'coffee'}"></ha-icon>${busy?esc(busy):esc(name(cur)||'Getränk')+' zubereiten'}</button>`;}
    // ---------- Klappbereiche ----------
    const care=(P.care||[]).map(c=>{const s=st(c.e);if(!ok(s))return '';const raw=s.state;const w=(c.warn||[]).includes(raw)||(c.warn_below!=null&&parseFloat(raw)<c.warn_below);const v=(c.map&&c.map[raw])||CMV[raw]||(c.u?raw+' '+c.u:raw);return `<span class="ci ${w?'warn':''}">${esc(c.l)}: <b>${esc(v)}</b></span>`;}).join('');
    const cwN=(care.match(/ci warn/g)||[]).length;
    const nx=(P.care||[]).filter(c=>c.u&&ok(st(c.e))).map(c=>({l:c.l,u:c.u,v:parseFloat(st(c.e).state)})).filter(x=>!isNaN(x.v)).sort((a,b)=>a.v-b.v)[0];
    h+=this._cs('care','Pflege',cwN?cwN+(cwN===1?' Hinweis':' Hinweise'):(nx?`als Nächstes: ${nx.l} ${nx.v}${nx.u?' '+nx.u:''}`:'Alles OK'),care?`<div class="chips">${care}</div>`:'',cwN>0);
    const stt=(P.stats||[]).map(c=>{const s=st(c.e);if(!ok(s))return '';return `<div class="prow"><span>${esc(c.l)}</span><span>${esc(name(s.state)!==s.state||/consumerproducts/.test(s.state)?name(s.state):s.state)}</span></div>`;}).join('');
    const tot=(P.stats||[])[0];const ts=tot&&st(tot.e);
    h+=this._cs('stats','Statistik',ok(ts)?ts.state+' '+(tot.unit||''):'',stt?`<div class="vstats">${stt}</div>`:'');
    let es='';(P.settings||[]).forEach(c=>{const s=st(c.e);if(!ok(s))return;
      if(c.e.startsWith('switch.')){es+=`<div class="li"><ha-icon icon="mdi:${c.icon||'toggle-switch-outline'}"></ha-icon><div class="grow"><div class="h">${esc(c.l)}</div></div><button class="tbtn ${s.state==='on'?'sel':''}" data-a="toggle" data-e="${c.e}">${s.state==='on'?'An':'Aus'}</button></div>`;return;}
      if(c.e.startsWith('number.')){const v=Math.round(parseFloat(s.state));const at=s.attributes;const mk=d=>esc(JSON.stringify({value:Math.max(at.min,Math.min(at.max,v+d*(at.step||1)))}));es+=`<div class="li"><ha-icon icon="mdi:${c.icon||'tune'}"></ha-icon><div class="grow"><div class="h">${esc(c.l)}</div><div class="i">${v} / ${at.max}</div></div><button class="btn" data-a="svc" data-d="number" data-s="set_value" data-e="${c.e}" data-x="${mk(-1)}"><ha-icon icon="mdi:minus"></ha-icon></button><button class="btn" data-a="svc" data-d="number" data-s="set_value" data-e="${c.e}" data-x="${mk(1)}"><ha-icon icon="mdi:plus"></ha-icon></button></div>`;return;}
      es+=`<div class="li"><ha-icon icon="mdi:${c.icon||'tune'}"></ha-icon><div class="grow"><div class="h">${esc(c.l)}</div></div><select class="sel" data-sel="${c.e}">${(s.attributes.options||[]).map(o=>`<option value="${esc(o)}"${o===s.state?' selected':''}>${esc(CMO[o]||o)}</option>`).join('')}</select></div>`;});
    const tw=(P.settings||[]).find(c=>/tassenwarmer/.test(c.e));const tws=tw&&st(tw.e);
    h+=this._cs('set','Einstellungen',ok(tws)?'Tassenwärmer '+(tws.state==='on'?'an':'aus'):'',es?`<div class="vset dwset">${es}</div>`:'');
    if(!running)h+=`<button class="dwtoggle" data-a="toggle" data-e="${P.power}"><ha-icon icon="mdi:power"></ha-icon>${off?'Einschalten':'In Standby schalten'}</button>`;
    h=`<div class="dwcols"><div class="dwcol">${hl}</div><div class="dwcol" style="margin-top:16px">${h}</div></div>`;
    const old=p.querySelector('.pbody');const sc=old?old.scrollTop:0;
    p.innerHTML=`<div class="panel wide dwx"><div class="pt">${esc(P.name||'Kaffeemaschine')}</div><div class="pbody">${h}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;
    const nb=p.querySelector('.pbody');if(nb&&!first)nb.scrollTop=sc;p.classList.add('open');},
  async _cmStart(P,h){const st=id=>id?this._st(id):null;const wait=ms=>new Promise(r=>setTimeout(r,ms));const pr=st(P.program);if(!pr)return;
    const nm=(P.programs&&P.programs[pr.state])||pr.state;if(!confirm(P.start_confirm||`${nm} zubereiten? Steht eine Tasse unter dem Auslauf?`))return;
    const step=t=>{this._cmBusy=t;this._vacPop();};
    try{const pw=st(P.power);if(!pw||pw.state!=='on'){step('Schalte ein …');await h.callService('switch','turn_on',{entity_id:P.power});await wait(6000);await h.callService('select','select_option',{entity_id:P.program,option:pr.state});await wait(1500);}
      step('Starte …');await h.callService('button','press',{entity_id:P.start});await wait(2500);}
    catch(e){alert('Start fehlgeschlagen: '+(e&&e.message||e));}
    this._cmBusy=null;this._vacPop();},
  _afPop(P,p,first){const st=id=>id?this._st(id):null;const sr=this.shadowRoot;
    this._sty('swdwcss',DWCSS);
    this._sty('swafcss',AFCSS);
    const num=id=>{const s=st(id);const v=s?parseFloat(s.state):NaN;return isNaN(v)?null:v;};const clock=d=>`${swP(d.getHours())}:${swP(d.getMinutes())}`;
    const S=st(P.status);const state=S?S.state:'unavailable';const pw=st(P.power);const off=!pw||pw.state!=='on';
    const running=['cooking','preheating','preheat','pause','paused','keepwarm','keep_warm'].includes(state);const paused=['pause','paused'].includes(state);const kw=['keepwarm','keep_warm'].includes(state);
    const rem=num(P.remaining);const tot=num(P.total);const cur=num(P.temp_now);const tgt=num(P.temp_target);
    const pre=st(P.preheat_state);const preheating=pre&&String(pre.state).toLowerCase()==='true';
    const pcur=num(P.probe_now);const ptgt=num(P.probe_target);const probeOk=pcur!=null&&pcur<250;const pdis=st(P.probe_disconnected);
    const A=this._af;let h='';
    // ---------- Hero ----------
    const R=56,C=2*Math.PI*R;let pct=0,big='',sm='',title=AFS[state]||state,sub='',until='';
    if(running){const useProbe=probeOk&&ptgt>0;
      if(useProbe){pct=Math.max(0,Math.min(100,(pcur-20)/Math.max(1,ptgt-20)*100));big=Math.round(pcur)+'°';sm=`Kern · Ziel ${Math.round(ptgt)}°`;}
      else if(rem!=null&&rem>0){pct=tot?Math.max(0,Math.min(100,100-rem/(tot*60)*100)):0;until=new Date(Date.now()+rem*1000).toISOString();big=Math.floor(rem/60)+':'+swP(Math.round(rem%60));sm='Min. übrig';}
      else{big=cur!=null?Math.round(cur)+'°':'–';sm='Temperatur';}
      if(preheating){title='Heizt vor';}
      sub=[cur!=null?`${Math.round(cur)}° ${tgt?'→ '+Math.round(tgt)+'°':''}`:'',(rem>0&&!useProbe)?'fertig um '+clock(new Date(Date.now()+rem*1000)):''].filter(Boolean).join(' · ');}
    else if(state==='finish'){pct=100;big='✓';sm='fertig';title='Guten Appetit!';sub='Schublade herausnehmen oder warmhalten';}
    else{const a=A||{};big=(a.probe?a.pt+'°':a.m+'′');sm=a.probe?'Kerntemp.':'Garzeit';title=off?'Aus':'Bereit';sub=off?'Gericht wählen – Airfryer schaltet sich beim Start ein':`${a.t}° · ${a.m} min · Luft ${a.a===1?'sanft':'stark'}${a.pre?' · mit Vorheizen':''}`;}
    const ringCol=state==='finish'||running?(paused?'#ffb74d':'#ffa94d'):'rgba(255,255,255,.35)';
    const steps=running?`<div class="dwsteps">${[['Vorheizen',preheating],['Garen',!preheating&&!kw],['Warmhalten',kw]].map(([l,on],i)=>`<div class="${on?'cur':''}">${l}</div>`).join('')}</div>`:'';
    h+=`<div class="dwhero"><div class="dwring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="${ringCol}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="big"${until?` data-until="${until}"`:''}>${esc(big)}</div><div class="sm">${esc(sm)}</div></div></div><div class="dwinfo" style="flex:1;min-width:0"><div class="st">${esc(title)}</div><div class="su">${esc(sub)}</div>${steps}</div></div>`;
    // Hinweise
    const hints=[];const dr=st(P.drawer);if(dr&&dr.state==='on')hints.push('Schublade ist offen');const no=st(P.notification);if(no&&!['none','unknown','unavailable',''].includes(no.state))hints.push(AFN[no.state]||no.state);const ec=st(P.error_code);if(ec&&!['0','unknown','unavailable'].includes(ec.state))hints.push('Fehlercode '+ec.state);if(A&&A.probe&&!running&&(!probeOk||(pdis&&pdis.state==='on')))hints.push('Sonde nicht eingesteckt');
    if(hints.length)h+=`<div class="chips" style="margin:6px 0 4px">${hints.map(x=>`<span class="ci warn">${esc(x)}</span>`).join('')}</div>`;
    let hl='';
    if(running){const b=(e,ic,l,c,cls)=>e?`<button class="dwcta ${cls||''}" style="flex:1;margin-top:0" data-a="press" data-e="${e}"${c?` data-c="${esc(c)}"`:''}><ha-icon icon="mdi:${ic}"></ha-icon>${l}</button>`:'';
      h+=`<div style="display:flex;gap:8px;margin-top:18px">${paused?b(P.start,'play','Weiter'):b(P.pause,'pause','Pause','','af2')}${b(P.stop,'stop','Stopp','Garvorgang wirklich beenden?','stop')}</div>`;
      if(probeOk&&!kw)h+=`<div class="dwtime">Kerntemperatur aktuell <b>${Math.round(pcur)}°</b>${ptgt?` von <b>${Math.round(ptgt)}°</b>`:''}</div>`;hl=h;h='';}
    else if(state==='finish'){h+=`<div style="display:flex;gap:8px;margin-top:18px">${P.keepwarm?`<button class="dwcta" style="flex:1;margin-top:0" data-a="press" data-e="${P.keepwarm}"><ha-icon icon="mdi:heat-wave"></ha-icon>Warmhalten</button>`:''}<button class="dwcta af2" style="flex:1;margin-top:0" data-a="toggle" data-e="${P.power}"><ha-icon icon="mdi:power"></ha-icon>Ausschalten</button></div>`;hl=h;h='';}
    else{const a=A;
      // Schnellwahl
      h+=sec('Schnellwahl',`<div class="dwprogs">${(P.presets||[]).map((x,i)=>`<button class="dwp ${a.preset===i?'sel':''}" data-a="afpre" data-n="${i}"><ha-icon icon="mdi:${x.icon||'food'}"></ha-icon><div class="n">${esc(x.name)}</div><div class="d">${x.probe?'Sonde '+x.probe+'° · '+x.temp+'°':x.temp+'° · '+x.time+' min'}${x.note?' · '+esc(x.note):''}</div></button>`).join('')}</div>`);
      hl=h;h='';
      // Manuell
      const stp=(lab,val,k,small)=>`<div class="afrow"><div class="afl">${lab}</div><div class="afstep">${small?`<button class="btn" data-a="afadj" data-k="${k}" data-d="-5">−5</button>`:''}<button class="btn" data-a="afadj" data-k="${k}" data-d="-1"><ha-icon icon="mdi:minus"></ha-icon></button><div class="v">${val}</div><button class="btn" data-a="afadj" data-k="${k}" data-d="1"><ha-icon icon="mdi:plus"></ha-icon></button>${small?`<button class="btn" data-a="afadj" data-k="${k}" data-d="5">+5</button>`:''}</div></div>`;
      let man=stp('Temperatur',a.t+'°','t',false)+stp(a.probe?'Max. Zeit':'Garzeit',a.m+' min','m',true);
      man+=`<div class="afrow"><div class="afl">Luftstrom</div><div class="dwopts">${[[1,'Sanft'],[2,'Stark']].map(([v,l])=>`<button class="dwopt ${a.a===v?'on':''}" data-a="afset" data-k="a" data-v="${v}">${l}</button>`).join('')}</div></div>`;
      man+=`<div class="afrow"><div class="afl">Extras</div><div class="dwopts"><button class="dwopt ${a.pre?'on':''}" data-a="afset" data-k="pre" data-v="${a.pre?0:1}"><ha-icon icon="mdi:${a.pre?'check':'fire'}"></ha-icon>Vorheizen</button>${P.probe_target?`<button class="dwopt ${a.probe?'on':''}" data-a="afset" data-k="probe" data-v="${a.probe?0:1}"><ha-icon icon="mdi:${a.probe?'check':'thermometer-probe'}"></ha-icon>Mit Sonde</button>`:''}</div></div>`;
      if(a.probe){man+=stp('Kerntemp.',a.pt+'°','pt',false);man+=`<div class="dwopts" style="margin-top:8px">${AFPROBE.map(([l,v])=>`<button class="dwopt ${a.pt===v?'on':''}" data-a="afset" data-k="pt" data-v="${v}">${l} ${v}°</button>`).join('')}</div>`;}
      h+=sec('Einstellungen',man);
      const end=clock(new Date(Date.now()+(a.m+(a.pre?3:0))*60000));
      const busy=this._afBusy;const dis=busy||(dr&&dr.state==='on')||(a.probe&&!probeOk&&!off);
      h+=`<button class="dwcta ${dis?'dis':''}" data-a="afstart"><ha-icon icon="mdi:${busy?'progress-clock':'play'}"></ha-icon>${busy?esc(busy):'Starten'+(a.probe?'':' · fertig ca. '+end)}</button>`;}
    // Warmhalten
    const kd=num(P.keepwarm_time),kt=num(P.keepwarm_temp);
    if(kd!=null||kt!=null){const mk=(e,v,d,mn,mx)=>esc(JSON.stringify({value:Math.max(mn,Math.min(mx,v+d))}));const kb=(e,v,d,mn,mx,ic)=>`<button class="btn" data-a="svc" data-d="number" data-s="set_value" data-e="${e}" data-x="${mk(e,v,d,mn,mx)}"><ha-icon icon="mdi:${ic}"></ha-icon></button>`;
      h+=this._cs('kw','Warmhalten nach dem Garen',[kt!=null?Math.round(kt)+'°':'',kd!=null?Math.round(kd)+' min':''].filter(Boolean).join(' · '),`${kt!=null?`<div class="afrow"><div class="afl">Temperatur</div><div class="afstep">${kb(P.keepwarm_temp,kt,-5,40,100,'minus')}<div class="v">${Math.round(kt)}°</div>${kb(P.keepwarm_temp,kt,5,40,100,'plus')}</div></div>`:''}${kd!=null?`<div class="afrow"><div class="afl">Dauer</div><div class="afstep">${kb(P.keepwarm_time,kd,-10,1,180,'minus')}<div class="v">${Math.round(kd)} min</div>${kb(P.keepwarm_time,kd,10,1,180,'plus')}</div></div>`:''}`);}
    if(!off&&!running)h+=`<button class="dwtoggle" data-a="toggle" data-e="${P.power}"><ha-icon icon="mdi:power"></ha-icon>Airfryer ausschalten</button>`;
    h=`<div class="dwcols"><div class="dwcol">${hl}</div><div class="dwcol" style="margin-top:16px">${h}</div></div>`;
    const old=p.querySelector('.pbody');const sc=old?old.scrollTop:0;
    p.innerHTML=`<div class="panel wide dwx"><div class="pt">${esc(P.name||'Airfryer')}</div><div class="pbody">${h}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;
    const nb=p.querySelector('.pbody');if(nb&&!first)nb.scrollTop=sc;p.classList.add('open');if(this._tick)this._tick();},
  async _afStart(P,h){const a=this._af;const st=id=>id?this._st(id):null;const wait=ms=>new Promise(r=>setTimeout(r,ms));
    const nm=a.preset!=null&&P.presets&&P.presets[a.preset]?P.presets[a.preset].name:'Manuell';
    if(!confirm(`${nm}: ${a.t}° ${a.probe?'bis Kern '+a.pt+'°':'für '+a.m+' min'}${a.pre?' mit Vorheizen':''} starten? Ist der Korb befüllt und eingesetzt?`))return;
    const step=t=>{this._afBusy=t;this._vacPop();};const num=(e,v)=>e?h.callService('number','set_value',{entity_id:e,value:v}):null;
    try{const pw=st(P.power);if(!pw||pw.state!=='on'){step('Schalte ein …');await h.callService('switch','turn_on',{entity_id:P.power});await wait(5000);}
      step('Stelle ein …');if(P.method){await h.callService('select','select_option',{entity_id:P.method,option:'manual'});await wait(2000);}
      await num(P.set_temp,a.t);await wait(600);await num(P.set_time,a.m);await wait(600);await num(P.set_air,a.a);await wait(600);
      if(P.probe_target&&a.probe){await num(P.probe_target,a.pt);await wait(600);}
      if(P.preheat){await h.callService('switch',a.pre?'turn_on':'turn_off',{entity_id:P.preheat});await wait(800);}
      step('Starte …');await h.callService('button','press',{entity_id:P.start});await wait(3000);}
    catch(e){alert('Start fehlgeschlagen: '+(e&&e.message||e));}
    this._afBusy=null;this._vacPop();},
  _dwPop(P,p,first){const st=id=>id?this._st(id):null;const sr=this.shadowRoot;
    this._sty('swdwcss',DWCSS);
    const num=id=>{const s=st(id);const v=s?parseFloat(s.state):NaN;return isNaN(v)?null:v;};
    const hm=m=>{m=Math.max(0,Math.round(m));return m>=60?`${Math.floor(m/60)} h ${swP(m%60)} min`:`${m} min`;};
    const clock=d=>`${swP(d.getHours())}:${swP(d.getMinutes())}`;
    const S=st(P.status);const state=S?S.state:'unavailable';const pw=st(P.power);const off=pw&&pw.state==='off';
    const running=['run','pause','actionrequired','aborting'].includes(state);const delayed=state==='delayedstart';
    const remS=st(P.remaining);let remMin=null;if(remS){const v=parseFloat(remS.state);const u=remS.attributes.unit_of_measurement;if(!isNaN(v))remMin=u==='h'?v*60:u==='s'?v/60:v;}
    const prog=num(P.progress);const pr=st(P.program);const ap=st(P.active_program);
    const curProg=(running||delayed)&&ap&&!['unknown','unavailable'].includes(ap.state)?ap.state:(pr?pr.state:'');
    const pinfo=k=>{const key=Object.keys(DWP).find(x=>String(k).endsWith(x));const b=key?DWP[key]:{i:'dishwasher',d:''};return {n:(P.programs&&P.programs[k])||b.n||k,i:b.i,d:b.d};};
    const door=st(P.door);const doorOpen=door&&door.state==='on';
    let h='';
    // ---------- Hero ----------
    const pct=running?Math.max(0,Math.min(100,prog||0)):(state==='finished'?100:0);const R=56,C=2*Math.PI*R;
    let big='',sm='',title=DWS[state]||state,sub='';
    if(running){big=remMin!=null?(remMin>=60?`${Math.floor(remMin/60)}:${swP(Math.round(remMin%60))}`:`${Math.round(remMin)}′`):Math.round(pct)+'%';sm=remMin!=null?(remMin>=60?'Std. übrig':'Min. übrig'):'Fortschritt';title=pinfo(curProg).n;sub=`${DWS[state]||state}${remMin!=null?' · fertig um '+clock(new Date(Date.now()+remMin*60000)):''}`;}
    else if(delayed){const si=st(P.start_in);let sMin=null;if(si){const v=parseFloat(si.state);const u=si.attributes.unit_of_measurement;if(!isNaN(v))sMin=u==='h'?v*60:u==='s'?v/60:v;}big=sMin!=null?(sMin>=60?`${Math.floor(sMin/60)}:${swP(Math.round(sMin%60))}`:`${Math.round(sMin)}′`):'–';sm='bis Start';title=pinfo(curProg).n;sub=sMin!=null?`Startet um ${clock(new Date(Date.now()+sMin*60000))}`+(remMin!=null?` · fertig ca. ${clock(new Date(Date.now()+(sMin+remMin)*60000))}`:''):'Startzeit gesetzt';}
    else if(state==='finished'){big='✓';sm='fertig';title='Sauber!';sub='Tür öffnen und ausräumen';}
    else{big=remMin!=null?(remMin>=60?`${Math.floor(remMin/60)}:${swP(Math.round(remMin%60))}`:`${Math.round(remMin)}′`):'–';sm='Dauer';title=off?'Aus':'Bereit';sub=off?'Programm wählen – Maschine schaltet sich ein':pinfo(curProg).n+' ausgewählt';}
    const ringCol=state==='error'||state==='actionrequired'?'#ff8a80':(running||delayed||state==='finished')?'#9ccc65':'rgba(255,255,255,.35)';
    const ph=st(P.phase);const PH=['prerinse','mainwash','finalrinse','drying'];const pi=ph?PH.indexOf(ph.state):-1;
    const steps=running?`<div class="dwsteps">${PH.map((x,i)=>`<div class="${i<pi?'done':i===pi?'cur':''}">${DWPH[x]}</div>`).join('')}</div>`:'';
    h+=`<div class="dwhero"><div class="dwring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="${ringCol}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="big">${esc(big)}</div><div class="sm">${esc(sm)}</div></div></div><div class="dwinfo" style="flex:1;min-width:0"><div class="st">${esc(title)}</div><div class="su">${esc(sub)}</div>${steps}</div></div>`;
    // Hinweise
    const er=st(P.error);const hints=[];if(er&&!['none','unknown','unavailable'].includes(er.state))hints.push(DWE[er.state]||er.state);if(doorOpen&&!running)hints.push('Tür ist offen');const ra=st(P.remote_allowed);if(!running&&!off&&ra&&ra.state==='off')hints.push('Fernstart an der Maschine erlauben (Taste Remote Start)');
    if(hints.length)h+=`<div class="chips" style="margin:6px 0 4px">${hints.map(x=>`<span class="ci warn">${esc(x)}</span>`).join('')}</div>`;
    let hl=h;h='';
    if(running||delayed){
      h+=`<button class="dwcta stop" data-a="press" data-e="${P.cancel}" data-c="${esc(running?'Laufendes Programm wirklich abbrechen? Die Maschine pumpt das Wasser ab.':'Startzeit aufheben?')}"><ha-icon icon="mdi:stop"></ha-icon>${running?'Programm abbrechen':'Start abbrechen'}</button>`;}
    else{
      // ---------- Programme ----------
      const opts=pr?(pr.attributes.options||[]):[];const order=P.programs?Object.keys(P.programs).filter(k=>opts.includes(k)):opts;
      h+=sec('Programm',`<div class="dwprogs">${order.map(k=>{const q=pinfo(k);return `<button class="dwp ${k===curProg?'sel':''}" data-a="dwprog" data-v="${esc(k)}"><ha-icon icon="mdi:${q.i}"></ha-icon><div class="n">${esc(q.n)}</div>${q.d?`<div class="d">${esc(q.d)}</div>`:''}</button>`;}).join('')}</div>`);
      hl+=h;h='';
      // ---------- Optionen ----------
      const op=(P.options||[]).map(o=>{const s=st(o.e);if(!s||s.state==='unavailable')return '';const on=s.state==='on';return `<button class="dwopt ${on?'on':''}" data-a="toggle" data-e="${o.e}"><ha-icon icon="mdi:${on?'check':o.icon||'plus'}"></ha-icon>${esc(o.l)}</button>`;}).join('');
      if(op)h+=sec('Optionen',`<div class="dwopts">${op}</div>`);
      // ---------- Startzeit ----------
      const dl=this._dwDelay||0;const now=Date.now();
      h+=sec('Startzeit',`<div class="dwopts">${[0,1,2,3,4,6,8].map(x=>`<button class="dwopt ${dl===x?'on':''}" data-a="dwdelay" data-n="${x}">${x?'+'+x+' h':'Sofort'}</button>`).join('')}</div><div class="dwtime">${dl?`Start um <b>${clock(new Date(now+dl*3600000))}</b> · `:''}${remMin!=null?`fertig ca. <b>${clock(new Date(now+dl*3600000+remMin*60000))}</b>`:''}</div>`);
      const busy=this._dwBusy;const dis=busy||doorOpen||!curProg;
      h+=`<button class="dwcta ${dis?'dis':''}" data-a="dwstart"><ha-icon icon="mdi:${busy?'progress-clock':'play'}"></ha-icon>${busy?esc(busy):(dl?'Startzeit setzen':'Jetzt starten')}</button>`;}
    // ---------- Pflege ----------
    const care=(P.care||[]).map(c=>{const s=st(c.e);if(!s||s.state==='unavailable')return '';const raw=s.state;let v=(c.map&&c.map[raw])||DWV[raw]||raw;if(c.u)v=raw+' '+c.u;const w=(c.warn||[]).includes(raw)||(c.warn_below!=null&&parseFloat(raw)<c.warn_below);return `<span class="ci ${w?'warn':''}">${esc(c.l)}: <b>${esc(v)}</b></span>`;}).join('');
    const bar=(id,l)=>{const v=num(id);return v==null?'':`<div class="dwbar"><div class="h"><span>${l}</span><span>${Math.round(v)} %</span></div><div class="pbar"><div style="width:${Math.min(100,v)}%"></div></div></div>`;};
    const bars=(running||delayed)?'':bar(P.energy,'Energie')+bar(P.water,'Wasser');
    const careW=(P.care||[]).filter(c=>{const s=st(c.e);if(!s)return false;return (c.warn||[]).includes(s.state)||(c.warn_below!=null&&parseFloat(s.state)<c.warn_below);}).map(c=>{const s=st(c.e);const v=(c.map&&c.map[s.state])||DWV[s.state]||s.state;return `<span class="ci warn">${esc(c.l)}: <b>${esc(c.u?s.state+' '+c.u:v)}</b></span>`;}).join('');
    if(careW)h+=`<div class="chips" style="margin-top:14px">${careW}</div>`;
    const so=this._dwSet;h+=`<button class="dwtoggle" data-a="dwset"><ha-icon icon="mdi:${so?'chevron-up':'chevron-down'}"></ha-icon>${so?'Weniger anzeigen':'Pflege, Statistik & Einstellungen'}</button>`;
    if(so){h+='<div class="dwdet">';
    if(care||bars)h+=sec('Pflege & Verbrauch',`${care?`<div class="chips">${care}</div>`:''}${bars?`<div class="dwbars" style="margin-top:12px">${bars}</div><div class="muted" style="font-style:normal;margin-top:6px">Geschätzter Verbrauch im Vergleich zum aufwendigsten Programm</div>`:''}`);
    const cnt=st(P.count);if(cnt){const a=cnt.attributes;const ls=a['Last Start']?new Date(a['Last Start']):null,le=a['Last End']?new Date(a['Last End']):null;const f=d=>d.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
      h+=sec('Statistik',`<div class="vstats"><div class="prow"><span>Spülgänge gesamt</span><span>${esc(cnt.state)}</span></div>${ls&&!isNaN(ls)?`<div class="prow"><span>Letzter Start</span><span>${esc(f(ls))}</span></div>`:''}${le&&!isNaN(le)&&ls?`<div class="prow"><span>Dauer zuletzt</span><span>${esc(hm((le-ls)/60000))}</span></div>`:''}</div>`);}
    // ---------- Geräteeinstellungen ----------
    {let es='';(P.settings||[]).forEach(c=>{const s=st(c.e);if(!s||s.state==='unavailable')return;if(c.e.startsWith('switch.')){es+=`<div class="li"><ha-icon icon="mdi:${c.icon||'toggle-switch-outline'}"></ha-icon><div class="grow"><div class="h">${esc(c.l)}</div></div><button class="tbtn ${s.state==='on'?'sel':''}" data-a="toggle" data-e="${c.e}">${s.state==='on'?'An':'Aus'}</button></div>`;return;}
      es+=`<div class="li"><ha-icon icon="mdi:${c.icon||'tune'}"></ha-icon><div class="grow"><div class="h">${esc(c.l)}</div></div><select class="sel" data-sel="${c.e}">${(s.attributes.options||[]).map(o=>`<option value="${esc(o)}"${o===s.state?' selected':''}>${esc(dwOpt(o))}</option>`).join('')}</select></div>`;});
      if(es)h+=sec('Geräteeinstellungen',`<div class="vset dwset">${es}</div>`);}
    h+='</div>';}
    h=`<div class="dwcols"><div class="dwcol">${hl}</div><div class="dwcol">${h}</div></div>`;
    const old=p.querySelector('.pbody');const sc=old?old.scrollTop:0;
    p.innerHTML=`<div class="panel wide dwx"><div class="pt">${esc(P.name||'Geschirrspüler')}</div><div class="pbody">${h}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;
    const nb=p.querySelector('.pbody');if(nb&&!first)nb.scrollTop=sc;p.classList.add('open');},
  async _dwStart(P,h){const st=id=>id?this._st(id):null;const wait=ms=>new Promise(r=>setTimeout(r,ms));const dl=this._dwDelay||0;
    const pr=st(P.program);const name=pr?((P.programs&&P.programs[pr.state])||pr.state):'';
    if(!confirm(`${name} ${dl?'in '+dl+' h ':''}starten? Ist die Maschine eingeräumt und Tabs drin?`))return;
    const step=t=>{this._dwBusy=t;this._vacPop();};
    try{const pw=st(P.power);if(pw&&pw.state==='off'){step('Schalte ein …');await h.callService('switch','turn_on',{entity_id:P.power});await wait(3500);if(pr)await h.callService('select','select_option',{entity_id:P.program,option:pr.state});await wait(1500);}
      if(P.delay){step(dl?'Setze Startzeit …':'Starte …');await h.callService('number','set_value',{entity_id:P.delay,value:dl*3600});await wait(1200);}
      step('Starte …');await h.callService('button','press',{entity_id:P.start});this._dwDelay=0;await wait(2500);}
    catch(e){alert('Start fehlgeschlagen: '+(e&&e.message||e));}
    this._dwBusy=null;this._vacPop();},
  _frPop(P,p,first){const st=id=>id?this._st(id):null;const sr=this.shadowRoot;
    this._sty('swdwcss',DWCSS);
    const ok=s=>s&&!['unavailable','unknown'].includes(s.state);
    const ago=t=>{const m=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/60000));return m<1?'gerade eben':m<60?'seit '+m+' min':'seit '+Math.floor(m/60)+' h '+swP(m%60)+' min';};
    const fv=(s,c)=>{if(!ok(s))return '–';const v=s.state;if(c.map&&c.map[v]!=null)return c.map[v];if(c.t)return String(v).slice(11,16)+' Uhr';let n=parseFloat(v);if(isNaN(n))return v;let u=s.attributes.unit_of_measurement||'';if(u==='s'){n=n/60;u='min';}if(u==='min'&&n>=60){const m=Math.round(n);return Math.floor(m/60)+' h '+swP(m%60)+' min';}u=({EUR:'€',cycles:''})[u]??u;const d=c.d!=null?c.d:(Math.abs(n)<10&&n%1?2:0);return n.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d})+(u?' '+u:'');};
    const rs=st(P.run);const on=rs&&rs.state==='on';const es=st(P.energy);const q=st(P.ratio);const pct=ok(q)?Math.max(0,Math.min(100,parseFloat(q.state)||0)):0;
    const R=56,C=2*Math.PI*R;const bd=P.big_d!=null?P.big_d:2;const big=ok(es)?parseFloat(es.state).toLocaleString('de-DE',{minimumFractionDigits:bd,maximumFractionDigits:bd}):'–';
    let h=`<div class="dwhero"><div class="dwring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="${on?'#4fc3f7':'rgba(255,255,255,.45)'}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="big">${esc(big)}</div><div class="sm">${esc(P.energy_label||'kWh')}</div></div></div><div class="dwinfo" style="flex:1;min-width:0"><div class="st">${esc(on?(P.on_text||'Kompressor läuft'):(P.off_text||'Kompressor aus'))}</div><div class="su">${rs?esc(ago(rs.last_changed)):''}${ok(q)&&(on||!P.ratio_on)?' · '+esc(P.ratio_text||'Einschaltquote')+' '+esc(fv(q,{d:0})):''}</div></div></div>`;
    h+=`<div class="vstats" style="margin-top:8px">${(P.rows||[]).map(c=>`<div class="prow" data-a="more" data-e="${c.e}" style="cursor:pointer"><span>${esc(c.l)}</span><span>${esc(fv(st(c.e),c))}</span></div>`).join('')}</div>`;
    if(P.note)h+=`<div class="pmut">${esc(P.note)}</div>`;
    p.innerHTML=`<div class="panel wide"><div class="pt">${esc(P.name||'Kühlen')}</div><div class="pbody">${h}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;p.classList.add('open');},
  _vacPop(first){const P=this._vacCfg();const sr=this.shadowRoot;const p=sr.getElementById('swpop');if(!P||!p)return;
    if(first)this._vopen=new Set();
    if(P.type==='fridge'||P.type==='stats')return this._frPop(P,p,first);
    if(P.type==='coffee')return this._cmPop(P,p,first);
    if(P.type==='airfryer'){if(first||!this._af)this._af={preset:null,t:180,m:15,a:2,pre:false,probe:false,pt:63};return this._afPop(P,p,first);}
    if(P.type==='dishwasher'){if(first){this._dwDelay=0;this._dwSet=false;}return this._dwPop(P,p,first);}
    this._sty('swvaccss',CSS);
    this._sty('swdwcss',DWCSS);
    const st=id=>id?this._st(id):null;const v=st(P.entity);
    const lab=o=>L[o]||o;const hide=(o,cur)=>(o==='custom'||o==='unknown')&&cur!==o;
    const chipsSel=eid=>{const s=st(eid);if(!s)return '';const cur=s.state;return `<div class="vchips">${(s.attributes.options||[]).filter(o=>!hide(o,cur)).map(o=>`<button class="tbtn ${o===cur?'sel':''}" data-a="svc" data-d="select" data-s="select_option" data-e="${eid}" data-x="${esc(JSON.stringify({option:o}))}">${esc(lab(o))}</button>`).join('')}</div>`;};
    
    // Kopf
    const ss=st(P.status);const vst=ss?(T[ss.state]||ss.state):(v?(T[v.state]||v.state):'');const bs=st(P.battery);const bat=bs&&!isNaN(parseFloat(bs.state))?Math.round(parseFloat(bs.state))+' %':'';const rs=st(P.room);
    let h=`<div class="vtop"><ha-icon icon="${P.icon||'mdi:robot-vacuum'}"></ha-icon><div style="min-width:0"><div class="vs">${esc([vst,rs&&!['unknown','unavailable'].includes(rs.state)?rs.state:''].filter(Boolean).join(' · '))}</div></div><div class="vb">${bat}</div></div>`;
    // Karte
    const ms=st(P.map);if(ms&&ms.attributes.entity_picture){const ep=ms.attributes.entity_picture;const u=ep+(ep.includes('?')?'&':'?')+'t='+encodeURIComponent(ms.last_updated);h+=`<img class="vmap" src="${esc(u)}" data-a="vacmap" alt="Karte">`;}
    // Steuerung
    const b=(svc,ic,l)=>`<button class="tbtn" data-a="svc" data-d="vacuum" data-s="${svc}" data-e="${P.entity}"><ha-icon icon="mdi:${ic}"></ha-icon>${l}</button>`;
    h+=sec('Steuerung',`<div class="vchips">${b('start','play','Start')}${b('pause','pause','Pause')}${b('stop','stop','Stopp')}${b('return_to_base','home-import-outline','Basis')}${b('clean_spot','target','Spot')}${b('locate','map-marker-radius','Orten')}${(P.buttons||[]).map(x=>`<button class="tbtn" data-a="press" data-e="${x.button}"${x.confirm?` data-c="${esc(x.confirm)}"`:''}><ha-icon icon="mdi:${x.icon||'gesture-tap'}"></ha-icon>${esc(x.label)}</button>`).join('')}</div>`);
    // Räume
    const R=P.rooms||[];if(R.length){const sel=this._vacRooms||new Set();const n=sel.size;
      h+=sec('Räume reinigen',`<div class="vchips">${R.map(r=>`<button class="tbtn ${sel.has(Number(r.id))?'sel':''}" data-a="vacroom" data-r="${r.id}">${esc(r.name)}</button>`).join('')}</div><div class="vrow"><span class="muted" style="font-style:normal">Durchgänge</span>${[1,2,3].map(x=>`<button class="tbtn ${(this._vacRep||1)===x?'sel':''}" data-a="vacrep" data-n="${x}">${x}×</button>`).join('')}<button class="vgo ${n?'':'dis'}" data-a="vacgo" style="margin-left:auto"><ha-icon icon="mdi:play"></ha-icon>${n?n+(n===1?' Raum':' Räume')+' starten':'Räume wählen'}</button></div>`);}
    const hl=h;h='';const sv=id=>{const x=st(id);return x?lab(x.state):'';};
    // Modi
    h+=this._cs('mode','Reinigungsmodus',sv(P.mode),chipsSel(P.mode));
    if(v&&(v.attributes.fan_speed_list||[]).length){const cur=v.attributes.fan_speed;h+=this._cs('fan','Saugkraft',lab(cur),`<div class="vchips">${v.attributes.fan_speed_list.filter(o=>!hide(o,cur)).map(o=>`<button class="tbtn ${o===cur?'sel':''}" data-a="svc" data-d="vacuum" data-s="set_fan_speed" data-e="${P.entity}" data-x="${esc(JSON.stringify({fan_speed:o}))}">${esc(lab(o))}</button>`).join('')}</div>`);}
    h+=this._cs('water','Wasserdurchfluss',sv(P.mop_intensity),chipsSel(P.mop_intensity));
    h+=this._cs('route','Wischroute',sv(P.mop_mode),chipsSel(P.mop_mode));
    // Station
    {let dh='';const chips=(P.dock_info||[]).map(c=>{const cs=st(c.e);if(!cs||cs.state==='unavailable')return '';const w=(c.warn||[]).includes(cs.state);return `<span class="ci ${w?'warn':''}">${esc(c.l)}: <b>${esc((c.map&&c.map[cs.state])||cs.state)}</b></span>`;});
      const de=st(P.dock_error);if(de&&!['ok','unknown','unavailable'].includes(de.state))chips.unshift(`<span class="ci warn">Fehler: <b>${esc(DE[de.state]||String(de.state).replace(/_/g,' '))}</b></span>`);
      if(chips.join(''))dh+=`<div class="chips">${chips.join('')}</div>`;
      const dt=st(P.dry_time);const dts=dt?parseFloat(dt.state):0;
      const acts=(P.dock_actions||[]).map(x=>{const xs=st(x.e);if(!xs)return '';const on=xs.state==='on';return `<button class="tbtn ${on?'sel':''}" data-a="toggle" data-e="${x.e}"><ha-icon icon="mdi:${x.icon||'gesture-tap'}"></ha-icon>${esc(x.label)}${on&&x.e.includes('trocknung')&&dts>0?' · '+Math.ceil(dts/60)+' min':''}</button>`;}).join('');
      const fx=P.dock_fix&&de&&!['ok','unknown','unavailable'].includes(de.state)?`<button class="tbtn" data-a="press" data-e="${P.dock_fix}"><ha-icon icon="mdi:wrench-check"></ha-icon>Fehler beheben</button>`:'';
      if(acts||fx)dh+=`<div class="vchips">${acts}${fx}</div>`;
      const dm=chipsSel(P.dock_mode);if(dm)dh+=`<div class="sub" style="margin:12px 0 8px">Absaugstärke Station</div>${dm}`;
      const dw=chips.filter(x=>x.includes('ci warn')).length;h+=this._cs('dock','Station',dw?dw+(dw===1?' Hinweis':' Hinweise'):'Alles OK',dh?`<div class="vdock">${dh}</div>`:'',dw>0);}
    // Wartung
    const C=(P.consumables||[]).map(c=>{const cs=st(c.e);if(!cs)return '';const hrs=parseFloat(cs.state);const pct=c.max&&!isNaN(hrs)?Math.max(0,Math.min(100,hrs/c.max*100)):null;const warn=!isNaN(hrs)&&((c.warn_below!=null&&hrs<c.warn_below)||hrs<=0);const cf=esc(c.l+' als gewechselt/gereinigt markieren? Der Zähler wird zurückgesetzt.');
      const rb=c.reset?`<button class="tbtn" data-a="press" data-e="${c.reset}" data-c="${cf}"><ha-icon icon="mdi:restore"></ha-icon>Zurücksetzen</button>`:(c.reset_cmd?`<button class="tbtn" data-a="svc" data-d="vacuum" data-s="send_command" data-e="${P.entity}" data-x="${esc(JSON.stringify({command:'reset_consumable',params:[c.reset_cmd]}))}" data-c="${cf}"><ha-icon icon="mdi:restore"></ha-icon>Zurücksetzen</button>`:'');
      return `<div class="vcon ${warn?'warn':''}"><div class="h">${esc(c.l)}</div><div class="vv">${isNaN(hrs)?'–':(hrs<=0?'0 h':Math.round(hrs)+' h')}</div>${!isNaN(hrs)&&hrs<0?`<div class="ov">${Math.round(-hrs)} h überfällig</div>`:''}${pct!=null?`<div class="pbar"><div style="width:${pct}%${warn?';background:#FF9800':''}"></div></div>`:''}${rb}</div>`;}).join('');
    const cw=(C.match(/vcon warn/g)||[]).length;h+=this._cs('maint','Wartung',cw?cw+' fällig':'Alles OK',C?`<div class="vcons">${C}</div>`:'',cw>0);
    // Statistik
    const S=(P.stats||[]).map(c=>{const cs=st(c.e);if(!cs||['unknown','unavailable'].includes(cs.state))return '';let val=cs.state;const u=cs.attributes.unit_of_measurement;const dc=cs.attributes.device_class;const n=parseFloat(val);
      if(dc==='timestamp'){const t=new Date(val);val=isNaN(t)?val:t.toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' Uhr';}
      else if(dc==='duration'&&!isNaN(n)){const m=Math.round(u==='h'?n*60:u==='s'?n/60:n);val=m>=60?`${Math.floor(m/60)} h ${m%60} min`:`${m} min`;}
      else if(u&&!isNaN(n))val=`${Math.round(n*10)/10} ${u}`;
      return `<div class="prow"><span>${esc(c.l)}</span><span>${esc(val)}</span></div>`;}).join('');
    const ls=(P.stats||[]).map(c=>st(c.e)).find(x=>x&&x.attributes.device_class==='timestamp'&&!['unknown','unavailable'].includes(x.state));h+=this._cs('stats','Statistik',ls?'zuletzt '+new Date(ls.state).toLocaleString('de-DE',{weekday:'short',hour:'2-digit',minute:'2-digit'}):'',S?`<div class="vstats">${S}</div>`:'');
    // Einstellungen
    let es='';const dn=st(P.dnd);if(dn)es+=`<div class="li"><ha-icon icon="mdi:sleep"></ha-icon><div class="grow"><div class="h">Bitte nicht stören</div></div><button class="tbtn ${dn.state==='on'?'sel':''}" data-a="toggle" data-e="${P.dnd}">${dn.state==='on'?'An':'Aus'}</button></div>`;
    const vo=st(P.volume);if(vo){const cv=Math.round(parseFloat(vo.state));const mk=x=>esc(JSON.stringify({value:Math.max(0,Math.min(100,(isNaN(cv)?50:cv)+x))}));es+=`<div class="li"><ha-icon icon="mdi:volume-high"></ha-icon><div class="grow"><div class="h">Lautstärke</div><div class="i">${isNaN(cv)?'–':cv+' %'}</div></div><button class="btn" data-a="svc" data-d="number" data-s="set_value" data-e="${P.volume}" data-x="${mk(-10)}"><ha-icon icon="mdi:minus"></ha-icon></button><button class="btn" data-a="svc" data-d="number" data-s="set_value" data-e="${P.volume}" data-x="${mk(10)}"><ha-icon icon="mdi:plus"></ha-icon></button></div>`;}
    const cl=st(P.child_lock);if(cl)es+=`<div class="li"><ha-icon icon="mdi:lock-outline"></ha-icon><div class="grow"><div class="h">Kindersicherung</div></div><button class="tbtn ${cl.state==='on'?'sel':''}" data-a="toggle" data-e="${P.child_lock}">${cl.state==='on'?'An':'Aus'}</button></div>`;
    h+=this._cs('set','Einstellungen',[dn?'Nicht stören '+(dn.state==='on'?'an':'aus'):'',vo?'Lautstärke '+Math.round(parseFloat(vo.state))+' %':''].filter(Boolean).join(' · '),es?`<div class="vset">${es}</div>`:'');
    h=`<div class="dwcols"><div class="dwcol">${hl}</div><div class="dwcol" style="margin-top:16px">${h}</div></div>`;
    const old=p.querySelector('.pbody');const sc=old?old.scrollTop:0;
    p.innerHTML=`<div class="panel wide dwx"><div class="pt">${esc(P.name||'Saugroboter')}</div><div class="pbody">${h}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;
    const nb=p.querySelector('.pbody');if(nb&&!first)nb.scrollTop=sc;p.classList.add('open');}
};
customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');Object.assign(C.prototype,ext);});
})();

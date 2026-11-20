/* Smart Wall Card v2.79.0 – Dashboard im Stil "Smart Wall", Header-Hintergrund mit den Abhängigkeiten aus dem Dashboard "slick" */
(function(){if(!document.getElementById('sw-font')){const l=document.createElement('link');l.id='sw-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300&display=swap';document.head.appendChild(l);}})();
const SW_BG_IMGS={'h1':'/local/backgrounds/h1.jpg','h2':'/local/backgrounds/h2.avif','h3':'/local/backgrounds/h3.avif','h4':'/local/backgrounds/h4.jpeg','h5':'/local/backgrounds/h5.jpg','h6':'/local/backgrounds/h6.jpg','h7':'/local/backgrounds/h7.jpg','h8':'/local/backgrounds/h8.jpg','Frühling':'saison:fruehling','Sommer':'saison:sommer','Herbst':'saison:herbst','Winter':'saison:winter','Ostern':'saison:ostern','Halloween':'saison:halloween','Weihnachten':'saison:weihnachten','h9':'multi:/local/backgrounds/h9'};
/* Gleiche Logik wie button_card_template "hintergrund_ebene" im Dashboard "slick" */
function swBg(states,cfg){const s=states[cfg.background_entity];const bilder=cfg.background_images||SW_BG_IMGS;const raum=cfg.room_image||'';
  const manuell=s&&bilder[s.state];const auto=s&&s.state==='Automatik';
  const m=new Date().getMonth()+1;const jz=(m>=3&&m<=5)?'fruehling':(m>=6&&m<=8)?'sommer':(m>=9&&m<=11)?'herbst':'winter';
  const heute=new Date();heute.setHours(12,0,0,0);const J=heute.getFullYear();const tag=864e5;
  const ostern=(y=>{const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m2+114)/31),da=((h+l-7*m2+114)%31)+1;return new Date(y,mo-1,da,12);})(J);
  const advent1=(y=>{const d=new Date(y,11,24,12);const wd=d.getDay();return new Date(d.getTime()-(wd===0?28:wd+21)*tag);})(J);
  let fest=null;
  if(heute>=new Date(ostern.getTime()-7*tag)&&heute<=new Date(ostern.getTime()+tag))fest='ostern';
  else if(heute.getMonth()===9&&heute.getDate()>=25)fest='halloween';
  else if(heute>=advent1||(heute.getMonth()===0&&heute.getDate()<=6))fest='weihnachten';
  let bild;
  if(manuell&&manuell.indexOf('saison:')===0){const f=manuell.slice(7);bild=`url('/local/backgrounds/${f}.avif'), url('/local/${f}.avif')`;}
  else if(manuell&&manuell.indexOf('multi:')===0){const p=manuell.slice(6);bild=['avif','jpg','jpeg','png','webp'].map(x=>`url('${p}.${x}')`).join(', ');}
  else if(manuell)bild=`url('${manuell}')`;
  else if(auto)bild=(fest?`url('/local/backgrounds/${fest}.avif'), url('/local/${fest}.avif'), `:'')+`url('/local/backgrounds/${jz}.avif'), url('/local/${jz}.avif'), url('${raum}')`;
  else bild=`url('${raum}')`;
  let h=`<div class="bgl" style="background-image:${bild};background-size:cover;background-position:center;background-repeat:no-repeat"></div>`;
  if(!auto)return h;
  const sun=states[cfg.sun_entity];const el=sun?parseFloat(sun.attributes.elevation):20;const steigt=sun?sun.attributes.rising:true;
  let tint='';if(el<-6)tint='rgba(8,18,48,0.50)';else if(el<6)tint=steigt?'rgba(255,150,170,0.16)':'rgba(255,130,50,0.20)';else if(el<15&&!steigt)tint='rgba(255,170,80,0.10)';
  if(tint)h+=`<div class="bgl" style="background:${tint}"></div>`;
  const w=states[cfg.weather];const ws=w?w.state:'';
  const rain=(sp,al)=>`<div class="bgl" style="opacity:${al};background-image:repeating-linear-gradient(105deg,transparent 0 18px,rgba(200,220,255,0.55) 18px 19px,transparent 19px 46px),repeating-linear-gradient(100deg,transparent 0 30px,rgba(200,220,255,0.35) 30px 31px,transparent 31px 70px);background-size:120px 160px,90px 120px;animation:regen ${sp}s linear infinite"></div>`;
  let fx='';
  if(ws==='rainy')fx=rain(1.1,0.35);
  else if(ws==='pouring'||ws==='hail')fx=rain(0.6,0.55)+'<div class="bgl" style="background:rgba(40,50,60,0.18)"></div>';
  else if(ws==='lightning-rainy'||ws==='lightning')fx=rain(0.7,0.45)+'<div class="bgl" style="background:rgba(230,235,255,1);animation:blitz 9s linear infinite;opacity:0"></div>';
  else if(ws==='snowy'||ws==='snowy-rainy')fx='<div class="bgl" style="opacity:0.8;background-image:radial-gradient(circle,rgba(255,255,255,0.9) 0 2px,transparent 3px),radial-gradient(circle,rgba(255,255,255,0.7) 0 1.5px,transparent 2.5px),radial-gradient(circle,rgba(255,255,255,0.5) 0 1px,transparent 2px);background-size:140px 140px,90px 90px,60px 60px;animation:schnee 14s linear infinite"></div>'+(ws==='snowy-rainy'?rain(1.2,0.25):'');
  else if(ws==='fog')fx='<div class="bgl" style="background:linear-gradient(to top,rgba(210,215,220,0.45),rgba(210,215,220,0.15))"></div>';
  else if(ws==='cloudy')fx='<div class="bgl" style="background:rgba(70,80,95,0.16)"></div>';
  else if(ws==='windy'||ws==='windy-variant')fx='<div class="bgl" style="background:rgba(70,80,95,0.10)"></div>';
  return h+fx;}
function swTargetK(states){const s=states['sun.sun'];const e=s?(parseFloat(s.attributes.elevation)||0):0;const k=2700+((e+6)/26)*2300;return Math.round(Math.max(2700,Math.min(5000,k))/50)*50;}
function swKColor(k,a){const t=Math.max(0,Math.min(1,(k-2200)/3800));const c=[255+(210-255)*t,170+(228-170)*t,90+(255-90)*t].map(Math.round);return `rgba(${c[0]},${c[1]},${c[2]},${a})`;}
function swFillColor(s){const a=s.attributes;if(a.color_mode==='color_temp'&&a.color_temp_kelvin)return swKColor(a.color_temp_kelvin,.3);if(Array.isArray(a.rgb_color))return `rgba(${a.rgb_color.join(',')},.3)`;return 'rgba(255,238,196,.16)';}
const SW_BAT={'HM-CC-RT-DN':'2× AA (LR6)','HM-PB-2-WM55-2':'2× AAA (LR03)','HM-PB-6-WM55':'2× AAA (LR03)','HM-RC-Key4-3':'1× AAA (LR03)','HM-Sec-Key':'3× AA (LR6)','HM-Sen-DB-PCB':'? bitte am Gerät prüfen','HM-TC-IT-WM-W-EU':'2× AAA (LR03)','HmIP-eTRV-B':'2× AA (LR6)','HmIP-eTRV-B-2 R4M':'2× AA (LR6)','HmIP-eTRV-B-2':'2× AA (LR6)','HmIP-SPI':'2× AA (LR6)','HmIP-SWD':'2× AAA (LR03)','HmIP-SWDM':'2× AAA (LR03)','HmIP-SWDM-B2':'2× AAA (LR03) – bitte prüfen','HmIP-SWDO-2':'1× AAA (LR03) – bitte prüfen','HmIP-SWDO-I':'2× AAA (LR03)','HmIP-SWSD':'fest verbaut – Melder tauschen','HmIP-WRC6':'2× AAA (LR03)','HmIP-WTH-1':'2× AAA (LR03)','TRADFRI on/off switch':'1× CR2032','lumi.weather':'1× CR2032','RWL020':'1× CR2450','Hue dimmer switch':'1× CR2450','Hue motion sensor':'2× AAA (LR03)','Hue tap dial switch':'1× CR2032','RDM002':'1× CR2032','Hue wall switch module':'1× CR2032'};
const SW_DAYS=['SO','MO','DI','MI','DO','FR','SA'];
const SW_DAYS_L=['SONNTAG','MONTAG','DIENSTAG','MITTWOCH','DONNERSTAG','FREITAG','SAMSTAG'];
const SW_PAGES=[['search','mdi:magnify','Suche'],['home','mdi:home-outline','Home'],['light','mdi:lightbulb-outline','Licht'],['plug','mdi:power-socket-eu','Steckdosen'],['climate','mdi:thermometer','Heizung'],['cover','mdi:window-shutter','Rollos'],['app','mdi:washing-machine','Haushalt'],['calendar','mdi:calendar-blank-outline','Kalender'],['music','mdi:play-circle-outline','Media'],['security','mdi:lock-outline','Sicherheit'],['todo','mdi:format-list-checks','Einkauf'],['server','mdi:server','Server'],['settings','mdi:cog-outline','Einstellungen']];
const SW_WI={'clear-night':'weather-night','cloudy':'weather-cloudy','exceptional':'alert-circle-outline','fog':'weather-fog','hail':'weather-hail','lightning':'weather-lightning','lightning-rainy':'weather-lightning-rainy','partlycloudy':'weather-partly-cloudy','pouring':'weather-pouring','rainy':'weather-rainy','snowy':'weather-snowy','snowy-rainy':'weather-snowy-rainy','sunny':'weather-sunny','windy':'weather-windy','windy-variant':'weather-windy-variant'};
const SW_ST={playing:'Spielt',paused:'Pausiert',idle:'Bereit',off:'Aus',on:'An',standby:'Standby',unavailable:'Nicht verfügbar',unknown:'Unbekannt',open:'Offen',closed:'Geschlossen',opening:'Öffnet',closing:'Schließt',locked:'Verriegelt',unlocked:'Entriegelt',home:'Zuhause',not_home:'Abwesend',auto:'Auto',heat:'Heizen'};
const swEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const swPad=n=>String(n).padStart(2,'0');
const swStart=e=>e.start.dateTime?new Date(e.start.dateTime):new Date(e.start.date+'T00:00:00');
const swEnd=e=>e.end.dateTime?new Date(e.end.dateTime):new Date(e.end.date+'T00:00:00');
function swGreet(name){const h=new Date().getHours();let g;if(h<5)g='Gute Nacht';else if(h<11)g='Guten Morgen';else if(h<17)g='Hallo';else if(h<22)g='Guten Abend';else g='Gute Nacht';return name?g+', '+name:g;}
const swDay0=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
function swAgo(ts){if(!ts)return '';const s=Math.max(0,Math.round((Date.now()-new Date(ts).getTime())/1000));if(s<60)return 'gerade eben';const m=Math.round(s/60);if(m<60)return `vor ${m} min`;const h=Math.round(m/60);if(h<24)return `vor ${h} h`;const d=Math.round(h/24);return `vor ${d} d`;}
const SW_CSS=`
:host{display:block;height:calc(100vh - var(--header-height,56px));height:var(--sw-height,calc(100dvh - var(--header-height,56px)));font-family:'Open Sans','Segoe UI',Roboto,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
.wall{display:flex;height:100%;background:#46545a;overflow:hidden}
.nav{width:56px;flex:none;background:#3b474c;display:flex;flex-direction:column;align-items:center;padding-top:24px;gap:2px;border-right:1px solid rgba(255,255,255,.05);position:relative;z-index:3}
.nav button{all:unset;cursor:pointer;width:56px;height:40px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.72);border-left:2px solid transparent;box-sizing:border-box;transition:background .2s}
.nav button ha-icon{--mdc-icon-size:18px}
.nav button.active{background:rgba(255,255,255,.09);border-left-color:#fff;color:#fff}
.nav button.warn{color:#FF9800;position:relative}
.nav button.warn::after{content:'';position:absolute;top:8px;right:12px;width:7px;height:7px;border-radius:50%;background:#FF9800;box-shadow:0 0 6px #FF9800}
.navsep{width:28px;height:1px;flex:none;background:rgba(255,255,255,.3);margin:auto 0 6px}
.nav button.mode:last-child{margin-bottom:14px}
.nav button.mode{position:relative;overflow:hidden;-webkit-touch-callout:none;user-select:none;touch-action:manipulation}
.nav button.mode.active{color:#ffd54f;background:rgba(255,213,79,.12);border-left-color:#ffd54f}
.nav button.mode .hl{position:absolute;left:0;bottom:0;height:3px;width:0;background:#fff}
.nav button.mode.holding .hl{width:100%;transition:width .8s linear}
.nav button.mode.fired{background:rgba(156,204,101,.4)}
.nav button.mode.run ha-icon{animation:swpulse 1.2s ease-in-out infinite}
.nav button.mode.hint{animation:swshake .35s}
@keyframes swpulse{50%{opacity:.35}}
@keyframes swshake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.main{flex:1;display:flex;flex-direction:column;min-width:0}
.hero{position:relative;flex:0 0 44%;min-height:200px;overflow:hidden;background:#3a4842;transition:flex-basis .45s ease,min-height .45s ease}
.hero.small{flex:0 0 96px;min-height:96px}
.bgwrap,.bgl{position:absolute;inset:0;pointer-events:none}
@keyframes regen{from{background-position:0 0,0 0}to{background-position:-80px 600px,-40px 400px}}
@keyframes schnee{from{background-position:0 0,0 0,0 0}to{background-position:60px 600px,-40px 400px,20px 300px}}
@keyframes blitz{0%,93%,100%{opacity:0}94%{opacity:.55}95%{opacity:.1}96%{opacity:.4}}
.shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(rgba(20,28,30,.08),rgba(20,28,30,.45))}
.hero .title{position:absolute;z-index:2;left:52px;bottom:24%;font-size:clamp(24px,3vw,40px);font-weight:300;letter-spacing:.22em;text-transform:uppercase;text-shadow:0 1px 10px rgba(0,0,0,.4);transition:font-size .45s,bottom .45s}
.hero.small .title{bottom:24px;font-size:24px}
.content{flex:1;overflow-y:auto;padding:26px 48px}
.top{display:grid;grid-template-columns:1.15fr 1.45fr 1fr;gap:24px;align-items:start}
.top.e4{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.top.e4>div:first-child{flex:0 1 280px;min-width:0}
.top.e4>.clock{flex:none}
.energy{cursor:pointer;min-height:60px}
.tsep{width:1px;flex:none;align-self:stretch;min-height:60px;background:rgba(255,255,255,.75)}
.dd{font-size:12px;opacity:.75;text-align:center;line-height:1.4;white-space:nowrap}
.ev{display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;cursor:pointer}
.ev ha-icon{--mdc-icon-size:20px;opacity:.9}
.ev .t{font-weight:600;flex:none;padding-top:2px}
.ev .s{font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.ev .d,.muted{font-style:italic;opacity:.7;text-transform:uppercase}
.weather{display:flex;align-items:center;gap:22px}
.weather .now{display:flex;flex-direction:column;align-items:center;cursor:pointer}
.weather .now ha-icon{--mdc-icon-size:56px}
.weather .now .tmp{opacity:.85;margin-top:2px;letter-spacing:.1em}
.vsep{width:1px;align-self:stretch;background:rgba(255,255,255,.75);min-height:60px}
.days{display:flex;gap:22px}
.day{display:flex;flex-direction:column;align-items:center;gap:6px}
.day .n{font-weight:600}
.day ha-icon{--mdc-icon-size:22px}
.clock{text-align:right}
.clock .date{letter-spacing:.25em}
.clock .date b{font-weight:600}
.clock .date span{font-weight:300;opacity:.85}
.clock .time{font-size:clamp(34px,4.4vw,58px);font-weight:300;letter-spacing:.12em;line-height:1.1;margin-top:4px}
hr.line{border:0;border-top:1px solid rgba(255,255,255,.75);margin:22px 0 26px}
.bottom{display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:start}
.bottom .bl{display:flex;justify-content:center;width:300px}
.bottom .bl .ring{width:150px;flex:none}
.bottom .br{width:300px}
.bmid{display:flex;flex-wrap:wrap;justify-content:center;gap:22px 20px;align-content:flex-start}
.bmid>*{width:150px;flex:none;display:flex;flex-direction:column;align-items:center}
.bmid .label{align-self:center;text-align:center;padding-left:.3em}
.bmid .bubble{width:100%;max-width:none}
.bmid>.bmedia{width:320px;max-width:100%;align-items:stretch}
.bmid>:empty{display:none}
.alwrap{margin-bottom:22px}
.alarm{background:rgba(255,255,255,.08);padding:18px 20px;max-width:760px;box-sizing:border-box}
.alarm.on{background:rgba(79,195,247,.16)}
.alarm.arm{background:rgba(255,193,7,.16)}
.alarm.hot{animation:swalb 1s ease-in-out infinite alternate}
@keyframes swalb{from{background:rgba(229,57,53,.3)}to{background:rgba(229,57,53,.62)}}
.alhead{display:flex;align-items:center;gap:18px}
.alhead ha-icon{--mdc-icon-size:40px;flex:0 0 auto}
.alhead .n{font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.alhead .i{font-size:11px;opacity:.7;margin-top:3px}
.alcd{margin-left:8px;font-variant-numeric:tabular-nums;opacity:.85}
.albtns{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
.albtn{all:unset;cursor:pointer;flex:1 1 110px;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 10px;border:1px solid rgba(255,255,255,.35);font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.albtn.active{background:rgba(255,255,255,.85);color:#111;border-color:transparent}
.albtn ha-icon{--mdc-icon-size:18px}
.alwins{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}
.alwin{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.08);padding:12px 14px;cursor:pointer}
.alwin>ha-icon{--mdc-icon-size:24px;flex:0 0 auto}
.alwin.open>ha-icon{color:#ff8a50}
.alwin.na{opacity:.4}
.alwin .h{font-size:12px;font-weight:600}
.alwin .i{font-size:10px;opacity:.65;margin-top:2px}
.altog{width:34px;height:18px;border-radius:9px;background:rgba(255,255,255,.25);position:relative;flex:0 0 auto}
.altog span{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .2s}
.altog.on{background:#4fc3f7}
.altog.on span{left:18px}
.alnote{font-size:11px;opacity:.55;margin-top:10px;max-width:760px}
button.alarm{color:#ff5252!important;position:relative}
button.alarm::after{content:'';position:absolute;top:8px;right:12px;width:8px;height:8px;border-radius:50%;background:#ff5252;box-shadow:0 0 8px #ff5252;animation:swalb2 .8s infinite alternate}
@keyframes swalb2{to{opacity:.2}}
.mrow{overflow:hidden}
.mrow .txt{flex:1}
.mrow .h,.mrow .i{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.label{font-weight:600;letter-spacing:.3em;text-transform:uppercase;margin-bottom:12px}
.ring{position:relative;width:min(150px,100%);aspect-ratio:1;cursor:pointer}
.ring svg{position:absolute;inset:0;width:100%;height:100%}
.ring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ring .num{font-size:36px;font-weight:300;letter-spacing:.12em;line-height:1}
.ring .num.sm{font-size:22px}
.ring .u{font-weight:600;letter-spacing:.3em;margin-top:8px}
.ring .w{letter-spacing:.25em;opacity:.8;margin-top:3px;max-width:80%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mrow{display:flex;background:rgba(255,255,255,.13);margin-bottom:3px;height:56px;cursor:pointer}
.mrow img,.ph{width:56px;height:56px;object-fit:cover;flex:none}
.ph{display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.18)}
.mrow .txt{padding:9px 12px;min-width:0}
.h{font-weight:600;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.i{font-style:italic;opacity:.75;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}
.bubble{position:relative;border:2px solid #fff;padding:14px 10px 12px;text-align:center;cursor:pointer;max-width:170px}
.bubble:before{content:'';position:absolute;left:16px;bottom:-12px;border-width:12px 12px 0 0;border-style:solid;border-color:#fff transparent transparent transparent}
.bubble:after{content:'';position:absolute;left:18px;bottom:-8px;border-width:8px 8px 0 0;border-style:solid;border-color:#46545a transparent transparent transparent}
.bubble .num{font-size:34px;font-weight:300;letter-spacing:.12em;line-height:1.1}
.bubble .u{font-weight:600;letter-spacing:.18em;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.bubble .s{opacity:.8;letter-spacing:.2em;margin-top:2px}
.tbox{background:rgba(255,255,255,.13)}
.tbox .hd{font-size:12px;font-weight:600;text-transform:uppercase;padding:12px 14px 9px;border-bottom:1px solid rgba(255,255,255,.1)}
.tbox .it{font-size:12px;font-style:italic;opacity:.8;padding:10px 14px;text-transform:uppercase;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.07);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
.tile{background:rgba(255,255,255,.08);padding:14px;cursor:pointer;display:flex;gap:12px;align-items:center;min-height:64px;height:64px;transition:background .2s;user-select:none}
.tile.on{background:rgba(255,255,255,.24)}
.tile ha-icon{--mdc-icon-size:22px;opacity:.55;flex:none}
.tile.on ha-icon{opacity:1;color:#ffeec4}
.tile.na{opacity:.4}
.tile.dim{position:relative;overflow:hidden;touch-action:pan-y}
.tile .fill{position:absolute;left:0;top:0;bottom:0;background:rgba(255,238,196,.16);pointer-events:none;transition:width .3s}
.tile.dragging .fill{transition:none;filter:brightness(1.4)}
.tile.dim{-webkit-touch-callout:none}
.rh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.rh .label{margin-bottom:0}
.chip{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:600;letter-spacing:.2em;padding:5px 10px;border:1px solid rgba(255,255,255,.5);opacity:.7;white-space:nowrap}
.chip.on{opacity:1;background:rgba(255,255,255,.12)}
.chip ha-icon{--mdc-icon-size:14px}
.pop{position:fixed;inset:0;z-index:20;background:rgba(10,16,18,.55);display:none;align-items:center;justify-content:center;padding:20px}
.pop.open{display:flex}
.panel{background:#46545a;border:1px solid rgba(255,255,255,.18);width:min(440px,100%);padding:22px 22px 18px;box-shadow:0 10px 40px rgba(0,0,0,.4)}
.panel .pt{font-size:13px;font-weight:600;letter-spacing:.25em;text-transform:uppercase}
.panel .pk{font-size:40px;font-weight:300;letter-spacing:.08em;margin:10px 0 14px}
.ctbar{position:relative;height:46px;background:linear-gradient(90deg,#ffa94d,#ffd29a 30%,#fff3e0 58%,#e4eeff 80%,#cfe0ff);cursor:pointer;touch-action:none}
.ctmark{position:absolute;top:-4px;bottom:-4px;width:4px;margin-left:-2px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.4)}
.ctl{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.2em;opacity:.7;margin-top:8px;text-transform:uppercase}
.presets{display:flex;gap:8px;margin:16px 0 12px}
.presets button{all:unset;cursor:pointer;flex:1;text-align:center;padding:10px 4px;border:1px solid rgba(255,255,255,.6);font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.presets button:active{background:rgba(255,255,255,.2)}
.pnote{font-size:12px;font-style:italic;opacity:.85;margin-bottom:14px;line-height:1.5}
.pnote button{all:unset;cursor:pointer;text-decoration:underline;font-style:normal}
.pbody{margin:4px 0 18px;max-height:min(60vh,420px);overflow-y:auto}
.prow{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px;letter-spacing:.04em}
.prow span:last-child{font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:.1em}
.pmut,.pbody .muted{font-size:11px;opacity:.6;margin-top:12px;font-style:italic}
.trow{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.trow .tt{font-size:13px;font-weight:600}
.trow .ts{font-size:12px;opacity:.85;margin-top:3px}
.trow .td{font-size:12px;opacity:.7;margin-top:6px;line-height:1.5}
.trow.closure .tt{color:#ff6b5e}
.hrow{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.hrow .hi{font-size:20px;flex:none}
.hrow .hx{flex:1;min-width:0}
.hrow .hk{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;opacity:.6}
.hrow .ht{font-size:13px;margin-top:2px}
.hack{all:unset;cursor:pointer;flex:none;padding:7px 14px;border:1px solid rgba(255,255,255,.6);font-size:11px;font-weight:600;letter-spacing:.15em}
.hack:active{background:rgba(255,255,255,.2)}
.hackall{all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;margin-top:16px;padding:11px 0;border:1px solid #FF9800;color:#FF9800;font-size:11px;font-weight:600;letter-spacing:.2em}
.hackall:active{background:rgba(255,152,0,.2)}
.ah.vclick{cursor:pointer}
.ctlg{display:inline-flex;align-items:center;gap:4px}.ctlg .cv{min-width:54px;text-align:center;font-size:13px}
.awx{display:grid}.awx>span{grid-area:1/1;animation:swalt 6s infinite}.awx>span+span{animation-delay:-3s;color:#FF9800;font-size:13px;font-weight:600;align-self:center}
@keyframes swalt{0%,45%{opacity:1}50%,95%{opacity:0}}
.pclose{all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;text-align:center;padding:11px 0;border:1px solid rgba(255,255,255,.7);font-size:11px;font-weight:600;letter-spacing:.25em}
.tile.dim>ha-icon,.tile.dim>div:not(.fill){position:relative}
.tile .n{font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.tile .st{font-style:italic;opacity:.7;margin-top:2px}
.sect{margin-top:22px}
.alerts{margin-bottom:6px}
.tile.alert{cursor:pointer}
.tile.alert .st{white-space:normal;line-height:1.3}
.sub{font-weight:600;letter-spacing:.25em;text-transform:uppercase;opacity:.6;margin:12px 0 8px}
.sect:first-child{margin-top:0}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.cl{background:rgba(255,255,255,.08);padding:18px;display:flex;flex-direction:column;gap:6px}
.clbat{position:absolute;top:10px;right:10px;display:flex;gap:2px;color:#FF9800;filter:drop-shadow(0 0 4px rgba(255,152,0,.6))}
.clbat ha-icon{--mdc-icon-size:18px}
.cl .cn::before{content:' · '}
.cl .cur{font-size:42px;font-weight:300;letter-spacing:.05em;line-height:1.1}
.ctrl{display:flex;align-items:center;gap:12px;margin-top:6px}
.ctrl .val{letter-spacing:.1em;min-width:60px;text-align:center}
.btn{all:unset;cursor:pointer;width:36px;height:36px;border:1px solid rgba(255,255,255,.7);display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;flex:none}
.btn ha-icon{--mdc-icon-size:18px}
.btn:active{background:rgba(255,255,255,.25)}
.li{display:flex;gap:16px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.12);align-items:center}
.li .grow{flex:1;min-width:0}
.li .tm{font-weight:600;flex:none}
.media{display:flex;background:rgba(255,255,255,.08);margin-bottom:8px;align-items:center}
.covrow{position:relative;overflow:hidden;touch-action:pan-y;user-select:none;min-height:64px}
.covrow.cdrag{touch-action:none}
.wchip{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:2px 8px 2px 6px;border-radius:999px;background:rgba(255,255,255,.10);font-size:10px;font-weight:500;font-style:normal;text-transform:none;letter-spacing:0;vertical-align:middle;cursor:pointer;white-space:nowrap;opacity:.85}
.wchip ha-icon{--mdc-icon-size:14px;width:14px;height:14px}
.wchip.open{background:rgba(255,138,80,.22);color:#ff8a50;opacity:1}
.li.wopen{box-shadow:inset 3px 0 0 #ff8a50}
.covrow .cfill{position:absolute;left:0;top:0;bottom:0;background:rgba(255,255,255,.10);pointer-events:none;transition:width .3s;z-index:0}
.covrow.cdrag .cfill{transition:none;background:rgba(255,255,255,.18)}
.covrow>*{position:relative;z-index:1}
.media img,.media .ph{width:84px;height:84px}
.media .grow{flex:1;min-width:0;padding:10px 16px}
.media .ctrl{padding-right:14px;margin:0;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.media.na{opacity:.4}
.stations{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.stn{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:7px;padding:4px 10px 4px 4px;border:1px solid rgba(255,255,255,.35);font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.stn img{width:22px;height:22px;object-fit:cover;border-radius:2px;flex:none}
.stn.on{background:rgba(255,255,255,.22);border-color:#fff}
.stn.na{opacity:.35;cursor:default}
.stn:active{background:rgba(255,255,255,.3)}
input.sw{all:unset;box-sizing:border-box;width:100%;border-bottom:1px solid rgba(255,255,255,.7);padding:10px 2px;letter-spacing:.12em;color:#fff;margin-bottom:18px}
input.sw::placeholder{color:rgba(255,255,255,.5)}
.cams{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.camwrap{position:relative;overflow:hidden;border-radius:4px;background:#000;width:440px;max-width:100%;aspect-ratio:4/3;cursor:pointer;flex:0 1 440px}
.camwrap .camstream,.camwrap ha-camera-stream,.camwrap video,.camwrap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;border:0}
.camlbl{position:absolute;left:0;bottom:0;z-index:2;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;background:linear-gradient(transparent,rgba(0,0,0,.55));width:100%;pointer-events:none}
.cam{width:100%;max-width:720px;display:block;cursor:pointer;background:rgba(0,0,0,.2)}
.big{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,.08);padding:20px;cursor:pointer;max-width:420px;margin-bottom:22px}
.big ha-icon{--mdc-icon-size:44px}
.big .n{font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.doors{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px}
.doors .big{margin-bottom:0;flex:1 1 220px;max-width:360px}
.door2{display:flex;background:rgba(255,255,255,.08);flex:1 1 300px;max-width:480px;overflow:hidden}
.door2.na{opacity:.4}
.d2main{display:flex;align-items:center;gap:18px;padding:18px 20px;flex:1;cursor:pointer;min-width:0}
.d2main ha-icon{--mdc-icon-size:40px}
.d2main .n{font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.d2open{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:0 20px;cursor:pointer;border-left:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04)}
.d2open ha-icon{--mdc-icon-size:30px}
.d2open .ol{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}
.d2open.on,.d2open:active{background:rgba(255,255,255,.22)}
.big.on{background:rgba(255,255,255,.24)}
.air{letter-spacing:.2em;margin-bottom:18px;opacity:.9}
.apps{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}
.app{background:rgba(255,255,255,.08);padding:16px 18px;display:flex;flex-direction:column;gap:12px}
.app.run{background:rgba(255,255,255,.16)}
.app.appstack{justify-content:space-around;gap:16px}
.app.appstack .ah{gap:14px}
.ah{display:flex;align-items:center;gap:14px}
.ah ha-icon{--mdc-icon-size:34px;opacity:.85;flex:none}
.ah .an{font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.ah .as{font-style:italic;opacity:.8;margin-top:3px}
.ah ha-icon.bt{--mdc-icon-size:20px;opacity:.35;margin-left:auto}
.ah ha-icon.bt.on{opacity:1;color:#4fc3f7}
.ah ha-icon.bt+.aw{margin-left:4px}
.afoot{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.05em;opacity:.6;border-top:1px solid rgba(255,255,255,.12);padding-top:8px}
.afoot ha-icon{--mdc-icon-size:14px}
.ah .aw{margin-left:auto;font-size:22px;font-weight:300;letter-spacing:.05em;text-align:right;white-space:nowrap}
.ah .aw small{font-size:12px;opacity:.75;letter-spacing:.02em}
.pbar{height:4px;background:rgba(255,255,255,.15);position:relative}
.pbar>div{position:absolute;left:0;top:0;bottom:0;background:#fff;transition:width .5s}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.ci{letter-spacing:.05em;padding:4px 8px;background:rgba(0,0,0,.18);text-transform:uppercase}
.ci b{font-weight:600}
.awarn{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.awx{box-shadow:inset 3px 0 0 #FF9800}
.awc{margin-top:8px}
.ci.warn{background:rgba(230,110,70,.45)}
.tbtn.sel{background:rgba(255,255,255,.3);border-color:#fff}
.li .tbtn{margin-left:4px}
.actl{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.actl .btn.on{background:rgba(255,255,255,.25)}
.tbtn{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:1px solid rgba(255,255,255,.7);font-weight:600;letter-spacing:.15em;text-transform:uppercase;box-sizing:border-box;white-space:nowrap}
.tbtn ha-icon{--mdc-icon-size:16px}
.tbtn:active{background:rgba(255,255,255,.25)}
select.sel{height:36px;background:rgba(0,0,0,.2);color:#fff;border:1px solid rgba(255,255,255,.5);padding:0 8px;font:inherit;letter-spacing:.04em;min-width:0;flex:1 1 140px}
select.sel option{color:#000}
input.sw{font-size:18px}
.ev .t{font-size:14px;width:60px}
.ev .s{font-size:14px}
.ev .d,.muted{font-size:13px}
.weather .now .tmp{font-size:16px}
.day{font-size:13px}
.day .v{font-size:15px}
.clock .date{font-size:16px}
.label{font-size:13px}
.ring .u{font-size:13px}
.ring .w{font-size:12px}
.h{font-size:13px}
.i{font-size:12px}
.bubble .u{font-size:13px}
.bubble .s{font-size:12px}
.tbox .hd,.tbox .it{font-size:15px}
.tile .n{font-size:14px}
.tile .st{font-size:13px}
.sub{font-size:12px}
.li .h{font-size:15px!important}
.li .i{font-size:13px!important}
.li .tm{font-size:14px;width:88px}
.media .h{font-size:16px!important}
.media .i{font-size:13px}
.cl>div:first-child{font-size:14px!important}
.cl .muted{font-size:13px}
.ctrl .val{font-size:18px}
.big .n{font-size:16px}
.big .i{font-size:14px!important}
.air{font-size:15px}
.chip{font-size:11px}
.stn{font-size:12px}
.ci{font-size:12px}
.tbtn{font-size:12px}
select.sel{font-size:13px}
.ah .an{font-size:14px}
.ah .as{font-size:13px}
.cl .cn{font-size:12px}
@media (max-width:900px){.tsep{display:none}.top,.top.e4{display:grid;grid-template-columns:1fr}.energy{border-left:0;padding-left:0}.bottom{grid-template-columns:1fr 1fr}.content{padding:20px}.hero .title{left:24px}.clock{text-align:left}.cams{grid-template-columns:1fr}}
@media (orientation:portrait){
.doors{flex-direction:column}
.doors .big{width:100%;box-sizing:border-box}
.door2{flex:1 1 auto;width:100%;max-width:none;box-sizing:border-box}
.camwrap{flex:1 1 100%;width:100%}
:host{height:auto}
.wall{height:auto;min-height:calc(100dvh - var(--header-height,56px));overflow:visible;align-items:flex-start}
.nav{position:sticky;top:var(--header-height,56px);align-self:flex-start;width:46px;height:calc(100dvh - var(--header-height,56px));padding-top:14px;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 50px);box-sizing:border-box;overflow-y:auto}
.nav button.mode:last-child{margin-bottom:0}
.nav button{width:46px;height:40px}
.main{min-height:calc(100dvh - var(--header-height,56px))}
.hero{flex:0 0 240px;min-height:240px}
.hero.small{flex:0 0 80px;min-height:80px}
.hero .title{left:22px;bottom:24px;font-size:30px;letter-spacing:.25em}
.hero.small .title{font-size:20px;bottom:18px}
.content{overflow:visible;padding:20px 18px 32px}
.top,.top.e4{display:flex;flex-direction:column;gap:22px}
.top.e4>div:first-child{flex:none}
.tsep{display:none}
.top>*{min-width:0}
.clock{order:-1;text-align:left}
.clock .time{font-size:52px}
.weather{gap:16px}
.days{gap:14px;flex-wrap:wrap}
hr.line{margin:20px 0 22px}
.bottom{grid-template-columns:1fr 1fr;gap:24px 16px}
.bottom .bl{order:1;width:auto}
.bottom .bl .ring{width:min(140px,100%)}
.bottom .br{order:2;width:auto}
.bmid{order:3;grid-column:1/-1}
.bmid>*{width:calc(50% - 10px)}
.bmid>.bmedia{width:100%}
.grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
.tile{padding:12px;gap:10px}
.media{flex-wrap:wrap}
.media .grow{flex:1 1 150px}
.media .ctrl{width:100%;padding:0 10px 10px;justify-content:flex-start}
.li{gap:10px}
.li .btn{width:34px;height:34px}
.covrow{position:relative;overflow:hidden;touch-action:pan-y;user-select:none;padding-left:14px}
.doors .big{flex:1 1 100%;max-width:none}
.cam{max-width:100%}
.apps{grid-template-columns:1fr}
.cards{grid-template-columns:1fr 1fr;gap:8px}
.cl{padding:14px 12px;overflow:hidden;min-width:0}
.cl>div:first-child{letter-spacing:.12em!important;font-size:12px!important;line-height:1.35}
.cl .cn{display:block;opacity:.65;font-size:11px;letter-spacing:.1em}
.cl .cn::before{content:none}
.cl .cur{font-size:32px}
.cl .ctrl{margin-top:auto;padding-top:8px;gap:4px;justify-content:space-between}
.cl .ctrl .val{min-width:0;flex:1;font-size:15px;letter-spacing:.04em}
.cl .btn{width:34px;height:34px}
.air{letter-spacing:.08em;font-size:13px}
}
@media (min-width:701px) and (max-width:1400px) and (orientation:landscape){.bottom{grid-template-columns:auto minmax(0,1fr) minmax(190px,24%);gap:20px}.bottom .bl{grid-column:1;grid-row:1;width:auto}.bottom .bl .ring{width:124px}.bmid{grid-column:2;grid-row:1;gap:18px 12px}.bottom .br{grid-column:3;grid-row:1;width:auto}.bmid>*{width:auto;flex:1 1 0;min-width:90px;max-width:150px}.bmid>.bmedia{width:100%;flex:1 1 100%;max-width:none}.bmid .label{letter-spacing:.2em}.bubble{padding:12px 6px 10px}.bubble .u{letter-spacing:.1em}.bubble .s{letter-spacing:.1em}.ring .w,.ring .u{letter-spacing:.15em}}
@media (max-width:700px){
.top .clock,.top .weather,.bottom .br{display:none}
.bottom .bl{grid-column:1/-1;justify-content:center}
}

.ah ha-icon.bt+ha-icon.bt{margin-left:2px}
.ah ha-icon.bt.low{opacity:1;color:#FF9800}
`;
class SmartWallCard extends HTMLElement{
  constructor(){super();this.attachShadow({mode:'open'});this._page='home';this._events=[];this._forecast=[];this._todo=[];this._unsubs=[];this._q='';
    this.shadowRoot.addEventListener('click',e=>this._onClick(e));
    this.shadowRoot.addEventListener('input',e=>{if(e.target.id==='swq'){this._q=e.target.value;const r=this.shadowRoot.getElementById('swres');if(r)r.innerHTML=this._results();}});
    const sr0=this.shadowRoot;sr0.addEventListener('pointerdown',()=>{this._pd=Date.now();},true);
    sr0.addEventListener('change',e=>{const t=e.composedPath()[0];if(t&&t.dataset&&t.dataset.sel&&this._hass)this._hass.callService('select','select_option',{entity_id:t.dataset.sel,option:t.value});else if(t&&t.dataset&&t.dataset.fan&&this._hass&&t.value)this._hass.callService('fan','set_preset_mode',{entity_id:t.dataset.fan,preset_mode:t.value});});
    sr0.addEventListener('contextmenu',e=>{if(e.composedPath().some(n=>n.dataset&&n.dataset.ct))e.preventDefault();});
    sr0.addEventListener('pointerdown',e=>{const path=e.composedPath();const bar=path.find(n=>n.id==='swctbar');if(bar){this._ctDrag={pid:e.pointerId};try{bar.setPointerCapture(e.pointerId);}catch(_){}this._ctFromX(e.clientX);return;}const cov=path.find(n=>n.classList&&n.classList.contains('covrow'));if(cov){const r=cov.getBoundingClientRect();this._cdrag={el:cov,id:cov.dataset.e,x0:e.clientX,y0:e.clientY,left:r.left,w:r.width||240,pid:e.pointerId,active:false,pos:null};return;}const t=path.find(n=>n.classList&&n.classList.contains('dim'));if(!t)return;this._drag={el:t,id:t.dataset.e,x0:e.clientX,y0:e.clientY,start:Number(t.dataset.pct)||0,w:t.getBoundingClientRect().width||200,pid:e.pointerId,active:false,pct:null,last:0};
      clearTimeout(this._lpT);if(t.dataset.ct){this._lpT=setTimeout(()=>{const d=this._drag;if(d&&!d.active&&d.el===t){this._drag=null;this._suppressClick=true;setTimeout(()=>{this._suppressClick=false;},600);this._openCt(t.dataset.e);}},550);}});
    sr0.addEventListener('pointermove',e=>{if(this._ctDrag&&e.pointerId===this._ctDrag.pid){this._ctFromX(e.clientX);return;}const cd=this._cdrag;if(cd&&e.pointerId===cd.pid){const dx=e.clientX-cd.x0,dy=e.clientY-cd.y0;if(!cd.active){if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){cd.active=true;try{cd.el.setPointerCapture(cd.pid);}catch(_){}cd.el.classList.add('cdrag');}else if(Math.abs(dy)>14){this._cdrag=null;}return;}e.preventDefault();const pos=Math.max(0,Math.min(100,Math.round((e.clientX-cd.left)/cd.w*100)));cd.pos=pos;const f=cd.el.querySelector('.cfill');if(f)f.style.width=pos+'%';const inf=cd.el.querySelector('.i');if(inf)inf.textContent=(pos<=0?'Geschlossen':'Offen')+' · '+pos+' %';this._covTarget=this._covTarget||{};this._covTarget[cd.id]={p:pos,t:Date.now(),held:true};return;}const d=this._drag;if(!d||e.pointerId!==d.pid)return;const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
      if(!d.active){if(Math.abs(dx)>10||Math.abs(dy)>10)clearTimeout(this._lpT);if(Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.3){d.active=true;try{d.el.setPointerCapture(d.pid);}catch(_){}d.el.classList.add('dragging');}else if(Math.abs(dy)>12){this._drag=null;}return;}
      e.preventDefault();const pct=Math.max(0,Math.min(100,Math.round(d.start+dx/d.w*100)));d.pct=pct;
      const f=d.el.querySelector('.fill');if(f)f.style.width=pct+'%';const st=d.el.querySelector('.st');if(st)st.textContent=pct?pct+' %':'Aus';
      const now=Date.now();if(now-d.last>400){d.last=now;this._setBri(d.id,pct);}});
    const swEndDrag=e=>{clearTimeout(this._lpT);if(this._ctDrag&&e.pointerId===this._ctDrag.pid){this._ctDrag=null;if(e.type==='pointerup'&&this._ct)this._setCt(this._ct.k);return;}const cd=this._cdrag;if(cd&&e.pointerId===cd.pid){this._cdrag=null;if(cd.active){cd.el.classList.remove('cdrag');this._suppressClick=true;setTimeout(()=>{this._suppressClick=false;},400);if(cd.pos!=null){if(this._covTarget&&this._covTarget[cd.id])this._covTarget[cd.id].held=false;this._setPos(cd.id,cd.pos);}}return;}const d=this._drag;if(!d||e.pointerId!==d.pid)return;this._drag=null;if(d.active){d.el.classList.remove('dragging');this._suppressClick=true;setTimeout(()=>{this._suppressClick=false;},400);if(d.pct!=null)this._setBri(d.id,d.pct);}};
    sr0.addEventListener('pointerup',swEndDrag);sr0.addEventListener('pointercancel',swEndDrag);
    sr0.addEventListener('pointerdown',e=>{const b=e.composedPath().find(n=>n.dataset&&n.dataset.hold);if(!b)return;clearTimeout(this._holdT);b.classList.add('holding');this._holdEl=b;this._holdXY=[e.clientX,e.clientY];this._holdT=setTimeout(()=>{b.classList.remove('holding');b.classList.add('fired');setTimeout(()=>b.classList.remove('fired'),1500);this._holdEl=null;this._suppressClick=true;setTimeout(()=>{this._suppressClick=false;},800);if(this._hass)this._hass.callService('script','turn_on',{entity_id:b.dataset.hold});},800);});
    const swHoldCancel=()=>{clearTimeout(this._holdT);if(this._holdEl){this._holdEl.classList.remove('holding');this._holdEl=null;}};
    sr0.addEventListener('pointerup',swHoldCancel);sr0.addEventListener('pointercancel',swHoldCancel);
    sr0.addEventListener('pointermove',e=>{if(this._holdEl&&this._holdXY&&(Math.abs(e.clientX-this._holdXY[0])>15||Math.abs(e.clientY-this._holdXY[1])>15))swHoldCancel();});
    sr0.addEventListener('contextmenu',e=>{if(e.composedPath().some(n=>n.dataset&&n.dataset.hold))e.preventDefault();});
    this.shadowRoot.addEventListener('keydown',e=>{if(e.target.id==='swadd'&&e.key==='Enter'&&e.target.value.trim()){this._hass.callService('todo','add_item',{item:e.target.value.trim()},{entity_id:this._cfg.todo});e.target.value='';}});
  }
  setConfig(c){this._cfg=Object.assign({name:'Zuhause',background_entity:'input_select.hintergrund',sun_entity:'sun.sun',room_image:'/local/images/Homio/rooms/outside.jpg',background_images:SW_BG_IMGS,calendars:[],music:[],tv:[],tv_extras:[],climates:[],covers:[],motion:[],air:[],exclude_lights:[],height:''},c);if(this._cfg.height)this.style.setProperty('--sw-height',this._cfg.height);if(this._cfg.start_page)this._page=this._cfg.start_page;
    this._built=false;this._lastBg=null;}
  set hass(h){const first=!this._hass;const old=this._hass;this._hass=h;
    if(first){this._subscribe();this._render(true);return;}
    if(this._changed(old,h)&&!this._pending){this._pending=setTimeout(()=>{this._pending=null;this._render();},300);}
  }
  get hass(){return this._hass}
  connectedCallback(){this._tickI=setInterval(()=>this._tick(),1000);this._slowI=setInterval(()=>this._render(),30000);this._evI=setInterval(()=>this._loadEvents(),600000);this._camI=setInterval(()=>this._camRefresh(),5000);this._trI=setInterval(()=>this._loadTraffic(),300000);if(this._hass){this._subscribe();this._loadTraffic();}}
  disconnectedCallback(){[this._tickI,this._slowI,this._evI,this._camI,this._trI].forEach(clearInterval);this._unsubs.forEach(u=>{try{u()}catch(e){}});this._unsubs=[];this._subbed=false;}
  getCardSize(){return 12}
  /* ---------- Hintergrund wie im Dashboard "slick" ---------- */
  _renderHero(){const w=this.shadowRoot.getElementById('swbg');if(!w||!this._hass)return;const h=swBg(this._hass.states,this._cfg);if(h!==this._lastBg){w.innerHTML=h;this._lastBg=h;}}
  _ensure(){if(this._built)return;const sr=this.shadowRoot;
    sr.innerHTML=`<style>${SW_CSS}</style><div class="wall"><div class="nav" id="swnav"></div><div class="main"><div class="hero" id="swhero"><div class="bgwrap" id="swbg"></div><div class="shade"></div><div class="title" id="swtitle"></div></div><div class="content" id="swcontent"></div></div></div><div class="pop" id="swpop"></div>`;
    this._built=true;this._lastBg=null;}
  async _subscribe(){if(this._subbed||!this._hass)return;this._subbed=true;const c=this._hass.connection;
    if(this._cfg.weather){try{this._unsubs.push(await c.subscribeMessage(m=>{this._forecast=m.forecast||[];this._render(true);},{type:'weather/subscribe_forecast',forecast_type:'daily',entity_id:this._cfg.weather}));}catch(e){console.warn('smart-wall forecast',e)}}
    if(this._cfg.todo){try{this._unsubs.push(await c.subscribeMessage(m=>{this._todo=m.items||[];this._render(true);},{type:'todo/item/subscribe',entity_id:this._cfg.todo}));}catch(e){console.warn('smart-wall todo',e)}}
    this._loadEvents();}
  async _loadEvents(){if(!this._hass)return;const s=new Date(),e=new Date(Date.now()+60*864e5);const all=[];
    for(const c of this._cfg.calendars){try{const r=await this._hass.callApi('GET',`calendars/${c}?start=${encodeURIComponent(s.toISOString())}&end=${encodeURIComponent(e.toISOString())}`);(r||[]).forEach(x=>all.push(Object.assign({cal:c},x)));}catch(err){}}
    all.sort((a,b)=>swStart(a)-swStart(b));this._events=all;this._render(true);}
  _grp(list){return (list||[]).map(g=>typeof g==='string'?{room:'',entities:[g]}:g);}
  _eid(e){return typeof e==='string'?e:e.entity;}
  _flat(list){const out=[];this._grp(list).forEach(g=>{(g.entities||[]).forEach(e=>out.push(this._eid(e)));if(g.entity)out.push(g.entity);if(g.temperature)out.push(g.temperature);if(g.auto)out.push(g.auto);if(g.humidity)out.push(g.humidity);(g.scenes||[]).forEach(e=>out.push(this._eid(e)));(g.plugs||[]).forEach(e=>out.push(this._eid(e)));});return out;}
  _roomOf(id){const g=this._grp(this._cfg.lights).find(g=>(g.entities||[]).some(e=>{const x=this._eid(e);if(x===id)return true;const s=this._hass&&this._hass.states[x];return !!(s&&Array.isArray(s.attributes.entity_id)&&s.attributes.entity_id.includes(id));}));return g?g.room:null;}
  _lights(){if(this._cfg.lights&&this._cfg.lights.length){const set=new Set();this._grp(this._cfg.lights).forEach(g=>(g.entities||[]).forEach(e=>{const id=this._eid(e);set.add(id);const s=this._hass&&this._hass.states[id];if(s&&Array.isArray(s.attributes.entity_id))s.attributes.entity_id.forEach(m=>set.add(m));}));return [...set];}const h=this._hass;if(!this._lightIds||this._lightIdsN!==Object.keys(h.states).length){this._lightIdsN=Object.keys(h.states).length;this._lightIds=Object.keys(h.states).filter(i=>i.startsWith('light.')&&!this._cfg.exclude_lights.includes(i));}return this._lightIds;}
  _relevant(){const c=this._cfg,p=this._page;let ids=[];
    if(p==='home')ids=[...Object.values(c.energy||{}).filter(x=>typeof x==='string'&&x.includes('.')),c.weather,c.todo,...this._musicIds(),...c.tv,...this._lights(),...this._alertIds()];
    else if(p==='light')ids=this._flat(c.lights).concat(this._lights()).concat((c.windows||[]).flatMap(g=>(g.entities||[]).map(e=>this._eid(e))));
    else if(p==='plug')ids=this._flat(c.lights);
    else if(p==='climate')ids=[...this._flat(c.climates),...(c.airquality||[]).flatMap(a=>[a.power,a.preset,a.value,...(a.info||[]).map(x=>x.e)])];
    else if(p==='cover')ids=[this._cfg.covers_all,...this._flat(c.covers)];
    else if(p==='app')ids=(c.appliances||[]).flatMap(a=>a.group?[a.value,a.value2,...a.group.flatMap(g=>[g.temp,...(g.info||[]).map(x=>x.e)]),...(this._vacIds?this._vacIds(a.popup):[])]:[a.status,a.power,a.progress,a.remaining,a.program,a.start,a.watt,a.battery,a.temp,a.value,a.preset,...(a.info||[]).map(x=>x.e),...(this._vacIds?this._vacIds(a.popup):[])]);
    else if(p==='music')ids=[...this._musicIds(),...(c.tv||[])];
    else if(p==='tv')ids=[...c.tv,...c.tv_extras];
    else if(p==='security')ids=[c.lock,c.door_opener,c.flat_opener,...(c.cameras||[]),...(c.motion||[]).map(m=>typeof m==='string'?m:m.e)];
    else if(p==='todo')ids=[c.todo];
    else if(p==='server')ids=(c.servers||[]).flatMap(a=>[a.status,a.value,a.hide_unavailable,...(a.info||[]).map(x=>x.e)]);
    else if(p==='settings'){const S=c.settings||{};ids=[...(S.tea||[]),...((S.heating||{}).climates||[]),S.background||c.background_entity,(S.vacuum||{}).entity];}
    else if(p==='search')ids=this._searchIds();
    return [...ids,c.background_entity,c.sun_entity,c.weather,...(c.modes?[c.modes.status,...(c.modes.items||[]).map(m=>m.script)]:[]),...Object.values(c.nav_alerts||{}).flatMap(rs=>(rs||[]).flatMap(r=>[...(r.dead||[]),...(r.unavailable||[]),...(r.on||[]),...(r.off||[]),r.e])),...(c.homematic&&c.nav_alerts?[c.homematic.service,c.homematic.alarm]:[]),...this._alarmIds()].filter(Boolean);}
  _changed(o,n){if(!o)return true;return this._relevant().some(i=>o.states[i]!==n.states[i]);}
  _st(id){return this._hass.states[id]}
  _nm(id){const s=this._st(id);return s?(s.attributes.friendly_name||id):id}
  _tr(s){return SW_ST[s]||s}
  _area(id){const h=this._hass;const en=h.entities&&h.entities[id];if(!en)return null;const a=en.area_id||(en.device_id&&h.devices&&h.devices[en.device_id]&&h.devices[en.device_id].area_id);return a&&h.areas&&h.areas[a]?h.areas[a].name:null;}
  _more(id){const ev=new Event('hass-more-info',{bubbles:true,composed:true});ev.detail={entityId:id};this.dispatchEvent(ev);}
  _groupOf(id){return this._grp(this._cfg.lights).find(g=>(g.scenes||[]).some(e=>this._eid(e)===id)||(g.entities||[]).some(e=>{const x=this._eid(e);if(x===id)return true;const s=this._hass&&this._hass.states[x];return !!(s&&Array.isArray(s.attributes.entity_id)&&s.attributes.entity_id.includes(id));}));}
  _pause(id){const g=this._groupOf(id);const au=g&&g.auto&&this._st(g.auto);if(au&&au.state==='on')this._hass.callService('input_boolean','turn_off',{entity_id:g.auto});}
  _openCt(id){const s=this._st(id);if(!s)return;const a=s.attributes;this._ct={id,kmin:Math.max(2000,a.min_color_temp_kelvin||2000),kmax:Math.min(6500,a.max_color_temp_kelvin||6500),k:(a.color_mode==='color_temp'&&a.color_temp_kelvin)?a.color_temp_kelvin:swTargetK(this._hass.states)};
    const g=this._groupOf(id);const au=g&&g.auto&&this._st(g.auto);const en=g&&(g.entities||[]).find(e=>this._eid(e)===id);const n=(en&&typeof en!=='string'&&en.name)?(g.room+' · '+en.name):(a.friendly_name||id);
    const pr=(l,k)=>`<button data-a="ctset" data-k="${k}">${l}</button>`;const p=this.shadowRoot.getElementById('swpop');if(!p)return;
    p.innerHTML=`<div class="panel"><div class="pt">${swEsc(n)}</div><div class="pk" id="swpk"></div><div class="ctbar" id="swctbar"><div class="ctmark" id="swctmark"></div></div><div class="ctl"><span>Kunstlicht</span><span>Tageslicht</span></div><div class="presets">${pr('Warm',2700)}${pr('Neutral',4000)}${pr('Tageslicht',5500)}</div>${au?`<div class="pnote">${au.state==='on'?`Automatik aktiv (jetzt ${swTargetK(this._hass.states)} K). Eine Änderung pausiert sie für ${swEsc(g.room)} bis 04:30.`:`Automatik für ${swEsc(g.room)} pausiert · <button data-a="autoon" data-e="${g.auto}">wieder aktivieren</button>`}</div>`:''}<button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;
    p.classList.add('open');this._ctShow();}
  _ctShow(){const c=this._ct;if(!c)return;const sr=this.shadowRoot;const m=sr.getElementById('swctmark'),l=sr.getElementById('swpk');if(m)m.style.left=Math.max(0,Math.min(100,(c.k-2000)/45))+'%';if(l)l.textContent=c.k+' K';}
  _ctFromX(x){const b=this.shadowRoot.getElementById('swctbar');if(!b||!this._ct)return;const r=b.getBoundingClientRect();const t=Math.max(0,Math.min(1,(x-r.left)/r.width));let k=Math.round((2000+t*4500)/50)*50;this._ct.k=Math.max(this._ct.kmin,Math.min(this._ct.kmax,k));this._ctShow();}
  _setCt(k){const c=this._ct;if(!c||!this._hass)return;c.k=Math.max(c.kmin,Math.min(c.kmax,Number(k)));this._ctShow();this._hass.callService('light','turn_on',{entity_id:c.id,color_temp_kelvin:c.k});this._pause(c.id);}
  _closeCt(){this._ct=null;this._ctDrag=null;this._popKind=null;const p=this.shadowRoot.getElementById('swpop');if(p){p.classList.remove('open');p.innerHTML='';}}
  _setBri(id,pct){if(!this._hass)return;if(pct<=0)this._hass.callService('light','turn_off',{entity_id:id});else this._hass.callService('light','turn_on',{entity_id:id,brightness_pct:pct});}
  _onClick(ev){if(this._suppressClick){this._suppressClick=false;return;}const p0=ev.composedPath()[0];if(p0&&p0.id==='swpop'){this._closeCt();return;}const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a);if(!el)return;const d=el.dataset,h=this._hass;
    switch(d.a){
      case 'hanav':history.pushState(null,'',d.u);window.dispatchEvent(new CustomEvent('location-changed',{detail:{replace:false}}));break;
      case 'holdhint':el.classList.remove('hint');void el.offsetWidth;el.classList.add('hint');break;
      case 'nav':this._page=d.p;this._q='';this._render(true);const ct=this.shadowRoot.getElementById('swcontent');if(ct)ct.scrollTop=0;break;
      case 'toggle':h.callService('homeassistant','toggle',{entity_id:d.e});break;
      case 'svc':if(d.c&&!confirm(d.c))break;h.callService(d.d,d.s,Object.assign(d.e?{entity_id:d.e}:{},d.x?JSON.parse(d.x):{}));break;
      case 'vacmsg':{const S=(this._cfg.settings||{}).vacuum||{};const st=this._st(S.entity);let o={};try{o=st?JSON.parse(st.state):{};}catch(_){o={};}o[d.k]=d.v;h.callService('input_text','set_value',{entity_id:S.entity,value:JSON.stringify(o)});break;}
      case 'more':this._more(d.e);break;
      case 'temp':{const s=this._st(d.e);if(!s)break;const step=s.attributes.target_temp_step||0.5;const t=Math.round(((s.attributes.temperature||20)+step*Number(d.dir))*10)/10;h.callService('climate','set_temperature',{entity_id:d.e,temperature:t});break;}
      case 'todo':h.callService('todo','update_item',{item:d.uid,status:d.st},{entity_id:this._cfg.todo});break;
      case 'todoclean':h.callService('todo','remove_completed_items',{},{entity_id:this._cfg.todo});break;
      case 'hmack':case 'hmackall':{const E=(this._cfg.homematic||{}).entry_id;if(!E){if(el)el.textContent='entry_id fehlt';break;}const want=d.a==='hmackall'?null:String(d.sn);if(el){el.textContent='…';el.style.pointerEvents='none';}h.callWS({type:'homematicip_local/ccu/get_service_messages',entry_id:E}).then(r=>Promise.all((r.messages||[]).filter(m=>m.quittable!==false&&(!want||String(m.address||'').split(':')[0]===want)).map(m=>h.callWS({type:'homematicip_local/ccu/acknowledge_service_message',entry_id:E,msg_id:String(m.msg_id)}).then(()=>String(m.address||'').split(':')[0])))).then(a=>{this._hmAcked=this._hmAcked||{};const now=Date.now();a.forEach(x=>{this._hmAcked[x]=now;});if(want&&!a.length&&el){el.textContent='nicht quittierbar';return;}this._openPop('homematic');this._render(true);}).catch(e=>{console.warn('Homematic quittieren',e);if(el){el.textContent='Fehler';el.style.pointerEvents='';}});break;}case 'hmreload':{const sn=String(d.sn).toLowerCase();let dev='';const h=this._hass;for(const eid in h.entities){if(eid.includes(sn)){dev=h.entities[eid].device_id;break;}}if(dev&&confirm('Gerät neu laden / erneut anfunken?'))h.callService('homematicip_local','force_device_availability',{device_id:dev});break;}
      case 'openpop':this._openPop(d.p);break;
      case 'ctset':this._setCt(Number(d.k));break;
      case 'popclose':this._closeCt();break;
      case 'autoon':h.callService('input_boolean','turn_on',{entity_id:d.e});this._closeCt();break;
      case 'ptoggle':{if(d.w==='1'&&!confirm('Das Gerät läuft gerade. Wirklich ausschalten?'))break;if(d.c&&!confirm(d.c))break;h.callService('homeassistant','toggle',{entity_id:d.e});break;}
      case 'appstart':{if(!confirm(d.c))break;h.callService('button','press',{entity_id:d.e});break;}
      case 'press':if(d.c&&!confirm(d.c))break;h.callService('button','press',{entity_id:d.e});break;
      case 'radio':{const tg=String(d.e).split(',');const grps=new Set();(this._cfg.music||[]).forEach(m=>{if(typeof m==='string'||!m.play||Array.isArray(m.play)||tg.includes(m.play))return;const g=this._st(m.play);if(!g||['off','unavailable'].includes(g.state))return;const mem=g.attributes.group_members||[];if(mem.some(x=>tg.includes(x)))grps.add(m.play);});
        const go=()=>h.callService('music_assistant','play_media',{entity_id:tg,media_id:d.u,media_type:'radio'});
        if(grps.size){Promise.resolve(h.callService('media_player','turn_off',{entity_id:[...grps]})).then(()=>setTimeout(go,1500),()=>setTimeout(go,1500));}else go();break;}
      case 'batshop':{if(!this._cfg.todo)break;let L=[];try{L=JSON.parse(d.x||'[]');}catch(_){L=[];}const open=new Set((this._todo||[]).filter(t=>t.status==='needs_action').map(t=>String(t.summary).toLowerCase()));const add=L.filter(x=>!open.has(String(x).toLowerCase()));add.forEach(x=>h.callService('todo','add_item',{item:x},{entity_id:this._cfg.todo}));const pp=this.shadowRoot.getElementById('swpop');if(pp){pp.innerHTML=`<div class="panel"><div class="pt">Einkaufsliste</div><div class="pbody" style="text-align:center"><ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size:56px;color:#9ccc65;display:block;margin:14px auto 10px"></ha-icon><div style="font-size:15px;font-weight:600;letter-spacing:.08em">${add.length?(add.length===1?'1 Eintrag hinzugefügt':add.length+' Einträge hinzugefügt'):'Steht schon auf der Liste'}</div><div class="pmut" style="font-style:normal">${L.map(x=>swEsc(x)).join('<br>')}</div></div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;}clearTimeout(this._shopT);this._shopT=setTimeout(()=>{if(this._popKind==null&&pp&&pp.classList.contains('open')&&pp.textContent.indexOf('Einkaufsliste')===0)this._closeCt();},2500);break;}
      case 'alexatxt':{h.callService('alexa_devices','send_text_command',{device_id:d.dev,text_command:d.t});if(el){el.classList.add('on');setTimeout(()=>el.classList.remove('on'),1500);}break;}
      case 'covtoggle':{const s=this._st(d.e);if(!s)break;const svc=s.state==='open'?'close_cover':'open_cover';h.callService('cover',svc,{entity_id:d.e});break;}
      case 'vol':{if(String(d.e).includes(',')){String(d.e).split(',').forEach(x=>this._onClick({composedPath:()=>[{dataset:{a:'vol',e:x,dir:d.dir},closest:()=>null}]}));break;}const s=this._st(d.e);if(!s)break;const dir=Number(d.dir);const step=Number(this._cfg.volume_step)||0.02;this._vol=this._vol||{};const pend=this._vol[d.e];const now=Date.now();
        const base=(pend&&now-pend.t<2500)?pend.v:s.attributes.volume_level;
        if(base==null){h.callService('media_player',dir>0?'volume_up':'volume_down',{entity_id:d.e});break;}
        const v=Math.round(Math.max(0,Math.min(1,base+dir*step))*100)/100;this._vol[d.e]={v,t:now};h.callService('media_player','volume_set',{entity_id:d.e,volume_level:v});
        const row=el.closest('.media');const inf=row&&row.querySelector('.i');if(inf)inf.textContent=inf.textContent.replace(/\d+ %$/,'')+(/\d+ %$/.test(inf.textContent)?'':' · ')+Math.round(v*100)+' %';break;}
      case 'lockopen':{if(this._loLock)break;if(!confirm('Wohnungstür öffnen (Falle zurückziehen)?'))break;this._loLock=true;h.callService('lock','open',{entity_id:d.e});this._render(true);setTimeout(()=>{this._loLock=false;this._render(true);},4000);break;}
      case 'flatopener':{if(this._foLock)break;if(!confirm('Wohnungstür öffnen?'))break;this._foLock=true;h.callService('switch','turn_on',{entity_id:d.e});this._render(true);setTimeout(()=>{h.callService('switch','turn_off',{entity_id:d.e});this._foLock=false;this._render(true);},1000);break;}
      case 'opener':{if(this._opLock||!String(d.e).startsWith('script.'))break;if(!confirm('Haustür öffnen?'))break;this._opLock=true;h.callService('script','turn_on',{entity_id:d.e});this._render(true);setTimeout(()=>{this._opLock=false;this._render(true);},3000);break;}
      case 'lock':{const s=this._st(d.e);if(!s)break;const lk=s.state==='locked';if(confirm(lk?'Wohnungstür entriegeln?':'Wohnungstür verriegeln?'))h.callService('lock',lk?'unlock':'lock',{entity_id:d.e});break;}
      case 'search':{const dom=d.e.split('.')[0];if(['scene','script'].includes(dom)){h.callService(dom,'turn_on',{entity_id:d.e});if(dom==='scene')this._pause(d.e);}else if(['light','switch','input_boolean','fan','cover','automation'].includes(dom))h.callService('homeassistant','toggle',{entity_id:d.e});else this._more(d.e);break;}
      default:if(this._extClick)this._extClick(d,el,h);
    }}
  _tick(){const sr=this.shadowRoot,n=new Date();sr.querySelectorAll('[data-until]').forEach(el=>{const r=Math.max(0,Math.round((Date.parse(el.dataset.until)-Date.now())/1000));const v=Math.floor(r/60)+':'+swPad(r%60);if(el.textContent!==v)el.textContent=v;});const d=sr.getElementById('swdate'),t=sr.getElementById('swtime');
    if(d)d.innerHTML=`<b>${SW_DAYS[n.getDay()]}</b> <span>${swPad(n.getDate())}.${swPad(n.getMonth()+1)}.${String(n.getFullYear()).slice(2)}</span>`;
    if(t)t.textContent=`${swPad(n.getHours())}:${swPad(n.getMinutes())}`;}
  _camUrl(){const s=this._st(this._cfg.camera);return s?`/api/camera_proxy/${this._cfg.camera}?token=${s.attributes.access_token}&t=${Date.now()}`:'';}
  _camRefresh(){if(this._page!=='security')return;const i=this.shadowRoot.getElementById('swcam');if(i)i.src=this._camUrl();}
  _coverLive(){const sr=this.shadowRoot;const rows=sr.querySelectorAll('.covrow');if(!rows.length)return false;let moving=false;rows.forEach(row=>{const id=row.dataset.e;const s=this._st(id);if(!s)return;let pos=s.attributes.current_position;if(pos==null)return;const tg=this._covTarget&&this._covTarget[id];const mv=['opening','closing'].includes(s.state);if(tg){if(tg.held||(mv&&Date.now()-tg.t<60000)){pos=tg.p;}else if(pos===tg.p||Date.now()-tg.t>60000){delete this._covTarget[id];}}const f=row.querySelector('.cfill');if(f&&f.style.width!==pos+'%')f.style.width=pos+'%';const inf=row.querySelector('.i');if(inf){const txt=(s.state==='opening'?'Öffnet':s.state==='closing'?'Schließt':this._tr(s.state))+' · '+pos+' %';if(inf.textContent!==txt)inf.textContent=txt;}const ic=row.querySelector('ha-icon');if(ic){const want='mdi:'+(s.state==='open'?'blinds-open':'blinds');if(ic.getAttribute('icon')!==want)ic.setAttribute('icon',want);}if(mv)moving=true;});return moving;}
  _render(force){if(!this._hass||!this._cfg)return;if(!force&&Date.now()-(this._pd||0)<800){clearTimeout(this._rdT);this._rdT=setTimeout(()=>this._render(),800);return;}this._ensure();const sr=this.shadowRoot;
    if(this._drag&&this._drag.active)return;if(this._cdrag&&this._cdrag.active)return;if(!force&&this._page==='cover'&&this._coverLive())return;if(!force&&sr.activeElement&&['INPUT','SELECT'].includes(sr.activeElement.tagName))return;
    const p=this._page,meta=SW_PAGES.find(x=>x[0]===p);
    const AL=this._alertPages();const nh=SW_PAGES.map(x=>`<button class="${x[0]===p?'active':''} ${AL[x[0]]?'warn':''} ${x[0]==='security'&&this._alarmHot()?'alarm':''}" title="${swEsc(x[2]+(AL[x[0]]?' – '+AL[x[0]].join(' · '):''))}" data-a="nav" data-p="${x[0]}"><ha-icon icon="${x[1]}"></ha-icon></button>`).join('')+this._haCfgBtn()+this._modeBtns();const nv=sr.getElementById('swnav');if(nv._h!==nh){nv.innerHTML=nh;nv._h=nh;}
    sr.getElementById('swhero').classList.toggle('small',p!=='home');
    sr.getElementById('swtitle').textContent=p==='home'?swGreet(this._cfg.name):meta[2];this._renderHero();
    let body='';
    try{body=({home:()=>this._pHome(),light:()=>this._pLight(),plug:()=>this._pPlug(),climate:()=>this._pClimate(),cover:()=>this._pCover(),app:()=>this._pApp(),calendar:()=>this._pCal(),music:()=>(this._cfg.tv&&this._cfg.tv.length?'<div class="label">Musik</div>':'')+this._pMedia(this._cfg.music,false)+(this._cfg.tv&&this._cfg.tv.length?'<div class="sect"><div class="label">Fernseher</div>'+this._pMedia(this._cfg.tv,true)+'</div>':''),tv:()=>this._pTv(),security:()=>this._pSec(),todo:()=>this._pTodo(),search:()=>this._pSearch(),server:()=>this._pApp(this._cfg.servers,'Keine Server konfiguriert'),settings:()=>this._pSettings()})[p]();}catch(e){body=`<div class="muted">Fehler: ${swEsc(e.message)}</div>`;}
    const ct=sr.getElementById('swcontent');const sc=ct.scrollTop;ct.innerHTML=body;this._placeAlerts(ct,p);ct.scrollTop=sc;
    if(String(this._popKind||'').startsWith('vac:')&&this._vacPop)this._vacPop();
    this._tick();}
  _evTime(e){const s=swStart(e),now=new Date();const today=swDay0(now).getTime()===swDay0(s).getTime();
    if(e.start.date)return today?'HEUTE':`${swPad(s.getDate())}.${swPad(s.getMonth()+1)}.`;
    return today?`${swPad(s.getHours())}:${swPad(s.getMinutes())}`:`${swPad(s.getDate())}.${swPad(s.getMonth()+1)}.`;}
  _pHome(){const c=this._cfg,now=new Date();
    const up=this._events.filter(e=>swEnd(e)>now).slice(0,2);
    const evs=up.length?up.map(e=>`<div class="ev" data-a="nav" data-p="calendar"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon><div class="t">${this._evTime(e)}</div><div style="min-width:0"><div class="s">${swEsc(e.summary)}</div><div class="d">${swEsc(e.location||this._nm(e.cal))}</div></div></div>`).join(''):`<div class="ev"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon><div class="d" style="padding-top:3px">Keine Termine</div></div>`;
    const w=this._st(c.weather);let wh='';
    if(w){const today=swDay0(now).getTime();const fc=this._forecast.filter(f=>swDay0(new Date(f.datetime)).getTime()>today).slice(0,4);
      wh=`<div class="weather"><div class="now" data-a="more" data-e="${c.weather}"><ha-icon icon="mdi:${SW_WI[w.state]||'weather-cloudy'}"></ha-icon><div class="tmp">${w.attributes.temperature!=null?Math.round(w.attributes.temperature)+'°':''}</div></div><div class="vsep"></div><div class="days">${fc.map(f=>{const d=new Date(f.datetime);const t=Math.round(f.temperature);return `<div class="day"><div class="n">${SW_DAYS[d.getDay()]}</div><ha-icon icon="mdi:${SW_WI[f.condition]||'weather-cloudy'}"></ha-icon><div class="v">${t>0?'+':''}${t}°</div></div>`;}).join('')}</div></div>`;}
    const eh=this._energyHtml();const top=`<div class="top${eh?' e4':''}"><div>${evs}</div>${eh?'<div class="tsep"></div>':''}${wh||'<div></div>'}${eh?'<div class="tsep"></div>'+eh+'<div class="tsep"></div>':''}<div class="clock"><div class="date" id="swdate"></div><div class="time" id="swtime"></div></div></div>`;
    let num='–',unit='',sub='KEINE TERMINE',sm=false;
    const nx=this._events.find(e=>e.cal===c.countdown_calendar&&swEnd(e)>now);
    if(nx){const s=swStart(nx);sub='BIS '+String(nx.summary||'').toUpperCase();
      if(nx.start.date){const d=Math.round((swDay0(s)-swDay0(now))/864e5);if(d<=0){num='HEUTE';sm=true;unit='';sub=String(nx.summary||'').toUpperCase();}else{num=String(d);unit=d===1?'TAG':'TAGE';}}
      else{const m=Math.round((s-now)/60000);if(m<=0){num='JETZT';sm=true;sub=String(nx.summary||'').toUpperCase();}else if(m<60){num=String(m);unit='MIN';}else if(m<2880){num=String(Math.round(m/60));unit='STD';}else{num=String(Math.round(m/1440));unit='TAGE';}}}
    const ring=`<div class="ring" data-a="nav" data-p="calendar"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="#fff" stroke-width="1.6"/></svg><div class="in"><div class="num ${sm?'sm':''}">${swEsc(num)}</div><div class="u">${unit}</div><div class="w">${swEsc(sub)}</div></div></div>`;
    const _hg=(c.music||[]).find(e=>typeof e!=='string'&&e.home_group&&(()=>{const s=this._st(this._mpick(e));return s&&s.state==='playing';})());
    const ms=_hg?[this._mpick(_hg)]:[...c.music.filter(e=>!(typeof e!=='string'&&e.home===false)).map(e=>this._mpick(e)),...c.tv].filter(i=>{const s=this._st(i);return s&&s.state==='playing';}).slice(0,2);
    const media=ms.length?`<div class="bmedia"><div class="label">Läuft gerade</div>${ms.map(i=>{const s=this._st(i),a=s.attributes;const pic=a.entity_picture?`<img src="${swEsc(a.entity_picture)}">`:`<div class="ph"><ha-icon icon="mdi:music"></ha-icon></div>`;return `<div class="mrow" data-a="svc" data-d="media_player" data-s="media_play_pause" data-e="${i}">${pic}<div class="txt"><div class="h">${swEsc(a.media_title||a.friendly_name)}</div><div class="i">${swEsc([a.media_artist||a.media_album_name||a.app_name,this._mname(i)].filter(Boolean).join(' · '))}</div></div></div>`;}).join('')}</div>`:'<div></div>';
    const lids=this._lights().filter(i=>{const s=this._st(i);return s&&!Array.isArray(s.attributes.entity_id)&&s.state!=='unavailable';});
    const on=lids.filter(i=>this._st(i).state==='on');const rooms=new Set(on.map(i=>this._roomOf(i)||this._area(i)||'?'));
    const bubble=on.length?`<div><div class="label">Lichter</div><div class="bubble" data-a="nav" data-p="light"><div class="num">${on.length}</div><div class="u">EINGESCHALTET</div><div class="s">${rooms.size} ${rooms.size===1?'RAUM':'RÄUME'}</div></div></div>`:'';
    const open=this._todo.filter(t=>t.status==='needs_action'),done=this._todo.filter(t=>t.status==='completed');
    const todo=`<div><div class="label">Einkaufsliste</div><div class="tbox"><div class="hd" data-a="nav" data-p="todo" style="cursor:pointer">Offen</div>${open.length?open.slice(0,3).map(t=>`<div class="it" data-a="todo" data-uid="${swEsc(t.uid)}" data-st="completed">${swEsc(t.summary)}</div>`).join(''):'<div class="it">Alles erledigt</div>'}<div class="hd" data-a="nav" data-p="todo" style="cursor:pointer">Erledigt · ${done.length}</div></div></div>`;
    return `${top}<hr class="line"><div class="bottom"><div class="bl">${ring}</div><div class="bmid">${media}${bubble}${this._homeBubbles()}</div><div class="br">${todo}</div></div>`;}
  _bub(num,unit,sub,color,nav,more){const c=color?` style="border-color:${color}"`:'';const cl=color?` style="color:${color}"`:'';let act;if(nav&&nav.indexOf('pop:')===0)act=`data-a="openpop" data-p="${nav.slice(4)}"`;else act=more?`data-a="more" data-e="${more}"`:`data-a="nav" data-p="${nav}"`;return `<div><div class="label">${swEsc(sub.cap||'')}</div><div class="bubble"${c} ${act}><div class="num"${cl}>${swEsc(num)}</div><div class="u">${swEsc(unit)}</div><div class="s">${swEsc(sub.txt||'')}</div></div></div>`;}
  _energyHtml(){const E=this._cfg.energy;if(!E)return '';const n=id=>{const s=this._st(id);if(!s)return null;const v=parseFloat(s.state);return isNaN(v)?null:v;};
    const f=(v,d,u)=>v==null?'':v.toFixed(d).replace('.',',')+' '+u;const fW=v=>v==null?'–':(Math.abs(v)>=1000?f(v/1000,1,'kW'):Math.round(v)+' W');
    const sol=n(E.solar),bat=n(E.battery);const bi=bat==null?'battery-unknown':bat>=95?'battery':bat<5?'battery-outline':'battery-'+Math.round(bat/10)*10;
    const col=(lab,ic,val,on,k,e,ec)=>{const d=[f(n(k),1,'kWh'),e&&n(e)!=null?`<span${ec?` style="color:${ec}"`:''}>${f(n(e),2,'€')}</span>`:''].filter(Boolean).join('<br>');return `<div class="day"><div class="n">${lab}</div><ha-icon icon="mdi:${ic}"${on?' style="color:#ffd54f"':''}></ha-icon><div class="v">${val}</div>${d?`<div class="dd">${d}</div>`:''}</div>`;};
    const cols=[E.solar?col('SOLAR','solar-power-variant',fW(sol),sol>0,E.today_solar):'',E.house?col('HAUS','home-lightning-bolt-outline',fW(n(E.house)),0,E.today_house):'',E.battery?col('AKKU',bi,bat==null?'–':Math.round(bat)+' %',0,E.today_feed,E.today_save,'#9ccc65'):'',E.grid?col('BEZUG','transmission-tower',fW(n(E.grid)),0,E.today_grid,E.today_grid_cost):''].join('');
    return `<div class="energy" data-a="hanav" data-u="${swEsc(E.path||'/energy')}"><div class="days">${cols}</div></div>`;}
  _pSettings(){const c=this._cfg,S=c.settings||{};let h=this._pAlarmWin();
    const H=S.heating;if(H&&(H.climates||[]).length){const st=H.climates.map(id=>{const x=this._st(id);return x?x.state:'unavailable';});const off=st.filter(x=>x==='off').length,au=st.filter(x=>x==='auto').length;const mode=off===st.length?'sommer':au===st.length?'winter':'mix';
      const txt=mode==='sommer'?'Sommer – alle Heizgruppen aus':mode==='winter'?'Winter – alle Heizgruppen Auto':`Gemischt – ${au}× Auto, ${off}× Aus, ${st.length-au-off}× Manuell`;
      const [dd,ss]=String(H.script||'script.heizung_modus_setzen').split('.');
      const b=(m,ic,lab,val,conf)=>`<div class="tile ${mode===m?'on':''}" data-a="svc" data-d="${dd}" data-s="${ss}" data-x="${swEsc(JSON.stringify({modus:val}))}" data-c="${swEsc(conf)}"><ha-icon icon="mdi:${ic}"></ha-icon><div style="min-width:0"><div class="n">${lab}</div><div class="st">${mode===m?'Aktiv':''}</div></div></div>`;
      h+=`<div class="sect"><div class="label">Heizbetrieb</div><div class="muted" style="margin-bottom:10px">${swEsc(txt)}</div><div class="grid">${b('sommer','weather-sunny','Sommer','off','Auf Sommerbetrieb umschalten? Alle Heizgruppen werden ausgeschaltet.')}${b('winter','snowflake','Winter','auto','Auf Winterbetrieb umschalten? Alle Heizgruppen werden auf Automatik gestellt.')}</div></div>`;}
    const bg=this._st(S.background||c.background_entity);if(bg){const opts=bg.attributes.options||[];const lab=o=>o==='Automatik'?'Automatik':/^h\d+$/.test(o)?o.toUpperCase():o;
      h+=`<div class="sect"><div class="label">Hintergrund</div><div class="grid">${opts.map(o=>`<div class="tile ${bg.state===o?'on':''}" data-a="svc" data-d="input_select" data-s="select_option" data-e="${bg.entity_id}" data-x="${swEsc(JSON.stringify({option:o}))}"><ha-icon icon="mdi:${o==='Automatik'?'autorenew':o==='Räume'?'floor-plan':/^h\d+$/.test(o)?'image-outline':'calendar-star'}"></ha-icon><div style="min-width:0"><div class="n">${swEsc(lab(o))}</div><div class="st">${bg.state===o?'Aktiv':''}</div></div></div>`).join('')}</div></div>`;}
    const V=S.vacuum;const vs=V&&this._st(V.entity);if(vs){const def=V.defaults||{};let cur={};try{cur=JSON.parse(vs.state);}catch(_){cur={};}const ev=V.events||[];
      h+=`<div class="sect"><div class="label">Sauger-Meldungen</div><div class="muted" style="margin-bottom:8px">Mobil = Nachricht aufs Handy · HA = Glocke in Home Assistant · Aus = keine Meldung</div>${ev.map(e=>{const v=cur[e.k]||def[e.k]||'HA';return `<div class="li"><ha-icon icon="mdi:${e.icon||'robot-vacuum'}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${swEsc(e.l)}</div></div>${['Mobil','HA','Aus'].map(o=>`<button class="tbtn ${v===o?'sel':''}" data-a="vacmsg" data-k="${swEsc(e.k)}" data-v="${o}">${o}</button>`).join('')}</div>`;}).join('')}</div>`;}
    const TE=(S.tea||[]).map(id=>this._st(id)).filter(Boolean);if(TE.length){h+=`<div class="sect"><div class="label">Tee-Ziehzeit</div><div class="muted" style="margin-bottom:8px">Startet automatisch, wenn die Kaffeemaschine Heißwasser fertig hat</div>${TE.map(t=>{const nm=String(t.attributes.friendly_name||t.entity_id).replace(/^Tee Ziehzeit\s*/,'');const v=parseFloat(t.state);return `<div class="li"><ha-icon icon="${t.attributes.icon||'mdi:tea'}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${swEsc(nm)}</div><div class="i">${isNaN(v)?'–':String(v).replace('.',',')+' min'}</div></div><button class="btn" data-a="svc" data-d="input_number" data-s="decrement" data-e="${t.entity_id}"><ha-icon icon="mdi:minus"></ha-icon></button><button class="btn" data-a="svc" data-d="input_number" data-s="increment" data-e="${t.entity_id}"><ha-icon icon="mdi:plus"></ha-icon></button></div>`;}).join('')}</div>`;}
    return h||'<div class="muted">Keine Einstellungen konfiguriert</div>';}
  _devType(model){const m=String(model||'');const T=[[/HM-TC-IT|HmIP-WTH|HmIP-BWTH|HmIP-STH|HmIP-WT/i,'Wandthermostat','heat','wall'],[/HM-CC-RT|HmIP-eTRV|HmIP-HEATING|HM-CC-VD/i,'Heizkörperthermostat','heat','valve'],[/HmIP-FAL|HmIP-WGC/i,'Fußbodenheizung','heat','wall'],[/HmIP-SWDO|HmIP-SWDM|HmIP-SRH|HM-Sec-SC|HM-Sec-RHS/i,'Fensterkontakt','other',''],[/HmIP-SWSD|HM-Sec-SD/i,'Rauchmelder','other',''],[/HmIP-SWD\b|HmIP-SWD[^O]/i,'Wassermelder','other',''],[/HmIP-SPI|HmIP-SMI|HM-Sen-MDIR/i,'Bewegungsmelder','other',''],[/HmIP-WRC|HmIP-BRC|HM-PB|HmIP-RC|HM-RC|HmIP-KRC/i,'Taster','other',''],[/HM-Sec-Key|HmIP-DLD/i,'Türschloss','other',''],[/HM-Sen-DB/i,'Klingel','other','']];for(const t of T)if(t[0].test(m))return {t:t[1],kind:t[2],sub:t[3]};return {t:'',kind:'other',sub:''};}
  _lowBatteries(th){const h=this._hass;if(!h)return [];const lim=typeof th==='number'?th:10;const byDev={};for(const e of Object.values(h.states)){if(e.state==='unavailable'||e.state==='unknown')continue;const id=e.entity_id.toLowerCase();if(id.includes('techniksaft')||id.includes('solar'))continue;const u=e.attributes.unit_of_measurement||'';if(u==='V'||e.attributes.device_class==='voltage'||(id.includes('betriebsspannung')&&!id.includes('pegel')))continue;let low=false;if(e.attributes.device_class==='battery'||id.includes('batteriezustand')||id.includes('betriebsspannungspegel')){if(id.startsWith('binary_sensor.'))low=e.state==='on';else{const v=parseFloat(String(e.state).replace(',','.'));low=!isNaN(v)&&v<=lim;}}else if(id.startsWith('binary_sensor.')&&(id.includes('_batterie')||id.includes('_battery')))low=e.state==='on';if(!low)continue;
      const re=(h.entities||{})[e.entity_id]||{};const dev=re.device_id&&h.devices?h.devices[re.device_id]:null;const key=re.device_id||e.entity_id;const ty=this._devType(dev&&dev.model);const aid=re.area_id||(dev&&dev.area_id);const room=aid&&h.areas&&h.areas[aid]?h.areas[aid].name:'';
      const label=ty.t?(ty.t+(room?' '+room:'')):((dev&&(dev.name_by_user||dev.name))||String(e.attributes.friendly_name||e.entity_id).replace(/\s*(Batterie(zustand)?|Battery|Betriebsspannungspegel)\s*$/i,''));
      const it={n:label,v:e.state,u,id:e.entity_id,dev:key,kind:ty.kind,sub:ty.sub,room,model:(dev&&dev.model)||''};const pv=byDev[key];if(!pv||(pv.id.startsWith('binary_sensor.')&&!id.startsWith('binary_sensor.')))byDev[key]=it;}
    const out=Object.values(byDev);const cnt={};out.forEach(x=>{cnt[x.n]=(cnt[x.n]||0)+1;});const seen={};out.forEach(x=>{if(cnt[x.n]>1){seen[x.n]=(seen[x.n]||0)+1;x.n+=' '+seen[x.n];}});return out.sort((a,b)=>a.n.localeCompare(b.n,'de'));}
  _batIco(id,warn){const b=id&&this._st(id);if(!b)return '';const v=parseFloat(b.state);if(isNaN(v))return `<ha-icon class="bt" icon="mdi:battery-unknown" title="Akku: unbekannt"></ha-icon>`;const low=v<(warn!=null?warn:15);const lv=Math.max(10,Math.min(100,Math.round(v/10)*10));
    return `<ha-icon class="bt${low?' low':''}" icon="mdi:${low?'battery-alert-variant-outline':(lv===100?'battery':'battery-'+lv)}" title="Akku ${Math.round(v)} %"></ha-icon>`;}
  _batTile(a){const low=this._lowBatteries(a.batteries);const nm=x=>x.n;const val=x=>x.id.startsWith('binary_sensor.')?'leer':(Math.round(parseFloat(x.v))+(x.u?' '+x.u:''));
    return `<div class="app" ${low.length?'style="box-shadow:inset 3px 0 0 #FF9800"':''}><div class="ah"><ha-icon icon="${a.icon||(low.length?'mdi:battery-alert-variant-outline':'mdi:battery-check-outline')}"${low.length?' style="color:#FF9800"':''}></ha-icon><div style="min-width:0"><div class="an">${swEsc(a.name||'Batterien')}</div><div class="as">${low.length?low.length+(low.length===1?' Batterie schwach':' Batterien schwach'):'Alle Batterien OK'}</div></div><div class="aw">${low.length||''}</div></div>${low.length?`<div class="chips">${low.map(x=>`<span class="ci warn" data-a="openpop" data-p="bat" style="cursor:pointer">${swEsc(nm(x))}: <b>${swEsc(val(x))}</b></span>`).join('')}</div>`:''}</div>`;}
  _alertPages(){const A=this._cfg.nav_alerts;if(!A)return {};const out={};const S=id=>{const x=this._st(id);return x?x.state:undefined;};const dead=id=>{const v=S(id);return v===undefined||v==='unavailable'||v==='unknown';};
    const HM=this._hmMessages();const hmP=m=>Object.values(A).some(rs=>(rs||[]).some(r=>Array.isArray(r.hm)&&r.hm.some(p=>String(m.txt).startsWith(p))));const hmW=m=>(m.room?m.room+': ':'')+String(m.txt).replace(/^\S+\s+[A-Z0-9]+(:\d+)?:?\s*/,'');
    const IT={};this._alertIt=IT;for(const pg of Object.keys(A)){const why=[];const it=IT[pg]=[];const P=(t,ids,bat)=>{why.push(t);it.push({t,ids:[].concat(ids||[]),bat:!!bat});};(A[pg]||[]).forEach(r=>{const nm=id=>{const x=this._st(id);return r.label||(x&&x.attributes.friendly_name)||id;};
      (r.dead||[]).forEach(id=>{if(dead(id))P(nm(id)+': nicht erreichbar',id);});
      (r.unavailable||[]).forEach(id=>{const v=S(id);if(v===undefined||v==='unavailable')P(nm(id)+': nicht erreichbar',id);});
      if(Array.isArray(r.hm))HM.filter(m=>r.hm.some(p=>String(m.txt).startsWith(p))).forEach(m=>P((r.label?r.label+' – ':'')+hmW(m)));
      if(r.hm_rest)HM.filter(m=>!hmP(m)).forEach(m=>P((r.label?r.label+' – ':'')+hmW(m)));
      const old=id=>{if(!r.for_h)return true;const x=this._st(id);return !!x&&(Date.now()-new Date(x.last_changed).getTime())>=r.for_h*3600000;};
      (r.on||[]).forEach(id=>{if(S(id)==='on'&&old(id))P(nm(id),id);});
      (r.off||[]).forEach(id=>{if(S(id)==='off')P(nm(id)+': aus',id);});
      if(r.e){const v=S(r.e);const ok=v!==undefined&&!['unavailable','unknown'].includes(v);
        if(ok&&r.states&&r.states.includes(v))P(nm(r.e)+': '+v,r.e);
        if(ok&&r.not_states&&!r.not_states.includes(v))P(nm(r.e)+': '+v,r.e);
        const n=parseFloat(v);if(ok&&!isNaN(n)&&((r.above!=null&&n>r.above)||(r.below!=null&&n<r.below)))P(nm(r.e)+': '+v,r.e);}
      if(r.battery){const b=this._lowBatteries(r.battery).filter(x=>(!r.battery_only||r.battery_only.includes(x.kind))&&!(r.battery_skip||[]).includes(x.kind));if(b.length)P('Batterie schwach: '+b.slice(0,4).map(x=>x.n).join(', ')+(b.length>4?' …':''),b.map(x=>x.id),true);}});
      if(why.length)out[pg]=why;}return out;}
  _ents(o){const h=this._hass;return swEsc([...new Set((JSON.stringify(o).match(/[a-z_]+\.[a-z0-9_]+/g)||[]).filter(x=>h&&h.states[x]))].join(' '));}
  _placeAlerts(ct,p){const I=(this._alertIt||{})[p]||[];if(!I.length)return;const h=this._hass;const dv=id=>{const r=h&&h.entities&&h.entities[id];return r&&r.device_id;};
    const C=[...ct.querySelectorAll('.app,.cl,.tile,.li')].map(el=>{const s=new Set((el.dataset.ents||'').split(' ').filter(Boolean));if(el.dataset.e)s.add(el.dataset.e);el.querySelectorAll('[data-e],[data-hold]').forEach(x=>{if(x.dataset.e)s.add(x.dataset.e);if(x.dataset.hold)s.add(x.dataset.hold);});const d=new Set([...s].map(dv).filter(Boolean));return {el,s,d};});
    const hasBat=!!ct.querySelector('[data-p="bat"],.clbat');const rest=[];const put=new Map();
    I.forEach(x=>{if(x.bat&&hasBat)return;let t=null;for(const id of x.ids){t=C.find(c=>c.s.has(id));if(t)break;}if(!t)for(const id of x.ids){const d=dv(id);t=d&&C.find(c=>c.d.has(d));if(t)break;}if(!t){rest.push(x.t);return;}(put.get(t.el)||put.set(t.el,[]).get(t.el)).push(x.t);});
    put.forEach((ts,el)=>{el.classList.add('awx');el.setAttribute('title',ts.join(' · '));if(el.matches('.app,.cl')){const d=document.createElement('div');d.className='chips awc';d.innerHTML=ts.map(t=>`<span class="ci warn">${swEsc(t)}</span>`).join('');el.appendChild(d);}else{const st=el.querySelector('.st,.i');if(st)st.textContent=ts[0];}});
    if(rest.length){const d=document.createElement('div');d.className='awarn';d.innerHTML=rest.map(t=>`<span class="ci warn">${swEsc(t)}</span>`).join('');ct.insertBefore(d,ct.firstChild);}}
  _haCfgBtn(){const c=this._cfg;if(c.ha_settings===false)return '';const u=this._hass&&this._hass.user;if(u&&u.is_admin===false)return '';const path=typeof c.ha_settings==='string'?c.ha_settings:'/config/dashboard';
    return `<button class="hacfg" title="Home Assistant – Einstellungen" data-a="hanav" data-u="${swEsc(path)}"><ha-icon icon="mdi:home-assistant"></ha-icon></button>`;}
  _modeBtns(){const M=this._cfg.modes;if(!M||!(M.items||[]).length)return '';const cs=M.status&&this._st(M.status);const cur=cs?cs.state:null;
    return '<div class="navsep"></div>'+M.items.map(m=>{const sc=this._st(m.script);const run=sc&&sc.state==='on';return `<button class="mode ${cur===m.key?'active':''} ${run?'run':''}" title="${swEsc(m.name||m.key)} – gedrückt halten" data-a="holdhint" data-hold="${m.script}"><ha-icon icon="${m.icon||(sc&&sc.attributes.icon)||'mdi:play'}"></ha-icon><span class="hl"></span></button>`;}).join('');}
  _homeBubbles(){const c=this._cfg;const test=c.alerts_test;let out='';
    const tt=c.tea&&this._st(c.tea);if(tt&&['active','paused'].includes(tt.state)){const fa=tt.state==='active'?tt.attributes.finishes_at:null;const pr=s=>{const m=String(s||'0:0:0').split(':').map(Number);return (m[0]||0)*3600+(m[1]||0)*60+(m[2]||0);};const r=fa?Math.max(0,Math.round((Date.parse(fa)-Date.now())/1000)):pr(tt.attributes.remaining);const txt=Math.floor(r/60)+':'+swPad(r%60);
      out+=`<div><div class="label">Tee</div><div class="bubble" style="border-color:#9ccc65" data-a="svc" data-d="timer" data-s="cancel" data-e="${c.tea}" data-c="Tee-Timer abbrechen?"><div class="num" style="color:#9ccc65"${fa?` data-until="${swEsc(fa)}"`:''}>${txt}</div><div class="u">${fa?'ZIEHT':'PAUSIERT'}</div><div class="s">TIPPEN = ABBRECHEN</div></div></div>`;}
    if(c.windows){const list=this._grp(c.windows).flatMap(g=>(g.entities||[]).map(e=>this._eid(e)));const openW=list.filter(i=>{const s=this._st(i);return s&&s.state==='on';});if(openW.length){const rooms=new Set(openW.map(i=>this._area(i)||'?'));out+=this._bub(openW.length,'OFFEN',{cap:'Fenster',txt:[...rooms].join(', ').toUpperCase()},'#ff8a50','cover');}}
    if(c.pollen){const pol=this._pollenActive();if(pol.length||test){const top=pol.slice().sort((a,b)=>b.val-a.val)[0];out+=this._bub(pol.length||'0',pol.length===1?'ART':'ARTEN',{cap:'Pollen',txt:top?top.name.toUpperCase():'KEINE'},pol.length?this._pollenColor(top.val):null,'pop:pollen');}}
    if(c.traffic){const tr=this._trafficItems();const n=tr.length;if(n>0||test){const closure=tr.some(i=>i.__kind==='closure');out+=this._bub(n,n===1?'MELDUNG':'MELDUNGEN',{cap:'Verkehr A73',txt:closure?'SPERRUNG':n?'WARNUNG':'FREI'},n?(closure?'#F44336':'#FF9800'):null,'pop:traffic');}}
    if(c.homematic){const hm=this._hmCount();if(hm>0||test){out+=this._bub(hm,hm===1?'MELDUNG':'MELDUNGEN',{cap:'Homematic',txt:hm?'PRÜFEN':'OK'},hm?'#FF9800':null,'pop:homematic');}}
    return out;}
  _trafficItems(){if(this._cfg.traffic&&this._cfg.traffic.simulate)return [{__kind:'warning',title:'A73 Forchheim Nord → Forchheim Süd',subtitle:'Baustelle, einspurig',description:['Bauarbeiten zwischen Forchheim Nord und Forchheim Süd','Fahrbahnverengung auf einen Fahrstreifen','voraussichtlich bis 18:00 Uhr']},{__kind:'closure',title:'A73 Anschlussstelle Forchheim Süd',subtitle:'Auffahrt gesperrt',description:['Auffahrt Richtung Nürnberg gesperrt','Umleitung über Forchheim Nord']}];return (this._traffic&&this._traffic.items)||[];}
  _hmRoom(txt){const h=this._hass;if(!h||!h.entities)return '';const m=String(txt).match(/\b([A-Z]{3}[0-9]{7})\b/);if(!m)return '';const sn=m[1].toLowerCase();for(const eid in h.entities){if(eid.includes(sn)){const a=this._area(eid);if(a)return a;}}return '';}
  _hmMessages(){const c=this._cfg.homematic;if(!c)return [];if(c.simulate)return [{icon:'🔧',kind:'Service',room:'Wohnzimmer',txt:'HM-TC-IT: Batterie niedrig'},{icon:'⚠️',kind:'Alarm',room:'Küche',txt:'Fensterkontakt: Sabotage erkannt'}];const out=[];[['service','🔧','Service'],['alarm','⚠️','Alarm']].forEach(([k,ic,lbl])=>{const s=this._st(c[k]);if(!s)return;const a=s.attributes;for(let i=1;i<=20;i++){const txt=a['message_'+i]||a[k+'_'+i];if(txt){const mm=String(txt).match(/\b([A-Z]{3}[0-9]{7})\b/);if(mm&&this._hmAcked&&Date.now()-(this._hmAcked[mm[1]]||0)<600000)continue;out.push({icon:ic,kind:lbl,room:this._hmRoom(txt),reload:(lbl==='Service'&&/erreichbar/i.test(txt)&&mm&&!/dauerhaft/i.test(txt))?mm[1]:'',ack:(lbl==='Service'&&mm&&c.entry_id)?{sn:mm[1]}:null,txt});}}});return out;}
  _openPop(kind){const p=this.shadowRoot.getElementById('swpop');if(!p)return;this._popKind=null;if(String(kind).startsWith('vac:')&&this._vacPop){this._popKind=kind;this._vacRooms=new Set();this._vacRep=1;this._vacPop(true);return;}let title='',body='';
    if(kind==='pollen'){title='Pollenflug';const all=(this._cfg.pollen.sensors||[]).map((e,i)=>{const s=this._st(e);const v=s?parseFloat(s.state):0;return {name:(this._cfg.pollen.labels||[])[i]||e,val:isNaN(v)?0:v};});let act=all.filter(x=>x.val>0).sort((a,b)=>b.val-a.val);if(this._cfg.pollen.simulate)act=this._pollenActive();const lvl=v=>['keine','gering','gering-mittel','mittel','mittel-stark','stark','sehr stark'][Math.round(v*2)]||'-';
      body=act.length?act.map(x=>`<div class="prow"><span>${swEsc(x.name)}</span><span style="color:${this._pollenColor(x.val)}">${lvl(x.val)}</span></div>`).join(''):'<div class="muted">Aktuell keine Pollenbelastung.</div>';
      body+='<div class="pmut">Quelle: DWD, Region Franken</div>';}
    else if(kind==='bat'){title='Batterien wechseln';const tile=(this._cfg.appliances||[]).find(a=>a.batteries!=null);const low=this._lowBatteries(tile?tile.batteries:10);const bt=Object.assign({},SW_BAT,this._cfg.battery_types||{});const need={};
      body=low.length?low.map(x=>{const t=bt[x.model]||'';if(t&&/^\d/.test(t)){const m=t.match(/^(\d+)× (.+?)(\s+–.*)?$/);if(m){need[m[2]]=(need[m[2]]||0)+Number(m[1]);}}const val=x.id.startsWith('binary_sensor.')?'leer':(Math.round(parseFloat(x.v))+(x.u?' '+x.u:''));return `<div class="prow"><span>${swEsc(x.n)}<br><small style="opacity:.6">${swEsc(x.model||'Modell unbekannt')} · ${swEsc(val)}</small></span><span>${swEsc(t||'Typ unbekannt')}</span></div>`;}).join('')+(Object.keys(need).length?`<div class="pmut" style="font-style:normal;opacity:.9">Einkaufen: ${Object.entries(need).map(([k,v])=>v+'× '+swEsc(k)).join(' · ')}</div>${this._cfg.todo?`<button class="hackall" data-a="batshop" data-x="${swEsc(JSON.stringify(Object.entries(need).map(([k,v])=>'Batterien '+k+' ×'+v)))}">AUF DIE EINKAUFSLISTE</button>`:''}`:''):'<div class="muted">Alle Batterien OK.</div>';}
    else if(kind==='traffic'){title='Verkehr A73';const items=this._trafficItems();body=items.length?items.map(i=>{const d=(i.description||[]).map(x=>swEsc(x)).join('<br>');return `<div class="trow ${i.__kind}"><div class="tt">${i.__kind==='closure'?'🚫':'⚠️'} ${swEsc(i.title||'')}</div>${i.subtitle?`<div class="ts">${swEsc(i.subtitle)}</div>`:''}${d?`<div class="td">${d}</div>`:''}</div>`;}).join(''):'<div class="muted">Keine Meldungen auf der A73 im Umkreis.</div>';}
    else if(kind==='homematic'){title='Homematic-Meldungen';const msgs=this._hmMessages();body=msgs.length?msgs.map((m,idx)=>`<div class="hrow"><div class="hi">${m.icon}</div><div class="hx"><div class="hk">${swEsc(m.kind)}${m.room?' · '+swEsc(m.room):''}</div><div class="ht">${swEsc(m.txt)}</div></div>${m.reload?`<button class="hack" data-a="hmreload" data-sn="${swEsc(m.reload)}">Neu laden</button>`:''}${m.ack?`<button class="hack" data-a="hmack" data-sn="${swEsc(m.ack.sn)}">Bestätigen</button>`:''}</div>`).join('')+(msgs.filter(m=>m.ack).length>1?'<div style="text-align:right;margin-top:10px"><button class="hack" data-a="hmackall">Alle bestätigen</button></div>':'')+'<div class="pmut">„Bestätigen“ quittiert die Meldung direkt in der CCU. Nicht quittierbare Meldungen verschwinden automatisch, sobald das Gerät wieder erreichbar ist (z. B. nach Batteriewechsel).</div>':'<div class="muted">Keine offenen Meldungen.</div>';}
    p.innerHTML=`<div class="panel"><div class="pt">${swEsc(title)}</div><div class="pbody">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;p.classList.add('open');}
  _alertIds(){const c=this._cfg;let ids=c.tea?[c.tea]:[];if(c.pollen)ids=ids.concat(c.pollen.sensors||[]);if(c.homematic)ids=ids.concat([c.homematic.service,c.homematic.alarm]);return ids.filter(Boolean);}
  _pollenActive(){const p=this._cfg.pollen;if(!p)return [];return (p.sensors||[]).map((e,i)=>{const s=this._st(e);const v=s?parseFloat(s.state):0;return (!isNaN(v)&&v>0)?{name:(p.labels||[])[i]||e,val:v}:null;}).filter(Boolean);}
  _pollenColor(v){if(v<=0.5)return '#FFE55A';if(v<=1)return '#FFC84E';if(v<=1.5)return '#FFA53F';if(v<=2)return '#FF6E33';if(v<=2.5)return '#FF6140';return '#FF001C';}
  _hmCount(){const c=this._cfg.homematic;if(!c)return 0;const sv=this._st(c.service),al=this._st(c.alarm);return (sv?parseInt(sv.state)||0:0)+(al?parseInt(al.state)||0:0);}
  _loadTraffic(){const c=this._cfg.traffic;if(!c)return;const now=Date.now();if(this._traffic&&now-this._traffic.t<300000)return;if(this._trafficBusy)return;this._trafficBusy=true;this._traffic=this._traffic||{t:0,items:null};this._traffic.t=now;
    const roads=c.roads||['A73'];const LAT=c.lat||49.7187,LON=c.lon||11.0617,R=c.radius||10;
    const jobs=[];roads.forEach(r=>['warning','closure'].forEach(s=>jobs.push(fetch('https://verkehr.autobahn.de/o/autobahn/'+r+'/services/'+s).then(x=>x.json()).then(j=>(j[s]||[]).map(i=>{i.__kind=s;return i;})).catch(()=>[]))));
    Promise.all(jobs).then(res=>{const all=[].concat.apply([],res);const km=(a,b,cc,d)=>{const pr=Math.PI/180,dl=(cc-a)*pr,dn=(d-b)*pr;const h=Math.sin(dl/2)**2+Math.cos(a*pr)*Math.cos(cc*pr)*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(h));};const near=i=>{const pts=[];if(i.coordinate)pts.push([+i.coordinate.lat,+i.coordinate.long]);const txt=[i.title,i.subtitle].concat(i.description||[]).join(' ');return /Forchheim/i.test(txt)||pts.some(p=>km(LAT,LON,p[0],p[1])<=R);};const items=all.filter(i=>!i.future&&near(i));this._traffic={t:now,items};this._trafficBusy=false;this._render(true);}).catch(()=>{this._trafficBusy=false;});}
  _pWindows(){const W=this._cfg.windows||[];if(!W.length||!this._cfg.windows_on_light)return '';return this._grp(W).map(g=>{const ents=(g.entities||[]).filter(e=>this._st(this._eid(e)));if(!ents.length)return '';return `<div class="sect"><div class="label">Fenster${g.room?' · '+swEsc(g.room):''}</div><div class="grid">${ents.map(e=>{const id=this._eid(e);const nm=typeof e==='string'?null:e.name;const s=this._st(id);const open=s.state==='on';return `<div class="tile ${open?'on':''}" data-a="more" data-e="${id}"><ha-icon icon="mdi:${open?'window-open-variant':'window-closed-variant'}" ${open?'style="color:#ff8a50"':''}></ha-icon><div style="min-width:0"><div class="n">${swEsc(nm||s.attributes.friendly_name)}</div><div class="st">${open?'Offen':'Geschlossen'}</div></div></div>`;}).join('')}</div></div>`;}).join('');}
  _tile(id,icon,strip,action,name){const s=this._st(id);if(!s)return '';const on=['on','open','playing','unlocked'].includes(s.state);const na=s.state==='unavailable';
    let n=name||s.attributes.friendly_name||id;if(strip&&n.toLowerCase().startsWith(strip.toLowerCase()+' '))n=n.slice(strip.length+1);
    let st=this._tr(s.state);if(id.startsWith('light.')&&s.state==='on'&&s.attributes.brightness)st=Math.round(s.attributes.brightness/2.55)+' %';if(id.startsWith('scene.'))st='Szene';if(id.startsWith('light.')&&s.state==='on'&&s.attributes.color_mode==='color_temp'&&s.attributes.color_temp_kelvin)st+=' · '+s.attributes.color_temp_kelvin+' K';
    const dc=s.attributes.device_class;if(id.startsWith('binary_sensor.')){if(['motion','occupancy','presence'].includes(dc))st=on?'Bewegung':'Keine Bewegung';else st=on?'Erkannt':'Frei';}
    const ic=icon||(s.attributes.icon)||'mdi:lightbulb-outline';
    const cm=s.attributes.supported_color_modes||[];const dim=id.startsWith('light.')&&!na&&cm.length>0&&!cm.every(m=>m==='onoff');const pct=s.state==='on'?(s.attributes.brightness?Math.round(s.attributes.brightness/2.55):100):0;const ct=dim&&cm.includes('color_temp');const fc=swFillColor(s);
    return `<div class="tile ${on?'on':''} ${na?'na':''} ${dim?'dim':''}" data-a="${action||'toggle'}" data-e="${id}"${dim?` data-pct="${pct}"`:''}${ct?' data-ct="1"':''}>${dim?`<div class="fill" style="width:${pct}%;background:${fc}"></div>`:''}<ha-icon icon="${on&&ic==='mdi:lightbulb-outline'?'mdi:lightbulb':ic}"></ha-icon><div style="min-width:0"><div class="n">${swEsc(n)}</div><div class="st">${swEsc(st)}</div></div></div>`;}
  _pLightCfg(){return this._grp(this._cfg.lights).map(g=>{const norm=l=>(l||[]).map(e=>typeof e==='string'?{entity:e}:e).filter(e=>this._st(e.entity));const ents=norm(g.entities),sc=norm(g.scenes),pl=[];if(!ents.length&&!sc.length&&!pl.length)return '';
    const au=g.auto&&this._st(g.auto);const chip=au?`<button class="chip ${au.state==='on'?'on':''}" data-a="toggle" data-e="${g.auto}"><ha-icon icon="mdi:${au.state==='on'?'theme-light-dark':'pause'}"></ha-icon>${au.state==='on'?'AUTO · '+swTargetK(this._hass.states)+' K':'AUTO PAUSIERT'}</button>`:'';
    return `<div class="sect"><div class="rh">${g.room?`<div class="label">${swEsc(g.room)}</div>`:'<div></div>'}${chip}</div><div class="grid">${ents.map(e=>{const grp=Array.isArray(this._st(e.entity).attributes.entity_id);return this._tile(e.entity,grp?'mdi:lightbulb-group-outline':null,null,'toggle',e.name);}).join('')}</div>${sc.length?`<div class="sub">Szenen</div><div class="grid">${sc.map(e=>this._tile(e.entity,'mdi:palette-outline',null,'search',e.name)).join('')}</div>`:''}${pl.length?`<div class="sub">Steckdosen</div><div class="grid">${pl.map(e=>this._tile(e.entity,'mdi:power-socket-eu',null,'toggle',e.name)).join('')}</div>`:''}</div>`;}).join('');}
  _pPlug(){const norm=l=>(l||[]).map(e=>typeof e==='string'?{entity:e}:e).filter(e=>this._st(e.entity));
    return this._grp(this._cfg.lights).map(g=>{const pl=norm(g.plugs);if(!pl.length)return '';return `<div class="sect">${g.room?`<div class="label">${swEsc(g.room)}</div>`:''}<div class="grid">${pl.map(e=>this._tile(e.entity,'mdi:power-socket-eu',null,'toggle',e.name)).join('')}</div></div>`;}).join('')||'<div class="muted">Keine Steckdosen konfiguriert</div>';}
  _pLight(){if(this._cfg.lights&&this._cfg.lights.length)return this._pLightCfg()+this._pWindows();const ids=this._lights().filter(i=>this._st(i).state!=='unavailable');
    const groups=ids.filter(i=>Array.isArray(this._st(i).attributes.entity_id));
    const by={};ids.filter(i=>!groups.includes(i)).forEach(i=>{const a=this._area(i)||'Sonstige';(by[a]=by[a]||[]).push(i);});
    let h='';if(groups.length)h+=`<div class="sect"><div class="label">Gruppen</div><div class="grid">${groups.map(i=>this._tile(i,'mdi:lightbulb-group-outline')).join('')}</div></div>`;
    Object.keys(by).sort((a,b)=>a==='Sonstige'?1:b==='Sonstige'?-1:a.localeCompare(b)).forEach(a=>{h+=`<div class="sect"><div class="label">${swEsc(a)}</div><div class="grid">${by[a].sort((x,y)=>this._nm(x).localeCompare(this._nm(y))).map(i=>this._tile(i,null,a)).join('')}</div></div>`;});
    return h;}
  _pClimate(){const c=this._cfg;
    return `<div class="label">Heizung</div><div class="cards">${this._grp(c.climates).map(g=>{const i=g.entity||(g.entities&&this._eid(g.entities[0]));const s=this._st(i);if(!s||(g.hide_unavailable&&s.state==='unavailable'))return '';const a=s.attributes;const n=g.room?(g.name?g.room+' · '+g.name:g.room):(a.friendly_name||i).replace(/^Heizung\s+/,'');const ts=g.temperature&&this._st(g.temperature);const hs=g.humidity&&this._st(g.humidity);const cur=ts&&!isNaN(parseFloat(ts.state))?parseFloat(ts.state):a.current_temperature;const hum=hs&&!isNaN(parseFloat(hs.state))?Math.round(parseFloat(hs.state)):a.current_humidity;const extra=(g.air||[]).map(x=>{const xs=this._st(x);return xs?`${Math.round(parseFloat(xs.state))} ${xs.attributes.unit_of_measurement||''}`.trim():'';}).filter(Boolean).join(' · ');
      const rslug=String(g.room||'').toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').replace(/\s+/g,'_');const lb=(g.room?this._lowBatteries(10).filter(x=>x.kind==='heat'&&(x.room.toLowerCase()===String(g.room).toLowerCase()||x.id.split('.')[1].startsWith(rslug+'_'))):[]);const subs=[...new Set(lb.map(x=>x.sub))];const batIc=lb.length?`<div class="clbat" title="${swEsc(lb.map(x=>x.n).join(', '))}: Batterie leer"><ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>${subs.map(t=>`<ha-icon icon="${t==='valve'?'mdi:radiator':'mdi:thermostat'}"></ha-icon>`).join('')}</div>`:'';
      return `<div class="cl" data-ents="${this._ents(g)}" style="position:relative${lb.length?';box-shadow:inset 3px 0 0 #FF9800':''}">${batIc}<div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;cursor:pointer" data-a="more" data-e="${i}">${g.room&&g.name?`${swEsc(g.room)}<span class="cn">${swEsc(g.name)}</span>`:swEsc(n)}</div><div class="cur">${cur!=null?Number(cur).toFixed(1):'–'}°</div><div class="muted">${this._tr(s.state)}${hum!=null?' · '+hum+' %':''}${extra?' · '+swEsc(extra):''}</div><div class="ctrl"><button class="btn" data-a="temp" data-e="${i}" data-dir="-1"><ha-icon icon="mdi:minus"></ha-icon></button><div class="val">${a.temperature!=null?Number(a.temperature).toFixed(1)+'°':'–'}</div><button class="btn" data-a="temp" data-e="${i}" data-dir="1"><ha-icon icon="mdi:plus"></ha-icon></button></div></div>`;}).join('')}</div>${this._airQuality()}`;}
  _airQuality(){const L=this._cfg.airquality||[];if(!L.length)return '';const st=id=>id?this._st(id):null;
    const PM={auto:'Auto',medium:'Mittel',sleep:'Schlaf',turbo:'Turbo',night:'Nacht',allergen:'Allergie'};
    const cards=L.map(a=>{const pw=st(a.power);const val=st(a.value);const vn=val?parseFloat(val.state):NaN;const on=pw&&['on','auto','manual','sleep'].includes(pw.state);
      const right=!isNaN(vn)?`${Math.round(vn*10)/10} <small>${swEsc(val&&val.attributes.unit_of_measurement||'')}</small>`:'';
      const chips=(a.info||[]).map(c=>{const cs=st(c.e);if(!cs||cs.state==='unavailable')return '';const u=cs.attributes.unit_of_measurement;let v=cs.state;if(u&&!isNaN(parseFloat(v)))v=`${Math.round(parseFloat(v)*10)/10} ${u}`;const warn=(c.warn||[]).includes(cs.state);return `<span class="ci ${warn?'warn':''}">${swEsc(c.l)}: <b>${swEsc(v)}</b></span>`;}).join('');
      let ctl='';if(pw){ctl+=`<button class="btn ${on?'on':''}" data-a="toggle" data-e="${a.power}" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></button>`;}
      const fp=st(a.preset);if(fp&&(fp.attributes.preset_modes||[]).length){const cur=fp.attributes.preset_mode;ctl+=`<select class="sel" data-fan="${a.preset}">${fp.attributes.preset_modes.map(o=>`<option value="${swEsc(o)}"${o===cur?' selected':''}>${swEsc(PM[String(o).toLowerCase()]||o)}</option>`).join('')}</select>`;}
      return `<div class="app ${on?'run':''}" data-ents="${this._ents(a)}"><div class="ah"><ha-icon icon="${a.icon||'mdi:air-purifier'}"></ha-icon><div style="min-width:0"><div class="an">${swEsc(a.name)}</div><div class="as">${on?swEsc((PM[String(pw.state).toLowerCase()]||this._tr(pw.state))):'Aus'}</div></div><div class="aw">${right}</div></div>${chips?`<div class="chips">${chips}</div>`:''}${ctl?`<div class="actl">${ctl}</div>`:''}</div>`;}).join('');
    return `<div class="label" style="margin-top:26px">Raumluft</div><div class="apps">${cards}</div>`;}
  _pApp(list,empty){const L=list||this._cfg.appliances||[];if(!L.length)return `<div class="muted">${swEsc(empty||'Keine Geräte konfiguriert')}</div>`;
    const st=id=>id?this._st(id):null;const num=id=>{const s=st(id);const v=s?parseFloat(s.state):NaN;return isNaN(v)?null:v;};
    const T=Object.assign({},SW_ST,{printing:'Druckt',stopped:'Gestoppt',ready:'Bereit',run:'Läuft',finished:'Fertig',inactive:'Aus',delayedstart:'Startzeit gesetzt',pause:'Pausiert',actionrequired:'Eingriff nötig',error:'Fehler',aborting:'Wird abgebrochen',docked:'Angedockt',cleaning:'Reinigt',returning:'Fährt zur Basis',returning_home:'Fährt zur Basis',charging:'Lädt',charging_completed:'Geladen',idle:'Bereit',running:'Läuft',drying:'Trocknet',parasetting:'Bereit zum Einstellen',standby:'Standby',cooking:'Gart',preheat:'Heizt vor',preheating:'Heizt vor',keepwarm:'Warmhalten',keep_warm:'Warmhalten',finish:'Fertig',paused:'Pausiert',none:'–',full:'voll',empty:'leer',ok:'OK'});
    return `<div class="apps">${L.map(a=>{if(a.batteries!=null)return this._batTile(a);if(a.group){const gi=a.popup&&this._vacPop?(this._cfg.appliances||[]).indexOf(a):-1;const ev=st(a.value);const en=ev&&!isNaN(parseFloat(ev.state))?parseFloat(ev.state).toFixed(2).replace('.',','):'';const e2=st(a.value2);const v2=e2&&!isNaN(parseFloat(e2.state))?' · '+parseFloat(e2.state).toFixed(2).replace('.',',')+' '+swEsc(e2.attributes.unit_of_measurement||''):'';return `<div class="app appstack" data-ents="${this._ents(a)}"${gi>=0?` data-a="openpop" data-p="vac:${gi}" style="cursor:pointer"`:''}>${a.group.map(g=>{const ts=st(g.temp);const tv=ts&&!isNaN(parseFloat(ts.state))?`${parseFloat(ts.state).toFixed(1)}°`:(ts&&ts.state==='unavailable'?'–':'');const chips=(g.info||[]).map(c=>{const cs=st(c.e);if(!cs||cs.state==='unavailable')return '';const u=cs.attributes.unit_of_measurement;let v=cs.state;if(u&&!isNaN(parseFloat(v)))v=`${Math.round(parseFloat(v)*10)/10} ${u}`;return `<span class="ci">${swEsc(c.l)}: <b>${swEsc(v)}</b></span>`;}).join('');const age=ts?swAgo(ts.last_changed):'';return `<div class="ah"><ha-icon icon="${g.icon||'mdi:fridge-outline'}"></ha-icon><div style="min-width:0"><div class="an">${swEsc(g.name)}</div><div class="as" style="text-transform:none;font-style:normal;opacity:.55">${age?'aktualisiert '+age:''}</div>${chips?`<div class="chips" style="margin-top:4px">${chips}</div>`:''}</div><div class="aw">${tv}</div></div>`;}).join('')}${en?`<div class="afoot"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>≈ ${en} ${swEsc(ev.attributes.unit_of_measurement||'')} ${swEsc(a.value_label||'')}${v2}</div>`:''}</div>`;}
      if(a.hide_unavailable){const hs=st(a.hide_unavailable);if(!hs||['unavailable','unknown'].includes(hs.state))return '';}const s=st(a.status);let status=s?((a.status_map&&a.status_map[s.state])||T[s.state]||s.state):(a.status_map&&a.status_map.missing)||'';const w=num(a.watt);const won=w!=null&&w>(a.watt_on||5);
      if(!a.status&&a.watt)status=won?'Läuft':'Aus';const pw=st(a.power);if(!status&&pw)status=T[pw.state]||pw.state;
      const run=(s&&['run','cleaning','running','drying','returning','returning_home'].includes(s.state))||won;
      const p=num(a.progress);const rem=st(a.remaining);let remTxt='';if(rem){const v=parseFloat(rem.state);if(!isNaN(v)&&v>0){const u=rem.attributes.unit_of_measurement;const m=Math.round(u==='h'?v*60:u==='s'?v/60:v);remTxt=m>=60?`${Math.floor(m/60)} h ${m%60} min`:`${m} min`;}}
      const bat=num(a.battery);const tmp=st(a.temp);const val=st(a.value);const vn=val?parseFloat(val.state):NaN;if(tmp&&tmp.state==='unavailable'&&!a.status)status='Sensor nicht erreichbar';let right=tmp&&!isNaN(parseFloat(tmp.state))?`${parseFloat(tmp.state).toFixed(1)}°`:(!isNaN(vn)?`${Math.round(vn*10)/10} <small>${swEsc(val.attributes.unit_of_measurement||'')}</small>`:(w!=null&&w>0?`${Math.round(w)} W`:(bat!=null?`${Math.round(bat)} %`:'')));
      if(a.alt){const xs=st(a.alt.e);if(xs&&xs.state===(a.alt.state||'on'))right=`<span class="awx"><span>${right||'–'}</span><span>${swEsc(a.alt.text)}</span></span>`;}
      const chips=(a.info||[]).map(c=>{const cs=st(c.e);if(!cs||cs.state==='unavailable')return '';const raw=cs.state;let v=(c.map&&c.map[raw])||T[raw]||raw;const u=cs.attributes.unit_of_measurement;if(u&&!isNaN(parseFloat(raw)))v=`${Math.round(parseFloat(raw)*10)/10} ${u}`;if(c.u)v=`${raw} ${c.u}`;if(cs.attributes.device_class==='timestamp')v=swAgo(raw).replace(/^vor /,'');const nr=parseFloat(raw);const warn=(c.warn||[]).includes(raw)||(c.warn_above!=null&&nr>c.warn_above)||(c.warn_below!=null&&nr<c.warn_below);return `<span class="ci ${warn?'warn':''}">${swEsc(c.l)}: <b>${swEsc(v)}</b></span>`;}).join('');
      let ctl='';if(pw){const on=pw.state==='on';ctl+=`<button class="btn ${on?'on':''}" data-a="ptoggle" data-e="${a.power}"${a.power_confirm?` data-c="${swEsc(a.power_confirm)}"`:''} data-w="${won&&on?1:0}" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></button>`;}
      const pr=st(a.program);if(pr){const opts=pr.attributes.options||[];const lab=a.programs||null;const list=lab?Object.keys(lab).filter(k=>opts.includes(k)):opts.slice();if(lab&&!list.includes(pr.state)&&opts.includes(pr.state))list.unshift(pr.state);ctl+=`<select class="sel" data-sel="${a.program}">${list.map(o=>`<option value="${swEsc(o)}"${o===pr.state?' selected':''}>${swEsc((lab&&lab[o])||o)}</option>`).join('')}</select>`;}
      const fp=st(a.preset);if(fp&&(fp.attributes.preset_modes||[]).length){const PM={auto:'Auto',medium:'Mittel',sleep:'Schlaf',turbo:'Turbo',allergen:'Allergie',bacteria:'Bakterien & Viren',gentle:'Sanft',pollution:'Schadstoffe',night:'Nacht',speed_1:'Stufe 1',speed_2:'Stufe 2',speed_3:'Stufe 3'};const cur=fp.attributes.preset_mode;ctl+=`<select class="sel" data-fan="${a.preset}">${cur?'':'<option value="" selected>Modus …</option>'}${fp.attributes.preset_modes.map(o=>`<option value="${swEsc(o)}"${o===cur?' selected':''}>${swEsc(PM[String(o).toLowerCase()]||o)}</option>`).join('')}</select>`;}
      if(a.start&&st(a.start))ctl+=`<button class="tbtn" data-a="appstart" data-e="${a.start}" data-c="${swEsc(a.start_confirm||(a.name+' starten?'))}"><ha-icon icon="mdi:play"></ha-icon>Start</button>`;
      if(this._ctlHtml)ctl+=this._ctlHtml(a.controls||[]);
      (a.actions||[]).forEach(x=>{const cf=x.confirm?` data-c="${swEsc(x.confirm)}"`:'';if(x.button)ctl+=`<button class="tbtn" data-a="press" data-e="${x.button}"${cf}><ha-icon icon="mdi:${x.icon||'gesture-tap'}"></ha-icon>${swEsc(x.label)}</button>`;else if(x.service)ctl+=`<button class="tbtn" data-a="svc" data-d="${x.service.split('.')[0]}" data-s="${x.service.split('.')[1]}" data-e="${x.entity||''}"${x.data?` data-x="${swEsc(JSON.stringify(x.data))}"`:''}${cf}><ha-icon icon="mdi:${x.icon||'gesture-tap'}"></ha-icon>${swEsc(x.label)}</button>`;});
      const vpi=a.popup&&this._vacPop?(this._cfg.appliances||[]).indexOf(a):-1;const mi=(vpi>=0||list)?'':(a.more||a.status||a.value||a.power||'');
      const bar=(p!=null&&p>0&&p<100)?`<div class="pbar"><div style="width:${p}%"></div></div>`:'';
      const sub=[status,p!=null&&p>0&&p<100?Math.round(p)+' %':'',remTxt?'noch '+remTxt:''].filter(Boolean).join(' · ');
      let btI='',foot='',btSub='';if(a.bt){const bs=st(a.bt);const ba=st(a.bt_active);const t=bs&&!['unknown','unavailable'].includes(bs.state)?new Date(bs.state):null;const ok=t&&!isNaN(t);const live=(ba&&ba.state==='on')||(ok&&Date.now()-t.getTime()<120000);btI=`<ha-icon class="bt ${live?'on':''}" icon="mdi:${live?'bluetooth-connect':(ok?'bluetooth':'bluetooth-off')}" title="${live?'Bluetooth verbunden / sucht':'Bluetooth getrennt'}"></ha-icon>`;if(!(ba&&ba.state==='on'))btSub=ok?'Zuletzt '+swAgo(bs.state):'Nie verbunden';}
      return `<div class="app ${run?'run':''}" data-ents="${this._ents(a)}"><div class="ah${(vpi>=0||mi)?' vclick':''}"${vpi>=0?` data-a="openpop" data-p="vac:${vpi}"`:(mi?` data-a="more" data-e="${mi}"`:'')}><ha-icon icon="${a.icon||'mdi:power-plug'}"></ha-icon><div style="min-width:0"><div class="an">${swEsc(a.name)}</div><div class="as">${swEsc(btSub||sub)}</div></div>${this._batIco(a.battery_icon,a.battery_warn)}${btI}<div class="aw">${right}</div></div>${bar}${chips?`<div class="chips">${chips}</div>`:''}${ctl?`<div class="actl">${ctl}</div>`:''}${foot}</div>`;}).join('')}</div>`;}
  _pCover(){const c=this._cfg;let head='';if(c.covers_all&&this._st(c.covers_all)){head=`<div class="sect"><div class="label">Alle Rollos</div>${this._coverRow(c.covers_all,'Alle Rollos')}</div>`;}
    const wm=this._winMap();const body=head+this._grp(c.covers).map(g=>{const rows=(g.entities||[]).map(e=>{const id=this._eid(e);return this._coverRow(id,typeof e==='string'?null:e.name,wm.map[id]);}).join('');return rows?`<div class="sect">${g.room?`<div class="label">${swEsc(g.room)}</div>`:''}${rows}</div>`:'';}).join('');
    return body+this._windowsList(wm.used);}
  _winMap(){const map={},used=new Set();const W=this._grp(this._cfg.windows);const norm=x=>String(x||'').trim().toLowerCase();
    this._grp(this._cfg.covers).forEach(g=>{const ce=(g.entities||[]);const wg=W.find(w=>norm(w.room)===norm(g.room));const we=wg?(wg.entities||[]):[];
      ce.forEach(e=>{if(typeof e!=='string'&&e.window){const ws=[].concat(e.window);map[this._eid(e)]=ws;ws.forEach(x=>used.add(x));}});
      ce.forEach(e=>{const id=this._eid(e);if(map[id])return;const nm=typeof e==='string'?'':norm(e.name);if(!nm)return;const hit=we.filter(w=>typeof w!=='string'&&norm(w.name)===nm).map(w=>this._eid(w)).filter(x=>!used.has(x));if(hit.length){map[id]=hit;hit.forEach(x=>used.add(x));}});
      const restC=ce.map(e=>this._eid(e)).filter(id=>!map[id]);const restW=we.map(w=>this._eid(w)).filter(x=>!used.has(x));if(restC.length===1&&restW.length===1){map[restC[0]]=restW;used.add(restW[0]);}});
    return {map,used};}
  _winChip(ids){return (ids||[]).map(id=>{const s=this._st(id);if(!s)return '';const open=s.state==='on';const un=s.state==='unavailable';return `<span class="wchip ${open?'open':''}" data-a="more" data-e="${id}" title="Fenster"><ha-icon icon="mdi:${open?'window-open-variant':'window-closed-variant'}"></ha-icon>${un?'?':open?'Fenster offen':'Fenster zu'}</span>`;}).join('');}
  _windowsList(skip){const W=this._cfg.windows||[];if(!W.length)return '';let rows='';this._grp(W).forEach(g=>{(g.entities||[]).forEach(e=>{const id=this._eid(e);if(skip&&skip.has(id))return;const s=this._st(id);if(!s)return;const open=s.state==='on';const nm=(typeof e==='string'?s.attributes.friendly_name:(g.room?g.room+' · '+(e.name||''):e.name))||s.attributes.friendly_name;rows+=`<div class="li" data-a="more" data-e="${id}" style="cursor:pointer"><ha-icon icon="mdi:${open?'window-open-variant':'window-closed-variant'}" ${open?'style="color:#ff8a50"':''}></ha-icon><div class="grow"><div class="h" style="font-size:11px">${swEsc(nm)}</div><div class="i">${open?'Offen':'Geschlossen'}</div></div></div>`;});});return rows?`<div class="sect"><div class="label">Weitere Fenster</div>${rows}</div>`:'';}
  _setPos(id,pos){if(!this._hass)return;const p=Math.max(0,Math.min(100,Math.round(pos)));this._covTarget=this._covTarget||{};this._covTarget[id]={p,t:Date.now(),held:false};if(p<=2){this._covTarget[id].p=0;this._hass.callService('cover','close_cover',{entity_id:id});}else if(p>=98){this._covTarget[id].p=100;this._hass.callService('cover','open_cover',{entity_id:id});}else this._hass.callService('cover','set_cover_position',{entity_id:id,position:p});}
  _coverRow(i,name,win){const s=this._st(i);if(!s)return '';const wc=this._winChip(win);const wo=(win||[]).some(x=>{const t=this._st(x);return t&&t.state==='on';});const pos=s.attributes.current_position;const canpos=(s.attributes.supported_features&4)&&pos!=null;
    if(canpos){return `<div class="li covrow ${wo?'wopen':''}" data-a="covtoggle" data-e="${i}" data-pos="${pos}"><div class="cfill" style="width:${pos}%"></div><ha-icon icon="mdi:${s.state==='open'?'blinds-open':'blinds'}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${swEsc(name||s.attributes.friendly_name)}${wc}</div><div class="i">${this._tr(s.state)}${pos!=null?' · '+pos+' %':''}</div></div><button class="btn" data-a="svc" data-d="cover" data-s="open_cover" data-e="${i}"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="btn" data-a="svc" data-d="cover" data-s="stop_cover" data-e="${i}"><ha-icon icon="mdi:stop"></ha-icon></button><button class="btn" data-a="svc" data-d="cover" data-s="close_cover" data-e="${i}"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;}
    return `<div class="li ${wo?'wopen':''}"><ha-icon icon="mdi:${s.state==='open'?'blinds-open':'blinds'}"></ha-icon><div class="grow"><div class="h" style="font-size:11px">${swEsc(name||s.attributes.friendly_name)}${wc}</div><div class="i">${this._tr(s.state)}${pos!=null?' · '+pos+' %':''}</div></div><button class="btn" data-a="svc" data-d="cover" data-s="open_cover" data-e="${i}"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button class="btn" data-a="svc" data-d="cover" data-s="stop_cover" data-e="${i}"><ha-icon icon="mdi:stop"></ha-icon></button><button class="btn" data-a="svc" data-d="cover" data-s="close_cover" data-e="${i}"><ha-icon icon="mdi:arrow-down"></ha-icon></button></div>`;}
  _pCal(){const now=new Date(),lim=new Date(Date.now()+14*864e5);const ev=this._events.filter(e=>swEnd(e)>now&&swStart(e)<lim);
    if(!ev.length)return '<div class="muted">Keine Termine in den nächsten 14 Tagen</div>';
    const by={};ev.forEach(e=>{const d=swDay0(swStart(e)<now?now:swStart(e));const k=d.getTime();(by[k]=by[k]||[]).push(e);});
    return Object.keys(by).sort((a,b)=>a-b).map(k=>{const d=new Date(Number(k));return `<div class="sect"><div class="label">${SW_DAYS_L[d.getDay()]} ${swPad(d.getDate())}.${swPad(d.getMonth()+1)}.</div>${by[k].map(e=>{const s=swStart(e),en=swEnd(e);const tm=e.start.date?'GANZTÄGIG':`${swPad(s.getHours())}:${swPad(s.getMinutes())} – ${swPad(en.getHours())}:${swPad(en.getMinutes())}`;return `<div class="li"><div class="tm">${tm}</div><div class="grow"><div class="h" style="font-size:11px">${swEsc(e.summary)}</div><div class="i">${swEsc(e.location||this._nm(e.cal))}</div></div></div>`;}).join('')}</div>`;}).join('');}
  _mids(e){return typeof e==='string'?[e]:[...new Set([e.entity,...(e.alt||[]),...(e.play?[].concat(e.play):[])])];}
  _musicIds(){return (this._cfg.music||[]).flatMap(e=>this._mids(e));}
  _mpick(e){const ids=this._mids(e);const ok=i=>this._st(i);return ids.find(i=>ok(i)&&ok(i).state==='playing')||ids.find(i=>ok(i)&&ok(i).state==='paused')||ids.find(i=>ok(i)&&!['unavailable','off','unknown'].includes(ok(i).state))||ids[0];}
  _stations(e){if(typeof e!=='string'&&e.alexa&&(this._cfg.stations||[]).length)return `<div class="stations">${this._cfg.stations.map(st=>`<button class="stn" data-a="alexatxt" data-dev="${swEsc(e.alexa)}" data-t="${swEsc('Spiele '+(st.alexa||st.name)+' auf TuneIn')}">${st.image?`<img src="${swEsc(st.image)}" alt="">`:''}<span>${swEsc(st.name)}</span></button>`).join('')}</div>`;
    if(typeof e==='string'||!e.play||!(this._cfg.stations||[]).length)return '';const pl=[].concat(e.play);const dead=pl.every(p=>{const s=this._st(p);return !s||s.state==='unavailable';});const ids=this._mids(e);
    return `<div class="stations">${this._cfg.stations.map(st=>{const act=ids.some(i=>{const s=this._st(i);if(!s||s.state!=='playing')return false;const a=s.attributes;return a.media_content_id===st.uri||a.media_album_name===st.name||a.media_title===st.name;});return `<button class="stn ${act?'on':''} ${dead?'na':''}" data-a="radio" data-e="${pl.join(',')}" data-u="${swEsc(st.uri)}"${dead?' disabled':''}>${st.image?`<img src="${swEsc(st.image)}" alt="">`:''}<span>${swEsc(st.name)}</span></button>`;}).join('')}</div>`;}
  _mname(i){const e=(this._cfg.music||[]).find(x=>this._mids(x).includes(i));const s=this._st(i);return (e&&typeof e!=='string'&&e.name)||(s&&s.attributes.friendly_name)||i;}
  _pMedia(list,tv){return list.map(e=>{const ax=typeof e!=='string'&&e.alexa;const i=ax?e.entity:this._mpick(e);const tgt=(typeof e!=='string'&&Array.isArray(e.play))?e.play.join(','):i;const nm=typeof e==='string'?null:e.name;const s=this._st(i);if(!s)return '';const a=s.attributes;const na=s.state==='unavailable';
    const pic=a.entity_picture?`<img src="${swEsc(a.entity_picture)}" style="object-fit:cover">`:`<div class="ph"><ha-icon icon="mdi:${tv?'television':'music'}"></ha-icon></div>`;
    const AXT={media_previous_track:'Vorheriger Titel',media_next_track:'Nächster Titel',media_play_pause:s.state==='playing'?'Pause':'Weiter',toggle:'Stopp'};
    const b=(svc,ic)=>ax?`<button class="btn" data-a="alexatxt" data-dev="${swEsc(ax)}" data-t="${swEsc(AXT[svc])}"><ha-icon icon="mdi:${ic}"></ha-icon></button>`:`<button class="btn" data-a="svc" data-d="media_player" data-s="${svc}" data-e="${tgt}"><ha-icon icon="mdi:${ic}"></ha-icon></button>`;
    const vol=a.volume_level!=null?Math.round(a.volume_level*100)+' %':'';
    return `<div class="media ${na?'na':''}">${pic}<div class="grow" data-a="more" data-e="${i}" style="cursor:pointer"><div class="h" style="font-size:12px">${swEsc(nm||a.friendly_name)}</div><div class="i">${swEsc([a.media_title,a.media_artist,this._tr(s.state),vol].filter(Boolean).join(' · '))}</div>${this._stations(e)}</div><div class="ctrl">${tv?b('toggle','power'):''}${b('media_previous_track','skip-previous')}${b('media_play_pause',s.state==='playing'?'pause':'play')}${b('media_next_track','skip-next')}<button class="btn" data-a="vol" data-e="${tgt}" data-dir="-1"><ha-icon icon="mdi:volume-minus"></ha-icon></button><button class="btn" data-a="vol" data-e="${tgt}" data-dir="1"><ha-icon icon="mdi:volume-plus"></ha-icon></button></div></div>`;}).join('');}
  _pTv(){const c=this._cfg;return `<div class="label">Fernseher</div>${this._pMedia(c.tv,true)}${c.tv_extras.length?`<div class="sect"><div class="label">Ambiente</div><div class="grid">${c.tv_extras.map(i=>this._tile(i)).join('')}</div></div>`:''}`;}
  _camCard(id){const s=this._st(id);if(!s)return '';const el=document.createElement('ha-camera-stream');el.hass=this._hass;el.stateObj=s;el.allowExoPlayer=true;el.muted=true;el.className='camstream';el.addEventListener('click',()=>this._more(id));return el;}
  _pSec(){const c=this._cfg;const sr=this.shadowRoot;let h='';const l=this._st(c.lock);
    if(l){const lk=l.state==='locked';const na=l.state==='unavailable';
      h+=`<div class="door2 ${na?'na':''}"><div class="d2main" data-a="lock" data-e="${c.lock}"><ha-icon icon="mdi:${lk?'lock-outline':'lock-open-variant-outline'}"></ha-icon><div><div class="n">${swEsc(l.attributes.friendly_name)}</div><div class="i" style="font-size:11px">${this._tr(l.state)} · tippen zum ${lk?'Entriegeln':'Verriegeln'}</div></div></div><div class="d2open ${this._loLock?'on':''}" data-a="lockopen" data-e="${c.lock}"><ha-icon icon="mdi:door-open"></ha-icon><div class="ol">${this._loLock?'Öffnet …':'Öffnen'}</div></div></div>`;}
    const op=c.door_opener&&this._st(c.door_opener);if(op){const run=op.state==='on'||this._opLock;const na=op.state==='unavailable';h+=`<div class="big ${run?'on':''} ${na?'na':''}" data-a="opener" data-e="${c.door_opener}"><ha-icon icon="mdi:${run?'door-open':'door-closed'}"></ha-icon><div><div class="n">${swEsc(c.door_opener_name||'Haustür')}</div><div class="i" style="font-size:11px">${run?'Öffnet …':'Tippen zum Öffnen · 1 Sekunde'}</div></div></div>`;}
    let out=this._pAlarm()+(h?`<div class="doors">${h}</div>`:'');
    const cams=(c.cameras||[]).filter(x=>this._st(typeof x==='string'?x:x.e));
    if(cams.length)out+=`<div class="cams" id="swcams"></div>`;
    const mot=(c.motion||[]).map(m=>typeof m==='string'?{e:m}:m).filter(m=>this._st(m.e));
    if(mot.length)out+=`<div class="sect"><div class="label">Bewegung</div><div class="grid">${mot.map(m=>this._tile(m.e,'mdi:motion-sensor',null,'more',m.name)).join('')}</div></div>`;
    setTimeout(()=>{const box=sr.getElementById('swcams');if(box&&!box.childElementCount){cams.forEach(x=>{const wrap=document.createElement('div');wrap.className='camwrap';const card=this._camCard(typeof x==='string'?x:x.e);if(card)wrap.appendChild(card);const lbl=document.createElement('div');lbl.className='camlbl';lbl.textContent=typeof x==='string'?'':(x.name||'');wrap.appendChild(lbl);box.appendChild(wrap);});}},0);
    return out;}
  _alarmIds(){const A=this._cfg.alarm;if(!A)return [];return [A.panel,A.zustand,A.ziel,A.bypass,A.ausloser,A.exit_timer,A.entry_timer,...(A.windows||[]).flatMap(w=>[w.e,w.x])].filter(Boolean);}
  _alarmHot(){const A=this._cfg.alarm;const z=A&&this._st(A.zustand);return !!z&&['triggered','pending'].includes(z.state);}
  _pAlarm(){const A=this._cfg.alarm;if(!A)return '';const z=this._st(A.zustand);if(!z)return '';const S=id=>{const x=id&&this._st(id);return x?x.state:'';};
    const zs=z.state,ziel=S(A.ziel),aus=S(A.ausloser);const bp=String(S(A.bypass)||'').split(',').map(x=>x.trim()).filter(Boolean);
    const tm=id=>{const x=id&&this._st(id);return x&&x.state==='active'?x.attributes.finishes_at:null;};
    const nacht=ziel==='armed_night';
    const M={disarmed:['Unscharf','mdi:shield-off-outline',''],arming:['Wird scharf · '+(nacht?'Nacht':'Abwesend'),'mdi:shield-sync-outline','arm'],armed_away:['Scharf · Abwesend','mdi:shield-lock','on'],armed_night:['Scharf · Nacht','mdi:shield-moon','on'],pending:['Voralarm','mdi:shield-alert-outline','hot'],triggered:['Alarm','mdi:shield-alert','hot']};
    const m=M[zs]||[zs,'mdi:shield-outline',''];const fa=zs==='arming'?tm(A.exit_timer):zs==='pending'?tm(A.entry_timer):null;
    const rem=fa?Math.max(0,Math.round((Date.parse(fa)-Date.now())/1000)):0;const cd=fa?`<span class="alcd" data-until="${swEsc(fa)}">${Math.floor(rem/60)+':'+swPad(rem%60)}</span>`:'';
    const sub=zs==='triggered'?(aus||'Ausgelöst'):zs==='pending'?'Tür geöffnet – jetzt ausschalten':zs==='disarmed'?'Nichts wird überwacht':zs==='armed_night'||(zs==='arming'&&nacht)?'Fenster und Tür werden überwacht':'Fenster, Tür und Bewegung werden überwacht';
    const armed=zs!=='disarmed';
    const btn=(svc,ic,lb,act,cf)=>`<button class="albtn ${act?'active':''}" data-a="svc" data-d="alarm_control_panel" data-s="${svc}" data-e="${A.panel}"${cf?` data-c="${swEsc(cf)}"`:''}><ha-icon icon="${ic}"></ha-icon><span>${lb}</span></button>`;
    let h=`<div class="alarm ${m[2]}"><div class="alhead"><ha-icon icon="${m[1]}"></ha-icon><div class="grow"><div class="n">${swEsc(m[0])}${cd}</div><div class="i">${swEsc(sub)}</div></div></div><div class="albtns">${btn('alarm_arm_away','mdi:shield-lock-outline','Abwesend',zs==='armed_away'||(zs==='arming'&&!nacht))}${btn('alarm_arm_night','mdi:shield-moon-outline','Nacht',zs==='armed_night'||(zs==='arming'&&nacht))}${btn('alarm_disarm','mdi:shield-off-outline','Aus',!armed,armed?'Alarmanlage ausschalten?':null)}</div></div>`;
    if((A.windows||[]).length)h+=`<div class="alnote" data-a="nav" data-p="settings" style="cursor:pointer"><ha-icon icon="mdi:cog-outline" style="--mdc-icon-size:14px"></ha-icon> Fenster-Ausnahmen in den Einstellungen</div>`;
    return `<div class="alwrap">${h}</div>`;}
  _pAlarmWin(){const A=this._cfg.alarm;if(!A)return '';const z=this._st(A.zustand);const S=id=>{const x=id&&this._st(id);return x?x.state:'';};const armed=!!z&&z.state!=='disarmed';const bp=String(S(A.bypass)||'').split(',').map(x=>x.trim()).filter(Boolean);let h='';
    const W=(A.windows||[]).filter(w=>this._st(w.e)||this._st(w.x));
    if(W.length)h+=`<div class="sect"><div class="label">Alarmanlage · Fenster-Ausnahmen</div><div class="alwins">${W.map(w=>{const s=this._st(w.e);const op=!!s&&s.state==='on';const na=!s||s.state==='unavailable';const ex=S(w.x)==='on';const by=bp.includes(w.key);
      const st=ex?'Ausnahme':!armed?'':by?'ignoriert bis geschlossen':'überwacht';
      return `<div class="alwin ${op?'open':''} ${na?'na':''}" data-a="toggle" data-e="${w.x}" title="Ausnahme an/aus"><ha-icon icon="mdi:${op?'window-open-variant':'window-closed-variant'}"></ha-icon><div class="grow"><div class="h">${swEsc(w.name)}</div><div class="i">${[na?'nicht erreichbar':op?'Offen':'Geschlossen',st].filter(Boolean).join(' · ')}</div></div><div class="altog ${ex?'on':''}"><span></span></div></div>`;}).join('')}</div><div class="alnote">Schalter an = Fenster dauerhaft ausgenommen (z. B. im Sommer offen). Fenster, die beim Scharfschalten offen sind, werden automatisch ignoriert, bis sie geschlossen werden.</div></div>`;
    return h;}
  _pTodo(){const open=this._todo.filter(t=>t.status==='needs_action'),done=this._todo.filter(t=>t.status==='completed');
    return `<input class="sw" id="swadd" placeholder="ARTIKEL HINZUFÜGEN …" autocomplete="off"><div class="label">Offen · ${open.length}</div>${open.map(t=>`<div class="li" data-a="todo" data-uid="${swEsc(t.uid)}" data-st="completed" style="cursor:pointer"><ha-icon icon="mdi:checkbox-blank-circle-outline"></ha-icon><div class="grow"><div class="h" style="font-size:12px">${swEsc(t.summary)}</div></div></div>`).join('')||'<div class="muted">Alles erledigt</div>'}
    <div class="sect"><div class="label">Erledigt · ${done.length}</div>${done.map(t=>`<div class="li" data-a="todo" data-uid="${swEsc(t.uid)}" data-st="needs_action" style="cursor:pointer;opacity:.55"><ha-icon icon="mdi:check-circle-outline"></ha-icon><div class="grow"><div class="h" style="font-size:12px;text-decoration:line-through">${swEsc(t.summary)}</div></div></div>`).join('')}${done.length?`<div style="margin-top:14px"><button class="btn" style="width:auto;padding:0 14px;font-size:10px;letter-spacing:.2em" data-a="todoclean">ERLEDIGTE ENTFERNEN</button></div>`:''}</div>`;}
  _searchIds(){const q=this._q.trim().toLowerCase();if(q.length<2)return [];const doms=['light','switch','cover','climate','media_player','lock','scene','script','fan','input_boolean','automation','sensor','binary_sensor'];
    return Object.keys(this._hass.states).filter(i=>{if(!doms.includes(i.split('.')[0]))return false;const s=this._hass.states[i];if(s.state==='unavailable')return false;return i.includes(q)||String(s.attributes.friendly_name||'').toLowerCase().includes(q);}).slice(0,48);}
  _results(){const ids=this._searchIds();if(this._q.trim().length<2)return '<div class="muted">Mindestens 2 Zeichen eingeben</div>';if(!ids.length)return '<div class="muted">Keine Treffer</div>';
    const icon={light:'mdi:lightbulb-outline',switch:'mdi:toggle-switch-outline',cover:'mdi:blinds',climate:'mdi:thermostat',media_player:'mdi:speaker',lock:'mdi:lock-outline',scene:'mdi:palette-outline',script:'mdi:script-text-outline',fan:'mdi:fan',input_boolean:'mdi:toggle-switch-outline',automation:'mdi:robot-outline',sensor:'mdi:eye-outline',binary_sensor:'mdi:checkbox-blank-circle-outline'};
    return `<div class="grid">${ids.map(i=>{const s=this._hass.states[i];const t=this._tile(i,icon[i.split('.')[0]],null,'search');return s.attributes.unit_of_measurement?t.replace(`>${swEsc(this._tr(s.state))}<`,`>${swEsc(s.state+' '+s.attributes.unit_of_measurement)}<`):t;}).join('')}</div>`;}
  _pSearch(){return `<input class="sw" id="swq" placeholder="GERÄT ODER SENSOR SUCHEN …" value="${swEsc(this._q)}" autocomplete="off"><div id="swres">${this._results()}</div>`;}
}
if(!customElements.get('smart-wall-card'))customElements.define('smart-wall-card',SmartWallCard);
window.customCards=window.customCards||[];if(!window.customCards.find(c=>c.type==='smart-wall-card'))window.customCards.push({type:'smart-wall-card',name:'Smart Wall Card',description:'Wanddisplay im Smart-Wall-Stil, Header-Hintergrund wie im Dashboard slick'});

/* Smart Wall Card – Erweiterung: Post & Pakete v1.0 (Startseite: Blase · Haushalt: Karte nur bei Post · Popup mit Briefbildern) – benötigt Integration dhl_de */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swPost)return;C.prototype.__swPost=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>String(s??'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&uuml;/g,'ü').replace(/&ouml;/g,'ö').replace(/&auml;/g,'ä').replace(/&szlig;/g,'ß').replace(/\s+/g,' ').trim();
const YEL='#FFCC00';
const LBL={registered:'Angekündigt',in_preparation:'In Vorbereitung',in_transit:'Unterwegs',out_for_delivery:'In Zustellung',ready_for_pickup:'Abholbereit',delivered:'Zugestellt',unknown:''};
const ICO={registered:'mdi:package-variant',in_preparation:'mdi:package-variant-closed',in_transit:'mdi:truck-fast-outline',out_for_delivery:'mdi:truck-delivery-outline',ready_for_pickup:'mdi:locker',delivered:'mdi:package-variant-closed-check'};
const PU=/liegt in der (.+?) zur Abholung/i;
const day=ts=>{const d=new Date(ts);if(isNaN(d))return '';const t=new Date();t.setHours(0,0,0,0);const x=new Date(d);x.setHours(0,0,0,0);const n=Math.round((x-t)/864e5);const hm=d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});return (n===0?'heute':n===-1?'gestern':d.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'}))+', '+hm+' Uhr';};

/* Konfiguration (mit Standardwerten der Integration dhl_de) */
C.prototype._postCfg=function(){const P=this._cfg.post;if(P===false)return null;const p=Object.assign({parcels:'sensor.dhl_pakete_unterwegs',letters:'sensor.dhl_briefankundigung',letter_images:['image.dhl_brief_1','image.dhl_brief_2','image.dhl_brief_3','image.dhl_brief_4','image.dhl_brief_5','image.dhl_brief_6','image.dhl_brief_7','image.dhl_brief_8','image.dhl_brief_9','image.dhl_brief_10'],name:'Post'},P||{});return p;};

/* Daten: aktive Pakete + angekündigte Briefe */
C.prototype._postData=function(){const p=this._postCfg();if(!p||!this._hass)return {parcels:[],letters:[],imgs:[]};const ps=this._st(p.parcels);const ls=this._st(p.letters);
  const parcels=((ps&&ps.attributes.parcels)||[]).map(x=>{const txt=plain(x.status_text);let st=x.status||'unknown';const m=txt.match(PU);if(st!=='delivered'&&(m||/zur abholung bereit|abholbereit/i.test(txt)))st='ready_for_pickup';return Object.assign({},x,{status:st,text:txt,where:x.pickup_location||(m?m[1]:'')});})
    .filter(x=>x.status!=='delivered');
  const order={out_for_delivery:0,ready_for_pickup:1,in_transit:2,in_preparation:3,registered:4,unknown:5};parcels.sort((a,b)=>(order[a.status]??9)-(order[b.status]??9));
  const letters=(ls&&Array.isArray(ls.attributes.letters))?ls.attributes.letters:[];
  const imgs=(p.letter_images||[]).map(id=>this._st(id)).filter(s=>s&&s.state!=='unavailable'&&s.attributes.entity_picture);
  return {parcels,letters,imgs};};

/* Neu zeichnen, wenn sich Post ändert */
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const p=this._postCfg();if(p)ids.push(p.parcels,p.letters,...(p.letter_images||[]));return ids.filter(Boolean);};

/* Blase auf der Startseite */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const p=this._postCfg();if(!p)return out;const d=this._postData();const np=d.parcels.length,nl=d.letters.length;if(!np&&!nl&&!this._cfg.alerts_test)return out;
  const pick=d.parcels.filter(x=>x.status==='ready_for_pickup').length,today=d.parcels.filter(x=>x.status==='out_for_delivery').length;
  let num,unit,sub;
  if(np&&nl){num=np+nl;unit='SENDUNGEN';sub=pick?'PAKET ABHOLBEREIT':today?'KOMMT HEUTE':np+' P · '+nl+' B';}
  else if(np){num=np;unit=np===1?'PAKET':'PAKETE';sub=pick?(pick===np?'ABHOLBEREIT':pick+' ABHOLBEREIT'):today?'KOMMT HEUTE':'UNTERWEGS';}
  else if(nl){num=nl;unit=nl===1?'BRIEF':'BRIEFE';sub='KOMMT HEUTE';}
  else{num=0;unit='KEINE POST';sub='';}
  out+=this._bub(num,unit,{cap:p.name||'Post',txt:sub},(np||nl)?YEL:null,'pop:post');return out;};

/* Haushalt: Karte nur sichtbar, wenn Post kommt */
const opa=C.prototype._pApp;
C.prototype._pApp=function(list,empty){const h=opa.call(this,list,empty);if(list||this._page!=='app')return h;const p=this._postCfg();if(!p)return h;const d=this._postData();if(!d.parcels.length&&!d.letters.length)return h;
  const np=d.parcels.length,nl=d.letters.length;const summ=[np?np+(np===1?' Paket':' Pakete'):'',nl?nl+(nl===1?' Brief':' Briefe'):''].filter(Boolean).join(' · ');
  const pick=d.parcels.filter(x=>x.status==='ready_for_pickup').length,today=d.parcels.filter(x=>x.status==='out_for_delivery').length;
  const sub=[pick?pick+' abholbereit':'',today?today+' kommt heute':''].filter(Boolean).join(' · ')||summ;
  const chips=d.parcels.map(x=>{const hot=x.status==='ready_for_pickup'||x.status==='out_for_delivery';return `<span class="ci"${hot?` style="box-shadow:inset 2px 0 0 ${YEL}"`:''}>${esc(x.name||x.id)}: <b>${esc(LBL[x.status]||x.text||'')}${x.where?' · '+esc(x.where):x.delivery_window?' · '+esc(x.delivery_window)+' Uhr':''}</b></span>`;}).join('')+(nl?`<span class="ci">${nl===1?'Brief':'Briefe'}: <b>${nl}${d.imgs.length?' · Bild im Popup':''}</b></span>`:'');
  const card=`<div class="app run" style="box-shadow:inset 3px 0 0 ${YEL};cursor:pointer" data-a="openpop" data-p="post"><div class="ah"><ha-icon icon="mdi:mailbox-up-outline" style="color:${YEL};opacity:1"></ha-icon><div style="min-width:0"><div class="an">${esc(p.name||'Post')}</div><div class="as">${esc(sub)}</div></div><div class="aw">${np+nl}</div></div><div class="chips">${chips}</div></div>`;
  return h.replace('<div class="apps">','<div class="apps">'+card);};

/* Popups: Übersicht + großes Briefbild */
C.prototype._postPop=function(kind){const pp=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!pp)return;this._popKind=null;const p=this._postCfg()||{};const d=this._postData();
  const im=String(kind).match(/^postimg(\d+)$/);
  if(im){const s=d.imgs[Number(im[1])];const L=d.letters[Number(im[1])]||{};const meta=Object.entries(L).filter(([k,v])=>!/url|image|id$/i.test(k)&&v!=null&&v!==''&&typeof v!=='object').slice(0,4).map(([k,v])=>esc(v)).join(' · ');
    pp.innerHTML=`<div class="panel" style="width:min(760px,100%)" data-postpop="${esc(kind)}"><div class="pt">Brief ${Number(im[1])+1} von ${d.imgs.length}</div><div class="pbody" style="max-height:none;text-align:center">${s?`<img src="${esc(s.attributes.entity_picture)}" style="max-width:100%;max-height:65vh;display:block;margin:6px auto;background:#fff">`:'<div class="muted">Bild nicht mehr verfügbar.</div>'}${meta?`<div class="pmut" style="font-style:normal">${meta}</div>`:''}</div><div style="display:flex;gap:8px">${Number(im[1])>0?`<button class="pclose" data-a="openpop" data-p="postimg${Number(im[1])-1}">‹ VORHERIGER</button>`:''}${Number(im[1])<d.imgs.length-1?`<button class="pclose" data-a="openpop" data-p="postimg${Number(im[1])+1}">NÄCHSTER ›</button>`:''}<button class="pclose" data-a="openpop" data-p="post">ÜBERSICHT</button><button class="pclose" data-a="popclose">SCHLIESSEN</button></div></div>`;pp.classList.add('open');return;}
  let body='';
  if(d.parcels.length){body+=d.parcels.map(x=>`<div class="hrow"><div class="hi"><ha-icon icon="${ICO[x.status]||'mdi:package-variant'}" style="--mdc-icon-size:22px${['ready_for_pickup','out_for_delivery'].includes(x.status)?';color:'+YEL:''}"></ha-icon></div><div class="hx"><div class="hk">${esc(LBL[x.status]||'Paket')} · ${esc(x.name||'Paket')}</div><div class="ht">${esc(x.text||'')}</div>${x.delivery_window?`<div class="ht" style="opacity:.75">Zeitfenster: ${esc(x.delivery_window)} Uhr${x.stops_left!=null?' · noch '+esc(x.stops_left)+' Stopps':''}</div>`:''}${x.last_update?`<div class="ht" style="opacity:.55;font-size:11px">${esc(day(x.last_update))} · ${esc(x.id||'')}</div>`:''}</div>${x.link?`<button class="hack" data-a="posturl" data-u="${esc(x.link)}">Verfolgen</button>`:''}</div>`).join('');}
  if(d.letters.length||d.imgs.length){body+=`<div class="sub" style="margin-top:18px">Briefankündigung · ${d.letters.length||d.imgs.length}</div>`;
    body+=d.imgs.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">${d.imgs.map((s,i)=>`<img src="${esc(s.attributes.entity_picture)}" data-a="openpop" data-p="postimg${i}" style="width:100%;aspect-ratio:3/2;object-fit:cover;cursor:pointer;background:#fff" alt="Brief ${i+1}">`).join('')}</div><div class="pmut">Tippen für die große Ansicht.</div>`:`<div class="muted">${d.letters.length} ${d.letters.length===1?'Brief':'Briefe'} angekündigt – noch kein Bild.</div>`;}
  if(!body)body='<div class="muted">Gerade keine Post unterwegs.</div>';
  body+='<div class="pmut">Daten aus deinem DHL-Konto, aktualisiert alle 30 Minuten.</div>';
  pp.innerHTML=`<div class="panel" style="width:min(520px,100%)" data-postpop="post"><div class="pt">${esc(p.name||'Post')} & Pakete</div><div class="pbody">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;pp.classList.add('open');};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(/^post(img\d+)?$/.test(String(kind)))return this._postPop(kind);return oop.call(this,kind);};

/* Klick: Sendungsverfolgung öffnen */
const oc=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a);if(el&&el.dataset.a==='posturl'){window.open(el.dataset.u,'_blank','noopener');return;}}return oc.call(this,ev);};
});})();

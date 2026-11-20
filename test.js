const {JSDOM}=require('jsdom');const fs=require('fs');
async function run(file,tag,cfg){
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only',url:'http://ha.local/'});
  const w=dom.window;const errs=[];w.addEventListener('error',e=>errs.push(e.message));
  let code=fs.readFileSync(file,'utf8').replace(/import\.meta\.url/g,'"http://ha.local/local/community/smart-wall-card/smart-wall-card.js"');
  w.eval(code);await new Promise(r=>setTimeout(r,50));
  const el=w.document.createElement(tag);el.setConfig(cfg);w.document.body.appendChild(el);
  const states={};const S=(id,state,attr={})=>states[id]={entity_id:id,state,attributes:Object.assign({friendly_name:id},attr),last_changed:'2026-11-20T10:00:00Z'};
  S('light.wz','on',{brightness:128,supported_color_modes:['color_temp'],color_mode:'color_temp',color_temp_kelvin:3000,entity_id:['light.a','light.b']});S('light.a','on');S('light.b','off');S('light.k','unavailable');
  S('switch.p1','unavailable');S('cover.c1','open',{current_position:50});S('binary_sensor.w1','on',{device_class:'window'});
  S('climate.h1','heat',{temperature:20,current_temperature:19});S('sensor.t1','unavailable');S('sensor.bat','5',{device_class:'battery',unit_of_measurement:'%'});
  S('sensor.dev','on');S('sensor.hm_s','1',{message_1:'HmIP-SWDO 0010A0C98F7743:0 Batterie niedrig'});S('sensor.hm_a','1',{alarm_1:'WatchDog: copro-lost'});
  S('sensor.dhl_pakete_unterwegs','1',{parcels:[{id:'X1',name:'Amazon',status:'ready_for_pickup',status_text:'liegt in der Packstation 128 zur Abholung bereit.',pickup_location:'Packstation 128'}]});S('sensor.dhl_briefankundigung','0',{letters:[]});S('sun.sun','above_horizon',{elevation:20});
  const hass={states,entities:{},devices:{},areas:{},callService:()=>{},callWS:()=>Promise.resolve({}),callApi:()=>Promise.resolve([]),connection:{subscribeMessage:()=>Promise.resolve(()=>{})}};
  el.hass=hass;await new Promise(r=>setTimeout(r,100));
  const pages=['home','light','plug','climate','cover','app','security','server','settings','todo','calendar','music'];const out={};
  for(const p of pages){el._page=p;el._render(true);out[p]=el.shadowRoot.getElementById('swcontent').innerHTML+'|NAV|'+el.shadowRoot.getElementById('swnav').innerHTML;}
  el._openPop('homematic');out.pop_hm=el.shadowRoot.getElementById('swpop').innerHTML;el._openPop('post');out.pop_post=el.shadowRoot.getElementById('swpop').innerHTML;
  // Render-Diff: zweites Rendern ohne Änderung darf DOM nicht ersetzen
  el._page='home';el._render(true);const n1=el.shadowRoot.getElementById('swcontent').firstChild;el._render(false);el._pd=0;el._render();const same=n1===el.shadowRoot.getElementById('swcontent').firstChild;
  // Batterie-Cache
  let calls=0;const lb=Object.getPrototypeOf(el)._lowBatteries;
  return {out,errs,same,font:w.document.getElementById('sw-font')&&w.document.getElementById('sw-font').tagName};
}
const base={type:'x',name:'Test',background_entity:'input_select.x',lights:[{room:'Wohnzimmer',entities:[{entity:'light.wz',name:'Alle'},'light.k'],plugs:[{entity:'switch.p1',name:'P'}]}],covers:[{room:'WZ',entities:[{entity:'cover.c1',name:'C'}]}],windows:[{room:'WZ',entities:[{entity:'binary_sensor.w1',name:'F'}]}],climates:[{entity:'climate.h1',room:'WZ',temperature:'sensor.t1'}],
 appliances:[{name:'Dev',icon:'mdi:x',status:'sensor.dev',info:[{e:'sensor.dev',l:'Info',map:{on:'leer',off:'OK'},warn:['on']}]},{name:'Batterien',batteries:10}],
 servers:[{name:'S',status:'sensor.dev',status_map:{on:'online',off:'offline'}}],homematic:{service:'sensor.hm_s',alarm:'sensor.hm_a'},
 nav_alerts:{light:[{unavailable:['light.wz','light.k']}],plug:[{unavailable:['switch.p1']}],cover:[{unavailable:['cover.c1']},{dead:['binary_sensor.w1']}],climate:[{dead:['sensor.t1']},{battery:10,battery_only:['heat']}],app:[{battery:10}]}};
const short=JSON.parse(JSON.stringify(base));short.appliances[0].info[0].map='leer|OK';short.servers[0].status_map='online|offline';
short.nav_alerts={light:[{unavailable:['@lights']}],plug:[{unavailable:['@plugs']}],cover:[{unavailable:['@covers']},{dead:['@windows']}],climate:[{dead:['@climate_temps']},{battery:10,battery_only:['heat']}],app:[{battery:10}]};
(async()=>{
 const A=await run('/tmp/old.js','smart-wall-card',base);
 const B=await run('dist/smart-wall-card.js','smart-wall-card-v3',base);
 const Cc=await run('dist/smart-wall-card.js','smart-wall-card-v3',short);
 console.log('Fehler alt/neu/kurz:',A.errs,B.errs,Cc.errs);
 let diff=0;for(const k of Object.keys(A.out)){if(A.out[k]!==B.out[k]){diff++;console.log('UNTERSCHIED alt/neu',k);} if(B.out[k]!==Cc.out[k]){diff++;console.log('UNTERSCHIED neu/kurz',k);}}
 console.log('Seiten verglichen:',Object.keys(A.out).length,'Unterschiede:',diff,'| DOM bleibt bei unverändertem Inhalt:',B.same,'(alt:',A.same,') | Schrift:',B.font);
 console.log('Seitenlängen:',Object.entries(B.out).map(([k,v])=>k+':'+v.length).join(' '));
process.exit(0);})();

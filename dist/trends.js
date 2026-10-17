// Time is explicit: never infer a new day from a late or corrected observation.
function observationMinute(row){
  const m=/^(\d{2}):(\d{2})(?::\d{2})?$/.exec(row.time||'');
  const day=Number(row.day);
  if(!m||Number(m[1])>23||Number(m[2])>59||String(row.day??'').trim()===''||!Number.isSafeInteger(day)||day<0||day>365)return null;
  return day*1440+Number(m[1])*60+Number(m[2]);
}
function observationValue(row,key){const raw=String(row[key]??'').trim();const v=Number(raw);return raw!==''&&Number.isFinite(v)&&v>=0&&(key!=='spo2'||v<=100)?v:null}
function trendData(key){return monitoringRows.map((row,index)=>({row,index,t:observationMinute(row),v:observationValue(row,key)})).filter(p=>p.t!==null).sort((a,b)=>a.t-b.t||a.index-b.index)}
function axisTime(t){const day=Math.floor(t/1440),mins=Math.round(t%1440);return (day?'D+'+day+' ':'')+String(Math.floor(mins/60)).padStart(2,'0')+':'+String(mins%60).padStart(2,'0')}
function axisValue(v){return Number(v.toPrecision(4)).toString()}
function trendSvg(key,title,unit){
  const points=trendData(key),valid=points.filter(p=>p.v!==null);
  if(!valid.length)return '<p class="trendempty">Enter a reading and valid time to see this trend.</p>';
  let low=Math.min(...valid.map(p=>p.v)),high=Math.max(...valid.map(p=>p.v));
  const pad=(high-low)*.15||Math.max(Math.abs(high)*.05,1);low=Math.max(0,low-pad);high+=pad;
  let start=points[0].t,end=points[points.length-1].t;
  if(start===end){start-=1;end+=1;}
  const x=t=>54+(t-start)/(end-start)*422,y=v=>166-(v-low)/(high-low)*140;
  let svg=`<svg viewBox="0 0 500 215" role="img" aria-label="${escapeHtml(title)} trend in ${escapeHtml(unit)}; ${valid.length} readings. Auto-scaled vertical axis."><title>${escapeHtml(title)} (${escapeHtml(unit)}) over time</title>`;
  for(let i=0;i<4;i++){const v=low+(high-low)*i/3,yy=y(v);svg+=`<line x1="54" y1="${yy}" x2="476" y2="${yy}" class="chartgrid"/><text x="47" y="${yy+4}" text-anchor="end">${axisValue(v)}</text>`;}
  // Split on missing readings instead of interpolating across them.
  let segment=[];const flush=()=>{if(segment.length>1)svg+=`<polyline class="trendline" points="${segment.join(' ')}"/>`;segment=[]};
  for(const p of points){if(p.v===null){flush();continue}segment.push(`${x(p.t)},${y(p.v)}`)}flush();
  for(const p of valid){const detail=`${axisTime(p.t)} · ${p.v} ${unit} · ${p.row.phase||''}${p.row.notes?' · '+p.row.notes:''}`;svg+=`<circle class="trendpoint" tabindex="0" cx="${x(p.t)}" cy="${y(p.v)}" r="4" aria-label="${escapeHtml(detail)}"><title>${escapeHtml(detail)}</title></circle>`}
  const ticks=[points[0].t,points[points.length-1].t];if(ticks[0]===ticks[1])ticks.pop();
  for(const t of ticks)svg+=`<text x="${x(t)}" y="190" text-anchor="${ticks.length===1?'middle':t===ticks[0]?'start':'end'}">${axisTime(t)}</text>`;
  svg+='<text x="265" y="210" text-anchor="middle">Observation time</text></svg>';
  return svg;
}
function renderTrends(){
  const root=$('#trendGraphs');if(!root)return;
  const parameters=columns.filter(([key,,type])=>type==='number'&&key!=='day');
  const invalidTimes=monitoringRows.filter(r=>observationMinute(r)===null).length;
  const invalidValues=monitoringRows.reduce((n,r)=>n+parameters.filter(([key])=>String(r[key]??'').trim()!==''&&observationValue(r,key)===null).length,0);
  root.innerHTML=`<div class="sectionhead category"><div><p class="eyebrow">OBSERVATION TRENDS</p><h2>Vitals over time</h2><p>Separate units and axes for each parameter · updates as you enter readings.</p></div></div><p class="ref">Axes automatically scale to the entered values; compare the labeled values, not slopes between panels. Points are connected chronologically. Missing readings break the line. Hover over a point for the reading, phase, and notes. These graphs do not provide alarms or normal ranges.</p>${invalidTimes||invalidValues?`<div class="alert">${invalidTimes?invalidTimes+' observation(s) excluded because time or day offset is missing / invalid. ':''}${invalidValues?invalidValues+' invalid reading(s) excluded. Values must be nonnegative; SpO₂ must be 0–100%.':''}</div>`:''}<div class="grid trendgrid">${parameters.map(([key,title,,unit])=>`<article class="card trendcard"><span class="tag">${escapeHtml(unit)} · AUTO SCALE</span><h3>${escapeHtml(title)}</h3>${trendSvg(key,title,unit)}</article>`).join('')}</div>`;
}

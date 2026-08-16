
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function parseDate(v){if(!v)return null; const [y,m,d]=v.split('-').map(Number); return new Date(Date.UTC(y,m-1,d));}
function fmt(d){return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(d)}
function daysBetween(a,b){return Math.round((b-a)/86400000)}
function calendarDiff(a,b){let sign=1;if(b<a){[a,b]=[b,a];sign=-1}let y=b.getUTCFullYear()-a.getUTCFullYear(),anchor=addYearsSafe(a,y);if(anchor>b){y--;anchor=addYearsSafe(a,y)}let m=0,next=addMonthsSafe(anchor,1);while(m<11&&next<=b){anchor=next;m++;next=addMonthsSafe(anchor,1)}const d=daysBetween(anchor,b);return {years:y*sign,months:m*sign,days:d*sign,totalDays:daysBetween(a,b)*sign}}
function addMonthsSafe(d,n){let out=new Date(d); const day=out.getUTCDate(); out.setUTCDate(1); out.setUTCMonth(out.getUTCMonth()+n); const max=new Date(Date.UTC(out.getUTCFullYear(),out.getUTCMonth()+1,0)).getUTCDate(); out.setUTCDate(Math.min(day,max)); return out}
function addYearsSafe(d,n){let out=new Date(d); const m=out.getUTCMonth(),day=out.getUTCDate(); out.setUTCFullYear(out.getUTCFullYear()+n, m, 1); const max=new Date(Date.UTC(out.getUTCFullYear(),m+1,0)).getUTCDate(); out.setUTCDate(Math.min(day,max)); return out}
function isoWeek(d){const x=new Date(d); x.setUTCHours(0,0,0,0); x.setUTCDate(x.getUTCDate()+4-(x.getUTCDay()||7)); const y0=new Date(Date.UTC(x.getUTCFullYear(),0,1)); return Math.ceil((((x-y0)/86400000)+1)/7)}
function leap(y){return y%4===0&&(y%100!==0||y%400===0)}
function fmtDT(d){return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'}).format(d)}
function weekdayOf(d){return d.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})}
function isoWeekYearStart(y){const jan4=new Date(Date.UTC(y,0,4));const dow=jan4.getUTCDay()||7;const s=new Date(jan4);s.setUTCDate(jan4.getUTCDate()-(dow-1));return s}
function countWeekdays(a,b,skip){let n=0;const s=new Date(Math.min(a,b)),e=new Date(Math.max(a,b));for(let d=new Date(s);d<=e;d.setUTCDate(d.getUTCDate()+1)){if(!skip.includes(d.getUTCDay()))n++}return n}
function holCode(){const el=document.getElementById('holidays');return el?el.value:'none'}
function holSet(a,b){if(!global_H()||!holCode()||holCode()==='none')return new Set();return new Set(window.Holidays.between(holCode(),a,b).map(h=>h.date))}
function global_H(){return typeof window!=='undefined'&&window.Holidays}
function isoDay(d){return d.toISOString().slice(0,10)}
function holLabel(){return global_H()?window.Holidays.label(holCode()):'Not applied'}
function countWorkdays(a,b,skip,hol){let n=0,hits=0;const s=new Date(Math.min(a,b)),e=new Date(Math.max(a,b));for(let d=new Date(s);d<=e;d.setUTCDate(d.getUTCDate()+1)){if(skip.includes(d.getUTCDay()))continue;if(hol&&hol.has(isoDay(d))){hits++;continue}n++}return{days:n,holidays:hits}}
const WEEKEND_SETS={'Saturday & Sunday':[0,6],'Friday & Saturday':[5,6],'Sunday only':[0],'None':[]};
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function setResult(primary, metrics=[]){const primaryResult=$('#primaryResult'),g=$('#resultMetrics'),hint=$('#resultHint');if(primaryResult)primaryResult.textContent=primary;if(g){g.innerHTML='';metrics.slice(0,14).forEach(([label,val])=>{const e=document.createElement('div');e.className='metric';const strong=document.createElement('strong'),span=document.createElement('span');strong.textContent=String(val);span.textContent=String(label);e.append(strong,span);g.appendChild(e)})}if(hint)hint.textContent='Result calculated in this browser. Review the methodology below for assumptions and limitations.'}
function vals(){const o={}; $$('[data-field]').forEach(el=>o[el.id]=el.value); return o}
function nextBirthday(dob,ref){let y=ref.getUTCFullYear(); let m=dob.getUTCMonth(),day=dob.getUTCDate(); let max=new Date(Date.UTC(y,m+1,0)).getUTCDate(); let bd=new Date(Date.UTC(y,m,Math.min(day,max))); if(bd<ref){y++; max=new Date(Date.UTC(y,m+1,0)).getUTCDate(); bd=new Date(Date.UTC(y,m,Math.min(day,max)))} return bd}
function calc(){const c=window.CALC_CONFIG,v=vals(); try{
 if(c.mode==='age'||c.mode==='ageUnit'||c.mode==='ageUnits'){const a=parseDate(v.dob),b=parseDate(v.ref); if(!a||!b||b<a)throw Error('Please enter valid dates with the reference date on or after the birth date.'); const x=calendarDiff(a,b),td=daysBetween(a,b); if(c.mode==='age') setResult(`${x.years} years, ${x.months} months, ${x.days} days`,[['Total days',td.toLocaleString()],['Whole weeks',Math.floor(td/7).toLocaleString()],['Remaining week days',td%7],['Birth weekday',a.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})]]); else {let unit=c.extra.unit||'days',value;if(unit==='days')value=td; else if(unit==='weeks')value=(td/7).toFixed(2); else if(unit==='months')value=(x.years*12+x.months+(x.days/30.436875)).toFixed(2); else if(unit==='hours')value=td*24; else if(unit==='minutes')value=td*1440; else if(unit==='seconds')value=td*86400; else if(unit==='quarters')value=Math.floor((x.years*12+x.months)/3); else value=(td/365.2425).toFixed(4); setResult(`${Number(value).toLocaleString()} ${unit==='decimalYears'?'years':unit}`,[['Calendar age',`${x.years}y ${x.months}m ${x.days}d`],['Total days',td.toLocaleString()],['Whole weeks',Math.floor(td/7).toLocaleString()]]);}}
 else if(c.mode==='dateDiff'||c.mode==='service'){const a=parseDate(v.start),b=parseDate(v.end);if(!a||!b)throw Error('Enter both dates.');const x=calendarDiff(a,b),td=Math.abs(daysBetween(a,b));if(c.extra&&c.extra.emphasis==='weeks'){setResult(`${Math.floor(td/7).toLocaleString()} weeks, ${td%7} days`,[['Total days',td.toLocaleString()],['Calendar duration',`${Math.abs(x.years)}y ${Math.abs(x.months)}m ${Math.abs(x.days)}d`],['Approx. months',(td/30.436875).toFixed(2)],['Weekdays',countWeekdays(a,b,[0,6]).toLocaleString()]]);return}
 setResult(`${Math.abs(x.years)} years, ${Math.abs(x.months)} months, ${Math.abs(x.days)} days`,[['Total days',td.toLocaleString()],['Whole weeks',Math.floor(td/7).toLocaleString()],['Approx. months',(td/30.436875).toFixed(2)],['Approx. years',(td/365.2425).toFixed(3)]]);}
 else if(c.mode==='birthday'){const a=parseDate(v.dob),r=parseDate(v.ref);if(!a||!r||r<a)throw Error('Enter valid dates with the reference date on or after the birth date.');const bd=nextBirthday(a,r),age=calendarDiff(a,bd).years;setResult(`${daysBetween(r,bd)} days until your next birthday`,[['Next birthday',fmt(bd)],['Turning age',age],['Weekday',bd.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})],['Current age',`${calendarDiff(a,r).years} years`]]);}
 else if(c.mode==='reverseAge'){const r=parseDate(v.ref);const age=Number(v.age);if(!r||!Number.isFinite(age))throw Error('Enter a valid age and date.');const d=addYearsSafe(r,-Math.floor(age));setResult(fmt(d),[['Estimated birth year',d.getUTCFullYear()],['Reference date',fmt(r)],['Age used',`${Math.floor(age)} years`]]);}
 else if(c.mode==='eligibility'){const a=parseDate(v.dob),r=parseDate(v.ref),min=Number(v.minAge),max=Number(v.maxAge||999);if(!a||!r||r<a||!Number.isFinite(min)||!Number.isFinite(max)||max<min)throw Error('Enter valid dates and an age range with the maximum not below the minimum.');const x=calendarDiff(a,r);const ok=x.years>=min&&x.years<=max;setResult(ok?'Within the entered age range':'Outside the entered age range',[['Age on cutoff',`${x.years}y ${x.months}m ${x.days}d`],['Minimum',min],['Maximum',max],['Cutoff date',fmt(r)]]);}
 else if(c.mode==='threshold'||c.mode==='retirement'){const a=parseDate(v.dob),target=Number(v.targetAge);if(!a||!target)throw Error('Enter a birth date and target age.');const d=addYearsSafe(a,target);setResult(fmt(d),[['Target age',target],['Weekday',d.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})],['Days from today',daysBetween(new Date(Date.UTC(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())),d).toLocaleString()]]);}
 else if(c.mode==='dateShift'){const d=parseDate(v.date),amt=Number(v.amount)*(c.extra.direction||1);if(!d||!Number.isFinite(amt))throw Error('Enter a date and amount.');let out=new Date(d),u=c.extra.unit;if(u==='days')out.setUTCDate(out.getUTCDate()+amt);if(u==='weeks')out.setUTCDate(out.getUTCDate()+amt*7);if(u==='months')out=addMonthsSafe(out,amt);if(u==='years')out=addYearsSafe(out,amt);setResult(fmt(out),[['Starting date',fmt(d)],['Shift',`${amt} ${u}`],['Weekday',out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})]]);}
 else if(c.mode==='businessDays'){const a=parseDate(v.start),b=parseDate(v.end);if(!a||!b)throw Error('Enter both dates.');let s=a,e=b;if(e<s)[s,e]=[e,s];const skip=WEEKEND_SETS[v.weekend]||[0,6];const hol=holSet(s,e);const r=countWorkdays(s,e,skip,hol);let weekends=0;for(let d=new Date(s);d<=e;d.setUTCDate(d.getUTCDate()+1))if(skip.includes(d.getUTCDay()))weekends++;const total=Math.abs(daysBetween(a,b))+1;const names=global_H()&&holCode()!=='none'?window.Holidays.between(holCode(),s,e).filter(h=>!skip.includes(new Date(h.date+'T00:00:00Z').getUTCDay())).map(h=>h.name):[];setResult(`${r.days.toLocaleString()} working days`,[['Calendar days',total.toLocaleString()],['Weekend days',weekends.toLocaleString()],['Public holidays excluded',r.holidays],['Holiday calendar',holLabel()],['Weekend pattern',v.weekend||'Saturday & Sunday'],['Holidays in range',names.length?names.slice(0,4).join('; '):'None']]);}
 else if(c.mode==='weekInfo'){const d=parseDate(v.date);if(!d)throw Error('Enter a date.');const y=d.getUTCFullYear(),start=new Date(Date.UTC(y,0,1)),doy=daysBetween(start,d)+1,end=new Date(Date.UTC(y,11,31));setResult(d.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'}),[['ISO week',isoWeek(d)],['Day of year',doy],['Days left',daysBetween(d,end)],['Leap year',leap(y)?'Yes':'No']]);}
 else if(c.mode==='leapYear'){const y=Number(v.year);setResult(leap(y)?`${y} is a leap year`:`${y} is not a leap year`,[['Days in year',leap(y)?366:365],['February days',leap(y)?29:28],['Gregorian rule','4 / 100 / 400']]);}
 else if(c.mode==='gestational'||c.mode==='pregnancyDue'||c.mode==='fetalAge'||c.mode==='conception'){const l=parseDate(v.lmp),r=parseDate(v.ref)||new Date(),cycle=Number(v.cycle||28);if(!l)throw Error('Enter the first day of the last menstrual period.');const adj=cycle-28,due=new Date(l);due.setUTCDate(due.getUTCDate()+280+adj);const days=daysBetween(l,r),weeks=Math.floor(days/7),rem=((days%7)+7)%7;if(c.mode==='pregnancyDue')setResult(fmt(due),[['Estimated gestation','40 weeks'],['Cycle adjustment',`${adj} days`],['LMP',fmt(l)]]);else if(c.mode==='conception'){const con=new Date(l);con.setUTCDate(con.getUTCDate()+14+adj);setResult(fmt(con),[['Approx. window',`${fmt(new Date(con.getTime()-2*86400000))} – ${fmt(new Date(con.getTime()+2*86400000))}`],['Estimated due date',fmt(due)]]);}else if(c.mode==='fetalAge')setResult(`${Math.max(0,weeks-2)} weeks, ${rem} days (approx.)`,[['Gestational age',`${weeks}w ${rem}d`],['Estimated due date',fmt(due)],['Reference date',fmt(r)]]);else setResult(`${weeks} weeks, ${rem} days`,[['Estimated due date',fmt(due)],['Trimester',weeks<14?'First':weeks<28?'Second':'Third'],['Days to 40 weeks',Math.max(0,daysBetween(r,due))]]);}
 else if(c.mode==='correctedAge'){const dob=parseDate(v.dob),r=parseDate(v.ref),gw=Number(v.gestWeeks);if(!dob||!r||r<dob||!Number.isFinite(gw)||gw<20||gw>40)throw Error('Enter valid dates and gestation at birth between 20 and 40 weeks.');const chrono=daysBetween(dob,r),prem=Math.max(0,(40-gw)*7),corr=Math.max(0,chrono-prem);setResult(`${Math.floor(corr/7)} weeks, ${Math.round(corr%7)} days corrected`,[['Chronological age',`${Math.floor(chrono/7)} weeks`],['Prematurity adjustment',`${prem} days`],['Gestation at birth',`${gw} weeks`]]);}
 else if(c.mode==='wellnessAge'){let age=Number(v.age),sleep=Number(v.sleep),activity=Number(v.activity),rhr=Number(v.rhr||70),sm=v.smoking;let adj=0;adj+=(sleep<6||sleep>9)?2:(sleep>=7&&sleep<=9?-1:0);adj+=activity>=5?-2:activity<=1?2:0;adj+=rhr>90?2:rhr<65?-1:0;adj+=sm==='yes'?4:sm==='former'?1:0;const est=Math.max(13,Math.round(age+adj));setResult(`${est} years (educational estimate)`,[['Chronological age',age],['Lifestyle adjustment',`${adj>=0?'+':''}${adj} years`],['Active days',activity],['Sleep',`${sleep} h/night`]]);}
 else if(c.mode==='petAge'){const a=Number(v.petAge),s=c.extra.species;const factors={dog:a<=2?a*10.5:21+(a-2)*4,cat:a<=2?a*12.5:25+(a-2)*4,horse:a*3.5,rabbit:a*8,bird:a*5,turtle:a*2,fish:a*7.5};const eq=Math.round(factors[s]||a*5);setResult(`About ${eq} human-equivalent years`,[['Animal age',`${a} years`],['Species',s],['Model','Simplified educational comparison']]);}
 else if(c.mode==='treeAge'){const c1=Number(v.circumference),g=Number(v.growth);const diameter=c1/Math.PI,age=diameter*g;setResult(`About ${Math.round(age)} years`,[['Estimated diameter',`${diameter.toFixed(1)} in`],['Growth factor',g],['Method','Diameter × growth factor']]);}
 else if(c.mode==='planetAge'){const a=Number(v.earthAge),ratios={mercury:.2408467,venus:.61519726,mars:1.8808158,jupiter:11.862615,saturn:29.447498,uranus:84.016846,neptune:164.79132},p=v.planet;const pa=a/ratios[p];setResult(`${pa.toFixed(2)} ${p} years`,[['Earth age',`${a} years`],['Orbital-year ratio',ratios[p]],['Planet',p]]);}
 else if(c.mode==='anniversary'){const s=parseDate(v.start),r=parseDate(v.end),milestone=Number(v.milestone);if(!s||!r||r<s||!Number.isFinite(milestone)||milestone<1)throw Error('Enter valid dates and a milestone of at least 1 year.');const ann=addYearsSafe(s,Math.floor(milestone)),remaining=daysBetween(r,ann);setResult(fmt(ann),[['Milestone',`${Math.floor(milestone)} years`],[remaining>=0?'Days until':'Days since',Math.abs(remaining).toLocaleString()],['Status',remaining>0?'Upcoming':remaining===0?'Today':'Passed'],['Start date',fmt(s)]]);}
 else if(c.mode==='goldenBirthday'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date of birth.');const age=d.getUTCDate(),gold=addYearsSafe(d,age);setResult(fmt(gold),[['Golden age',age],['Weekday',gold.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})],['Birth day number',d.getUTCDate()]]);}
 else if(c.mode==='milestoneDays'){const d=parseDate(v.dob),n=Number(v.days);if(!d||!n)throw Error('Enter a birth date and milestone day count.');const out=new Date(d);out.setUTCDate(out.getUTCDate()+n);setResult(fmt(out),[['Milestone days',n.toLocaleString()],['Weekday',out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})],['Birth date',fmt(d)]]);}
 else if(c.mode==='halfBirthday'){const d=parseDate(v.dob);if(!d)throw Error('Enter a birth date.');const out=addMonthsSafe(d,6);setResult(fmt(out),[['Offset','6 calendar months'],['Weekday',out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})]]);}
 else if(c.mode==='weekdayBirthday'){const d=parseDate(v.dob),y=Number(v.year);if(!d||!y)throw Error('Enter date and year.');const out=new Date(Date.UTC(y,d.getUTCMonth(),Math.min(d.getUTCDate(),new Date(Date.UTC(y,d.getUTCMonth()+1,0)).getUTCDate())));setResult(out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'}),[['Birthday',fmt(out)],['Year',y],['Leap year',leap(y)?'Yes':'No']]);}
 else if(c.mode==='lifeStat'){const d=parseDate(v.dob),r=parseDate(v.ref),rate=Number(v.rate),stat=c.extra.stat;if(!d||!r||r<d||!Number.isFinite(rate)||rate<=0)throw Error('Enter valid dates and a positive rate or target.');const td=daysBetween(d,r);let value,label;if(stat==='heartbeats'){value=td*1440*rate;label='estimated heartbeats'}else if(stat==='breaths'){value=td*1440*rate;label='estimated breaths'}else if(stat==='sleep'){value=td*rate/24;label='estimated days asleep'}else if(stat==='custom'){value=td*rate/24;label=(c.extra.label||'estimated days')}else{value=(td/365.2425)/rate*100;label='of selected lifespan target'}setResult(`${Math.round(value).toLocaleString()} ${stat==='progress'?'%':label}`,[['Days lived',td.toLocaleString()],['Input rate/target',rate],['Method','Straight-line estimate']]);}
 else if(c.mode==='zodiac'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');const m=d.getUTCMonth()+1,day=d.getUTCDate();const signs=[['Capricorn',1,19],['Aquarius',2,18],['Pisces',3,20],['Aries',4,19],['Taurus',5,20],['Gemini',6,20],['Cancer',7,22],['Leo',8,22],['Virgo',9,22],['Libra',10,22],['Scorpio',11,21],['Sagittarius',12,21]];let sign='Capricorn';for(const [s,mo,last] of signs){if(m===mo&&day<=last){sign=s;break}if(m===mo)sign=signs[mo%12][0]}setResult(sign,[['Birth date',fmt(d)],['System','Western tropical zodiac'],['Use','Cultural / recreational']]);}
 else if(c.mode==='chineseZodiac'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');const animals=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];const y=d.getUTCFullYear(),animal=animals[(y-4)%12];setResult(animal,[['Birth year',y],['Cycle','12-year animal cycle'],['Note','Lunar-new-year boundaries can differ']]);}
 else if(c.mode==='birthProfile'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');const m=d.getUTCMonth();const profiles={birthstone:['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise'],flower:['Carnation','Violet','Daffodil','Daisy','Lily of the Valley','Rose','Larkspur','Gladiolus','Aster','Marigold','Chrysanthemum','Narcissus'],color:['Deep Red','Violet','Aqua','Clear White','Emerald','Pearl White','Ruby Red','Olive Green','Royal Blue','Amber','Golden Brown','Ice Blue'],season:['Winter','Winter','Spring','Spring','Spring','Summer','Summer','Summer','Autumn','Autumn','Autumn','Winter'],facts:['January profile','February profile','March profile','April profile','May profile','June profile','July profile','August profile','September profile','October profile','November profile','December profile']};const p=c.extra.profile||'facts';setResult(profiles[p][m],[['Month',d.toLocaleDateString(undefined,{month:'long',timeZone:'UTC'})],['Profile type',p],['Use','Traditional / recreational']]);}
 else if(c.mode==='numerology'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');let s=d.toISOString().slice(0,10).replaceAll('-','').split('').reduce((a,b)=>a+Number(b),0);while(s>9&&![11,22,33].includes(s))s=String(s).split('').reduce((a,b)=>a+Number(b),0);setResult(`Life path number ${s}`,[['Birth date',fmt(d)],['Method','Digit reduction'],['Use','Recreational numerology']]);}
 else if(c.mode==='moonPhase'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');const known=new Date(Date.UTC(2000,0,6,18,14)),cycle=29.53058867,days=(d-known)/86400000,phase=((days%cycle)+cycle)%cycle/cycle;const names=['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];const idx=Math.floor((phase*8)+.5)%8;setResult(names[idx],[['Approx. lunar age',`${(phase*cycle).toFixed(1)} days`],['Cycle used',`${cycle.toFixed(3)} days`],['Precision','Approximate']]);}
 else if(c.mode==='generation'){const d=parseDate(v.dob);if(!d)throw Error('Enter a date.');const y=d.getUTCFullYear();let g=y>=2013?'Generation Alpha':y>=1997?'Generation Z':y>=1981?'Millennial':y>=1965?'Generation X':y>=1946?'Baby Boomer':y>=1928?'Silent Generation':'Earlier cohort';setResult(g,[['Birth year',y],['Boundaries','Commonly used ranges'],['Note','Definitions vary by source']]);}

 else if(c.mode==='dateMidpoint'){const a=parseDate(v.start),b=parseDate(v.end);if(!a||!b)throw Error('Enter both dates.');const mid=new Date((a.getTime()+b.getTime())/2),td=Math.abs(daysBetween(a,b));setResult(fmt(mid),[['Elapsed days',td],['First half',Math.floor(td/2)],['Second half',Math.ceil(td/2)],['Midpoint weekday',mid.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})]]);}
 else if(c.mode==='inclusiveDays'){const a=parseDate(v.start),b=parseDate(v.end);if(!a||!b)throw Error('Enter both dates.');const base=Math.abs(daysBetween(a,b)),rule=v.inclusion;const add=rule==='both'?1:rule==='neither'?-1:0;setResult(`${Math.max(0,base+add)} counted days`,[['Elapsed interval',base],['Convention',rule],['Start date',fmt(a)],['End date',fmt(b)]]);}
 else if(c.mode==='businessShift'){const d=parseDate(v.date),amount=Number(v.amount);if(!d||!Number.isInteger(amount))throw Error('Enter a date and a whole number of working days.');const skip=WEEKEND_SETS[v.weekend]||[0,6];const out=new Date(d),dir=amount<0?-1:1;let left=Math.abs(amount),skipped=0,guard=0;const lo=new Date(d),hi=new Date(d);if(dir>0)hi.setUTCFullYear(hi.getUTCFullYear()+6);else lo.setUTCFullYear(lo.getUTCFullYear()-6);const hol=holSet(lo,hi);while(left&&guard++<20000){out.setUTCDate(out.getUTCDate()+dir);if(skip.includes(out.getUTCDay()))continue;if(hol.has(isoDay(out))){skipped++;continue}left--}setResult(fmt(out),[['Shift',`${amount} working days`],['Weekday',out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})],['Public holidays skipped',skipped],['Holiday calendar',holLabel()],['Calendar days elapsed',Math.abs(daysBetween(d,out)).toLocaleString()],['Start date',fmt(d)]]);}
 else if(c.mode==='recurringDate'){const first=parseDate(v.date),ref=parseDate(v.ref),n=Math.max(1,Math.floor(Number(v.interval))),u=v.unit;if(!first||!ref||!n)throw Error('Enter valid schedule values.');let out=new Date(first),guard=0;while(out<=ref&&guard++<10000){if(u==='days')out.setUTCDate(out.getUTCDate()+n);else if(u==='weeks')out.setUTCDate(out.getUTCDate()+n*7);else if(u==='months')out=addMonthsSafe(out,n);else out=addYearsSafe(out,n)}setResult(fmt(out),[['Repeat',`Every ${n} ${u}`],['Days from reference',daysBetween(ref,out)],['Weekday',out.toLocaleDateString(undefined,{weekday:'long',timeZone:'UTC'})]]);}
 else if(c.mode==='ageTimeline'){const a=parseDate(v.dob),r=parseDate(v.ref);if(!a||!r||r<a)throw Error('Enter a milestone on or after the birth date.');const x=calendarDiff(a,r),prev=addYearsSafe(a,x.years),next=addYearsSafe(a,x.years+1);setResult(`${x.years} years, ${x.months} months, ${x.days} days`,[['Milestone date',fmt(r)],['Previous birthday',fmt(prev)],['Next birthday',fmt(next)],['Days to next birthday',daysBetween(r,next)]]);}
 else if(c.mode==='leapBirthday'){const d=parseDate(v.dob),r=parseDate(v.ref);if(!d||!r||d.getUTCMonth()!==1||d.getUTCDate()!==29)throw Error('Enter a February 29 date of birth.');let y=Math.max(r.getUTCFullYear(),d.getUTCFullYear()+1);while(!leap(y)||new Date(Date.UTC(y,1,29))<r)y++;const next=new Date(Date.UTC(y,1,29));setResult(fmt(next),[['Days until',daysBetween(r,next)],['Age on that date',calendarDiff(d,next).years],['Following leap birthday',fmt(new Date(Date.UTC(y+4,1,29)))],['Policy note','Check local anniversary rules']]);}
 else if(c.mode==='anniversaryCountdown'){const s=parseDate(v.start),r=parseDate(v.ref);if(!s||!r||r<s)throw Error('Enter a reference date on or after the start date.');const served=calendarDiff(s,r),next=addYearsSafe(s,served.years+(addYearsSafe(s,served.years)<=r?1:0));setResult(`${daysBetween(r,next)} days until the next anniversary`,[['Completed service',`${served.years}y ${served.months}m ${served.days}d`],['Next anniversary',fmt(next)],['Anniversary number',calendarDiff(s,next).years]]);}
 else if(c.mode==='customTimeline'){const d=parseDate(v.dob),r=parseDate(v.ref),step=Math.max(1,Math.floor(Number(v.step)));if(!d||!r||!step)throw Error('Enter valid dates and a milestone interval.');let age=Math.max(step,Math.ceil(Math.max(0,calendarDiff(d,r).years)/step)*step);let dates=[];for(let i=0;i<4;i++)dates.push(addYearsSafe(d,age+i*step));setResult(fmt(dates[0]),dates.map((x,i)=>[`Milestone ${age+i*step} years`,fmt(x)]));}

 else if(c.mode==='koreanAge'){const d=parseDate(v.dob),r=parseDate(v.ref);if(!d||!r||r<d)throw Error('Enter a birth date and a reference date on or after it.');const intl=calendarDiff(d,r).years,yearDiff=r.getUTCFullYear()-d.getUTCFullYear();const korean=yearDiff+1,eastAsian=yearDiff+1;const primary=c.extra.system==='kazoedoshi'?`${eastAsian} (traditional count)`:`${korean} (Korean age)`;setResult(primary,[['International age',`${intl} years`],['Calendar-year difference',yearDiff],['Birth year',d.getUTCFullYear()],['Reference year',r.getUTCFullYear()],['Note','Since 2023 South Korea uses international age for most official purposes']]);}
 else if(c.mode==='isoWeekConvert'){const y=Number(v.isoYear),w=Number(v.isoWeek);if(!Number.isInteger(y)||!Number.isInteger(w)||w<1||w>53)throw Error('Enter an ISO week-year and a week number between 1 and 53.');const start=isoWeekYearStart(y);const monday=new Date(start);monday.setUTCDate(start.getUTCDate()+(w-1)*7);if(isoWeek(monday)!==w||monday.getUTCFullYear()>y+1)throw Error(`ISO week ${w} does not exist in week-year ${y}.`);const names=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];const idx=Math.max(0,names.indexOf(v.isoDay||'Monday'));const target=new Date(monday);target.setUTCDate(monday.getUTCDate()+idx);const sunday=new Date(monday);sunday.setUTCDate(monday.getUTCDate()+6);setResult(fmt(target),[['Week starts (Mon)',fmt(monday)],['Week ends (Sun)',fmt(sunday)],['Selected weekday',names[idx]],['ISO designation',`${y}-W${String(w).padStart(2,'0')}-${idx+1}`]]);}
 else if(c.mode==='quarterInfo'){const d=parseDate(v.date);if(!d)throw Error('Enter a date.');const fsIdx=Math.max(0,MONTHS.indexOf(v.fyStart||'January'));const m=d.getUTCMonth();const offset=((m-fsIdx)+12)%12;const q=Math.floor(offset/3)+1;const qStartMonthAbs=d.getUTCFullYear()*12+m-(offset%3);const qs=new Date(Date.UTC(Math.floor(qStartMonthAbs/12),qStartMonthAbs%12,1));const qe=new Date(Date.UTC(Math.floor((qStartMonthAbs+3)/12),(qStartMonthAbs+3)%12,0));const fyLabel=fsIdx===0?String(d.getUTCFullYear()):(m>=fsIdx?`${d.getUTCFullYear()}/${d.getUTCFullYear()+1}`:`${d.getUTCFullYear()-1}/${d.getUTCFullYear()}`);const primary=c.extra.emphasis==='end'?fmt(qe):`Q${q}`+(fsIdx===0?' (calendar year)':' (fiscal year)');setResult(primary,[['Quarter',`Q${q}`],['Quarter starts',fmt(qs)],['Quarter ends',fmt(qe)],['Days in quarter',daysBetween(qs,qe)+1],['Days remaining',Math.max(0,daysBetween(d,qe))],['Fiscal year',fyLabel]]);}
 else if(c.mode==='workingHours'){const a=parseDate(v.start),b=parseDate(v.end),h=Number(v.hoursPerDay);if(!a||!b||!Number.isFinite(h)||h<=0)throw Error('Enter both dates and a positive number of hours per working day.');const skip=WEEKEND_SETS[v.weekend]||[0,6];const hol=holSet(a<b?a:b,a<b?b:a);const r=countWorkdays(a,b,skip,hol);const days=r.days;const hours=days*h;setResult(`${hours.toLocaleString(undefined,{maximumFractionDigits:1})} working hours`,[['Working days',days.toLocaleString()],['Hours per day',h],['Calendar days',(Math.abs(daysBetween(a,b))+1).toLocaleString()],['Public holidays excluded',r.holidays],['Hours lost to holidays',(r.holidays*h).toLocaleString()],['Holiday calendar',holLabel()]]);}
 else if(c.mode==='tzDateDiff'){const sRaw=v.startDT,eRaw=v.endDT;if(!sRaw||!eRaw)throw Error('Enter both local date-times.');const so=Number(v.startOffset||0),eo=Number(v.endOffset||0);const s=new Date(`${sRaw}:00Z`),e=new Date(`${eRaw}:00Z`);if(isNaN(s)||isNaN(e))throw Error('Enter both local date-times.');const sUTC=new Date(s.getTime()-so*3600000),eUTC=new Date(e.getTime()-eo*3600000);const ms=eUTC-sUTC,abs=Math.abs(ms);const hrs=abs/3600000;setResult(`${Math.floor(hrs).toLocaleString()} h ${Math.round((abs%3600000)/60000)} min`,[['Total days',(abs/86400000).toFixed(3)],['Direction',ms<0?'End precedes start':'End follows start'],['Start in UTC',fmtDT(sUTC)],['End in UTC',fmtDT(eUTC)],['Offset difference',`${(eo-so>=0?'+':'')}${(eo-so)} h`],['Note','Fixed offsets; daylight saving is not applied']]);}
 else if(c.mode==='countdown'){const r=parseDate(v.ref)||new Date();let target,label=c.extra.label||'Target date';if(c.extra.fixed){const [mm,dd]=c.extra.fixed.split('-').map(Number);target=new Date(Date.UTC(r.getUTCFullYear(),mm-1,dd));if(target<r)target=new Date(Date.UTC(r.getUTCFullYear()+1,mm-1,dd));}else{target=parseDate(v.target);}if(!target)throw Error('Enter a target date.');const days=daysBetween(r,target);const metrics=[[label,fmt(target)],['Weekday',weekdayOf(target)],['Whole weeks',Math.floor(Math.abs(days)/7).toLocaleString()],['Weekdays remaining',countWeekdays(r,target,[0,6]).toLocaleString()]];if(c.extra.context==='pregnancy'){const lmp=new Date(target);lmp.setUTCDate(lmp.getUTCDate()-280);const gest=daysBetween(lmp,r);metrics.push(['Gestational age',`${Math.floor(gest/7)}w ${((gest%7)+7)%7}d`]);metrics.push(['Trimester',gest<98?'First':gest<196?'Second':'Third']);}setResult(days>=0?`${days.toLocaleString()} days to go`:`${Math.abs(days).toLocaleString()} days ago`,metrics);}
 else if(c.mode==='reverseDue'){let lmp,due;if(c.extra.basis==='ivf'){const t=parseDate(v.transfer);if(!t)throw Error('Enter the embryo transfer date.');const embryoDay=Number((v.embryoDay||'Day 5').replace(/\D/g,''))||5;due=new Date(t);due.setUTCDate(due.getUTCDate()+(280-14-embryoDay));lmp=new Date(due);lmp.setUTCDate(lmp.getUTCDate()-280);}else{const r=parseDate(v.ref),w=Number(v.weeks),d=Number(v.days||0);if(!r||!Number.isFinite(w)||w<0||w>42||d<0||d>6)throw Error('Enter a reference date, gestational weeks (0–42) and days (0–6).');lmp=new Date(r);lmp.setUTCDate(lmp.getUTCDate()-(w*7+d));due=new Date(lmp);due.setUTCDate(due.getUTCDate()+280);}const today=parseDate(v.ref)||new Date();const gest=daysBetween(lmp,today);setResult(fmt(due),[['Implied LMP',fmt(lmp)],['Gestational age today',`${Math.floor(gest/7)}w ${((gest%7)+7)%7}d`],['Days to due date',daysBetween(today,due)],['Trimester',gest<98?'First':gest<196?'Second':'Third'],['Model','280-day / 40-week standard'],['Note','Clinical and ultrasound dating take precedence']]);}
 else if(c.mode==='sleepDebt'){const n=Number(v.nights),a=Number(v.actual),t=Number(v.target);if(!Number.isFinite(n)||n<1||!Number.isFinite(a)||!Number.isFinite(t)||t<=0)throw Error('Enter a night count, an average and a target in hours.');const perNight=t-a,total=perNight*n;setResult(total>0?`${total.toFixed(1)} hours of sleep debt`:`${Math.abs(total).toFixed(1)} hours above target`,[['Shortfall per night',`${perNight.toFixed(2)} h`],['Nights counted',n.toLocaleString()],['Total slept',`${(a*n).toFixed(1)} h`],['Target total',`${(t*n).toFixed(1)} h`],['Equivalent nights',`${(Math.abs(total)/t).toFixed(2)}`],['Note','Educational estimate, not a clinical sleep assessment']]);}

 else if(c.mode==='holidayList'){const a=parseDate(v.start),b=parseDate(v.end);if(!a||!b)throw Error('Enter both dates.');if(!global_H())throw Error('Holiday data is still loading. Try again in a moment.');const code=v.holidays||'none';if(code==='none')throw Error('Choose a holiday calendar.');let s=a,e=b;if(e<s)[s,e]=[e,s];const list=window.Holidays.between(code,s,e);const skip=WEEKEND_SETS[v.weekend]||[0,6];const onWork=list.filter(h=>!skip.includes(new Date(h.date+'T00:00:00Z').getUTCDay()));const total=Math.abs(daysBetween(s,e))+1;const metrics=[['Calendar','' + window.Holidays.label(code)],['Date range',`${fmt(s)} – ${fmt(e)}`],['Calendar days',total.toLocaleString()],['Falling on a working day',onWork.length],['Substitute days',list.filter(h=>h.moved).length]];list.slice(0,9).forEach(h=>metrics.push([h.name,fmt(parseDate(h.date))]));setResult(`${list.length} public holiday${list.length===1?'':'s'}`,metrics);}
 else throw Error('Calculator configuration is not supported.');
 }catch(e){setResult('Check your inputs',[['Message',e.message||'Please review the form values.']]);}}

/* ---------- Shareable results: read + write the query string ---------- */
function readParams(){
 const p=new URLSearchParams(location.search); let filled=false;
 $$('[data-field]').forEach(el=>{const val=p.get(el.id); if(val!==null&&val!==''){el.value=val; filled=true}});
 return filled;
}
function currentParams(){
 const p=new URLSearchParams();
 $$('[data-field]').forEach(el=>{if(el.value)p.set(el.id,el.value)});
 return p;
}
function syncUrl(){
 const p=currentParams(); const qs=p.toString();
 history.replaceState(null,'',qs?`${location.pathname}?${qs}`:location.pathname);
}
function shareUrl(){
 const p=currentParams(); const qs=p.toString();
 return `${location.origin}${location.pathname}${qs?`?${qs}`:''}`;
}
function toast(message){
 let el=$('.copy-toast');
 if(!el){el=document.createElement('div');el.className='copy-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el)}
 el.textContent=message; el.classList.add('is-visible');
 clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('is-visible'),2600);
}
async function copyText(text,message){
 try{await navigator.clipboard.writeText(text)}
 catch(err){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove()}
 toast(message);
}
function resultText(){
 const primary=$('#primaryResult')?.textContent?.trim()||'';
 const metrics=$$('#resultMetrics .metric').map(m=>`${m.querySelector('span')?.textContent||''}: ${m.querySelector('strong')?.textContent||''}`);
 const inputs=$$('[data-field]').map(el=>{const label=document.querySelector(`label[for="${el.id}"]`)?.textContent||el.id;return `${label}: ${el.value||'—'}`});
 const name=(window.CALC_CONFIG&&window.CALC_CONFIG.name)||document.title;
 return [name,'','Inputs:',...inputs,'','Result:',primary,...metrics,'',`Source: ${shareUrl()}`].join('\n');
}

/* ---------- Reading progress + in-page nav highlighting ---------- */
function initReadingProgress(){
 const body=$('.article-body'); if(!body)return;
 const bar=document.createElement('div'); bar.className='reading-progress'; bar.setAttribute('aria-hidden','true');
 document.body.appendChild(bar);
 const update=()=>{const rect=body.getBoundingClientRect(),total=rect.height-window.innerHeight;
  const done=total<=0?1:Math.min(1,Math.max(0,-rect.top/total)); bar.style.width=`${done*100}%`};
 addEventListener('scroll',update,{passive:true}); addEventListener('resize',update,{passive:true}); update();
}
function initSectionTracking(){
 const links=[...$$('.article-toc a'),...$$('.jumpbar a')].filter(a=>a.getAttribute('href')?.startsWith('#'));
 if(!links.length)return;
 const targets=links.map(a=>({link:a,el:document.getElementById(a.getAttribute('href').slice(1))})).filter(t=>t.el);
 if(!targets.length)return;
 const mark=()=>{const y=window.scrollY+140; let active=targets[0];
  targets.forEach(t=>{if(t.el.offsetTop<=y)active=t});
  targets.forEach(t=>t.link.classList.toggle('is-current',t===active))};
 addEventListener('scroll',mark,{passive:true}); mark();
}

function initNavigation(){
 const navDropdowns=$$('details.nav-dropdown');
 const desktopHover=()=>matchMedia('(min-width:901px) and (hover:hover)').matches;
 navDropdowns.forEach(dropdown=>{
  dropdown.addEventListener('toggle',()=>{if(dropdown.open)navDropdowns.forEach(other=>{if(other!==dropdown)other.open=false})});
  dropdown.addEventListener('keydown',event=>{if(event.key==='Escape'){dropdown.open=false;dropdown.querySelector('summary')?.focus()}});
  dropdown.addEventListener('pointerenter',()=>{if(desktopHover())dropdown.open=true});
  dropdown.addEventListener('pointerleave',()=>{if(desktopHover())dropdown.open=false});
 });
 document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))navDropdowns.forEach(dropdown=>dropdown.open=false)});
 const menuBtn=$('.menu-btn'),navRoot=$('.nav');
 menuBtn?.addEventListener('click',()=>{const open=navRoot.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navRoot?.classList.contains('open')){navRoot.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');menuBtn?.focus()}});
 $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{navRoot?.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
}
function initLiveSections(){
 const sections=$$('.visual-section,.category-block,.featured-tools,.why-strip,.category-directory-intro,.home-goals,.home-proof,.article-feature,.article-layout,.section');
 sections.forEach(section=>{
  section.classList.add('section-live');
  section.addEventListener('pointerenter',()=>section.classList.add('is-active'));
  section.addEventListener('pointerleave',()=>section.classList.remove('is-active'));
  section.addEventListener('focusin',()=>section.classList.add('is-active'));
  section.addEventListener('focusout',()=>{if(!section.contains(document.activeElement))section.classList.remove('is-active')});
 });
}
function init(){
 const today=new Date(),tz=today.getTimezoneOffset()*60000,local=new Date(today-tz).toISOString().slice(0,10);
 const applyDefaults=()=>{
  $$('input[data-default="today"]').forEach(x=>{if(!x.value)x.value=local});
  $$('[data-field][data-preset]').forEach(x=>{if(!x.value)x.value=x.dataset.preset});
 };
 applyDefaults();

 const form=$('#calcForm');
 if(form){
  const prefilled=readParams();
  applyDefaults();
  form.addEventListener('submit',e=>{e.preventDefault();calc();syncUrl()});
  if(prefilled)calc();
  ['holidays','weekend'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>{
   if($('#primaryResult')&&!/will appear here|Ready when/.test($('#primaryResult').textContent)){calc();syncUrl()}
  }));
 }

 $('#resetBtn')?.addEventListener('click',()=>{
  form?.reset();
  $$('input[data-default="today"]').forEach(x=>x.value=local);
  applyDefaults();
  history.replaceState(null,'',location.pathname);
  setResult('Your result will appear here',[['Ready','Enter the required values']]);
  const hint=$('#resultHint'); if(hint)hint.textContent='Review the inputs and select Calculate.';
 });

 $('#copyBtn')?.addEventListener('click',()=>copyText(resultText(),'Result copied to clipboard'));
 $('#printBtn')?.addEventListener('click',()=>window.print());
 $('#shareBtn')?.addEventListener('click',async()=>{
  syncUrl();
  const url=shareUrl();
  if(navigator.share){try{await navigator.share({title:document.title,url});return}catch(err){if(err&&err.name==='AbortError')return}}
  copyText(url,'Shareable link copied');
 });

 /* Tool + guide filtering on directory pages */
 $$('#toolSearch').forEach(input=>input.addEventListener('input',()=>{
  const q=input.value.trim().toLowerCase();
  let shown=0;
  $$('[data-tool-card]').forEach(card=>{
   const hit=!q||card.textContent.toLowerCase().includes(q);
   card.style.display=hit?'':'none'; if(hit)shown++;
  });
  const status=$('#searchStatus'); if(status)status.textContent=q?`${shown} matching tools`:'';
  $$('[data-tool-group]').forEach(group=>{
   const any=[...group.querySelectorAll('[data-tool-card]')].some(c=>c.style.display!=='none');
   group.style.display=any?'':'none';
  });
 }));

 /* Goal finder on the homepage */
 const goalFilter=$('#goalFilter');
 if(goalFilter){
  const cards=$$('[data-goal]');
  const status=$('#goalStatus');
  goalFilter.addEventListener('change',()=>{
   const value=goalFilter.value; let shown=0;
   cards.forEach(card=>{
    const hit=value==='all'||card.dataset.goal.split(' ').includes(value);
    card.hidden=!hit; if(hit)shown++;
   });
   if(status)status.textContent=`${shown} calculator${shown===1?'':'s'} shown`;
  });
 }

 $('#copyEmail')?.addEventListener('click',()=>{
  copyText('navjeet8595@gmail.com','Email address copied');
  const s=$('#copyEmailStatus'); if(s)s.textContent='Address copied. There is no contact form on this site, so nothing passes through a third-party service.';
 });
 initNavigation();initLiveSections();initReadingProgress();initSectionTracking();
}
document.addEventListener('DOMContentLoaded',init);

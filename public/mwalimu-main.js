// Mwalimu Family - Bulletproof Client Bundle
(function() {
  'use strict';

  function init() {
    var hero = document.querySelector('.hero');
    var header = document.querySelector('header');
    var menu = document.getElementById('menu');
    if (!hero || !header || !menu) {
      setTimeout(init, 40);
      return;
    }

    // Set configuration
    window.MF_API = window.location.origin;
    window.MF_FEED = '/feed.json';

    try {
      // --- Script 1 ---
      try {
        (function(){
        var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
        var bar=$('.bar')[0],hero=$('.hero')[0],sc=$('.scene'),hd=$('header')[0],links=$('nav a'),secs=$('main section[id]');
        var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
        function onS(){
        var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
        bar.style.width=(h>0?y/h*100:0)+'%';
        hd.classList.toggle('sol',y>40);
        if(!rm){var r=hero.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
        hero.style.setProperty('--p',p.toFixed(3));
        var i=Math.min(2,Math.floor(p*3));sc.forEach(function(s,k){s.classList.toggle('on',k===i)})}
        }
        addEventListener('scroll',onS,{passive:true});onS();
        var tg=$('.tg')[0],menu=$('#menu')[0];
        tg.addEventListener('click',function(){var o=menu.classList.toggle('open');hd.classList.toggle('open',o);tg.setAttribute('aria-expanded',o)});
        links.forEach(function(l){l.addEventListener('click',function(){menu.classList.remove('open');hd.classList.remove('open');tg.setAttribute('aria-expanded','false')})});
        function count(el){var to=+el.dataset.to,t0=null;if(rm){el.textContent=to.toLocaleString('en-US');return}
        function f(t){t0=t0||t;var k=Math.min(1,(t-t0)/1600);el.textContent=Math.round(to*(1-Math.pow(1-k,3))).toLocaleString('en-US');if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
        if('IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');if(e.target.classList.contains('num'))count(e.target);io.unobserve(e.target)}})},{threshold:.15});
        $('.rv,.num').forEach(function(el){io.observe(el)})}else{$('.rv').forEach(function(el){el.classList.add('in')});$('.num').forEach(count)}
        $('[data-filter]').forEach(function(g){
        var box=$(g.dataset.filter)[0],items=$('[data-k]',box),one=g.hasAttribute('data-one'),em=$('.empty',box)[0];
        $('.chip',g).forEach(function(b){b.addEventListener('click',function(){
        $('.chip',g).forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});
        b.classList.add('on');b.setAttribute('aria-pressed','true');
        var v=b.dataset.v,n=0;
        items.forEach(function(it){var k=it.dataset.k,show=one?k===v:(v==='all'||k===v||k==='all');it.hidden=!show;if(show)n++});
        if(em)em.hidden=n>0})})});
        })();
        
        (function(){
        var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
        var A={
        s1:{t:'2026 KJSEA results expected in December as KCSE results targeted for January 2027',l:'News',d:'20 November 2026',c:['Education CS Julius Ogamba has announced the expected release timelines for the 2026 national examinations. KJSEA results are expected in December, while KCSE and KPSEA results are targeted for January 2027.','The KCSE had 1,048,355 candidates across 10,693 examination centres. KJSEA marking involves 13,484 examiners working at 24 marking centres.','Parents are advised to wait for official announcements before acting on social media rumours about release dates.'],r:['s2']},
        s2:{t:'What parents and learners should know about the KJSEA and KCSE timelines',l:'Analysis',d:'20 November 2026',c:['Release dates are targets, not guarantees. Families should plan around a window, not a single day.','While you wait: keep revision light and steady, agree who in the family will check official channels, and gather any documents the school may ask for.','Check results only through official Ministry of Education and KNEC channels, and be wary of messages asking you to pay to see results.'],r:['s1']},
        s4:{t:'How to spot fake KJSEA and KCSE results messages',l:'Explainer',d:'21 November 2026',c:['Every results season, fake messages circulate on social media and WhatsApp offering early results for a fee.','Red flags: a request for money, an unofficial number or link, pressure to act fast, or a request for your child’s index number and personal details.','Use only official Ministry of Education and KNEC channels, and report suspicious messages to the authorities.'],r:['s1','s2']}};
        A.s2.r=['s1','s4'];A.s1.r=['s2','s4'];A.s1.x=A.s2.x=['#notices','KJSEA countdown and Grade 10 checklist'];A.s4.x=['#parents','Open the Parents’ hub'];
        A.s5={t:'KPSEA, KJSEA and KCSE explained: how Kenya’s national assessments fit together',l:'Explainer',d:'21 November 2026',c:['Kenya has three national assessments that families hear about most. KPSEA comes at the end of Grade 6, KJSEA at the end of Grade 9 in Junior School, and KCSE at the end of secondary school.','Each one answers a different question. KPSEA marks the move from primary to Junior School, KJSEA informs placement into Grade 10 and the senior school pathways, and KCSE feeds university, college and TVET placement through KUCCPS.'],k:['KPSEA: end of Grade 6','KJSEA: end of Grade 9, Junior School','KCSE: end of secondary school','Results for 2026: KJSEA expected December, KPSEA and KCSE targeted January 2027'],m:['Know which assessment your child is preparing for, and ask the school how it will be used for placement.','Follow the Ministry of Education and KNEC for official dates and procedures.'],q:[['Which exam does my Grade 9 learner sit?','KJSEA, at the end of Junior School.'],['Where are results released?','Through official Ministry of Education and KNEC channels only. See the exams hub for safety tips.']],r:['s1','s4']};
        A.s1.k=['Announced by Education CS Julius Ogamba on 20 November 2026','KJSEA results expected in December 2026','KCSE and KPSEA results targeted for January 2027','1,048,355 KCSE candidates at 10,693 examination centres','13,484 KJSEA examiners at 24 marking centres'];
        A.s1.m=['Plan around the December window for KJSEA and the January window for KCSE and KPSEA, and treat all dates as targets.','Wait for official announcements before acting on social media rumours.'];
        A.s1.q=[['Will results be released on a fixed day?','The dates announced are targets, not guarantees. Watch official channels for confirmation.'],['Where should I check results?','Only through official Ministry of Education and KNEC channels. Never pay to see results early.'],['Why do the three exams have different dates?','They are separate assessments at different levels, each marked and processed on its own timeline.']];
        A.s2.k=['Release dates are targets, not guarantees','Plan around a window, not a single day','Use official channels only'];
        A.s2.q=[['What should we do while waiting?','Keep revision light and steady, agree who checks official channels, and gather documents the school may ask for.']];
        A.s4.k=['Red flag: any request for money','Red flag: unofficial number or link','Red flag: pressure to act fast','Red flag: asks for your child’s index number or personal details'];
        A.s4.m=['If a message offers early results, do not reply or pay. Report it to the authorities and warn other families.'];
        A.s4.q=[['Can anyone release results early for a fee?','No. Only official Ministry of Education and KNEC channels release results.'],['What should I do if I already shared details?','Contact your school and the authorities promptly, and avoid replying further.']];
        A.s1.r=['s2','s4','s5'];A.s2.r=['s1','s4','s5'];A.s4.r=['s1','s2','s5'];A.s5.x=['#exams','Open the Exams hub'];
        var SRC='<p class="src"><strong>Sources:</strong> <a href="https://www.education.go.ke" target="_blank" rel="noopener">Ministry of Education</a>, <a href="https://www.knec.ac.ke" target="_blank" rel="noopener">KNEC</a>. <strong>Corrections:</strong> none to date.</p>';
        var V=$('#view')[0],M=$('main')[0],T0=document.title;
        function ld(a){var o=document.getElementById('ldj');if(o)o.remove();if(!a)return;var e=document.createElement('script');e.type='application/ld+json';e.id='ldj';e.textContent=JSON.stringify({'@context':'https://schema.org','@type':'NewsArticle',headline:a.t,datePublished:a.d,author:{'@type':'Organization',name:'Mwalimu Family News Desk'}});document.head.appendChild(e)}
        var PG=['games','courses','help','exams','news','library','parents','teaching','tools','notices','tutoring','jobs','advertise','activity','videos','about','contact'],LK=$('nav a');
        function act(id){LK.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+id)})}
        function route(){var h=location.hash,a=A[h.slice(2)];if(h.indexOf('#/grade/')===0){gp(decodeURIComponent(h.slice(8)));return}
        if(a){var u=location.href,wa='https://wa.me/?text='+encodeURIComponent(a.t+' '+u);
        V.innerHTML='<article class="art"><a href="#news" class="dl">← All news</a><h1>'+a.t+'</h1><p class="by"><span class="lab">'+a.l+'</span>By Mwalimu Family News Desk · Published '+a.d+' · Last updated '+a.d+' · '+Math.max(1,Math.round(a.c.join(' ').split(' ').length/200))+' min read</p>'+(a.k?'<div class="warn"><h3 style="color:var(--hd)">Key facts</h3><ul class="kf">'+a.k.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul></div>':'')+a.c.map(function(x){return'<p>'+x+'</p>'}).join('')+(a.m?'<h2 style="font-size:1.5rem;margin-top:2rem">What it means for you</h2>'+a.m.map(function(x){return'<p>'+x+'</p>'}).join(''):'')+(a.q?'<h2 style="font-size:1.5rem;margin-top:2rem">Frequently asked questions</h2><div class="fq">'+a.q.map(function(x){return'<details><summary>'+x[0]+'</summary><p>'+x[1]+'</p></details>'}).join('')+'</div>':'')+'<a class="btn wab" href="'+wa+'" target="_blank" rel="noopener">Share on WhatsApp</a>'+SRC+(a.x?'<p><a class="dl" href="'+a.x[0]+'">'+a.x[1]+' →</a></p>':'')+'<h2 style="font-size:1.6rem;margin-top:2rem">Related stories</h2>'+a.r.map(function(k){return'<p><a class="dl" href="#/'+k+'">'+A[k].t+'</a></p>'}).join('')+'</article>';
        V.hidden=false;M.hidden=true;document.body.classList.add('vw');document.title=a.t+' — Mwalimu Family';ld(a);scrollTo({top:0,behavior:'instant'});act('');return}
        var id=h.replace('#',''),home=PG.indexOf(id)<0,vis=home?['home','find','haud','hstats','hweek','hnews','hnew','htools','htl','hcount','hvid','habout','hcta']:[id];
        $('main>section').forEach(function(x){x.hidden=vis.indexOf(x.id)<0});V.hidden=true;M.hidden=false;document.body.classList.toggle('vw',!home);
        var t=home?T0:($('h1,h2',document.getElementById(id))[0]||{}).textContent+' — Mwalimu Family';document.title=t;ld();act(id);scrollTo({top:0,behavior:'instant'})}
        addEventListener('hashchange',route);route();
        var G=['PP1','PP2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Form 1','Form 2','Form 3','Form 4'];
        var SB=[['Literacy','Mathematics','Kiswahili','English','Environmental Activities','Religious Education','Creative Activities'],['Mathematics','English','Kiswahili','Science and Technology','Social Studies','Agriculture and Nutrition','Religious Education','Creative Arts'],['Mathematics','English','Kiswahili','Integrated Science','Social Studies','Agriculture and Nutrition','Pre-Technical Studies','Creative Arts and Sports','Religious Education'],['English','Kiswahili','Core Mathematics','Community Service Learning','Physical Education','Biology','Chemistry','Physics','General Science','Essential Mathematics','Computer Studies','Agriculture','Home Science','Business Studies','Geography','History and Citizenship','Literature in English','Fasihi ya Kiswahili','Christian Religious Education','Islamic Religious Education','Fine Arts','Music and Dance','Theatre and Film','Sports and Recreation'],['Mathematics','English','Kiswahili','Biology','Chemistry','Physics','History','Geography','CRE','IRE','Business Studies','Computer Studies','Agriculture','Home Science','Literature in English']];
        function subs(g){var i=G.indexOf(g);return SB[i<5?0:i<8?1:i<11?2:i<14?3:4]}
        var TY=[['Scheme','scheme'],['Lesson plan','lesson'],['Notes','notes'],['Exam','exam'],['Record','record']],TE=['Term 1','Term 2','Term 3'],EM=[[/math|numer/i,'🔢'],[/english|literacy/i,'📖'],[/kiswahili/i,'🗣️'],[/science|biology|physics|chem/i,'🔬'],[/social|history|geograph|citizen/i,'🌍'],[/agri/i,'🌱'],[/relig|cre/i,'🕊️'],[/art|creative/i,'🎨'],[/tech|computer/i,'🛠️'],[/business/i,'💼'],[/physical|sport/i,'⚽']];
        function emo(x){for(var i=0;i<EM.length;i++)if(EM[i][0].test(x))return EM[i][1];return'📚'}
        function hs(x){var h=0;for(var i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))%360;return h}
        var HD0='<p>School: ________ Teacher: ________ Grade: ____ Subject: ________ Term: ____ Year: ____</p>',HD=HD0;
        function lc(x){return/math|numer/i.test(x)?'use shillings, market prices, matatu fares and farm measurements as examples.':/english|literacy|kiswahili/i.test(x)?'use local stories, methali, nahau and community news as texts.':/science|biology|physics|chem/i.test(x)?'use the school garden, local water sources, weather and household items.':/social|history|geograph|citizen/i.test(x)?'use your county, local leaders and community history.':/agri|nutrition/i.test(x)?'use crops, livestock and foods grown in your area.':'link the topic to learners’ homes, markets and community projects.'}
        function mk(k,g,sj,t){if(g)HD='<p>School: ________ Teacher: ________ Grade: <b>'+g+'</b> Subject: <b>'+esc(sj)+'</b> Term: <b>'+t+'</b> Year: <b>2026</b></p><p><i>Local context idea: '+lc(sj)+'</i></p>';var r=D[k]();HD=HD0;return r}
        function sv(){try{return JSON.parse(localStorage.getItem('mfs')||'[]')}catch(e){return[]}}
        function cov(g,sj){var h=hs(sj);return'<div class="cv" style="background:repeating-linear-gradient(45deg,rgba(255,255,255,.09) 0 6px,transparent 6px 16px),linear-gradient(135deg,hsl('+h+' 55% 26%),hsl('+(h+40)+' 60% 40%))"><span>'+emo(sj)+'</span><small>'+g+'</small></div>'}
        function card(g,sj,t,ty){var id=[g,sj,t,ty].join('|'),on=sv().indexOf(id)>-1,wa='https://wa.me/?text='+encodeURIComponent(g+' '+sj+' '+t+' '+ty+' teaching material, free: '+location.href.split('#')[0]+'#library');
        return'<div class="mc">'+cov(g,sj)+'<div class="mb"><h3>'+esc(sj)+'</h3><p>'+t+' · <b>'+ty+'</b> · Word</p><div><button class="gb dl2" data-id="'+id+'">Download</button><button class="gb o sv2" data-id="'+id+'">'+(on?'★ Saved':'☆ Save')+'</button><a class="gb o" href="'+wa+'" target="_blank" rel="noopener">Share</a></div></div></div>'}
        var F={g:'',s:'',t:'',y:'',q:'',n:24},lgd=$('#lg')[0];
        function items(){var o=[];G.forEach(function(g){if(F.g&&g!==F.g)return;subs(g).forEach(function(sj){if(F.s&&sj!==F.s)return;TE.forEach(function(t){if(F.t&&t!==F.t)return;TY.forEach(function(y){if(F.y&&y[0]!==F.y)return;if(F.q&&(g+' '+sj+' '+t+' '+y[0]).toLowerCase().indexOf(F.q)<0)return;o.push([g,sj,t,y[0]])})})})});return o}
        function rl(){var o=items();lgd.innerHTML=o.slice(0,F.n).map(function(x){return card.apply(0,x)}).join('');$('#fc')[0].textContent=o.length.toLocaleString('en-US')+' editable templates';$('#mo')[0].hidden=o.length<=F.n;rs()}
        function rs(){var a=sv();$('#sv')[0].innerHTML=a.length?a.map(function(i){return card.apply(0,i.split('|'))}).join(''):'<p class="empty">Tap ☆ Save on any material and it will appear here (saved on this device).</p>'}
        function fs(){var l=F.g?subs(F.g):[].concat.apply([],SB).filter(function(x,i,a){return a.indexOf(x)===i});$('#fs')[0].innerHTML='<option value="">All subjects</option>'+l.map(function(x){return'<option>'+x+'</option>'}).join('')}
        $('#fg')[0].innerHTML='<option value="">All grades</option>'+G.map(function(g){return'<option value="'+g+'">'+g+(/^Form/.test(g)?' (8.4.4 legacy)':'')+'</option>'}).join('');fs();
        $('#fy')[0].innerHTML=['All'].concat(TY.map(function(t){return t[0]})).map(function(t,i){return'<button class="chip'+(i?'':' on')+'" data-v="'+(i?t:'')+'">'+t+'</button>'}).join('');
        $('#fg')[0].onchange=function(){F.g=this.value;F.s='';fs();F.n=24;rl()};$('#fs')[0].onchange=function(){F.s=this.value;F.n=24;rl()};$('#ft')[0].onchange=function(){F.t=this.value;F.n=24;rl()};
        $('#fy .chip').forEach(function(b){b.onclick=function(){$('#fy .chip').forEach(function(x){x.classList.toggle('on',x===b)});F.y=b.dataset.v;F.n=24;rl()}});
        $('#mo')[0].onclick=function(){F.n+=24;rl()};
        var gq=$('#gq')[0],news=$('#rows a');
        function an(){var m=0,cc=($('#news .chip.on')[0]||{dataset:{v:'all'}}).dataset.v;news.forEach(function(a){var ok=(cc==='all'||a.dataset.k===cc)&&(!F.q||a.textContent.toLowerCase().indexOf(F.q)>-1);a.hidden=!ok;if(ok)m++});$('.empty',$('#rows')[0])[0].hidden=m>0}
        [gq,$('#lq')[0],$('#nq')[0]].forEach(function(i){i.oninput=function(){F.q=i.value.trim().toLowerCase();[gq,$('#lq')[0],$('#nq')[0]].forEach(function(o){if(o!==i)o.value=i.value});F.n=24;rl();an()}});gq.onkeydown=function(e){if(e.key==='Enter')location.hash='#library'};
        $('#news .chip').forEach(function(b){b.addEventListener('click',an)});
        var CV=[['s1','📰'],['s2','🎓'],['s3','🗳️']];
        function gp(g){if(!G)return;var sb=subs(g);if(G.indexOf(g)<0)return;V.innerHTML='<div class="art" style="max-width:1000px"><a href="#find" class="dl">← Home</a><h1>'+g+' teaching and learning materials</h1><p>Free editable schemes, lesson plans, notes, exams and records for every '+g+' subject.</p>'+(G.indexOf(g)>=11&&G.indexOf(g)<=13?'<p><em>Senior school: subjects are grouped into STEM, Social Sciences, and Arts and Sports pathways. Combinations vary by school, so confirm with the Ministry or your school.</em></p>':'')+'<select class="sel" id="gt" style="max-width:200px" aria-label="Term">'+TE.map(function(t){return'<option>'+t+'</option>'}).join('')+'</select><div class="mg" id="gg"></div><p><a class="dl" href="#library">Open the full library</a></p></div>';
        function r(){var t=$('#gt')[0].value;$('#gg')[0].innerHTML=sb.map(function(x){return'<div class="mc">'+cov(g,x)+'<div class="mb"><h3>'+x+'</h3><div>'+TY.map(function(y){return'<button class="gb o dl2" data-id="'+[g,x,t,y[0]].join('|')+'">'+y[0]+'</button>'}).join('')+'</div></div></div>'}).join('')}
        r();$('#gt')[0].onchange=r;V.hidden=false;M.hidden=true;act('library');document.body.classList.add('vw');document.title=g+' materials — Mwalimu Family';scrollTo(0,0)}
        document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.dl2,.sv2');if(!b)return;var p=b.dataset.id.split('|');
        if(b.classList.contains('dl2')){var k=TY.filter(function(y){return y[0]===p[3]})[0][1];save(p.join(' '),mk(k,p[0],p[1],p[2]))}
        else{var a=sv(),i=a.indexOf(b.dataset.id);i>-1?a.splice(i,1):a.push(b.dataset.id);try{localStorage.setItem('mfs',JSON.stringify(a))}catch(x){}b.textContent=i>-1?'☆ Save':'★ Saved';rs()}});
        rl();
        function rn(t){var ty=t||'Exam',x=[['Grade 7','Mathematics'],['Grade 8','English'],['Grade 9','Integrated Science'],['Grade 10','Biology']];$('#nw')[0].innerHTML=x.map(function(y){return card(y[0],y[1],'Term 3',ty)}).join('')}
        $('#hc')[0].innerHTML=['All'].concat(TY.map(function(t){return t[0]})).map(function(t,i){return'<button class="chip'+(i?'':' on')+'" data-v="'+(i?t:'Exam')+'">'+t+'</button>'}).join('');
        $('#hc .chip').forEach(function(b){b.onclick=function(){$('#hc .chip').forEach(function(x){x.classList.toggle('on',x===b)});rn(b.dataset.v)}});rn();
        var n1=A.s1;$('#hn')[0].innerHTML='<a class="mc" href="#/s1"><div class="cv" style="height:190px;background:linear-gradient(135deg,hsl('+hs(n1.t)+' 50% 24%),hsl('+(hs(n1.t)+50)+' 55% 38%))"><span>📰</span><small>'+n1.l+'</small></div><div class="mb"><h3 style="font-size:1.5rem">'+n1.t+'</h3><p>'+n1.c[0]+'</p><span class="dl">Read the story →</span></div></a><div class="nr">'+['s2','s4'].map(function(k){var a=A[k];return'<a class="rc" href="#/'+k+'"><span class="tag">'+a.l+'</span><h3>'+a.t+'</h3><time>'+a.d+'</time></a>'}).join('')+'</div>';
        $('#nt')[0].dataset.to=G.reduce(function(n,g){return n+subs(g).length*15},0);
        var hg=$('#hg')[0],hs=$('#hs')[0];hg.innerHTML=G.slice(0,14).map(function(g){return'<option>'+g+'</option>'}).join('');hg.value='Grade 7';function hso(){hs.innerHTML=subs(hg.value).map(function(x){return'<option>'+x+'</option>'}).join('')}hso();hg.onchange=hso;
        $('#hdl')[0].onclick=function(){save(hg.value+' '+hs.value+' '+$('#ht')[0].value+' scheme',mk('scheme',hg.value,hs.value,$('#ht')[0].value))};
        // KCSE calculator
        var KP=[['A',12],['A-',11],['B+',10],['B',9],['B-',8],['C+',7],['C',6],['C-',5],['D+',4],['D',3],['D-',2],['E',1]];
        $('#kc')[0].innerHTML=[1,2,3,4,5,6,7].map(function(i){return'<select class="sel" aria-label="Subject '+i+'">'+KP.map(function(k){return'<option value="'+k[1]+'">Subject '+i+': '+k[0]+'</option>'}).join('')+'</select>'}).join('');
        $('#kb')[0].onclick=function(){var t=0;$('#kc select').forEach(function(x){t+=+x.value});var T=[[81,'A'],[74,'A-'],[67,'B+'],[60,'B'],[53,'B-'],[46,'C+'],[39,'C'],[32,'C-'],[25,'D+'],[18,'D'],[11,'D-'],[1,'E']],g='E';for(var i=0;i<T.length;i++)if(t>=T[i][0]){g=T[i][1];break}$('#ko')[0].textContent='Total '+t+'/84 · Mean grade '+g+' (check KNEC for the official result)'};
        // comments
        var CM={'Exceeds expectation':'{n} has had an outstanding term, showing real strength in {s}. Encourage {n} to take on extension tasks.','Meets expectation':'{n} has worked steadily this term and shows good {s}. With regular practice {n} can aim even higher.','Approaches expectation':'{n} is making progress and shows promise in {s}. More revision and practice will help {n} reach the expected level.','Below expectation':'{n} needs extra support to meet expectations this term, though {s} is a positive. We will work with the family on a plan for {n}.'},cmt='';
        $('#cb')[0].onclick=function(){cmt=CM[$('#cv')[0].value].replace(/\{n\}/g,$('#cn')[0].value||'The learner').replace(/\{s\}/g,$('#cs')[0].value||'effort');$('#co')[0].textContent=cmt;$('#cc')[0].hidden=false};
        $('#cc')[0].onclick=function(){try{navigator.clipboard.writeText(cmt);this.textContent='Copied ✓'}catch(e){}};
        // pathway starter
        var PQ=[['Which sounds most fun?',['Building or experimenting','Debating, writing or helping people','Music, art or sport']],['In a group project you usually…',['Solve the technical problem','Organise people and ideas','Design or perform the final piece']],['Which subject do you look forward to?',['Science or Maths','History, Geography or Languages','Creative Arts or PE']],['A free afternoon, you would…',['Fix or invent something','Read news or volunteer','Practise a sport or instrument']]],PN=['STEM','Social Sciences','Arts and Sports'],pi=0,ps=[0,0,0],pb=$('#pb')[0];
        function rp(){if(pi>=PQ.length){var m=ps.indexOf(Math.max.apply(0,ps));pb.innerHTML='<p style="font:800 1.4rem Fraunces,serif">Leaning towards: '+PN[m]+'</p><p style="font-size:.9rem">This is only a conversation starter. Follow official Ministry guidance for placement.</p><button class="gb" id="pr2">Restart</button>';$('#pr2')[0].onclick=function(){pi=0;ps=[0,0,0];rp()};return}
        pb.innerHTML='<p style="font-weight:600">'+PQ[pi][0]+'</p>'+PQ[pi][1].map(function(o,i){return'<button class="qo" data-i="'+i+'">'+o+'</button>'}).join('');$('.qo',pb).forEach(function(b){b.onclick=function(){ps[+b.dataset.i]++;pi++;rp()}})}
        rp();
        // cinematic glyphs + spotlight
        var rm2=matchMedia('(prefers-reduced-motion:reduce)').matches;
        $('.cine').forEach(function(sec){var g=$('.gy',sec)[0];if(!rm2){'∑ π ✎ A+ √ ≠ ∞ 📐 📖 abc 7×8 H₂O'.split(' ').forEach(function(x,i){var e=document.createElement('i');e.textContent=x;e.style.left=(i*8.5+3)+'%';e.style.animationDuration=(16+i*3)+'s';e.style.animationDelay='-'+(i*2.3)+'s';g.appendChild(e)});sec.addEventListener('pointermove',function(ev){var r=sec.getBoundingClientRect();sec.style.setProperty('--mx',(ev.clientX-r.left)+'px');sec.style.setProperty('--my',(ev.clientY-r.top)+'px')})}});
        // downloads
        function esc(x){return String(x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
        function tb(h,rows,n){var o='<table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr>'+h.map(function(x){return'<th>'+x+'</th>'}).join('')+'</tr>';for(var i=0;i<rows;i++)o+='<tr>'+h.map(function(x,j){return'<td>'+(n&&j===0?i+1:'&nbsp;')+'</td>'}).join('')+'</tr>';return o+'</table>'}
        function save(name,body){var b=new Blob(['<html><head><meta charset="utf-8"></head><body style="font-family:Arial">'+body+'</body></html>'],{type:'application/msword'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.doc';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},2000)}
        var SH=['Week','Lesson','Strand','Sub-strand','Specific learning outcomes','Learning experiences','Key inquiry question(s)','Learning resources','Assessment','Reflection'];
        var D={scheme:function(){return'<h2>Scheme of work</h2>'+HD+tb(SH,13,1)},
        lesson:function(){return'<h2>Lesson plan</h2>'+HD+'<p>Date: ____ Time: ____ Roll: ____</p>'+['Strand / sub-strand','Specific learning outcomes','Key inquiry question(s)','Learning resources','Introduction (5 min)','Lesson development (30 min)','Conclusion (5 min)','Assessment','Extended activity','Reflection on the lesson'].map(function(x){return'<h4>'+x+'</h4><p>&nbsp;</p>'}).join('')},
        notes:function(){return'<h2>Lesson notes</h2>'+HD+['Topic','Learning outcomes','Key terms','Notes','Worked examples','Learner activities','Summary','Revision questions'].map(function(x){return'<h4>'+x+'</h4><p>&nbsp;</p>'}).join('')},
        exam:function(){return'<h2>End-term examination</h2>'+HD+'<p>Name: ________ Adm No: ____ Time: ____ Total marks: ____</p><h3>Section A (short answer)</h3>'+tb(['No.','Question','Marks'],6,1)+'<h3>Section B (structured)</h3>'+tb(['No.','Question','Marks'],4,1)+'<br><h2>Marking scheme</h2>'+tb(['No.','Expected answer','Marks'],10,1)},
        rubric:function(){return'<h2>Competency assessment rubric</h2>'+HD+tb(['Sub-strand / skill','Exceeds expectation (4)','Meets expectation (3)','Approaches expectation (2)','Below expectation (1)'],6)},
        tpad:function(){return'<h2>Appraisal evidence log</h2>'+HD+tb(['Performance area','Evidence','Target','Rating','Remarks'],8)},
        record:function(){return'<h2>Record of work covered</h2>'+HD+tb(['Week','Date','Strand / sub-strand','Work covered','Remarks'],13,1)}};
        var TM=[['Exams','End-term exam paper with marking scheme','exam','All grades'],['Exams','Competency assessment rubric','rubric','All grades'],['Schemes','Scheme of work template (editable)','scheme','PP1 to Grade 12'],['Lesson notes','Lesson plan template','lesson','All grades'],['Lesson notes','Lesson notes template','notes','All grades'],['Records','Record of work covered','record','All grades'],['Records','Appraisal evidence log (use TSC’s official TPAD forms for submission)','tpad','Teachers']],tg=$('#tg')[0];
        tg.innerHTML=TM.map(function(m){return'<div class="gl" data-k="'+m[0]+'"><span class="tag">'+m[0]+'</span><h3 style="margin-top:.6rem">'+m[1]+'</h3><p>'+m[3]+' · Word (.doc)</p><button class="gb" data-d="'+m[2]+'" data-n="'+m[1]+'">Download free</button></div>'}).join('');
        $('.gb',tg).forEach(function(b){b.onclick=function(){save(b.dataset.n,mk(b.dataset.d))}});
        $('[data-tt] .chip').forEach(function(b){b.addEventListener('click',function(){$('[data-tt] .chip').forEach(function(x){x.classList.toggle('on',x===b)});$('.gl',tg).forEach(function(c){c.hidden=!(b.dataset.v==='all'||c.dataset.k===b.dataset.v)})})});
        // timetable generator
        var TH='';
        function lst(id){return $('#'+id)[0].value.split(',').map(function(x){return x.trim()}).filter(Boolean)}
        $('#tb')[0].onclick=function(){var cs=lst('tc'),sb=lst('ts'),L=+$('#tp')[0].value,days=['Mon','Tue','Wed','Thu','Fri'],h='';
        if(!cs.length||!sb.length){return}
        var warn=cs.length>sb.length?'<p>Tip: add at least as many subjects as classes so no subject (teacher) is needed in two classes at once.</p>':'';
        cs.forEach(function(c,ci){h+='<h4>'+esc(c)+'</h4><table><tr><th></th>'+days.map(function(d){return'<th>'+d+'</th>'}).join('')+'</tr>';
        for(var p=0;p<L;p++){if(p===3)h+='<tr><th colspan="6">Break</th></tr>';if(p===6)h+='<tr><th colspan="6">Lunch</th></tr>';h+='<tr><th>'+(p+1)+'</th>'+days.map(function(d,di){return'<td>'+esc(sb[(di*L+p+ci)%sb.length])+'</td>'}).join('')+'</tr>'}h+='</table>'});
        $('#to')[0].innerHTML=warn+h;TH=h;$('#td')[0].hidden=$('#tpr')[0].hidden=false};
        $('#td')[0].onclick=function(){save('Class timetable',TH.replace(/<table>/g,'<table border="1" cellpadding="5" style="border-collapse:collapse">'))};
        $('#tpr')[0].onclick=function(){var w=open('','_blank');if(!w)return;w.document.write('<title>Timetable</title><style>body{font-family:sans-serif}table{border-collapse:collapse;width:100%;margin-bottom:1rem}td,th{border:1px solid #333;padding:6px;text-align:center}</style>'+TH);w.document.close();w.print()};
        $('#sbt')[0].onclick=function(){var w=Math.min(15,Math.max(1,+$('#sw2')[0].value||13));save($('#sg')[0].value+' '+$('#sb')[0].value+' scheme',
        '<h2>Scheme of work</h2><p>Grade: '+esc($('#sg')[0].value)+' · Subject: '+esc($('#sb')[0].value)+' · '+esc($('#st2')[0].value)+'</p><p>School: ________ Teacher: ________ Year: ____</p>'+tb(SH,w,1))};
        // live countdown
        var CK=$('.clk');CK.forEach(function(e){e.dataset.t=e.dataset.t.split(',')});
        function tick(){CK.forEach(function(e){var t=e.dataset.t.split(','),ms=new Date(+t[0],+t[1],1)-new Date();if(ms<=0){e.innerHTML='<div><b>Window open</b></div>';return}
        var v=[Math.floor(ms/864e5),Math.floor(ms/36e5)%24,Math.floor(ms/6e4)%60,Math.floor(ms/1e3)%60],n=['days','hrs','min','sec'];e.innerHTML=v.map(function(x,i){return'<div><b>'+x+'</b><small>'+n[i]+'</small></div>'}).join('')})}
        tick();setInterval(tick,1000);
        // checklist
        var CL={en:['Wait for official KJSEA results announcements','Talk with your child about interests and strengths','Read the Ministry’s guidance on senior school pathways','Note the school selection steps and deadlines when announced','Keep your child’s documents together'],sw:['Subiri matangazo rasmi ya matokeo ya KJSEA','Zungumza na mtoto wako kuhusu vipaji na mapendeleo yake','Soma mwongozo wa Wizara kuhusu mikondo ya shule ya sekondari ya juu','Andika hatua na tarehe za kuchagua shule zitakapotangazwa','Weka nyaraka za mtoto wako mahali pamoja']},lg='en',cl=$('#cl')[0];
        function st(i){try{return localStorage.getItem('g10'+i)==='1'}catch(e){return false}}
        function pg(){var n=$('input',cl).filter(function(c){return c.checked}).length,t=CL.en.length;$('#rp')[0].textContent=Math.round(n/t*100)+'%';$('#rc')[0].style.strokeDashoffset=213.6*(1-n/t);$('#cm')[0].textContent=n===t?(lg==='en'?'All done. Well prepared! 🎉':'Umemaliza. Hongera! 🎉'):''}
        function rc(){cl.innerHTML=CL[lg].map(function(x,i){return'<label><input type="checkbox" data-i="'+i+'"'+(st(i)?' checked':'')+'> '+x+'</label>'}).join('');$('input',cl).forEach(function(c){c.addEventListener('change',function(){try{localStorage.setItem('g10'+c.dataset.i,c.checked?'1':'0')}catch(e){}pg()})});pg()}
        $('#gpv')[0].innerHTML=CL.en.slice(0,3).map(function(x){return'<li>☐ '+x+'</li>'}).join('');rc();$('#sw')[0].addEventListener('click',function(){lg=lg==='en'?'sw':'en';this.textContent=lg==='en'?'Kiswahili':'English';rc()});
        // quiz
        var QS={m:[['7 × 8 = ?',['54','56','64'],1],['3/4 as a decimal?',['0.75','0.34','0.7'],0],['Perimeter of a square with side 5 cm?',['10 cm','20 cm','25 cm'],1],['What is 15% of 200?',['20','30','15'],1]],s:[['Which gas do plants take in for photosynthesis?',['Oxygen','Carbon dioxide','Nitrogen'],1],['Chemical formula of water?',['H₂O','CO₂','NaCl'],0],['Which organ pumps blood?',['Lungs','Liver','Heart'],2],['Boiling point of water at sea level?',['90 °C','100 °C','120 °C'],1]],k:[['“Mwalimu” in English?',['Doctor','Teacher','Farmer'],1],['Wingi wa “kitabu”?',['vitabu','kitabus','mitabu'],0],['Kinyume cha “kubwa”?',['refu','ndogo','pana'],1],['“Maji” in English?',['Fire','Water','Wind'],1]]},Q=QS.m,qi=0,sc=0,qb=$('#qb')[0],qp=$('#qp')[0],sk=0;
        $('#qs')[0].onchange=function(){Q=QS[this.value];qi=0;sc=0;sk=0;rq()};
        function rq(){qp.style.width=(qi/Q.length*100)+'%';if(qi>=Q.length){qb.innerHTML='<p style="font:800 1.6rem Fraunces,serif">Score: '+sc+' / '+Q.length+(sc===Q.length?' 🏆':'')+'</p><button class="gb" id="rs">Try again</button>';$('#rs')[0].onclick=function(){qi=0;sc=0;sk=0;rq()};return}
        var x=Q[qi];qb.innerHTML='<p>'+(qi+1)+'/'+Q.length+(sk>1?' · 🔥 streak '+sk:'')+'</p><p style="font-size:1.2rem;font-weight:600">'+x[0]+'</p>'+x[1].map(function(o,i){return'<button class="qo" data-i="'+i+'">'+o+'</button>'}).join('');
        $('.qo',qb).forEach(function(b){b.onclick=function(){var i=+b.dataset.i;if(i===x[2]){sc++;sk++}else sk=0;b.classList.add(i===x[2]?'ok':'no');$('.qo',qb)[x[2]].classList.add('ok');$('.qo',qb).forEach(function(z){z.disabled=true});setTimeout(function(){qi++;rq()},1000)}})}
        rq();
        $('#qd')[0].onclick=function(){save('Scheme of work',mk('scheme'))};
        var fab=document.createElement('a');fab.className='fab';fab.href='#library';fab.textContent='⬇ Teaching materials';fab.hidden=true;document.body.appendChild(fab);
        addEventListener('scroll',function(){fab.hidden=document.body.classList.contains('vw')||scrollY<$('.hero')[0].offsetHeight-innerHeight},{passive:true});
        
        (function(){
        QS.m.push(['Solve: 2x + 6 = 14. x = ?',['4','8','10'],0],['Area of a rectangle 8 cm by 5 cm?',['26 cm²','40 cm²','13 cm²'],1],['Next prime after 7?',['9','11','13'],1],['1/2 + 1/4 = ?',['3/4','2/6','1/8'],0]);
        QS.s.push(['Water vapour turning into liquid is called?',['Evaporation','Condensation','Melting'],1],['Which is a mammal?',['Shark','Bat','Frog'],1],['Force that pulls objects to Earth?',['Friction','Gravity','Magnetism'],1],['SI unit of force?',['Joule','Newton','Watt'],1]);
        QS.k.push(['Kinyume cha “mrefu”?',['mfupi','mpana','mzito'],0],['“Shule” in English?',['School','Market','Church'],0],['Wingi wa “mtoto”?',['watoto','vitoto','mitoto'],0],['Siku ngapi katika wiki?',['Sita','Saba','Nane'],1]);
        $('#k3')[0].onclick=function(){var a=+$('#k1')[0].value,t=+$('#k2')[0].value;$('#k4')[0].textContent=(a>=4&&a<=48&&t>=7&&t<=84)?'Estimated cluster points: '+(Math.sqrt(a/48*t/84)*48).toFixed(3)+' / 48':'Please check your numbers.'};
        var bv=$('#bv')[0];bv.innerHTML=$('#cv')[0].innerHTML;
        $('#bb')[0].onclick=function(){var o=$('#bn')[0].value.split('\n').map(function(l){var p=l.split(','),n=p[0].trim();return n?CM[bv.value].replace(/\{n\}/g,n).replace(/\{s\}/g,(p[1]||'effort').trim()):''}).filter(Boolean).join('\n\n');$('#bo')[0].textContent=o;$('#bc')[0].hidden=!o};
        $('#bc')[0].onclick=function(){try{navigator.clipboard.writeText($('#bo')[0].textContent);this.textContent='Copied ✓'}catch(e){}};
        var cal=$('#cal')[0];cal.innerHTML=[1,2,3].map(function(i){return'<div style="display:flex;gap:.5rem;align-items:center;margin:.4rem 0;flex-wrap:wrap"><b style="width:70px">Term '+i+'</b><input class="sel" type="date" style="width:auto" aria-label="Term '+i+' opens"><input class="sel" type="date" style="width:auto" aria-label="Term '+i+' closes"></div>'}).join('');
        $('#cdl')[0].onclick=function(){var ev=[],ins=$('input',cal);for(var i=0;i<3;i++){var a=ins[i*2].value,b=ins[i*2+1].value;if(a&&b){var e=new Date(b);e.setDate(e.getDate()+1);ev.push('BEGIN:VEVENT\r\nUID:t'+i+'@mwalimufamily\r\nDTSTAMP:20260101T000000Z\r\nSUMMARY:Term '+(i+1)+' (school open)\r\nDTSTART;VALUE=DATE:'+a.replace(/-/g,'')+'\r\nDTEND;VALUE=DATE:'+e.toISOString().slice(0,10).replace(/-/g,'')+'\r\nEND:VEVENT')}}if(!ev.length)return;var l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mwalimu Family//EN\r\n'+ev.join('\r\n')+'\r\nEND:VCALENDAR'],{type:'text/calendar'}));l.download='school-terms.ics';document.body.appendChild(l);l.click();l.remove()};
        var de=document.documentElement,sv0=null;try{sv0=localStorage.getItem('lite')}catch(e){}
        function lite(on){de.classList.toggle('lite',on);$('#lt')[0].textContent=on?'Full':'Lite';try{localStorage.setItem('lite',on?'1':'0')}catch(e){}}
        lite(sv0==='1'||(sv0===null&&!!(navigator.connection&&navigator.connection.saveData)));
        $('#lt')[0].onclick=function(){lite(!de.classList.contains('lite'))};
        var fz=[18,20,22],fi=0;$('#fa')[0].onclick=function(){fi=(fi+1)%3;de.style.setProperty('--fs',fz[fi]+'px')};
        var SWM={'News':'Habari','Library':'Maktaba','Teaching':'Ualimu','Tools':'Zana','Parents':'Wazazi','Learn':'Jifunze','Teach':'Fundisha','Families':'Familia','Notices':'Taarifa','Tutoring':'Masomo','Jobs':'Kazi','Advertise':'Tangaza nasi','Videos':'Video','About':'Kuhusu','Contact':'Wasiliana','News that informs.':'Habari zinazoarifu.','Education that equips.':'Elimu inayowezesha.','Stories that connect.':'Hadithi zinazounganisha.','I am a…':'Mimi ni…'},isw=false;
        $('#sl')[0].onclick=function(){isw=!isw;de.lang=isw?'sw':'en';this.textContent=isw?'English':'Kiswahili';$('nav a,.scene h1,#hau').forEach(function(e){if(!e.dataset.en)e.dataset.en=e.textContent;e.textContent=isw&&SWM[e.dataset.en]?SWM[e.dataset.en]:e.dataset.en})};
        var bt=$('footer .bot p')[1],fa=document.createElement('a');fa.textContent='Report an error';fa.target='_blank';fa.rel='noopener';fa.href='#';fa.onclick=function(){fa.href='https://wa.me/254715363944?text='+encodeURIComponent('I found an error on '+location.href+': ')};bt.appendChild(document.createTextNode(' \u00a0 '));bt.appendChild(fa);
        if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(function(){});
        })();
        (function(){
        var d0=document.createElement('div');d0.innerHTML='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="chalk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter><filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dx="10" dy="18"/><feComponentTransfer><feFuncA type="linear" slope=".55"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d98f"/><stop offset=".5" stop-color="#dcb961"/><stop offset="1" stop-color="#c29640"/></linearGradient></defs></svg>';document.body.appendChild(d0.firstChild);
        var de=document.documentElement,EQ=['a² + b² = c²','x = (−b ± √(b²−4ac)) / 2a','sin²θ + cos²θ = 1','∫₀^π sin x dx = 2','Σ n = n(n+1)/2','A = πr²','(a+b)² = a² + 2ab + b²','e^(iπ) + 1 = 0','V = ⅓πr²h','log(ab) = log a + log b','d/dx xⁿ = nxⁿ⁻¹','tan θ = sin θ / cos θ','C = 2πr','Σ 1/n² = π²/6','√2 ≈ 1.41421','n! = n(n−1)!','y = mx + c','lim sin x / x = 1'],
        SH=['M0 -70 L61 35 H-61 Z','M-55 -55 H55 V55 H-55 Z','M0 -70 L67 -22 L41 57 H-41 L-67 -22 Z','M0 -70 L61 -35 V35 L0 70 L-61 35 V-35 Z','M-70 0 A70 70 0 1 0 70 0 A70 70 0 1 0 -70 0','M0 -75 L20 -25 L75 -25 L30 8 L48 62 L0 30 L-48 62 L-30 8 L-75 -25 L-20 -25 Z','M-50 -20 L0 -60 L50 -20 L50 40 L0 70 L-50 40 Z M-50 -20 L0 20 L50 -20 M0 20 V70'];
        function art(bp){var c=bp?'#d6ebff':'#f6f3e8',P=[[90,150,-4,56],[640,95,3,48],[1010,560,-3,54],[110,640,2,52],[560,840,-2,50],[1330,190,4,60],[960,860,-2,44],[60,450,-5,52]],s='<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><g fill="'+c+'" fill-opacity=".8" opacity=".5" filter="url(#chalk)" font-family="Caveat,cursive">';
        P.forEach(function(e,i){s+='<text class="eq" x="'+e[0]+'" y="'+e[1]+'" font-size="'+e[3]+'" transform="rotate('+e[2]+' '+e[0]+' '+e[1]+')">'+EQ[(i*3)%EQ.length]+'</text>'});
        s+='</g><g fill="none" stroke="'+c+'" stroke-width="3" stroke-linejoin="round" opacity=".5">';
        [[260,330],[1230,420],[820,520],[1450,700],[420,760]].forEach(function(p,i){s+='<g transform="translate('+p[0]+' '+p[1]+')"><path class="shp" style="animation-duration:'+(40+i*12)+'s;animation-direction:'+(i%2?'reverse':'normal')+'" d="'+SH[(i*2)%SH.length]+'"/></g>'});
        var t='';for(var i=0;i<=50;i++)t+='<path d="M'+(14+i*10)+' 0v'+(i%10?i%5?14:22:30)+'" stroke="#3a2a10" stroke-width="2"/>';
        var p='',R2=Math.PI/180;for(var a=0;a<=180;a+=10){var L=a%30?132:120;p+='<path d="M'+(-Math.cos(a*R2)*150).toFixed(1)+' '+(-Math.sin(a*R2)*150).toFixed(1)+' L'+(-Math.cos(a*R2)*L).toFixed(1)+' '+(-Math.sin(a*R2)*L).toFixed(1)+'" stroke="#fff" stroke-opacity=".8"/>'}
        return s+'</g><g filter="url(#ds)" opacity=".92"><g transform="translate(40 790) rotate(-6)"><rect width="540" height="78" rx="5" fill="url(#wood)"/>'+t+'</g><g transform="translate(1400 760) rotate(8)"><path d="M-160 0 A160 160 0 0 1 160 0 Z" fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.6)" stroke-width="2"/>'+p+'</g></g></svg>'}
        function tk(){if(de.classList.contains('lite')||matchMedia('(prefers-reduced-motion:reduce)').matches||document.hidden)return;$('.mgx').forEach(function(m){if(!m.offsetParent)return;var e=$('.eq',m),el=e[R(e.length)],q=$('.shp',m),sp=q[R(q.length)];el.style.opacity=0;sp.style.opacity=0;setTimeout(function(){el.textContent=EQ[R(EQ.length)];sp.setAttribute('d',SH[R(SH.length)]);el.style.opacity='';sp.style.opacity=''},900)})}
        setInterval(tk,2800);
        $('#home .mgx,#home .gy').forEach(function(e){e.remove()});$('section.mb').forEach(function(sc){var d=document.createElement('div');d.className='mgx';d.setAttribute('aria-hidden','true');d.innerHTML=art(sc.classList.contains('bp'));sc.insertBefore(d,sc.firstChild)});
        var NX={job:'Want more visibility? <a class="dl" href="#advertise">Request a featured listing</a>.',ad:'We will reply on WhatsApp with rates.',find:'While you wait, <a class="dl" href="#tutoring">practise maths</a> or <a class="dl" href="#library">browse notes</a>.',tut:'Meanwhile, see <a class="dl" href="#jobs">tutoring jobs</a>.',note:'See the <a class="dl" href="#notices">notice board</a>.'},TI={job:1,note:1,find:0,tut:1,ad:2},sub=function(){try{return JSON.parse(localStorage.getItem('mfsub')||'[]')}catch(e){return[]}};
        var FM={job:['Post a job','Send for review',[['Employer / school','t'],['Job title','t'],['Category','s',['Teaching','School management','Support staff','Tutoring']],['Visibility','s',['Standard listing','Featured listing (rates on request)']],['County / location','t'],['How to apply (phone or email)','t'],['Description and deadline','a']],'I confirm this is a genuine vacancy and no application fee will be charged.'],
        ad:['Request a promotion quote','Request quote',[['Business / organisation','t'],['Contact (phone or email)','t'],['Package','s',['Sponsored notice','Featured job listing','Newsletter and WhatsApp mention','Homepage banner','Event promotion']],['What are you promoting?','a']],'I agree to the advertising standards above.'],
        find:['Find a tutor','Send request',[['Subject','t'],['Grade or level','t'],['Mode','s',['Online','In person','Either']],['Location','t'],['Your phone or email','t']],'I agree to be contacted. Learners under 18 need a parent or guardian to make the request.'],
        tut:['Become a tutor','Apply',[['Name','t'],['Subjects and grades','t'],['Qualifications and experience','a'],['Location or online','t'],['Phone or email','t']],'I confirm my details are true and agree to a verification check.'],
        note:['Submit a notice','Send for review',[['Organisation','t'],['Notice title','t'],['Details and dates','a'],['Contact','t']],'I confirm this notice is accurate and from my organisation.']};
        $('[data-fm]').forEach(function(d){var f=FM[d.dataset.fm];d.innerHTML='<h3>'+f[0]+'</h3>'+f[2].map(function(x){var h=x[1]==='a'?'<textarea class="sel" rows="3" data-l="'+x[0]+'"></textarea>':x[1]==='s'?'<select class="sel" data-l="'+x[0]+'">'+x[2].map(function(o){return'<option>'+o+'</option>'}).join('')+'</select>':'<input class="sel" type="text" data-l="'+x[0]+'">';return'<div><label>'+x[0]+'</label>'+h+'</div>'}).join('')+'<label class="ck"><input type="checkbox"> '+f[3]+'</label><p class="fe" style="color:#b3261e;font-size:.9rem" hidden>Please complete every field and tick the box.</p><button class="btn b1">'+f[1]+'</button><p style="font-size:.85rem">'+(window.MF_API?'Your details go straight to our team for review.':'Opens WhatsApp with your details for our team to review.')+' Nothing is published automatically. See our <a href="privacy.html" style="text-decoration:underline">privacy notice</a>.</p>';
        $('.btn',d)[0].onclick=function(){var ls=$('[data-l]',d),ok=$('input[type=checkbox]',d)[0].checked&&ls.every(function(e){return e.value.trim()});$('.fe',d)[0].hidden=ok;if(!ok)return;var k=d.dataset.fm,ref=({job:'JOB',ad:'ADV',find:'TUT',tut:'TTR',note:'NTC'})[k]+'-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+(1000+R(9000)),L=sub();var wu='https://wa.me/254715363944?text='+encodeURIComponent('*'+f[0]+'* ['+ref+']\n'+ls.map(function(e){return e.dataset.l+': '+e.value.trim()}).join('\n'));window.MF?MF.submit(k,f[0],ref,ls.map(function(e){return[e.dataset.l,e.value.trim()]}),wu):open(wu,'_blank');L.unshift({ref:ref,type:f[0],title:ls[TI[k]].value.trim(),date:new Date().toISOString().slice(0,10)});try{localStorage.setItem('mfsub',JSON.stringify(L.slice(0,30)))}catch(e){}d.innerHTML='<h3>Sent for review</h3><p>Reference: <b>'+ref+'</b>. Keep it for follow-up. Track it in <a class="dl" href="#activity">My activity</a>.</p><p>'+NX[k]+'</p>'}});
        var CFG={feed:window.MF_FEED||''},JOBS=[{t:'Grade 7 Mathematics teacher',e:'Sample school',l:'Nairobi',c:'Teaching',d:'Example listing showing the layout. Real vacancies appear here after review.',x:1,st:'published',exp:'2027-01-31'},{t:'Evening KCSE maths tutor',e:'Sample tutoring centre',l:'Mombasa',c:'Tutoring',d:'Example listing. Employers can post using the form below.',x:1,st:'published',exp:'2027-01-31'}],
        NOTICES=[{k:'Exams',d:'20 Nov 2026',t:'Results release windows',b:'Ministry of Education: KJSEA results expected in December 2026. KCSE and KPSEA targeted for January 2027.',u:'#/s1',st:'published'},{k:'Safety',d:'21 Nov 2026',t:'Results scam alert',b:'Never pay to see results early. Use official channels only.',u:'#/s4',st:'published'}],nk='all';
        function live(a){var n=new Date().toISOString().slice(0,10);return a.filter(function(x){return x.st==='published'&&(!x.exp||x.exp>=n)}).sort(function(a,b){return(b.f||0)-(a.f||0)})}
        function lb(x){return x.f?'<span class="lab">Sponsored</span>':''}
        function rj(){var q=$('#jq')[0].value.toLowerCase(),c=$('#jc')[0].value,o=live(JOBS).filter(function(j){return(!c||j.c===c)&&(j.t+j.e+j.l).toLowerCase().indexOf(q)>-1});$('#jl')[0].innerHTML=o.length?o.map(function(j){return'<div>'+lb(j)+'<span class="tag">'+esc(j.c)+(j.x?' · Sample':'')+'</span><h3 style="margin-top:.5rem">'+esc(j.t)+'</h3><p><b>'+esc(j.e)+'</b> · '+esc(j.l)+'</p><p>'+esc(j.d)+'</p></div>'}).join(''):'<div><p>No jobs match your search.</p></div>'}
        function rnn(){$('#nl')[0].innerHTML=live(NOTICES).filter(function(n){return nk==='all'||n.k===nk}).map(function(n){return'<div>'+lb(n)+'<span class="tag">'+esc(n.k)+' · '+esc(n.d)+'</span><h3 style="margin-top:.5rem">'+esc(n.t)+'</h3><p>'+esc(n.b)+(n.u?' <a class="dl" href="'+n.u+'">Read more</a>':'')+'</p></div>'}).join('')||'<div><p>No notices in this category.</p></div>'}
        $('#notices .chip').forEach(function(b){b.onclick=function(){$('#notices .chip').forEach(function(x){x.classList.toggle('on',x===b)});nk=b.dataset.v;rnn()}});
        if(CFG.feed)fetch(CFG.feed).then(function(r){return r.json()}).then(function(j){if(j.jobs)JOBS=j.jobs;if(j.notices)NOTICES=j.notices;rj();rnn()}).catch(function(){});
        $('#jq')[0].oninput=$('#jc')[0].onchange=rj;rj();rnn();
        var mq=[];function R(n){return Math.floor(Math.random()*n)}
        $('#mpb')[0].onclick=function(){var op=$('#mpo')[0].value,lv=+$('#mpl')[0].value,m=[10,50,200][lv-1];mq=[];for(var i=0;i<5;i++){var a=1+R(m),b=1+R(m),v;if(op==='×'){a=2+R(lv*6+6);b=2+R(lv*6+6)}if(op==='÷'){b=2+R(lv*6+6);a=b*(2+R(lv*8+4))}if(op==='−'&&b>a){v=a;a=b;b=v}mq.push([a,op,b,op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b])}
        $('#mpq')[0].innerHTML=mq.map(function(x,i){return'<p><label>'+(i+1)+'. '+x[0]+' '+x[1]+' '+x[2]+' = <input class="sel" type="number" style="width:7rem;display:inline-block" data-i="'+i+'"></label></p>'}).join('');$('#mpr')[0].textContent='';$('#mpc')[0].hidden=false};
        $('#mpc')[0].onclick=function(){var n=0;$('#mpq input').forEach(function(e){if(+e.value===mq[+e.dataset.i][3]&&e.value!=='')n++});$('#mpr')[0].textContent='Score: '+n+' / '+mq.length+(n===mq.length?' 🏆':'')};
        
        $('#advertise .x2>div').forEach(function(c){var h=$('h3',c)[0].textContent,b=document.createElement('button');b.className='gb o';b.textContent='Request this';b.onclick=function(){var o=$('#advertise [data-l="Package"] option').filter(function(x){return x.textContent.indexOf(h)===0})[0];if(o)o.selected=true;$('#advertise [data-l="Package"]')[0].scrollIntoView({behavior:'smooth',block:'center'})};c.appendChild(b)});
        function ra(){var L=sub(),v=0,n=0;try{v=JSON.parse(localStorage.getItem('mfs')||'[]').length;for(var i=0;i<5;i++)if(localStorage.getItem('g10'+i)==='1')n++}catch(e){}$('#as')[0].innerHTML=L.length?L.map(function(x){return'<p><b>'+esc(x.ref)+'</b> · '+esc(x.type)+'<br>'+esc(x.title)+' · '+x.date+' <span class="tag">Sent for review</span></p>'}).join(''):'<p>Nothing sent yet. Forms on Jobs, Tutoring, Notices and Advertise appear here.</p>';$('#am')[0].textContent=v+' saved';$('#ac')[0].textContent=n+' of 5 steps done'}
        ra();addEventListener('hashchange',ra);
        var NXT={news:[['parents','Parents’ hub'],['notices','Notice board'],['library','Learning library']],library:[['tutoring','Get a tutor'],['teaching','Teaching tools'],['parents','Parents’ hub']],teaching:[['jobs','Education jobs'],['library','Library'],['tools','Tools']],tools:[['library','Library'],['tutoring','Tutoring'],['parents','Parents’ hub']],parents:[['notices','Notices'],['tutoring','Find a tutor'],['library','Library']],notices:[['news','Latest news'],['parents','Parents’ hub'],['advertise','Post a sponsored notice']],tutoring:[['library','Revision notes'],['jobs','Tutor jobs'],['tools','Tools']],jobs:[['advertise','Feature your vacancy'],['teaching','Teaching tools'],['tutoring','Tutoring']],advertise:[['jobs','Education jobs'],['notices','Notice board'],['contact','Contact us']],videos:[['library','Library'],['news','News']],about:[['contact','Contact'],['advertise','Advertise']]};
        Object.keys(NXT).forEach(function(k){var sc=document.getElementById(k);if(!sc)return;var d=document.createElement('div');d.className='w nx';d.innerHTML='<h3 style="font-size:1.2rem;margin:2.5rem 0 .8rem">Where next?</h3><div class="chips">'+NXT[k].map(function(x){return'<a class="chip" href="#'+x[0]+'">'+x[1]+' →</a>'}).join('')+'</div>';sc.appendChild(d)});
        })();
        PG.forEach(function(id){var sec=document.getElementById(id),h=sec&&$('h2.sh',sec)[0];if(!h)return;var n=h.nextElementSibling,bl='',par=h.parentElement;if(n&&n.classList.contains('sub')){bl=n.textContent;n.remove()}
        var b=document.createElement('div');b.className='pbn';b.innerHTML='<div class="w"><div class="bc"><a href="#home">Home</a><span>/</span>'+esc(h.textContent)+'</div><h1 class="disp" id="'+h.id+'">'+esc(h.textContent)+'</h1>'+(bl?'<p>'+esc(bl)+'</p>':'')+'</div>';
        sec.insertBefore(b,sec.firstChild);sec.classList.add('pgs');h.remove();if(par.classList.contains('w')&&!par.children.length)par.remove()});
        route();
        })();
      } catch(e0) { console.warn('Script 1 notice:', e0); }

      // --- Script 2 ---
      try {
        (function(){
        var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))},E=function(x){return String(x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
        function dl(n,h){var b=new Blob(['<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>'],{type:'application/msword'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n+'.doc';document.body.appendChild(a);a.click();a.remove()}
        try{$('#wk')[0].innerHTML=$('#rows a').slice(0,4).map(function(a){return'<a class="x2c" href="'+a.getAttribute('href')+'"><span class="tag">'+E($('.tag',a)[0].textContent)+'</span><h3 style="font-size:1.1rem;margin-top:.5rem">'+E($('h3',a)[0].textContent)+'</h3><p>'+E($('time',a)[0].textContent)+'</p></a>'}).join('')}catch(e){}
        var GL=[['CBE','Competency-Based Education: a curriculum that focuses on what learners can do, not only what they remember.'],['KICD','Kenya Institute of Curriculum Development, which designs the national curriculum.'],['KNEC','Kenya National Examinations Council, which sets and marks national assessments.'],['KPSEA','Kenya Primary School Education Assessment, taken at the end of Grade 6.'],['KJSEA','Kenya Junior School Education Assessment, taken at the end of Grade 9.'],['KCSE','Kenya Certificate of Secondary Education, taken at the end of secondary school.'],['KUCCPS','Kenya Universities and Colleges Central Placement Service, which places students in universities and colleges.'],['HELB','Higher Education Loans Board, which offers student loans and bursaries.'],['NEMIS','National Education Management Information System, the Ministry’s learner and school records system.'],['UPI','Unique Personal Identifier given to each learner in NEMIS.'],['Capitation','Government funds paid to public schools for each enrolled learner.'],['TVET','Technical and Vocational Education and Training, offered in technical colleges and institutes.'],['Pathway','A group of senior school subjects: STEM, Social Sciences, or Arts and Sports.'],['CSL','Community Service Learning, a senior school learning area that links classroom learning to community projects.'],['Scheme of work','A teacher’s term plan showing what will be taught each week.']];
        function rg(q){q=(q||'').toLowerCase();$('#gl')[0].innerHTML=GL.filter(function(x){return(x[0]+' '+x[1]).toLowerCase().indexOf(q)>-1}).map(function(x){return'<dt>'+E(x[0])+'</dt><dd>'+E(x[1])+'</dd>'}).join('')||'<p>No matching terms.</p>'}
        rg();$('#gls')[0].oninput=function(){rg(this.value)};
        var rh='';
        $('#rg')[0].onclick=function(){var d=$('#rd')[0].value,sb=$('#rs')[0].value.split(',').map(function(x){return x.trim()}).filter(Boolean),n=+$('#rn')[0].value;if(!sb.length)return;
        var D=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],k=0,h='<table><tr><th>Day</th>';for(var i=1;i<=n;i++)h+='<th>Slot '+i+'</th>';h+='</tr>';
        D.forEach(function(x){h+='<tr><td>'+x+'</td>';for(var i=0;i<n;i++)h+='<td>'+E(sb[k++%sb.length])+'</td>';h+='</tr>'});h+='</table>';
        var m='';if(d){var t=Math.ceil((new Date(d)-new Date())/864e5);m=t>0?t+' days to your exam date.':'Choose a future date.'}
        rh=h;$('#ro')[0].innerHTML=h;$('#rm')[0].textContent=m;$('#rdl')[0].hidden=false};
        $('#rdl')[0].onclick=function(){dl('Revision-timetable','<h2>Weekly revision plan</h2>'+rh)};
        var mh='';
        $('#mg')[0].onclick=function(){var r=$('#mt')[0].value.split('\n').map(function(l){var p=l.split(',').map(function(x){return x.trim()});var m=p.slice(1).map(Number).filter(function(x){return!isNaN(x)});return{n:p[0],t:m.reduce(function(a,b){return a+b},0),c:m.length}}).filter(function(x){return x.n&&x.c});
        r.forEach(function(x){x.a=x.t/x.c});r.sort(function(a,b){return b.t-a.t});if(!r.length)return;
        var h='<table><tr><th>Rank</th><th>Name</th><th>Total</th><th>Mean</th></tr>'+r.map(function(x,i){return'<tr><td>'+(i+1)+'</td><td>'+E(x.n)+'</td><td>'+x.t+'</td><td>'+x.a.toFixed(1)+'</td></tr>'}).join('')+'</table><p>Class mean: '+(r.reduce(function(a,b){return a+b.a},0)/r.length).toFixed(1)+'</p>';
        mh=h;$('#mo2')[0].innerHTML=h;$('#mdl')[0].hidden=false};
        $('#mdl')[0].onclick=function(){dl('Class-marks','<h2>Class marks and ranking</h2>'+mh)};
        var FC={m:[['Area of a circle','πr²'],['Area of a triangle','½ × base × height'],['Perimeter of a rectangle','2 × (length + width)'],['Volume of a cuboid','length × width × height'],['Pythagoras’ theorem','a² + b² = c²']],s:[['Photosynthesis','Plants make food from sunlight, water and carbon dioxide.'],['Which gas do plants take in?','Carbon dioxide'],['Unit of force','Newton (N)'],['Chemical symbol for water','H₂O'],['Organ that pumps blood','The heart']],k:[['Maji','Water'],['Nyumba','House'],['Shule','School'],['Kitabu','Book'],['Rafiki','Friend'],['Mwalimu','Teacher']]},fi=0,fb=false;
        function fr(){var d=FC[$('#fcs')[0].value],c=d[fi%d.length];$('#fcc')[0].textContent=fb?c[1]:c[0]}
        $('#fcc')[0].onclick=function(){fb=!fb;fr()};$('#fcc')[0].onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();this.onclick()}};
        $('#fcn')[0].onclick=function(){fi++;fb=false;fr()};$('#fcs')[0].onchange=function(){fi=0;fb=false;fr()};fr();
        })();
      } catch(e1) { console.warn('Script 2 notice:', e1); }

      // --- Script 3 ---
      try {
        (function(){
        var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
        var K=[
        ['Digital basics','Digital','Beginner','About 2 hours','Use computers and phones with confidence and stay safe online.',['Parts of a computer and a phone','Typing and keyboard shortcuts','Word processing basics','Spreadsheet basics: rows, columns and sums','Passwords, scams and online safety']],
        ['Study skills','Study','Beginner','About 1.5 hours','Build habits that make revision and exams easier.',['Setting goals','Planning revision (try our timetable maker in Tools)','Note-taking methods','Memory techniques','Exam-day habits']],
        ['Money skills','Life','Beginner','About 1.5 hours','Understand saving, budgeting and mobile money.',['Needs and wants','Saving and budgeting','Mobile money safety','Borrowing basics','Planning for school fees']],
        ['Communication skills','Life','Beginner','About 1.5 hours','Speak, write and listen clearly.',['Speaking clearly','Writing a good message or email','Active listening','Public speaking','Working in a team']],
        ['Career readiness','Career','Intermediate','About 2 hours','Explore careers and prepare to apply.',['Exploring careers and pathways (see Pathway starter in Tools)','Writing a CV','Writing a cover letter','Interview practice','Learning options after school: college, TVET and work']],
        ['English and Kiswahili practice','Language','Beginner','About 2 hours','Practise everyday language in both languages.',['Everyday vocabulary','Building sentences','Reading comprehension tips','Writing short compositions (insha)','Speaking practice']],
        ['Coding first steps','Digital','Intermediate','About 3 hours','Learn the ideas behind programming.',['What is a program?','Variables','Decisions with if','Loops','Build a tiny project']],
        ['Teacher skills','Teaching','Intermediate','About 2.5 hours','Plan, assess and manage learning in a CBE classroom.',['Lesson planning basics (use our templates in the Library)','Assessment in CBE','Classroom management','Keeping records','Writing report-form comments (use the Tools generator)']]];
        var LS={'Digital basics':['A computer has input (keyboard, mouse, touchscreen), a processor, memory, storage and output (screen, speakers). A phone is a small computer. Practise naming each part on a device you use.','Use all ten fingers and keep your eyes on the screen. Learn Ctrl+C (copy), Ctrl+V (paste), Ctrl+Z (undo) and Ctrl+S (save). Practise ten minutes a day.','Type, select text, change font size, make lists and save a file. Use headings to organise longer work and save with a clear file name.','A spreadsheet is a grid of rows and columns, and each box is a cell. Try =SUM(A1:A5) to add numbers. Use it for budgets and marks.','Use long, different passwords and never share codes sent to your phone. Be careful with links from unknown senders. Real organisations never ask you to pay to claim a prize.'],'Study skills':['Write one specific, measurable goal for the term, such as raising a Mathematics mark by 10 points. Break it into weekly steps.','List your subjects, give harder ones more time and plan 25 to 40 minute sessions with breaks. Include rest and meals.','Try headings with bullet points, mind maps or question-and-answer cards. Review notes within a day to remember more.','Test yourself instead of only rereading. Spread revision over several days and link new facts to things you already know.','Sleep well, eat before the exam, read instructions carefully, plan your time per question and check your answers if time remains.'],'Money skills':['Needs are things you must have, such as food and school supplies. Wants are nice to have. List both before you spend.','Write down income and spending for the month. Set aside savings first, even a small amount, then budget the rest.','Check the name and amount before you send money. Never share your PIN. Be careful of messages claiming a mistaken transfer.','Before borrowing, ask the total you will repay and the due date. Avoid borrowing for wants.','List fees, uniform, books and transport for each term. Divide the total by the weeks left to see how much to save each week.']};
        Object.assign(LS,{'Communication skills':['Speak at a steady pace, look at your listener and use simple words. Pause between ideas so people can follow.','Start with a clear greeting or subject line, state your purpose in the first sentence, keep paragraphs short and end with what you need.','Give your full attention, do not interrupt, and repeat back what you heard to check you understood.','Plan three main points, practise aloud and use a short opening and closing. Breathe slowly if you feel nervous.','Agree roles, share tasks fairly, listen to every idea and give kind, specific feedback.'],'Career readiness':['List what you enjoy and what you are good at, then match them to careers. Talk to people who do the jobs that interest you.','Include contact details, education, skills, experience and referees. Keep it to one or two pages with a clear layout.','Write three short paragraphs: why you are applying, what you offer and how to reach you. Address it to a named person where possible.','Research the employer, prepare examples of your strengths, practise answers aloud and prepare two questions to ask.','Compare colleges, TVET institutions, apprenticeships and work. Check entry requirements and costs with the official institution.'],'English and Kiswahili practice':['Learn ten new words each week in both English and Kiswahili and use each in a sentence you say aloud.','Build sentences with a subject, a verb and an object. Swap words to make new sentences.','Read the questions first, then the passage. Underline key words and answer in full sentences.','Plan a beginning, middle and end, use paragraphs and check spelling and punctuation. In insha, use methali and nahau where they fit.','Talk for two minutes on a familiar topic each day. Record yourself and listen for ways to improve.'],'Coding first steps':['A program is a list of clear instructions a computer follows. Practise by writing the steps for making tea.','A variable stores a value under a name, such as score = 0. You can change it as the program runs.','An if statement lets a program choose: if the score is above 50, show Pass, otherwise show Try again.','A loop repeats steps. Use it to count to ten or print a times table without writing every line.','Combine variables, decisions and loops to make a quiz or a simple calculator. Start small and improve it step by step.'],'Teacher skills':['State the learning outcome, plan an introduction, activities and a conclusion, and list resources and how you will assess learning.','Use varied methods such as observation, oral questions, projects and portfolios. Give feedback learners can act on.','Set routines early, praise effort, keep instructions short and address problems calmly and privately.','Keep your record of work, learner progress and assessment evidence up to date each week so reporting is easier.','Describe what the learner can do, give one strength and one next step, and keep the tone encouraging and specific.']});
        var KN={'Digital basics':'Use M-Pesa and eCitizen safely, and watch for fake paybill and prize messages.','Study skills':'Plan around the Kenyan school calendar and your exam timetable, and practise with past papers from your teacher.','Money skills':'Compare mobile money fees, plan for school fees each term and consider saving through a chama or SACCO.','Communication skills':'Practise switching between English, Kiswahili and Sheng to suit your audience.','Career readiness':'Explore KUCCPS programmes, TVET institutions and the certificates employers ask for.','English and Kiswahili practice':'Practise with methali, nahau and everyday market and matatu conversations.','Coding first steps':'Build something local, such as a matatu fare calculator or a school marks tracker.','Teacher skills':'Link examples to learners’ homes: markets, farms, local leaders and community projects.'};
        var CT=['All','Digital','Study','Life','Career','Language','Teaching'],cat='All',q='';
        function ld(){try{return JSON.parse(localStorage.getItem('mfc')||'{}')}catch(e){return{}}}
        function sv(d){try{localStorage.setItem('mfc',JSON.stringify(d))}catch(e){}}
        function rd(){var d=ld(),dn=0,tot=0;K.forEach(function(c){tot+=c[5].length;dn+=(d[c[0]]||[]).length});
        $('#cp')[0].textContent=dn+' of '+tot+' lessons completed on this device.';
        var h=K.map(function(c,ci){return{c:c,ci:ci}}).filter(function(x){var c=x.c;return(cat==='All'||c[1]===cat)&&(!q||(c[0]+' '+c[4]+' '+c[5].join(' ')).toLowerCase().indexOf(q)>-1)}).map(function(x){var c=x.c,a=d[c[0]]||[],pc=Math.round(a.length/c[5].length*100);
        return'<div><span class="tag">'+c[1]+' · '+c[2]+' · '+c[3]+'</span><h3 style="margin-top:.5rem">'+c[0]+'</h3><p>'+c[4]+'</p><p style="font-size:.9rem"><b>In Kenya:</b> '+KN[c[0]]+'</p><div class="pb" style="margin:.6rem 0"><i style="width:'+pc+'%"></i></div><small>'+a.length+' of '+c[5].length+' lessons done</small><details style="margin:.6rem 0"><summary style="cursor:pointer;font-weight:600">Lessons</summary>'+c[5].map(function(l,i){return'<label style="display:flex;gap:.5rem;margin:.4rem 0;color:var(--tx)"><input type="checkbox" data-c="'+c[0]+'" data-i="'+i+'"'+(a.indexOf(i)>-1?' checked':'')+'><span>'+l+((LS[c[0]]||[])[i]?'<br><small style="color:var(--mu)">'+LS[c[0]][i]+'</small>':'')+'</span></label>'}).join('')+'</details><a class="gb o" target="_blank" rel="noopener" href="https://wa.me/254715363944?text='+encodeURIComponent('Hello Mwalimu Family, I am interested in the '+c[0]+' course.')+'">Ask about this course</a></div>'}).join('');
        $('#cl2')[0].innerHTML=h||'<p class="empty">No courses match. Try another search.</p>'}
        $('#ccs')[0].innerHTML=CT.map(function(t,i){return'<button class="chip'+(i?'':' on')+'" data-v="'+t+'" aria-pressed="'+(i?'false':'true')+'">'+t+'</button>'}).join('');
        $('#ccs .chip').forEach(function(b){b.onclick=function(){cat=b.dataset.v;$('#ccs .chip').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});rd()}});
        $('#csq')[0].oninput=function(){q=this.value.trim().toLowerCase();rd()};
        $('#cl2')[0].addEventListener('change',function(e){var t=e.target;if(!t.dataset||t.dataset.c===undefined)return;var d=ld(),a=d[t.dataset.c]||[],i=+t.dataset.i,k=a.indexOf(i);if(t.checked&&k<0)a.push(i);if(!t.checked&&k>-1)a.splice(k,1);d[t.dataset.c]=a;sv(d);var o=t.closest('details').open;rd();var n=$('details',$('#cl2')[0]).filter(function(x){return x.querySelector('[data-c="'+t.dataset.c+'"]')})[0];if(n&&o)n.open=true});
        rd();
        })();
      } catch(e2) { console.warn('Script 3 notice:', e2); }

      // --- Script 4 ---
      try {
        (function(){
        var P=document.getElementById('mfp'),L=document.getElementById('mfl'),I=document.getElementById('mfi'),O=document.getElementById('mfo');
        var KB=[[['result','kjsea','kcse','kpsea','release'],'KJSEA results are expected in December 2026. KCSE and KPSEA are targeted for January 2027. These are targets, so watch official Ministry of Education and KNEC channels.','#exams','Open the Exams hub'],[['fake','scam','pay','early','suspicious'],'Never pay to see results early. Only official Ministry of Education and KNEC channels release results.','#/s4','Read how to spot fake messages'],[['scheme','template','lesson plan','record','download','word'],'Our library has free, editable Word templates for every grade, subject and term.','#library','Open the library'],[['grade 10','pathway','stem','placement','senior'],'Grade 10 pathways are STEM, Social Sciences, and Arts and Sports. Confirm placement details with the Ministry or your school.','#parents','Open the Parents’ hub'],[['kuccps','cluster','university','college','points'],'You can estimate cluster points in Tools. KUCCPS sets the exact cut-offs, so confirm on their site.','#tools','Open Tools'],[['helb','loan','bursary'],'Apply for HELB loans on the official HELB site and never pay agents.','#parents','See official links'],[['course','skill','cv','money','coding','typing','career'],'We have eight self-paced skills courses with progress tracking.','#courses','Browse courses'],[['job','vacancy','hiring','employ'],'Browse education vacancies or submit one for review. Genuine employers never charge application fees.','#jobs','Open Jobs'],[['advert','promote','sponsor','banner'],'You can advertise with a sponsored notice, featured job, newsletter mention or event promotion.','#advertise','See advertising options'],[['tutor','practice','maths','quiz','flashcard'],'Practise maths, take a quick quiz or find a tutor.','#tutoring','Open Tutoring'],[['timetable','revision','marks','comment','calculator'],'Tools include a revision timetable, class marks ranking, report comments and calculators.','#tools','Open Tools'],[['glossary','meaning','cbe','nemis','upi','what is'],'Our glossary explains CBE, KICD, KNEC, KUCCPS, NEMIS, UPI and more.','#help','Open Help and glossary'],[['game','quiz','play','memory','scramble','score'],'Play subject quizzes and learning games from Mwalimu Family. Scores are saved on your device.','#games','Open Games and quizzes'],[['contact','email','subscribe','newsletter'],'You can message us on WhatsApp or use the contact form.','#contact','Open Contact']];
        function add(t,c,l){var d=document.createElement('div');d.className=c;d.appendChild(document.createTextNode(t));if(l){d.appendChild(document.createElement('br'));var a=document.createElement('a');a.href=l[0];a.textContent=l[1]+' →';a.onclick=function(){P.hidden=true;O.setAttribute('aria-expanded','false')};d.appendChild(a)}L.appendChild(d);L.scrollTop=L.scrollHeight}
        function kb(q){q=q.toLowerCase();var best=null,n=0;KB.forEach(function(e){var c=e[0].filter(function(k){return q.indexOf(k)>-1}).length;if(c>n){n=c;best=e}});return best}
        function ask(q){add(q,'u');var ep=window.MF_AI_ENDPOINT;
        function fb(){var e=kb(q);if(e)add(e[1],'b',[e[2],e[3]]);else add('No matching page found. Use the search box on the home page or contact our team on WhatsApp.','b',['https://wa.me/254715363944?text='+encodeURIComponent(q),'Ask on WhatsApp'])}
        if(ep&&window.fetch){fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q})}).then(function(r){return r.json()}).then(function(j){j&&j.reply?add(j.reply,'b'):fb()}).catch(fb)}else fb()}
        add('Welcome. I can direct you to the right page on this site. Select a question or type your own.','b');
        var qs=document.getElementById('mfq');['When are results out?','Where are templates?','Grade 10 pathways','Courses'].forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=function(){ask(t)};qs.appendChild(b)});
        document.getElementById('mff').onsubmit=function(e){e.preventDefault();var v=I.value.trim();if(v){I.value='';ask(v)}};
        O.onclick=function(){P.hidden=!P.hidden;O.setAttribute('aria-expanded',!P.hidden);if(!P.hidden)I.focus()};
        document.getElementById('mfx').onclick=function(){P.hidden=true;O.setAttribute('aria-expanded','false');O.focus()};
        addEventListener('keydown',function(e){if(e.key==='Escape'&&!P.hidden){P.hidden=true;O.focus()}});
        })();
      } catch(e3) { console.warn('Script 4 notice:', e3); }

      // --- Script 5 ---
      try {
        (function(){
        var V=document.getElementById('view'),tr=[location.hash||'#home'],rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
        function back(){if(tr.length>1)history.back();else location.hash='#home'}
        function mk(){var b=document.createElement('button');b.type='button';b.className='bkb';b.textContent='← Back';b.setAttribute('aria-label','Go back to the previous page');b.onclick=back;return b}
        ['news','library','parents','teaching','tools','notices','tutoring','jobs','advertise','activity','videos','about','contact','exams','help','courses','games'].forEach(function(id){var x=document.getElementById(id);if(!x)return;var w=document.createElement('div');w.className='w bkw';w.appendChild(mk());x.insertBefore(w,x.firstChild)});
        function dec(){var a=V.querySelector('.art');if(!V.hidden&&a&&!a.querySelector('.bkb')){var f=a.querySelector(':scope>a.dl');if(f&&/^←/.test(f.textContent))f.remove();a.insertBefore(mk(),a.firstChild)}}
        addEventListener('hashchange',function(){var h=location.hash||'#home',n=tr.length;if(n>1&&tr[n-2]===h)tr.pop();else if(tr[n-1]!==h)tr.push(h);dec()});
        dec();
        var t=document.createElement('button');t.type='button';t.className='bt';t.hidden=true;t.textContent='↑';t.setAttribute('aria-label','Back to top');
        t.onclick=function(){scrollTo({top:0,behavior:rm?'auto':'smooth'})};document.body.appendChild(t);
        function sc(){t.hidden=scrollY<500}addEventListener('scroll',sc,{passive:true});sc();
        })();
      } catch(e4) { console.warn('Script 5 notice:', e4); }

      // --- Script 6 ---
      try {
        (function(){
        var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))},g=function(i){return document.getElementById(i)},E=function(x){return String(x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
        function dl(n,h){var b=new Blob(['<html><head><meta charset="utf-8"></head><body style="font-family:Arial">'+h+'</body></html>'],{type:'application/msword'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n+'.doc';document.body.appendChild(a);a.click();a.remove()}
        var lh='',rh='';
        g('lpb').onclick=function(){var d=+g('lpd').value,m=function(f){return Math.max(1,Math.round(d*f))};
        var o=g('lpo').value.trim()||'________',h='<h2>Lesson plan</h2><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><td><b>School</b></td><td>________</td><td><b>Teacher</b></td><td>________</td></tr><tr><td><b>Grade</b></td><td>'+E(g('lpg').value)+'</td><td><b>Subject</b></td><td>'+E(g('lps').value)+'</td></tr><tr><td><b>Topic</b></td><td>'+E(g('lpt').value||'________')+'</td><td><b>Duration</b></td><td>'+d+' minutes</td></tr><tr><td><b>Date</b></td><td>________</td><td><b>Roll</b></td><td>________</td></tr></table><p><b>Specific learning outcome:</b> '+E(o)+'</p><p><b>Key inquiry question:</b> ________</p><p><b>Learning resources:</b> ________</p><p><b>Local context:</b> ________</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>Stage</th><th>Time</th><th>Teacher activity</th><th>Learner activity</th></tr><tr><td>Introduction</td><td>'+m(.15)+' min</td><td></td><td></td></tr><tr><td>Development</td><td>'+m(.6)+' min</td><td></td><td></td></tr><tr><td>Conclusion</td><td>'+m(.15)+' min</td><td></td><td></td></tr><tr><td>Assessment</td><td>'+m(.1)+' min</td><td></td><td></td></tr></table><p><b>Core competencies:</b> Communication and collaboration, Critical thinking and problem solving, Creativity and imagination, Citizenship, Digital literacy, Learning to learn, Self-efficacy.</p><p><b>Values:</b> ________</p><p><b>Assessment method:</b> ________</p><p><b>Reflection:</b> ________</p>';
        lh=h;g('lpo2').innerHTML=h;g('lpx').hidden=false};
        g('lpx').onclick=function(){dl('Lesson-plan',lh)};
        g('rbb').onclick=function(){var cr=g('rbc').value.split(',').map(function(x){return x.trim()}).filter(Boolean);if(!cr.length)return;
        var h='<h2>Assessment rubric: '+E(g('rbt').value)+'</h2><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>Criterion</th><th>Exceeds expectation</th><th>Meets expectation</th><th>Approaches expectation</th><th>Below expectation</th></tr>'+cr.map(function(c){c=E(c);return'<tr><td><b>'+c+'</b></td><td>Shows '+c+' consistently and independently, and applies it in new situations.</td><td>Shows '+c+' correctly in familiar situations.</td><td>Shows '+c+' with some support or occasional errors.</td><td>Needs substantial support to show '+c+'.</td></tr>'}).join('')+'</table>';
        rh=h;g('rbo').innerHTML=h;g('rbx').hidden=false};
        g('rbx').onclick=function(){dl('Rubric',rh)};
        g('f6').onclick=function(){var t=0;['f1','f2','f3','f4'].forEach(function(i){t+=Math.max(0,+g(i).value||0)});var w=Math.max(1,+g('f5').value||1),f=function(n){return Math.ceil(n).toLocaleString('en-KE')};
        g('f7').textContent='Total: KES '+f(t)+'. Save about KES '+f(t/w)+' per week, or KES '+f(t/(w/4.345))+' per month, to be ready on time.'};
        var LV=[[90,'EE1',8,'Exceeds expectation'],[75,'EE2',7,'Exceeds expectation'],[58,'ME1',6,'Meets expectation'],[41,'ME2',5,'Meets expectation'],[31,'AE1',4,'Approaches expectation'],[21,'AE2',3,'Approaches expectation'],[11,'BE1',2,'Below expectation'],[0,'BE2',1,'Below expectation']];
        g('sc3').onclick=function(){var a=+g('sc1').value,b=+g('sc2').value;if(!(b>0)||a<0||a>b){g('sc4').textContent='Enter a score between 0 and the total.';return}
        var pc=Math.round(a/b*100),l=LV.filter(function(x){return pc>=x[0]})[0];g('sc4').textContent=pc+'%: '+l[1]+' ('+l[2]+' points), '+l[3]};
        var tm=null,left=0,mode=0,TD=g('ft2');
        function show(){var m=Math.floor(left/60),x=left%60;TD.textContent=(m<10?'0':'')+m+':'+(x<10?'0':'')+x}
        function init(){clearInterval(tm);tm=null;var v=g('ft1').value.split(',');left=+v[0]*60;mode=0;show();g('ft4').textContent='Start';g('ft3').textContent=''}
        g('ft1').onchange=init;g('ft5').onclick=init;init();
        g('ft4').onclick=function(){if(tm){clearInterval(tm);tm=null;this.textContent='Resume';return}this.textContent='Pause';var b=this;
        tm=setInterval(function(){left--;if(left<=0){var v=g('ft1').value.split(',');mode=mode?0:1;left=+v[mode]*60;g('ft3').textContent=mode?'Study session complete. Take a break.':'Break over. Start the next session.'}show()},1000)};
        var MP={'KCSE grade calculator':'C L','Report-form comments':'T','KUCCPS cluster points':'P L C','Bulk report comments':'T','Pathway conversation starter':'P L','Revision timetable maker':'L','Class marks and ranking':'T C','Flashcards':'L','Lesson plan builder':'T','Rubric builder':'T','School fees planner':'P C','Score to performance level':'L P C','Focus timer':'L','Word counter':'T L','Attendance calculator':'T C','KJSEA points total':'P L C','Group maker':'T'};
        var CH=[['All',''],['Teachers','T'],['Parents','P'],['Learners','L'],['Calculators','C']],cur='',q='';
        var cards=$('#tools .card').filter(function(c){return c.querySelector('h3')&&MP[c.querySelector('h3').textContent]!==undefined});
        function ft(){var n=0;cards.forEach(function(c){var t=c.querySelector('h3').textContent,ok=(!cur||MP[t].split(' ').indexOf(cur)>-1)&&(!q||t.toLowerCase().indexOf(q)>-1);c.hidden=!ok;if(ok)n++});g('tcn').textContent=n+' of '+cards.length+' tools shown'}
        g('tcs').innerHTML=CH.map(function(c,i){return'<button class="chip'+(i?'':' on')+'" data-v="'+c[1]+'" aria-pressed="'+(i?'false':'true')+'">'+c[0]+'</button>'}).join('');
        $('#tcs .chip').forEach(function(b){b.onclick=function(){cur=b.dataset.v;$('#tcs .chip').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});ft()}});
        g('tsq').oninput=function(){q=this.value.trim().toLowerCase();ft()};ft();
        })();
      } catch(e5) { console.warn('Script 6 notice:', e5); }

      // --- Script 7 ---
      try {
        (function(){
        var g=function(i){return document.getElementById(i)},$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
        function sg(){try{return JSON.parse(localStorage.getItem('mfg')||'{}')}catch(e){return{}}}
        function ss(d){try{localStorage.setItem('mfg',JSON.stringify(d))}catch(e){}}
        function sh(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
        function rn(a,b){return a+Math.floor(Math.random()*(b-a+1))}
        function bs(){var d=sg(),q=d.q||{},p=[];Object.keys(q).forEach(function(k){p.push(k+' '+q[k]+'/5')});
        g('gsc').textContent=(p.length?'Quizzes: '+p.join(', ')+'. ':'No quiz scores yet. ')+(d.m?'Memory match: '+d.m+' moves. ':'')+(d.s?'Speed maths: '+Object.keys(d.s).map(function(k){return k+' '+d.s[k]}).join(', ')+'. ':'')+(d.w?'Word scramble: '+d.w+' solved.':'')}
        $('#gtabs .chip').forEach(function(b){b.onclick=function(){$('#gtabs .chip').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);g(x.dataset.p).hidden=x!==b})}});
        var Q={'Mathematics':[['What is 3/4 of 80?',['40','60','64','70'],1,'Divide 80 by 4 to get 20, then multiply by 3.'],['What is the area of a rectangle 8 cm by 5 cm?',['13 cm²','26 cm²','40 cm²','80 cm²'],2,'Area = length × width.'],['Which number is prime?',['21','27','29','33'],2,'29 has no factors except 1 and itself.'],['What is 15% of 200?',['15','20','30','45'],2,'10% is 20 and 5% is 10, so the total is 30.'],['What is the value of 2³ + 4?',['10','12','14','16'],1,'2³ = 8, then add 4.']],
        'Science':[['Which gas do plants absorb for photosynthesis?',['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'],1,'Plants use carbon dioxide, water and light to make food.'],['What is the boiling point of water at sea level?',['50 °C','90 °C','100 °C','120 °C'],2,'Water boils at 100 °C at sea level.'],['Which organ pumps blood around the body?',['Lungs','Liver','Heart','Kidney'],2,'The heart pumps blood through the body.'],['Which unit measures force?',['Joule','Newton','Watt','Pascal'],1,'Force is measured in newtons.'],['Which plant part absorbs water from the soil?',['Leaf','Stem','Root','Flower'],2,'Roots absorb water and mineral salts.']],
        'Kiswahili':[['What does maji mean?',['Fire','Water','Food','Milk'],1,'Maji means water.'],['Which word means teacher?',['Daktari','Mwalimu','Mkulima','Dereva'],1,'Mwalimu means teacher.'],['Shule means…',['Market','Church','School','Hospital'],2,'Shule means school.'],['What is the plural of kitabu?',['Kitabu','Vitabu','Mitabu','Witabu'],1,'Ki- nouns take vi- in the plural: vitabu.'],['Complete the methali: Haraka haraka haina…',['baraka','faida','mwisho','nguvu'],0,'Haraka haraka haina baraka: rushing brings no blessing.']],
        'English':[['Choose the correct sentence.',['She go to school.','She goes to school.','She going to school.','She gone to school.'],1,'A singular subject takes goes.'],['What is the opposite of ancient?',['Old','Modern','Rare','Large'],1,'Modern is the opposite of ancient.'],['Which word is a noun?',['Quickly','Beautiful','Teacher','Run'],2,'A noun names a person, place or thing.'],['What is the plural of child?',['Childs','Childes','Children','Childrens'],2,'Child has an irregular plural: children.'],['Which mark ends a question?',['.','!','?',','],2,'A question ends with a question mark.']],
        'Kenya and Social Studies':[['What is the capital city of Kenya?',['Mombasa','Nairobi','Kisumu','Nakuru'],1,'Nairobi is Kenya’s capital.'],['Which is the highest mountain in Kenya?',['Mount Kenya','Mount Elgon','Mount Longonot','Aberdare Range'],0,'Mount Kenya is the highest mountain in Kenya.'],['Which ocean borders Kenya?',['Atlantic','Indian','Pacific','Arctic'],1,'Kenya’s coast is on the Indian Ocean.'],['In which year did Kenya gain independence?',['1957','1963','1969','1978'],1,'Kenya became independent in 1963.'],['Which is Africa’s largest lake and borders Kenya?',['Lake Turkana','Lake Victoria','Lake Naivasha','Lake Baringo'],1,'Lake Victoria is the largest lake in Africa.']]};
        g('qzs').innerHTML=Object.keys(Q).map(function(k){return'<option>'+k+'</option>'}).join('');
        var qi=0,qs=0,qd=null,qn='';
        function qr(){var A=g('qza');if(qi>=qd.length){var d=sg();d.q=d.q||{};if(!(d.q[qn]>=qs))d.q[qn]=qs;ss(d);bs();A.innerHTML='<h3>Score: '+qs+' of '+qd.length+'</h3><p>'+(qs===qd.length?'Excellent work.':qs>=3?'Good effort. Try again to improve.':'Keep practising and try again.')+'</p>';return}
        var q=qd[qi];A.innerHTML='<p style="margin-top:1rem"><b>Question '+(qi+1)+' of '+qd.length+'</b></p><p style="color:var(--tx);font-size:1.1rem">'+q[0]+'</p>'+q[1].map(function(o,i){return'<button class="gb o qo" data-i="'+i+'">'+o+'</button>'}).join('')+'<p id="qf"></p>';
        $('.qo',A).forEach(function(b){b.onclick=function(){var i=+b.dataset.i;$('.qo',A).forEach(function(x){x.disabled=true;if(+x.dataset.i===q[2])x.classList.add('ok')});if(i===q[2])qs++;else b.classList.add('no');g('qf').innerHTML=(i===q[2]?'Correct. ':'Not quite. ')+q[3]+'<br><button class="gb" id="qnx">'+(qi+1<qd.length?'Next question':'See score')+'</button>';g('qnx').onclick=function(){qi++;qr()}}})}
        g('qzb').onclick=function(){qn=g('qzs').value;qd=sh(Q[qn].slice());qi=0;qs=0;qr()};
        var MP=[['maji','water'],['nyumba','house'],['shule','school'],['kitabu','book'],['rafiki','friend'],['mwalimu','teacher']],op=[],mv=0,mt=0,lk=false;
        function mi(){var c=[];MP.forEach(function(p,i){c.push([i,p[0]]);c.push([i,p[1]])});sh(c);op=[];mv=0;mt=0;lk=false;g('mmi').textContent='Moves: 0';
        g('mmg').innerHTML=c.map(function(x,k){return'<button class="mmc" data-k="'+x[0]+'" aria-label="Card">?</button>'}).join('');
        $('#mmg .mmc').forEach(function(b,k){b.onclick=function(){if(lk||b.classList.contains('up')||b.classList.contains('ok'))return;b.textContent=c[k][1];b.classList.add('up');op.push(b);
        if(op.length===2){mv++;g('mmi').textContent='Moves: '+mv;var a=op[0],d=op[1];if(a.dataset.k===d.dataset.k){a.classList.replace('up','ok');d.classList.replace('up','ok');mt++;op=[];if(mt===MP.length){var z=sg();if(!z.m||mv<z.m)z.m=mv;ss(z);bs();g('mmi').textContent='Complete in '+mv+' moves.'}}else{lk=true;setTimeout(function(){[a,d].forEach(function(x){x.classList.remove('up');x.textContent='?'});op=[];lk=false},800)}}}})}
        g('mmr').onclick=mi;mi();
        var sp={t:0,s:0,a:0,iv:null};
        function sq(){var o=g('spo').value,a=rn(2,12),b=rn(2,12);if(o==='+'){a=rn(1,50);b=rn(1,50);sp.a=a+b}else if(o==='−'){a=rn(10,60);b=rn(1,a);sp.a=a-b}else sp.a=a*b;g('spq').textContent=a+' '+o+' '+b+' = ?'}
        function sk(){if(!sp.iv)return;var v=g('spa').value;if(v==='')return;if(+v===sp.a)sp.s++;g('spa').value='';g('spr').textContent='Score: '+sp.s;sq();g('spa').focus()}
        g('sps').onclick=function(){clearInterval(sp.iv);sp.t=60;sp.s=0;g('spr').textContent='Score: 0';g('spa').disabled=false;g('spk').disabled=false;g('spt').textContent='Time left: 60';sq();g('spa').focus();
        sp.iv=setInterval(function(){sp.t--;g('spt').textContent='Time left: '+sp.t;if(sp.t<=0){clearInterval(sp.iv);sp.iv=null;g('spa').disabled=true;g('spk').disabled=true;var o=g('spo').value,d=sg();d.s=d.s||{};if(!(d.s[o]>=sp.s))d.s[o]=sp.s;ss(d);bs();g('spr').textContent='Time is up. Final score: '+sp.s}},1000)};
        g('spk').onclick=sk;g('spa').onkeydown=function(e){if(e.key==='Enter')sk()};
        var WD=[['MWALIMU','Teacher in Kiswahili'],['SCHOOL','Where learners study'],['NAIROBI','Capital of Kenya'],['LIBRARY','Place with many books'],['KITABU','Book in Kiswahili'],['SCIENCE','Study of nature and experiments'],['MOUNTAIN','Mount Kenya is one'],['RAFIKI','Friend in Kiswahili'],['HOMEWORK','Work done after class']],wc='',ws=0;
        function wn(){var w=WD[rn(0,WD.length-1)];wc=w[0];var x;do{x=sh(wc.split('')).join('')}while(x===wc);g('wsq').textContent=x;g('wsh').textContent='Hint: '+w[1];g('wsa').value='';g('wsr').textContent=ws?'Solved: '+ws:''}
        function wk(){var v=g('wsa').value.trim().toUpperCase();if(!v)return;if(v===wc){ws++;var d=sg();if(!(d.w>=ws))d.w=ws;ss(d);bs();wn();g('wsr').textContent='Correct. Solved: '+ws}else g('wsr').textContent='Try again.'}
        g('wsk').onclick=wk;g('wsa').onkeydown=function(e){if(e.key==='Enter')wk()};g('wsn').onclick=wn;wn();bs();
        /* extra tools */
        var G=function(i){return document.getElementById(i)};
        G('wc1').oninput=function(){var t=this.value.trim(),w=t?t.split(/\s+/).length:0,sn=t?(t.match(/[.!?]+/g)||[]).length:0;G('wc2').textContent=w+' words, '+t.length+' characters, '+sn+' sentences, about '+Math.max(w?1:0,Math.round(w/200))+' min read.'};
        G('at3').onclick=function(){var p=+G('at1').value||0,a=+G('at2').value||0,t=p+a;G('at4').textContent=t?'Attendance: '+(p/t*100).toFixed(1)+'% ('+p+' of '+t+' days).':'Enter days present or absent.'};
        G('kp2').onclick=function(){var v=G('kp1').value.split(',').map(Number).filter(function(x){return x>=1&&x<=8});G('kp3').textContent=v.length>9?'KJSEA has nine learning areas. Enter up to nine scores.':v.length?'Total: '+v.reduce(function(a,b){return a+b},0)+' of '+v.length*8+' points'+(v.length===9?' (maximum 72)':'')+'. Average: '+(v.reduce(function(a,b){return a+b},0)/v.length).toFixed(1)+' per learning area.':'Enter points from 1 to 8, separated by commas.'};
        G('gm3').onclick=function(){var n=G('gm1').value.split('\n').map(function(x){return x.trim()}).filter(Boolean),k=Math.max(2,+G('gm2').value||2);if(!n.length)return;sh(n);var o=[];for(var i=0;i<n.length;i+=k)o.push('Group '+(o.length+1)+': '+n.slice(i,i+k).join(', '));G('gm4').textContent=o.join('\n')};
        })();
      } catch(e6) { console.warn('Script 7 notice:', e6); }

      // --- mf-client.js ---
      try {
        /* Mwalimu Family: client glue for forms, newsletter, assistant and offline notice.
           Set window.MF_API in index.html (e.g. "https://api.mwalimufamily.com" or "" for same origin
           when the worker is routed at /api/*). While MF_API is empty, everything falls back to WhatsApp,
           exactly as the original page did. */
        (function () {
          'use strict';
          var API = (window.MF_API || '').replace(/\/$/, '');
          var WA = '254715363944';
          var hasApi = !!API;
        
          function el(tag, css, html) { var n = document.createElement(tag); if (css) n.style.cssText = css; if (html) n.innerHTML = html; return n; }
        
          var toastNode = null;
          function toast(html) {
            if (toastNode) toastNode.remove();
            toastNode = el('div',
              'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(1rem + env(safe-area-inset-bottom,0px));z-index:500;' +
              'max-width:min(92vw,32rem);background:#1a3d1b;color:#fff;padding:.9rem 1.1rem;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.35);font-size:.95rem;line-height:1.5');
            toastNode.setAttribute('role', 'status');
            toastNode.innerHTML = html + ' <button type="button" aria-label="Dismiss" style="margin-left:.5rem;background:none;border:0;color:#fff;font-size:1.2rem;cursor:pointer">×</button>';
            toastNode.querySelector('button').onclick = function () { toastNode.remove(); toastNode = null; };
            toastNode.querySelectorAll('a').forEach(function (a) { a.style.color = '#f4a261'; a.style.textDecoration = 'underline'; });
            document.body.appendChild(toastNode);
          }
        
          function post(path, body) {
            return fetch(API + path, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            }).then(function (r) {
              return r.json().catch(function () { return {}; }).then(function (j) {
                if (!r.ok || !j.ok) { var e = new Error('api'); e.status = r.status; throw e; }
                return j;
              });
            });
          }
        
          // Used by the five forms (job, advert, tutor request, tutor application, notice)
          window.MF = {
            submit: function (kind, title, ref, fields, waUrl) {
              if (!hasApi) { window.open(waUrl, '_blank'); return; }
              post('/api/submit', { type: kind, ref: ref, fields: fields, consent: true, website: '' })
                .catch(function (e) {
                  var why = e.status === 429 ? 'Too many requests just now.' : 'We could not send your details.';
                  toast(why + ' <a href="' + waUrl + '" target="_blank" rel="noopener">Send on WhatsApp instead</a> (reference ' + ref + ').');
                });
            }
          };
        
          // Assistant: the page already calls window.MF_AI_ENDPOINT when it is set
          if (hasApi) window.MF_AI_ENDPOINT = API + '/api/chat';
        
          // Newsletter
          var btn = document.getElementById('mfsb');
          if (btn) {
            var status = document.getElementById('mfss');
            var say = function (t, bad) { status.style.color = bad ? '#b3261e' : 'inherit'; status.innerHTML = t; };
            btn.addEventListener('click', function () {
              var name = (document.getElementById('nm').value || '').trim();
              var email = (document.getElementById('em').value || '').trim();
              var ok = document.getElementById('mfck').checked;
              var hp = document.getElementById('mfhp').value;
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return say('Please enter a valid email address.', true);
              if (!ok) return say('Please tick the box to agree.', true);
              var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Please add me to Mwalimu Family email updates. Email: ' + email);
              if (!hasApi) { window.open(wa, '_blank'); return say('Opening WhatsApp so you can confirm your sign-up.'); }
              btn.disabled = true; say('Subscribing…');
              post('/api/subscribe', { name: name, email: email, consent: true, website: hp })
                .then(function () { say('Thank you. You are on the list.'); document.getElementById('em').value = ''; })
                .catch(function () { say('We could not subscribe you just now. <a href="' + wa + '" target="_blank" rel="noopener" style="text-decoration:underline">Sign up on WhatsApp instead</a>.', true); })
                .then(function () { btn.disabled = false; });
            });
          }
        
          // Footer privacy link
          var bot = document.querySelector('footer .bot p');
          if (bot) { var a = el('a'); a.href = 'privacy.html'; a.textContent = 'Privacy'; bot.appendChild(document.createTextNode(' \u00a0 ')); bot.appendChild(a); }
        
          // Offline notice
          var offBar = null;
          function net() {
            if (!navigator.onLine && !offBar) {
              offBar = el('div', 'position:fixed;top:0;left:0;right:0;z-index:400;background:#f4a261;color:#1a1a1a;text-align:center;font-size:.9rem;padding:.35rem;padding-top:calc(.35rem + env(safe-area-inset-top,0px))',
                'You are offline. Showing saved content; forms and the assistant need data.');
              document.body.appendChild(offBar);
            } else if (navigator.onLine && offBar) { offBar.remove(); offBar = null; }
          }
          window.addEventListener('online', net); window.addEventListener('offline', net); net();
        })();
      } catch(eClient) { console.warn('mf-client notice:', eClient); }

    } catch (err) {
      console.error('Mwalimu site init error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

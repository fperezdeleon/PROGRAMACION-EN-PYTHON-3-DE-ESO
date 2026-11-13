(function(){
  var KEY='cyr-python-xp-v1';
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
  function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  var body=document.body, course=body.dataset.course, page=body.dataset.page;
  var LEVELS=[[0,'Novato 🌱'],[150,'Aprendiz 🔧'],[400,'Programador 💻'],[700,'Hacker 🕶️'],[1000,'Maestro Python 🐍']];
  function total(d){var t=0,c=d[course]||{};for(var k in c){t+=(c[k].quiz||0)+(c[k].chk||0)}return t}
  function level(x){var l=LEVELS[0];LEVELS.forEach(function(v){if(x>=v[0])l=v});return l}
  function toast(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.style.display='block';setTimeout(function(){t.style.display='none'},2600)}
  function render(){
    var d=load(),x=total(d),l=level(x);
    var n=document.getElementById('xpnum');if(n)n.textContent=x+' XP · '+l[1];
    var b=document.getElementById('xpbar');if(b)b.style.width=Math.min(100,x/10)+'%';
    document.querySelectorAll('.badge[data-s]').forEach(function(e){
      var c=(d[course]||{})[e.dataset.s];if(c&&c.chk)e.classList.add('on')});
  }
  function award(kind,xp){
    var d=load();d[course]=d[course]||{};d[course][page]=d[course][page]||{};
    if(d[course][page][kind])return;
    d[course][page][kind]=xp;save(d);toast('+'+xp+' XP 🎉');render();
  }
  document.querySelectorAll('.quiz').forEach(function(qz){
    var qs=qz.querySelectorAll('.q'),right=0,done=0;
    qs.forEach(function(q){
      q.querySelectorAll('.opt').forEach(function(o){
        o.addEventListener('click',function(){
          if(q.classList.contains('done'))return;
          q.classList.add('done');done++;
          if(o.dataset.ok==='1'){o.classList.add('ok');right++}
          else{o.classList.add('ko');q.querySelector('.opt[data-ok="1"]').classList.add('ok')}
          if(done===qs.length){
            var xp=Math.round(parseInt(qz.dataset.xp||'30')*right/qs.length);
            var r=qz.querySelector('.result');if(r)r.textContent='Has acertado '+right+' de '+qs.length+' → '+xp+' XP';
            award('quiz',xp);
          }
        });
      });
    });
  });
  var chks=document.querySelectorAll('.chk input');
  chks.forEach(function(c){c.addEventListener('change',function(){
    var all=true;chks.forEach(function(i){if(!i.checked)all=false});
    if(all)award('chk',parseInt(document.querySelector('.chk').dataset.xp||'50'))
  })});
  document.querySelectorAll('pre').forEach(function(p){
    if(p.classList.contains('out'))return;
    var b=document.createElement('button');b.className='copy';b.textContent='Copiar';
    b.onclick=function(){navigator.clipboard&&navigator.clipboard.writeText(p.innerText.replace(/^Copiar\n?/,''));b.textContent='¡Copiado!';setTimeout(function(){b.textContent='Copiar'},1200)};
    p.appendChild(b);
  });
  render();
})();

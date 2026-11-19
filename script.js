(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var root=document.documentElement,themeBtn=$('#themeBtn');
  function setTheme(t){root.setAttribute('data-theme',t);themeBtn.textContent=t==='dark'?'Modo claro':'Modo escuro';try{localStorage.setItem('voxy-theme',t)}catch(e){}}
  var saved=null;try{saved=localStorage.getItem('voxy-theme')}catch(e){}
  setTheme(saved||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  themeBtn.addEventListener('click',function(){setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark')});
  // Sidebar dinamica
  var sections=$$('section.tbl'),list=$('#navList'),side=$('#sidebar');
  sections.forEach(function(s){var li=document.createElement('li'),a=document.createElement('a');a.href='#'+s.id;a.textContent=s.id;a.addEventListener('click',function(){side.classList.remove('open')});li.appendChild(a);li.setAttribute('data-for',s.id);list.appendChild(li)});
  $('#navCount').textContent=sections.length;
  $('#menuBtn').addEventListener('click',function(){side.classList.toggle('open')});
  // Pesquisa em tempo real
  var input=$('#search'),count=$('#count'),empty=$('#empty');
  function filter(){
    var q=input.value.trim().toLowerCase(),vt=0,vc=0;
    sections.forEach(function(s){
      var nameHit=!q||s.getAttribute('data-name').indexOf(q)>-1,rows=$$('tbody tr',s),shown=0;
      rows.forEach(function(r){var hit=nameHit||r.getAttribute('data-col').indexOf(q)>-1;r.hidden=!hit;if(hit)shown++});
      s.hidden=shown===0;list.querySelector('[data-for="'+s.id+'"]').hidden=shown===0;
      if(shown){vt++;vc+=shown}
    });
    count.textContent=vt+' tabela(s) e '+vc+' atributo(s) exibidos';empty.hidden=vt>0;
  }
  input.addEventListener('input',filter);filter();
  // Modais
  function open(m){m.hidden=false;document.body.style.overflow='hidden'}
  function close(m){m.hidden=true;document.body.style.overflow=''}
  $$('.modal').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m||e.target.hasAttribute('data-close'))close(m)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')$$('.modal').forEach(close)});
  // DER com Panzoom
  var pz=null,img=$('#derImg'),stage=$('#stage');
  $('#derBtn').addEventListener('click',function(){
    open($('#derModal'));
    if(!pz&&window.Panzoom){pz=Panzoom(img,{maxScale:12,minScale:0.5,canvas:true});stage.addEventListener('wheel',pz.zoomWithWheel)}
    if(pz)pz.reset({animate:false});
  });
  $('#zin').addEventListener('click',function(){pz&&pz.zoomIn()});
  $('#zout').addEventListener('click',function(){pz&&pz.zoomOut()});
  $('#zreset').addEventListener('click',function(){pz&&pz.reset()});
  // DDL
  $('#ddlBtn').addEventListener('click',function(){open($('#ddlModal'))});
  var cp=$('#copyBtn');
  cp.addEventListener('click',function(){
    var txt=$('#ddlCode').textContent;
    var ok=function(){cp.textContent='Copiado!';setTimeout(function(){cp.textContent='Copiar DDL'},2000)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok)}
    else{var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();ok()}
  });
})();

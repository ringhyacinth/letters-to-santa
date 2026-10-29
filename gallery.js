(() => {
  let overlay, lastFocus, scrollY=0, savedStyle, restoration, closing=false;
  ['posti-2026-letter-set.jpg','posti-2026-english-letter.jpg'].forEach(name=>{const img=new Image();img.src='./'+name;if(img.decode)img.decode().catch(()=>{});});
  function focusQuietly(node){if(node && node.isConnected)try{node.focus({preventScroll:true})}catch(_){node.focus()}}
  function hide(){
    if(!overlay || overlay.hidden || closing)return;
    closing=true;overlay.classList.remove('is-open');
    const delay=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:220;
    setTimeout(()=>{
      overlay.hidden=true;
      Object.keys(savedStyle).forEach(key=>{document.body.style[key]=savedStyle[key]});
      const behavior=document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,scrollY);
      focusQuietly(lastFocus);window.scrollTo(0,scrollY);
      document.documentElement.style.scrollBehavior=behavior;
      history.scrollRestoration=restoration;closing=false;
    },delay);
  }
  function close(){ if(!overlay || overlay.hidden)return; hide(); if(history.state && history.state.santaGallery)history.back(); }
  window.addEventListener('popstate',hide);
  function open(){
    if(overlay && !overlay.hidden)return;
    lastFocus=document.activeElement;scrollY=window.scrollY;
    savedStyle={};['position','top','left','width','overflow'].forEach(key=>savedStyle[key]=document.body.style[key]);
    restoration=history.scrollRestoration;history.scrollRestoration='manual';
    if(!overlay){
      overlay=document.createElement('div'); overlay.className='reply-gallery'; overlay.hidden=true;
      overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-labelledby','reply-gallery-title');
      overlay.innerHTML='<div class="reply-gallery-panel"><button type="button" class="reply-gallery-close">关闭 ×</button><h2 id="reply-gallery-title">收到的信，会是什么样？</h2><p>看看芬兰邮政 Posti 展示的真实来信样本：一封信，还可能附上证书和小卡片。</p><p><strong>以下是 2026 年官方付费来信样本。</strong>各邮局、年份与项目的回信内容不同，请以对应邮局说明为准。</p><figure><img src="./posti-2026-letter-set.jpg" alt="芬兰 Posti 2026 年圣诞来信全套官方样本，包括信件、证书、信封和涂色卡"><figcaption>01 · 信封与随信小惊喜</figcaption></figure><figure><img src="./posti-2026-english-letter.jpg" alt="芬兰 Posti 2026 年英文圣诞来信官方样本"><figcaption>02 · 展开一封英文圣诞来信</figcaption></figure><p class="reply-source">图片来源：芬兰邮政 Posti · Santa’s Letter（2026）。版权归 Posti／原作者。<br>shop.posti.fi/en/santa/product/santas-letter</p></div>';
      document.body.appendChild(overlay);
      overlay.querySelectorAll('img').forEach(img=>{img.width=900;img.height=1273;});
      overlay.querySelector('button').addEventListener('click',close);
      overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
      overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){e.preventDefault();overlay.querySelector('button').focus()}});
    }
    history.pushState(Object.assign({},history.state,{santaGallery:true}),'');
    const width=document.body.getBoundingClientRect().width;
    Object.assign(document.body.style,{position:'fixed',top:-scrollY+'px',left:'0',width:width+'px',overflow:'hidden'});
    overlay.hidden=false;overlay.scrollTop=0;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!closing&&!overlay.hidden){overlay.classList.add('is-open');focusQuietly(overlay.querySelector('button'));}}));
  }
  window.SantaGallery={open,close};
})();

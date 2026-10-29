// Native coordinates are container-relative. Reserve the complete top controls,
// not just horizontal margins. Keep a conservative fallback if the bridge is late.
(() => {
  if(document.documentElement.dataset.build!=='minitool')return;
  let revision=0;
  async function update(){
    const ticket=++revision;
    const xhs=window.xhs, bridge=xhs && xhs.miniTool;
    if(!bridge || typeof bridge.getWindowInfo!=='function')return;
    try {
      const info=await bridge.getWindowInfo();
      if(ticket!==revision)return;
      const area=info.safeArea;
      let top=area && Number.isFinite(area.top)?Math.max(0,area.top):null;
      if(top===null && Number.isFinite(info.statusBarHeight) && Number.isFinite(info.screenTop))top=Math.max(0,info.statusBarHeight-info.screenTop);
      let left=80;
      Object.keys(info.menuButtons||{}).forEach(key=>{
        const rect=info.menuButtons[key];
        if(rect && Number.isFinite(rect.bottom) && rect.bottom>=0)top=Math.max(top===null?0:top,rect.bottom+16);
        if(rect && Number.isFinite(rect.right) && rect.right<window.innerWidth/2)left=Math.max(left,rect.right+16);
      });
      if(top!==null)document.documentElement.style.setProperty('--santa-top-space',Math.ceil(top)+'px');
      document.documentElement.style.setProperty('--santa-left-gap',Math.ceil(left)+'px');
    }catch(_){}
  }
  update();setTimeout(update,1200);
  window.addEventListener('resize',update);
  window.addEventListener('pageshow',update);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});
})();

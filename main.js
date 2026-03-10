(function(){
  var lbar=document.getElementById('lbar');
  var lpct=document.getElementById('lpct');
  var loader=document.getElementById('loader');

  function hide(){
    if(lbar)lbar.style.width='100%';
    if(lpct)lpct.textContent='100%';
    setTimeout(function(){if(loader)loader.classList.add('out');},350);
  }

  var prog=0;
  var iv=setInterval(function(){
    prog=Math.min(prog+Math.random()*14+3,90);
    if(lbar)lbar.style.width=prog+'%';
    if(lpct)lpct.textContent=Math.round(prog)+'%';
  },100);

  window.addEventListener('load',function(){clearInterval(iv);hide();});
  setTimeout(function(){clearInterval(iv);hide();},3500);
})();

// CURSOR
var cur=document.getElementById('cur');
var curR=document.getElementById('cur-ring');
var mx=0,my=0,rx=0,ry=0;
if(cur&&curR){
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    cur.style.left=mx+'px';cur.style.top=my+'px';
  });
  (function animC(){
    rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
    curR.style.left=rx+'px';curR.style.top=ry+'px';
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('a,button,.card,.bt,.faq-q,.pill,.mani,.tl-item').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('hov');curR.classList.add('hov');});
    el.addEventListener('mouseleave',function(){cur.classList.remove('hov');curR.classList.remove('hov');});
  });
}

// CANVAS PARTICLES
var cvs=document.getElementById('cvs');
if(cvs){
  var ctx=cvs.getContext('2d');
  var W,H,pts=[];
  function rsz(){W=cvs.width=window.innerWidth;H=cvs.height=window.innerHeight;}
  rsz();
  window.addEventListener('resize',rsz);
  function Pt(){this.r();}
  Pt.prototype.r=function(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.22;this.vy=(Math.random()-.5)*.22;this.s=Math.random()*1.2+.3;this.a=Math.random()*.35+.06;};
  Pt.prototype.u=function(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.r();};
  Pt.prototype.d=function(){ctx.beginPath();ctx.arc(this.x,this.y,this.s,0,Math.PI*2);ctx.fillStyle='rgba(124,58,237,'+this.a+')';ctx.fill();};
  for(var i=0;i<120;i++)pts.push(new Pt());
  function conn(){
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<95){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(124,58,237,'+(0.09*(1-d/95))+')';ctx.lineWidth=.4;ctx.stroke();}
    }
  }
  (function anim(){ctx.clearRect(0,0,W,H);pts.forEach(function(p){p.u();p.d();});conn();requestAnimationFrame(anim);})();
}

// NAVBAR SCROLL
var navbar=document.getElementById('navbar');
if(navbar){
  window.addEventListener('scroll',function(){
    navbar.classList.toggle('scrolled',window.scrollY>60);
  });
}

// ACTIVE NAV LINKS
var navLinks=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',function(){
  var cur='';
  document.querySelectorAll('section[id]').forEach(function(s){
    if(window.scrollY>=s.offsetTop-160)cur=s.id;
  });
  navLinks.forEach(function(a){
    a.classList.toggle('active',a.getAttribute('href')==='#'+cur);
  });
});

// REVEAL ON SCROLL
var rvObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on');});
},{threshold:0.08});
document.querySelectorAll('.rv').forEach(function(el){rvObs.observe(el);});

// COUNTER ANIMATION
var cObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting&&!e.target.dataset.done){
      e.target.dataset.done='1';
      var target=parseInt(e.target.getAttribute('data-count'));
      var c=0;var step=target/60;
      var t=setInterval(function(){
        c=Math.min(c+step,target);
        e.target.textContent=Math.round(c);
        if(c>=target)clearInterval(t);
      },16);
    }
  });
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(function(el){cObs.observe(el);});

// MOBILE MENU
function toggleMob(){
  var mob=document.getElementById('mob');
  var ham=document.getElementById('ham');
  if(!mob)return;
  var open=mob.classList.toggle('open');
  if(ham)ham.setAttribute('aria-expanded',open);
  document.body.style.overflow=open?'hidden':'';
}
function closeMob(){
  var mob=document.getElementById('mob');
  var ham=document.getElementById('ham');
  if(!mob)return;
  mob.classList.remove('open');
  if(ham)ham.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
window.toggleMob=toggleMob;
window.closeMob=closeMob;

// FAQ ACCORDION
function faqToggle(btn){
  var item=btn.parentElement;
  var wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){
    i.classList.remove('open');
    var b=i.querySelector('.faq-q');
    if(b)b.setAttribute('aria-expanded','false');
  });
  if(!wasOpen){
    item.classList.add('open');
    btn.setAttribute('aria-expanded','true');
  }
}
window.faqToggle=faqToggle;

// CONTACT FORM
var form=document.getElementById('contact-form');
var fmsg=document.getElementById('form-msg');
if(form&&fmsg){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){
          fmsg.textContent='✓ Message envoyé — réponse sous 48h.';
          fmsg.className='ok';fmsg.style.display='block';
          form.reset();
        }else{
          fmsg.textContent='Une erreur est survenue. Écrivez directement à foundation@chronosensiumtechnologies.org';
          fmsg.className='err';fmsg.style.display='block';
        }
      })
      .catch(function(){
        fmsg.textContent='Erreur réseau. Écrivez à foundation@chronosensiumtechnologies.org';
        fmsg.className='err';fmsg.style.display='block';
      });
  });
}

// TICKER DUPLICATE CHECK
var ticker=document.getElementById('ticker');
if(ticker){ticker.style.willChange='transform';}

// KEYBOARD NAV — ESC closes mobile menu
document.addEventListener('keydown',function(e){
  if(e.key==='Escape')closeMob();
});

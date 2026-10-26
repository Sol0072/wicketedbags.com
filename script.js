document.addEventListener("DOMContentLoaded",function(){
  var m=document.querySelector(".mcta"), q=document.getElementById("quote");
  function tick(){ if(!m) return; var y=window.scrollY, qt=q?q.getBoundingClientRect():null;
    var inQuote=qt && qt.top<window.innerHeight && qt.bottom>0;
    m.classList.toggle("show", y>500 && !inQuote); }
  window.addEventListener("scroll",tick,{passive:true}); tick();
  document.querySelectorAll(".yt").forEach(function(box){
    var a=box.querySelector(".yt-btn"); if(!a) return;
    a.addEventListener("click",function(e){
      e.preventDefault();
      var f=document.createElement("iframe");
      f.src="https://www.youtube-nocookie.com/embed/"+box.dataset.id+"?autoplay=1&rel=0&playsinline=1";
      f.title="Hudson-Sharp 5750W high speed wicketer"; f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen=true;
      box.innerHTML=""; box.appendChild(f);
    });
  });
  var f=document.getElementById("quoteForm"); if(!f) return;
  f.addEventListener("submit",function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    var d=new FormData(f), L=[["Name","name"],["Company","company"],["Email","email"],["Phone","phone"],["Product","product"],["Bag size","size"],["Quantity","qty"],["Film","film"],["Details","details"]];
    var body=L.map(function(p){return p[0]+": "+(d.get(p[1])||"")}).join("\n");
    var prod=d.get("product")||"", co=d.get("company")||"";
    var subj="Quote request – "+(prod && prod!=="Not sure" ? prod : "Wicketed bags")+(co?" – "+co:"");
    var to=(f.getAttribute("action")||"mailto:quote@wicketedbags.com").replace(/^mailto:/,"");
    window.location.href="mailto:"+to+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
  });
});

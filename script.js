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
  var to=f.getAttribute("data-to")||"quote@wicketedbags.com";
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  f.addEventListener("submit",function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    var d=new FormData(f);
    if(d.get("botcheck")) return;
    var L=[["Name","name"],["Company","company"],["Email","email"],["Phone","phone"],["Product","product"],["Bag size","size"],["Quantity","qty"],["Film","film"],["Details","details"]];
    var prod=d.get("product")||"", co=d.get("company")||"", em=d.get("email")||"";
    var data={access_key:d.get("access_key"), from_name:"WicketedBags.com", replyto:em, email:em,
      subject:"Quote request – "+(prod && prod!=="Not sure" ? prod : "Wicketed bags")+(co?" – "+co:"")};
    L.forEach(function(p){ if(p[1]!=="email") data[p[0]]=d.get(p[1])||""; });
    data["Sent from"]=location.href;
    var btn=f.querySelector('button[type="submit"]'), label=btn.textContent, err=f.querySelector(".form-err");
    if(err) err.remove();
    btn.disabled=true; btn.textContent="Sending…";
    fetch(f.getAttribute("action"),{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){ if(!r.ok||!j.success) throw new Error(j.message||r.status); });})
      .then(function(){
        f.innerHTML='<div class="thanks" role="status" tabindex="-1"><h3>Thanks, we got your request.</h3><p>We\u2019ll reply to <strong>'+esc(em)+'</strong> soon. Need to add something? Email <a href="mailto:'+to+'">'+to+'</a>.</p></div>';
        var t=f.querySelector(".thanks"); t.focus(); t.scrollIntoView({block:"center"});
      })
      .catch(function(){
        btn.disabled=false; btn.textContent=label;
        var p=document.createElement("p"); p.className="note form-err"; p.setAttribute("role","alert");
        p.innerHTML='Sorry, that didn\u2019t send. Please try again, or email <a href="mailto:'+to+'">'+to+'</a>.';
        btn.insertAdjacentElement("afterend",p);
      });
  });
});

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
  // "Other" in a select reveals its own required text box ("Type the film" etc.)
  function syncOther(sel){
    var box=f.querySelector('.other[data-for="'+sel.name+'"]'); if(!box) return;
    var inp=box.querySelector("input"), on=sel.value==="Other";
    box.hidden=!on; inp.disabled=!on; inp.required=on;
    if(!on){ inp.value=""; clearBad(inp); }
  }
  // Every field but Details is required: mark empty ones with a red outline + "Required"
  function clearBad(el){
    el.classList.remove("bad"); el.removeAttribute("aria-invalid");
    var lab=el.closest("label"), m=lab&&lab.querySelector(".req-msg"); if(m) m.remove();
  }
  function markBad(el,msg){
    el.classList.add("bad"); el.setAttribute("aria-invalid","true");
    var lab=el.closest("label"); if(!lab) return;
    var m=lab.querySelector(".req-msg"); if(!m){ m=document.createElement("span"); m.className="req-msg"; lab.appendChild(m); }
    m.textContent=msg;
  }
  function check(el){
    if(el.disabled||!el.required) return true;
    var v=(el.value||"").trim();
    if(!v){ markBad(el,"Required"); return false; }
    if(el.type==="email" && el.validity && el.validity.typeMismatch){ markBad(el,"Enter a valid email"); return false; }
    clearBad(el); return true;
  }
  f.noValidate=true; // our own messages replace the browser bubble (native `required` still guards no-JS posts)
  f.querySelectorAll("select").forEach(function(s){ syncOther(s); s.addEventListener("change",function(){ syncOther(s); check(s); }); });
  f.querySelectorAll("input,select,textarea").forEach(function(el){
    el.addEventListener("input",function(){ if(el.classList.contains("bad")) check(el); });
    el.addEventListener("blur",function(){ if(el.classList.contains("bad")) check(el); });
  });
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var bad=[]; f.querySelectorAll("input[required],select[required]").forEach(function(el){ if(!check(el)) bad.push(el); });
    if(bad.length){ bad[0].scrollIntoView({block:"center"}); try{ bad[0].focus({preventScroll:true}); }catch(_){ bad[0].focus(); } return; }
    var d=new FormData(f);
    if(d.get("botcheck")) return;
    function val(n){ var v=(d.get(n)||"").trim(); if(v==="Other"){ var o=(d.get(n+"_other")||"").trim(); return o?"Other: "+o:"Other"; } return v; }
    var L=[["Name","name"],["Company","company"],["Email","email"],["Phone","phone"],["Bag size","size"],["Quantity","qty"],["Product","product"],["Film","film"],["Structure","structure"],["Gauge (mil)","gauge"],["Details","details"]];
    var prod=val("product").replace(/^Other: /,""), co=(d.get("company")||"").trim(), em=(d.get("email")||"").trim();
    var data={access_key:d.get("access_key"), from_name:"WicketedBags.com", replyto:em, email:em,
      subject:"Quote request – "+(prod && prod!=="Not sure" && prod!=="Other" ? prod : "Wicketed bags")+(co?" – "+co:"")};
    L.forEach(function(p){ if(p[1]!=="email") data[p[0]]=val(p[1])||(p[1]==="details"?"(none)":""); });
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

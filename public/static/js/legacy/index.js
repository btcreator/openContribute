!function(){let e=document.querySelector(".tail-text"),t=document.getElementById("search"),r=document.querySelector(".btn-search");setInterval((()=>{let t=["ceive","nect","struct","tribute"],r=1;return()=>{e.classList.add("reverse"),setTimeout(()=>{e.textContent=t[r++],e.classList.remove("reverse")},1300),r>=t.length&&(r=0)}})(),4500),r.addEventListener("click",()=>window.location.replace(`/search?q=${t.value}`))}();
//# sourceMappingURL=index.js.map

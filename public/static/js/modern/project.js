(()=>{var t=globalThis;function e(t,e,r,n){Object.defineProperty(t,e,{get:r,set:n,enumerable:!0,configurable:!0})}var r={},n={},i=t.parcelRequire9de2;null==i&&((i=function(t){if(t in r)return r[t].exports;if(t in n){var e=n[t];delete n[t];var i={id:t,exports:{}};return r[t]=i,e.call(i.exports,i,i.exports),i.exports}var o=Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(t,e){n[t]=e},t.parcelRequire9de2=i);var o=i.register;o("h8FS0",function(t,e){"use strict";i("4QbOH"),i("Tbe2h")}),o("4QbOH",function(t,e){"use strict";var r=i("9BmrR"),n=i("41mV7"),o=i("cHGAE").clear;r({global:!0,bind:!0,enumerable:!0,forced:n.clearImmediate!==o},{clearImmediate:o})}),o("9BmrR",function(t,e){"use strict";var r=i("41mV7"),n=i("6WEnT").f,o=i("i9Y0N"),a=i("iuK4Q"),s=i("1huun"),c=i("dHrFU"),u=i("cvI2t");t.exports=function(t,e){var i,l,d,f,p,v=t.target,h=t.global,m=t.stat;if(i=h?r:m?r[v]||s(v,{}):r[v]&&r[v].prototype)for(l in e){if(f=e[l],d=t.dontCallGetSet?(p=n(i,l))&&p.value:i[l],!u(h?l:v+(m?".":"#")+l,t.forced)&&void 0!==d){if(typeof f==typeof d)continue;c(f,d)}(t.sham||d&&d.sham)&&o(f,"sham",!0),a(i,l,f,t)}}}),o("41mV7",function(e,r){"use strict";var n=function(t){return t&&t.Math===Math&&t};e.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof t&&t)||n("object"==typeof e.exports&&e.exports)||function(){return this}()||Function("return this")()}),o("6WEnT",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,o=i("3QKB0"),a=i("35G0v"),s=i("7gf1H"),c=i("3JEPZ"),u=i("5VWk2"),l=i("2HXhe"),d=i("511aI"),f=i("h9Q0n"),p=Object.getOwnPropertyDescriptor;n=o?p:function(t,e){if(t=u(t),e=l(e),f)try{return p(t,e)}catch(t){}if(d(t,e))return c(!a(s.f,t,e),t[e])}}),o("3QKB0",function(t,e){"use strict";t.exports=!i("dRy2a")(function(){return 7!==Object.defineProperty({},1,{get:function(){return 7}})[1]})}),o("dRy2a",function(t,e){"use strict";t.exports=function(t){try{return!!t()}catch(t){return!0}}}),o("35G0v",function(t,e){"use strict";var r=i("kvQSG"),n=Function.prototype.call;t.exports=r?n.bind(n):function(){return n.apply(n,arguments)}}),o("kvQSG",function(t,e){"use strict";t.exports=!i("dRy2a")(function(){var t=(function(){}).bind();return"function"!=typeof t||t.hasOwnProperty("prototype")})}),o("7gf1H",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,i={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor;n=o&&!i.call({1:2},1)?function(t){var e=o(this,t);return!!e&&e.enumerable}:i}),o("3JEPZ",function(t,e){"use strict";t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}}),o("5VWk2",function(t,e){"use strict";var r=i("kUTdH"),n=i("8FAjU");t.exports=function(t){return r(n(t))}}),o("kUTdH",function(t,e){"use strict";var r=i("cYeOA"),n=i("dRy2a"),o=i("h3hb5"),a=Object,s=r("".split);t.exports=n(function(){return!a("z").propertyIsEnumerable(0)})?function(t){return"String"===o(t)?s(t,""):a(t)}:a}),o("cYeOA",function(t,e){"use strict";var r=i("kvQSG"),n=Function.prototype,o=n.call,a=r&&n.bind.bind(o,o);t.exports=r?a:function(t){return function(){return o.apply(t,arguments)}}}),o("h3hb5",function(t,e){"use strict";var r=i("cYeOA"),n=r({}.toString),o=r("".slice);t.exports=function(t){return o(n(t),8,-1)}}),o("8FAjU",function(t,e){"use strict";var r=i("729ai"),n=TypeError;t.exports=function(t){if(r(t))throw new n("Can't call method on "+t);return t}}),o("729ai",function(t,e){"use strict";t.exports=function(t){return null==t}}),o("2HXhe",function(t,e){"use strict";var r=i("bT3cR"),n=i("hupz4");t.exports=function(t){var e=r(t,"string");return n(e)?e:e+""}}),o("bT3cR",function(t,e){"use strict";var r=i("35G0v"),n=i("eo2CA"),o=i("hupz4"),a=i("dWGYF"),s=i("2zCer"),c=i("5mIAo"),u=TypeError,l=c("toPrimitive");t.exports=function(t,e){if(!n(t)||o(t))return t;var i,c=a(t,l);if(c){if(void 0===e&&(e="default"),!n(i=r(c,t,e))||o(i))return i;throw new u("Can't convert object to primitive value")}return void 0===e&&(e="number"),s(t,e)}}),o("eo2CA",function(t,e){"use strict";var r=i("li9Ei");t.exports=function(t){return"object"==typeof t?null!==t:r(t)}}),o("li9Ei",function(t,e){"use strict";var r="object"==typeof document&&document.all;t.exports=void 0===r&&void 0!==r?function(t){return"function"==typeof t||t===r}:function(t){return"function"==typeof t}}),o("hupz4",function(t,e){"use strict";var r=i("kvkVf"),n=i("li9Ei"),o=i("furSS"),a=i("aNZJ6"),s=Object;t.exports=a?function(t){return"symbol"==typeof t}:function(t){var e=r("Symbol");return n(e)&&o(e.prototype,s(t))}}),o("kvkVf",function(t,e){"use strict";var r=i("41mV7"),n=i("li9Ei");t.exports=function(t,e){var i;return arguments.length<2?n(i=r[t])?i:void 0:r[t]&&r[t][e]}}),o("furSS",function(t,e){"use strict";t.exports=i("cYeOA")({}.isPrototypeOf)}),o("aNZJ6",function(t,e){"use strict";t.exports=i("8MdhF")&&!Symbol.sham&&"symbol"==typeof Symbol.iterator}),o("8MdhF",function(t,e){"use strict";var r=i("gROEM"),n=i("dRy2a"),o=i("41mV7").String;t.exports=!!Object.getOwnPropertySymbols&&!n(function(){var t=Symbol("symbol detection");return!o(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41})}),o("gROEM",function(t,e){"use strict";var r,n,o=i("41mV7"),a=i("hIRYc"),s=o.process,c=o.Deno,u=s&&s.versions||c&&c.version,l=u&&u.v8;l&&(n=(r=l.split("."))[0]>0&&r[0]<4?1:+(r[0]+r[1])),!n&&a&&(!(r=a.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=a.match(/Chrome\/(\d+)/))&&(n=+r[1]),t.exports=n}),o("hIRYc",function(t,e){"use strict";var r=i("41mV7").navigator,n=r&&r.userAgent;t.exports=n?String(n):""}),o("dWGYF",function(t,e){"use strict";var r=i("32NIm"),n=i("729ai");t.exports=function(t,e){var i=t[e];return n(i)?void 0:r(i)}}),o("32NIm",function(t,e){"use strict";var r=i("li9Ei"),n=i("7DR0d"),o=TypeError;t.exports=function(t){if(r(t))return t;throw new o(n(t)+" is not a function")}}),o("7DR0d",function(t,e){"use strict";var r=String;t.exports=function(t){try{return r(t)}catch(t){return"Object"}}}),o("2zCer",function(t,e){"use strict";var r=i("35G0v"),n=i("li9Ei"),o=i("eo2CA"),a=TypeError;t.exports=function(t,e){var i,s;if("string"===e&&n(i=t.toString)&&!o(s=r(i,t))||n(i=t.valueOf)&&!o(s=r(i,t))||"string"!==e&&n(i=t.toString)&&!o(s=r(i,t)))return s;throw new a("Can't convert object to primitive value")}}),o("5mIAo",function(t,e){"use strict";var r=i("41mV7"),n=i("iSuoB"),o=i("511aI"),a=i("8oLHl"),s=i("8MdhF"),c=i("aNZJ6"),u=r.Symbol,l=n("wks"),d=c?u.for||u:u&&u.withoutSetter||a;t.exports=function(t){return o(l,t)||(l[t]=s&&o(u,t)?u[t]:d("Symbol."+t)),l[t]}}),o("iSuoB",function(t,e){"use strict";var r=i("cArzx");t.exports=function(t,e){return r[t]||(r[t]=e||{})}}),o("cArzx",function(t,e){"use strict";var r=i("1JzoA"),n=i("41mV7"),o=i("1huun"),a="__core-js_shared__",s=t.exports=n[a]||o(a,{});(s.versions||(s.versions=[])).push({version:"3.41.0",mode:r?"pure":"global",copyright:"© 2014-2025 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.41.0/LICENSE",source:"https://github.com/zloirock/core-js"})}),o("1JzoA",function(t,e){"use strict";t.exports=!1}),o("1huun",function(t,e){"use strict";var r=i("41mV7"),n=Object.defineProperty;t.exports=function(t,e){try{n(r,t,{value:e,configurable:!0,writable:!0})}catch(n){r[t]=e}return e}}),o("511aI",function(t,e){"use strict";var r=i("cYeOA"),n=i("dPPS7"),o=r({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return o(n(t),e)}}),o("dPPS7",function(t,e){"use strict";var r=i("8FAjU"),n=Object;t.exports=function(t){return n(r(t))}}),o("8oLHl",function(t,e){"use strict";var r=i("cYeOA"),n=0,o=Math.random(),a=r(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+a(++n+o,36)}}),o("h9Q0n",function(t,e){"use strict";var r=i("3QKB0"),n=i("dRy2a"),o=i("263Cx");t.exports=!r&&!n(function(){return 7!==Object.defineProperty(o("div"),"a",{get:function(){return 7}}).a})}),o("263Cx",function(t,e){"use strict";var r=i("41mV7"),n=i("eo2CA"),o=r.document,a=n(o)&&n(o.createElement);t.exports=function(t){return a?o.createElement(t):{}}}),o("i9Y0N",function(t,e){"use strict";var r=i("3QKB0"),n=i("88E8L"),o=i("3JEPZ");t.exports=r?function(t,e,r){return n.f(t,e,o(1,r))}:function(t,e,r){return t[e]=r,t}}),o("88E8L",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,o=i("3QKB0"),a=i("h9Q0n"),s=i("gNdB7"),c=i("hdduw"),u=i("2HXhe"),l=TypeError,d=Object.defineProperty,f=Object.getOwnPropertyDescriptor,p="enumerable",v="configurable",h="writable";n=o?s?function(t,e,r){if(c(t),e=u(e),c(r),"function"==typeof t&&"prototype"===e&&"value"in r&&h in r&&!r[h]){var n=f(t,e);n&&n[h]&&(t[e]=r.value,r={configurable:v in r?r[v]:n[v],enumerable:p in r?r[p]:n[p],writable:!1})}return d(t,e,r)}:d:function(t,e,r){if(c(t),e=u(e),c(r),a)try{return d(t,e,r)}catch(t){}if("get"in r||"set"in r)throw new l("Accessors not supported");return"value"in r&&(t[e]=r.value),t}}),o("gNdB7",function(t,e){"use strict";var r=i("3QKB0"),n=i("dRy2a");t.exports=r&&n(function(){return 42!==Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype})}),o("hdduw",function(t,e){"use strict";var r=i("eo2CA"),n=String,o=TypeError;t.exports=function(t){if(r(t))return t;throw new o(n(t)+" is not an object")}}),o("iuK4Q",function(t,e){"use strict";var r=i("li9Ei"),n=i("88E8L"),o=i("61lT2"),a=i("1huun");t.exports=function(t,e,i,s){s||(s={});var c=s.enumerable,u=void 0!==s.name?s.name:e;if(r(i)&&o(i,u,s),s.global)c?t[e]=i:a(e,i);else{try{s.unsafe?t[e]&&(c=!0):delete t[e]}catch(t){}c?t[e]=i:n.f(t,e,{value:i,enumerable:!1,configurable:!s.nonConfigurable,writable:!s.nonWritable})}return t}}),o("61lT2",function(t,e){"use strict";var r=i("cYeOA"),n=i("dRy2a"),o=i("li9Ei"),a=i("511aI"),s=i("3QKB0"),c=i("akyo5").CONFIGURABLE,u=i("eekNM"),l=i("bqOMd"),d=l.enforce,f=l.get,p=String,v=Object.defineProperty,h=r("".slice),m=r("".replace),g=r([].join),y=s&&!n(function(){return 8!==v(function(){},"length",{value:8}).length}),b=String(String).split("String"),x=t.exports=function(t,e,r){"Symbol("===h(p(e),0,7)&&(e="["+m(p(e),/^Symbol\(([^)]*)\).*$/,"$1")+"]"),r&&r.getter&&(e="get "+e),r&&r.setter&&(e="set "+e),(!a(t,"name")||c&&t.name!==e)&&(s?v(t,"name",{value:e,configurable:!0}):t.name=e),y&&r&&a(r,"arity")&&t.length!==r.arity&&v(t,"length",{value:r.arity});try{r&&a(r,"constructor")&&r.constructor?s&&v(t,"prototype",{writable:!1}):t.prototype&&(t.prototype=void 0)}catch(t){}var n=d(t);return a(n,"source")||(n.source=g(b,"string"==typeof e?e:"")),t};Function.prototype.toString=x(function(){return o(this)&&f(this).source||u(this)},"toString")}),o("akyo5",function(t,e){"use strict";var r=i("3QKB0"),n=i("511aI"),o=Function.prototype,a=r&&Object.getOwnPropertyDescriptor,s=n(o,"name"),c=s&&(!r||r&&a(o,"name").configurable);t.exports={EXISTS:s,PROPER:s&&"something"===(function(){}).name,CONFIGURABLE:c}}),o("eekNM",function(t,e){"use strict";var r=i("cYeOA"),n=i("li9Ei"),o=i("cArzx"),a=r(Function.toString);n(o.inspectSource)||(o.inspectSource=function(t){return a(t)}),t.exports=o.inspectSource}),o("bqOMd",function(t,e){"use strict";var r,n,o,a=i("bydNQ"),s=i("41mV7"),c=i("eo2CA"),u=i("i9Y0N"),l=i("511aI"),d=i("cArzx"),f=i("6tDwa"),p=i("k6cj7"),v="Object already initialized",h=s.TypeError,m=s.WeakMap;if(a||d.state){var g=d.state||(d.state=new m);g.get=g.get,g.has=g.has,g.set=g.set,r=function(t,e){if(g.has(t))throw new h(v);return e.facade=t,g.set(t,e),e},n=function(t){return g.get(t)||{}},o=function(t){return g.has(t)}}else{var y=f("state");p[y]=!0,r=function(t,e){if(l(t,y))throw new h(v);return e.facade=t,u(t,y,e),e},n=function(t){return l(t,y)?t[y]:{}},o=function(t){return l(t,y)}}t.exports={set:r,get:n,has:o,enforce:function(t){return o(t)?n(t):r(t,{})},getterFor:function(t){return function(e){var r;if(!c(e)||(r=n(e)).type!==t)throw new h("Incompatible receiver, "+t+" required");return r}}}}),o("bydNQ",function(t,e){"use strict";var r=i("41mV7"),n=i("li9Ei"),o=r.WeakMap;t.exports=n(o)&&/native code/.test(String(o))}),o("6tDwa",function(t,e){"use strict";var r=i("iSuoB"),n=i("8oLHl"),o=r("keys");t.exports=function(t){return o[t]||(o[t]=n(t))}}),o("k6cj7",function(t,e){"use strict";t.exports={}}),o("dHrFU",function(t,e){"use strict";var r=i("511aI"),n=i("kCEok"),o=i("6WEnT"),a=i("88E8L");t.exports=function(t,e,i){for(var s=n(e),c=a.f,u=o.f,l=0;l<s.length;l++){var d=s[l];r(t,d)||i&&r(i,d)||c(t,d,u(e,d))}}}),o("kCEok",function(t,e){"use strict";var r=i("kvkVf"),n=i("cYeOA"),o=i("dtnK1"),a=i("9ltdW"),s=i("hdduw"),c=n([].concat);t.exports=r("Reflect","ownKeys")||function(t){var e=o.f(s(t)),r=a.f;return r?c(e,r(t)):e}}),o("dtnK1",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,o=i("7G5mX"),a=i("6CL1F").concat("length","prototype");n=Object.getOwnPropertyNames||function(t){return o(t,a)}}),o("7G5mX",function(t,e){"use strict";var r=i("cYeOA"),n=i("511aI"),o=i("5VWk2"),a=i("apgGi").indexOf,s=i("k6cj7"),c=r([].push);t.exports=function(t,e){var r,i=o(t),u=0,l=[];for(r in i)!n(s,r)&&n(i,r)&&c(l,r);for(;e.length>u;)n(i,r=e[u++])&&(~a(l,r)||c(l,r));return l}}),o("apgGi",function(t,e){"use strict";var r=i("5VWk2"),n=i("f38PK"),o=i("hWOA5"),a=function(t){return function(e,i,a){var s,c=r(e),u=o(c);if(0===u)return!t&&-1;var l=n(a,u);if(t&&i!=i){for(;u>l;)if((s=c[l++])!=s)return!0}else for(;u>l;l++)if((t||l in c)&&c[l]===i)return t||l||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}}),o("f38PK",function(t,e){"use strict";var r=i("hRvav"),n=Math.max,o=Math.min;t.exports=function(t,e){var i=r(t);return i<0?n(i+e,0):o(i,e)}}),o("hRvav",function(t,e){"use strict";var r=i("kM9mC");t.exports=function(t){var e=+t;return e!=e||0===e?0:r(e)}}),o("kM9mC",function(t,e){"use strict";var r=Math.ceil,n=Math.floor;t.exports=Math.trunc||function(t){var e=+t;return(e>0?n:r)(e)}}),o("hWOA5",function(t,e){"use strict";var r=i("2OyEQ");t.exports=function(t){return r(t.length)}}),o("2OyEQ",function(t,e){"use strict";var r=i("hRvav"),n=Math.min;t.exports=function(t){var e=r(t);return e>0?n(e,0x1fffffffffffff):0}}),o("6CL1F",function(t,e){"use strict";t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]}),o("9ltdW",function(t,r){var n;e(t.exports,"f",()=>n,t=>n=t);"use strict";n=Object.getOwnPropertySymbols}),o("cvI2t",function(t,e){"use strict";var r=i("dRy2a"),n=i("li9Ei"),o=/#|\.prototype\./,a=function(t,e){var i=c[s(t)];return i===l||i!==u&&(n(e)?r(e):!!e)},s=a.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=a.data={},u=a.NATIVE="N",l=a.POLYFILL="P";t.exports=a}),o("cHGAE",function(t,e){"use strict";var r,n,o,a,s=i("41mV7"),c=i("9Wa7J"),u=i("1qAmT"),l=i("li9Ei"),d=i("511aI"),f=i("dRy2a"),p=i("fnpog"),v=i("20lvo"),h=i("263Cx"),m=i("9fb01"),g=i("hylPc"),y=i("6ZgkD"),b=s.setImmediate,x=s.clearImmediate,w=s.process,E=s.Dispatch,O=s.Function,S=s.MessageChannel,j=s.String,k=0,P={},I="onreadystatechange";f(function(){r=s.location});var C=function(t){if(d(P,t)){var e=P[t];delete P[t],e()}},A=function(t){return function(){C(t)}},T=function(t){C(t.data)},$=function(t){s.postMessage(j(t),r.protocol+"//"+r.host)};b&&x||(b=function(t){m(arguments.length,1);var e=l(t)?t:O(t),r=v(arguments,1);return P[++k]=function(){c(e,void 0,r)},n(k),k},x=function(t){delete P[t]},y?n=function(t){w.nextTick(A(t))}:E&&E.now?n=function(t){E.now(A(t))}:S&&!g?(a=(o=new S).port2,o.port1.onmessage=T,n=u(a.postMessage,a)):s.addEventListener&&l(s.postMessage)&&!s.importScripts&&r&&"file:"!==r.protocol&&!f($)?(n=$,s.addEventListener("message",T,!1)):n=I in h("script")?function(t){p.appendChild(h("script"))[I]=function(){p.removeChild(this),C(t)}}:function(t){setTimeout(A(t),0)}),t.exports={set:b,clear:x}}),o("9Wa7J",function(t,e){"use strict";var r=i("kvQSG"),n=Function.prototype,o=n.apply,a=n.call;t.exports="object"==typeof Reflect&&Reflect.apply||(r?a.bind(o):function(){return a.apply(o,arguments)})}),o("1qAmT",function(t,e){"use strict";var r=i("ih1qr"),n=i("32NIm"),o=i("kvQSG"),a=r(r.bind);t.exports=function(t,e){return n(t),void 0===e?t:o?a(t,e):function(){return t.apply(e,arguments)}}}),o("ih1qr",function(t,e){"use strict";var r=i("h3hb5"),n=i("cYeOA");t.exports=function(t){if("Function"===r(t))return n(t)}}),o("fnpog",function(t,e){"use strict";t.exports=i("kvkVf")("document","documentElement")}),o("20lvo",function(t,e){"use strict";t.exports=i("cYeOA")([].slice)}),o("9fb01",function(t,e){"use strict";var r=TypeError;t.exports=function(t,e){if(t<e)throw new r("Not enough arguments");return t}}),o("hylPc",function(t,e){"use strict";var r=i("hIRYc");t.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(r)}),o("6ZgkD",function(t,e){"use strict";t.exports="NODE"===i("lEE6u")}),o("lEE6u",function(t,e){"use strict";var r=i("41mV7"),n=i("hIRYc"),o=i("h3hb5"),a=function(t){return n.slice(0,t.length)===t};t.exports=a("Bun/")?"BUN":a("Cloudflare-Workers")?"CLOUDFLARE":a("Deno/")?"DENO":a("Node.js/")?"NODE":r.Bun&&"string"==typeof Bun.version?"BUN":r.Deno&&"object"==typeof Deno.version?"DENO":"process"===o(r.process)?"NODE":r.window&&r.document?"BROWSER":"REST"}),o("Tbe2h",function(t,e){"use strict";var r=i("9BmrR"),n=i("41mV7"),o=i("cHGAE").set,a=i("dXj2D"),s=n.setImmediate?a(o,!1):o;r({global:!0,bind:!0,enumerable:!0,forced:n.setImmediate!==s},{setImmediate:s})}),o("dXj2D",function(t,e){"use strict";var r,n=i("41mV7"),o=i("9Wa7J"),a=i("li9Ei"),s=i("lEE6u"),c=i("hIRYc"),u=i("20lvo"),l=i("9fb01"),d=n.Function,f=/MSIE .\./.test(c)||"BUN"===s&&((r=n.Bun.version.split(".")).length<3||"0"===r[0]&&(r[1]<3||"3"===r[1]&&"0"===r[2]));t.exports=function(t,e){var r=e?2:1;return f?function(n,i){var s=l(arguments.length,1)>r,c=a(n)?n:d(n),f=s?u(arguments,r):[],p=s?function(){o(c,this,f)}:c;return e?t(p,i):t(p)}:t}}),o("b4Er9",function(t,e){var r=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,r,n,o){var a,s,c,u,l=Object.create((r&&r.prototype instanceof m?r:m).prototype);return i(l,"_invoke",{value:(a=t,s=n,c=new P(o||[]),u=f,function(t,r){if(u===p)throw Error("Generator is already running");if(u===v){if("throw"===t)throw r;return{value:e,done:!0}}for(c.method=t,c.arg=r;;){var n=c.delegate;if(n){var i=function t(r,n){var i=n.method,o=r.iterator[i];if(o===e)return n.delegate=null,"throw"===i&&r.iterator.return&&(n.method="return",n.arg=e,t(r,n),"throw"===n.method)||"return"!==i&&(n.method="throw",n.arg=TypeError("The iterator does not provide a '"+i+"' method")),h;var a=d(o,r.iterator,n.arg);if("throw"===a.type)return n.method="throw",n.arg=a.arg,n.delegate=null,h;var s=a.arg;return s?s.done?(n[r.resultName]=s.value,n.next=r.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,h):s:(n.method="throw",n.arg=TypeError("iterator result is not an object"),n.delegate=null,h)}(n,c);if(i){if(i===h)continue;return i}}if("next"===c.method)c.sent=c._sent=c.arg;else if("throw"===c.method){if(u===f)throw u=v,c.arg;c.dispatchException(c.arg)}else"return"===c.method&&c.abrupt("return",c.arg);u=p;var o=d(a,s,c);if("normal"===o.type){if(u=c.done?v:"suspendedYield",o.arg===h)continue;return{value:o.arg,done:c.done}}"throw"===o.type&&(u=v,c.method="throw",c.arg=o.arg)}})}),l}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var f="suspendedStart",p="executing",v="completed",h={};function m(){}function g(){}function y(){}var b={};u(b,a,function(){return this});var x=Object.getPrototypeOf,w=x&&x(x(I([])));w&&w!==r&&n.call(w,a)&&(b=w);var E=y.prototype=m.prototype=Object.create(b);function O(t){["next","throw","return"].forEach(function(e){u(t,e,function(t){return this._invoke(e,t)})})}function S(t,e){var r;i(this,"_invoke",{value:function(i,o){function a(){return new e(function(r,a){!function r(i,o,a,s){var c=d(t[i],t,o);if("throw"===c.type)s(c.arg);else{var u=c.arg,l=u.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then(function(t){r("next",t,a,s)},function(t){r("throw",t,a,s)}):e.resolve(l).then(function(t){u.value=t,a(u)},function(t){return r("throw",t,a,s)})}}(i,o,r,a)})}return r=r?r.then(a,a):a()}})}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function k(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function I(t){if(null!=t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var i=-1,o=function r(){for(;++i<t.length;)if(n.call(t,i))return r.value=t[i],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw TypeError(typeof t+" is not iterable")}return g.prototype=y,i(E,"constructor",{value:y,configurable:!0}),i(y,"constructor",{value:g,configurable:!0}),g.displayName=u(y,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,u(t,c,"GeneratorFunction")),t.prototype=Object.create(E),t},t.awrap=function(t){return{__await:t}},O(S.prototype),u(S.prototype,s,function(){return this}),t.AsyncIterator=S,t.async=function(e,r,n,i,o){void 0===o&&(o=Promise);var a=new S(l(e,r,n,i),o);return t.isGeneratorFunction(r)?a:a.next().then(function(t){return t.done?t.value:a.next()})},O(E),u(E,c,"Generator"),u(E,a,function(){return this}),u(E,"toString",function(){return"[object Generator]"}),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=I,P.prototype={constructor:P,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(k),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function i(n,i){return s.type="throw",s.arg=t,r.next=n,i&&(r.method="next",r.arg=e),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);else if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else if(u){if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else throw Error("try statement without catch or finally")}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&n.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return(a.type=t,a.arg=e,o)?(this.method="next",this.next=o.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),k(r),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;k(r)}return i}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:I(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),h}},t}(t.exports);try{regeneratorRuntime=r}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r)}}),o("58FFC",function(t,r){e(t.exports,"displayMap",()=>o),e(t.exports,"setTheMarker",()=>s),e(t.exports,"setClickOnMapToOutput",()=>c);let n=L.icon({iconUrl:"/static/img/icons/pin.png",iconSize:[20,25],iconAnchor:[10,25],popupAnchor:[0,-25]}),i=L.map("map",{attributionControl:!1,zoomControl:!1,scrollWheelZoom:!1,doubleClickZoom:!0,zoomSnap:.1}),o=function(t){if(L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(i),L.control.zoom({position:"topright"}).addTo(i),t?.length){let e=L.latLngBounds();t.forEach(t=>{let r=t.coordinates.reverse();e.extend(r),L.marker(r,{icon:n}).bindPopup(`<p>${t.name}</p>`).addTo(i)}),t.length>1?i.fitBounds(e.pad(30)):i.setView(t[0].coordinates,10)}else navigator.geolocation.getCurrentPosition(t=>{let e=t.coords;i.setView([e.latitude,e.longitude],8)},()=>{i.setView([47.551666,10.310555],8)})},a=(()=>{let t=L.marker([0,0],{icon:n}),e=!1;return function(r){t.setLatLng(r),e||(e=!e,t.addTo(i)),i.panTo(r)}})(),s=a,c=t=>i.on("click",e=>{if(!e.originalEvent.ctrlKey)return;let r=[e.latlng.lat,e.latlng.lng];t.value=r.join(),a(r)})}),o("jUbg1",function(t,r){e(t.exports,"createContribution",()=>o),e(t.exports,"getContributedResources",()=>a);var n=i("iQf4X");let o=function(t,e,r){return axios.post("/api/v1/contribution/myContribution",{project:t,resource:e,amount:r}).catch(n.default)},a=async function(t){let e=await axios.get(`/api/v1/contribution/myContributions?project=${t}`).catch(n.default);return e?.data.data.contributions.reduce((t,e)=>(t[e.resource]?t[e.resource]+=e.amount:t[e.resource]=e.amount,t),{})}}),o("iQf4X",function(t,r){e(t.exports,"default",()=>o);var n=i("36Ut3");function o(t){(0,n.setAlert)(t.response?.data.message??"No response from server","error")}}),o("36Ut3",function(t,r){e(t.exports,"setAlert",()=>i),e(t.exports,"hideAlert",()=>o);let n=document.querySelector(".alert-window"),i=function(t,e){n.classList.toggle("error","error"===e),n.classList.remove("hidden"),n.clientHeight,n.style.opacity=1,n.innerHTML=`<p>${t}</p>`,a(3e3)},o=a;function a(t){setTimeout(()=>{n.style.opacity=0,setTimeout(()=>{n.classList.add("hidden")},500)},t)}}),o("9WG2e",function(t,r){e(t.exports,"getProject",()=>o),e(t.exports,"updateProject",()=>a),e(t.exports,"createProject",()=>s);var n=i("iQf4X");let o=async function(t){let e=await axios.get(`/api/v1/project/${t}`).catch(n.default);return e?.data.data.project},a=function(t,e){return axios.patch(`/api/v1/project/myProject/${t}`,e).catch(n.default)},s=function(t){return axios.post("/api/v1/project/myProject",t).catch(n.default)}}),o("4Gp2U",function(t,r){e(t.exports,"updateProfile",()=>o),e(t.exports,"passwordChange",()=>a),e(t.exports,"myProfile",()=>s);var n=i("iQf4X");let o=function(t){return axios.patch("/api/v1/user/myProfile",t).catch(n.default)},a=function({password:t,newPassword:e,confirmPassword:r}){return axios.patch("/api/v1/user/changeMyPassword",{password:t,newPassword:e,confirmPassword:r}).catch(n.default)},s=function(){return axios.get("/api/v1/user/myProfile").catch(n.default)}}),o("55Z4C",function(t,r){e(t.exports,"getFeedData",()=>o),e(t.exports,"createFeed",()=>a);var n=i("iQf4X");let o=async function(t,e){let r=await axios.get(`/api/v1/feed/project/${t}?limit=10&page=${e}`).catch(n.default);return r?.data.data.feed},a=async function(t){let e=await axios.post("/api/v1/feed/myFeed",t).catch(n.default);return e?.data.data.feed}}),o("1g3MQ",function(t,r){function n(t,e){return t.type.startsWith("image")?(e(URL.createObjectURL(t),t),!0):"video/mp4"===t.type&&(function(t,e){let r=document.createElement("video");r.src=URL.createObjectURL(t),r.addEventListener("loadeddata",()=>{r.currentTime=0},{once:!0}),r.addEventListener("seeked",()=>{let n=document.createElement("canvas"),i=n.getContext("2d");n.width=r.videoWidth,n.height=r.videoHeight,i.drawImage(r,0,0,n.width,n.height),e(n.toDataURL(),t)},{once:!0})}(t,e),!0)}e(t.exports,"default",()=>n)}),i("h8FS0"),i("b4Er9");var a=i("58FFC"),s=i("jUbg1"),c=i("9WG2e"),u=i("4Gp2U"),l=i("36Ut3"),d=i("iQf4X");let f=Stripe("pk_test_51OTnIAE0JrWJ25p1gAaXKc1qp4fDFyq9TpBxnntQ8isKneLapslbII6PYW8JLmiZTrzZLDErol6l8I7YlnepooGS00m2GPdeu3"),p=async function(t,e){try{let r=await axios.post(`/api/v1/contribution/fundsContributionSession/${t}`,{amount:e});await f.redirectToCheckout({sessionId:r.data.session.id})}catch(t){(0,d.default)(t)}},v=JSON.parse(document.getElementById("server-data-project").textContent),h=v.reduce((t,e)=>(t[e.name]=e,t),{}),m=JSON.parse(document.getElementById("server-data-contributions").textContent),g=document.querySelector(".container main").dataset.id,y=document.querySelector(".resources-icons"),b=document.querySelector(".resources-details"),x=!!document.querySelector(".user-nav .profile"),w="edit"===document.querySelector(".resources").dataset.mode,E={human:"Persons",funds:"USD",goods:"Items",tools:"Tools",support:"Sessions"};function O(t){var e=t;y.textContent="";let r=e.sort((t,e)=>t.priority-e.priority);for(let t=0;t<r.length;t++)!function(t,e){let r=`<li>
        <input form="cta-form" class="hidden" type="radio" name="resource" id="${t}" value="${t}" ${e?"checked":""} required />
        <label for="${t}">
          <img src="/static/img/icons/res_${t}.png" alt="${t}"
        </label>
      </li>`;y.insertAdjacentHTML("beforeend",r)}(r[t].name,t===r.length-1);let n=y.lastChild.querySelector("input").value;S(h[n],m[n])}function S(t,e){document.getElementById("cta-form")?.removeEventListener("submit",j),w?function(t,e){let r=E[t.name]??"Unit";b.innerHTML=`<div class="resource-quantity-info">
       <div class="resource-info">
         <label for="limit-min">Limit (min)</label>
         <div>
           <div>
             <input
               form="cta-form"
               type="number"
               name="limit-min"
               value="${t.limit?.min??""}"
             />
             ${r}
           </div>
         </div>
       </div>
  
        <div class="resource-info">
         <label for="limit-max">Limit (max)</label>
         <div>
           <div>
             <input
               form="cta-form"
               type="number"
               name="limit-max"
               value="${t.limit?.max??""}"
             />
             ${r}
           </div>
         </div>
       </div>
  
       <div class="resource-info">
         <span>Progress</span>
         <div>
           <div class="resource-applied">${e??0} is already applied</div>
         </div>
       </div>
  
       <div class="resource-info">
           <label for="priority">Priority</label>
           <div>
             <input
               form="cta-form"
               type="number"
               name="priority"
               value="${t.priority}"
               min="1"
               max="5"
               required
             />/5
           </div>
         </div>
       </div>
  
       <div class="resource-notes">
         <h2>${t.name}</h2>
         <label for="notes">Important notes - </label>
         <textarea
           form="cta-form"
           name="notes"
           id="notes"
           rows="20"
           required
         >${t.description}
         </textarea>
       </div>
  
       <div class="resource-update">
         <form id="cta-form" class="submit-button-wrapper">
           <button class="submit-btn">
             <span>Apply changes</span>
           </button>
         </form>
       </div>`}(t,e):function(t,e){let r=x||!t.auth,n=E[t.name]??"Unit";b.innerHTML=`<div class="resource-quantity-info">
          <div class="resource-info">
            <span>Limit (min)</span>
            <div>
              <div>${t.limit?.min??"-"} ${n}</div>
            </div>
          </div>
    
          <div class="resource-info">
            <span>Limit (max)</span>
            <div>
              <div>${t.limit?.max??"-"} ${n}</div>
            </div>
          </div>
    
            <div class="resource-info">
            <span>Progress</span>
            <div>
              <div class="resource-applied">${e??0} is already applied</div>
            </div>
          </div>
    
          <div class="resource-info">
            <span>Priority</span>
            <div>${t.priority}/5</div>
          </div>
        </div>
    
        <div class="resource-notes">
          <h2>${t.name}</h2>
          <span>Important notes - </span>
          <p>${t.description??"No notes provided"}</p>
        </div>
    
        <div class="resource-contribution-input">
          <label class="hidden" for="contribution-amount">Amount in ${n}</label>
          <input
            form="cta-form"
            type="number"
            name="contribution-amount"
            id="contribution-amount"
            placeholder="${n}"
            required
          />
        </div>
    
        <div class="resource-contribution">
          <p class="require-login ${r?"hidden":""}">
            You need to be logged in to contribute with this resource.
          </p>
          <form id="cta-form" class="submit-button-wrapper">
            <button class="submit-btn" ${r?"":"disabled"}>
              <span>Contribute</span>
            </button>
          </form>
        </div>
    
        <div class="resource-contribution-acknowledgement">
          <input
            form="cta-form"
            type="checkbox"
            name="contribution-ack"
            id="contribution-ack"
            required
          />
          <label for="contribution-ack"
            >I have read and accept the leaders requests. I will do my
            part in accordance with the notes.</label
          >
        </div>
      </div>`}(t,e),document.getElementById("cta-form").addEventListener("submit",j)}function j(t){t.preventDefault();let e=new FormData(this);w?I(e):k(e)}async function k(t){if("on"!==t.get("contribution-ack"))return(0,l.setAlert)("You must accept the terms","error");let e=+t.get("contribution-amount"),r=t.get("resource"),n=document.querySelector(".resource-applied"),i=document.getElementById("contribution-amount"),o=document.getElementById("contribution-ack");if("funds"===r){await p(g,e);return}let a=await (0,s.createContribution)(g,r,e);201===a.status&&(m[r]=(m[r]||0)+e,n.textContent=`${m[r]} is already applied`,a.data.data.contribution.user&&P(),i.value="",o.checked=!1,(0,l.setAlert)("Contribution successful!"))}async function P(){let t=(await (0,u.myProfile)()).data.data.user;if(!t.name)return;let e=document.querySelector(".last-contributors"),r=Array.from(e.childNodes);if(-1!==r.findIndex(e=>e.dataset.id===t._id))return;(r.length>4||!r[0].dataset.id)&&r.at(-1).remove();let n=`<li data-id=${t._id} >
      <img src='/media/users/${t.photo}' alt='User photo' />
      <div class="name">${t.name}</div>
    </li>`;e.insertAdjacentHTML("afterbegin",n)}async function I(t){let e=""===t.get("limit-min")?void 0:+t.get("limit-min"),r=""===t.get("limit-max")?void 0:+t.get("limit-max"),n=t.get("resource"),i=+t.get("priority"),o={resources:{name:n,priority:i,limit:{min:e,max:r},description:t.get("notes")}},a=i!==h[n].priority,s=await (0,c.updateProject)(g,o);if(200===s.status){(0,l.setAlert)("Update successful!");let t=s.data.data.project.resources;h[n]=t.find(t=>t.name===n),a&&O(t)}}var C=i("55Z4C"),A=i("1g3MQ");let T=function(t,e){new YT.Player(t,{height:"360",width:"640",videoId:e})};var l=i("36Ut3");let $=document.querySelector(".container main").dataset.id,R=document.querySelector(".feed-thread"),F=document.querySelector(".uploaded-media"),M=document.querySelector(".feed-control button"),N=document.querySelector(".add-new-feed"),B={},D=[],q=[],_=new Map;function G(t){t.preventDefault();let e=!1;for(let t of this.files){t.type.startsWith("image")?D.push(t):"video/mp4"===t.type&&q.push(t);let r=!(0,A.default)(t,U);e=e||r}e&&(0,l.setAlert)("One of media type is not allowed.","error")}function U(t,e){let r=document.createElement("li"),n=document.createElement("img");n.src=t,r.appendChild(n),"video/mp4"===e.type&&r.classList.add("video"),F.insertBefore(r,F.lastElementChild),_.set(r,e)}function Y(t){let e=t.target.closest("li");if(!e)return;let r=e.classList.contains("video"),n=_.get(e),i=r?q:D,o=i.findIndex(t=>n===t);o>=0&&(i.splice(o,1),_.delete(e),e.remove())}async function Q(t){t.preventDefault();let e=new FormData(this),r=t.submitter;r.textContent="Processing...",r.disabled=!0,e.set("project",$),e.set("isMilestone",e.has("milestone")),D.forEach(t=>e.append("images",t)),q.forEach(t=>e.append("videos",t)),e.delete("milestone"),e.delete("upload-files");let n=await (0,C.createFeed)(e);if(!n)return;H("afterbegin",n),(0,l.setAlert)("Your feed is published successfully."),this.reset(),D.length=0,q.length=0,_.clear(),F.replaceChildren(F.lastElementChild),r.textContent="Publish",r.disabled=!1;let i=(M.dataset.nextPage-1)*10;R.children.length>i&&R.children[i].remove()}async function V(t){this.disabled=!0;let e=+this.dataset.nextPage,r=await (0,C.getFeedData)($,e);if(!r){this.disabled=!1;return}for(let e of r)H("beforeend",e),e.link&&t.observe(document.getElementById(`video-${e._id}`));if(this.dataset.nextPage=e+1,r.length<10){this.textContent="You reached the beginning",this.style.filter="grayscale(1)";return}this.disabled=!1}function W(t){let e=t.target.classList.contains("arrow-left"),r=t.target.classList.contains("arrow-right");if(e||r){let n=t.target.closest(".gallery"),i=n.dataset.id,o=n.dataset.id.startsWith("img"),a=o?n.querySelector("img"):n.querySelector("source"),s=+a.dataset.index+-+e+r;s=s<0?B[i].length-1:s%B[i].length,a.dataset.index=s,a.src=`/media/feed/${o?"img":"vid"}/${B[i][s]}`,o||a.parentElement.load()}}function H(t,e){let r=`<article class="feed">
      <header>
        <span class="feed-date">${new Date(e.createdAt).toLocaleDateString()}</span>
        <h3>${e.title}</h3>
      </header>
  
      <div class="feed-content">
        <aside class="tags">
          ${e.isMilestone?'<div class="milestone-tag"></div>':""}
        </aside>
  
        <div class="post">
          <p class="post-text">${e.message}</p>
          <div class="post-multimedia">
            ${function(t){let e="";if(t.videos.length>0&&(B[`vid-${t._id}`]=t.videos,e+=`<div class="gallery" data-id="vid-${t._id}">
        <div class="slideshow">
          <video controls>
            <source data-index="0" src="/media/feed/vid/${t.videos[0]}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
  
          <div class="controls">
            <div class="arrow arrow-left">
              <div class="arrow-left">&lt;</div>
            </div>
            <div class="arrow arrow-right">
              <div class="arrow-right">&gt;</div>
            </div>
          </div>
        </div>
      </div>`),t.images.length>0&&(B[`img-${t._id}`]=t.images,e+=`<div class="gallery" data-id="img-${t._id}">
        <div class="slideshow">
          <img data-index="0"
            src="/media/feed/img/${t.images[0]}"
            alt="Photo"
          />
  
          <div class="controls">
            <div class="arrow arrow-left">
              <div class="arrow-left">&lt;</div>
            </div>
            <div class="arrow arrow-right">
              <div class="arrow-right">&gt;</div>
            </div>
          </div>
        </div>
      </div>`),t.link){let r=t.link.substring(32);e+=`<div id="video-${t._id}" data-video-id=${r} class="video">
        <div id="player-${t._id}" class="hidden"></div>
        <div id="thumb-${t._id}" class="video-placeholder">
          <img src="https://img.youtube.com/vi/${r}/hqdefault.jpg" alt="Video Thumbnail">
          <button>&#9654;</button>
        </div>
      </div>`}return e}(e)}
          </div>
        </div>
      </div>
    </article>`;R.insertAdjacentHTML(t,r)}let z=JSON.parse(document.getElementById("server-data-locations").textContent);(0,a.displayMap)(z),O(v),y.addEventListener("click",function(t){t.stopPropagation();let e=t.target.closest("input")?.value;e&&S(h[e],m[e])}),window.onYouTubeIframeAPIReady=function(){N&&(N.addEventListener("submit",Q),F.addEventListener("click",Y),document.getElementById("upload-files").addEventListener("change",G)),function(){let t=V.bind(M,new IntersectionObserver(t=>{t.forEach(t=>{let e=t.target.firstElementChild,r=t.target.querySelector("iframe");if(t.isIntersecting)r||T(e.id,t.target.dataset.videoId);else if(r){let r=e.id;e.src="",e.remove(),t.target.insertAdjacentHTML("afterbegin",`<div id="${r}"></div>`)}t.target.firstElementChild.classList.toggle("hidden",!t.isIntersecting),t.target.lastElementChild.classList.toggle("hidden",t.isIntersecting)})},{rootMargin:"100px",threshold:.1}));M.addEventListener("click",t),M.click()}(),R.addEventListener("click",W)}})();
//# sourceMappingURL=project.js.map

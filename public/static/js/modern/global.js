(()=>{var t=globalThis;function e(t,e,r,n){Object.defineProperty(t,e,{get:r,set:n,enumerable:!0,configurable:!0})}var r={},n={},o=t.parcelRequire9de2;null==o&&((o=function(t){if(t in r)return r[t].exports;if(t in n){var e=n[t];delete n[t];var o={id:t,exports:{}};return r[t]=o,e.call(o.exports,o,o.exports),o.exports}var i=Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,e){n[t]=e},t.parcelRequire9de2=o);var i=o.register;i("h8FS0",function(t,e){"use strict";o("4QbOH"),o("Tbe2h")}),i("4QbOH",function(t,e){"use strict";var r=o("9BmrR"),n=o("41mV7"),i=o("cHGAE").clear;r({global:!0,bind:!0,enumerable:!0,forced:n.clearImmediate!==i},{clearImmediate:i})}),i("9BmrR",function(t,e){"use strict";var r=o("41mV7"),n=o("6WEnT").f,i=o("i9Y0N"),c=o("iuK4Q"),u=o("1huun"),a=o("dHrFU"),s=o("cvI2t");t.exports=function(t,e){var o,f,l,p,h,v=t.target,d=t.global,y=t.stat;if(o=d?r:y?r[v]||u(v,{}):r[v]&&r[v].prototype)for(f in e){if(p=e[f],l=t.dontCallGetSet?(h=n(o,f))&&h.value:o[f],!s(d?f:v+(y?".":"#")+f,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;a(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),c(o,f,p,t)}}}),i("41mV7",function(e,r){"use strict";var n=function(t){return t&&t.Math===Math&&t};e.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof t&&t)||n("object"==typeof e.exports&&e.exports)||function(){return this}()||Function("return this")()}),i("6WEnT",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,i=o("3QKB0"),c=o("35G0v"),u=o("7gf1H"),a=o("3JEPZ"),s=o("5VWk2"),f=o("2HXhe"),l=o("511aI"),p=o("h9Q0n"),h=Object.getOwnPropertyDescriptor;n=i?h:function(t,e){if(t=s(t),e=f(e),p)try{return h(t,e)}catch(t){}if(l(t,e))return a(!c(u.f,t,e),t[e])}}),i("3QKB0",function(t,e){"use strict";t.exports=!o("dRy2a")(function(){return 7!==Object.defineProperty({},1,{get:function(){return 7}})[1]})}),i("dRy2a",function(t,e){"use strict";t.exports=function(t){try{return!!t()}catch(t){return!0}}}),i("35G0v",function(t,e){"use strict";var r=o("kvQSG"),n=Function.prototype.call;t.exports=r?n.bind(n):function(){return n.apply(n,arguments)}}),i("kvQSG",function(t,e){"use strict";t.exports=!o("dRy2a")(function(){var t=(function(){}).bind();return"function"!=typeof t||t.hasOwnProperty("prototype")})}),i("7gf1H",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,o={}.propertyIsEnumerable,i=Object.getOwnPropertyDescriptor;n=i&&!o.call({1:2},1)?function(t){var e=i(this,t);return!!e&&e.enumerable}:o}),i("3JEPZ",function(t,e){"use strict";t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}}),i("5VWk2",function(t,e){"use strict";var r=o("kUTdH"),n=o("8FAjU");t.exports=function(t){return r(n(t))}}),i("kUTdH",function(t,e){"use strict";var r=o("cYeOA"),n=o("dRy2a"),i=o("h3hb5"),c=Object,u=r("".split);t.exports=n(function(){return!c("z").propertyIsEnumerable(0)})?function(t){return"String"===i(t)?u(t,""):c(t)}:c}),i("cYeOA",function(t,e){"use strict";var r=o("kvQSG"),n=Function.prototype,i=n.call,c=r&&n.bind.bind(i,i);t.exports=r?c:function(t){return function(){return i.apply(t,arguments)}}}),i("h3hb5",function(t,e){"use strict";var r=o("cYeOA"),n=r({}.toString),i=r("".slice);t.exports=function(t){return i(n(t),8,-1)}}),i("8FAjU",function(t,e){"use strict";var r=o("729ai"),n=TypeError;t.exports=function(t){if(r(t))throw new n("Can't call method on "+t);return t}}),i("729ai",function(t,e){"use strict";t.exports=function(t){return null==t}}),i("2HXhe",function(t,e){"use strict";var r=o("bT3cR"),n=o("hupz4");t.exports=function(t){var e=r(t,"string");return n(e)?e:e+""}}),i("bT3cR",function(t,e){"use strict";var r=o("35G0v"),n=o("eo2CA"),i=o("hupz4"),c=o("dWGYF"),u=o("2zCer"),a=o("5mIAo"),s=TypeError,f=a("toPrimitive");t.exports=function(t,e){if(!n(t)||i(t))return t;var o,a=c(t,f);if(a){if(void 0===e&&(e="default"),!n(o=r(a,t,e))||i(o))return o;throw new s("Can't convert object to primitive value")}return void 0===e&&(e="number"),u(t,e)}}),i("eo2CA",function(t,e){"use strict";var r=o("li9Ei");t.exports=function(t){return"object"==typeof t?null!==t:r(t)}}),i("li9Ei",function(t,e){"use strict";var r="object"==typeof document&&document.all;t.exports=void 0===r&&void 0!==r?function(t){return"function"==typeof t||t===r}:function(t){return"function"==typeof t}}),i("hupz4",function(t,e){"use strict";var r=o("kvkVf"),n=o("li9Ei"),i=o("furSS"),c=o("aNZJ6"),u=Object;t.exports=c?function(t){return"symbol"==typeof t}:function(t){var e=r("Symbol");return n(e)&&i(e.prototype,u(t))}}),i("kvkVf",function(t,e){"use strict";var r=o("41mV7"),n=o("li9Ei");t.exports=function(t,e){var o;return arguments.length<2?n(o=r[t])?o:void 0:r[t]&&r[t][e]}}),i("furSS",function(t,e){"use strict";t.exports=o("cYeOA")({}.isPrototypeOf)}),i("aNZJ6",function(t,e){"use strict";t.exports=o("8MdhF")&&!Symbol.sham&&"symbol"==typeof Symbol.iterator}),i("8MdhF",function(t,e){"use strict";var r=o("gROEM"),n=o("dRy2a"),i=o("41mV7").String;t.exports=!!Object.getOwnPropertySymbols&&!n(function(){var t=Symbol("symbol detection");return!i(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41})}),i("gROEM",function(t,e){"use strict";var r,n,i=o("41mV7"),c=o("hIRYc"),u=i.process,a=i.Deno,s=u&&u.versions||a&&a.version,f=s&&s.v8;f&&(n=(r=f.split("."))[0]>0&&r[0]<4?1:+(r[0]+r[1])),!n&&c&&(!(r=c.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=c.match(/Chrome\/(\d+)/))&&(n=+r[1]),t.exports=n}),i("hIRYc",function(t,e){"use strict";var r=o("41mV7").navigator,n=r&&r.userAgent;t.exports=n?String(n):""}),i("dWGYF",function(t,e){"use strict";var r=o("32NIm"),n=o("729ai");t.exports=function(t,e){var o=t[e];return n(o)?void 0:r(o)}}),i("32NIm",function(t,e){"use strict";var r=o("li9Ei"),n=o("7DR0d"),i=TypeError;t.exports=function(t){if(r(t))return t;throw new i(n(t)+" is not a function")}}),i("7DR0d",function(t,e){"use strict";var r=String;t.exports=function(t){try{return r(t)}catch(t){return"Object"}}}),i("2zCer",function(t,e){"use strict";var r=o("35G0v"),n=o("li9Ei"),i=o("eo2CA"),c=TypeError;t.exports=function(t,e){var o,u;if("string"===e&&n(o=t.toString)&&!i(u=r(o,t))||n(o=t.valueOf)&&!i(u=r(o,t))||"string"!==e&&n(o=t.toString)&&!i(u=r(o,t)))return u;throw new c("Can't convert object to primitive value")}}),i("5mIAo",function(t,e){"use strict";var r=o("41mV7"),n=o("iSuoB"),i=o("511aI"),c=o("8oLHl"),u=o("8MdhF"),a=o("aNZJ6"),s=r.Symbol,f=n("wks"),l=a?s.for||s:s&&s.withoutSetter||c;t.exports=function(t){return i(f,t)||(f[t]=u&&i(s,t)?s[t]:l("Symbol."+t)),f[t]}}),i("iSuoB",function(t,e){"use strict";var r=o("cArzx");t.exports=function(t,e){return r[t]||(r[t]=e||{})}}),i("cArzx",function(t,e){"use strict";var r=o("1JzoA"),n=o("41mV7"),i=o("1huun"),c="__core-js_shared__",u=t.exports=n[c]||i(c,{});(u.versions||(u.versions=[])).push({version:"3.41.0",mode:r?"pure":"global",copyright:"© 2014-2025 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.41.0/LICENSE",source:"https://github.com/zloirock/core-js"})}),i("1JzoA",function(t,e){"use strict";t.exports=!1}),i("1huun",function(t,e){"use strict";var r=o("41mV7"),n=Object.defineProperty;t.exports=function(t,e){try{n(r,t,{value:e,configurable:!0,writable:!0})}catch(n){r[t]=e}return e}}),i("511aI",function(t,e){"use strict";var r=o("cYeOA"),n=o("dPPS7"),i=r({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return i(n(t),e)}}),i("dPPS7",function(t,e){"use strict";var r=o("8FAjU"),n=Object;t.exports=function(t){return n(r(t))}}),i("8oLHl",function(t,e){"use strict";var r=o("cYeOA"),n=0,i=Math.random(),c=r(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+c(++n+i,36)}}),i("h9Q0n",function(t,e){"use strict";var r=o("3QKB0"),n=o("dRy2a"),i=o("263Cx");t.exports=!r&&!n(function(){return 7!==Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a})}),i("263Cx",function(t,e){"use strict";var r=o("41mV7"),n=o("eo2CA"),i=r.document,c=n(i)&&n(i.createElement);t.exports=function(t){return c?i.createElement(t):{}}}),i("i9Y0N",function(t,e){"use strict";var r=o("3QKB0"),n=o("88E8L"),i=o("3JEPZ");t.exports=r?function(t,e,r){return n.f(t,e,i(1,r))}:function(t,e,r){return t[e]=r,t}}),i("88E8L",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,i=o("3QKB0"),c=o("h9Q0n"),u=o("gNdB7"),a=o("hdduw"),s=o("2HXhe"),f=TypeError,l=Object.defineProperty,p=Object.getOwnPropertyDescriptor,h="enumerable",v="configurable",d="writable";n=i?u?function(t,e,r){if(a(t),e=s(e),a(r),"function"==typeof t&&"prototype"===e&&"value"in r&&d in r&&!r[d]){var n=p(t,e);n&&n[d]&&(t[e]=r.value,r={configurable:v in r?r[v]:n[v],enumerable:h in r?r[h]:n[h],writable:!1})}return l(t,e,r)}:l:function(t,e,r){if(a(t),e=s(e),a(r),c)try{return l(t,e,r)}catch(t){}if("get"in r||"set"in r)throw new f("Accessors not supported");return"value"in r&&(t[e]=r.value),t}}),i("gNdB7",function(t,e){"use strict";var r=o("3QKB0"),n=o("dRy2a");t.exports=r&&n(function(){return 42!==Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype})}),i("hdduw",function(t,e){"use strict";var r=o("eo2CA"),n=String,i=TypeError;t.exports=function(t){if(r(t))return t;throw new i(n(t)+" is not an object")}}),i("iuK4Q",function(t,e){"use strict";var r=o("li9Ei"),n=o("88E8L"),i=o("61lT2"),c=o("1huun");t.exports=function(t,e,o,u){u||(u={});var a=u.enumerable,s=void 0!==u.name?u.name:e;if(r(o)&&i(o,s,u),u.global)a?t[e]=o:c(e,o);else{try{u.unsafe?t[e]&&(a=!0):delete t[e]}catch(t){}a?t[e]=o:n.f(t,e,{value:o,enumerable:!1,configurable:!u.nonConfigurable,writable:!u.nonWritable})}return t}}),i("61lT2",function(t,e){"use strict";var r=o("cYeOA"),n=o("dRy2a"),i=o("li9Ei"),c=o("511aI"),u=o("3QKB0"),a=o("akyo5").CONFIGURABLE,s=o("eekNM"),f=o("bqOMd"),l=f.enforce,p=f.get,h=String,v=Object.defineProperty,d=r("".slice),y=r("".replace),g=r([].join),m=u&&!n(function(){return 8!==v(function(){},"length",{value:8}).length}),b=String(String).split("String"),x=t.exports=function(t,e,r){"Symbol("===d(h(e),0,7)&&(e="["+y(h(e),/^Symbol\(([^)]*)\).*$/,"$1")+"]"),r&&r.getter&&(e="get "+e),r&&r.setter&&(e="set "+e),(!c(t,"name")||a&&t.name!==e)&&(u?v(t,"name",{value:e,configurable:!0}):t.name=e),m&&r&&c(r,"arity")&&t.length!==r.arity&&v(t,"length",{value:r.arity});try{r&&c(r,"constructor")&&r.constructor?u&&v(t,"prototype",{writable:!1}):t.prototype&&(t.prototype=void 0)}catch(t){}var n=l(t);return c(n,"source")||(n.source=g(b,"string"==typeof e?e:"")),t};Function.prototype.toString=x(function(){return i(this)&&p(this).source||s(this)},"toString")}),i("akyo5",function(t,e){"use strict";var r=o("3QKB0"),n=o("511aI"),i=Function.prototype,c=r&&Object.getOwnPropertyDescriptor,u=n(i,"name"),a=u&&(!r||r&&c(i,"name").configurable);t.exports={EXISTS:u,PROPER:u&&"something"===(function(){}).name,CONFIGURABLE:a}}),i("eekNM",function(t,e){"use strict";var r=o("cYeOA"),n=o("li9Ei"),i=o("cArzx"),c=r(Function.toString);n(i.inspectSource)||(i.inspectSource=function(t){return c(t)}),t.exports=i.inspectSource}),i("bqOMd",function(t,e){"use strict";var r,n,i,c=o("bydNQ"),u=o("41mV7"),a=o("eo2CA"),s=o("i9Y0N"),f=o("511aI"),l=o("cArzx"),p=o("6tDwa"),h=o("k6cj7"),v="Object already initialized",d=u.TypeError,y=u.WeakMap;if(c||l.state){var g=l.state||(l.state=new y);g.get=g.get,g.has=g.has,g.set=g.set,r=function(t,e){if(g.has(t))throw new d(v);return e.facade=t,g.set(t,e),e},n=function(t){return g.get(t)||{}},i=function(t){return g.has(t)}}else{var m=p("state");h[m]=!0,r=function(t,e){if(f(t,m))throw new d(v);return e.facade=t,s(t,m,e),e},n=function(t){return f(t,m)?t[m]:{}},i=function(t){return f(t,m)}}t.exports={set:r,get:n,has:i,enforce:function(t){return i(t)?n(t):r(t,{})},getterFor:function(t){return function(e){var r;if(!a(e)||(r=n(e)).type!==t)throw new d("Incompatible receiver, "+t+" required");return r}}}}),i("bydNQ",function(t,e){"use strict";var r=o("41mV7"),n=o("li9Ei"),i=r.WeakMap;t.exports=n(i)&&/native code/.test(String(i))}),i("6tDwa",function(t,e){"use strict";var r=o("iSuoB"),n=o("8oLHl"),i=r("keys");t.exports=function(t){return i[t]||(i[t]=n(t))}}),i("k6cj7",function(t,e){"use strict";t.exports={}}),i("dHrFU",function(t,e){"use strict";var r=o("511aI"),n=o("kCEok"),i=o("6WEnT"),c=o("88E8L");t.exports=function(t,e,o){for(var u=n(e),a=c.f,s=i.f,f=0;f<u.length;f++){var l=u[f];r(t,l)||o&&r(o,l)||a(t,l,s(e,l))}}}),i("kCEok",function(t,e){"use strict";var r=o("kvkVf"),n=o("cYeOA"),i=o("dtnK1"),c=o("9ltdW"),u=o("hdduw"),a=n([].concat);t.exports=r("Reflect","ownKeys")||function(t){var e=i.f(u(t)),r=c.f;return r?a(e,r(t)):e}}),i("dtnK1",function(t,r){e(t.exports,"f",()=>n,t=>n=t);"use strict";var n,i=o("7G5mX"),c=o("6CL1F").concat("length","prototype");n=Object.getOwnPropertyNames||function(t){return i(t,c)}}),i("7G5mX",function(t,e){"use strict";var r=o("cYeOA"),n=o("511aI"),i=o("5VWk2"),c=o("apgGi").indexOf,u=o("k6cj7"),a=r([].push);t.exports=function(t,e){var r,o=i(t),s=0,f=[];for(r in o)!n(u,r)&&n(o,r)&&a(f,r);for(;e.length>s;)n(o,r=e[s++])&&(~c(f,r)||a(f,r));return f}}),i("apgGi",function(t,e){"use strict";var r=o("5VWk2"),n=o("f38PK"),i=o("hWOA5"),c=function(t){return function(e,o,c){var u,a=r(e),s=i(a);if(0===s)return!t&&-1;var f=n(c,s);if(t&&o!=o){for(;s>f;)if((u=a[f++])!=u)return!0}else for(;s>f;f++)if((t||f in a)&&a[f]===o)return t||f||0;return!t&&-1}};t.exports={includes:c(!0),indexOf:c(!1)}}),i("f38PK",function(t,e){"use strict";var r=o("hRvav"),n=Math.max,i=Math.min;t.exports=function(t,e){var o=r(t);return o<0?n(o+e,0):i(o,e)}}),i("hRvav",function(t,e){"use strict";var r=o("kM9mC");t.exports=function(t){var e=+t;return e!=e||0===e?0:r(e)}}),i("kM9mC",function(t,e){"use strict";var r=Math.ceil,n=Math.floor;t.exports=Math.trunc||function(t){var e=+t;return(e>0?n:r)(e)}}),i("hWOA5",function(t,e){"use strict";var r=o("2OyEQ");t.exports=function(t){return r(t.length)}}),i("2OyEQ",function(t,e){"use strict";var r=o("hRvav"),n=Math.min;t.exports=function(t){var e=r(t);return e>0?n(e,0x1fffffffffffff):0}}),i("6CL1F",function(t,e){"use strict";t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]}),i("9ltdW",function(t,r){var n;e(t.exports,"f",()=>n,t=>n=t);"use strict";n=Object.getOwnPropertySymbols}),i("cvI2t",function(t,e){"use strict";var r=o("dRy2a"),n=o("li9Ei"),i=/#|\.prototype\./,c=function(t,e){var o=a[u(t)];return o===f||o!==s&&(n(e)?r(e):!!e)},u=c.normalize=function(t){return String(t).replace(i,".").toLowerCase()},a=c.data={},s=c.NATIVE="N",f=c.POLYFILL="P";t.exports=c}),i("cHGAE",function(t,e){"use strict";var r,n,i,c,u=o("41mV7"),a=o("9Wa7J"),s=o("1qAmT"),f=o("li9Ei"),l=o("511aI"),p=o("dRy2a"),h=o("fnpog"),v=o("20lvo"),d=o("263Cx"),y=o("9fb01"),g=o("hylPc"),m=o("6ZgkD"),b=u.setImmediate,x=u.clearImmediate,w=u.process,E=u.Dispatch,O=u.Function,S=u.MessageChannel,j=u.String,L=0,k={},A="onreadystatechange";p(function(){r=u.location});var P=function(t){if(l(k,t)){var e=k[t];delete k[t],e()}},R=function(t){return function(){P(t)}},I=function(t){P(t.data)},N=function(t){u.postMessage(j(t),r.protocol+"//"+r.host)};b&&x||(b=function(t){y(arguments.length,1);var e=f(t)?t:O(t),r=v(arguments,1);return k[++L]=function(){a(e,void 0,r)},n(L),L},x=function(t){delete k[t]},m?n=function(t){w.nextTick(R(t))}:E&&E.now?n=function(t){E.now(R(t))}:S&&!g?(c=(i=new S).port2,i.port1.onmessage=I,n=s(c.postMessage,c)):u.addEventListener&&f(u.postMessage)&&!u.importScripts&&r&&"file:"!==r.protocol&&!p(N)?(n=N,u.addEventListener("message",I,!1)):n=A in d("script")?function(t){h.appendChild(d("script"))[A]=function(){h.removeChild(this),P(t)}}:function(t){setTimeout(R(t),0)}),t.exports={set:b,clear:x}}),i("9Wa7J",function(t,e){"use strict";var r=o("kvQSG"),n=Function.prototype,i=n.apply,c=n.call;t.exports="object"==typeof Reflect&&Reflect.apply||(r?c.bind(i):function(){return c.apply(i,arguments)})}),i("1qAmT",function(t,e){"use strict";var r=o("ih1qr"),n=o("32NIm"),i=o("kvQSG"),c=r(r.bind);t.exports=function(t,e){return n(t),void 0===e?t:i?c(t,e):function(){return t.apply(e,arguments)}}}),i("ih1qr",function(t,e){"use strict";var r=o("h3hb5"),n=o("cYeOA");t.exports=function(t){if("Function"===r(t))return n(t)}}),i("fnpog",function(t,e){"use strict";t.exports=o("kvkVf")("document","documentElement")}),i("20lvo",function(t,e){"use strict";t.exports=o("cYeOA")([].slice)}),i("9fb01",function(t,e){"use strict";var r=TypeError;t.exports=function(t,e){if(t<e)throw new r("Not enough arguments");return t}}),i("hylPc",function(t,e){"use strict";var r=o("hIRYc");t.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(r)}),i("6ZgkD",function(t,e){"use strict";t.exports="NODE"===o("lEE6u")}),i("lEE6u",function(t,e){"use strict";var r=o("41mV7"),n=o("hIRYc"),i=o("h3hb5"),c=function(t){return n.slice(0,t.length)===t};t.exports=c("Bun/")?"BUN":c("Cloudflare-Workers")?"CLOUDFLARE":c("Deno/")?"DENO":c("Node.js/")?"NODE":r.Bun&&"string"==typeof Bun.version?"BUN":r.Deno&&"object"==typeof Deno.version?"DENO":"process"===i(r.process)?"NODE":r.window&&r.document?"BROWSER":"REST"}),i("Tbe2h",function(t,e){"use strict";var r=o("9BmrR"),n=o("41mV7"),i=o("cHGAE").set,c=o("dXj2D"),u=n.setImmediate?c(i,!1):i;r({global:!0,bind:!0,enumerable:!0,forced:n.setImmediate!==u},{setImmediate:u})}),i("dXj2D",function(t,e){"use strict";var r,n=o("41mV7"),i=o("9Wa7J"),c=o("li9Ei"),u=o("lEE6u"),a=o("hIRYc"),s=o("20lvo"),f=o("9fb01"),l=n.Function,p=/MSIE .\./.test(a)||"BUN"===u&&((r=n.Bun.version.split(".")).length<3||"0"===r[0]&&(r[1]<3||"3"===r[1]&&"0"===r[2]));t.exports=function(t,e){var r=e?2:1;return p?function(n,o){var u=f(arguments.length,1)>r,a=c(n)?n:l(n),p=u?s(arguments,r):[],h=u?function(){i(a,this,p)}:a;return e?t(h,o):t(h)}:t}}),i("b4Er9",function(t,e){var r=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},c=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",a=i.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,r,n,i){var c,u,a,s,f=Object.create((r&&r.prototype instanceof y?r:y).prototype);return o(f,"_invoke",{value:(c=t,u=n,a=new k(i||[]),s=p,function(t,r){if(s===h)throw Error("Generator is already running");if(s===v){if("throw"===t)throw r;return{value:e,done:!0}}for(a.method=t,a.arg=r;;){var n=a.delegate;if(n){var o=function t(r,n){var o=n.method,i=r.iterator[o];if(i===e)return n.delegate=null,"throw"===o&&r.iterator.return&&(n.method="return",n.arg=e,t(r,n),"throw"===n.method)||"return"!==o&&(n.method="throw",n.arg=TypeError("The iterator does not provide a '"+o+"' method")),d;var c=l(i,r.iterator,n.arg);if("throw"===c.type)return n.method="throw",n.arg=c.arg,n.delegate=null,d;var u=c.arg;return u?u.done?(n[r.resultName]=u.value,n.next=r.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,d):u:(n.method="throw",n.arg=TypeError("iterator result is not an object"),n.delegate=null,d)}(n,a);if(o){if(o===d)continue;return o}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if(s===p)throw s=v,a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);s=h;var i=l(c,u,a);if("normal"===i.type){if(s=a.done?v:"suspendedYield",i.arg===d)continue;return{value:i.arg,done:a.done}}"throw"===i.type&&(s=v,a.method="throw",a.arg=i.arg)}})}),f}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=f;var p="suspendedStart",h="executing",v="completed",d={};function y(){}function g(){}function m(){}var b={};s(b,c,function(){return this});var x=Object.getPrototypeOf,w=x&&x(x(A([])));w&&w!==r&&n.call(w,c)&&(b=w);var E=m.prototype=y.prototype=Object.create(b);function O(t){["next","throw","return"].forEach(function(e){s(t,e,function(t){return this._invoke(e,t)})})}function S(t,e){var r;o(this,"_invoke",{value:function(o,i){function c(){return new e(function(r,c){!function r(o,i,c,u){var a=l(t[o],t,i);if("throw"===a.type)u(a.arg);else{var s=a.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then(function(t){r("next",t,c,u)},function(t){r("throw",t,c,u)}):e.resolve(f).then(function(t){s.value=t,c(s)},function(t){return r("throw",t,c,u)})}}(o,i,r,c)})}return r=r?r.then(c,c):c()}})}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function A(t){if(null!=t){var r=t[c];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}throw TypeError(typeof t+" is not iterable")}return g.prototype=m,o(E,"constructor",{value:m,configurable:!0}),o(m,"constructor",{value:g,configurable:!0}),g.displayName=s(m,a,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,s(t,a,"GeneratorFunction")),t.prototype=Object.create(E),t},t.awrap=function(t){return{__await:t}},O(S.prototype),s(S.prototype,u,function(){return this}),t.AsyncIterator=S,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var c=new S(f(e,r,n,o),i);return t.isGeneratorFunction(r)?c:c.next().then(function(t){return t.done?t.value:c.next()})},O(E),s(E,a,"Generator"),s(E,c,function(){return this}),s(E,"toString",function(){return"[object Generator]"}),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=A,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(L),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return u.type="throw",u.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var c=this.tryEntries[i],u=c.completion;if("root"===c.tryLoc)return o("end");if(c.tryLoc<=this.prev){var a=n.call(c,"catchLoc"),s=n.call(c,"finallyLoc");if(a&&s){if(this.prev<c.catchLoc)return o(c.catchLoc,!0);else if(this.prev<c.finallyLoc)return o(c.finallyLoc)}else if(a){if(this.prev<c.catchLoc)return o(c.catchLoc,!0)}else if(s){if(this.prev<c.finallyLoc)return o(c.finallyLoc)}else throw Error("try statement without catch or finally")}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var c=i?i.completion:{};return(c.type=t,c.arg=e,i)?(this.method="next",this.next=i.finallyLoc,d):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),L(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;L(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:A(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=r}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r)}}),i("36Ut3",function(t,r){e(t.exports,"setAlert",()=>o),e(t.exports,"hideAlert",()=>i);let n=document.querySelector(".alert-window"),o=function(t,e){n.classList.toggle("error","error"===e),n.classList.remove("hidden"),n.clientHeight,n.style.opacity=1,n.innerHTML=`<p>${t}</p>`,c(3e3)},i=c;function c(t){setTimeout(()=>{n.style.opacity=0,setTimeout(()=>{n.classList.add("hidden")},500)},t)}}),i("bQjLY",function(t,r){e(t.exports,"login",()=>i),e(t.exports,"signup",()=>c),e(t.exports,"logout",()=>u);var n=o("iQf4X");let i=function(t,e){return axios.post("/api/v1/user/login",{email:t,password:e}).catch(n.default)},c=function(t,e,r){return axios.post("/api/v1/user/signup",{email:t,password:e,confirmPassword:r}).catch(n.default)},u=function(){return axios.get("/api/v1/user/logout").catch(n.default)}}),i("iQf4X",function(t,r){e(t.exports,"default",()=>i);var n=o("36Ut3");function i(t){(0,n.setAlert)(t.response?.data.message??"No response from server","error")}}),o("h8FS0"),o("b4Er9");var c=o("36Ut3"),u=o("bQjLY");let a=document.querySelector(".logout-btn"),s=document.querySelector(".alert-window");if(a&&a.addEventListener("click",async t=>{let e=await (0,u.logout)();e?.status===200&&window.location.replace("/?alert=You logged out successfully!")}),!s.classList.contains("hidden")){let t=window.location.href.split("?")[0];window.history.replaceState(null,"",t),setTimeout(()=>{s.style.opacity=1,(0,c.hideAlert)(3e3)},500)}})();
//# sourceMappingURL=global.js.map

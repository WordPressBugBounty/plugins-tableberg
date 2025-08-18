(function(y,X){typeof exports=="object"&&typeof module<"u"?X(require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["react","react-dom"],X):(y=typeof globalThis<"u"?globalThis:y||self,X(y.React,y.ReactDOM))})(this,function(y,X){"use strict";function fr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var yt={exports:{}},fe={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ur=y,dr=Symbol.for("react.element"),mr=Symbol.for("react.fragment"),pr=Object.prototype.hasOwnProperty,hr=ur.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,gr={key:!0,ref:!0,__self:!0,__source:!0};function vt(e,t,n){var r,a={},s=null,o=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)pr.call(t,r)&&!gr.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)a[r]===void 0&&(a[r]=t[r]);return{$$typeof:dr,type:e,key:s,ref:o,props:a,_owner:hr.current}}fe.Fragment=mr,fe.jsx=vt,fe.jsxs=vt,yt.exports=fe;var i=yt.exports,br={};(function(e){(function(){var t={not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/[bcdiefguxX]/,json:/[j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[+-]/};function n(l){return a(o(l),arguments)}function r(l,u){return n.apply(null,[l].concat(u||[]))}function a(l,u){var f=1,m=l.length,c,b="",x,w,g,k,_,S,j,p;for(x=0;x<m;x++)if(typeof l[x]=="string")b+=l[x];else if(typeof l[x]=="object"){if(g=l[x],g.keys)for(c=u[f],w=0;w<g.keys.length;w++){if(c==null)throw new Error(n('[sprintf] Cannot access property "%s" of undefined value "%s"',g.keys[w],g.keys[w-1]));c=c[g.keys[w]]}else g.param_no?c=u[g.param_no]:c=u[f++];if(t.not_type.test(g.type)&&t.not_primitive.test(g.type)&&c instanceof Function&&(c=c()),t.numeric_arg.test(g.type)&&typeof c!="number"&&isNaN(c))throw new TypeError(n("[sprintf] expecting number but found %T",c));switch(t.number.test(g.type)&&(j=c>=0),g.type){case"b":c=parseInt(c,10).toString(2);break;case"c":c=String.fromCharCode(parseInt(c,10));break;case"d":case"i":c=parseInt(c,10);break;case"j":c=JSON.stringify(c,null,g.width?parseInt(g.width):0);break;case"e":c=g.precision?parseFloat(c).toExponential(g.precision):parseFloat(c).toExponential();break;case"f":c=g.precision?parseFloat(c).toFixed(g.precision):parseFloat(c);break;case"g":c=g.precision?String(Number(c.toPrecision(g.precision))):parseFloat(c);break;case"o":c=(parseInt(c,10)>>>0).toString(8);break;case"s":c=String(c),c=g.precision?c.substring(0,g.precision):c;break;case"t":c=String(!!c),c=g.precision?c.substring(0,g.precision):c;break;case"T":c=Object.prototype.toString.call(c).slice(8,-1).toLowerCase(),c=g.precision?c.substring(0,g.precision):c;break;case"u":c=parseInt(c,10)>>>0;break;case"v":c=c.valueOf(),c=g.precision?c.substring(0,g.precision):c;break;case"x":c=(parseInt(c,10)>>>0).toString(16);break;case"X":c=(parseInt(c,10)>>>0).toString(16).toUpperCase();break}t.json.test(g.type)?b+=c:(t.number.test(g.type)&&(!j||g.sign)?(p=j?"+":"-",c=c.toString().replace(t.sign,"")):p="",_=g.pad_char?g.pad_char==="0"?"0":g.pad_char.charAt(1):" ",S=g.width-(p+c).length,k=g.width&&S>0?_.repeat(S):"",b+=g.align?p+c+k:_==="0"?p+k+c:k+p+c)}return b}var s=Object.create(null);function o(l){if(s[l])return s[l];for(var u=l,f,m=[],c=0;u;){if((f=t.text.exec(u))!==null)m.push(f[0]);else if((f=t.modulo.exec(u))!==null)m.push("%");else if((f=t.placeholder.exec(u))!==null){if(f[2]){c|=1;var b=[],x=f[2],w=[];if((w=t.key.exec(x))!==null)for(b.push(w[1]);(x=x.substring(w[0].length))!=="";)if((w=t.key_access.exec(x))!==null)b.push(w[1]);else if((w=t.index_access.exec(x))!==null)b.push(w[1]);else throw new SyntaxError("[sprintf] failed to parse named argument key");else throw new SyntaxError("[sprintf] failed to parse named argument key");f[2]=b}else c|=2;if(c===3)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");m.push({placeholder:f[0],param_no:f[1],keys:f[2],sign:f[3],pad_char:f[4],align:f[5],width:f[6],precision:f[7],type:f[8]})}else throw new SyntaxError("[sprintf] unexpected placeholder");u=u.substring(f[0].length)}return s[l]=m}e.sprintf=n,e.vsprintf=r,typeof window<"u"&&(window.sprintf=n,window.vsprintf=r)})()})(br);var Te,xt,te,wt;Te={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1},xt=["(","?"],te={")":["("],":":["?","?:"]},wt=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;function yr(e){for(var t=[],n=[],r,a,s,o;r=e.match(wt);){for(a=r[0],s=e.substr(0,r.index).trim(),s&&t.push(s);o=n.pop();){if(te[a]){if(te[a][0]===o){a=te[a][1]||a;break}}else if(xt.indexOf(o)>=0||Te[o]<Te[a]){n.push(o);break}t.push(o)}te[a]||n.push(a),e=e.substr(r.index+a.length)}return e=e.trim(),e&&t.push(e),t.concat(n.reverse())}var vr={"!":function(e){return!e},"*":function(e,t){return e*t},"/":function(e,t){return e/t},"%":function(e,t){return e%t},"+":function(e,t){return e+t},"-":function(e,t){return e-t},"<":function(e,t){return e<t},"<=":function(e,t){return e<=t},">":function(e,t){return e>t},">=":function(e,t){return e>=t},"==":function(e,t){return e===t},"!=":function(e,t){return e!==t},"&&":function(e,t){return e&&t},"||":function(e,t){return e||t},"?:":function(e,t,n){if(e)throw t;return n}};function xr(e,t){var n=[],r,a,s,o,l,u;for(r=0;r<e.length;r++){if(l=e[r],o=vr[l],o){for(a=o.length,s=Array(a);a--;)s[a]=n.pop();try{u=o.apply(null,s)}catch(f){return f}}else t.hasOwnProperty(l)?u=t[l]:u=+l;n.push(u)}return n[0]}function wr(e){var t=yr(e);return function(n){return xr(t,n)}}function Ar(e){var t=wr(e);return function(n){return+t({n})}}var At={contextDelimiter:"",onMissingKey:null};function Cr(e){var t,n,r;for(t=e.split(";"),n=0;n<t.length;n++)if(r=t[n].trim(),r.indexOf("plural=")===0)return r.substr(7)}function Ie(e,t){var n;this.data=e,this.pluralForms={},this.options={};for(n in At)this.options[n]=t!==void 0&&n in t?t[n]:At[n]}Ie.prototype.getPluralForm=function(e,t){var n=this.pluralForms[e],r,a,s;return n||(r=this.data[e][""],s=r["Plural-Forms"]||r["plural-forms"]||r.plural_forms,typeof s!="function"&&(a=Cr(r["Plural-Forms"]||r["plural-forms"]||r.plural_forms),s=Ar(a)),n=this.pluralForms[e]=s),n(t)},Ie.prototype.dcnpgettext=function(e,t,n,r,a){var s,o,l;return a===void 0?s=0:s=this.getPluralForm(e,a),o=n,t&&(o=t+this.options.contextDelimiter+n),l=this.data[e][o],l&&l[s]?l[s]:(this.options.onMissingKey&&this.options.onMissingKey(n,e),s===0?n:r)};const Ct={"":{plural_forms(e){return e===1?0:1}}},Sr=/^i18n\.(n?gettext|has_translation)(_|$)/,kr=(e,t,n)=>{const r=new Ie({}),a=new Set,s=()=>{a.forEach(p=>p())},o=p=>(a.add(p),()=>a.delete(p)),l=(p="default")=>r.data[p],u=(p,v="default")=>{var C;r.data[v]={...r.data[v],...p},r.data[v][""]={...Ct[""],...(C=r.data[v])==null?void 0:C[""]},delete r.pluralForms[v]},f=(p,v)=>{u(p,v),s()},m=(p,v="default")=>{var C;r.data[v]={...r.data[v],...p,"":{...Ct[""],...(C=r.data[v])==null?void 0:C[""],...p==null?void 0:p[""]}},delete r.pluralForms[v],s()},c=(p,v)=>{r.data={},r.pluralForms={},f(p,v)},b=(p="default",v,C,P,I)=>(r.data[p]||u(void 0,p),r.dcnpgettext(p,v,C,P,I)),x=(p="default")=>p,w=(p,v)=>{let C=b(v,void 0,p);return n?(C=n.applyFilters("i18n.gettext",C,p,v),n.applyFilters("i18n.gettext_"+x(v),C,p,v)):C},g=(p,v,C)=>{let P=b(C,v,p);return n?(P=n.applyFilters("i18n.gettext_with_context",P,p,v,C),n.applyFilters("i18n.gettext_with_context_"+x(C),P,p,v,C)):P},k=(p,v,C,P)=>{let I=b(P,void 0,p,v,C);return n?(I=n.applyFilters("i18n.ngettext",I,p,v,C,P),n.applyFilters("i18n.ngettext_"+x(P),I,p,v,C,P)):I},_=(p,v,C,P,I)=>{let G=b(I,P,p,v,C);return n?(G=n.applyFilters("i18n.ngettext_with_context",G,p,v,C,P,I),n.applyFilters("i18n.ngettext_with_context_"+x(I),G,p,v,C,P,I)):G},S=()=>g("ltr","text direction")==="rtl",j=(p,v,C)=>{var G,cr;const P=v?v+""+p:p;let I=!!((cr=(G=r.data)==null?void 0:G[C??"default"])!=null&&cr[P]);return n&&(I=n.applyFilters("i18n.has_translation",I,p,v,C),I=n.applyFilters("i18n.has_translation_"+x(C),I,p,v,C)),I};if(n){const p=v=>{Sr.test(v)&&s()};n.addAction("hookAdded","core/i18n",p),n.addAction("hookRemoved","core/i18n",p)}return{getLocaleData:l,setLocaleData:f,addLocaleData:m,resetLocaleData:c,subscribe:o,__:w,_x:g,_n:k,_nx:_,isRTL:S,hasTranslation:j}};function St(e){return typeof e!="string"||e===""?(console.error("The namespace must be a non-empty string."),!1):/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(e)?!0:(console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes."),!1)}function Ne(e){return typeof e!="string"||e===""?(console.error("The hook name must be a non-empty string."),!1):/^__/.test(e)?(console.error("The hook name cannot begin with `__`."),!1):/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(e)?!0:(console.error("The hook name can only contain numbers, letters, dashes, periods and underscores."),!1)}function kt(e,t){return function(r,a,s,o=10){const l=e[t];if(!Ne(r)||!St(a))return;if(typeof s!="function"){console.error("The hook callback must be a function.");return}if(typeof o!="number"){console.error("If specified, the hook priority must be a number.");return}const u={callback:s,priority:o,namespace:a};if(l[r]){const f=l[r].handlers;let m;for(m=f.length;m>0&&!(o>=f[m-1].priority);m--);m===f.length?f[m]=u:f.splice(m,0,u),l.__current.forEach(c=>{c.name===r&&c.currentIndex>=m&&c.currentIndex++})}else l[r]={handlers:[u],runs:0};r!=="hookAdded"&&e.doAction("hookAdded",r,a,s,o)}}function ue(e,t,n=!1){return function(a,s){const o=e[t];if(!Ne(a)||!n&&!St(s))return;if(!o[a])return 0;let l=0;if(n)l=o[a].handlers.length,o[a]={runs:o[a].runs,handlers:[]};else{const u=o[a].handlers;for(let f=u.length-1;f>=0;f--)u[f].namespace===s&&(u.splice(f,1),l++,o.__current.forEach(m=>{m.name===a&&m.currentIndex>=f&&m.currentIndex--}))}return a!=="hookRemoved"&&e.doAction("hookRemoved",a,s),l}}function Et(e,t){return function(r,a){const s=e[t];return typeof a<"u"?r in s&&s[r].handlers.some(o=>o.namespace===a):r in s}}function Ot(e,t,n=!1){return function(a,...s){const o=e[t];o[a]||(o[a]={handlers:[],runs:0}),o[a].runs++;const l=o[a].handlers;if(!l||!l.length)return n?s[0]:void 0;const u={name:a,currentIndex:0};for(o.__current.push(u);u.currentIndex<l.length;){const m=l[u.currentIndex].callback.apply(null,s);n&&(s[0]=m),u.currentIndex++}if(o.__current.pop(),n)return s[0]}}function _t(e,t){return function(){var s;var r;const a=e[t];return(r=(s=a.__current[a.__current.length-1])==null?void 0:s.name)!==null&&r!==void 0?r:null}}function jt(e,t){return function(r){const a=e[t];return typeof r>"u"?typeof a.__current[0]<"u":a.__current[0]?r===a.__current[0].name:!1}}function Pt(e,t){return function(r){const a=e[t];if(Ne(r))return a[r]&&a[r].runs?a[r].runs:0}}class Er{constructor(){this.actions=Object.create(null),this.actions.__current=[],this.filters=Object.create(null),this.filters.__current=[],this.addAction=kt(this,"actions"),this.addFilter=kt(this,"filters"),this.removeAction=ue(this,"actions"),this.removeFilter=ue(this,"filters"),this.hasAction=Et(this,"actions"),this.hasFilter=Et(this,"filters"),this.removeAllActions=ue(this,"actions",!0),this.removeAllFilters=ue(this,"filters",!0),this.doAction=Ot(this,"actions"),this.applyFilters=Ot(this,"filters",!0),this.currentAction=_t(this,"actions"),this.currentFilter=_t(this,"filters"),this.doingAction=jt(this,"actions"),this.doingFilter=jt(this,"filters"),this.didAction=Pt(this,"actions"),this.didFilter=Pt(this,"filters")}}function Or(){return new Er}const Tt=Or(),{addAction:jo,addFilter:Po,removeAction:To,removeFilter:Io,hasAction:No,hasFilter:Fo,removeAllActions:Lo,removeAllFilters:Mo,doAction:Do,applyFilters:Ro,currentAction:Ho,currentFilter:zo,doingAction:Vo,doingFilter:Uo,didAction:Bo,didFilter:Yo,actions:Wo,filters:$o}=Tt,T=kr(void 0,void 0,Tt);T.getLocaleData.bind(T),T.setLocaleData.bind(T),T.resetLocaleData.bind(T),T.subscribe.bind(T);const E=T.__.bind(T);T._x.bind(T),T._n.bind(T),T._nx.bind(T),T.isRTL.bind(T),T.hasTranslation.bind(T);function It({children:e,classNames:t=[]}){return i.jsx("div",{className:["right-container-item",...t].join(" "),children:e})}/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function _r(e,t,n){return(t=Pr(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Nt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Nt(Object(n),!0).forEach(function(r){_r(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Nt(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function jr(e,t){if(typeof e!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Pr(e){var t=jr(e,"string");return typeof t=="symbol"?t:t+""}const Ft=()=>{};let Fe={},Lt={},Mt=null,Dt={mark:Ft,measure:Ft};try{typeof window<"u"&&(Fe=window),typeof document<"u"&&(Lt=document),typeof MutationObserver<"u"&&(Mt=MutationObserver),typeof performance<"u"&&(Dt=performance)}catch{}const{userAgent:Rt=""}=Fe.navigator||{},V=Fe,O=Lt,Ht=Mt,de=Dt;V.document;const R=!!O.documentElement&&!!O.head&&typeof O.addEventListener=="function"&&typeof O.createElement=="function",zt=~Rt.indexOf("MSIE")||~Rt.indexOf("Trident/");var Tr=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Ir=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,Vt={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},Nr={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Ut=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],N="classic",me="duotone",Fr="sharp",Lr="sharp-duotone",Bt=[N,me,Fr,Lr],Mr={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},Dr={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},Rr=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),Hr={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},zr=["fak","fa-kit","fakd","fa-kit-duotone"],Yt={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},Vr=["kit"],Ur={kit:{"fa-kit":"fak"}},Br=["fak","fakd"],Yr={kit:{fak:"fa-kit"}},Wt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},pe={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Wr=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],$r=["fak","fa-kit","fakd","fa-kit-duotone"],Zr={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Gr={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},Xr={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},Le={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},Kr=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Me=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...Wr,...Kr],qr=["solid","regular","light","thin","duotone","brands"],$t=[1,2,3,4,5,6,7,8,9,10],Jr=$t.concat([11,12,13,14,15,16,17,18,19,20]),Qr=[...Object.keys(Xr),...qr,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",pe.GROUP,pe.SWAP_OPACITY,pe.PRIMARY,pe.SECONDARY].concat($t.map(e=>"".concat(e,"x"))).concat(Jr.map(e=>"w-".concat(e))),ea={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const H="___FONT_AWESOME___",De=16,Zt="fa",Gt="svg-inline--fa",W="data-fa-i2svg",Re="data-fa-pseudo-element",ta="data-fa-pseudo-element-pending",He="data-prefix",ze="data-icon",Xt="fontawesome-i2svg",na="async",ra=["HTML","HEAD","STYLE","SCRIPT"],Kt=(()=>{try{return!0}catch{return!1}})();function ne(e){return new Proxy(e,{get(t,n){return n in t?t[n]:t[N]}})}const qt=d({},Vt);qt[N]=d(d(d(d({},{"fa-duotone":"duotone"}),Vt[N]),Yt.kit),Yt["kit-duotone"]);const aa=ne(qt),Ve=d({},Hr);Ve[N]=d(d(d(d({},{duotone:"fad"}),Ve[N]),Wt.kit),Wt["kit-duotone"]);const Jt=ne(Ve),Ue=d({},Le);Ue[N]=d(d({},Ue[N]),Yr.kit);const Be=ne(Ue),Ye=d({},Gr);Ye[N]=d(d({},Ye[N]),Ur.kit),ne(Ye);const sa=Tr,Qt="fa-layers-text",oa=Ir,ia=d({},Mr);ne(ia);const la=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],We=Nr,ca=[...Vr,...Qr],re=V.FontAwesomeConfig||{};function fa(e){var t=O.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function ua(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}O&&typeof O.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(t=>{let[n,r]=t;const a=ua(fa(n));a!=null&&(re[r]=a)});const en={styleDefault:"solid",familyDefault:N,cssPrefix:Zt,replacementClass:Gt,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};re.familyPrefix&&(re.cssPrefix=re.familyPrefix);const K=d(d({},en),re);K.autoReplaceSvg||(K.observeMutations=!1);const h={};Object.keys(en).forEach(e=>{Object.defineProperty(h,e,{enumerable:!0,set:function(t){K[e]=t,ae.forEach(n=>n(h))},get:function(){return K[e]}})}),Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(e){K.cssPrefix=e,ae.forEach(t=>t(h))},get:function(){return K.cssPrefix}}),V.FontAwesomeConfig=h;const ae=[];function da(e){return ae.push(e),()=>{ae.splice(ae.indexOf(e),1)}}const U=De,L={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function ma(e){if(!e||!R)return;const t=O.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;const n=O.head.childNodes;let r=null;for(let a=n.length-1;a>-1;a--){const s=n[a],o=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(r=s)}return O.head.insertBefore(t,r),e}const pa="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function se(){let e=12,t="";for(;e-- >0;)t+=pa[Math.random()*62|0];return t}function q(e){const t=[];for(let n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function $e(e){return e.classList?q(e.classList):(e.getAttribute("class")||"").split(" ").filter(t=>t)}function tn(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ha(e){return Object.keys(e||{}).reduce((t,n)=>t+"".concat(n,'="').concat(tn(e[n]),'" '),"").trim()}function he(e){return Object.keys(e||{}).reduce((t,n)=>t+"".concat(n,": ").concat(e[n].trim(),";"),"")}function Ze(e){return e.size!==L.size||e.x!==L.x||e.y!==L.y||e.rotate!==L.rotate||e.flipX||e.flipY}function ga(e){let{transform:t,containerWidth:n,iconWidth:r}=e;const a={transform:"translate(".concat(n/2," 256)")},s="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),l="rotate(".concat(t.rotate," 0 0)"),u={transform:"".concat(s," ").concat(o," ").concat(l)},f={transform:"translate(".concat(r/2*-1," -256)")};return{outer:a,inner:u,path:f}}function ba(e){let{transform:t,width:n=De,height:r=De,startCentered:a=!1}=e,s="";return a&&zt?s+="translate(".concat(t.x/U-n/2,"em, ").concat(t.y/U-r/2,"em) "):a?s+="translate(calc(-50% + ".concat(t.x/U,"em), calc(-50% + ").concat(t.y/U,"em)) "):s+="translate(".concat(t.x/U,"em, ").concat(t.y/U,"em) "),s+="scale(".concat(t.size/U*(t.flipX?-1:1),", ").concat(t.size/U*(t.flipY?-1:1),") "),s+="rotate(".concat(t.rotate,"deg) "),s}var ya=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function nn(){const e=Zt,t=Gt,n=h.cssPrefix,r=h.replacementClass;let a=ya;if(n!==e||r!==t){const s=new RegExp("\\.".concat(e,"\\-"),"g"),o=new RegExp("\\--".concat(e,"\\-"),"g"),l=new RegExp("\\.".concat(t),"g");a=a.replace(s,".".concat(n,"-")).replace(o,"--".concat(n,"-")).replace(l,".".concat(r))}return a}let rn=!1;function Ge(){h.autoAddCss&&!rn&&(ma(nn()),rn=!0)}var va={mixout(){return{dom:{css:nn,insertCss:Ge}}},hooks(){return{beforeDOMElementCreation(){Ge()},beforeI2svg(){Ge()}}}};const z=V||{};z[H]||(z[H]={}),z[H].styles||(z[H].styles={}),z[H].hooks||(z[H].hooks={}),z[H].shims||(z[H].shims=[]);var M=z[H];const an=[],sn=function(){O.removeEventListener("DOMContentLoaded",sn),ge=1,an.map(e=>e())};let ge=!1;R&&(ge=(O.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(O.readyState),ge||O.addEventListener("DOMContentLoaded",sn));function xa(e){R&&(ge?setTimeout(e,0):an.push(e))}function oe(e){const{tag:t,attributes:n={},children:r=[]}=e;return typeof e=="string"?tn(e):"<".concat(t," ").concat(ha(n),">").concat(r.map(oe).join(""),"</").concat(t,">")}function on(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Xe=function(t,n,r,a){var s=Object.keys(t),o=s.length,l=n,u,f,m;for(r===void 0?(u=1,m=t[s[0]]):(u=0,m=r);u<o;u++)f=s[u],m=l(m,t[f],f,t);return m};function wa(e){const t=[];let n=0;const r=e.length;for(;n<r;){const a=e.charCodeAt(n++);if(a>=55296&&a<=56319&&n<r){const s=e.charCodeAt(n++);(s&64512)==56320?t.push(((a&1023)<<10)+(s&1023)+65536):(t.push(a),n--)}else t.push(a)}return t}function Ke(e){const t=wa(e);return t.length===1?t[0].toString(16):null}function Aa(e,t){const n=e.length;let r=e.charCodeAt(t),a;return r>=55296&&r<=56319&&n>t+1&&(a=e.charCodeAt(t+1),a>=56320&&a<=57343)?(r-55296)*1024+a-56320+65536:r}function ln(e){return Object.keys(e).reduce((t,n)=>{const r=e[n];return!!r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function qe(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:r=!1}=n,a=ln(t);typeof M.hooks.addPack=="function"&&!r?M.hooks.addPack(e,ln(t)):M.styles[e]=d(d({},M.styles[e]||{}),a),e==="fas"&&qe("fa",t)}const{styles:ie,shims:Ca}=M,cn=Object.keys(Be),Sa=cn.reduce((e,t)=>(e[t]=Object.keys(Be[t]),e),{});let Je=null,fn={},un={},dn={},mn={},pn={};function ka(e){return~ca.indexOf(e)}function Ea(e,t){const n=t.split("-"),r=n[0],a=n.slice(1).join("-");return r===e&&a!==""&&!ka(a)?a:null}const hn=()=>{const e=r=>Xe(ie,(a,s,o)=>(a[o]=Xe(s,r,{}),a),{});fn=e((r,a,s)=>(a[3]&&(r[a[3]]=s),a[2]&&a[2].filter(l=>typeof l=="number").forEach(l=>{r[l.toString(16)]=s}),r)),un=e((r,a,s)=>(r[s]=s,a[2]&&a[2].filter(l=>typeof l=="string").forEach(l=>{r[l]=s}),r)),pn=e((r,a,s)=>{const o=a[2];return r[s]=s,o.forEach(l=>{r[l]=s}),r});const t="far"in ie||h.autoFetchSvg,n=Xe(Ca,(r,a)=>{const s=a[0];let o=a[1];const l=a[2];return o==="far"&&!t&&(o="fas"),typeof s=="string"&&(r.names[s]={prefix:o,iconName:l}),typeof s=="number"&&(r.unicodes[s.toString(16)]={prefix:o,iconName:l}),r},{names:{},unicodes:{}});dn=n.names,mn=n.unicodes,Je=be(h.styleDefault,{family:h.familyDefault})};da(e=>{Je=be(e.styleDefault,{family:h.familyDefault})}),hn();function Qe(e,t){return(fn[e]||{})[t]}function Oa(e,t){return(un[e]||{})[t]}function $(e,t){return(pn[e]||{})[t]}function gn(e){return dn[e]||{prefix:null,iconName:null}}function _a(e){const t=mn[e],n=Qe("fas",e);return t||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function B(){return Je}const bn=()=>({prefix:null,iconName:null,rest:[]});function ja(e){let t=N;const n=cn.reduce((r,a)=>(r[a]="".concat(h.cssPrefix,"-").concat(a),r),{});return Bt.forEach(r=>{(e.includes(n[r])||e.some(a=>Sa[r].includes(a)))&&(t=r)}),t}function be(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=N}=t,r=aa[n][e];if(n===me&&!e)return"fad";const a=Jt[n][e]||Jt[n][r],s=e in M.styles?e:null;return a||s||null}function Pa(e){let t=[],n=null;return e.forEach(r=>{const a=Ea(h.cssPrefix,r);a?n=a:r&&t.push(r)}),{iconName:n,rest:t}}function yn(e){return e.sort().filter((t,n,r)=>r.indexOf(t)===n)}function ye(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=t;let r=null;const a=Me.concat($r),s=yn(e.filter(c=>a.includes(c))),o=yn(e.filter(c=>!Me.includes(c))),l=s.filter(c=>(r=c,!Ut.includes(c))),[u=null]=l,f=ja(s),m=d(d({},Pa(o)),{},{prefix:be(u,{family:f})});return d(d(d({},m),Fa({values:e,family:f,styles:ie,config:h,canonical:m,givenPrefix:r})),Ta(n,r,m))}function Ta(e,t,n){let{prefix:r,iconName:a}=n;if(e||!r||!a)return{prefix:r,iconName:a};const s=t==="fa"?gn(a):{},o=$(r,a);return a=s.iconName||o||a,r=s.prefix||r,r==="far"&&!ie.far&&ie.fas&&!h.autoFetchSvg&&(r="fas"),{prefix:r,iconName:a}}const Ia=Bt.filter(e=>e!==N||e!==me),Na=Object.keys(Le).filter(e=>e!==N).map(e=>Object.keys(Le[e])).flat();function Fa(e){const{values:t,family:n,canonical:r,givenPrefix:a="",styles:s={},config:o={}}=e,l=n===me,u=t.includes("fa-duotone")||t.includes("fad"),f=o.familyDefault==="duotone",m=r.prefix==="fad"||r.prefix==="fa-duotone";if(!l&&(u||f||m)&&(r.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(r.prefix="fab"),!r.prefix&&Ia.includes(n)&&(Object.keys(s).find(b=>Na.includes(b))||o.autoFetchSvg)){const b=Rr.get(n).defaultShortPrefixId;r.prefix=b,r.iconName=$(r.prefix,r.iconName)||r.iconName}return(r.prefix==="fa"||a==="fa")&&(r.prefix=B()||"fas"),r}class La{constructor(){this.definitions={}}add(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];const a=n.reduce(this._pullDefinitions,{});Object.keys(a).forEach(s=>{this.definitions[s]=d(d({},this.definitions[s]||{}),a[s]),qe(s,a[s]);const o=Be[N][s];o&&qe(o,a[s]),hn()})}reset(){this.definitions={}}_pullDefinitions(t,n){const r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(a=>{const{prefix:s,iconName:o,icon:l}=r[a],u=l[2];t[s]||(t[s]={}),u.length>0&&u.forEach(f=>{typeof f=="string"&&(t[s][f]=l)}),t[s][o]=l}),t}}let vn=[],J={};const Q={},Ma=Object.keys(Q);function Da(e,t){let{mixoutsTo:n}=t;return vn=e,J={},Object.keys(Q).forEach(r=>{Ma.indexOf(r)===-1&&delete Q[r]}),vn.forEach(r=>{const a=r.mixout?r.mixout():{};if(Object.keys(a).forEach(s=>{typeof a[s]=="function"&&(n[s]=a[s]),typeof a[s]=="object"&&Object.keys(a[s]).forEach(o=>{n[s]||(n[s]={}),n[s][o]=a[s][o]})}),r.hooks){const s=r.hooks();Object.keys(s).forEach(o=>{J[o]||(J[o]=[]),J[o].push(s[o])})}r.provides&&r.provides(Q)}),n}function et(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];return(J[e]||[]).forEach(o=>{t=o.apply(null,[t,...r])}),t}function Z(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];(J[e]||[]).forEach(s=>{s.apply(null,n)})}function Y(){const e=arguments[0],t=Array.prototype.slice.call(arguments,1);return Q[e]?Q[e].apply(null,t):void 0}function tt(e){e.prefix==="fa"&&(e.prefix="fas");let{iconName:t}=e;const n=e.prefix||B();if(t)return t=$(n,t)||t,on(xn.definitions,n,t)||on(M.styles,n,t)}const xn=new La,F={noAuto:()=>{h.autoReplaceSvg=!1,h.observeMutations=!1,Z("noAuto")},config:h,dom:{i2svg:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return R?(Z("beforeI2svg",e),Y("pseudoElements2svg",e),Y("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:t}=e;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,xa(()=>{Ra({autoReplaceSvgRoot:t}),Z("watch",e)})}},parse:{icon:e=>{if(e===null)return null;if(typeof e=="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:$(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){const t=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],n=be(e[0]);return{prefix:n,iconName:$(n,t)||t}}if(typeof e=="string"&&(e.indexOf("".concat(h.cssPrefix,"-"))>-1||e.match(sa))){const t=ye(e.split(" "),{skipLookups:!0});return{prefix:t.prefix||B(),iconName:$(t.prefix,t.iconName)||t.iconName}}if(typeof e=="string"){const t=B();return{prefix:t,iconName:$(t,e)||e}}}},library:xn,findIconDefinition:tt,toHtml:oe},Ra=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:t=O}=e;(Object.keys(M.styles).length>0||h.autoFetchSvg)&&R&&h.autoReplaceSvg&&F.dom.i2svg({node:t})};function ve(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(n=>oe(n))}}),Object.defineProperty(e,"node",{get:function(){if(!R)return;const n=O.createElement("div");return n.innerHTML=e.html,n.children}}),e}function Ha(e){let{children:t,main:n,mask:r,attributes:a,styles:s,transform:o}=e;if(Ze(o)&&n.found&&!r.found){const{width:l,height:u}=n,f={x:l/u/2,y:.5};a.style=he(d(d({},s),{},{"transform-origin":"".concat(f.x+o.x/16,"em ").concat(f.y+o.y/16,"em")}))}return[{tag:"svg",attributes:a,children:t}]}function za(e){let{prefix:t,iconName:n,children:r,attributes:a,symbol:s}=e;const o=s===!0?"".concat(t,"-").concat(h.cssPrefix,"-").concat(n):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:d(d({},a),{},{id:o}),children:r}]}]}function nt(e){const{icons:{main:t,mask:n},prefix:r,iconName:a,transform:s,symbol:o,title:l,maskId:u,titleId:f,extra:m,watchable:c=!1}=e,{width:b,height:x}=n.found?n:t,w=Br.includes(r),g=[h.replacementClass,a?"".concat(h.cssPrefix,"-").concat(a):""].filter(v=>m.classes.indexOf(v)===-1).filter(v=>v!==""||!!v).concat(m.classes).join(" ");let k={children:[],attributes:d(d({},m.attributes),{},{"data-prefix":r,"data-icon":a,class:g,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(b," ").concat(x)})};const _=w&&!~m.classes.indexOf("fa-fw")?{width:"".concat(b/x*16*.0625,"em")}:{};c&&(k.attributes[W]=""),l&&(k.children.push({tag:"title",attributes:{id:k.attributes["aria-labelledby"]||"title-".concat(f||se())},children:[l]}),delete k.attributes.title);const S=d(d({},k),{},{prefix:r,iconName:a,main:t,mask:n,maskId:u,transform:s,symbol:o,styles:d(d({},_),m.styles)}),{children:j,attributes:p}=n.found&&t.found?Y("generateAbstractMask",S)||{children:[],attributes:{}}:Y("generateAbstractIcon",S)||{children:[],attributes:{}};return S.children=j,S.attributes=p,o?za(S):Ha(S)}function wn(e){const{content:t,width:n,height:r,transform:a,title:s,extra:o,watchable:l=!1}=e,u=d(d(d({},o.attributes),s?{title:s}:{}),{},{class:o.classes.join(" ")});l&&(u[W]="");const f=d({},o.styles);Ze(a)&&(f.transform=ba({transform:a,startCentered:!0,width:n,height:r}),f["-webkit-transform"]=f.transform);const m=he(f);m.length>0&&(u.style=m);const c=[];return c.push({tag:"span",attributes:u,children:[t]}),s&&c.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),c}function Va(e){const{content:t,title:n,extra:r}=e,a=d(d(d({},r.attributes),n?{title:n}:{}),{},{class:r.classes.join(" ")}),s=he(r.styles);s.length>0&&(a.style=s);const o=[];return o.push({tag:"span",attributes:a,children:[t]}),n&&o.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),o}const{styles:rt}=M;function at(e){const t=e[0],n=e[1],[r]=e.slice(4);let a=null;return Array.isArray(r)?a={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(We.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(We.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(We.PRIMARY),fill:"currentColor",d:r[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:t,height:n,icon:a}}const Ua={found:!1,width:512,height:512};function Ba(e,t){!Kt&&!h.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function st(e,t){let n=t;return t==="fa"&&h.styleDefault!==null&&(t=B()),new Promise((r,a)=>{if(n==="fa"){const s=gn(e)||{};e=s.iconName||e,t=s.prefix||t}if(e&&t&&rt[t]&&rt[t][e]){const s=rt[t][e];return r(at(s))}Ba(e,t),r(d(d({},Ua),{},{icon:h.showMissingIcons&&e?Y("missingIconAbstract")||{}:{}}))})}const An=()=>{},ot=h.measurePerformance&&de&&de.mark&&de.measure?de:{mark:An,measure:An},le='FA "6.7.2"',Ya=e=>(ot.mark("".concat(le," ").concat(e," begins")),()=>Cn(e)),Cn=e=>{ot.mark("".concat(le," ").concat(e," ends")),ot.measure("".concat(le," ").concat(e),"".concat(le," ").concat(e," begins"),"".concat(le," ").concat(e," ends"))};var it={begin:Ya,end:Cn};const xe=()=>{};function Sn(e){return typeof(e.getAttribute?e.getAttribute(W):null)=="string"}function Wa(e){const t=e.getAttribute?e.getAttribute(He):null,n=e.getAttribute?e.getAttribute(ze):null;return t&&n}function $a(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(h.replacementClass)}function Za(){return h.autoReplaceSvg===!0?we.replace:we[h.autoReplaceSvg]||we.replace}function Ga(e){return O.createElementNS("http://www.w3.org/2000/svg",e)}function Xa(e){return O.createElement(e)}function kn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=e.tag==="svg"?Ga:Xa}=t;if(typeof e=="string")return O.createTextNode(e);const r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(s){r.setAttribute(s,e.attributes[s])}),(e.children||[]).forEach(function(s){r.appendChild(kn(s,{ceFn:n}))}),r}function Ka(e){let t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}const we={replace:function(e){const t=e[0];if(t.parentNode)if(e[1].forEach(n=>{t.parentNode.insertBefore(kn(n),t)}),t.getAttribute(W)===null&&h.keepOriginalSource){let n=O.createComment(Ka(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){const t=e[0],n=e[1];if(~$e(t).indexOf(h.replacementClass))return we.replace(e);const r=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const s=n[0].attributes.class.split(" ").reduce((o,l)=>(l===h.replacementClass||l.match(r)?o.toSvg.push(l):o.toNode.push(l),o),{toNode:[],toSvg:[]});n[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?t.removeAttribute("class"):t.setAttribute("class",s.toNode.join(" "))}const a=n.map(s=>oe(s)).join(`
`);t.setAttribute(W,""),t.innerHTML=a}};function En(e){e()}function On(e,t){const n=typeof t=="function"?t:xe;if(e.length===0)n();else{let r=En;h.mutateApproach===na&&(r=V.requestAnimationFrame||En),r(()=>{const a=Za(),s=it.begin("mutate");e.map(a),s(),n()})}}let lt=!1;function _n(){lt=!0}function ct(){lt=!1}let Ae=null;function jn(e){if(!Ht||!h.observeMutations)return;const{treeCallback:t=xe,nodeCallback:n=xe,pseudoElementsCallback:r=xe,observeMutationsRoot:a=O}=e;Ae=new Ht(s=>{if(lt)return;const o=B();q(s).forEach(l=>{if(l.type==="childList"&&l.addedNodes.length>0&&!Sn(l.addedNodes[0])&&(h.searchPseudoElements&&r(l.target),t(l.target)),l.type==="attributes"&&l.target.parentNode&&h.searchPseudoElements&&r(l.target.parentNode),l.type==="attributes"&&Sn(l.target)&&~la.indexOf(l.attributeName))if(l.attributeName==="class"&&Wa(l.target)){const{prefix:u,iconName:f}=ye($e(l.target));l.target.setAttribute(He,u||o),f&&l.target.setAttribute(ze,f)}else $a(l.target)&&n(l.target)})}),R&&Ae.observe(a,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function qa(){Ae&&Ae.disconnect()}function Ja(e){const t=e.getAttribute("style");let n=[];return t&&(n=t.split(";").reduce((r,a)=>{const s=a.split(":"),o=s[0],l=s.slice(1);return o&&l.length>0&&(r[o]=l.join(":").trim()),r},{})),n}function Qa(e){const t=e.getAttribute("data-prefix"),n=e.getAttribute("data-icon"),r=e.innerText!==void 0?e.innerText.trim():"";let a=ye($e(e));return a.prefix||(a.prefix=B()),t&&n&&(a.prefix=t,a.iconName=n),a.iconName&&a.prefix||(a.prefix&&r.length>0&&(a.iconName=Oa(a.prefix,e.innerText)||Qe(a.prefix,Ke(e.innerText))),!a.iconName&&h.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(a.iconName=e.firstChild.data)),a}function es(e){const t=q(e.attributes).reduce((a,s)=>(a.name!=="class"&&a.name!=="style"&&(a[s.name]=s.value),a),{}),n=e.getAttribute("title"),r=e.getAttribute("data-fa-title-id");return h.autoA11y&&(n?t["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(r||se()):(t["aria-hidden"]="true",t.focusable="false")),t}function ts(){return{iconName:null,title:null,titleId:null,prefix:null,transform:L,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Pn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:r,rest:a}=Qa(e),s=es(e),o=et("parseNodeAttributes",{},e);let l=t.styleParser?Ja(e):[];return d({iconName:n,title:e.getAttribute("title"),titleId:e.getAttribute("data-fa-title-id"),prefix:r,transform:L,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:l,attributes:s}},o)}const{styles:ns}=M;function Tn(e){const t=h.autoReplaceSvg==="nest"?Pn(e,{styleParser:!1}):Pn(e);return~t.extra.classes.indexOf(Qt)?Y("generateLayersText",e,t):Y("generateSvgReplacementMutation",e,t)}function rs(){return[...zr,...Me]}function In(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!R)return Promise.resolve();const n=O.documentElement.classList,r=m=>n.add("".concat(Xt,"-").concat(m)),a=m=>n.remove("".concat(Xt,"-").concat(m)),s=h.autoFetchSvg?rs():Ut.concat(Object.keys(ns));s.includes("fa")||s.push("fa");const o=[".".concat(Qt,":not([").concat(W,"])")].concat(s.map(m=>".".concat(m,":not([").concat(W,"])"))).join(", ");if(o.length===0)return Promise.resolve();let l=[];try{l=q(e.querySelectorAll(o))}catch{}if(l.length>0)r("pending"),a("complete");else return Promise.resolve();const u=it.begin("onTree"),f=l.reduce((m,c)=>{try{const b=Tn(c);b&&m.push(b)}catch(b){Kt||b.name==="MissingIcon"&&console.error(b)}return m},[]);return new Promise((m,c)=>{Promise.all(f).then(b=>{On(b,()=>{r("active"),r("complete"),a("pending"),typeof t=="function"&&t(),u(),m()})}).catch(b=>{u(),c(b)})})}function as(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Tn(e).then(n=>{n&&On([n],t)})}function ss(e){return function(t){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const r=(t||{}).icon?t:tt(t||{});let{mask:a}=n;return a&&(a=(a||{}).icon?a:tt(a||{})),e(r,d(d({},n),{},{mask:a}))}}const os=function(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=L,symbol:r=!1,mask:a=null,maskId:s=null,title:o=null,titleId:l=null,classes:u=[],attributes:f={},styles:m={}}=t;if(!e)return;const{prefix:c,iconName:b,icon:x}=e;return ve(d({type:"icon"},e),()=>(Z("beforeDOMElementCreation",{iconDefinition:e,params:t}),h.autoA11y&&(o?f["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(l||se()):(f["aria-hidden"]="true",f.focusable="false")),nt({icons:{main:at(x),mask:a?at(a.icon):{found:!1,width:null,height:null,icon:{}}},prefix:c,iconName:b,transform:d(d({},L),n),symbol:r,title:o,maskId:s,titleId:l,extra:{attributes:f,styles:m,classes:u}})))};var is={mixout(){return{icon:ss(os)}},hooks(){return{mutationObserverCallbacks(e){return e.treeCallback=In,e.nodeCallback=as,e}}},provides(e){e.i2svg=function(t){const{node:n=O,callback:r=()=>{}}=t;return In(n,r)},e.generateSvgReplacementMutation=function(t,n){const{iconName:r,title:a,titleId:s,prefix:o,transform:l,symbol:u,mask:f,maskId:m,extra:c}=n;return new Promise((b,x)=>{Promise.all([st(r,o),f.iconName?st(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(w=>{let[g,k]=w;b([t,nt({icons:{main:g,mask:k},prefix:o,iconName:r,transform:l,symbol:u,maskId:m,title:a,titleId:s,extra:c,watchable:!0})])}).catch(x)})},e.generateAbstractIcon=function(t){let{children:n,attributes:r,main:a,transform:s,styles:o}=t;const l=he(o);l.length>0&&(r.style=l);let u;return Ze(s)&&(u=Y("generateAbstractTransformGrouping",{main:a,transform:s,containerWidth:a.width,iconWidth:a.width})),n.push(u||a.icon),{children:n,attributes:r}}}},ls={mixout(){return{layer(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=t;return ve({type:"layer"},()=>{Z("beforeDOMElementCreation",{assembler:e,params:t});let r=[];return e(a=>{Array.isArray(a)?a.map(s=>{r=r.concat(s.abstract)}):r=r.concat(a.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers"),...n].join(" ")},children:r}]})}}}},cs={mixout(){return{counter(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:r=[],attributes:a={},styles:s={}}=t;return ve({type:"counter",content:e},()=>(Z("beforeDOMElementCreation",{content:e,params:t}),Va({content:e.toString(),title:n,extra:{attributes:a,styles:s,classes:["".concat(h.cssPrefix,"-layers-counter"),...r]}})))}}}},fs={mixout(){return{text(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=L,title:r=null,classes:a=[],attributes:s={},styles:o={}}=t;return ve({type:"text",content:e},()=>(Z("beforeDOMElementCreation",{content:e,params:t}),wn({content:e,transform:d(d({},L),n),title:r,extra:{attributes:s,styles:o,classes:["".concat(h.cssPrefix,"-layers-text"),...a]}})))}}},provides(e){e.generateLayersText=function(t,n){const{title:r,transform:a,extra:s}=n;let o=null,l=null;if(zt){const u=parseInt(getComputedStyle(t).fontSize,10),f=t.getBoundingClientRect();o=f.width/u,l=f.height/u}return h.autoA11y&&!r&&(s.attributes["aria-hidden"]="true"),Promise.resolve([t,wn({content:t.innerHTML,width:o,height:l,transform:a,title:r,extra:s,watchable:!0})])}}};const us=new RegExp('"',"ug"),Nn=[1105920,1112319],Fn=d(d(d(d({},{FontAwesome:{normal:"fas",400:"fas"}}),Dr),ea),Zr),ft=Object.keys(Fn).reduce((e,t)=>(e[t.toLowerCase()]=Fn[t],e),{}),ds=Object.keys(ft).reduce((e,t)=>{const n=ft[t];return e[t]=n[900]||[...Object.entries(n)][0][1],e},{});function ms(e){const t=e.replace(us,""),n=Aa(t,0),r=n>=Nn[0]&&n<=Nn[1],a=t.length===2?t[0]===t[1]:!1;return{value:Ke(a?t[0]:t),isSecondary:r||a}}function ps(e,t){const n=e.replace(/^['"]|['"]$/g,"").toLowerCase(),r=parseInt(t),a=isNaN(r)?"normal":r;return(ft[n]||{})[a]||ds[n]}function Ln(e,t){const n="".concat(ta).concat(t.replace(":","-"));return new Promise((r,a)=>{if(e.getAttribute(n)!==null)return r();const o=q(e.children).filter(b=>b.getAttribute(Re)===t)[0],l=V.getComputedStyle(e,t),u=l.getPropertyValue("font-family"),f=u.match(oa),m=l.getPropertyValue("font-weight"),c=l.getPropertyValue("content");if(o&&!f)return e.removeChild(o),r();if(f&&c!=="none"&&c!==""){const b=l.getPropertyValue("content");let x=ps(u,m);const{value:w,isSecondary:g}=ms(b),k=f[0].startsWith("FontAwesome");let _=Qe(x,w),S=_;if(k){const j=_a(w);j.iconName&&j.prefix&&(_=j.iconName,x=j.prefix)}if(_&&!g&&(!o||o.getAttribute(He)!==x||o.getAttribute(ze)!==S)){e.setAttribute(n,S),o&&e.removeChild(o);const j=ts(),{extra:p}=j;p.attributes[Re]=t,st(_,x).then(v=>{const C=nt(d(d({},j),{},{icons:{main:v,mask:bn()},prefix:x,iconName:S,extra:p,watchable:!0})),P=O.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(P,e.firstChild):e.appendChild(P),P.outerHTML=C.map(I=>oe(I)).join(`
`),e.removeAttribute(n),r()}).catch(a)}else r()}else r()})}function hs(e){return Promise.all([Ln(e,"::before"),Ln(e,"::after")])}function gs(e){return e.parentNode!==document.head&&!~ra.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Re)&&(!e.parentNode||e.parentNode.tagName!=="svg")}function Mn(e){if(R)return new Promise((t,n)=>{const r=q(e.querySelectorAll("*")).filter(gs).map(hs),a=it.begin("searchPseudoElements");_n(),Promise.all(r).then(()=>{a(),ct(),t()}).catch(()=>{a(),ct(),n()})})}var bs={hooks(){return{mutationObserverCallbacks(e){return e.pseudoElementsCallback=Mn,e}}},provides(e){e.pseudoElements2svg=function(t){const{node:n=O}=t;h.searchPseudoElements&&Mn(n)}}};let Dn=!1;var ys={mixout(){return{dom:{unwatch(){_n(),Dn=!0}}}},hooks(){return{bootstrap(){jn(et("mutationObserverCallbacks",{}))},noAuto(){qa()},watch(e){const{observeMutationsRoot:t}=e;Dn?ct():jn(et("mutationObserverCallbacks",{observeMutationsRoot:t}))}}}};const Rn=e=>{let t={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce((n,r)=>{const a=r.toLowerCase().split("-"),s=a[0];let o=a.slice(1).join("-");if(s&&o==="h")return n.flipX=!0,n;if(s&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(s){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},t)};var vs={mixout(){return{parse:{transform:e=>Rn(e)}}},hooks(){return{parseNodeAttributes(e,t){const n=t.getAttribute("data-fa-transform");return n&&(e.transform=Rn(n)),e}}},provides(e){e.generateAbstractTransformGrouping=function(t){let{main:n,transform:r,containerWidth:a,iconWidth:s}=t;const o={transform:"translate(".concat(a/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),f="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(l," ").concat(u," ").concat(f)},c={transform:"translate(".concat(s/2*-1," -256)")},b={outer:o,inner:m,path:c};return{tag:"g",attributes:d({},b.outer),children:[{tag:"g",attributes:d({},b.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:d(d({},n.icon.attributes),b.path)}]}]}}}};const ut={x:0,y:0,width:"100%",height:"100%"};function Hn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function xs(e){return e.tag==="g"?e.children:[e]}var ws={hooks(){return{parseNodeAttributes(e,t){const n=t.getAttribute("data-fa-mask"),r=n?ye(n.split(" ").map(a=>a.trim())):bn();return r.prefix||(r.prefix=B()),e.mask=r,e.maskId=t.getAttribute("data-fa-mask-id"),e}}},provides(e){e.generateAbstractMask=function(t){let{children:n,attributes:r,main:a,mask:s,maskId:o,transform:l}=t;const{width:u,icon:f}=a,{width:m,icon:c}=s,b=ga({transform:l,containerWidth:m,iconWidth:u}),x={tag:"rect",attributes:d(d({},ut),{},{fill:"white"})},w=f.children?{children:f.children.map(Hn)}:{},g={tag:"g",attributes:d({},b.inner),children:[Hn(d({tag:f.tag,attributes:d(d({},f.attributes),b.path)},w))]},k={tag:"g",attributes:d({},b.outer),children:[g]},_="mask-".concat(o||se()),S="clip-".concat(o||se()),j={tag:"mask",attributes:d(d({},ut),{},{id:_,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,k]},p={tag:"defs",children:[{tag:"clipPath",attributes:{id:S},children:xs(c)},j]};return n.push(p,{tag:"rect",attributes:d({fill:"currentColor","clip-path":"url(#".concat(S,")"),mask:"url(#".concat(_,")")},ut)}),{children:n,attributes:r}}}},As={provides(e){let t=!1;V.matchMedia&&(t=V.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){const n=[],r={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:d(d({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const s=d(d({},a),{},{attributeName:"opacity"}),o={tag:"circle",attributes:d(d({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return t||o.children.push({tag:"animate",attributes:d(d({},a),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:d(d({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:d(d({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:t?[]:[{tag:"animate",attributes:d(d({},s),{},{values:"1;0;0;0;0;1;"})}]}),t||n.push({tag:"path",attributes:d(d({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:d(d({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Cs={hooks(){return{parseNodeAttributes(e,t){const n=t.getAttribute("data-fa-symbol"),r=n===null?!1:n===""?!0:n;return e.symbol=r,e}}}},Ss=[va,is,ls,cs,fs,bs,ys,vs,ws,As,Cs];Da(Ss,{mixoutsTo:F}),F.noAuto,F.config,F.library,F.dom;const dt=F.parse;F.findIconDefinition,F.toHtml;const ks=F.icon;F.layer,F.text,F.counter;var zn={exports:{}},Es="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",Os=Es,_s=Os;function Vn(){}function Un(){}Un.resetWarningCache=Vn;var js=function(){function e(r,a,s,o,l,u){if(u!==_s){var f=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw f.name="Invariant Violation",f}}e.isRequired=e;function t(){return e}var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:Un,resetWarningCache:Vn};return n.PropTypes=n,n};zn.exports=js();var Ps=zn.exports;const A=fr(Ps);function Bn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,r)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?Bn(Object(n),!0).forEach(function(r){ee(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Bn(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function Ce(e){"@babel/helpers - typeof";return Ce=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ce(e)}function ee(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Ts(e,t){if(e==null)return{};var n={},r=Object.keys(e),a,s;for(s=0;s<r.length;s++)a=r[s],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function Is(e,t){if(e==null)return{};var n=Ts(e,t),r,a;if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)r=s[a],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}function mt(e){return Ns(e)||Fs(e)||Ls(e)||Ms()}function Ns(e){if(Array.isArray(e))return pt(e)}function Fs(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Ls(e,t){if(e){if(typeof e=="string")return pt(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return pt(e,t)}}function pt(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Ms(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ds(e){var t,n=e.beat,r=e.fade,a=e.beatFade,s=e.bounce,o=e.shake,l=e.flash,u=e.spin,f=e.spinPulse,m=e.spinReverse,c=e.pulse,b=e.fixedWidth,x=e.inverse,w=e.border,g=e.listItem,k=e.flip,_=e.size,S=e.rotation,j=e.pull,p=(t={"fa-beat":n,"fa-fade":r,"fa-beat-fade":a,"fa-bounce":s,"fa-shake":o,"fa-flash":l,"fa-spin":u,"fa-spin-reverse":m,"fa-spin-pulse":f,"fa-pulse":c,"fa-fw":b,"fa-inverse":x,"fa-border":w,"fa-li":g,"fa-flip":k===!0,"fa-flip-horizontal":k==="horizontal"||k==="both","fa-flip-vertical":k==="vertical"||k==="both"},ee(t,"fa-".concat(_),typeof _<"u"&&_!==null),ee(t,"fa-rotate-".concat(S),typeof S<"u"&&S!==null&&S!==0),ee(t,"fa-pull-".concat(j),typeof j<"u"&&j!==null),ee(t,"fa-swap-opacity",e.swapOpacity),t);return Object.keys(p).map(function(v){return p[v]?v:null}).filter(function(v){return v})}function Rs(e){return e=e-0,e===e}function Yn(e){return Rs(e)?e:(e=e.replace(/[\-_\s]+(.)?/g,function(t,n){return n?n.toUpperCase():""}),e.substr(0,1).toLowerCase()+e.substr(1))}var Hs=["style"];function zs(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Vs(e){return e.split(";").map(function(t){return t.trim()}).filter(function(t){return t}).reduce(function(t,n){var r=n.indexOf(":"),a=Yn(n.slice(0,r)),s=n.slice(r+1).trim();return a.startsWith("webkit")?t[zs(a)]=s:t[a]=s,t},{})}function Wn(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof t=="string")return t;var r=(t.children||[]).map(function(u){return Wn(e,u)}),a=Object.keys(t.attributes||{}).reduce(function(u,f){var m=t.attributes[f];switch(f){case"class":u.attrs.className=m,delete t.attributes.class;break;case"style":u.attrs.style=Vs(m);break;default:f.indexOf("aria-")===0||f.indexOf("data-")===0?u.attrs[f.toLowerCase()]=m:u.attrs[Yn(f)]=m}return u},{attrs:{}}),s=n.style,o=s===void 0?{}:s,l=Is(n,Hs);return a.attrs.style=D(D({},a.attrs.style),o),e.apply(void 0,[t.tag,D(D({},a.attrs),l)].concat(mt(r)))}var $n=!1;try{$n=!0}catch{}function Us(){if(!$n&&console&&typeof console.error=="function"){var e;(e=console).error.apply(e,arguments)}}function Zn(e){if(e&&Ce(e)==="object"&&e.prefix&&e.iconName&&e.icon)return e;if(dt.icon)return dt.icon(e);if(e===null)return null;if(e&&Ce(e)==="object"&&e.prefix&&e.iconName)return e;if(Array.isArray(e)&&e.length===2)return{prefix:e[0],iconName:e[1]};if(typeof e=="string")return{prefix:"fas",iconName:e}}function ht(e,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?ee({},e,t):{}}var Gn={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},Se=y.forwardRef(function(e,t){var n=D(D({},Gn),e),r=n.icon,a=n.mask,s=n.symbol,o=n.className,l=n.title,u=n.titleId,f=n.maskId,m=Zn(r),c=ht("classes",[].concat(mt(Ds(n)),mt((o||"").split(" ")))),b=ht("transform",typeof n.transform=="string"?dt.transform(n.transform):n.transform),x=ht("mask",Zn(a)),w=ks(m,D(D(D(D({},c),b),x),{},{symbol:s,title:l,titleId:u,maskId:f}));if(!w)return Us("Could not find icon",m),null;var g=w.abstract,k={ref:t};return Object.keys(n).forEach(function(_){Gn.hasOwnProperty(_)||(k[_]=n[_])}),Bs(g[0],k)});Se.displayName="FontAwesomeIcon",Se.propTypes={beat:A.bool,border:A.bool,beatFade:A.bool,bounce:A.bool,className:A.string,fade:A.bool,flash:A.bool,mask:A.oneOfType([A.object,A.array,A.string]),maskId:A.string,fixedWidth:A.bool,inverse:A.bool,flip:A.oneOf([!0,!1,"horizontal","vertical","both"]),icon:A.oneOfType([A.object,A.array,A.string]),listItem:A.bool,pull:A.oneOf(["right","left"]),pulse:A.bool,rotation:A.oneOf([0,90,180,270]),shake:A.bool,size:A.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:A.bool,spinPulse:A.bool,spinReverse:A.bool,symbol:A.oneOfType([A.bool,A.string]),title:A.string,titleId:A.string,transform:A.oneOfType([A.string,A.object]),swapOpacity:A.bool};var Bs=Wn.bind(null,y.createElement);const ke={NEGATIVE:"negative",POSITIVE:"positive"};function Xn({title:e,onClickHandler:t=()=>{},status:n=!1,type:r=ke.NEGATIVE}){const a=()=>{let s="";switch(r){case ke.NEGATIVE:{s="tableberg-negative-bg";break}case ke.POSITIVE:{s="tableberg-positive-bg";break}}return s};return i.jsx("div",{onClick:()=>{n&&t()},className:`tableberg-menu-button ${a()}`,"data-enabled":JSON.stringify(n),children:e})}/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const Ys={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},Ws={prefix:"fas",iconName:"right-long",icon:[512,512,["long-arrow-alt-right"],"f30b","M334.5 414c8.8 3.8 19 2 26-4.6l144-136c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 72L32 192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l288 0 0 72c0 9.6 5.7 18.2 14.5 22z"]};function $s({from:e,to:t,onCloseHandler:n,onOperationStart:r,reloadDelay:a=5e3}){const s={NOT_STARTED:"notStarted",STARTED:"started",FINISHED:"finished"},o={OK:"ok",ERROR:"error"},l=(S,j=o.OK)=>({type:j,message:S}),[u,f]=y.useState(s.NOT_STARTED),[m,c]=y.useState(a/1e3),[b,x]=y.useState(l("")),w=e>t,g=y.useRef(a),k=()=>{f(s.STARTED),r().then(({message:S})=>{x(l(S,o.OK))}).catch(({message:S})=>{x(l(S,o.ERROR))}).finally(()=>{f(s.FINISHED),_()})},_=()=>{const S=setInterval(()=>{g.current<=0?(window.location.reload(),clearInterval(S)):(g.current=g.current-1e3,c(g.current/1e3))},1e3)};return i.jsx("div",{className:"version-control-popup",children:i.jsxs("div",{className:"modal-container",children:[i.jsxs("div",{className:"rollback-versions",children:[i.jsx("div",{className:`version-id ${w?"tableberg-positive-color":"tableberg-negative-color"}`,children:e}),i.jsx("div",{className:"version-icon","data-in-progress":JSON.stringify(u===s.STARTED),children:i.jsx("div",{className:"version-icon-inner-wrapper",children:i.jsx(Se,{icon:Ws})})}),i.jsx("div",{className:`version-id ${w?"tableberg-negative-color":"tableberg-positive-color"}`,children:t})]}),u!==s.STARTED&&i.jsxs("div",{className:"version-content",children:[u===s.NOT_STARTED&&i.jsxs("div",{className:"version-warning",children:[i.jsx("div",{children:E("Older versions might be unstable. Do it on your own risk and create a backup.","tableberg")}),i.jsxs("div",{className:"version-rollback-button-container",children:[i.jsx(Xn,{type:ke.POSITIVE,onClickHandler:k,status:!0,title:"Start"}),i.jsx(Xn,{onClickHandler:n,status:!0,title:"Close"})]})]}),u===s.FINISHED&&i.jsxs("div",{className:"operation-finished-wrapper",children:[i.jsx("div",{className:"version-control-response","data-resp-type":b.type,children:b.message}),i.jsx("div",{children:m<=0?`${E("Reloading page now…","tableberg")}`:`${E("Reloading page in ","tableberg")} ${m}...`})]})]})]})})}function Zs({children:e,target:t}){return X.createPortal(e,t)}function Gs({currentVersion:e,availableVersions:t,onSelect:n}){const r=y.useMemo(()=>t.filter(a=>a!==e),[t]);return i.jsx("div",{className:"tableberg-header-version-info",children:i.jsxs("select",{value:e,onChange:a=>n(a.target.value),children:[i.jsx("option",{disabled:!0,value:e,children:e}),r.map(a=>i.jsx("option",{value:a,children:a},a))]})})}function Kn({pluginVersion:e,allVersions:t,onVersionRollBack:n}){const[r,a]=y.useState(e),[s,o]=y.useState(!1),l=y.useMemo(()=>t.sort().reverse(),[t]),u=m=>{a(m),o(!0)},f=()=>n(r);return i.jsxs("div",{className:"version-control-container",children:[i.jsx(Gs,{availableVersions:l,currentVersion:r,onSelect:u}),s&&i.jsx(Zs,{target:document.body,children:i.jsx($s,{onCloseHandler:()=>{a(e),o(!1)},from:e,to:r,onOperationStart:f})})]})}const Xs={path:null,title:"no_title",element:null};function Ks(e){const{path:t,title:n,element:r}={...Xs,...e};this.getPath=()=>t,this.getTitle=()=>n,this.getElement=()=>r??i.jsxs("div",{children:["no element defined for route [",this.getPath(),"]"]})}const qn=e=>e.map(t=>new Ks(t));function qs({title:e,targetPath:t,onClickHandler:n,isActive:r=!1}){const a=()=>n(t);return i.jsx("div",{"data-active":r,"data-path":t,className:"tableberg-menu-navigation-header-button",tabIndex:0,role:"button",onClick:a,onKeyDown:a,children:e})}function Jn({routes:e,currentRoutePath:t,setRoute:n}){const[r,a]=y.useState({});return y.useEffect(()=>{const s={gridTemplateColumns:`repeat(${e.length}, minmax(0,1fr))`};a(s)},[e]),i.jsx("div",{style:r,className:"tableberg-menu-navigation",children:e.map(s=>i.jsx(qs,{title:s.getTitle(),targetPath:s.getPath(),isActive:t===s.getPath(),onClickHandler:n},s.getPath()))})}function Js({children:e}){return i.jsx("div",{className:"tableberg-box-content-title",children:e})}function Qs({children:e}){return i.jsx("div",{className:"tableberg-box-content-inc",children:e})}const eo={VERTICAL:"vertical"},gt={JUMBO:"jumbo",NORMAL:"normal"},to={LEFT:"left"};function Qn({title:e=null,content:t=null,layout:n=eo.VERTICAL,size:r=gt.NORMAL,alignment:a=to.LEFT,children:s}){return i.jsxs("div",{className:"tableberg-box-content","data-layout":n,"data-size":r,"data-alignment":a,children:[i.jsxs("div",{className:"tableberg-box-content-title-inc-wrapper",children:[e&&i.jsx(Js,{children:e}),t&&i.jsx(Qs,{children:t})]}),s&&i.jsx("div",{className:"tableberg-box-content-footer",children:s})]})}function er(e){this.name="ContentNotFoundError",this.message=`Content not found for key: [${e}]`}er.prototype=Object.create(Error.prototype);const no=e=>tablebergAdminMenuData==null?void 0:tablebergAdminMenuData[e];function Ee(e){const[t,n]=y.useState(null),[r,a]=y.useState(null),[s,o]=y.useState({}),{contentId:l,...u}=e,f=no(l);return y.useEffect(()=>{if(f){const{title:m,content:c}=f;n(m),a(c),o(u)}else throw new er(l)},[]),i.jsx(Qn,{...s,title:t,content:r,children:e.children})}function ro({videoId:e,width:t=null,height:n=null}){const[r,a]=y.useState(null),s={width:"100",height:"100"};return y.useEffect(()=>{const o=`https://www.youtube.com/embed/${e}`;a(o)},[]),i.jsx("div",{className:"tableberg-youtube-embed",children:i.jsx("iframe",{width:t||s.width,height:n||s.height,src:r,title:"YouTube video player",allow:"picture-in-picture; web-share; fullscreen"})})}function tr(){this.name="ButtonLinkNoUrlError",this.message="No URL is provided for ButtonLink component."}tr.prototype=Object.create(Error.prototype);const Oe={DEFAULT:"default",PRIMARY:"primary"};function _e({title:e,url:t=null,onClickHandler:n=null,type:r=Oe.DEFAULT}){y.useEffect(()=>{if(!t&&!n)throw new tr},[]);const a=()=>{window.open(t,"_blank")},s=o=>{n&&typeof n=="function"?n(o):a()};return i.jsx("div",{className:"tableberg-button-link","data-buttonlink-type":r,onClick:s,role:"button",children:e})}function ao({proStatus:e=!1,children:t,invert:n=!0}){const[r,a]=y.useState(!1);return y.useEffect(()=>{a(n?!e:e)},[]),r&&t}const bt={proBuyUrl:"https://tableberg.com/pricing/",youtubeVideoId:"TKsL_bUVCTU",documentsUrl:"https://tableberg.com/docs/",supportUrl:"https://tableberg.com/contact/"};function je({children:e,assetIds:t=[]}){const n=a=>bt==null?void 0:bt[a],r=t.reduce((a,s)=>(a[s]=n(s),a),{});return e(r)}function nr(e){return i.jsx(je,{assetIds:["proBuyUrl"],children:({proBuyUrl:t})=>i.jsx(ao,{invert:!0,children:i.jsx(Ee,{size:gt.JUMBO,contentId:"upgrade",...e,children:i.jsx(_e,{url:t,title:"GET TABLEBERG PRO",type:Oe.PRIMARY})})})})}function so(){return i.jsx(je,{assetIds:["youtubeVideoId","documentsUrl","supportUrl","twitterUrl","facebookUrl","youtubeUrl"],children:({youtubeVideoId:e,documentsUrl:t,supportUrl:n,twitterUrl:r,facebookUrl:a,youtubeUrl:s})=>i.jsxs("div",{className:"tableberg-welcome-content",children:[i.jsxs("div",{className:"tableberg-welcome-content__main",children:[i.jsx(Ee,{size:gt.JUMBO,contentId:"welcome",children:i.jsx(ro,{height:315,videoId:e})}),!tablebergAdminMenuData.misc.pro_status&&i.jsx(nr,{})]}),i.jsxs("div",{className:"tableberg-welcome-content__right-sidebar",children:[i.jsx(Ee,{contentId:"documentation",children:i.jsx(_e,{url:t,title:E("Visit Documents","tableberg"),type:Oe.DEFAULT})}),i.jsx(Ee,{contentId:"support",children:i.jsx(_e,{url:n,title:E("Support Forum","tableberg"),type:Oe.DEFAULT})})]})]})})}const oo=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM10.8867 13.5671C10.6495 13.5035 10.5087 13.2598 10.5723 13.0226L12.3246 6.48302C12.3881 6.24585 12.6319 6.10511 12.8691 6.16866C13.1062 6.23221 13.247 6.47598 13.1834 6.71315L11.4311 13.2527C11.3676 13.4899 11.1238 13.6306 10.8867 13.5671ZM9.2624 12.9295C9.45766 13.1248 9.77424 13.1248 9.96951 12.9295C10.1648 12.7342 10.1648 12.4176 9.96951 12.2224L7.9686 10.2215C7.77333 10.0262 7.77333 9.70963 7.9686 9.51437L9.96951 7.51346C10.1648 7.3182 10.1648 7.00162 9.96951 6.80635C9.77424 6.61109 9.45766 6.61109 9.2624 6.80635L7.26149 8.80726C6.6757 9.39305 6.6757 10.3428 7.26149 10.9286L9.2624 12.9295ZM13.8853 6.8063C14.0805 6.61104 14.3971 6.61104 14.5924 6.8063L16.5933 8.80721C17.1791 9.393 17.1791 10.3427 16.5933 10.9285L14.5924 12.9294C14.3971 13.1247 14.0805 13.1247 13.8853 12.9294C13.69 12.7342 13.69 12.4176 13.8853 12.2223L15.8862 10.2214C16.0814 10.0262 16.0814 9.70958 15.8862 9.51432L13.8853 7.51341C13.69 7.31815 13.69 7.00157 13.8853 6.8063ZM7.478 15.2625H6.838V17.9465H7.478V16.8845H8.492V17.9465H9.138V15.2625H8.492V16.3205H7.478V15.2625ZM9.50056 15.2625V15.8165H10.2886V17.9465H10.9286V15.8165H11.7106V15.2625H9.50056ZM12.9884 15.2625H12.0724V17.9465H12.7124V16.166L13.3464 17.6965H13.7604L14.3624 16.2482V17.9465H15.0064V15.2625H14.1264L13.5574 16.6342L12.9884 15.2625ZM16.3257 17.3865V15.2625H15.6857V17.9465H17.3397V17.3865H16.3257Z",fill:"#671FEB"})]}),io=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{d:"M8.34675 8C8.15525 8 8 8.15525 8 8.34675C8 8.53826 8.15525 8.69351 8.34675 8.69351H11.1362C11.3277 8.69351 11.483 8.53826 11.483 8.34675C11.483 8.15525 11.3277 8 11.1362 8H8.34675Z",fill:"#671FEB"}),i.jsx("path",{d:"M8 9.73374C8 9.54224 8.15525 9.38699 8.34675 9.38699H11.1362C11.3277 9.38699 11.483 9.54224 11.483 9.73374C11.483 9.92525 11.3277 10.0805 11.1362 10.0805H8.34675C8.15525 10.0805 8 9.92525 8 9.73374Z",fill:"#671FEB"}),i.jsx("path",{d:"M8.34675 10.774C8.15525 10.774 8 10.9292 8 11.1207C8 11.3122 8.15525 11.4675 8.34675 11.4675H11.1362C11.3277 11.4675 11.483 11.3122 11.483 11.1207C11.483 10.9292 11.3277 10.774 11.1362 10.774H8.34675Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.04375 15.4838C7.95182 15.6493 8.00927 15.8584 8.17377 15.9534C8.25764 16.0018 8.35329 16.0113 8.43981 15.9875H11.0432C11.1297 16.0113 11.2254 16.0018 11.3092 15.9534C11.4388 15.8786 11.502 15.7328 11.478 15.5934C11.4692 15.528 11.4422 15.4683 11.4022 15.4196L10.0467 13.0717C9.98154 12.9589 9.86272 12.8965 9.74114 12.898C9.6198 12.8967 9.50133 12.9592 9.43633 13.0717L8.06292 15.4505C8.05594 15.4613 8.04954 15.4724 8.04375 15.4838ZM8.95647 15.2926L9.7415 13.9329L10.5265 15.2926H8.95647Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.478 8H16.0487V11.4674H12.478V8ZM13.078 8.6H15.4487V10.8674H13.078V8.6Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8V12.258C16.7171 12.1048 16.3932 12.0178 16.0489 12.0178C14.9502 12.0178 14.0584 12.9038 14.049 14.0002C12.9524 14.0096 12.0665 14.9014 12.0665 16.0001C12.0665 16.3644 12.1638 16.7059 12.3339 17H8C7.44772 17 7 16.5523 7 16V8ZM16.0489 13.0178C16.4931 13.0178 16.8696 13.3074 17 13.7081C17.0317 13.8056 17.0489 13.9097 17.0489 14.0178V15.0001H18.0309C18.5832 15.0001 19.0309 15.4479 19.0309 16.0001C19.0309 16.5524 18.5832 17.0001 18.0309 17.0001H17.0489V17.9823C17.0489 18.5346 16.6012 18.9823 16.0489 18.9823C15.4966 18.9823 15.0489 18.5346 15.0489 17.9823V17.0001H14.0665L14.0491 17C13.5048 16.9908 13.0665 16.5466 13.0665 16.0001C13.0665 15.4479 13.5142 15.0001 14.0665 15.0001H15.0489V14.0178C15.0489 13.4655 15.4966 13.0178 16.0489 13.0178Z",fill:"#671FEB"})]}),lo=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8ZM7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13ZM8 16C8 16.5523 7.55228 17 7 17C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15C7.55228 15 8 15.4477 8 16ZM11 7.5C10.7239 7.5 10.5 7.72386 10.5 8C10.5 8.27614 10.7239 8.5 11 8.5H17C17.2761 8.5 17.5 8.27614 17.5 8C17.5 7.72386 17.2761 7.5 17 7.5H11ZM10.5 12C10.5 11.7239 10.7239 11.5 11 11.5H17C17.2761 11.5 17.5 11.7239 17.5 12C17.5 12.2761 17.2761 12.5 17 12.5H11C10.7239 12.5 10.5 12.2761 10.5 12ZM11 15.5C10.7239 15.5 10.5 15.7239 10.5 16C10.5 16.2761 10.7239 16.5 11 16.5H17C17.2761 16.5 17.5 16.2761 17.5 16C17.5 15.7239 17.2761 15.5 17 15.5H11Z",fill:"#671feb"})]}),co=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM8 9.61388C11.1954 9.04964 12.9452 9.06689 16 9.61388V12.681C12.8757 12.2134 11.125 12.1847 8 12.681V9.61388ZM7.42857 11.7356H4L4 11.7356L6.28572 13.2692L4.00002 14.8027H9.71429V13.055C9.0129 13.105 8.26382 13.1765 7.42857 13.2694V11.7356ZM14.2857 13.0511V14.8028L20 14.8028L17.7143 13.2693L20 11.7358L20 11.7357H16.5714V13.2694C15.7384 13.1741 14.9903 13.1013 14.2857 13.0511Z",fill:"#671FEB"})]}),fo=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM12 5.66844L13.9749 9.95014L18.6574 10.5053L15.1955 13.7067L16.1145 18.3316L12 16.0284L7.88549 18.3316L8.80444 13.7067L5.34259 10.5053L10.025 9.95014L12 5.66844ZM12 8.1066V14.9191L9.29297 16.4386L9.89453 13.4035L7.61328 11.2863L10.6992 10.9269L12 8.1066Z",fill:"#671feb"})]});function rr(e){var t,n,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(n=rr(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function uo(){for(var e,t,n=0,r="",a=arguments.length;n<a;n++)(e=arguments[n])&&(t=rr(e))&&(r&&(r+=" "),r+=t);return r}const Pe=e=>y.createElement("path",e),ce=y.forwardRef(({className:e,isPressed:t,...n},r)=>{const a={...n,className:uo(e,{"is-pressed":t})||void 0,"aria-hidden":!0,focusable:!1};return y.createElement("svg",{...a,ref:r})});ce.displayName="SVG";const mo=y.createElement(ce,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},y.createElement(Pe,{d:"M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"})),po=y.createElement(ce,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},y.createElement(Pe,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"})),ho=y.createElement(ce,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},y.createElement(Pe,{d:"M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"})),go=[{name:"core/paragraph",title:"Paragraph",icon:y.createElement(ce,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},y.createElement(Pe,{d:"m9.99609 14v-.2251l.00391.0001v6.225h1.5v-14.5h2.5v14.5h1.5v-14.5h3v-1.5h-8.50391c-2.76142 0-5 2.23858-5 5 0 2.7614 2.23858 5 5 5z"})),isPro:!1},{name:"core/list",title:"List",icon:ho,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-a-list-to-a-table-in-wordpress/"},{name:"tableberg/button",title:"Button",icon:mo,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-buttons-to-wordpress-tables/"},{name:"tableberg/image",title:"Image",icon:po,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-images-to-a-table-in-wordpress/"},{name:"tableberg/styled-list",title:"Styled List",icon:lo,isPro:!0,image:"styled_list_block_1.png",upsellText:"Elevate your lists with customizable icons as bullets for a polished look.",demoUrl:"https://tableberg.com/docs/how-to-add-styled-lists-in-wordpress-tables/"},{name:"tableberg/ribbon",title:"Ribbon",icon:co,isPro:!0,image:"ribbon_block_1.png",upsellText:"Overlay a decorative ribbon on your table, ideal for highlighting special offers or important notices.",demoUrl:"https://tableberg.com/docs/how-to-add-ribbons-to-wordpress-tables/"},{name:"tableberg/html",title:"Custom Html",icon:oo,isPro:!0,image:"html_block_1.png",upsellText:"Add your own HTML code to create specialized content and integrate custom elements.",demoUrl:"https://tableberg.com/docs/how-to-add-custom-html-to-wordpress-tables/"},{name:"tableberg/icon",title:"Icon",icon:io,isPro:!0,image:"icon_block_1.png",upsellText:"Add scalable icons to your tables to support text and enhance user engagement.",demoUrl:"https://tableberg.com/docs/how-to-add-icons-to-wordpress-tables/"},{name:"tableberg/star-rating",title:"Star Rating",icon:fo,isPro:!0,image:"star_rating_block_1.png",upsellText:"Add customizable star ratings, perfect for reviews and comparison tables.",demoUrl:"https://tableberg.com/docs/how-to-add-star-rating-in-wordpress/"}];function bo({title:e,name:t,iconElement:n,isPro:r,isProPlugin:a,showUpsell:s,demoUrl:o=null}){return i.jsx("div",{className:"tableberg-block-control","data-enabled":JSON.stringify(a?!0:!r),children:i.jsxs("div",{className:"tableberg-block-title",children:[i.jsxs("div",{className:"tableberg-block-title-left-container","data-demo":o!==null,children:[i.jsx("div",{className:"tableberg-title-icon",children:n}),i.jsxs("div",{className:"tableberg-title-text",children:[e,r&&i.jsx("span",{className:"tableberg-pro-block-card-title-suffix",children:"PRO"})]}),o&&i.jsx("div",{className:"tableberg-title-demo",children:i.jsx("a",{href:o,target:"_blank",rel:"noreferrer",className:"tableberg-strip-anchor-styles",children:E("See Documentation","tableberg")})})]}),r&&!a&&i.jsx("div",{className:"tableberg-block-title-right-container",children:i.jsx("div",{role:"button",className:"tableberg-pro-block-card-info-button",onClick:l=>{l.preventDefault(),s(t)},children:i.jsx(Se,{icon:Ys})})})]})})}function yo({info:e,onClose:t}){return i.jsxs("div",{className:"tableberg-upsell-modal",children:[i.jsx("div",{className:"tableberg-upsell-modal-backdrop"}),i.jsx("div",{className:"tableberg-upsell-modal-container",children:i.jsxs("div",{className:"tableberg-upsell-modal-area",children:[i.jsxs("h2",{children:[e.icon," ",e.title]}),i.jsxs("div",{className:"tableberg-upsell-modal-content",children:[i.jsx("img",{src:TABLEBERG_CFG.plugin_url+"includes/Admin/images/upsell/"+e.image,alt:e.title+" Demo"}),i.jsx("p",{children:e.upsellText}),i.jsxs("p",{children:["Limited Time: Use code ",i.jsx("b",{children:"TB20"})," to get a 20% discount."]})]}),i.jsxs("div",{className:"tableberg-upsell-modal-footer",children:[i.jsx("button",{onClick:t,children:"Cancel"}),i.jsx(je,{assetIds:["proBuyUrl"],children:({proBuyUrl:n})=>i.jsx("a",{href:n,children:"Buy PRO"})})]})]})})]})}function vo(){const[e,t]=y.useState(null);return i.jsxs("div",{style:{display:"flex",flexFlow:"column",gap:"30px"},children:[i.jsx("div",{className:"tableberg-controls-container controls-container","data-show-info":"false",children:go.map(n=>{const{title:r,name:a,icon:s,isPro:o,demoUrl:l}=n;return i.jsx(bo,{name:a,title:r,iconElement:s,isPro:o,showUpsell:()=>t(n),isProPlugin:tablebergAdminMenuData.misc.pro_status,demoUrl:l},a)})}),!tablebergAdminMenuData.misc.pro_status&&i.jsx(nr,{}),e&&i.jsx(yo,{info:e,onClose:()=>t(null)})]})}const xo=async e=>{var u;const t=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings;if(!((u=t==null?void 0:t.ajax)!=null&&u.testConnection))throw new Error("AI settings not available");const{url:n,action:r,nonce:a}=t.ajax.testConnection,s=new FormData;return s.append("api_key",e),s.append("action",r),s.append("_wpnonce",a),await(await fetch(n,{method:"POST",body:s})).json()},wo=async e=>{var u;const t=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings;if(!((u=t==null?void 0:t.ajax)!=null&&u.saveSettings))throw new Error("AI settings not available");const{url:n,action:r,nonce:a}=t.ajax.saveSettings,s=new FormData;return s.append("settings",JSON.stringify(e)),s.append("action",r),s.append("_wpnonce",a),await(await fetch(n,{method:"POST",body:s})).json()};function Ao({apiKey:e="",onSettingsChange:t}){const[n,r]=y.useState(e),[a,s]=y.useState(!1),[o,l]=y.useState(!1),[u,f]=y.useState(null),[m,c]=y.useState(!1),b=async()=>{if(!n){f({success:!1,message:E("Please enter an API key","tableberg")});return}l(!0),f(null);try{const w=await xo(n);f({success:w.success,message:w.message||(w.success?E("Connection successful!","tableberg"):E("Connection failed. Please check your API key.","tableberg"))})}catch{f({success:!1,message:E("Error testing connection. Please try again.","tableberg")})}finally{l(!1)}},x=async()=>{c(!0);try{await wo({api_key:n}),t&&t({api_key:n})}catch{}finally{c(!1)}};return i.jsx("div",{className:"tableberg-ai-table-settings tableberg-settings-card",children:i.jsx(Qn,{title:E("AI Table Settings","tableberg"),content:E("Configure your OpenAI API key to enable AI-powered table generation. This feature is available for Pro users only.","tableberg"),children:i.jsxs("div",{className:"tableberg-ai-settings-content",children:[i.jsxs("div",{className:"tableberg-api-key-field",children:[i.jsx("label",{htmlFor:"ai-api-key",children:E("OpenAI API Key","tableberg")}),i.jsxs("div",{className:"tableberg-api-key-input-wrapper",children:[i.jsx("input",{id:"ai-api-key",type:a?"text":"password",value:n,onChange:w=>r(w.target.value),placeholder:E("sk-…","tableberg"),className:"tableberg-api-key-input"}),i.jsx("button",{type:"button",onClick:()=>s(!a),className:"tableberg-toggle-visibility",children:E(a?"Hide":"Show","tableberg")})]}),i.jsxs("p",{className:"tableberg-help-text",children:[E("Get your API key from","tableberg")," ",i.jsx("a",{href:"https://platform.openai.com/api-keys",target:"_blank",rel:"noopener noreferrer",children:E("OpenAI Dashboard","tableberg")})]})]}),u&&i.jsx("div",{className:`tableberg-test-status ${u.success?"success":"error"}`,children:u.message}),i.jsxs("div",{className:"tableberg-ai-settings-actions",children:[i.jsx("button",{type:"button",onClick:b,disabled:o||!n,className:"tableberg-button tableberg-button-secondary",children:E(o?"Testing…":"Test Connection","tableberg")}),i.jsx("button",{type:"button",onClick:x,disabled:m,className:"tableberg-button tableberg-button-primary",children:E(m?"Saving…":"Save Settings","tableberg")})]})]})})})}function Co(){const e=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings,t=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.is_pro;return i.jsx("div",{className:"tableberg-settings-content",children:t?i.jsx(Ao,{apiKey:(e==null?void 0:e.api_key)||"",onSettingsChange:n=>{}}):i.jsxs("div",{className:"tableberg-pro-notice",children:[i.jsx("h3",{children:E("AI Table Settings","tableberg")}),i.jsx("p",{children:E("AI Table features are available in Tableberg Pro. Upgrade to unlock AI-powered table generation.","tableberg")}),i.jsx("a",{href:"https://tableberg.com/pricing",target:"_blank",rel:"noopener noreferrer",className:"tableberg-button tableberg-button-primary",children:E("Upgrade to Pro","tableberg")})]})})}const ar=[{path:"welcome",title:"Welcome",element:i.jsx(so,{})},{path:"blocks",title:"Blocks",element:i.jsx(vo,{})},{path:"settings",title:"Settings",element:i.jsx(Co,{})},{path:"404",title:"404",element:i.jsx("div",{children:"404"})}],sr=qn(ar);function So({currentRoutePath:e,setCurrentRoutePath:t}){y.useEffect(()=>{const o=new URL(window.location.href);o.searchParams.set("route",e),window.history.pushState(null,null,o.href)},[e]);const n=y.useMemo(()=>sr.slice(0,sr.length-1),[]),r=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.assets.logo,a=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.versionControl,s=o=>{const{url:l,action:u,nonce:f}=a.ajax.versionRollback,m=new FormData;return m.append("action",u),m.append("nonce",f),m.append("version",o),fetch(l,{method:"POST",body:m}).then(c=>c.json()).then(c=>{if(c.error)throw new Error(c.error);return c})};return i.jsxs("div",{className:"header-wrapper",children:[i.jsxs("div",{className:"menu-header",children:[i.jsx("div",{className:"left-container",children:i.jsxs("div",{className:"logo-container",children:[i.jsx("img",{alt:"plugin logo",src:r}),i.jsx("div",{className:"tableberg-plugin-logo-text",children:"Tableberg"})]})}),i.jsx("div",{className:"tableberg-menu-navigation-wrapper",children:i.jsx(Jn,{routes:n,currentRoutePath:e,setRoute:t})}),i.jsxs("div",{className:"right-container",children:[i.jsx(It,{children:i.jsx("div",{className:"version-control-header-wrapper",children:i.jsx(Kn,{pluginVersion:a.currentVersion,allVersions:a.versions,onVersionRollBack:s})})}),!tablebergAdminMenuData.misc.pro_status&&i.jsx(It,{children:i.jsx(je,{assetIds:["proBuyUrl"],children:({proBuyUrl:o})=>i.jsx(_e,{url:o,title:"Upgrade to PRO"})})})]})]}),i.jsx("div",{className:"dropdown-navigation",children:i.jsxs("div",{className:"dropdown-drawer",children:[i.jsx(Jn,{routes:n,currentRoutePath:e,setRoute:t}),i.jsx("div",{className:"hamburger-version-control",children:i.jsx(Kn,{pluginVersion:a.currentVersion,allVersions:a.versions})})]})})]})}function or({routes:e,currentRoutePath:t}){const[n,r]=y.useState(null);return y.useEffect(()=>{const a=e.find(s=>s.getPath()===t);if(a)r(a.getElement());else{const s=e[e.length-1];r(s.getElement())}},[t,e]),i.jsx("div",{className:"tableberg-router-content-wrapper","data-route-path":t,children:n},t)}function ir(){this.name="NoRouterComponentFoundError",this.message="No router component found within RouterProvider. Please make sure you have passed Router component as a child of RouterProvider."}ir.prototype=Error.prototype;function ko({children:e,currentRoutePath:t,setCurrentRoutePath:n}){const r=y.useMemo(()=>{const o=(e==null?void 0:e.type)===or?e.type:null;if(o===null)throw new ir;return o},[t]),a=y.useMemo(()=>qn(ar),[]),s=()=>{const l=new URL(window.location.href).searchParams.get("route");l&&n(l)};return y.useEffect(()=>{window.addEventListener("popstate",s)},[]),y.useEffect(()=>{s()},[]),y.useEffect(()=>{const o=new URL(window.location.href);o.searchParams.set("route",t),window.history.pushState(null,null,o.href)},[t]),i.jsx(r,{routes:a,currentRoutePath:t})}function Eo({currentRoutePath:e,setCurrentRoutePath:t}){return i.jsx(ko,{currentRoutePath:e,setCurrentRoutePath:t,children:i.jsx(or,{})})}function Oo(){const t=new URL(window.location.href).searchParams.get("route"),[n,r]=y.useState(t??"welcome");return i.jsxs("div",{className:"tableberg-admin-menu-container",children:[i.jsx(So,{currentRoutePath:n,setCurrentRoutePath:r}),i.jsx(Eo,{currentRoutePath:n,setCurrentRoutePath:r})]})}function _o({children:e}){return y.useEffect(()=>{const t=document.querySelector("#wpcontent"),n=document.querySelector("#wpbody"),r=document.querySelector("#wpadminbar");if(n){const a=r?r.offsetHeight:0;n.style.height=`calc( 100vh - ${a}px)`,t.style.padding=0}},[]),i.jsx("div",{className:"tableberg-admin-menu-wrapper",children:e})}const lr=document.querySelector("#tableberg-admin-menu");lr&&X.createRoot(lr).render(i.jsx(_o,{children:i.jsx(Oo,{})}))});

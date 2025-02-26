(function(v,G){typeof exports=="object"&&typeof module<"u"?G(require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["react","react-dom"],G):(v=typeof globalThis<"u"?globalThis:v||self,G(v.React,v.ReactDOM))})(this,function(v,G){"use strict";function lr(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ye={exports:{}},ft={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cr=v,fr=Symbol.for("react.element"),ur=Symbol.for("react.fragment"),dr=Object.prototype.hasOwnProperty,mr=cr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,pr={key:!0,ref:!0,__self:!0,__source:!0};function ve(t,e,n){var r,a={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)dr.call(e,r)&&!pr.hasOwnProperty(r)&&(a[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)a[r]===void 0&&(a[r]=e[r]);return{$$typeof:fr,type:t,key:s,ref:o,props:a,_owner:mr.current}}ft.Fragment=ur,ft.jsx=ve,ft.jsxs=ve,ye.exports=ft;var l=ye.exports,hr={};(function(t){(function(){var e={not_string:/[^s]/,not_bool:/[^t]/,not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/[bcdiefguxX]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[+-]/};function n(i){return a(o(i),arguments)}function r(i,u){return n.apply(null,[i].concat(u||[]))}function a(i,u){var f=1,m=i.length,c,b="",x,A,g,S,O,E,_,p;for(x=0;x<m;x++)if(typeof i[x]=="string")b+=i[x];else if(typeof i[x]=="object"){if(g=i[x],g.keys)for(c=u[f],A=0;A<g.keys.length;A++){if(c==null)throw new Error(n('[sprintf] Cannot access property "%s" of undefined value "%s"',g.keys[A],g.keys[A-1]));c=c[g.keys[A]]}else g.param_no?c=u[g.param_no]:c=u[f++];if(e.not_type.test(g.type)&&e.not_primitive.test(g.type)&&c instanceof Function&&(c=c()),e.numeric_arg.test(g.type)&&typeof c!="number"&&isNaN(c))throw new TypeError(n("[sprintf] expecting number but found %T",c));switch(e.number.test(g.type)&&(_=c>=0),g.type){case"b":c=parseInt(c,10).toString(2);break;case"c":c=String.fromCharCode(parseInt(c,10));break;case"d":case"i":c=parseInt(c,10);break;case"j":c=JSON.stringify(c,null,g.width?parseInt(g.width):0);break;case"e":c=g.precision?parseFloat(c).toExponential(g.precision):parseFloat(c).toExponential();break;case"f":c=g.precision?parseFloat(c).toFixed(g.precision):parseFloat(c);break;case"g":c=g.precision?String(Number(c.toPrecision(g.precision))):parseFloat(c);break;case"o":c=(parseInt(c,10)>>>0).toString(8);break;case"s":c=String(c),c=g.precision?c.substring(0,g.precision):c;break;case"t":c=String(!!c),c=g.precision?c.substring(0,g.precision):c;break;case"T":c=Object.prototype.toString.call(c).slice(8,-1).toLowerCase(),c=g.precision?c.substring(0,g.precision):c;break;case"u":c=parseInt(c,10)>>>0;break;case"v":c=c.valueOf(),c=g.precision?c.substring(0,g.precision):c;break;case"x":c=(parseInt(c,10)>>>0).toString(16);break;case"X":c=(parseInt(c,10)>>>0).toString(16).toUpperCase();break}e.json.test(g.type)?b+=c:(e.number.test(g.type)&&(!_||g.sign)?(p=_?"+":"-",c=c.toString().replace(e.sign,"")):p="",O=g.pad_char?g.pad_char==="0"?"0":g.pad_char.charAt(1):" ",E=g.width-(p+c).length,S=g.width&&E>0?O.repeat(E):"",b+=g.align?p+c+S:O==="0"?p+S+c:S+p+c)}return b}var s=Object.create(null);function o(i){if(s[i])return s[i];for(var u=i,f,m=[],c=0;u;){if((f=e.text.exec(u))!==null)m.push(f[0]);else if((f=e.modulo.exec(u))!==null)m.push("%");else if((f=e.placeholder.exec(u))!==null){if(f[2]){c|=1;var b=[],x=f[2],A=[];if((A=e.key.exec(x))!==null)for(b.push(A[1]);(x=x.substring(A[0].length))!=="";)if((A=e.key_access.exec(x))!==null)b.push(A[1]);else if((A=e.index_access.exec(x))!==null)b.push(A[1]);else throw new SyntaxError("[sprintf] failed to parse named argument key");else throw new SyntaxError("[sprintf] failed to parse named argument key");f[2]=b}else c|=2;if(c===3)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");m.push({placeholder:f[0],param_no:f[1],keys:f[2],sign:f[3],pad_char:f[4],align:f[5],width:f[6],precision:f[7],type:f[8]})}else throw new SyntaxError("[sprintf] unexpected placeholder");u=u.substring(f[0].length)}return s[i]=m}t.sprintf=n,t.vsprintf=r,typeof window<"u"&&(window.sprintf=n,window.vsprintf=r)})()})(hr);var Tt,xe,et,we;Tt={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1},xe=["(","?"],et={")":["("],":":["?","?:"]},we=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;function gr(t){for(var e=[],n=[],r,a,s,o;r=t.match(we);){for(a=r[0],s=t.substr(0,r.index).trim(),s&&e.push(s);o=n.pop();){if(et[a]){if(et[a][0]===o){a=et[a][1]||a;break}}else if(xe.indexOf(o)>=0||Tt[o]<Tt[a]){n.push(o);break}e.push(o)}et[a]||n.push(a),t=t.substr(r.index+a.length)}return t=t.trim(),t&&e.push(t),e.concat(n.reverse())}var br={"!":function(t){return!t},"*":function(t,e){return t*e},"/":function(t,e){return t/e},"%":function(t,e){return t%e},"+":function(t,e){return t+e},"-":function(t,e){return t-e},"<":function(t,e){return t<e},"<=":function(t,e){return t<=e},">":function(t,e){return t>e},">=":function(t,e){return t>=e},"==":function(t,e){return t===e},"!=":function(t,e){return t!==e},"&&":function(t,e){return t&&e},"||":function(t,e){return t||e},"?:":function(t,e,n){if(t)throw e;return n}};function yr(t,e){var n=[],r,a,s,o,i,u;for(r=0;r<t.length;r++){if(i=t[r],o=br[i],o){for(a=o.length,s=Array(a);a--;)s[a]=n.pop();try{u=o.apply(null,s)}catch(f){return f}}else e.hasOwnProperty(i)?u=e[i]:u=+i;n.push(u)}return n[0]}function vr(t){var e=gr(t);return function(n){return yr(e,n)}}function xr(t){var e=vr(t);return function(n){return+e({n})}}var Ce={contextDelimiter:"",onMissingKey:null};function wr(t){var e,n,r;for(e=t.split(";"),n=0;n<e.length;n++)if(r=e[n].trim(),r.indexOf("plural=")===0)return r.substr(7)}function It(t,e){var n;this.data=t,this.pluralForms={},this.options={};for(n in Ce)this.options[n]=e!==void 0&&n in e?e[n]:Ce[n]}It.prototype.getPluralForm=function(t,e){var n=this.pluralForms[t],r,a,s;return n||(r=this.data[t][""],s=r["Plural-Forms"]||r["plural-forms"]||r.plural_forms,typeof s!="function"&&(a=wr(r["Plural-Forms"]||r["plural-forms"]||r.plural_forms),s=xr(a)),n=this.pluralForms[t]=s),n(e)},It.prototype.dcnpgettext=function(t,e,n,r,a){var s,o,i;return a===void 0?s=0:s=this.getPluralForm(t,a),o=n,e&&(o=e+this.options.contextDelimiter+n),i=this.data[t][o],i&&i[s]?i[s]:(this.options.onMissingKey&&this.options.onMissingKey(n,t),s===0?n:r)};const Ae={"":{plural_forms(t){return t===1?0:1}}},Cr=/^i18n\.(n?gettext|has_translation)(_|$)/,Ar=(t,e,n)=>{const r=new It({}),a=new Set,s=()=>{a.forEach(p=>p())},o=p=>(a.add(p),()=>a.delete(p)),i=(p="default")=>r.data[p],u=(p,y="default")=>{var C;r.data[y]={...r.data[y],...p},r.data[y][""]={...Ae[""],...(C=r.data[y])==null?void 0:C[""]},delete r.pluralForms[y]},f=(p,y)=>{u(p,y),s()},m=(p,y="default")=>{var C;r.data[y]={...r.data[y],...p,"":{...Ae[""],...(C=r.data[y])==null?void 0:C[""],...p==null?void 0:p[""]}},delete r.pluralForms[y],s()},c=(p,y)=>{r.data={},r.pluralForms={},f(p,y)},b=(p="default",y,C,P,T)=>(r.data[p]||u(void 0,p),r.dcnpgettext(p,y,C,P,T)),x=(p="default")=>p,A=(p,y)=>{let C=b(y,void 0,p);return n?(C=n.applyFilters("i18n.gettext",C,p,y),n.applyFilters("i18n.gettext_"+x(y),C,p,y)):C},g=(p,y,C)=>{let P=b(C,y,p);return n?(P=n.applyFilters("i18n.gettext_with_context",P,p,y,C),n.applyFilters("i18n.gettext_with_context_"+x(C),P,p,y,C)):P},S=(p,y,C,P)=>{let T=b(P,void 0,p,y,C);return n?(T=n.applyFilters("i18n.ngettext",T,p,y,C,P),n.applyFilters("i18n.ngettext_"+x(P),T,p,y,C,P)):T},O=(p,y,C,P,T)=>{let Z=b(T,P,p,y,C);return n?(Z=n.applyFilters("i18n.ngettext_with_context",Z,p,y,C,P,T),n.applyFilters("i18n.ngettext_with_context_"+x(T),Z,p,y,C,P,T)):Z},E=()=>g("ltr","text direction")==="rtl",_=(p,y,C)=>{var Z,ir;const P=y?y+""+p:p;let T=!!((ir=(Z=r.data)==null?void 0:Z[C??"default"])!=null&&ir[P]);return n&&(T=n.applyFilters("i18n.has_translation",T,p,y,C),T=n.applyFilters("i18n.has_translation_"+x(C),T,p,y,C)),T};if(n){const p=y=>{Cr.test(y)&&s()};n.addAction("hookAdded","core/i18n",p),n.addAction("hookRemoved","core/i18n",p)}return{getLocaleData:i,setLocaleData:f,addLocaleData:m,resetLocaleData:c,subscribe:o,__:A,_x:g,_n:S,_nx:O,isRTL:E,hasTranslation:_}};function Ee(t){return typeof t!="string"||t===""?(console.error("The namespace must be a non-empty string."),!1):/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(t)?!0:(console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes."),!1)}function Nt(t){return typeof t!="string"||t===""?(console.error("The hook name must be a non-empty string."),!1):/^__/.test(t)?(console.error("The hook name cannot begin with `__`."),!1):/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(t)?!0:(console.error("The hook name can only contain numbers, letters, dashes, periods and underscores."),!1)}function Se(t,e){return function(r,a,s,o=10){const i=t[e];if(!Nt(r)||!Ee(a))return;if(typeof s!="function"){console.error("The hook callback must be a function.");return}if(typeof o!="number"){console.error("If specified, the hook priority must be a number.");return}const u={callback:s,priority:o,namespace:a};if(i[r]){const f=i[r].handlers;let m;for(m=f.length;m>0&&!(o>=f[m-1].priority);m--);m===f.length?f[m]=u:f.splice(m,0,u),i.__current.forEach(c=>{c.name===r&&c.currentIndex>=m&&c.currentIndex++})}else i[r]={handlers:[u],runs:0};r!=="hookAdded"&&t.doAction("hookAdded",r,a,s,o)}}function ut(t,e,n=!1){return function(a,s){const o=t[e];if(!Nt(a)||!n&&!Ee(s))return;if(!o[a])return 0;let i=0;if(n)i=o[a].handlers.length,o[a]={runs:o[a].runs,handlers:[]};else{const u=o[a].handlers;for(let f=u.length-1;f>=0;f--)u[f].namespace===s&&(u.splice(f,1),i++,o.__current.forEach(m=>{m.name===a&&m.currentIndex>=f&&m.currentIndex--}))}return a!=="hookRemoved"&&t.doAction("hookRemoved",a,s),i}}function ke(t,e){return function(r,a){const s=t[e];return typeof a<"u"?r in s&&s[r].handlers.some(o=>o.namespace===a):r in s}}function Oe(t,e,n=!1){return function(a,...s){const o=t[e];o[a]||(o[a]={handlers:[],runs:0}),o[a].runs++;const i=o[a].handlers;if(!i||!i.length)return n?s[0]:void 0;const u={name:a,currentIndex:0};for(o.__current.push(u);u.currentIndex<i.length;){const m=i[u.currentIndex].callback.apply(null,s);n&&(s[0]=m),u.currentIndex++}if(o.__current.pop(),n)return s[0]}}function _e(t,e){return function(){var s;var r;const a=t[e];return(r=(s=a.__current[a.__current.length-1])==null?void 0:s.name)!==null&&r!==void 0?r:null}}function Pe(t,e){return function(r){const a=t[e];return typeof r>"u"?typeof a.__current[0]<"u":a.__current[0]?r===a.__current[0].name:!1}}function je(t,e){return function(r){const a=t[e];if(Nt(r))return a[r]&&a[r].runs?a[r].runs:0}}class Er{constructor(){this.actions=Object.create(null),this.actions.__current=[],this.filters=Object.create(null),this.filters.__current=[],this.addAction=Se(this,"actions"),this.addFilter=Se(this,"filters"),this.removeAction=ut(this,"actions"),this.removeFilter=ut(this,"filters"),this.hasAction=ke(this,"actions"),this.hasFilter=ke(this,"filters"),this.removeAllActions=ut(this,"actions",!0),this.removeAllFilters=ut(this,"filters",!0),this.doAction=Oe(this,"actions"),this.applyFilters=Oe(this,"filters",!0),this.currentAction=_e(this,"actions"),this.currentFilter=_e(this,"filters"),this.doingAction=Pe(this,"actions"),this.doingFilter=Pe(this,"filters"),this.didAction=je(this,"actions"),this.didFilter=je(this,"filters")}}function Sr(){return new Er}const kr=Sr(),j=Ar(void 0,void 0,kr);j.getLocaleData.bind(j),j.setLocaleData.bind(j),j.resetLocaleData.bind(j),j.subscribe.bind(j);const X=j.__.bind(j);j._x.bind(j),j._n.bind(j),j._nx.bind(j),j.isRTL.bind(j),j.hasTranslation.bind(j);function Te({children:t,classNames:e=[]}){return l.jsx("div",{className:["right-container-item",...e].join(" "),children:t})}/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function Or(t,e,n){return(e=Pr(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Ie(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Ie(Object(n),!0).forEach(function(r){Or(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Ie(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function _r(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Pr(t){var e=_r(t,"string");return typeof e=="symbol"?e:e+""}const Ne=()=>{};let Ft={},Fe={},Le=null,Me={mark:Ne,measure:Ne};try{typeof window<"u"&&(Ft=window),typeof document<"u"&&(Fe=document),typeof MutationObserver<"u"&&(Le=MutationObserver),typeof performance<"u"&&(Me=performance)}catch{}const{userAgent:Re=""}=Ft.navigator||{},z=Ft,k=Fe,De=Le,dt=Me;z.document;const R=!!k.documentElement&&!!k.head&&typeof k.addEventListener=="function"&&typeof k.createElement=="function",He=~Re.indexOf("MSIE")||~Re.indexOf("Trident/");var jr=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Tr=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,ze={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},Ir={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Ve=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],I="classic",mt="duotone",Nr="sharp",Fr="sharp-duotone",Ue=[I,mt,Nr,Fr],Lr={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},Mr={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},Rr=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),Dr={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},Hr=["fak","fa-kit","fakd","fa-kit-duotone"],Be={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},zr=["kit"],Vr={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},Ur=["fak","fakd"],Br={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},Ye={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},pt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Yr=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],Wr=["fak","fa-kit","fakd","fa-kit-duotone"],$r={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Zr={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},Gr={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},Lt={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},Xr=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Mt=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...Yr,...Xr],Kr=["solid","regular","light","thin","duotone","brands"],We=[1,2,3,4,5,6,7,8,9,10],qr=We.concat([11,12,13,14,15,16,17,18,19,20]),Jr=[...Object.keys(Gr),...Kr,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",pt.GROUP,pt.SWAP_OPACITY,pt.PRIMARY,pt.SECONDARY].concat(We.map(t=>"".concat(t,"x"))).concat(qr.map(t=>"w-".concat(t))),Qr={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const D="___FONT_AWESOME___",Rt=16,$e="fa",Ze="svg-inline--fa",Y="data-fa-i2svg",Dt="data-fa-pseudo-element",ta="data-fa-pseudo-element-pending",Ht="data-prefix",zt="data-icon",Ge="fontawesome-i2svg",ea="async",na=["HTML","HEAD","STYLE","SCRIPT"],Xe=(()=>{try{return!0}catch{return!1}})();function nt(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[I]}})}const Ke=d({},ze);Ke[I]=d(d(d(d({},{"fa-duotone":"duotone"}),ze[I]),Be.kit),Be["kit-duotone"]);const ra=nt(Ke),Vt=d({},Dr);Vt[I]=d(d(d(d({},{duotone:"fad"}),Vt[I]),Ye.kit),Ye["kit-duotone"]);const qe=nt(Vt),Ut=d({},Lt);Ut[I]=d(d({},Ut[I]),Br.kit);const Bt=nt(Ut),Yt=d({},Zr);Yt[I]=d(d({},Yt[I]),Vr.kit),nt(Yt);const aa=jr,Je="fa-layers-text",sa=Tr,oa=d({},Lr);nt(oa);const ia=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Wt=Ir,la=[...zr,...Jr],rt=z.FontAwesomeConfig||{};function ca(t){var e=k.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function fa(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}k&&typeof k.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,r]=e;const a=fa(ca(n));a!=null&&(rt[r]=a)});const Qe={styleDefault:"solid",familyDefault:I,cssPrefix:$e,replacementClass:Ze,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};rt.familyPrefix&&(rt.cssPrefix=rt.familyPrefix);const K=d(d({},Qe),rt);K.autoReplaceSvg||(K.observeMutations=!1);const h={};Object.keys(Qe).forEach(t=>{Object.defineProperty(h,t,{enumerable:!0,set:function(e){K[t]=e,at.forEach(n=>n(h))},get:function(){return K[t]}})}),Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(t){K.cssPrefix=t,at.forEach(e=>e(h))},get:function(){return K.cssPrefix}}),z.FontAwesomeConfig=h;const at=[];function ua(t){return at.push(t),()=>{at.splice(at.indexOf(t),1)}}const V=Rt,F={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function da(t){if(!t||!R)return;const e=k.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=k.head.childNodes;let r=null;for(let a=n.length-1;a>-1;a--){const s=n[a],o=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(r=s)}return k.head.insertBefore(e,r),t}const ma="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function st(){let t=12,e="";for(;t-- >0;)e+=ma[Math.random()*62|0];return e}function q(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function $t(t){return t.classList?q(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function tn(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function pa(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(tn(t[n]),'" '),"").trim()}function ht(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Zt(t){return t.size!==F.size||t.x!==F.x||t.y!==F.y||t.rotate!==F.rotate||t.flipX||t.flipY}function ha(t){let{transform:e,containerWidth:n,iconWidth:r}=t;const a={transform:"translate(".concat(n/2," 256)")},s="translate(".concat(e.x*32,", ").concat(e.y*32,") "),o="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),i="rotate(".concat(e.rotate," 0 0)"),u={transform:"".concat(s," ").concat(o," ").concat(i)},f={transform:"translate(".concat(r/2*-1," -256)")};return{outer:a,inner:u,path:f}}function ga(t){let{transform:e,width:n=Rt,height:r=Rt,startCentered:a=!1}=t,s="";return a&&He?s+="translate(".concat(e.x/V-n/2,"em, ").concat(e.y/V-r/2,"em) "):a?s+="translate(calc(-50% + ".concat(e.x/V,"em), calc(-50% + ").concat(e.y/V,"em)) "):s+="translate(".concat(e.x/V,"em, ").concat(e.y/V,"em) "),s+="scale(".concat(e.size/V*(e.flipX?-1:1),", ").concat(e.size/V*(e.flipY?-1:1),") "),s+="rotate(".concat(e.rotate,"deg) "),s}var ba=`:root, :host {
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
}`;function en(){const t=$e,e=Ze,n=h.cssPrefix,r=h.replacementClass;let a=ba;if(n!==t||r!==e){const s=new RegExp("\\.".concat(t,"\\-"),"g"),o=new RegExp("\\--".concat(t,"\\-"),"g"),i=new RegExp("\\.".concat(e),"g");a=a.replace(s,".".concat(n,"-")).replace(o,"--".concat(n,"-")).replace(i,".".concat(r))}return a}let nn=!1;function Gt(){h.autoAddCss&&!nn&&(da(en()),nn=!0)}var ya={mixout(){return{dom:{css:en,insertCss:Gt}}},hooks(){return{beforeDOMElementCreation(){Gt()},beforeI2svg(){Gt()}}}};const H=z||{};H[D]||(H[D]={}),H[D].styles||(H[D].styles={}),H[D].hooks||(H[D].hooks={}),H[D].shims||(H[D].shims=[]);var L=H[D];const rn=[],an=function(){k.removeEventListener("DOMContentLoaded",an),gt=1,rn.map(t=>t())};let gt=!1;R&&(gt=(k.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(k.readyState),gt||k.addEventListener("DOMContentLoaded",an));function va(t){R&&(gt?setTimeout(t,0):rn.push(t))}function ot(t){const{tag:e,attributes:n={},children:r=[]}=t;return typeof t=="string"?tn(t):"<".concat(e," ").concat(pa(n),">").concat(r.map(ot).join(""),"</").concat(e,">")}function sn(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Xt=function(e,n,r,a){var s=Object.keys(e),o=s.length,i=n,u,f,m;for(r===void 0?(u=1,m=e[s[0]]):(u=0,m=r);u<o;u++)f=s[u],m=i(m,e[f],f,e);return m};function xa(t){const e=[];let n=0;const r=t.length;for(;n<r;){const a=t.charCodeAt(n++);if(a>=55296&&a<=56319&&n<r){const s=t.charCodeAt(n++);(s&64512)==56320?e.push(((a&1023)<<10)+(s&1023)+65536):(e.push(a),n--)}else e.push(a)}return e}function Kt(t){const e=xa(t);return e.length===1?e[0].toString(16):null}function wa(t,e){const n=t.length;let r=t.charCodeAt(e),a;return r>=55296&&r<=56319&&n>e+1&&(a=t.charCodeAt(e+1),a>=56320&&a<=57343)?(r-55296)*1024+a-56320+65536:r}function on(t){return Object.keys(t).reduce((e,n)=>{const r=t[n];return!!r.icon?e[r.iconName]=r.icon:e[n]=r,e},{})}function qt(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:r=!1}=n,a=on(e);typeof L.hooks.addPack=="function"&&!r?L.hooks.addPack(t,on(e)):L.styles[t]=d(d({},L.styles[t]||{}),a),t==="fas"&&qt("fa",e)}const{styles:it,shims:Ca}=L,ln=Object.keys(Bt),Aa=ln.reduce((t,e)=>(t[e]=Object.keys(Bt[e]),t),{});let Jt=null,cn={},fn={},un={},dn={},mn={};function Ea(t){return~la.indexOf(t)}function Sa(t,e){const n=e.split("-"),r=n[0],a=n.slice(1).join("-");return r===t&&a!==""&&!Ea(a)?a:null}const pn=()=>{const t=r=>Xt(it,(a,s,o)=>(a[o]=Xt(s,r,{}),a),{});cn=t((r,a,s)=>(a[3]&&(r[a[3]]=s),a[2]&&a[2].filter(i=>typeof i=="number").forEach(i=>{r[i.toString(16)]=s}),r)),fn=t((r,a,s)=>(r[s]=s,a[2]&&a[2].filter(i=>typeof i=="string").forEach(i=>{r[i]=s}),r)),mn=t((r,a,s)=>{const o=a[2];return r[s]=s,o.forEach(i=>{r[i]=s}),r});const e="far"in it||h.autoFetchSvg,n=Xt(Ca,(r,a)=>{const s=a[0];let o=a[1];const i=a[2];return o==="far"&&!e&&(o="fas"),typeof s=="string"&&(r.names[s]={prefix:o,iconName:i}),typeof s=="number"&&(r.unicodes[s.toString(16)]={prefix:o,iconName:i}),r},{names:{},unicodes:{}});un=n.names,dn=n.unicodes,Jt=bt(h.styleDefault,{family:h.familyDefault})};ua(t=>{Jt=bt(t.styleDefault,{family:h.familyDefault})}),pn();function Qt(t,e){return(cn[t]||{})[e]}function ka(t,e){return(fn[t]||{})[e]}function W(t,e){return(mn[t]||{})[e]}function hn(t){return un[t]||{prefix:null,iconName:null}}function Oa(t){const e=dn[t],n=Qt("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function U(){return Jt}const gn=()=>({prefix:null,iconName:null,rest:[]});function _a(t){let e=I;const n=ln.reduce((r,a)=>(r[a]="".concat(h.cssPrefix,"-").concat(a),r),{});return Ue.forEach(r=>{(t.includes(n[r])||t.some(a=>Aa[r].includes(a)))&&(e=r)}),e}function bt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=I}=e,r=ra[n][t];if(n===mt&&!t)return"fad";const a=qe[n][t]||qe[n][r],s=t in L.styles?t:null;return a||s||null}function Pa(t){let e=[],n=null;return t.forEach(r=>{const a=Sa(h.cssPrefix,r);a?n=a:r&&e.push(r)}),{iconName:n,rest:e}}function bn(t){return t.sort().filter((e,n,r)=>r.indexOf(e)===n)}function yt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let r=null;const a=Mt.concat(Wr),s=bn(t.filter(c=>a.includes(c))),o=bn(t.filter(c=>!Mt.includes(c))),i=s.filter(c=>(r=c,!Ve.includes(c))),[u=null]=i,f=_a(s),m=d(d({},Pa(o)),{},{prefix:bt(u,{family:f})});return d(d(d({},m),Na({values:t,family:f,styles:it,config:h,canonical:m,givenPrefix:r})),ja(n,r,m))}function ja(t,e,n){let{prefix:r,iconName:a}=n;if(t||!r||!a)return{prefix:r,iconName:a};const s=e==="fa"?hn(a):{},o=W(r,a);return a=s.iconName||o||a,r=s.prefix||r,r==="far"&&!it.far&&it.fas&&!h.autoFetchSvg&&(r="fas"),{prefix:r,iconName:a}}const Ta=Ue.filter(t=>t!==I||t!==mt),Ia=Object.keys(Lt).filter(t=>t!==I).map(t=>Object.keys(Lt[t])).flat();function Na(t){const{values:e,family:n,canonical:r,givenPrefix:a="",styles:s={},config:o={}}=t,i=n===mt,u=e.includes("fa-duotone")||e.includes("fad"),f=o.familyDefault==="duotone",m=r.prefix==="fad"||r.prefix==="fa-duotone";if(!i&&(u||f||m)&&(r.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(r.prefix="fab"),!r.prefix&&Ta.includes(n)&&(Object.keys(s).find(b=>Ia.includes(b))||o.autoFetchSvg)){const b=Rr.get(n).defaultShortPrefixId;r.prefix=b,r.iconName=W(r.prefix,r.iconName)||r.iconName}return(r.prefix==="fa"||a==="fa")&&(r.prefix=U()||"fas"),r}class Fa{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];const a=n.reduce(this._pullDefinitions,{});Object.keys(a).forEach(s=>{this.definitions[s]=d(d({},this.definitions[s]||{}),a[s]),qt(s,a[s]);const o=Bt[I][s];o&&qt(o,a[s]),pn()})}reset(){this.definitions={}}_pullDefinitions(e,n){const r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(a=>{const{prefix:s,iconName:o,icon:i}=r[a],u=i[2];e[s]||(e[s]={}),u.length>0&&u.forEach(f=>{typeof f=="string"&&(e[s][f]=i)}),e[s][o]=i}),e}}let yn=[],J={};const Q={},La=Object.keys(Q);function Ma(t,e){let{mixoutsTo:n}=e;return yn=t,J={},Object.keys(Q).forEach(r=>{La.indexOf(r)===-1&&delete Q[r]}),yn.forEach(r=>{const a=r.mixout?r.mixout():{};if(Object.keys(a).forEach(s=>{typeof a[s]=="function"&&(n[s]=a[s]),typeof a[s]=="object"&&Object.keys(a[s]).forEach(o=>{n[s]||(n[s]={}),n[s][o]=a[s][o]})}),r.hooks){const s=r.hooks();Object.keys(s).forEach(o=>{J[o]||(J[o]=[]),J[o].push(s[o])})}r.provides&&r.provides(Q)}),n}function te(t,e){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];return(J[t]||[]).forEach(o=>{e=o.apply(null,[e,...r])}),e}function $(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];(J[t]||[]).forEach(s=>{s.apply(null,n)})}function B(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return Q[t]?Q[t].apply(null,e):void 0}function ee(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||U();if(e)return e=W(n,e)||e,sn(vn.definitions,n,e)||sn(L.styles,n,e)}const vn=new Fa,N={noAuto:()=>{h.autoReplaceSvg=!1,h.observeMutations=!1,$("noAuto")},config:h,dom:{i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return R?($("beforeI2svg",t),B("pseudoElements2svg",t),B("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,va(()=>{Ra({autoReplaceSvgRoot:e}),$("watch",t)})}},parse:{icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:W(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=bt(t[0]);return{prefix:n,iconName:W(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(h.cssPrefix,"-"))>-1||t.match(aa))){const e=yt(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||U(),iconName:W(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=U();return{prefix:e,iconName:W(e,t)||t}}}},library:vn,findIconDefinition:ee,toHtml:ot},Ra=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=k}=t;(Object.keys(L.styles).length>0||h.autoFetchSvg)&&R&&h.autoReplaceSvg&&N.dom.i2svg({node:e})};function vt(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>ot(n))}}),Object.defineProperty(t,"node",{get:function(){if(!R)return;const n=k.createElement("div");return n.innerHTML=t.html,n.children}}),t}function Da(t){let{children:e,main:n,mask:r,attributes:a,styles:s,transform:o}=t;if(Zt(o)&&n.found&&!r.found){const{width:i,height:u}=n,f={x:i/u/2,y:.5};a.style=ht(d(d({},s),{},{"transform-origin":"".concat(f.x+o.x/16,"em ").concat(f.y+o.y/16,"em")}))}return[{tag:"svg",attributes:a,children:e}]}function Ha(t){let{prefix:e,iconName:n,children:r,attributes:a,symbol:s}=t;const o=s===!0?"".concat(e,"-").concat(h.cssPrefix,"-").concat(n):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:d(d({},a),{},{id:o}),children:r}]}]}function ne(t){const{icons:{main:e,mask:n},prefix:r,iconName:a,transform:s,symbol:o,title:i,maskId:u,titleId:f,extra:m,watchable:c=!1}=t,{width:b,height:x}=n.found?n:e,A=Ur.includes(r),g=[h.replacementClass,a?"".concat(h.cssPrefix,"-").concat(a):""].filter(y=>m.classes.indexOf(y)===-1).filter(y=>y!==""||!!y).concat(m.classes).join(" ");let S={children:[],attributes:d(d({},m.attributes),{},{"data-prefix":r,"data-icon":a,class:g,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(b," ").concat(x)})};const O=A&&!~m.classes.indexOf("fa-fw")?{width:"".concat(b/x*16*.0625,"em")}:{};c&&(S.attributes[Y]=""),i&&(S.children.push({tag:"title",attributes:{id:S.attributes["aria-labelledby"]||"title-".concat(f||st())},children:[i]}),delete S.attributes.title);const E=d(d({},S),{},{prefix:r,iconName:a,main:e,mask:n,maskId:u,transform:s,symbol:o,styles:d(d({},O),m.styles)}),{children:_,attributes:p}=n.found&&e.found?B("generateAbstractMask",E)||{children:[],attributes:{}}:B("generateAbstractIcon",E)||{children:[],attributes:{}};return E.children=_,E.attributes=p,o?Ha(E):Da(E)}function xn(t){const{content:e,width:n,height:r,transform:a,title:s,extra:o,watchable:i=!1}=t,u=d(d(d({},o.attributes),s?{title:s}:{}),{},{class:o.classes.join(" ")});i&&(u[Y]="");const f=d({},o.styles);Zt(a)&&(f.transform=ga({transform:a,startCentered:!0,width:n,height:r}),f["-webkit-transform"]=f.transform);const m=ht(f);m.length>0&&(u.style=m);const c=[];return c.push({tag:"span",attributes:u,children:[e]}),s&&c.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),c}function za(t){const{content:e,title:n,extra:r}=t,a=d(d(d({},r.attributes),n?{title:n}:{}),{},{class:r.classes.join(" ")}),s=ht(r.styles);s.length>0&&(a.style=s);const o=[];return o.push({tag:"span",attributes:a,children:[e]}),n&&o.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),o}const{styles:re}=L;function ae(t){const e=t[0],n=t[1],[r]=t.slice(4);let a=null;return Array.isArray(r)?a={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(Wt.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(Wt.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(Wt.PRIMARY),fill:"currentColor",d:r[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:e,height:n,icon:a}}const Va={found:!1,width:512,height:512};function Ua(t,e){!Xe&&!h.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function se(t,e){let n=e;return e==="fa"&&h.styleDefault!==null&&(e=U()),new Promise((r,a)=>{if(n==="fa"){const s=hn(t);t=s.iconName||t,e=s.prefix||e}if(t&&e&&re[e]&&re[e][t]){const s=re[e][t];return r(ae(s))}Ua(t,e),r(d(d({},Va),{},{icon:h.showMissingIcons&&t?B("missingIconAbstract")||{}:{}}))})}const wn=()=>{},oe=h.measurePerformance&&dt&&dt.mark&&dt.measure?dt:{mark:wn,measure:wn},lt='FA "6.7.2"',Ba=t=>(oe.mark("".concat(lt," ").concat(t," begins")),()=>Cn(t)),Cn=t=>{oe.mark("".concat(lt," ").concat(t," ends")),oe.measure("".concat(lt," ").concat(t),"".concat(lt," ").concat(t," begins"),"".concat(lt," ").concat(t," ends"))};var ie={begin:Ba,end:Cn};const xt=()=>{};function An(t){return typeof(t.getAttribute?t.getAttribute(Y):null)=="string"}function Ya(t){const e=t.getAttribute?t.getAttribute(Ht):null,n=t.getAttribute?t.getAttribute(zt):null;return e&&n}function Wa(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(h.replacementClass)}function $a(){return h.autoReplaceSvg===!0?wt.replace:wt[h.autoReplaceSvg]||wt.replace}function Za(t){return k.createElementNS("http://www.w3.org/2000/svg",t)}function Ga(t){return k.createElement(t)}function En(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?Za:Ga}=e;if(typeof t=="string")return k.createTextNode(t);const r=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(s){r.setAttribute(s,t.attributes[s])}),(t.children||[]).forEach(function(s){r.appendChild(En(s,{ceFn:n}))}),r}function Xa(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const wt={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(En(n),e)}),e.getAttribute(Y)===null&&h.keepOriginalSource){let n=k.createComment(Xa(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~$t(e).indexOf(h.replacementClass))return wt.replace(t);const r=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const s=n[0].attributes.class.split(" ").reduce((o,i)=>(i===h.replacementClass||i.match(r)?o.toSvg.push(i):o.toNode.push(i),o),{toNode:[],toSvg:[]});n[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",s.toNode.join(" "))}const a=n.map(s=>ot(s)).join(`
`);e.setAttribute(Y,""),e.innerHTML=a}};function Sn(t){t()}function kn(t,e){const n=typeof e=="function"?e:xt;if(t.length===0)n();else{let r=Sn;h.mutateApproach===ea&&(r=z.requestAnimationFrame||Sn),r(()=>{const a=$a(),s=ie.begin("mutate");t.map(a),s(),n()})}}let le=!1;function On(){le=!0}function ce(){le=!1}let Ct=null;function _n(t){if(!De||!h.observeMutations)return;const{treeCallback:e=xt,nodeCallback:n=xt,pseudoElementsCallback:r=xt,observeMutationsRoot:a=k}=t;Ct=new De(s=>{if(le)return;const o=U();q(s).forEach(i=>{if(i.type==="childList"&&i.addedNodes.length>0&&!An(i.addedNodes[0])&&(h.searchPseudoElements&&r(i.target),e(i.target)),i.type==="attributes"&&i.target.parentNode&&h.searchPseudoElements&&r(i.target.parentNode),i.type==="attributes"&&An(i.target)&&~ia.indexOf(i.attributeName))if(i.attributeName==="class"&&Ya(i.target)){const{prefix:u,iconName:f}=yt($t(i.target));i.target.setAttribute(Ht,u||o),f&&i.target.setAttribute(zt,f)}else Wa(i.target)&&n(i.target)})}),R&&Ct.observe(a,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Ka(){Ct&&Ct.disconnect()}function qa(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((r,a)=>{const s=a.split(":"),o=s[0],i=s.slice(1);return o&&i.length>0&&(r[o]=i.join(":").trim()),r},{})),n}function Ja(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),r=t.innerText!==void 0?t.innerText.trim():"";let a=yt($t(t));return a.prefix||(a.prefix=U()),e&&n&&(a.prefix=e,a.iconName=n),a.iconName&&a.prefix||(a.prefix&&r.length>0&&(a.iconName=ka(a.prefix,t.innerText)||Qt(a.prefix,Kt(t.innerText))),!a.iconName&&h.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(a.iconName=t.firstChild.data)),a}function Qa(t){const e=q(t.attributes).reduce((a,s)=>(a.name!=="class"&&a.name!=="style"&&(a[s.name]=s.value),a),{}),n=t.getAttribute("title"),r=t.getAttribute("data-fa-title-id");return h.autoA11y&&(n?e["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(r||st()):(e["aria-hidden"]="true",e.focusable="false")),e}function ts(){return{iconName:null,title:null,titleId:null,prefix:null,transform:F,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Pn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:r,rest:a}=Ja(t),s=Qa(t),o=te("parseNodeAttributes",{},t);let i=e.styleParser?qa(t):[];return d({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:r,transform:F,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:i,attributes:s}},o)}const{styles:es}=L;function jn(t){const e=h.autoReplaceSvg==="nest"?Pn(t,{styleParser:!1}):Pn(t);return~e.extra.classes.indexOf(Je)?B("generateLayersText",t,e):B("generateSvgReplacementMutation",t,e)}function ns(){return[...Hr,...Mt]}function Tn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!R)return Promise.resolve();const n=k.documentElement.classList,r=m=>n.add("".concat(Ge,"-").concat(m)),a=m=>n.remove("".concat(Ge,"-").concat(m)),s=h.autoFetchSvg?ns():Ve.concat(Object.keys(es));s.includes("fa")||s.push("fa");const o=[".".concat(Je,":not([").concat(Y,"])")].concat(s.map(m=>".".concat(m,":not([").concat(Y,"])"))).join(", ");if(o.length===0)return Promise.resolve();let i=[];try{i=q(t.querySelectorAll(o))}catch{}if(i.length>0)r("pending"),a("complete");else return Promise.resolve();const u=ie.begin("onTree"),f=i.reduce((m,c)=>{try{const b=jn(c);b&&m.push(b)}catch(b){Xe||b.name==="MissingIcon"&&console.error(b)}return m},[]);return new Promise((m,c)=>{Promise.all(f).then(b=>{kn(b,()=>{r("active"),r("complete"),a("pending"),typeof e=="function"&&e(),u(),m()})}).catch(b=>{u(),c(b)})})}function rs(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;jn(t).then(n=>{n&&kn([n],e)})}function as(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const r=(e||{}).icon?e:ee(e||{});let{mask:a}=n;return a&&(a=(a||{}).icon?a:ee(a||{})),t(r,d(d({},n),{},{mask:a}))}}const ss=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=F,symbol:r=!1,mask:a=null,maskId:s=null,title:o=null,titleId:i=null,classes:u=[],attributes:f={},styles:m={}}=e;if(!t)return;const{prefix:c,iconName:b,icon:x}=t;return vt(d({type:"icon"},t),()=>($("beforeDOMElementCreation",{iconDefinition:t,params:e}),h.autoA11y&&(o?f["aria-labelledby"]="".concat(h.replacementClass,"-title-").concat(i||st()):(f["aria-hidden"]="true",f.focusable="false")),ne({icons:{main:ae(x),mask:a?ae(a.icon):{found:!1,width:null,height:null,icon:{}}},prefix:c,iconName:b,transform:d(d({},F),n),symbol:r,title:o,maskId:s,titleId:i,extra:{attributes:f,styles:m,classes:u}})))};var os={mixout(){return{icon:as(ss)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Tn,t.nodeCallback=rs,t}}},provides(t){t.i2svg=function(e){const{node:n=k,callback:r=()=>{}}=e;return Tn(n,r)},t.generateSvgReplacementMutation=function(e,n){const{iconName:r,title:a,titleId:s,prefix:o,transform:i,symbol:u,mask:f,maskId:m,extra:c}=n;return new Promise((b,x)=>{Promise.all([se(r,o),f.iconName?se(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(A=>{let[g,S]=A;b([e,ne({icons:{main:g,mask:S},prefix:o,iconName:r,transform:i,symbol:u,maskId:m,title:a,titleId:s,extra:c,watchable:!0})])}).catch(x)})},t.generateAbstractIcon=function(e){let{children:n,attributes:r,main:a,transform:s,styles:o}=e;const i=ht(o);i.length>0&&(r.style=i);let u;return Zt(s)&&(u=B("generateAbstractTransformGrouping",{main:a,transform:s,containerWidth:a.width,iconWidth:a.width})),n.push(u||a.icon),{children:n,attributes:r}}}},is={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return vt({type:"layer"},()=>{$("beforeDOMElementCreation",{assembler:t,params:e});let r=[];return t(a=>{Array.isArray(a)?a.map(s=>{r=r.concat(s.abstract)}):r=r.concat(a.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers"),...n].join(" ")},children:r}]})}}}},ls={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:r=[],attributes:a={},styles:s={}}=e;return vt({type:"counter",content:t},()=>($("beforeDOMElementCreation",{content:t,params:e}),za({content:t.toString(),title:n,extra:{attributes:a,styles:s,classes:["".concat(h.cssPrefix,"-layers-counter"),...r]}})))}}}},cs={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=F,title:r=null,classes:a=[],attributes:s={},styles:o={}}=e;return vt({type:"text",content:t},()=>($("beforeDOMElementCreation",{content:t,params:e}),xn({content:t,transform:d(d({},F),n),title:r,extra:{attributes:s,styles:o,classes:["".concat(h.cssPrefix,"-layers-text"),...a]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:r,transform:a,extra:s}=n;let o=null,i=null;if(He){const u=parseInt(getComputedStyle(e).fontSize,10),f=e.getBoundingClientRect();o=f.width/u,i=f.height/u}return h.autoA11y&&!r&&(s.attributes["aria-hidden"]="true"),Promise.resolve([e,xn({content:e.innerHTML,width:o,height:i,transform:a,title:r,extra:s,watchable:!0})])}}};const fs=new RegExp('"',"ug"),In=[1105920,1112319],Nn=d(d(d(d({},{FontAwesome:{normal:"fas",400:"fas"}}),Mr),Qr),$r),fe=Object.keys(Nn).reduce((t,e)=>(t[e.toLowerCase()]=Nn[e],t),{}),us=Object.keys(fe).reduce((t,e)=>{const n=fe[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function ds(t){const e=t.replace(fs,""),n=wa(e,0),r=n>=In[0]&&n<=In[1],a=e.length===2?e[0]===e[1]:!1;return{value:Kt(a?e[0]:e),isSecondary:r||a}}function ms(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),r=parseInt(e),a=isNaN(r)?"normal":r;return(fe[n]||{})[a]||us[n]}function Fn(t,e){const n="".concat(ta).concat(e.replace(":","-"));return new Promise((r,a)=>{if(t.getAttribute(n)!==null)return r();const o=q(t.children).filter(b=>b.getAttribute(Dt)===e)[0],i=z.getComputedStyle(t,e),u=i.getPropertyValue("font-family"),f=u.match(sa),m=i.getPropertyValue("font-weight"),c=i.getPropertyValue("content");if(o&&!f)return t.removeChild(o),r();if(f&&c!=="none"&&c!==""){const b=i.getPropertyValue("content");let x=ms(u,m);const{value:A,isSecondary:g}=ds(b),S=f[0].startsWith("FontAwesome");let O=Qt(x,A),E=O;if(S){const _=Oa(A);_.iconName&&_.prefix&&(O=_.iconName,x=_.prefix)}if(O&&!g&&(!o||o.getAttribute(Ht)!==x||o.getAttribute(zt)!==E)){t.setAttribute(n,E),o&&t.removeChild(o);const _=ts(),{extra:p}=_;p.attributes[Dt]=e,se(O,x).then(y=>{const C=ne(d(d({},_),{},{icons:{main:y,mask:gn()},prefix:x,iconName:E,extra:p,watchable:!0})),P=k.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(P,t.firstChild):t.appendChild(P),P.outerHTML=C.map(T=>ot(T)).join(`
`),t.removeAttribute(n),r()}).catch(a)}else r()}else r()})}function ps(t){return Promise.all([Fn(t,"::before"),Fn(t,"::after")])}function hs(t){return t.parentNode!==document.head&&!~na.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Dt)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Ln(t){if(R)return new Promise((e,n)=>{const r=q(t.querySelectorAll("*")).filter(hs).map(ps),a=ie.begin("searchPseudoElements");On(),Promise.all(r).then(()=>{a(),ce(),e()}).catch(()=>{a(),ce(),n()})})}var gs={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Ln,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=k}=e;h.searchPseudoElements&&Ln(n)}}};let Mn=!1;var bs={mixout(){return{dom:{unwatch(){On(),Mn=!0}}}},hooks(){return{bootstrap(){_n(te("mutationObserverCallbacks",{}))},noAuto(){Ka()},watch(t){const{observeMutationsRoot:e}=t;Mn?ce():_n(te("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Rn=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,r)=>{const a=r.toLowerCase().split("-"),s=a[0];let o=a.slice(1).join("-");if(s&&o==="h")return n.flipX=!0,n;if(s&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(s){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},e)};var ys={mixout(){return{parse:{transform:t=>Rn(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Rn(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:r,containerWidth:a,iconWidth:s}=e;const o={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),f="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(i," ").concat(u," ").concat(f)},c={transform:"translate(".concat(s/2*-1," -256)")},b={outer:o,inner:m,path:c};return{tag:"g",attributes:d({},b.outer),children:[{tag:"g",attributes:d({},b.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:d(d({},n.icon.attributes),b.path)}]}]}}}};const ue={x:0,y:0,width:"100%",height:"100%"};function Dn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function vs(t){return t.tag==="g"?t.children:[t]}var xs={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),r=n?yt(n.split(" ").map(a=>a.trim())):gn();return r.prefix||(r.prefix=U()),t.mask=r,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:r,main:a,mask:s,maskId:o,transform:i}=e;const{width:u,icon:f}=a,{width:m,icon:c}=s,b=ha({transform:i,containerWidth:m,iconWidth:u}),x={tag:"rect",attributes:d(d({},ue),{},{fill:"white"})},A=f.children?{children:f.children.map(Dn)}:{},g={tag:"g",attributes:d({},b.inner),children:[Dn(d({tag:f.tag,attributes:d(d({},f.attributes),b.path)},A))]},S={tag:"g",attributes:d({},b.outer),children:[g]},O="mask-".concat(o||st()),E="clip-".concat(o||st()),_={tag:"mask",attributes:d(d({},ue),{},{id:O,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,S]},p={tag:"defs",children:[{tag:"clipPath",attributes:{id:E},children:vs(c)},_]};return n.push(p,{tag:"rect",attributes:d({fill:"currentColor","clip-path":"url(#".concat(E,")"),mask:"url(#".concat(O,")")},ue)}),{children:n,attributes:r}}}},ws={provides(t){let e=!1;z.matchMedia&&(e=z.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],r={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:d(d({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const s=d(d({},a),{},{attributeName:"opacity"}),o={tag:"circle",attributes:d(d({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||o.children.push({tag:"animate",attributes:d(d({},a),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:d(d({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:d(d({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:d(d({},s),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:d(d({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:d(d({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Cs={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),r=n===null?!1:n===""?!0:n;return t.symbol=r,t}}}},As=[ya,os,is,ls,cs,gs,bs,ys,xs,ws,Cs];Ma(As,{mixoutsTo:N}),N.noAuto,N.config,N.library,N.dom;const de=N.parse;N.findIconDefinition,N.toHtml;const Es=N.icon;N.layer,N.text,N.counter;var Hn={exports:{}},Ss="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",ks=Ss,Os=ks;function zn(){}function Vn(){}Vn.resetWarningCache=zn;var _s=function(){function t(r,a,s,o,i,u){if(u!==Os){var f=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw f.name="Invariant Violation",f}}t.isRequired=t;function e(){return t}var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Vn,resetWarningCache:zn};return n.PropTypes=n,n};Hn.exports=_s();var Ps=Hn.exports;const w=lr(Ps);function Un(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function M(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Un(Object(n),!0).forEach(function(r){tt(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Un(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function At(t){"@babel/helpers - typeof";return At=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},At(t)}function tt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function js(t,e){if(t==null)return{};var n={},r=Object.keys(t),a,s;for(s=0;s<r.length;s++)a=r[s],!(e.indexOf(a)>=0)&&(n[a]=t[a]);return n}function Ts(t,e){if(t==null)return{};var n=js(t,e),r,a;if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(a=0;a<s.length;a++)r=s[a],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function me(t){return Is(t)||Ns(t)||Fs(t)||Ls()}function Is(t){if(Array.isArray(t))return pe(t)}function Ns(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Fs(t,e){if(t){if(typeof t=="string")return pe(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return pe(t,e)}}function pe(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Ls(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ms(t){var e,n=t.beat,r=t.fade,a=t.beatFade,s=t.bounce,o=t.shake,i=t.flash,u=t.spin,f=t.spinPulse,m=t.spinReverse,c=t.pulse,b=t.fixedWidth,x=t.inverse,A=t.border,g=t.listItem,S=t.flip,O=t.size,E=t.rotation,_=t.pull,p=(e={"fa-beat":n,"fa-fade":r,"fa-beat-fade":a,"fa-bounce":s,"fa-shake":o,"fa-flash":i,"fa-spin":u,"fa-spin-reverse":m,"fa-spin-pulse":f,"fa-pulse":c,"fa-fw":b,"fa-inverse":x,"fa-border":A,"fa-li":g,"fa-flip":S===!0,"fa-flip-horizontal":S==="horizontal"||S==="both","fa-flip-vertical":S==="vertical"||S==="both"},tt(e,"fa-".concat(O),typeof O<"u"&&O!==null),tt(e,"fa-rotate-".concat(E),typeof E<"u"&&E!==null&&E!==0),tt(e,"fa-pull-".concat(_),typeof _<"u"&&_!==null),tt(e,"fa-swap-opacity",t.swapOpacity),e);return Object.keys(p).map(function(y){return p[y]?y:null}).filter(function(y){return y})}function Rs(t){return t=t-0,t===t}function Bn(t){return Rs(t)?t:(t=t.replace(/[\-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""}),t.substr(0,1).toLowerCase()+t.substr(1))}var Ds=["style"];function Hs(t){return t.charAt(0).toUpperCase()+t.slice(1)}function zs(t){return t.split(";").map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,n){var r=n.indexOf(":"),a=Bn(n.slice(0,r)),s=n.slice(r+1).trim();return a.startsWith("webkit")?e[Hs(a)]=s:e[a]=s,e},{})}function Yn(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var r=(e.children||[]).map(function(u){return Yn(t,u)}),a=Object.keys(e.attributes||{}).reduce(function(u,f){var m=e.attributes[f];switch(f){case"class":u.attrs.className=m,delete e.attributes.class;break;case"style":u.attrs.style=zs(m);break;default:f.indexOf("aria-")===0||f.indexOf("data-")===0?u.attrs[f.toLowerCase()]=m:u.attrs[Bn(f)]=m}return u},{attrs:{}}),s=n.style,o=s===void 0?{}:s,i=Ts(n,Ds);return a.attrs.style=M(M({},a.attrs.style),o),t.apply(void 0,[e.tag,M(M({},a.attrs),i)].concat(me(r)))}var Wn=!1;try{Wn=!0}catch{}function Vs(){if(!Wn&&console&&typeof console.error=="function"){var t;(t=console).error.apply(t,arguments)}}function $n(t){if(t&&At(t)==="object"&&t.prefix&&t.iconName&&t.icon)return t;if(de.icon)return de.icon(t);if(t===null)return null;if(t&&At(t)==="object"&&t.prefix&&t.iconName)return t;if(Array.isArray(t)&&t.length===2)return{prefix:t[0],iconName:t[1]};if(typeof t=="string")return{prefix:"fas",iconName:t}}function he(t,e){return Array.isArray(e)&&e.length>0||!Array.isArray(e)&&e?tt({},t,e):{}}var Zn={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},Et=v.forwardRef(function(t,e){var n=M(M({},Zn),t),r=n.icon,a=n.mask,s=n.symbol,o=n.className,i=n.title,u=n.titleId,f=n.maskId,m=$n(r),c=he("classes",[].concat(me(Ms(n)),me((o||"").split(" ")))),b=he("transform",typeof n.transform=="string"?de.transform(n.transform):n.transform),x=he("mask",$n(a)),A=Es(m,M(M(M(M({},c),b),x),{},{symbol:s,title:i,titleId:u,maskId:f}));if(!A)return Vs("Could not find icon",m),null;var g=A.abstract,S={ref:e};return Object.keys(n).forEach(function(O){Zn.hasOwnProperty(O)||(S[O]=n[O])}),Us(g[0],S)});Et.displayName="FontAwesomeIcon",Et.propTypes={beat:w.bool,border:w.bool,beatFade:w.bool,bounce:w.bool,className:w.string,fade:w.bool,flash:w.bool,mask:w.oneOfType([w.object,w.array,w.string]),maskId:w.string,fixedWidth:w.bool,inverse:w.bool,flip:w.oneOf([!0,!1,"horizontal","vertical","both"]),icon:w.oneOfType([w.object,w.array,w.string]),listItem:w.bool,pull:w.oneOf(["right","left"]),pulse:w.bool,rotation:w.oneOf([0,90,180,270]),shake:w.bool,size:w.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:w.bool,spinPulse:w.bool,spinReverse:w.bool,symbol:w.oneOfType([w.bool,w.string]),title:w.string,titleId:w.string,transform:w.oneOfType([w.string,w.object]),swapOpacity:w.bool};var Us=Yn.bind(null,v.createElement);const St={NEGATIVE:"negative",POSITIVE:"positive"};function Gn({title:t,onClickHandler:e=()=>{},status:n=!1,type:r=St.NEGATIVE}){const a=()=>{let s="";switch(r){case St.NEGATIVE:{s="tableberg-negative-bg";break}case St.POSITIVE:{s="tableberg-positive-bg";break}}return s};return l.jsx("div",{onClick:()=>{n&&e()},className:`tableberg-menu-button ${a()}`,"data-enabled":JSON.stringify(n),children:t})}/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const Bs={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},Ys={prefix:"fas",iconName:"right-long",icon:[512,512,["long-arrow-alt-right"],"f30b","M334.5 414c8.8 3.8 19 2 26-4.6l144-136c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 72L32 192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l288 0 0 72c0 9.6 5.7 18.2 14.5 22z"]};function Ws({from:t,to:e,onCloseHandler:n,onOperationStart:r,reloadDelay:a=5e3}){const s={NOT_STARTED:"notStarted",STARTED:"started",FINISHED:"finished"},o={OK:"ok",ERROR:"error"},i=(E,_=o.OK)=>({type:_,message:E}),[u,f]=v.useState(s.NOT_STARTED),[m,c]=v.useState(a/1e3),[b,x]=v.useState(i("")),A=t>e,g=v.useRef(a),S=()=>{f(s.STARTED),r().then(({message:E})=>{x(i(E,o.OK))}).catch(({message:E})=>{x(i(E,o.ERROR))}).finally(()=>{f(s.FINISHED),O()})},O=()=>{const E=setInterval(()=>{g.current<=0?(window.location.reload(),clearInterval(E)):(g.current=g.current-1e3,c(g.current/1e3))},1e3)};return l.jsx("div",{className:"version-control-popup",children:l.jsxs("div",{className:"modal-container",children:[l.jsxs("div",{className:"rollback-versions",children:[l.jsx("div",{className:`version-id ${A?"tableberg-positive-color":"tableberg-negative-color"}`,children:t}),l.jsx("div",{className:"version-icon","data-in-progress":JSON.stringify(u===s.STARTED),children:l.jsx("div",{className:"version-icon-inner-wrapper",children:l.jsx(Et,{icon:Ys})})}),l.jsx("div",{className:`version-id ${A?"tableberg-negative-color":"tableberg-positive-color"}`,children:e})]}),u!==s.STARTED&&l.jsxs("div",{className:"version-content",children:[u===s.NOT_STARTED&&l.jsxs("div",{className:"version-warning",children:[l.jsx("div",{children:X("Older versions might be unstable. Do it on your own risk and create a backup.","tableberg")}),l.jsxs("div",{className:"version-rollback-button-container",children:[l.jsx(Gn,{type:St.POSITIVE,onClickHandler:S,status:!0,title:"Start"}),l.jsx(Gn,{onClickHandler:n,status:!0,title:"Close"})]})]}),u===s.FINISHED&&l.jsxs("div",{className:"operation-finished-wrapper",children:[l.jsx("div",{className:"version-control-response","data-resp-type":b.type,children:b.message}),l.jsx("div",{children:m<=0?`${X("Reloading page now…","tableberg")}`:`${X("Reloading page in ","tableberg")} ${m}...`})]})]})]})})}function $s({children:t,target:e}){return G.createPortal(t,e)}function Zs({currentVersion:t,availableVersions:e,onSelect:n}){const r=v.useMemo(()=>e.filter(a=>a!==t),[e]);return l.jsx("div",{className:"tableberg-header-version-info",children:l.jsxs("select",{value:t,onChange:a=>n(a.target.value),children:[l.jsx("option",{disabled:!0,value:t,children:t}),r.map(a=>l.jsx("option",{value:a,children:a},a))]})})}function Xn({pluginVersion:t,allVersions:e,onVersionRollBack:n}){const[r,a]=v.useState(t),[s,o]=v.useState(!1),i=v.useMemo(()=>e.sort().reverse(),[e]),u=m=>{a(m),o(!0)},f=()=>n(r);return l.jsxs("div",{className:"version-control-container",children:[l.jsx(Zs,{availableVersions:i,currentVersion:r,onSelect:u}),s&&l.jsx($s,{target:document.body,children:l.jsx(Ws,{onCloseHandler:()=>{a(t),o(!1)},from:t,to:r,onOperationStart:f})})]})}const Gs={path:null,title:"no_title",element:null};function Xs(t){const{path:e,title:n,element:r}={...Gs,...t};this.getPath=()=>e,this.getTitle=()=>n,this.getElement=()=>r??l.jsxs("div",{children:["no element defined for route [",this.getPath(),"]"]})}const Kn=t=>t.map(e=>new Xs(e));function Ks({title:t,targetPath:e,onClickHandler:n,isActive:r=!1}){const a=()=>n(e);return l.jsx("div",{"data-active":r,"data-path":e,className:"tableberg-menu-navigation-header-button",tabIndex:0,role:"button",onClick:a,onKeyDown:a,children:t})}function qn({routes:t,currentRoutePath:e,setRoute:n}){const[r,a]=v.useState({});return v.useEffect(()=>{const s={gridTemplateColumns:`repeat(${t.length}, minmax(0,1fr))`};a(s)},[t]),l.jsx("div",{style:r,className:"tableberg-menu-navigation",children:t.map(s=>l.jsx(Ks,{title:s.getTitle(),targetPath:s.getPath(),isActive:e===s.getPath(),onClickHandler:n},s.getPath()))})}function qs({children:t}){return l.jsx("div",{className:"tableberg-box-content-title",children:t})}function Js({children:t}){return l.jsx("div",{className:"tableberg-box-content-inc",children:t})}const Qs={HORIZONTAL:"horizontal",VERTICAL:"vertical"},ge={JUMBO:"jumbo",NORMAL:"normal"},to={LEFT:"left",CENTER:"center"};function eo({title:t=null,content:e=null,layout:n=Qs.VERTICAL,size:r=ge.NORMAL,alignment:a=to.LEFT,children:s}){return l.jsxs("div",{className:"tableberg-box-content","data-layout":n,"data-size":r,"data-alignment":a,children:[l.jsxs("div",{className:"tableberg-box-content-title-inc-wrapper",children:[t&&l.jsx(qs,{children:t}),e&&l.jsx(Js,{children:e})]}),s&&l.jsx("div",{className:"tableberg-box-content-footer",children:s})]})}function Jn(t){this.name="ContentNotFoundError",this.message=`Content not found for key: [${t}]`}Jn.prototype=Object.create(Error.prototype);const no=t=>tablebergAdminMenuData==null?void 0:tablebergAdminMenuData[t];function kt(t){const[e,n]=v.useState(null),[r,a]=v.useState(null),[s,o]=v.useState({}),{contentId:i,...u}=t,f=no(i);return v.useEffect(()=>{if(f){const{title:m,content:c}=f;n(m),a(c),o(u)}else throw new Jn(i)},[]),l.jsx(eo,{...s,title:e,content:r,children:t.children})}function ro({videoId:t,width:e=null,height:n=null}){const[r,a]=v.useState(null),s={width:"100",height:"100"};return v.useEffect(()=>{const o=`https://www.youtube.com/embed/${t}`;a(o)},[]),l.jsx("div",{className:"tableberg-youtube-embed",children:l.jsx("iframe",{width:e||s.width,height:n||s.height,src:r,title:"YouTube video player",allow:"picture-in-picture; web-share; fullscreen"})})}function Qn(){this.name="ButtonLinkNoUrlError",this.message="No URL is provided for ButtonLink component."}Qn.prototype=Object.create(Error.prototype);const Ot={TEXT:"text",DEFAULT:"default",PRIMARY:"primary"};function _t({title:t,url:e=null,onClickHandler:n=null,type:r=Ot.DEFAULT}){v.useEffect(()=>{if(!e&&!n)throw new Qn},[]);const a=()=>{window.open(e,"_blank")},s=o=>{n&&typeof n=="function"?n(o):a()};return l.jsx("div",{className:"tableberg-button-link","data-buttonlink-type":r,onClick:s,role:"button",children:t})}function ao({proStatus:t=!1,children:e,invert:n=!0}){const[r,a]=v.useState(!1);return v.useEffect(()=>{a(n?!t:t)},[]),r&&e}const be={proBuyUrl:"https://tableberg.com/pricing/",youtubeVideoId:"TKsL_bUVCTU",documentsUrl:"https://tableberg.com/docs/",supportUrl:"https://tableberg.com/contact/"};function Pt({children:t,assetIds:e=[]}){const n=a=>be==null?void 0:be[a],r=e.reduce((a,s)=>(a[s]=n(s),a),{});return t(r)}function tr(t){return l.jsx(Pt,{assetIds:["proBuyUrl"],children:({proBuyUrl:e})=>l.jsx(ao,{invert:!0,children:l.jsx(kt,{size:ge.JUMBO,contentId:"upgrade",...t,children:l.jsx(_t,{url:e,title:"GET TABLEBERG PRO",type:Ot.PRIMARY})})})})}function so(){return l.jsx(Pt,{assetIds:["youtubeVideoId","documentsUrl","supportUrl","twitterUrl","facebookUrl","youtubeUrl"],children:({youtubeVideoId:t,documentsUrl:e,supportUrl:n,twitterUrl:r,facebookUrl:a,youtubeUrl:s})=>l.jsxs("div",{className:"tableberg-welcome-content",children:[l.jsxs("div",{className:"tableberg-welcome-content__main",children:[l.jsx(kt,{size:ge.JUMBO,contentId:"welcome",children:l.jsx(ro,{height:315,videoId:t})}),!tablebergAdminMenuData.misc.pro_status&&l.jsx(tr,{})]}),l.jsxs("div",{className:"tableberg-welcome-content__right-sidebar",children:[l.jsx(kt,{contentId:"documentation",children:l.jsx(_t,{url:e,title:X("Visit Documents","tableberg"),type:Ot.DEFAULT})}),l.jsx(kt,{contentId:"support",children:l.jsx(_t,{url:n,title:X("Support Forum","tableberg"),type:Ot.DEFAULT})})]})]})})}const oo=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM10.8867 13.5671C10.6495 13.5035 10.5087 13.2598 10.5723 13.0226L12.3246 6.48302C12.3881 6.24585 12.6319 6.10511 12.8691 6.16866C13.1062 6.23221 13.247 6.47598 13.1834 6.71315L11.4311 13.2527C11.3676 13.4899 11.1238 13.6306 10.8867 13.5671ZM9.2624 12.9295C9.45766 13.1248 9.77424 13.1248 9.96951 12.9295C10.1648 12.7342 10.1648 12.4176 9.96951 12.2224L7.9686 10.2215C7.77333 10.0262 7.77333 9.70963 7.9686 9.51437L9.96951 7.51346C10.1648 7.3182 10.1648 7.00162 9.96951 6.80635C9.77424 6.61109 9.45766 6.61109 9.2624 6.80635L7.26149 8.80726C6.6757 9.39305 6.6757 10.3428 7.26149 10.9286L9.2624 12.9295ZM13.8853 6.8063C14.0805 6.61104 14.3971 6.61104 14.5924 6.8063L16.5933 8.80721C17.1791 9.393 17.1791 10.3427 16.5933 10.9285L14.5924 12.9294C14.3971 13.1247 14.0805 13.1247 13.8853 12.9294C13.69 12.7342 13.69 12.4176 13.8853 12.2223L15.8862 10.2214C16.0814 10.0262 16.0814 9.70958 15.8862 9.51432L13.8853 7.51341C13.69 7.31815 13.69 7.00157 13.8853 6.8063ZM7.478 15.2625H6.838V17.9465H7.478V16.8845H8.492V17.9465H9.138V15.2625H8.492V16.3205H7.478V15.2625ZM9.50056 15.2625V15.8165H10.2886V17.9465H10.9286V15.8165H11.7106V15.2625H9.50056ZM12.9884 15.2625H12.0724V17.9465H12.7124V16.166L13.3464 17.6965H13.7604L14.3624 16.2482V17.9465H15.0064V15.2625H14.1264L13.5574 16.6342L12.9884 15.2625ZM16.3257 17.3865V15.2625H15.6857V17.9465H17.3397V17.3865H16.3257Z",fill:"#671FEB"})]}),io=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{d:"M8.34675 8C8.15525 8 8 8.15525 8 8.34675C8 8.53826 8.15525 8.69351 8.34675 8.69351H11.1362C11.3277 8.69351 11.483 8.53826 11.483 8.34675C11.483 8.15525 11.3277 8 11.1362 8H8.34675Z",fill:"#671FEB"}),l.jsx("path",{d:"M8 9.73374C8 9.54224 8.15525 9.38699 8.34675 9.38699H11.1362C11.3277 9.38699 11.483 9.54224 11.483 9.73374C11.483 9.92525 11.3277 10.0805 11.1362 10.0805H8.34675C8.15525 10.0805 8 9.92525 8 9.73374Z",fill:"#671FEB"}),l.jsx("path",{d:"M8.34675 10.774C8.15525 10.774 8 10.9292 8 11.1207C8 11.3122 8.15525 11.4675 8.34675 11.4675H11.1362C11.3277 11.4675 11.483 11.3122 11.483 11.1207C11.483 10.9292 11.3277 10.774 11.1362 10.774H8.34675Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.04375 15.4838C7.95182 15.6493 8.00927 15.8584 8.17377 15.9534C8.25764 16.0018 8.35329 16.0113 8.43981 15.9875H11.0432C11.1297 16.0113 11.2254 16.0018 11.3092 15.9534C11.4388 15.8786 11.502 15.7328 11.478 15.5934C11.4692 15.528 11.4422 15.4683 11.4022 15.4196L10.0467 13.0717C9.98154 12.9589 9.86272 12.8965 9.74114 12.898C9.6198 12.8967 9.50133 12.9592 9.43633 13.0717L8.06292 15.4505C8.05594 15.4613 8.04954 15.4724 8.04375 15.4838ZM8.95647 15.2926L9.7415 13.9329L10.5265 15.2926H8.95647Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.478 8H16.0487V11.4674H12.478V8ZM13.078 8.6H15.4487V10.8674H13.078V8.6Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8V12.258C16.7171 12.1048 16.3932 12.0178 16.0489 12.0178C14.9502 12.0178 14.0584 12.9038 14.049 14.0002C12.9524 14.0096 12.0665 14.9014 12.0665 16.0001C12.0665 16.3644 12.1638 16.7059 12.3339 17H8C7.44772 17 7 16.5523 7 16V8ZM16.0489 13.0178C16.4931 13.0178 16.8696 13.3074 17 13.7081C17.0317 13.8056 17.0489 13.9097 17.0489 14.0178V15.0001H18.0309C18.5832 15.0001 19.0309 15.4479 19.0309 16.0001C19.0309 16.5524 18.5832 17.0001 18.0309 17.0001H17.0489V17.9823C17.0489 18.5346 16.6012 18.9823 16.0489 18.9823C15.4966 18.9823 15.0489 18.5346 15.0489 17.9823V17.0001H14.0665L14.0491 17C13.5048 16.9908 13.0665 16.5466 13.0665 16.0001C13.0665 15.4479 13.5142 15.0001 14.0665 15.0001H15.0489V14.0178C15.0489 13.4655 15.4966 13.0178 16.0489 13.0178Z",fill:"#671FEB"})]}),lo=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8ZM7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13ZM8 16C8 16.5523 7.55228 17 7 17C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15C7.55228 15 8 15.4477 8 16ZM11 7.5C10.7239 7.5 10.5 7.72386 10.5 8C10.5 8.27614 10.7239 8.5 11 8.5H17C17.2761 8.5 17.5 8.27614 17.5 8C17.5 7.72386 17.2761 7.5 17 7.5H11ZM10.5 12C10.5 11.7239 10.7239 11.5 11 11.5H17C17.2761 11.5 17.5 11.7239 17.5 12C17.5 12.2761 17.2761 12.5 17 12.5H11C10.7239 12.5 10.5 12.2761 10.5 12ZM11 15.5C10.7239 15.5 10.5 15.7239 10.5 16C10.5 16.2761 10.7239 16.5 11 16.5H17C17.2761 16.5 17.5 16.2761 17.5 16C17.5 15.7239 17.2761 15.5 17 15.5H11Z",fill:"#671feb"})]}),co=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM8 9.61388C11.1954 9.04964 12.9452 9.06689 16 9.61388V12.681C12.8757 12.2134 11.125 12.1847 8 12.681V9.61388ZM7.42857 11.7356H4L4 11.7356L6.28572 13.2692L4.00002 14.8027H9.71429V13.055C9.0129 13.105 8.26382 13.1765 7.42857 13.2694V11.7356ZM14.2857 13.0511V14.8028L20 14.8028L17.7143 13.2693L20 11.7358L20 11.7357H16.5714V13.2694C15.7384 13.1741 14.9903 13.1013 14.2857 13.0511Z",fill:"#671FEB"})]}),fo=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM12 5.66844L13.9749 9.95014L18.6574 10.5053L15.1955 13.7067L16.1145 18.3316L12 16.0284L7.88549 18.3316L8.80444 13.7067L5.34259 10.5053L10.025 9.95014L12 5.66844ZM12 8.1066V14.9191L9.29297 16.4386L9.89453 13.4035L7.61328 11.2863L10.6992 10.9269L12 8.1066Z",fill:"#671feb"})]});function er(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var a=t.length;for(e=0;e<a;e++)t[e]&&(n=er(t[e]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function uo(){for(var t,e,n=0,r="",a=arguments.length;n<a;n++)(t=arguments[n])&&(e=er(t))&&(r&&(r+=" "),r+=e);return r}const jt=t=>v.createElement("path",t),ct=v.forwardRef(({className:t,isPressed:e,...n},r)=>{const a={...n,className:uo(t,{"is-pressed":e})||void 0,"aria-hidden":!0,focusable:!1};return v.createElement("svg",{...a,ref:r})});ct.displayName="SVG";const mo=v.createElement(ct,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},v.createElement(jt,{d:"M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"})),po=v.createElement(ct,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},v.createElement(jt,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"})),ho=v.createElement(ct,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},v.createElement(jt,{d:"M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"})),go=[{name:"core/paragraph",title:"Paragraph",icon:v.createElement(ct,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},v.createElement(jt,{d:"m9.99609 14v-.2251l.00391.0001v6.225h1.5v-14.5h2.5v14.5h1.5v-14.5h3v-1.5h-8.50391c-2.76142 0-5 2.23858-5 5 0 2.7614 2.23858 5 5 5z"})),isPro:!1},{name:"core/list",title:"List",icon:ho,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-a-list-to-a-table-in-wordpress/"},{name:"tableberg/button",title:"Button",icon:mo,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-buttons-to-wordpress-tables/"},{name:"tableberg/image",title:"Image",icon:po,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-images-to-a-table-in-wordpress/"},{name:"tableberg/styled-list",title:"Styled List",icon:lo,isPro:!0,image:"styled_list_block_1.png",upsellText:"Elevate your lists with customizable icons as bullets for a polished look.",demoUrl:"https://tableberg.com/docs/how-to-add-styled-lists-in-wordpress-tables/"},{name:"tableberg/ribbon",title:"Ribbon",icon:co,isPro:!0,image:"ribbon_block_1.png",upsellText:"Overlay a decorative ribbon on your table, ideal for highlighting special offers or important notices.",demoUrl:"https://tableberg.com/docs/how-to-add-ribbons-to-wordpress-tables/"},{name:"tableberg/html",title:"Custom Html",icon:oo,isPro:!0,image:"html_block_1.png",upsellText:"Add your own HTML code to create specialized content and integrate custom elements.",demoUrl:"https://tableberg.com/docs/how-to-add-custom-html-to-wordpress-tables/"},{name:"tableberg/icon",title:"Icon",icon:io,isPro:!0,image:"icon_block_1.png",upsellText:"Add scalable icons to your tables to support text and enhance user engagement.",demoUrl:"https://tableberg.com/docs/how-to-add-icons-to-wordpress-tables/"},{name:"tableberg/star-rating",title:"Star Rating",icon:fo,isPro:!0,image:"star_rating_block_1.png",upsellText:"Add customizable star ratings, perfect for reviews and comparison tables.",demoUrl:"https://tableberg.com/docs/how-to-add-star-rating-in-wordpress/"}];function bo({title:t,name:e,iconElement:n,isPro:r,isProPlugin:a,showUpsell:s,demoUrl:o=null}){return l.jsx("div",{className:"tableberg-block-control","data-enabled":JSON.stringify(a?!0:!r),children:l.jsxs("div",{className:"tableberg-block-title",children:[l.jsxs("div",{className:"tableberg-block-title-left-container","data-demo":o!==null,children:[l.jsx("div",{className:"tableberg-title-icon",children:n}),l.jsxs("div",{className:"tableberg-title-text",children:[t,r&&l.jsx("span",{className:"tableberg-pro-block-card-title-suffix",children:"PRO"})]}),o&&l.jsx("div",{className:"tableberg-title-demo",children:l.jsx("a",{href:o,target:"_blank",rel:"noreferrer",className:"tableberg-strip-anchor-styles",children:X("See Documentation","tableberg")})})]}),r&&!a&&l.jsx("div",{className:"tableberg-block-title-right-container",children:l.jsx("div",{role:"button",className:"tableberg-pro-block-card-info-button",onClick:i=>{i.preventDefault(),s(e)},children:l.jsx(Et,{icon:Bs})})})]})})}function yo({info:t,onClose:e}){return l.jsxs("div",{className:"tableberg-upsell-modal",children:[l.jsx("div",{className:"tableberg-upsell-modal-backdrop"}),l.jsx("div",{className:"tableberg-upsell-modal-container",children:l.jsxs("div",{className:"tableberg-upsell-modal-area",children:[l.jsxs("h2",{children:[t.icon," ",t.title]}),l.jsxs("div",{className:"tableberg-upsell-modal-content",children:[l.jsx("img",{src:TABLEBERG_CFG.plugin_url+"includes/Admin/images/upsell/"+t.image,alt:t.title+" Demo"}),l.jsx("p",{children:t.upsellText}),l.jsxs("p",{children:["Limited Time: Use code ",l.jsx("b",{children:"TB20"})," to get a 20% discount."]})]}),l.jsxs("div",{className:"tableberg-upsell-modal-footer",children:[l.jsx("button",{onClick:e,children:"Cancel"}),l.jsx(Pt,{assetIds:["proBuyUrl"],children:({proBuyUrl:n})=>l.jsx("a",{href:n,children:"Buy PRO"})})]})]})})]})}function vo(){const[t,e]=v.useState(null);return l.jsxs("div",{style:{display:"flex",flexFlow:"column",gap:"30px"},children:[l.jsx("div",{className:"tableberg-controls-container controls-container","data-show-info":"false",children:go.map(n=>{const{title:r,name:a,icon:s,isPro:o,demoUrl:i}=n;return l.jsx(bo,{name:a,title:r,iconElement:s,isPro:o,showUpsell:()=>e(n),isProPlugin:tablebergAdminMenuData.misc.pro_status,demoUrl:i},a)})}),!tablebergAdminMenuData.misc.pro_status&&l.jsx(tr,{}),t&&l.jsx(yo,{info:t,onClose:()=>e(null)})]})}const nr=[{path:"welcome",title:"Welcome",element:l.jsx(so,{})},{path:"blocks",title:"Blocks",element:l.jsx(vo,{})},{path:"404",title:"404",element:l.jsx("div",{children:"404"})}],rr=Kn(nr);function xo({currentRoutePath:t,setCurrentRoutePath:e}){v.useEffect(()=>{const o=new URL(window.location.href);o.searchParams.set("route",t),window.history.pushState(null,null,o.href)},[t]);const n=v.useMemo(()=>rr.slice(0,rr.length-1),[]),r=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.assets.logo,a=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.versionControl,s=o=>{const{url:i,action:u,nonce:f}=a.ajax.versionRollback,m=new FormData;return m.append("action",u),m.append("nonce",f),m.append("version",o),fetch(i,{method:"POST",body:m}).then(c=>c.json()).then(c=>{if(c.error)throw new Error(c.error);return c})};return l.jsxs("div",{className:"header-wrapper",children:[l.jsxs("div",{className:"menu-header",children:[l.jsx("div",{className:"left-container",children:l.jsxs("div",{className:"logo-container",children:[l.jsx("img",{alt:"plugin logo",src:r}),l.jsx("div",{className:"tableberg-plugin-logo-text",children:"Tableberg"})]})}),l.jsx("div",{className:"tableberg-menu-navigation-wrapper",children:l.jsx(qn,{routes:n,currentRoutePath:t,setRoute:e})}),l.jsxs("div",{className:"right-container",children:[l.jsx(Te,{children:l.jsx("div",{className:"version-control-header-wrapper",children:l.jsx(Xn,{pluginVersion:a.currentVersion,allVersions:a.versions,onVersionRollBack:s})})}),!tablebergAdminMenuData.misc.pro_status&&l.jsx(Te,{children:l.jsx(Pt,{assetIds:["proBuyUrl"],children:({proBuyUrl:o})=>l.jsx(_t,{url:o,title:"Upgrade to PRO"})})})]})]}),l.jsx("div",{className:"dropdown-navigation",children:l.jsxs("div",{className:"dropdown-drawer",children:[l.jsx(qn,{routes:n,currentRoutePath:t,setRoute:e}),l.jsx("div",{className:"hamburger-version-control",children:l.jsx(Xn,{pluginVersion:a.currentVersion,allVersions:a.versions})})]})})]})}function ar({routes:t,currentRoutePath:e}){const[n,r]=v.useState(null);return v.useEffect(()=>{const a=t.find(s=>s.getPath()===e);if(a)r(a.getElement());else{const s=t[t.length-1];r(s.getElement())}},[e,t]),l.jsx("div",{className:"tableberg-router-content-wrapper","data-route-path":e,children:n},e)}function sr(){this.name="NoRouterComponentFoundError",this.message="No router component found within RouterProvider. Please make sure you have passed Router component as a child of RouterProvider."}sr.prototype=Error.prototype;function wo({children:t,currentRoutePath:e,setCurrentRoutePath:n}){const r=v.useMemo(()=>{const o=(t==null?void 0:t.type)===ar?t.type:null;if(o===null)throw new sr;return o},[e]),a=v.useMemo(()=>Kn(nr),[]),s=()=>{const i=new URL(window.location.href).searchParams.get("route");i&&n(i)};return v.useEffect(()=>{window.addEventListener("popstate",s)},[]),v.useEffect(()=>{s()},[]),v.useEffect(()=>{const o=new URL(window.location.href);o.searchParams.set("route",e),window.history.pushState(null,null,o.href)},[e]),l.jsx(r,{routes:a,currentRoutePath:e})}function Co({currentRoutePath:t,setCurrentRoutePath:e}){return l.jsx(wo,{currentRoutePath:t,setCurrentRoutePath:e,children:l.jsx(ar,{})})}function Ao(){const e=new URL(window.location.href).searchParams.get("route"),[n,r]=v.useState(e??"welcome");return l.jsxs("div",{className:"tableberg-admin-menu-container",children:[l.jsx(xo,{currentRoutePath:n,setCurrentRoutePath:r}),l.jsx(Co,{currentRoutePath:n,setCurrentRoutePath:r})]})}function Eo({children:t}){return v.useEffect(()=>{const e=document.querySelector("#wpcontent"),n=document.querySelector("#wpbody"),r=document.querySelector("#wpadminbar");if(n){const a=r?r.offsetHeight:0;n.style.height=`calc( 100vh - ${a}px)`,e.style.padding=0}},[]),l.jsx("div",{className:"tableberg-admin-menu-wrapper",children:t})}const or=document.querySelector("#tableberg-admin-menu");or&&G.createRoot(or).render(l.jsx(Eo,{children:l.jsx(Ao,{})}))});

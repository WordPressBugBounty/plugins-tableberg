(function(y,L){typeof exports=="object"&&typeof module<"u"?L(require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["react","react-dom"],L):(y=typeof globalThis<"u"?globalThis:y||self,L(y.React,y.ReactDOM))})(this,function(y,L){"use strict";var No=Object.defineProperty;var Fo=(y,L,q)=>L in y?No(y,L,{enumerable:!0,configurable:!0,writable:!0,value:q}):y[L]=q;var P=(y,L,q)=>Fo(y,typeof L!="symbol"?L+"":L,q);function q(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var xe={exports:{}},dt={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var la=y,ca=Symbol.for("react.element"),fa=Symbol.for("react.fragment"),ua=Object.prototype.hasOwnProperty,da=la.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ma={key:!0,ref:!0,__self:!0,__source:!0};function we(t,e,n){var a,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(a in e)ua.call(e,a)&&!ma.hasOwnProperty(a)&&(r[a]=e[a]);if(t&&t.defaultProps)for(a in e=t.defaultProps,e)r[a]===void 0&&(r[a]=e[a]);return{$$typeof:ca,type:t,key:s,ref:o,props:r,_owner:da.current}}dt.Fragment=fa,dt.jsx=we,dt.jsxs=we,xe.exports=dt;var i=xe.exports,Tt,Ae,at,Ce;Tt={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1},Ae=["(","?"],at={")":["("],":":["?","?:"]},Ce=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;function pa(t){for(var e=[],n=[],a,r,s,o;a=t.match(Ce);){for(r=a[0],s=t.substr(0,a.index).trim(),s&&e.push(s);o=n.pop();){if(at[r]){if(at[r][0]===o){r=at[r][1]||r;break}}else if(Ae.indexOf(o)>=0||Tt[o]<Tt[r]){n.push(o);break}e.push(o)}at[r]||n.push(r),t=t.substr(a.index+r.length)}return t=t.trim(),t&&e.push(t),e.concat(n.reverse())}var ha={"!":function(t){return!t},"*":function(t,e){return t*e},"/":function(t,e){return t/e},"%":function(t,e){return t%e},"+":function(t,e){return t+e},"-":function(t,e){return t-e},"<":function(t,e){return t<e},"<=":function(t,e){return t<=e},">":function(t,e){return t>e},">=":function(t,e){return t>=e},"==":function(t,e){return t===e},"!=":function(t,e){return t!==e},"&&":function(t,e){return t&&e},"||":function(t,e){return t||e},"?:":function(t,e,n){if(t)throw e;return n}};function ga(t,e){var n=[],a,r,s,o,l,u;for(a=0;a<t.length;a++){if(l=t[a],o=ha[l],o){for(r=o.length,s=Array(r);r--;)s[r]=n.pop();try{u=o.apply(null,s)}catch(c){return c}}else e.hasOwnProperty(l)?u=e[l]:u=+l;n.push(u)}return n[0]}function ba(t){var e=pa(t);return function(n){return ga(e,n)}}function ya(t){var e=ba(t);return function(n){return+e({n})}}var ke={contextDelimiter:"",onMissingKey:null};function va(t){var e,n,a;for(e=t.split(";"),n=0;n<e.length;n++)if(a=e[n].trim(),a.indexOf("plural=")===0)return a.substr(7)}function Nt(t,e){var n;this.data=t,this.pluralForms={},this.options={};for(n in ke)this.options[n]=e!==void 0&&n in e?e[n]:ke[n]}Nt.prototype.getPluralForm=function(t,e){var n=this.pluralForms[t],a,r,s;return n||(a=this.data[t][""],s=a["Plural-Forms"]||a["plural-forms"]||a.plural_forms,typeof s!="function"&&(r=va(a["Plural-Forms"]||a["plural-forms"]||a.plural_forms),s=ya(r)),n=this.pluralForms[t]=s),n(e)},Nt.prototype.dcnpgettext=function(t,e,n,a,r){var s,o,l;return r===void 0?s=0:s=this.getPluralForm(t,r),o=n,e&&(o=e+this.options.contextDelimiter+n),l=this.data[t][o],l&&l[s]?l[s]:(this.options.onMissingKey&&this.options.onMissingKey(n,t),s===0?n:a)};var _e={"":{plural_forms(t){return t===1?0:1}}},xa=/^i18n\.(n?gettext|has_translation)(_|$)/,wa=(t,e,n)=>{const a=new Nt({}),r=new Set,s=()=>{r.forEach(p=>p())},o=p=>(r.add(p),()=>r.delete(p)),l=(p="default")=>a.data[p],u=(p,h="default")=>{var x;a.data[h]={...a.data[h],...p},a.data[h][""]={..._e[""],...(x=a.data[h])==null?void 0:x[""]},delete a.pluralForms[h]},c=(p,h)=>{u(p,h),s()},d=(p,h="default")=>{var x;a.data[h]={...a.data[h],...p,"":{..._e[""],...(x=a.data[h])==null?void 0:x[""],...p==null?void 0:p[""]}},delete a.pluralForms[h],s()},b=(p,h)=>{a.data={},a.pluralForms={},c(p,h)},g=(p="default",h,x,S,I)=>(a.data[p]||u(void 0,p),a.dcnpgettext(p,h,x,S,I)),w=p=>p||"default",C=(p,h)=>{let x=g(h,void 0,p);return n?(x=n.applyFilters("i18n.gettext",x,p,h),n.applyFilters("i18n.gettext_"+w(h),x,p,h)):x},F=(p,h,x)=>{let S=g(x,h,p);return n?(S=n.applyFilters("i18n.gettext_with_context",S,p,h,x),n.applyFilters("i18n.gettext_with_context_"+w(x),S,p,h,x)):S},_=(p,h,x,S)=>{let I=g(S,void 0,p,h,x);return n?(I=n.applyFilters("i18n.ngettext",I,p,h,x,S),n.applyFilters("i18n.ngettext_"+w(S),I,p,h,x,S)):I},j=(p,h,x,S,I)=>{let K=g(I,S,p,h,x);return n?(K=n.applyFilters("i18n.ngettext_with_context",K,p,h,x,S,I),n.applyFilters("i18n.ngettext_with_context_"+w(I),K,p,h,x,S,I)):K},O=()=>F("ltr","text direction")==="rtl",T=(p,h,x)=>{var K,ia;const S=h?h+""+p:p;let I=!!((ia=(K=a.data)==null?void 0:K[x??"default"])!=null&&ia[S]);return n&&(I=n.applyFilters("i18n.has_translation",I,p,h,x),I=n.applyFilters("i18n.has_translation_"+w(x),I,p,h,x)),I};if(n){const p=h=>{xa.test(h)&&s()};n.addAction("hookAdded","core/i18n",p),n.addAction("hookRemoved","core/i18n",p)}return{getLocaleData:l,setLocaleData:c,addLocaleData:d,resetLocaleData:b,subscribe:o,__:C,_x:F,_n:_,_nx:j,isRTL:O,hasTranslation:T}};function Aa(t){return typeof t!="string"||t===""?(console.error("The namespace must be a non-empty string."),!1):/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(t)?!0:(console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes."),!1)}var Se=Aa;function Ca(t){return typeof t!="string"||t===""?(console.error("The hook name must be a non-empty string."),!1):/^__/.test(t)?(console.error("The hook name cannot begin with `__`."),!1):/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(t)?!0:(console.error("The hook name can only contain numbers, letters, dashes, periods and underscores."),!1)}var Ft=Ca;function ka(t,e){return function(a,r,s,o=10){const l=t[e];if(!Ft(a)||!Se(r))return;if(typeof s!="function"){console.error("The hook callback must be a function.");return}if(typeof o!="number"){console.error("If specified, the hook priority must be a number.");return}const u={callback:s,priority:o,namespace:r};if(l[a]){const c=l[a].handlers;let d;for(d=c.length;d>0&&!(o>=c[d-1].priority);d--);d===c.length?c[d]=u:c.splice(d,0,u),l.__current.forEach(b=>{b.name===a&&b.currentIndex>=d&&b.currentIndex++})}else l[a]={handlers:[u],runs:0};a!=="hookAdded"&&t.doAction("hookAdded",a,r,s,o)}}var Pe=ka;function _a(t,e,n=!1){return function(r,s){const o=t[e];if(!Ft(r)||!n&&!Se(s))return;if(!o[r])return 0;let l=0;if(n)l=o[r].handlers.length,o[r]={runs:o[r].runs,handlers:[]};else{const u=o[r].handlers;for(let c=u.length-1;c>=0;c--)u[c].namespace===s&&(u.splice(c,1),l++,o.__current.forEach(d=>{d.name===r&&d.currentIndex>=c&&d.currentIndex--}))}return r!=="hookRemoved"&&t.doAction("hookRemoved",r,s),l}}var mt=_a;function Sa(t,e){return function(a,r){const s=t[e];return typeof r<"u"?a in s&&s[a].handlers.some(o=>o.namespace===r):a in s}}var Ee=Sa;function Pa(t,e,n,a){return function(s,...o){const l=t[e];l[s]||(l[s]={handlers:[],runs:0}),l[s].runs++;const u=l[s].handlers;if(!u||!u.length)return n?o[0]:void 0;const c={name:s,currentIndex:0};async function d(){try{l.__current.add(c);let g=n?o[0]:void 0;for(;c.currentIndex<u.length;)g=await u[c.currentIndex].callback.apply(null,o),n&&(o[0]=g),c.currentIndex++;return n?g:void 0}finally{l.__current.delete(c)}}function b(){try{l.__current.add(c);let g=n?o[0]:void 0;for(;c.currentIndex<u.length;)g=u[c.currentIndex].callback.apply(null,o),n&&(o[0]=g),c.currentIndex++;return n?g:void 0}finally{l.__current.delete(c)}}return(a?d:b)()}}var pt=Pa;function Ea(t,e){return function(){var s;const a=t[e];return((s=Array.from(a.__current).at(-1))==null?void 0:s.name)??null}}var Oe=Ea;function Oa(t,e){return function(a){const r=t[e];return typeof a>"u"?r.__current.size>0:Array.from(r.__current).some(s=>s.name===a)}}var je=Oa;function ja(t,e){return function(a){const r=t[e];if(Ft(a))return r[a]&&r[a].runs?r[a].runs:0}}var Ie=ja,Ia=class{constructor(){P(this,"actions");P(this,"filters");P(this,"addAction");P(this,"addFilter");P(this,"removeAction");P(this,"removeFilter");P(this,"hasAction");P(this,"hasFilter");P(this,"removeAllActions");P(this,"removeAllFilters");P(this,"doAction");P(this,"doActionAsync");P(this,"applyFilters");P(this,"applyFiltersAsync");P(this,"currentAction");P(this,"currentFilter");P(this,"doingAction");P(this,"doingFilter");P(this,"didAction");P(this,"didFilter");this.actions=Object.create(null),this.actions.__current=new Set,this.filters=Object.create(null),this.filters.__current=new Set,this.addAction=Pe(this,"actions"),this.addFilter=Pe(this,"filters"),this.removeAction=mt(this,"actions"),this.removeFilter=mt(this,"filters"),this.hasAction=Ee(this,"actions"),this.hasFilter=Ee(this,"filters"),this.removeAllActions=mt(this,"actions",!0),this.removeAllFilters=mt(this,"filters",!0),this.doAction=pt(this,"actions",!1,!1),this.doActionAsync=pt(this,"actions",!1,!0),this.applyFilters=pt(this,"filters",!0,!1),this.applyFiltersAsync=pt(this,"filters",!0,!0),this.currentAction=Oe(this,"actions"),this.currentFilter=Oe(this,"filters"),this.doingAction=je(this,"actions"),this.doingFilter=je(this,"filters"),this.didAction=Ie(this,"actions"),this.didFilter=Ie(this,"filters")}};function Ta(){return new Ia}var Na=Ta,Te=Na(),{addAction:Lo,addFilter:Mo,removeAction:Ro,removeFilter:Do,hasAction:Ho,hasFilter:zo,removeAllActions:Uo,removeAllFilters:Vo,doAction:Bo,doActionAsync:Wo,applyFilters:Yo,applyFiltersAsync:Zo,currentAction:$o,currentFilter:Go,doingAction:Xo,doingFilter:Ko,didAction:qo,didFilter:Jo,actions:Qo,filters:ti}=Te,E=wa(void 0,void 0,Te);E.getLocaleData.bind(E),E.setLocaleData.bind(E),E.resetLocaleData.bind(E),E.subscribe.bind(E);var k=E.__.bind(E);E._x.bind(E),E._n.bind(E),E._nx.bind(E),E.isRTL.bind(E),E.hasTranslation.bind(E);function Fa({children:t,classNames:e=[]}){return i.jsx("div",{className:["right-container-item",...e].join(" "),children:t})}const La={path:null,title:"no_title",element:null};function Ma(t){const{path:e,title:n,element:a}={...La,...t};this.getPath=()=>e,this.getTitle=()=>n,this.getElement=()=>a??i.jsxs("div",{children:["no element defined for route [",this.getPath(),"]"]})}const Ne=t=>t.map(e=>new Ma(e));function Ra({title:t,targetPath:e,onClickHandler:n,isActive:a=!1}){const r=()=>n(e);return i.jsx("div",{"data-active":a,"data-path":e,className:"tableberg-menu-navigation-header-button",tabIndex:0,role:"button",onClick:r,onKeyDown:r,children:t})}function Fe({routes:t,currentRoutePath:e,setRoute:n}){const[a,r]=y.useState({});return y.useEffect(()=>{const s={gridTemplateColumns:`repeat(${t.length}, minmax(0,1fr))`};r(s)},[t]),i.jsx("div",{style:a,className:"tableberg-menu-navigation",children:t.map(s=>i.jsx(Ra,{title:s.getTitle(),targetPath:s.getPath(),isActive:e===s.getPath(),onClickHandler:n},s.getPath()))})}function Da({children:t}){return i.jsx("div",{className:"tableberg-box-content-title",children:t})}function Ha({children:t}){return i.jsx("div",{className:"tableberg-box-content-inc",children:t})}const za={VERTICAL:"vertical"},Lt={JUMBO:"jumbo",NORMAL:"normal"},Ua={LEFT:"left"};function Le({title:t=null,content:e=null,layout:n=za.VERTICAL,size:a=Lt.NORMAL,alignment:r=Ua.LEFT,children:s}){return i.jsxs("div",{className:"tableberg-box-content","data-layout":n,"data-size":a,"data-alignment":r,children:[i.jsxs("div",{className:"tableberg-box-content-title-inc-wrapper",children:[t&&i.jsx(Da,{children:t}),e&&i.jsx(Ha,{children:e})]}),s&&i.jsx("div",{className:"tableberg-box-content-footer",children:s})]})}function Me(t){this.name="ContentNotFoundError",this.message=`Content not found for key: [${t}]`}Me.prototype=Object.create(Error.prototype);const Va=t=>tablebergAdminMenuData==null?void 0:tablebergAdminMenuData[t];function ht(t){const[e,n]=y.useState(null),[a,r]=y.useState(null),[s,o]=y.useState({}),{contentId:l,...u}=t,c=Va(l);return y.useEffect(()=>{if(c){const{title:d,content:b}=c;n(d),r(b),o(u)}else throw new Me(l)},[]),i.jsx(Le,{...s,title:e,content:a,children:t.children})}function Ba({videoId:t,width:e=null,height:n=null}){const[a,r]=y.useState(null),s={width:"100",height:"100"};return y.useEffect(()=>{const o=`https://www.youtube.com/embed/${t}`;r(o)},[]),i.jsx("div",{className:"tableberg-youtube-embed",children:i.jsx("iframe",{width:e||s.width,height:n||s.height,src:a,title:"YouTube video player",allow:"picture-in-picture; web-share; fullscreen"})})}function Re(){this.name="ButtonLinkNoUrlError",this.message="No URL is provided for ButtonLink component."}Re.prototype=Object.create(Error.prototype);const gt={DEFAULT:"default",PRIMARY:"primary"};function bt({title:t,url:e=null,onClickHandler:n=null,type:a=gt.DEFAULT}){y.useEffect(()=>{if(!e&&!n)throw new Re},[]);const r=()=>{window.open(e,"_blank")},s=o=>{n&&typeof n=="function"?n(o):r()};return i.jsx("div",{className:"tableberg-button-link","data-buttonlink-type":a,onClick:s,role:"button",children:t})}function Wa({proStatus:t=!1,children:e,invert:n=!0}){const[a,r]=y.useState(!1);return y.useEffect(()=>{r(n?!t:t)},[]),a&&e}const Mt={proBuyUrl:"https://tableberg.com/pricing/",youtubeVideoId:"TKsL_bUVCTU",documentsUrl:"https://tableberg.com/docs/",supportUrl:"https://tableberg.com/contact/"};function yt({children:t,assetIds:e=[]}){const n=r=>Mt==null?void 0:Mt[r],a=e.reduce((r,s)=>(r[s]=n(s),r),{});return t(a)}function De(t){return i.jsx(yt,{assetIds:["proBuyUrl"],children:({proBuyUrl:e})=>i.jsx(Wa,{invert:!0,children:i.jsx(ht,{size:Lt.JUMBO,contentId:"upgrade",...t,children:i.jsx(bt,{url:e,title:"GET TABLEBERG PRO",type:gt.PRIMARY})})})})}function Ya(){return i.jsx(yt,{assetIds:["youtubeVideoId","documentsUrl","supportUrl","twitterUrl","facebookUrl","youtubeUrl"],children:({youtubeVideoId:t,documentsUrl:e,supportUrl:n,twitterUrl:a,facebookUrl:r,youtubeUrl:s})=>i.jsxs("div",{className:"tableberg-welcome-content",children:[i.jsxs("div",{className:"tableberg-welcome-content__main",children:[i.jsx(ht,{size:Lt.JUMBO,contentId:"welcome",children:i.jsx(Ba,{height:315,videoId:t})}),!tablebergAdminMenuData.misc.pro_status&&i.jsx(De,{})]}),i.jsxs("div",{className:"tableberg-welcome-content__right-sidebar",children:[i.jsx(ht,{contentId:"documentation",children:i.jsx(bt,{url:e,title:k("Visit Documents","tableberg"),type:gt.DEFAULT})}),i.jsx(ht,{contentId:"support",children:i.jsx(bt,{url:n,title:k("Support Forum","tableberg"),type:gt.DEFAULT})})]})]})})}const Za=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM10.8867 13.5671C10.6495 13.5035 10.5087 13.2598 10.5723 13.0226L12.3246 6.48302C12.3881 6.24585 12.6319 6.10511 12.8691 6.16866C13.1062 6.23221 13.247 6.47598 13.1834 6.71315L11.4311 13.2527C11.3676 13.4899 11.1238 13.6306 10.8867 13.5671ZM9.2624 12.9295C9.45766 13.1248 9.77424 13.1248 9.96951 12.9295C10.1648 12.7342 10.1648 12.4176 9.96951 12.2224L7.9686 10.2215C7.77333 10.0262 7.77333 9.70963 7.9686 9.51437L9.96951 7.51346C10.1648 7.3182 10.1648 7.00162 9.96951 6.80635C9.77424 6.61109 9.45766 6.61109 9.2624 6.80635L7.26149 8.80726C6.6757 9.39305 6.6757 10.3428 7.26149 10.9286L9.2624 12.9295ZM13.8853 6.8063C14.0805 6.61104 14.3971 6.61104 14.5924 6.8063L16.5933 8.80721C17.1791 9.393 17.1791 10.3427 16.5933 10.9285L14.5924 12.9294C14.3971 13.1247 14.0805 13.1247 13.8853 12.9294C13.69 12.7342 13.69 12.4176 13.8853 12.2223L15.8862 10.2214C16.0814 10.0262 16.0814 9.70958 15.8862 9.51432L13.8853 7.51341C13.69 7.31815 13.69 7.00157 13.8853 6.8063ZM7.478 15.2625H6.838V17.9465H7.478V16.8845H8.492V17.9465H9.138V15.2625H8.492V16.3205H7.478V15.2625ZM9.50056 15.2625V15.8165H10.2886V17.9465H10.9286V15.8165H11.7106V15.2625H9.50056ZM12.9884 15.2625H12.0724V17.9465H12.7124V16.166L13.3464 17.6965H13.7604L14.3624 16.2482V17.9465H15.0064V15.2625H14.1264L13.5574 16.6342L12.9884 15.2625ZM16.3257 17.3865V15.2625H15.6857V17.9465H17.3397V17.3865H16.3257Z",fill:"#671FEB"})]}),$a=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{d:"M8.34675 8C8.15525 8 8 8.15525 8 8.34675C8 8.53826 8.15525 8.69351 8.34675 8.69351H11.1362C11.3277 8.69351 11.483 8.53826 11.483 8.34675C11.483 8.15525 11.3277 8 11.1362 8H8.34675Z",fill:"#671FEB"}),i.jsx("path",{d:"M8 9.73374C8 9.54224 8.15525 9.38699 8.34675 9.38699H11.1362C11.3277 9.38699 11.483 9.54224 11.483 9.73374C11.483 9.92525 11.3277 10.0805 11.1362 10.0805H8.34675C8.15525 10.0805 8 9.92525 8 9.73374Z",fill:"#671FEB"}),i.jsx("path",{d:"M8.34675 10.774C8.15525 10.774 8 10.9292 8 11.1207C8 11.3122 8.15525 11.4675 8.34675 11.4675H11.1362C11.3277 11.4675 11.483 11.3122 11.483 11.1207C11.483 10.9292 11.3277 10.774 11.1362 10.774H8.34675Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.04375 15.4838C7.95182 15.6493 8.00927 15.8584 8.17377 15.9534C8.25764 16.0018 8.35329 16.0113 8.43981 15.9875H11.0432C11.1297 16.0113 11.2254 16.0018 11.3092 15.9534C11.4388 15.8786 11.502 15.7328 11.478 15.5934C11.4692 15.528 11.4422 15.4683 11.4022 15.4196L10.0467 13.0717C9.98154 12.9589 9.86272 12.8965 9.74114 12.898C9.6198 12.8967 9.50133 12.9592 9.43633 13.0717L8.06292 15.4505C8.05594 15.4613 8.04954 15.4724 8.04375 15.4838ZM8.95647 15.2926L9.7415 13.9329L10.5265 15.2926H8.95647Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.478 8H16.0487V11.4674H12.478V8ZM13.078 8.6H15.4487V10.8674H13.078V8.6Z",fill:"#671FEB"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8V12.258C16.7171 12.1048 16.3932 12.0178 16.0489 12.0178C14.9502 12.0178 14.0584 12.9038 14.049 14.0002C12.9524 14.0096 12.0665 14.9014 12.0665 16.0001C12.0665 16.3644 12.1638 16.7059 12.3339 17H8C7.44772 17 7 16.5523 7 16V8ZM16.0489 13.0178C16.4931 13.0178 16.8696 13.3074 17 13.7081C17.0317 13.8056 17.0489 13.9097 17.0489 14.0178V15.0001H18.0309C18.5832 15.0001 19.0309 15.4479 19.0309 16.0001C19.0309 16.5524 18.5832 17.0001 18.0309 17.0001H17.0489V17.9823C17.0489 18.5346 16.6012 18.9823 16.0489 18.9823C15.4966 18.9823 15.0489 18.5346 15.0489 17.9823V17.0001H14.0665L14.0491 17C13.5048 16.9908 13.0665 16.5466 13.0665 16.0001C13.0665 15.4479 13.5142 15.0001 14.0665 15.0001H15.0489V14.0178C15.0489 13.4655 15.4966 13.0178 16.0489 13.0178Z",fill:"#671FEB"})]}),Ga=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8ZM7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13ZM8 16C8 16.5523 7.55228 17 7 17C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15C7.55228 15 8 15.4477 8 16ZM11 7.5C10.7239 7.5 10.5 7.72386 10.5 8C10.5 8.27614 10.7239 8.5 11 8.5H17C17.2761 8.5 17.5 8.27614 17.5 8C17.5 7.72386 17.2761 7.5 17 7.5H11ZM10.5 12C10.5 11.7239 10.7239 11.5 11 11.5H17C17.2761 11.5 17.5 11.7239 17.5 12C17.5 12.2761 17.2761 12.5 17 12.5H11C10.7239 12.5 10.5 12.2761 10.5 12ZM11 15.5C10.7239 15.5 10.5 15.7239 10.5 16C10.5 16.2761 10.7239 16.5 11 16.5H17C17.2761 16.5 17.5 16.2761 17.5 16C17.5 15.7239 17.2761 15.5 17 15.5H11Z",fill:"#671feb"})]}),Xa=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM8 9.61388C11.1954 9.04964 12.9452 9.06689 16 9.61388V12.681C12.8757 12.2134 11.125 12.1847 8 12.681V9.61388ZM7.42857 11.7356H4L4 11.7356L6.28572 13.2692L4.00002 14.8027H9.71429V13.055C9.0129 13.105 8.26382 13.1765 7.42857 13.2694V11.7356ZM14.2857 13.0511V14.8028L20 14.8028L17.7143 13.2693L20 11.7358L20 11.7357H16.5714V13.2694C15.7384 13.1741 14.9903 13.1013 14.2857 13.0511Z",fill:"#671FEB"})]}),Ka=i.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("rect",{width:"24",height:"24",fill:"white"}),i.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM12 5.66844L13.9749 9.95014L18.6574 10.5053L15.1955 13.7067L16.1145 18.3316L12 16.0284L7.88549 18.3316L8.80444 13.7067L5.34259 10.5053L10.025 9.95014L12 5.66844ZM12 8.1066V14.9191L9.29297 16.4386L9.89453 13.4035L7.61328 11.2863L10.6992 10.9269L12 8.1066Z",fill:"#671feb"})]});function He(t){var e,n,a="";if(typeof t=="string"||typeof t=="number")a+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=He(t[e]))&&(a&&(a+=" "),a+=n)}else for(n in t)t[n]&&(a&&(a+=" "),a+=n);return a}function qa(){for(var t,e,n=0,a="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=He(t))&&(a&&(a+=" "),a+=e);return a}var vt=t=>y.createElement("path",t),rt=y.forwardRef(({className:t,isPressed:e,...n},a)=>{const r={...n,className:qa(t,{"is-pressed":e})||void 0,"aria-hidden":!0,focusable:!1};return i.jsx("svg",{...r,ref:a})});rt.displayName="SVG";var Ja=i.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:i.jsx(vt,{d:"M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"})}),Qa=i.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:i.jsx(vt,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"})}),tr=i.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:i.jsx(vt,{d:"M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"})}),er=i.jsx(rt,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:i.jsx(vt,{d:"m9.99609 14v-.2251l.00391.0001v6.225h1.5v-14.5h2.5v14.5h1.5v-14.5h3v-1.5h-8.50391c-2.76142 0-5 2.23858-5 5 0 2.7614 2.23858 5 5 5z"})});const nr=[{name:"core/paragraph",title:"Paragraph",icon:er,isPro:!1},{name:"core/list",title:"List",icon:tr,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-a-list-to-a-table-in-wordpress/"},{name:"tableberg/button",title:"Button",icon:Ja,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-buttons-to-wordpress-tables/"},{name:"tableberg/image",title:"Image",icon:Qa,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-images-to-a-table-in-wordpress/"},{name:"tableberg/styled-list",title:"Styled List",icon:Ga,isPro:!0,image:"styled_list_block_1.png",upsellText:"Elevate your lists with customizable icons as bullets for a polished look.",demoUrl:"https://tableberg.com/docs/how-to-add-styled-lists-in-wordpress-tables/"},{name:"tableberg/ribbon",title:"Ribbon",icon:Xa,isPro:!0,image:"ribbon_block_1.png",upsellText:"Overlay a decorative ribbon on your table, ideal for highlighting special offers or important notices.",demoUrl:"https://tableberg.com/docs/how-to-add-ribbons-to-wordpress-tables/"},{name:"tableberg/html",title:"Custom Html",icon:Za,isPro:!0,image:"html_block_1.png",upsellText:"Add your own HTML code to create specialized content and integrate custom elements.",demoUrl:"https://tableberg.com/docs/how-to-add-custom-html-to-wordpress-tables/"},{name:"tableberg/icon",title:"Icon",icon:$a,isPro:!0,image:"icon_block_1.png",upsellText:"Add scalable icons to your tables to support text and enhance user engagement.",demoUrl:"https://tableberg.com/docs/how-to-add-icons-to-wordpress-tables/"},{name:"tableberg/star-rating",title:"Star Rating",icon:Ka,isPro:!0,image:"star_rating_block_1.png",upsellText:"Add customizable star ratings, perfect for reviews and comparison tables.",demoUrl:"https://tableberg.com/docs/how-to-add-star-rating-in-wordpress/"}];/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function ar(t,e,n){return(e=sr(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function ze(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?ze(Object(n),!0).forEach(function(a){ar(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ze(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function rr(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var a=n.call(t,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function sr(t){var e=rr(t,"string");return typeof e=="symbol"?e:e+""}const Ue=()=>{};let Rt={},Ve={},Be=null,We={mark:Ue,measure:Ue};try{typeof window<"u"&&(Rt=window),typeof document<"u"&&(Ve=document),typeof MutationObserver<"u"&&(Be=MutationObserver),typeof performance<"u"&&(We=performance)}catch{}const{userAgent:Ye=""}=Rt.navigator||{},B=Rt,A=Ve,Ze=Be,xt=We;B.document;const z=!!A.documentElement&&!!A.head&&typeof A.addEventListener=="function"&&typeof A.createElement=="function",$e=~Ye.indexOf("MSIE")||~Ye.indexOf("Trident/");var or=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,ir=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,Ge={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},lr={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Xe=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],N="classic",wt="duotone",cr="sharp",fr="sharp-duotone",Ke=[N,wt,cr,fr],ur={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},dr={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},mr=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),pr={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},hr=["fak","fa-kit","fakd","fa-kit-duotone"],qe={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},gr=["kit"],br={kit:{"fa-kit":"fak"}},yr=["fak","fakd"],vr={kit:{fak:"fa-kit"}},Je={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},At={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},xr=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],wr=["fak","fa-kit","fakd","fa-kit-duotone"],Ar={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Cr={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},kr={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},Dt={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},_r=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Ht=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...xr,..._r],Sr=["solid","regular","light","thin","duotone","brands"],Qe=[1,2,3,4,5,6,7,8,9,10],Pr=Qe.concat([11,12,13,14,15,16,17,18,19,20]),Er=[...Object.keys(kr),...Sr,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",At.GROUP,At.SWAP_OPACITY,At.PRIMARY,At.SECONDARY].concat(Qe.map(t=>"".concat(t,"x"))).concat(Pr.map(t=>"w-".concat(t))),Or={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const U="___FONT_AWESOME___",zt=16,tn="fa",en="svg-inline--fa",$="data-fa-i2svg",Ut="data-fa-pseudo-element",jr="data-fa-pseudo-element-pending",Vt="data-prefix",Bt="data-icon",nn="fontawesome-i2svg",Ir="async",Tr=["HTML","HEAD","STYLE","SCRIPT"],an=(()=>{try{return!0}catch{return!1}})();function st(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[N]}})}const rn=f({},Ge);rn[N]=f(f(f(f({},{"fa-duotone":"duotone"}),Ge[N]),qe.kit),qe["kit-duotone"]);const Nr=st(rn),Wt=f({},pr);Wt[N]=f(f(f(f({},{duotone:"fad"}),Wt[N]),Je.kit),Je["kit-duotone"]);const sn=st(Wt),Yt=f({},Dt);Yt[N]=f(f({},Yt[N]),vr.kit);const Zt=st(Yt),$t=f({},Cr);$t[N]=f(f({},$t[N]),br.kit),st($t);const Fr=or,on="fa-layers-text",Lr=ir,Mr=f({},ur);st(Mr);const Rr=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Gt=lr,Dr=[...gr,...Er],ot=B.FontAwesomeConfig||{};function Hr(t){var e=A.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function zr(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}A&&typeof A.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=zr(Hr(n));r!=null&&(ot[a]=r)});const ln={styleDefault:"solid",familyDefault:N,cssPrefix:tn,replacementClass:en,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ot.familyPrefix&&(ot.cssPrefix=ot.familyPrefix);const J=f(f({},ln),ot);J.autoReplaceSvg||(J.observeMutations=!1);const m={};Object.keys(ln).forEach(t=>{Object.defineProperty(m,t,{enumerable:!0,set:function(e){J[t]=e,it.forEach(n=>n(m))},get:function(){return J[t]}})}),Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(t){J.cssPrefix=t,it.forEach(e=>e(m))},get:function(){return J.cssPrefix}}),B.FontAwesomeConfig=m;const it=[];function Ur(t){return it.push(t),()=>{it.splice(it.indexOf(t),1)}}const W=zt,R={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Vr(t){if(!t||!z)return;const e=A.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=A.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const s=n[r],o=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(a=s)}return A.head.insertBefore(e,a),t}const Br="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function lt(){let t=12,e="";for(;t-- >0;)e+=Br[Math.random()*62|0];return e}function Q(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function Xt(t){return t.classList?Q(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function cn(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Wr(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(cn(t[n]),'" '),"").trim()}function Ct(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Kt(t){return t.size!==R.size||t.x!==R.x||t.y!==R.y||t.rotate!==R.rotate||t.flipX||t.flipY}function Yr(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},s="translate(".concat(e.x*32,", ").concat(e.y*32,") "),o="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),l="rotate(".concat(e.rotate," 0 0)"),u={transform:"".concat(s," ").concat(o," ").concat(l)},c={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:u,path:c}}function Zr(t){let{transform:e,width:n=zt,height:a=zt,startCentered:r=!1}=t,s="";return r&&$e?s+="translate(".concat(e.x/W-n/2,"em, ").concat(e.y/W-a/2,"em) "):r?s+="translate(calc(-50% + ".concat(e.x/W,"em), calc(-50% + ").concat(e.y/W,"em)) "):s+="translate(".concat(e.x/W,"em, ").concat(e.y/W,"em) "),s+="scale(".concat(e.size/W*(e.flipX?-1:1),", ").concat(e.size/W*(e.flipY?-1:1),") "),s+="rotate(".concat(e.rotate,"deg) "),s}var $r=`:root, :host {
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
}`;function fn(){const t=tn,e=en,n=m.cssPrefix,a=m.replacementClass;let r=$r;if(n!==t||a!==e){const s=new RegExp("\\.".concat(t,"\\-"),"g"),o=new RegExp("\\--".concat(t,"\\-"),"g"),l=new RegExp("\\.".concat(e),"g");r=r.replace(s,".".concat(n,"-")).replace(o,"--".concat(n,"-")).replace(l,".".concat(a))}return r}let un=!1;function qt(){m.autoAddCss&&!un&&(Vr(fn()),un=!0)}var Gr={mixout(){return{dom:{css:fn,insertCss:qt}}},hooks(){return{beforeDOMElementCreation(){qt()},beforeI2svg(){qt()}}}};const V=B||{};V[U]||(V[U]={}),V[U].styles||(V[U].styles={}),V[U].hooks||(V[U].hooks={}),V[U].shims||(V[U].shims=[]);var D=V[U];const dn=[],mn=function(){A.removeEventListener("DOMContentLoaded",mn),kt=1,dn.map(t=>t())};let kt=!1;z&&(kt=(A.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(A.readyState),kt||A.addEventListener("DOMContentLoaded",mn));function Xr(t){z&&(kt?setTimeout(t,0):dn.push(t))}function ct(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?cn(t):"<".concat(e," ").concat(Wr(n),">").concat(a.map(ct).join(""),"</").concat(e,">")}function pn(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Jt=function(e,n,a,r){var s=Object.keys(e),o=s.length,l=n,u,c,d;for(a===void 0?(u=1,d=e[s[0]]):(u=0,d=a);u<o;u++)c=s[u],d=l(d,e[c],c,e);return d};function Kr(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const s=t.charCodeAt(n++);(s&64512)==56320?e.push(((r&1023)<<10)+(s&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function Qt(t){const e=Kr(t);return e.length===1?e[0].toString(16):null}function qr(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function hn(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function te(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=hn(e);typeof D.hooks.addPack=="function"&&!a?D.hooks.addPack(t,hn(e)):D.styles[t]=f(f({},D.styles[t]||{}),r),t==="fas"&&te("fa",e)}const{styles:ft,shims:Jr}=D,gn=Object.keys(Zt),Qr=gn.reduce((t,e)=>(t[e]=Object.keys(Zt[e]),t),{});let ee=null,bn={},yn={},vn={},xn={},wn={};function ts(t){return~Dr.indexOf(t)}function es(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!ts(r)?r:null}const An=()=>{const t=a=>Jt(ft,(r,s,o)=>(r[o]=Jt(s,a,{}),r),{});bn=t((a,r,s)=>(r[3]&&(a[r[3]]=s),r[2]&&r[2].filter(l=>typeof l=="number").forEach(l=>{a[l.toString(16)]=s}),a)),yn=t((a,r,s)=>(a[s]=s,r[2]&&r[2].filter(l=>typeof l=="string").forEach(l=>{a[l]=s}),a)),wn=t((a,r,s)=>{const o=r[2];return a[s]=s,o.forEach(l=>{a[l]=s}),a});const e="far"in ft||m.autoFetchSvg,n=Jt(Jr,(a,r)=>{const s=r[0];let o=r[1];const l=r[2];return o==="far"&&!e&&(o="fas"),typeof s=="string"&&(a.names[s]={prefix:o,iconName:l}),typeof s=="number"&&(a.unicodes[s.toString(16)]={prefix:o,iconName:l}),a},{names:{},unicodes:{}});vn=n.names,xn=n.unicodes,ee=_t(m.styleDefault,{family:m.familyDefault})};Ur(t=>{ee=_t(t.styleDefault,{family:m.familyDefault})}),An();function ne(t,e){return(bn[t]||{})[e]}function ns(t,e){return(yn[t]||{})[e]}function G(t,e){return(wn[t]||{})[e]}function Cn(t){return vn[t]||{prefix:null,iconName:null}}function as(t){const e=xn[t],n=ne("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function Y(){return ee}const kn=()=>({prefix:null,iconName:null,rest:[]});function rs(t){let e=N;const n=gn.reduce((a,r)=>(a[r]="".concat(m.cssPrefix,"-").concat(r),a),{});return Ke.forEach(a=>{(t.includes(n[a])||t.some(r=>Qr[a].includes(r)))&&(e=a)}),e}function _t(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=N}=e,a=Nr[n][t];if(n===wt&&!t)return"fad";const r=sn[n][t]||sn[n][a],s=t in D.styles?t:null;return r||s||null}function ss(t){let e=[],n=null;return t.forEach(a=>{const r=es(m.cssPrefix,a);r?n=r:a&&e.push(a)}),{iconName:n,rest:e}}function _n(t){return t.sort().filter((e,n,a)=>a.indexOf(e)===n)}function St(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let a=null;const r=Ht.concat(wr),s=_n(t.filter(b=>r.includes(b))),o=_n(t.filter(b=>!Ht.includes(b))),l=s.filter(b=>(a=b,!Xe.includes(b))),[u=null]=l,c=rs(s),d=f(f({},ss(o)),{},{prefix:_t(u,{family:c})});return f(f(f({},d),cs({values:t,family:c,styles:ft,config:m,canonical:d,givenPrefix:a})),os(n,a,d))}function os(t,e,n){let{prefix:a,iconName:r}=n;if(t||!a||!r)return{prefix:a,iconName:r};const s=e==="fa"?Cn(r):{},o=G(a,r);return r=s.iconName||o||r,a=s.prefix||a,a==="far"&&!ft.far&&ft.fas&&!m.autoFetchSvg&&(a="fas"),{prefix:a,iconName:r}}const is=Ke.filter(t=>t!==N||t!==wt),ls=Object.keys(Dt).filter(t=>t!==N).map(t=>Object.keys(Dt[t])).flat();function cs(t){const{values:e,family:n,canonical:a,givenPrefix:r="",styles:s={},config:o={}}=t,l=n===wt,u=e.includes("fa-duotone")||e.includes("fad"),c=o.familyDefault==="duotone",d=a.prefix==="fad"||a.prefix==="fa-duotone";if(!l&&(u||c||d)&&(a.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(a.prefix="fab"),!a.prefix&&is.includes(n)&&(Object.keys(s).find(g=>ls.includes(g))||o.autoFetchSvg)){const g=mr.get(n).defaultShortPrefixId;a.prefix=g,a.iconName=G(a.prefix,a.iconName)||a.iconName}return(a.prefix==="fa"||r==="fa")&&(a.prefix=Y()||"fas"),a}class fs{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(s=>{this.definitions[s]=f(f({},this.definitions[s]||{}),r[s]),te(s,r[s]);const o=Zt[N][s];o&&te(o,r[s]),An()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:s,iconName:o,icon:l}=a[r],u=l[2];e[s]||(e[s]={}),u.length>0&&u.forEach(c=>{typeof c=="string"&&(e[s][c]=l)}),e[s][o]=l}),e}}let Sn=[],tt={};const et={},us=Object.keys(et);function ds(t,e){let{mixoutsTo:n}=e;return Sn=t,tt={},Object.keys(et).forEach(a=>{us.indexOf(a)===-1&&delete et[a]}),Sn.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(s=>{typeof r[s]=="function"&&(n[s]=r[s]),typeof r[s]=="object"&&Object.keys(r[s]).forEach(o=>{n[s]||(n[s]={}),n[s][o]=r[s][o]})}),a.hooks){const s=a.hooks();Object.keys(s).forEach(o=>{tt[o]||(tt[o]=[]),tt[o].push(s[o])})}a.provides&&a.provides(et)}),n}function ae(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return(tt[t]||[]).forEach(o=>{e=o.apply(null,[e,...a])}),e}function X(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];(tt[t]||[]).forEach(s=>{s.apply(null,n)})}function Z(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return et[t]?et[t].apply(null,e):void 0}function re(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||Y();if(e)return e=G(n,e)||e,pn(Pn.definitions,n,e)||pn(D.styles,n,e)}const Pn=new fs,M={noAuto:()=>{m.autoReplaceSvg=!1,m.observeMutations=!1,X("noAuto")},config:m,dom:{i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return z?(X("beforeI2svg",t),Z("pseudoElements2svg",t),Z("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,Xr(()=>{ms({autoReplaceSvgRoot:e}),X("watch",t)})}},parse:{icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:G(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=_t(t[0]);return{prefix:n,iconName:G(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(m.cssPrefix,"-"))>-1||t.match(Fr))){const e=St(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||Y(),iconName:G(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=Y();return{prefix:e,iconName:G(e,t)||t}}}},library:Pn,findIconDefinition:re,toHtml:ct},ms=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=A}=t;(Object.keys(D.styles).length>0||m.autoFetchSvg)&&z&&m.autoReplaceSvg&&M.dom.i2svg({node:e})};function Pt(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>ct(n))}}),Object.defineProperty(t,"node",{get:function(){if(!z)return;const n=A.createElement("div");return n.innerHTML=t.html,n.children}}),t}function ps(t){let{children:e,main:n,mask:a,attributes:r,styles:s,transform:o}=t;if(Kt(o)&&n.found&&!a.found){const{width:l,height:u}=n,c={x:l/u/2,y:.5};r.style=Ct(f(f({},s),{},{"transform-origin":"".concat(c.x+o.x/16,"em ").concat(c.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:e}]}function hs(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:s}=t;const o=s===!0?"".concat(e,"-").concat(m.cssPrefix,"-").concat(n):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},r),{},{id:o}),children:a}]}]}function se(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:s,symbol:o,title:l,maskId:u,titleId:c,extra:d,watchable:b=!1}=t,{width:g,height:w}=n.found?n:e,C=yr.includes(a),F=[m.replacementClass,r?"".concat(m.cssPrefix,"-").concat(r):""].filter(h=>d.classes.indexOf(h)===-1).filter(h=>h!==""||!!h).concat(d.classes).join(" ");let _={children:[],attributes:f(f({},d.attributes),{},{"data-prefix":a,"data-icon":r,class:F,role:d.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(g," ").concat(w)})};const j=C&&!~d.classes.indexOf("fa-fw")?{width:"".concat(g/w*16*.0625,"em")}:{};b&&(_.attributes[$]=""),l&&(_.children.push({tag:"title",attributes:{id:_.attributes["aria-labelledby"]||"title-".concat(c||lt())},children:[l]}),delete _.attributes.title);const O=f(f({},_),{},{prefix:a,iconName:r,main:e,mask:n,maskId:u,transform:s,symbol:o,styles:f(f({},j),d.styles)}),{children:T,attributes:p}=n.found&&e.found?Z("generateAbstractMask",O)||{children:[],attributes:{}}:Z("generateAbstractIcon",O)||{children:[],attributes:{}};return O.children=T,O.attributes=p,o?hs(O):ps(O)}function En(t){const{content:e,width:n,height:a,transform:r,title:s,extra:o,watchable:l=!1}=t,u=f(f(f({},o.attributes),s?{title:s}:{}),{},{class:o.classes.join(" ")});l&&(u[$]="");const c=f({},o.styles);Kt(r)&&(c.transform=Zr({transform:r,startCentered:!0,width:n,height:a}),c["-webkit-transform"]=c.transform);const d=Ct(c);d.length>0&&(u.style=d);const b=[];return b.push({tag:"span",attributes:u,children:[e]}),s&&b.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),b}function gs(t){const{content:e,title:n,extra:a}=t,r=f(f(f({},a.attributes),n?{title:n}:{}),{},{class:a.classes.join(" ")}),s=Ct(a.styles);s.length>0&&(r.style=s);const o=[];return o.push({tag:"span",attributes:r,children:[e]}),n&&o.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),o}const{styles:oe}=D;function ie(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const bs={found:!1,width:512,height:512};function ys(t,e){!an&&!m.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function le(t,e){let n=e;return e==="fa"&&m.styleDefault!==null&&(e=Y()),new Promise((a,r)=>{if(n==="fa"){const s=Cn(t)||{};t=s.iconName||t,e=s.prefix||e}if(t&&e&&oe[e]&&oe[e][t]){const s=oe[e][t];return a(ie(s))}ys(t,e),a(f(f({},bs),{},{icon:m.showMissingIcons&&t?Z("missingIconAbstract")||{}:{}}))})}const On=()=>{},ce=m.measurePerformance&&xt&&xt.mark&&xt.measure?xt:{mark:On,measure:On},ut='FA "6.7.2"',vs=t=>(ce.mark("".concat(ut," ").concat(t," begins")),()=>jn(t)),jn=t=>{ce.mark("".concat(ut," ").concat(t," ends")),ce.measure("".concat(ut," ").concat(t),"".concat(ut," ").concat(t," begins"),"".concat(ut," ").concat(t," ends"))};var fe={begin:vs,end:jn};const Et=()=>{};function In(t){return typeof(t.getAttribute?t.getAttribute($):null)=="string"}function xs(t){const e=t.getAttribute?t.getAttribute(Vt):null,n=t.getAttribute?t.getAttribute(Bt):null;return e&&n}function ws(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(m.replacementClass)}function As(){return m.autoReplaceSvg===!0?Ot.replace:Ot[m.autoReplaceSvg]||Ot.replace}function Cs(t){return A.createElementNS("http://www.w3.org/2000/svg",t)}function ks(t){return A.createElement(t)}function Tn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?Cs:ks}=e;if(typeof t=="string")return A.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(s){a.setAttribute(s,t.attributes[s])}),(t.children||[]).forEach(function(s){a.appendChild(Tn(s,{ceFn:n}))}),a}function _s(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const Ot={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(Tn(n),e)}),e.getAttribute($)===null&&m.keepOriginalSource){let n=A.createComment(_s(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~Xt(e).indexOf(m.replacementClass))return Ot.replace(t);const a=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const s=n[0].attributes.class.split(" ").reduce((o,l)=>(l===m.replacementClass||l.match(a)?o.toSvg.push(l):o.toNode.push(l),o),{toNode:[],toSvg:[]});n[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",s.toNode.join(" "))}const r=n.map(s=>ct(s)).join(`
`);e.setAttribute($,""),e.innerHTML=r}};function Nn(t){t()}function Fn(t,e){const n=typeof e=="function"?e:Et;if(t.length===0)n();else{let a=Nn;m.mutateApproach===Ir&&(a=B.requestAnimationFrame||Nn),a(()=>{const r=As(),s=fe.begin("mutate");t.map(r),s(),n()})}}let ue=!1;function Ln(){ue=!0}function de(){ue=!1}let jt=null;function Mn(t){if(!Ze||!m.observeMutations)return;const{treeCallback:e=Et,nodeCallback:n=Et,pseudoElementsCallback:a=Et,observeMutationsRoot:r=A}=t;jt=new Ze(s=>{if(ue)return;const o=Y();Q(s).forEach(l=>{if(l.type==="childList"&&l.addedNodes.length>0&&!In(l.addedNodes[0])&&(m.searchPseudoElements&&a(l.target),e(l.target)),l.type==="attributes"&&l.target.parentNode&&m.searchPseudoElements&&a(l.target.parentNode),l.type==="attributes"&&In(l.target)&&~Rr.indexOf(l.attributeName))if(l.attributeName==="class"&&xs(l.target)){const{prefix:u,iconName:c}=St(Xt(l.target));l.target.setAttribute(Vt,u||o),c&&l.target.setAttribute(Bt,c)}else ws(l.target)&&n(l.target)})}),z&&jt.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Ss(){jt&&jt.disconnect()}function Ps(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const s=r.split(":"),o=s[0],l=s.slice(1);return o&&l.length>0&&(a[o]=l.join(":").trim()),a},{})),n}function Es(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=St(Xt(t));return r.prefix||(r.prefix=Y()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=ns(r.prefix,t.innerText)||ne(r.prefix,Qt(t.innerText))),!r.iconName&&m.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function Os(t){const e=Q(t.attributes).reduce((r,s)=>(r.name!=="class"&&r.name!=="style"&&(r[s.name]=s.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return m.autoA11y&&(n?e["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(a||lt()):(e["aria-hidden"]="true",e.focusable="false")),e}function js(){return{iconName:null,title:null,titleId:null,prefix:null,transform:R,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Rn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=Es(t),s=Os(t),o=ae("parseNodeAttributes",{},t);let l=e.styleParser?Ps(t):[];return f({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:R,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:l,attributes:s}},o)}const{styles:Is}=D;function Dn(t){const e=m.autoReplaceSvg==="nest"?Rn(t,{styleParser:!1}):Rn(t);return~e.extra.classes.indexOf(on)?Z("generateLayersText",t,e):Z("generateSvgReplacementMutation",t,e)}function Ts(){return[...hr,...Ht]}function Hn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!z)return Promise.resolve();const n=A.documentElement.classList,a=d=>n.add("".concat(nn,"-").concat(d)),r=d=>n.remove("".concat(nn,"-").concat(d)),s=m.autoFetchSvg?Ts():Xe.concat(Object.keys(Is));s.includes("fa")||s.push("fa");const o=[".".concat(on,":not([").concat($,"])")].concat(s.map(d=>".".concat(d,":not([").concat($,"])"))).join(", ");if(o.length===0)return Promise.resolve();let l=[];try{l=Q(t.querySelectorAll(o))}catch{}if(l.length>0)a("pending"),r("complete");else return Promise.resolve();const u=fe.begin("onTree"),c=l.reduce((d,b)=>{try{const g=Dn(b);g&&d.push(g)}catch(g){an||g.name==="MissingIcon"&&console.error(g)}return d},[]);return new Promise((d,b)=>{Promise.all(c).then(g=>{Fn(g,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),u(),d()})}).catch(g=>{u(),b(g)})})}function Ns(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Dn(t).then(n=>{n&&Fn([n],e)})}function Fs(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:re(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:re(r||{})),t(a,f(f({},n),{},{mask:r}))}}const Ls=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=R,symbol:a=!1,mask:r=null,maskId:s=null,title:o=null,titleId:l=null,classes:u=[],attributes:c={},styles:d={}}=e;if(!t)return;const{prefix:b,iconName:g,icon:w}=t;return Pt(f({type:"icon"},t),()=>(X("beforeDOMElementCreation",{iconDefinition:t,params:e}),m.autoA11y&&(o?c["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(l||lt()):(c["aria-hidden"]="true",c.focusable="false")),se({icons:{main:ie(w),mask:r?ie(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:b,iconName:g,transform:f(f({},R),n),symbol:a,title:o,maskId:s,titleId:l,extra:{attributes:c,styles:d,classes:u}})))};var Ms={mixout(){return{icon:Fs(Ls)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Hn,t.nodeCallback=Ns,t}}},provides(t){t.i2svg=function(e){const{node:n=A,callback:a=()=>{}}=e;return Hn(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:s,prefix:o,transform:l,symbol:u,mask:c,maskId:d,extra:b}=n;return new Promise((g,w)=>{Promise.all([le(a,o),c.iconName?le(c.iconName,c.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(C=>{let[F,_]=C;g([e,se({icons:{main:F,mask:_},prefix:o,iconName:a,transform:l,symbol:u,maskId:d,title:r,titleId:s,extra:b,watchable:!0})])}).catch(w)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:s,styles:o}=e;const l=Ct(o);l.length>0&&(a.style=l);let u;return Kt(s)&&(u=Z("generateAbstractTransformGrouping",{main:r,transform:s,containerWidth:r.width,iconWidth:r.width})),n.push(u||r.icon),{children:n,attributes:a}}}},Rs={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return Pt({type:"layer"},()=>{X("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(s=>{a=a.concat(s.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},Ds={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:s={}}=e;return Pt({type:"counter",content:t},()=>(X("beforeDOMElementCreation",{content:t,params:e}),gs({content:t.toString(),title:n,extra:{attributes:r,styles:s,classes:["".concat(m.cssPrefix,"-layers-counter"),...a]}})))}}}},Hs={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=R,title:a=null,classes:r=[],attributes:s={},styles:o={}}=e;return Pt({type:"text",content:t},()=>(X("beforeDOMElementCreation",{content:t,params:e}),En({content:t,transform:f(f({},R),n),title:a,extra:{attributes:s,styles:o,classes:["".concat(m.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:s}=n;let o=null,l=null;if($e){const u=parseInt(getComputedStyle(e).fontSize,10),c=e.getBoundingClientRect();o=c.width/u,l=c.height/u}return m.autoA11y&&!a&&(s.attributes["aria-hidden"]="true"),Promise.resolve([e,En({content:e.innerHTML,width:o,height:l,transform:r,title:a,extra:s,watchable:!0})])}}};const zs=new RegExp('"',"ug"),zn=[1105920,1112319],Un=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),dr),Or),Ar),me=Object.keys(Un).reduce((t,e)=>(t[e.toLowerCase()]=Un[e],t),{}),Us=Object.keys(me).reduce((t,e)=>{const n=me[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Vs(t){const e=t.replace(zs,""),n=qr(e,0),a=n>=zn[0]&&n<=zn[1],r=e.length===2?e[0]===e[1]:!1;return{value:Qt(r?e[0]:e),isSecondary:a||r}}function Bs(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return(me[n]||{})[r]||Us[n]}function Vn(t,e){const n="".concat(jr).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const o=Q(t.children).filter(g=>g.getAttribute(Ut)===e)[0],l=B.getComputedStyle(t,e),u=l.getPropertyValue("font-family"),c=u.match(Lr),d=l.getPropertyValue("font-weight"),b=l.getPropertyValue("content");if(o&&!c)return t.removeChild(o),a();if(c&&b!=="none"&&b!==""){const g=l.getPropertyValue("content");let w=Bs(u,d);const{value:C,isSecondary:F}=Vs(g),_=c[0].startsWith("FontAwesome");let j=ne(w,C),O=j;if(_){const T=as(C);T.iconName&&T.prefix&&(j=T.iconName,w=T.prefix)}if(j&&!F&&(!o||o.getAttribute(Vt)!==w||o.getAttribute(Bt)!==O)){t.setAttribute(n,O),o&&t.removeChild(o);const T=js(),{extra:p}=T;p.attributes[Ut]=e,le(j,w).then(h=>{const x=se(f(f({},T),{},{icons:{main:h,mask:kn()},prefix:w,iconName:O,extra:p,watchable:!0})),S=A.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(S,t.firstChild):t.appendChild(S),S.outerHTML=x.map(I=>ct(I)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function Ws(t){return Promise.all([Vn(t,"::before"),Vn(t,"::after")])}function Ys(t){return t.parentNode!==document.head&&!~Tr.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Ut)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Bn(t){if(z)return new Promise((e,n)=>{const a=Q(t.querySelectorAll("*")).filter(Ys).map(Ws),r=fe.begin("searchPseudoElements");Ln(),Promise.all(a).then(()=>{r(),de(),e()}).catch(()=>{r(),de(),n()})})}var Zs={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Bn,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=A}=e;m.searchPseudoElements&&Bn(n)}}};let Wn=!1;var $s={mixout(){return{dom:{unwatch(){Ln(),Wn=!0}}}},hooks(){return{bootstrap(){Mn(ae("mutationObserverCallbacks",{}))},noAuto(){Ss()},watch(t){const{observeMutationsRoot:e}=t;Wn?de():Mn(ae("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Yn=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),s=r[0];let o=r.slice(1).join("-");if(s&&o==="h")return n.flipX=!0,n;if(s&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(s){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},e)};var Gs={mixout(){return{parse:{transform:t=>Yn(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Yn(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:s}=e;const o={transform:"translate(".concat(r/2," 256)")},l="translate(".concat(a.x*32,", ").concat(a.y*32,") "),u="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),c="rotate(".concat(a.rotate," 0 0)"),d={transform:"".concat(l," ").concat(u," ").concat(c)},b={transform:"translate(".concat(s/2*-1," -256)")},g={outer:o,inner:d,path:b};return{tag:"g",attributes:f({},g.outer),children:[{tag:"g",attributes:f({},g.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:f(f({},n.icon.attributes),g.path)}]}]}}}};const pe={x:0,y:0,width:"100%",height:"100%"};function Zn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Xs(t){return t.tag==="g"?t.children:[t]}var Ks={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?St(n.split(" ").map(r=>r.trim())):kn();return a.prefix||(a.prefix=Y()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:s,maskId:o,transform:l}=e;const{width:u,icon:c}=r,{width:d,icon:b}=s,g=Yr({transform:l,containerWidth:d,iconWidth:u}),w={tag:"rect",attributes:f(f({},pe),{},{fill:"white"})},C=c.children?{children:c.children.map(Zn)}:{},F={tag:"g",attributes:f({},g.inner),children:[Zn(f({tag:c.tag,attributes:f(f({},c.attributes),g.path)},C))]},_={tag:"g",attributes:f({},g.outer),children:[F]},j="mask-".concat(o||lt()),O="clip-".concat(o||lt()),T={tag:"mask",attributes:f(f({},pe),{},{id:j,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[w,_]},p={tag:"defs",children:[{tag:"clipPath",attributes:{id:O},children:Xs(b)},T]};return n.push(p,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(O,")"),mask:"url(#".concat(j,")")},pe)}),{children:n,attributes:a}}}},qs={provides(t){let e=!1;B.matchMedia&&(e=B.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:f(f({},a),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const s=f(f({},r),{},{attributeName:"opacity"}),o={tag:"circle",attributes:f(f({},a),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||o.children.push({tag:"animate",attributes:f(f({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(o),n.push({tag:"path",attributes:f(f({},a),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:f(f({},s),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:f(f({},a),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Js={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},Qs=[Gr,Ms,Rs,Ds,Hs,Zs,$s,Gs,Ks,qs,Js];ds(Qs,{mixoutsTo:M}),M.noAuto,M.config,M.library,M.dom;const he=M.parse;M.findIconDefinition,M.toHtml;const to=M.icon;M.layer,M.text,M.counter;var $n={exports:{}},eo="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",no=eo,ao=no;function Gn(){}function Xn(){}Xn.resetWarningCache=Gn;var ro=function(){function t(a,r,s,o,l,u){if(u!==ao){var c=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}t.isRequired=t;function e(){return t}var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Xn,resetWarningCache:Gn};return n.PropTypes=n,n};$n.exports=ro();var so=$n.exports;const v=q(so);function Kn(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function H(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Kn(Object(n),!0).forEach(function(a){nt(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Kn(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function It(t){"@babel/helpers - typeof";return It=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},It(t)}function nt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function oo(t,e){if(t==null)return{};var n={},a=Object.keys(t),r,s;for(s=0;s<a.length;s++)r=a[s],!(e.indexOf(r)>=0)&&(n[r]=t[r]);return n}function io(t,e){if(t==null)return{};var n=oo(t,e),a,r;if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(r=0;r<s.length;r++)a=s[r],!(e.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}function ge(t){return lo(t)||co(t)||fo(t)||uo()}function lo(t){if(Array.isArray(t))return be(t)}function co(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function fo(t,e){if(t){if(typeof t=="string")return be(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return be(t,e)}}function be(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function uo(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function mo(t){var e,n=t.beat,a=t.fade,r=t.beatFade,s=t.bounce,o=t.shake,l=t.flash,u=t.spin,c=t.spinPulse,d=t.spinReverse,b=t.pulse,g=t.fixedWidth,w=t.inverse,C=t.border,F=t.listItem,_=t.flip,j=t.size,O=t.rotation,T=t.pull,p=(e={"fa-beat":n,"fa-fade":a,"fa-beat-fade":r,"fa-bounce":s,"fa-shake":o,"fa-flash":l,"fa-spin":u,"fa-spin-reverse":d,"fa-spin-pulse":c,"fa-pulse":b,"fa-fw":g,"fa-inverse":w,"fa-border":C,"fa-li":F,"fa-flip":_===!0,"fa-flip-horizontal":_==="horizontal"||_==="both","fa-flip-vertical":_==="vertical"||_==="both"},nt(e,"fa-".concat(j),typeof j<"u"&&j!==null),nt(e,"fa-rotate-".concat(O),typeof O<"u"&&O!==null&&O!==0),nt(e,"fa-pull-".concat(T),typeof T<"u"&&T!==null),nt(e,"fa-swap-opacity",t.swapOpacity),e);return Object.keys(p).map(function(h){return p[h]?h:null}).filter(function(h){return h})}function po(t){return t=t-0,t===t}function qn(t){return po(t)?t:(t=t.replace(/[\-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""}),t.substr(0,1).toLowerCase()+t.substr(1))}var ho=["style"];function go(t){return t.charAt(0).toUpperCase()+t.slice(1)}function bo(t){return t.split(";").map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,n){var a=n.indexOf(":"),r=qn(n.slice(0,a)),s=n.slice(a+1).trim();return r.startsWith("webkit")?e[go(r)]=s:e[r]=s,e},{})}function Jn(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var a=(e.children||[]).map(function(u){return Jn(t,u)}),r=Object.keys(e.attributes||{}).reduce(function(u,c){var d=e.attributes[c];switch(c){case"class":u.attrs.className=d,delete e.attributes.class;break;case"style":u.attrs.style=bo(d);break;default:c.indexOf("aria-")===0||c.indexOf("data-")===0?u.attrs[c.toLowerCase()]=d:u.attrs[qn(c)]=d}return u},{attrs:{}}),s=n.style,o=s===void 0?{}:s,l=io(n,ho);return r.attrs.style=H(H({},r.attrs.style),o),t.apply(void 0,[e.tag,H(H({},r.attrs),l)].concat(ge(a)))}var Qn=!1;try{Qn=!0}catch{}function yo(){if(!Qn&&console&&typeof console.error=="function"){var t;(t=console).error.apply(t,arguments)}}function ta(t){if(t&&It(t)==="object"&&t.prefix&&t.iconName&&t.icon)return t;if(he.icon)return he.icon(t);if(t===null)return null;if(t&&It(t)==="object"&&t.prefix&&t.iconName)return t;if(Array.isArray(t)&&t.length===2)return{prefix:t[0],iconName:t[1]};if(typeof t=="string")return{prefix:"fas",iconName:t}}function ye(t,e){return Array.isArray(e)&&e.length>0||!Array.isArray(e)&&e?nt({},t,e):{}}var ea={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},ve=y.forwardRef(function(t,e){var n=H(H({},ea),t),a=n.icon,r=n.mask,s=n.symbol,o=n.className,l=n.title,u=n.titleId,c=n.maskId,d=ta(a),b=ye("classes",[].concat(ge(mo(n)),ge((o||"").split(" ")))),g=ye("transform",typeof n.transform=="string"?he.transform(n.transform):n.transform),w=ye("mask",ta(r)),C=to(d,H(H(H(H({},b),g),w),{},{symbol:s,title:l,titleId:u,maskId:c}));if(!C)return yo("Could not find icon",d),null;var F=C.abstract,_={ref:e};return Object.keys(n).forEach(function(j){ea.hasOwnProperty(j)||(_[j]=n[j])}),vo(F[0],_)});ve.displayName="FontAwesomeIcon",ve.propTypes={beat:v.bool,border:v.bool,beatFade:v.bool,bounce:v.bool,className:v.string,fade:v.bool,flash:v.bool,mask:v.oneOfType([v.object,v.array,v.string]),maskId:v.string,fixedWidth:v.bool,inverse:v.bool,flip:v.oneOf([!0,!1,"horizontal","vertical","both"]),icon:v.oneOfType([v.object,v.array,v.string]),listItem:v.bool,pull:v.oneOf(["right","left"]),pulse:v.bool,rotation:v.oneOf([0,90,180,270]),shake:v.bool,size:v.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:v.bool,spinPulse:v.bool,spinReverse:v.bool,symbol:v.oneOfType([v.bool,v.string]),title:v.string,titleId:v.string,transform:v.oneOfType([v.string,v.object]),swapOpacity:v.bool};var vo=Jn.bind(null,y.createElement);/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const xo={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]};function wo({title:t,name:e,iconElement:n,isPro:a,isProPlugin:r,showUpsell:s,demoUrl:o=null}){return i.jsx("div",{className:"tableberg-block-control","data-enabled":JSON.stringify(r?!0:!a),children:i.jsxs("div",{className:"tableberg-block-title",children:[i.jsxs("div",{className:"tableberg-block-title-left-container","data-demo":o!==null,children:[i.jsx("div",{className:"tableberg-title-icon",children:n}),i.jsxs("div",{className:"tableberg-title-text",children:[t,a&&i.jsx("span",{className:"tableberg-pro-block-card-title-suffix",children:"PRO"})]}),o&&i.jsx("div",{className:"tableberg-title-demo",children:i.jsx("a",{href:o,target:"_blank",rel:"noreferrer",className:"tableberg-strip-anchor-styles",children:k("See Documentation","tableberg")})})]}),a&&!r&&i.jsx("div",{className:"tableberg-block-title-right-container",children:i.jsx("div",{role:"button",className:"tableberg-pro-block-card-info-button",onClick:l=>{l.preventDefault(),s(e)},children:i.jsx(ve,{icon:xo})})})]})})}function Ao({info:t,onClose:e}){return i.jsxs("div",{className:"tableberg-upsell-modal",children:[i.jsx("div",{className:"tableberg-upsell-modal-backdrop"}),i.jsx("div",{className:"tableberg-upsell-modal-container",children:i.jsxs("div",{className:"tableberg-upsell-modal-area",children:[i.jsxs("h2",{children:[t.icon," ",t.title]}),i.jsxs("div",{className:"tableberg-upsell-modal-content",children:[i.jsx("img",{src:TABLEBERG_CFG.plugin_url+"includes/Admin/images/upsell/"+t.image,alt:t.title+" Demo"}),i.jsx("p",{children:t.upsellText}),i.jsxs("p",{children:["Limited Time: Use code ",i.jsx("b",{children:"TB20"})," to get a 20% discount."]})]}),i.jsxs("div",{className:"tableberg-upsell-modal-footer",children:[i.jsx("button",{onClick:e,children:"Cancel"}),i.jsx(yt,{assetIds:["proBuyUrl"],children:({proBuyUrl:n})=>i.jsx("a",{href:n,children:"Buy PRO"})})]})]})})]})}function Co(){const[t,e]=y.useState(null);return i.jsxs("div",{style:{display:"flex",flexFlow:"column",gap:"30px"},children:[i.jsx("div",{className:"tableberg-controls-container controls-container","data-show-info":"false",children:nr.map(n=>{const{title:a,name:r,icon:s,isPro:o,demoUrl:l}=n;return i.jsx(wo,{name:r,title:a,iconElement:s,isPro:o,showUpsell:()=>e(n),isProPlugin:tablebergAdminMenuData.misc.pro_status,demoUrl:l},r)})}),!tablebergAdminMenuData.misc.pro_status&&i.jsx(De,{}),t&&i.jsx(Ao,{info:t,onClose:()=>e(null)})]})}const ko=async t=>{var u;const e=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings;if(!((u=e==null?void 0:e.ajax)!=null&&u.testConnection))throw new Error("AI settings not available");const{url:n,action:a,nonce:r}=e.ajax.testConnection,s=new FormData;return s.append("api_key",t),s.append("action",a),s.append("_wpnonce",r),await(await fetch(n,{method:"POST",body:s})).json()},_o=async t=>{var u;const e=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings;if(!((u=e==null?void 0:e.ajax)!=null&&u.saveSettings))throw new Error("AI settings not available");const{url:n,action:a,nonce:r}=e.ajax.saveSettings,s=new FormData;return s.append("settings",JSON.stringify(t)),s.append("action",a),s.append("_wpnonce",r),await(await fetch(n,{method:"POST",body:s})).json()};function So({apiKey:t="",onSettingsChange:e}){const[n,a]=y.useState(t),[r,s]=y.useState(!1),[o,l]=y.useState(!1),[u,c]=y.useState(null),[d,b]=y.useState(!1),g=async()=>{if(!n){c({success:!1,message:k("Please enter an API key","tableberg")});return}l(!0),c(null);try{const C=await ko(n);c({success:C.success,message:C.message||(C.success?k("Connection successful!","tableberg"):k("Connection failed. Please check your API key.","tableberg"))})}catch{c({success:!1,message:k("Error testing connection. Please try again.","tableberg")})}finally{l(!1)}},w=async()=>{b(!0);try{await _o({api_key:n}),e&&e({api_key:n})}catch{}finally{b(!1)}};return i.jsx("div",{className:"tableberg-ai-table-settings tableberg-settings-card",children:i.jsx(Le,{title:k("AI Table Settings","tableberg"),content:k("Configure your OpenAI API key to enable AI-powered table generation. This feature is available for Pro users only.","tableberg"),children:i.jsxs("div",{className:"tableberg-ai-settings-content",children:[i.jsxs("div",{className:"tableberg-api-key-field",children:[i.jsx("label",{htmlFor:"ai-api-key",children:k("OpenAI API Key","tableberg")}),i.jsxs("div",{className:"tableberg-api-key-input-wrapper",children:[i.jsx("input",{id:"ai-api-key",type:r?"text":"password",value:n,onChange:C=>a(C.target.value),placeholder:k("sk-…","tableberg"),className:"tableberg-api-key-input"}),i.jsx("button",{type:"button",onClick:()=>s(!r),className:"tableberg-toggle-visibility",children:k(r?"Hide":"Show","tableberg")})]}),i.jsxs("p",{className:"tableberg-help-text",children:[k("Get your API key from","tableberg")," ",i.jsx("a",{href:"https://platform.openai.com/api-keys",target:"_blank",rel:"noopener noreferrer",children:k("OpenAI Dashboard","tableberg")})]})]}),u&&i.jsx("div",{className:`tableberg-test-status ${u.success?"success":"error"}`,children:u.message}),i.jsxs("div",{className:"tableberg-ai-settings-actions",children:[i.jsx("button",{type:"button",onClick:g,disabled:o||!n,className:"tableberg-button tableberg-button-secondary",children:k(o?"Testing…":"Test Connection","tableberg")}),i.jsx("button",{type:"button",onClick:w,disabled:d,className:"tableberg-button tableberg-button-primary",children:k(d?"Saving…":"Save Settings","tableberg")})]})]})})})}function Po(){const t=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.ai_settings,e=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.is_pro;return i.jsx("div",{className:"tableberg-settings-content",children:e?i.jsx(So,{apiKey:(t==null?void 0:t.api_key)||"",onSettingsChange:n=>{}}):i.jsxs("div",{className:"tableberg-pro-notice",children:[i.jsx("h3",{children:k("AI Table Settings","tableberg")}),i.jsx("p",{children:k("AI Table features are available in Tableberg Pro. Upgrade to unlock AI-powered table generation.","tableberg")}),i.jsx("a",{href:"https://tableberg.com/pricing",target:"_blank",rel:"noopener noreferrer",className:"tableberg-button tableberg-button-primary",children:k("Upgrade to Pro","tableberg")})]})})}const na=[{path:"welcome",title:"Welcome",element:i.jsx(Ya,{})},{path:"blocks",title:"Blocks",element:i.jsx(Co,{})},{path:"settings",title:"Settings",element:i.jsx(Po,{})},{path:"404",title:"404",element:i.jsx("div",{children:"404"})}],aa=Ne(na);function Eo({currentRoutePath:t,setCurrentRoutePath:e}){y.useEffect(()=>{const r=new URL(window.location.href);r.searchParams.set("route",t),window.history.pushState(null,null,r.href)},[t]);const n=y.useMemo(()=>aa.slice(0,aa.length-1),[]),a=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.assets.logo;return i.jsxs("div",{className:"header-wrapper",children:[i.jsxs("div",{className:"menu-header",children:[i.jsx("div",{className:"left-container",children:i.jsxs("div",{className:"logo-container",children:[i.jsx("img",{alt:"plugin logo",src:a}),i.jsx("div",{className:"tableberg-plugin-logo-text",children:"Tableberg"})]})}),i.jsx("div",{className:"tableberg-menu-navigation-wrapper",children:i.jsx(Fe,{routes:n,currentRoutePath:t,setRoute:e})}),i.jsx("div",{className:"right-container",children:!tablebergAdminMenuData.misc.pro_status&&i.jsx(Fa,{children:i.jsx(yt,{assetIds:["proBuyUrl"],children:({proBuyUrl:r})=>i.jsx(bt,{url:r,title:"Upgrade to PRO"})})})})]}),i.jsx("div",{className:"dropdown-navigation",children:i.jsx("div",{className:"dropdown-drawer",children:i.jsx(Fe,{routes:n,currentRoutePath:t,setRoute:e})})})]})}function ra({routes:t,currentRoutePath:e}){const[n,a]=y.useState(null);return y.useEffect(()=>{const r=t.find(s=>s.getPath()===e);if(r)a(r.getElement());else{const s=t[t.length-1];a(s.getElement())}},[e,t]),i.jsx("div",{className:"tableberg-router-content-wrapper","data-route-path":e,children:n},e)}function sa(){this.name="NoRouterComponentFoundError",this.message="No router component found within RouterProvider. Please make sure you have passed Router component as a child of RouterProvider."}sa.prototype=Error.prototype;function Oo({children:t,currentRoutePath:e,setCurrentRoutePath:n}){const a=y.useMemo(()=>{const o=(t==null?void 0:t.type)===ra?t.type:null;if(o===null)throw new sa;return o},[e]),r=y.useMemo(()=>Ne(na),[]),s=()=>{const l=new URL(window.location.href).searchParams.get("route");l&&n(l)};return y.useEffect(()=>{window.addEventListener("popstate",s)},[]),y.useEffect(()=>{s()},[]),y.useEffect(()=>{const o=new URL(window.location.href);o.searchParams.set("route",e),window.history.pushState(null,null,o.href)},[e]),i.jsx(a,{routes:r,currentRoutePath:e})}function jo({currentRoutePath:t,setCurrentRoutePath:e}){return i.jsx(Oo,{currentRoutePath:t,setCurrentRoutePath:e,children:i.jsx(ra,{})})}function Io(){const e=new URL(window.location.href).searchParams.get("route"),[n,a]=y.useState(e??"welcome");return i.jsxs("div",{className:"tableberg-admin-menu-container",children:[i.jsx(Eo,{currentRoutePath:n,setCurrentRoutePath:a}),i.jsx(jo,{currentRoutePath:n,setCurrentRoutePath:a})]})}function To({children:t}){return y.useEffect(()=>{const e=document.querySelector("#wpcontent"),n=document.querySelector("#wpbody"),a=document.querySelector("#wpadminbar");if(n){const r=a?a.offsetHeight:0;n.style.height=`calc( 100vh - ${r}px)`,e.style.padding=0}},[]),i.jsx("div",{className:"tableberg-admin-menu-wrapper",children:t})}const oa=document.querySelector("#tableberg-admin-menu");oa&&L.createRoot(oa).render(i.jsx(To,{children:i.jsx(Io,{})}))});

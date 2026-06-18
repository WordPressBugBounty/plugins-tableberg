(function(y,N){typeof exports=="object"&&typeof module<"u"?N(require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["react","react-dom"],N):(y=typeof globalThis<"u"?globalThis:y||self,N(y.React,y.ReactDOM))})(this,function(y,N){"use strict";var Si=Object.defineProperty;var ji=(y,N,K)=>N in y?Si(y,N,{enumerable:!0,configurable:!0,writable:!0,value:K}):y[N]=K;var E=(y,N,K)=>ji(y,typeof N!="symbol"?N+"":N,K);function K(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var xe={exports:{}},ut={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sr=y,lr=Symbol.for("react.element"),cr=Symbol.for("react.fragment"),fr=Object.prototype.hasOwnProperty,ur=sr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,dr={key:!0,ref:!0,__self:!0,__source:!0};function we(t,e,n){var r,a={},o=null,i=null;n!==void 0&&(o=""+n),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(i=e.ref);for(r in e)fr.call(e,r)&&!dr.hasOwnProperty(r)&&(a[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)a[r]===void 0&&(a[r]=e[r]);return{$$typeof:lr,type:t,key:o,ref:i,props:a,_owner:ur.current}}ut.Fragment=cr,ut.jsx=we,ut.jsxs=we,xe.exports=ut;var l=xe.exports,It,Ae,nt,Ce;It={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1},Ae=["(","?"],nt={")":["("],":":["?","?:"]},Ce=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;function mr(t){for(var e=[],n=[],r,a,o,i;r=t.match(Ce);){for(a=r[0],o=t.substr(0,r.index).trim(),o&&e.push(o);i=n.pop();){if(nt[a]){if(nt[a][0]===i){a=nt[a][1]||a;break}}else if(Ae.indexOf(i)>=0||It[i]<It[a]){n.push(i);break}e.push(i)}nt[a]||n.push(a),t=t.substr(r.index+a.length)}return t=t.trim(),t&&e.push(t),e.concat(n.reverse())}var pr={"!":function(t){return!t},"*":function(t,e){return t*e},"/":function(t,e){return t/e},"%":function(t,e){return t%e},"+":function(t,e){return t+e},"-":function(t,e){return t-e},"<":function(t,e){return t<e},"<=":function(t,e){return t<=e},">":function(t,e){return t>e},">=":function(t,e){return t>=e},"==":function(t,e){return t===e},"!=":function(t,e){return t!==e},"&&":function(t,e){return t&&e},"||":function(t,e){return t||e},"?:":function(t,e,n){if(t)throw e;return n}};function hr(t,e){var n=[],r,a,o,i,s,u;for(r=0;r<t.length;r++){if(s=t[r],i=pr[s],i){for(a=i.length,o=Array(a);a--;)o[a]=n.pop();try{u=i.apply(null,o)}catch(c){return c}}else e.hasOwnProperty(s)?u=e[s]:u=+s;n.push(u)}return n[0]}function gr(t){var e=mr(t);return function(n){return hr(e,n)}}function br(t){var e=gr(t);return function(n){return+e({n})}}var _e={contextDelimiter:"",onMissingKey:null};function yr(t){var e,n,r;for(e=t.split(";"),n=0;n<e.length;n++)if(r=e[n].trim(),r.indexOf("plural=")===0)return r.substr(7)}function Tt(t,e){var n;this.data=t,this.pluralForms={},this.options={};for(n in _e)this.options[n]=e!==void 0&&n in e?e[n]:_e[n]}Tt.prototype.getPluralForm=function(t,e){var n=this.pluralForms[t],r,a,o;return n||(r=this.data[t][""],o=r["Plural-Forms"]||r["plural-forms"]||r.plural_forms,typeof o!="function"&&(a=yr(r["Plural-Forms"]||r["plural-forms"]||r.plural_forms),o=br(a)),n=this.pluralForms[t]=o),n(e)},Tt.prototype.dcnpgettext=function(t,e,n,r,a){var o,i,s;return a===void 0?o=0:o=this.getPluralForm(t,a),i=n,e&&(i=e+this.options.contextDelimiter+n),s=this.data[t][i],s&&s[o]?s[o]:(this.options.onMissingKey&&this.options.onMissingKey(n,t),o===0?n:r)};var Ee={"":{plural_forms(t){return t===1?0:1}}},vr=/^i18n\.(n?gettext|has_translation)(_|$)/,xr=(t,e,n)=>{const r=new Tt({}),a=new Set,o=()=>{a.forEach(p=>p())},i=p=>(a.add(p),()=>a.delete(p)),s=(p="default")=>r.data[p],u=(p,h="default")=>{var x;r.data[h]={...r.data[h],...p},r.data[h][""]={...Ee[""],...(x=r.data[h])==null?void 0:x[""]},delete r.pluralForms[h]},c=(p,h)=>{u(p,h),o()},d=(p,h="default")=>{var x;r.data[h]={...r.data[h],...p,"":{...Ee[""],...(x=r.data[h])==null?void 0:x[""],...p==null?void 0:p[""]}},delete r.pluralForms[h],o()},b=(p,h)=>{r.data={},r.pluralForms={},c(p,h)},g=(p="default",h,x,_,S)=>(r.data[p]||u(void 0,p),r.dcnpgettext(p,h,x,_,S)),w=p=>p||"default",T=(p,h)=>{let x=g(h,void 0,p);return n?(x=n.applyFilters("i18n.gettext",x,p,h),n.applyFilters("i18n.gettext_"+w(h),x,p,h)):x},F=(p,h,x)=>{let _=g(x,h,p);return n?(_=n.applyFilters("i18n.gettext_with_context",_,p,h,x),n.applyFilters("i18n.gettext_with_context_"+w(x),_,p,h,x)):_},C=(p,h,x,_)=>{let S=g(_,void 0,p,h,x);return n?(S=n.applyFilters("i18n.ngettext",S,p,h,x,_),n.applyFilters("i18n.ngettext_"+w(_),S,p,h,x,_)):S},O=(p,h,x,_,S)=>{let X=g(S,_,p,h,x);return n?(X=n.applyFilters("i18n.ngettext_with_context",X,p,h,x,_,S),n.applyFilters("i18n.ngettext_with_context_"+w(S),X,p,h,x,_,S)):X},P=()=>F("ltr","text direction")==="rtl",j=(p,h,x)=>{var X,ir;const _=h?h+""+p:p;let S=!!((ir=(X=r.data)==null?void 0:X[x??"default"])!=null&&ir[_]);return n&&(S=n.applyFilters("i18n.has_translation",S,p,h,x),S=n.applyFilters("i18n.has_translation_"+w(x),S,p,h,x)),S};if(n){const p=h=>{vr.test(h)&&o()};n.addAction("hookAdded","core/i18n",p),n.addAction("hookRemoved","core/i18n",p)}return{getLocaleData:s,setLocaleData:c,addLocaleData:d,resetLocaleData:b,subscribe:i,__:T,_x:F,_n:C,_nx:O,isRTL:P,hasTranslation:j}};function wr(t){return typeof t!="string"||t===""?(console.error("The namespace must be a non-empty string."),!1):/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(t)?!0:(console.error("The namespace can only contain numbers, letters, dashes, periods, underscores and slashes."),!1)}var ke=wr;function Ar(t){return typeof t!="string"||t===""?(console.error("The hook name must be a non-empty string."),!1):/^__/.test(t)?(console.error("The hook name cannot begin with `__`."),!1):/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(t)?!0:(console.error("The hook name can only contain numbers, letters, dashes, periods and underscores."),!1)}var Ft=Ar;function Cr(t,e){return function(r,a,o,i=10){const s=t[e];if(!Ft(r)||!ke(a))return;if(typeof o!="function"){console.error("The hook callback must be a function.");return}if(typeof i!="number"){console.error("If specified, the hook priority must be a number.");return}const u={callback:o,priority:i,namespace:a};if(s[r]){const c=s[r].handlers;let d;for(d=c.length;d>0&&!(i>=c[d-1].priority);d--);d===c.length?c[d]=u:c.splice(d,0,u),s.__current.forEach(b=>{b.name===r&&b.currentIndex>=d&&b.currentIndex++})}else s[r]={handlers:[u],runs:0};r!=="hookAdded"&&t.doAction("hookAdded",r,a,o,i)}}var Pe=Cr;function _r(t,e,n=!1){return function(a,o){const i=t[e];if(!Ft(a)||!n&&!ke(o))return;if(!i[a])return 0;let s=0;if(n)s=i[a].handlers.length,i[a]={runs:i[a].runs,handlers:[]};else{const u=i[a].handlers;for(let c=u.length-1;c>=0;c--)u[c].namespace===o&&(u.splice(c,1),s++,i.__current.forEach(d=>{d.name===a&&d.currentIndex>=c&&d.currentIndex--}))}return a!=="hookRemoved"&&t.doAction("hookRemoved",a,o),s}}var dt=_r;function Er(t,e){return function(r,a){const o=t[e];return typeof a<"u"?r in o&&o[r].handlers.some(i=>i.namespace===a):r in o}}var Oe=Er;function kr(t,e,n,r){return function(o,...i){const s=t[e];s[o]||(s[o]={handlers:[],runs:0}),s[o].runs++;const u=s[o].handlers;if(!u||!u.length)return n?i[0]:void 0;const c={name:o,currentIndex:0};async function d(){try{s.__current.add(c);let g=n?i[0]:void 0;for(;c.currentIndex<u.length;)g=await u[c.currentIndex].callback.apply(null,i),n&&(i[0]=g),c.currentIndex++;return n?g:void 0}finally{s.__current.delete(c)}}function b(){try{s.__current.add(c);let g=n?i[0]:void 0;for(;c.currentIndex<u.length;)g=u[c.currentIndex].callback.apply(null,i),n&&(i[0]=g),c.currentIndex++;return n?g:void 0}finally{s.__current.delete(c)}}return(r?d:b)()}}var mt=kr;function Pr(t,e){return function(){var o;const r=t[e];return((o=Array.from(r.__current).at(-1))==null?void 0:o.name)??null}}var Se=Pr;function Or(t,e){return function(r){const a=t[e];return typeof r>"u"?a.__current.size>0:Array.from(a.__current).some(o=>o.name===r)}}var je=Or;function Sr(t,e){return function(r){const a=t[e];if(Ft(r))return a[r]&&a[r].runs?a[r].runs:0}}var Ie=Sr,jr=class{constructor(){E(this,"actions");E(this,"filters");E(this,"addAction");E(this,"addFilter");E(this,"removeAction");E(this,"removeFilter");E(this,"hasAction");E(this,"hasFilter");E(this,"removeAllActions");E(this,"removeAllFilters");E(this,"doAction");E(this,"doActionAsync");E(this,"applyFilters");E(this,"applyFiltersAsync");E(this,"currentAction");E(this,"currentFilter");E(this,"doingAction");E(this,"doingFilter");E(this,"didAction");E(this,"didFilter");this.actions=Object.create(null),this.actions.__current=new Set,this.filters=Object.create(null),this.filters.__current=new Set,this.addAction=Pe(this,"actions"),this.addFilter=Pe(this,"filters"),this.removeAction=dt(this,"actions"),this.removeFilter=dt(this,"filters"),this.hasAction=Oe(this,"actions"),this.hasFilter=Oe(this,"filters"),this.removeAllActions=dt(this,"actions",!0),this.removeAllFilters=dt(this,"filters",!0),this.doAction=mt(this,"actions",!1,!1),this.doActionAsync=mt(this,"actions",!1,!0),this.applyFilters=mt(this,"filters",!0,!1),this.applyFiltersAsync=mt(this,"filters",!0,!0),this.currentAction=Se(this,"actions"),this.currentFilter=Se(this,"filters"),this.doingAction=je(this,"actions"),this.doingFilter=je(this,"filters"),this.didAction=Ie(this,"actions"),this.didFilter=Ie(this,"filters")}};function Ir(){return new jr}var Tr=Ir,Te=Tr(),{addAction:Ii,addFilter:Ti,removeAction:Fi,removeFilter:Ni,hasAction:Li,hasFilter:Mi,removeAllActions:Ri,removeAllFilters:Di,doAction:Hi,doActionAsync:zi,applyFilters:Ui,applyFiltersAsync:Vi,currentAction:Bi,currentFilter:Wi,doingAction:Yi,doingFilter:Zi,didAction:$i,didFilter:Gi,actions:Xi,filters:Ki}=Te,k=xr(void 0,void 0,Te);k.getLocaleData.bind(k),k.setLocaleData.bind(k),k.resetLocaleData.bind(k),k.subscribe.bind(k);var Nt=k.__.bind(k);k._x.bind(k),k._n.bind(k),k._nx.bind(k),k.isRTL.bind(k),k.hasTranslation.bind(k);function Fr({children:t,classNames:e=[]}){return l.jsx("div",{className:["right-container-item",...e].join(" "),children:t})}const Nr={path:null,title:"no_title",element:null};function Lr(t){const{path:e,title:n,element:r}={...Nr,...t};this.getPath=()=>e,this.getTitle=()=>n,this.getElement=()=>r??l.jsxs("div",{children:["no element defined for route [",this.getPath(),"]"]})}const Fe=t=>t.map(e=>new Lr(e));function Mr({title:t,targetPath:e,onClickHandler:n,isActive:r=!1}){const a=()=>n(e);return l.jsx("div",{"data-active":r,"data-path":e,className:"tableberg-menu-navigation-header-button",tabIndex:0,role:"button",onClick:a,onKeyDown:a,children:t})}function Ne({routes:t,currentRoutePath:e,setRoute:n}){const[r,a]=y.useState({});return y.useEffect(()=>{const o={gridTemplateColumns:`repeat(${t.length}, minmax(0,1fr))`};a(o)},[t]),l.jsx("div",{style:r,className:"tableberg-menu-navigation",children:t.map(o=>l.jsx(Mr,{title:o.getTitle(),targetPath:o.getPath(),isActive:e===o.getPath(),onClickHandler:n},o.getPath()))})}function Rr({children:t}){return l.jsx("div",{className:"tableberg-box-content-title",children:t})}function Dr({children:t}){return l.jsx("div",{className:"tableberg-box-content-inc",children:t})}const Hr={VERTICAL:"vertical"},Lt={JUMBO:"jumbo",NORMAL:"normal"},zr={LEFT:"left"};function Ur({title:t=null,content:e=null,layout:n=Hr.VERTICAL,size:r=Lt.NORMAL,alignment:a=zr.LEFT,children:o}){return l.jsxs("div",{className:"tableberg-box-content","data-layout":n,"data-size":r,"data-alignment":a,children:[l.jsxs("div",{className:"tableberg-box-content-title-inc-wrapper",children:[t&&l.jsx(Rr,{children:t}),e&&l.jsx(Dr,{children:e})]}),o&&l.jsx("div",{className:"tableberg-box-content-footer",children:o})]})}function Le(t){this.name="ContentNotFoundError",this.message=`Content not found for key: [${t}]`}Le.prototype=Object.create(Error.prototype);const Vr=t=>tablebergAdminMenuData==null?void 0:tablebergAdminMenuData[t];function pt(t){const[e,n]=y.useState(null),[r,a]=y.useState(null),[o,i]=y.useState({}),{contentId:s,...u}=t,c=Vr(s);return y.useEffect(()=>{if(c){const{title:d,content:b}=c;n(d),a(b),i(u)}else throw new Le(s)},[]),l.jsx(Ur,{...o,title:e,content:r,children:t.children})}function Br({videoId:t,width:e=null,height:n=null}){const[r,a]=y.useState(null),o={width:"100",height:"100"};return y.useEffect(()=>{const i=`https://www.youtube.com/embed/${t}`;a(i)},[]),l.jsx("div",{className:"tableberg-youtube-embed",children:l.jsx("iframe",{width:e||o.width,height:n||o.height,src:r,title:"YouTube video player",allow:"picture-in-picture; web-share; fullscreen"})})}function Me(){this.name="ButtonLinkNoUrlError",this.message="No URL is provided for ButtonLink component."}Me.prototype=Object.create(Error.prototype);const ht={DEFAULT:"default",PRIMARY:"primary"};function gt({title:t,url:e=null,onClickHandler:n=null,type:r=ht.DEFAULT}){y.useEffect(()=>{if(!e&&!n)throw new Me},[]);const a=()=>{window.open(e,"_blank")},o=i=>{n&&typeof n=="function"?n(i):a()};return l.jsx("div",{className:"tableberg-button-link","data-buttonlink-type":r,onClick:o,role:"button",children:t})}function Wr({proStatus:t=!1,children:e,invert:n=!0}){const[r,a]=y.useState(!1);return y.useEffect(()=>{a(n?!t:t)},[]),r&&e}const Mt={proBuyUrl:"https://tableberg.com/pricing/",youtubeVideoId:"TKsL_bUVCTU",documentsUrl:"https://tableberg.com/docs/",supportUrl:"https://tableberg.com/contact/"};function bt({children:t,assetIds:e=[]}){const n=a=>Mt==null?void 0:Mt[a],r=e.reduce((a,o)=>(a[o]=n(o),a),{});return t(r)}function Re(t){return l.jsx(bt,{assetIds:["proBuyUrl"],children:({proBuyUrl:e})=>l.jsx(Wr,{invert:!0,children:l.jsx(pt,{size:Lt.JUMBO,contentId:"upgrade",...t,children:l.jsx(gt,{url:e,title:"GET TABLEBERG PRO",type:ht.PRIMARY})})})})}function Yr(){return l.jsx(bt,{assetIds:["youtubeVideoId","documentsUrl","supportUrl","twitterUrl","facebookUrl","youtubeUrl"],children:({youtubeVideoId:t,documentsUrl:e,supportUrl:n,twitterUrl:r,facebookUrl:a,youtubeUrl:o})=>l.jsxs("div",{className:"tableberg-welcome-content",children:[l.jsxs("div",{className:"tableberg-welcome-content__main",children:[l.jsx(pt,{size:Lt.JUMBO,contentId:"welcome",children:l.jsx(Br,{height:315,videoId:t})}),!tablebergAdminMenuData.misc.pro_status&&l.jsx(Re,{})]}),l.jsxs("div",{className:"tableberg-welcome-content__right-sidebar",children:[l.jsx(pt,{contentId:"documentation",children:l.jsx(gt,{url:e,title:Nt("Visit Documents","tableberg"),type:ht.DEFAULT})}),l.jsx(pt,{contentId:"support",children:l.jsx(gt,{url:n,title:Nt("Support Forum","tableberg"),type:ht.DEFAULT})})]})]})})}const Zr=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM10.8867 13.5671C10.6495 13.5035 10.5087 13.2598 10.5723 13.0226L12.3246 6.48302C12.3881 6.24585 12.6319 6.10511 12.8691 6.16866C13.1062 6.23221 13.247 6.47598 13.1834 6.71315L11.4311 13.2527C11.3676 13.4899 11.1238 13.6306 10.8867 13.5671ZM9.2624 12.9295C9.45766 13.1248 9.77424 13.1248 9.96951 12.9295C10.1648 12.7342 10.1648 12.4176 9.96951 12.2224L7.9686 10.2215C7.77333 10.0262 7.77333 9.70963 7.9686 9.51437L9.96951 7.51346C10.1648 7.3182 10.1648 7.00162 9.96951 6.80635C9.77424 6.61109 9.45766 6.61109 9.2624 6.80635L7.26149 8.80726C6.6757 9.39305 6.6757 10.3428 7.26149 10.9286L9.2624 12.9295ZM13.8853 6.8063C14.0805 6.61104 14.3971 6.61104 14.5924 6.8063L16.5933 8.80721C17.1791 9.393 17.1791 10.3427 16.5933 10.9285L14.5924 12.9294C14.3971 13.1247 14.0805 13.1247 13.8853 12.9294C13.69 12.7342 13.69 12.4176 13.8853 12.2223L15.8862 10.2214C16.0814 10.0262 16.0814 9.70958 15.8862 9.51432L13.8853 7.51341C13.69 7.31815 13.69 7.00157 13.8853 6.8063ZM7.478 15.2625H6.838V17.9465H7.478V16.8845H8.492V17.9465H9.138V15.2625H8.492V16.3205H7.478V15.2625ZM9.50056 15.2625V15.8165H10.2886V17.9465H10.9286V15.8165H11.7106V15.2625H9.50056ZM12.9884 15.2625H12.0724V17.9465H12.7124V16.166L13.3464 17.6965H13.7604L14.3624 16.2482V17.9465H15.0064V15.2625H14.1264L13.5574 16.6342L12.9884 15.2625ZM16.3257 17.3865V15.2625H15.6857V17.9465H17.3397V17.3865H16.3257Z",fill:"#671FEB"})]}),$r=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{d:"M8.34675 8C8.15525 8 8 8.15525 8 8.34675C8 8.53826 8.15525 8.69351 8.34675 8.69351H11.1362C11.3277 8.69351 11.483 8.53826 11.483 8.34675C11.483 8.15525 11.3277 8 11.1362 8H8.34675Z",fill:"#671FEB"}),l.jsx("path",{d:"M8 9.73374C8 9.54224 8.15525 9.38699 8.34675 9.38699H11.1362C11.3277 9.38699 11.483 9.54224 11.483 9.73374C11.483 9.92525 11.3277 10.0805 11.1362 10.0805H8.34675C8.15525 10.0805 8 9.92525 8 9.73374Z",fill:"#671FEB"}),l.jsx("path",{d:"M8.34675 10.774C8.15525 10.774 8 10.9292 8 11.1207C8 11.3122 8.15525 11.4675 8.34675 11.4675H11.1362C11.3277 11.4675 11.483 11.3122 11.483 11.1207C11.483 10.9292 11.3277 10.774 11.1362 10.774H8.34675Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.04375 15.4838C7.95182 15.6493 8.00927 15.8584 8.17377 15.9534C8.25764 16.0018 8.35329 16.0113 8.43981 15.9875H11.0432C11.1297 16.0113 11.2254 16.0018 11.3092 15.9534C11.4388 15.8786 11.502 15.7328 11.478 15.5934C11.4692 15.528 11.4422 15.4683 11.4022 15.4196L10.0467 13.0717C9.98154 12.9589 9.86272 12.8965 9.74114 12.898C9.6198 12.8967 9.50133 12.9592 9.43633 13.0717L8.06292 15.4505C8.05594 15.4613 8.04954 15.4724 8.04375 15.4838ZM8.95647 15.2926L9.7415 13.9329L10.5265 15.2926H8.95647Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12.478 8H16.0487V11.4674H12.478V8ZM13.078 8.6H15.4487V10.8674H13.078V8.6Z",fill:"#671FEB"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8V12.258C16.7171 12.1048 16.3932 12.0178 16.0489 12.0178C14.9502 12.0178 14.0584 12.9038 14.049 14.0002C12.9524 14.0096 12.0665 14.9014 12.0665 16.0001C12.0665 16.3644 12.1638 16.7059 12.3339 17H8C7.44772 17 7 16.5523 7 16V8ZM16.0489 13.0178C16.4931 13.0178 16.8696 13.3074 17 13.7081C17.0317 13.8056 17.0489 13.9097 17.0489 14.0178V15.0001H18.0309C18.5832 15.0001 19.0309 15.4479 19.0309 16.0001C19.0309 16.5524 18.5832 17.0001 18.0309 17.0001H17.0489V17.9823C17.0489 18.5346 16.6012 18.9823 16.0489 18.9823C15.4966 18.9823 15.0489 18.5346 15.0489 17.9823V17.0001H14.0665L14.0491 17C13.5048 16.9908 13.0665 16.5466 13.0665 16.0001C13.0665 15.4479 13.5142 15.0001 14.0665 15.0001H15.0489V14.0178C15.0489 13.4655 15.4966 13.0178 16.0489 13.0178Z",fill:"#671FEB"})]}),Gr=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8ZM7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13ZM8 16C8 16.5523 7.55228 17 7 17C6.44772 17 6 16.5523 6 16C6 15.4477 6.44772 15 7 15C7.55228 15 8 15.4477 8 16ZM11 7.5C10.7239 7.5 10.5 7.72386 10.5 8C10.5 8.27614 10.7239 8.5 11 8.5H17C17.2761 8.5 17.5 8.27614 17.5 8C17.5 7.72386 17.2761 7.5 17 7.5H11ZM10.5 12C10.5 11.7239 10.7239 11.5 11 11.5H17C17.2761 11.5 17.5 11.7239 17.5 12C17.5 12.2761 17.2761 12.5 17 12.5H11C10.7239 12.5 10.5 12.2761 10.5 12ZM11 15.5C10.7239 15.5 10.5 15.7239 10.5 16C10.5 16.2761 10.7239 16.5 11 16.5H17C17.2761 16.5 17.5 16.2761 17.5 16C17.5 15.7239 17.2761 15.5 17 15.5H11Z",fill:"#671feb"})]}),Xr=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM8 9.61388C11.1954 9.04964 12.9452 9.06689 16 9.61388V12.681C12.8757 12.2134 11.125 12.1847 8 12.681V9.61388ZM7.42857 11.7356H4L4 11.7356L6.28572 13.2692L4.00002 14.8027H9.71429V13.055C9.0129 13.105 8.26382 13.1765 7.42857 13.2694V11.7356ZM14.2857 13.0511V14.8028L20 14.8028L17.7143 13.2693L20 11.7358L20 11.7357H16.5714V13.2694C15.7384 13.1741 14.9903 13.1013 14.2857 13.0511Z",fill:"#671FEB"})]}),Kr=l.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("rect",{width:"24",height:"24",fill:"white"}),l.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM12 5.66844L13.9749 9.95014L18.6574 10.5053L15.1955 13.7067L16.1145 18.3316L12 16.0284L7.88549 18.3316L8.80444 13.7067L5.34259 10.5053L10.025 9.95014L12 5.66844ZM12 8.1066V14.9191L9.29297 16.4386L9.89453 13.4035L7.61328 11.2863L10.6992 10.9269L12 8.1066Z",fill:"#671feb"})]});function De(t){var e,n,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var a=t.length;for(e=0;e<a;e++)t[e]&&(n=De(t[e]))&&(r&&(r+=" "),r+=n)}else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function qr(){for(var t,e,n=0,r="",a=arguments.length;n<a;n++)(t=arguments[n])&&(e=De(t))&&(r&&(r+=" "),r+=e);return r}var yt=t=>y.createElement("path",t),rt=y.forwardRef(({className:t,isPressed:e,...n},r)=>{const a={...n,className:qr(t,{"is-pressed":e})||void 0,"aria-hidden":!0,focusable:!1};return l.jsx("svg",{...a,ref:r})});rt.displayName="SVG";var Jr=l.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:l.jsx(yt,{d:"M8 12.5h8V11H8v1.5Z M19 6.5H5a2 2 0 0 0-2 2V15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2ZM5 8h14a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V8.5A.5.5 0 0 1 5 8Z"})}),Qr=l.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:l.jsx(yt,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"})}),ta=l.jsx(rt,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:l.jsx(yt,{d:"M4 4v1.5h16V4H4zm8 8.5h8V11h-8v1.5zM4 20h16v-1.5H4V20zm4-8c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"})}),ea=l.jsx(rt,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:l.jsx(yt,{d:"m9.99609 14v-.2251l.00391.0001v6.225h1.5v-14.5h2.5v14.5h1.5v-14.5h3v-1.5h-8.50391c-2.76142 0-5 2.23858-5 5 0 2.7614 2.23858 5 5 5z"})});const na=[{name:"core/paragraph",title:"Paragraph",icon:ea,isPro:!1},{name:"core/list",title:"List",icon:ta,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-a-list-to-a-table-in-wordpress/"},{name:"tableberg/button",title:"Button",icon:Jr,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-buttons-to-wordpress-tables/"},{name:"tableberg/image",title:"Image",icon:Qr,isPro:!1,demoUrl:"https://tableberg.com/docs/how-to-add-images-to-a-table-in-wordpress/"},{name:"tableberg/styled-list",title:"Styled List",icon:Gr,isPro:!0,image:"styled_list_block_1.png",upsellText:"Elevate your lists with customizable icons as bullets for a polished look.",demoUrl:"https://tableberg.com/docs/how-to-add-styled-lists-in-wordpress-tables/"},{name:"tableberg/ribbon",title:"Ribbon",icon:Xr,isPro:!0,image:"ribbon_block_1.png",upsellText:"Overlay a decorative ribbon on your table, ideal for highlighting special offers or important notices.",demoUrl:"https://tableberg.com/docs/how-to-add-ribbons-to-wordpress-tables/"},{name:"tableberg/html",title:"Custom Html",icon:Zr,isPro:!0,image:"html_block_1.png",upsellText:"Add your own HTML code to create specialized content and integrate custom elements.",demoUrl:"https://tableberg.com/docs/how-to-add-custom-html-to-wordpress-tables/"},{name:"tableberg/icon",title:"Icon",icon:$r,isPro:!0,image:"icon_block_1.png",upsellText:"Add scalable icons to your tables to support text and enhance user engagement.",demoUrl:"https://tableberg.com/docs/how-to-add-icons-to-wordpress-tables/"},{name:"tableberg/star-rating",title:"Star Rating",icon:Kr,isPro:!0,image:"star_rating_block_1.png",upsellText:"Add customizable star ratings, perfect for reviews and comparison tables.",demoUrl:"https://tableberg.com/docs/how-to-add-star-rating-in-wordpress/"}];/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function ra(t,e,n){return(e=oa(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function He(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function f(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?He(Object(n),!0).forEach(function(r){ra(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):He(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function aa(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function oa(t){var e=aa(t,"string");return typeof e=="symbol"?e:e+""}const ze=()=>{};let Rt={},Ue={},Ve=null,Be={mark:ze,measure:ze};try{typeof window<"u"&&(Rt=window),typeof document<"u"&&(Ue=document),typeof MutationObserver<"u"&&(Ve=MutationObserver),typeof performance<"u"&&(Be=performance)}catch{}const{userAgent:We=""}=Rt.navigator||{},V=Rt,A=Ue,Ye=Ve,vt=Be;V.document;const H=!!A.documentElement&&!!A.head&&typeof A.addEventListener=="function"&&typeof A.createElement=="function",Ze=~We.indexOf("MSIE")||~We.indexOf("Trident/");var ia=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,sa=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,$e={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},la={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Ge=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],I="classic",xt="duotone",ca="sharp",fa="sharp-duotone",Xe=[I,xt,ca,fa],ua={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},da={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},ma=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),pa={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},ha=["fak","fa-kit","fakd","fa-kit-duotone"],Ke={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},ga=["kit"],ba={kit:{"fa-kit":"fak"}},ya=["fak","fakd"],va={kit:{fak:"fa-kit"}},qe={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},wt={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},xa=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],wa=["fak","fa-kit","fakd","fa-kit-duotone"],Aa={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Ca={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},_a={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},Dt={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},Ea=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Ht=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...xa,...Ea],ka=["solid","regular","light","thin","duotone","brands"],Je=[1,2,3,4,5,6,7,8,9,10],Pa=Je.concat([11,12,13,14,15,16,17,18,19,20]),Oa=[...Object.keys(_a),...ka,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",wt.GROUP,wt.SWAP_OPACITY,wt.PRIMARY,wt.SECONDARY].concat(Je.map(t=>"".concat(t,"x"))).concat(Pa.map(t=>"w-".concat(t))),Sa={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const z="___FONT_AWESOME___",zt=16,Qe="fa",tn="svg-inline--fa",Z="data-fa-i2svg",Ut="data-fa-pseudo-element",ja="data-fa-pseudo-element-pending",Vt="data-prefix",Bt="data-icon",en="fontawesome-i2svg",Ia="async",Ta=["HTML","HEAD","STYLE","SCRIPT"],nn=(()=>{try{return!0}catch{return!1}})();function at(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[I]}})}const rn=f({},$e);rn[I]=f(f(f(f({},{"fa-duotone":"duotone"}),$e[I]),Ke.kit),Ke["kit-duotone"]);const Fa=at(rn),Wt=f({},pa);Wt[I]=f(f(f(f({},{duotone:"fad"}),Wt[I]),qe.kit),qe["kit-duotone"]);const an=at(Wt),Yt=f({},Dt);Yt[I]=f(f({},Yt[I]),va.kit);const Zt=at(Yt),$t=f({},Ca);$t[I]=f(f({},$t[I]),ba.kit),at($t);const Na=ia,on="fa-layers-text",La=sa,Ma=f({},ua);at(Ma);const Ra=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Gt=la,Da=[...ga,...Oa],ot=V.FontAwesomeConfig||{};function Ha(t){var e=A.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function za(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}A&&typeof A.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,r]=e;const a=za(Ha(n));a!=null&&(ot[r]=a)});const sn={styleDefault:"solid",familyDefault:I,cssPrefix:Qe,replacementClass:tn,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ot.familyPrefix&&(ot.cssPrefix=ot.familyPrefix);const q=f(f({},sn),ot);q.autoReplaceSvg||(q.observeMutations=!1);const m={};Object.keys(sn).forEach(t=>{Object.defineProperty(m,t,{enumerable:!0,set:function(e){q[t]=e,it.forEach(n=>n(m))},get:function(){return q[t]}})}),Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(t){q.cssPrefix=t,it.forEach(e=>e(m))},get:function(){return q.cssPrefix}}),V.FontAwesomeConfig=m;const it=[];function Ua(t){return it.push(t),()=>{it.splice(it.indexOf(t),1)}}const B=zt,M={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Va(t){if(!t||!H)return;const e=A.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=A.head.childNodes;let r=null;for(let a=n.length-1;a>-1;a--){const o=n[a],i=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(r=o)}return A.head.insertBefore(e,r),t}const Ba="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function st(){let t=12,e="";for(;t-- >0;)e+=Ba[Math.random()*62|0];return e}function J(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function Xt(t){return t.classList?J(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function ln(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Wa(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(ln(t[n]),'" '),"").trim()}function At(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Kt(t){return t.size!==M.size||t.x!==M.x||t.y!==M.y||t.rotate!==M.rotate||t.flipX||t.flipY}function Ya(t){let{transform:e,containerWidth:n,iconWidth:r}=t;const a={transform:"translate(".concat(n/2," 256)")},o="translate(".concat(e.x*32,", ").concat(e.y*32,") "),i="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),s="rotate(".concat(e.rotate," 0 0)"),u={transform:"".concat(o," ").concat(i," ").concat(s)},c={transform:"translate(".concat(r/2*-1," -256)")};return{outer:a,inner:u,path:c}}function Za(t){let{transform:e,width:n=zt,height:r=zt,startCentered:a=!1}=t,o="";return a&&Ze?o+="translate(".concat(e.x/B-n/2,"em, ").concat(e.y/B-r/2,"em) "):a?o+="translate(calc(-50% + ".concat(e.x/B,"em), calc(-50% + ").concat(e.y/B,"em)) "):o+="translate(".concat(e.x/B,"em, ").concat(e.y/B,"em) "),o+="scale(".concat(e.size/B*(e.flipX?-1:1),", ").concat(e.size/B*(e.flipY?-1:1),") "),o+="rotate(".concat(e.rotate,"deg) "),o}var $a=`:root, :host {
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
}`;function cn(){const t=Qe,e=tn,n=m.cssPrefix,r=m.replacementClass;let a=$a;if(n!==t||r!==e){const o=new RegExp("\\.".concat(t,"\\-"),"g"),i=new RegExp("\\--".concat(t,"\\-"),"g"),s=new RegExp("\\.".concat(e),"g");a=a.replace(o,".".concat(n,"-")).replace(i,"--".concat(n,"-")).replace(s,".".concat(r))}return a}let fn=!1;function qt(){m.autoAddCss&&!fn&&(Va(cn()),fn=!0)}var Ga={mixout(){return{dom:{css:cn,insertCss:qt}}},hooks(){return{beforeDOMElementCreation(){qt()},beforeI2svg(){qt()}}}};const U=V||{};U[z]||(U[z]={}),U[z].styles||(U[z].styles={}),U[z].hooks||(U[z].hooks={}),U[z].shims||(U[z].shims=[]);var R=U[z];const un=[],dn=function(){A.removeEventListener("DOMContentLoaded",dn),Ct=1,un.map(t=>t())};let Ct=!1;H&&(Ct=(A.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(A.readyState),Ct||A.addEventListener("DOMContentLoaded",dn));function Xa(t){H&&(Ct?setTimeout(t,0):un.push(t))}function lt(t){const{tag:e,attributes:n={},children:r=[]}=t;return typeof t=="string"?ln(t):"<".concat(e," ").concat(Wa(n),">").concat(r.map(lt).join(""),"</").concat(e,">")}function mn(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Jt=function(e,n,r,a){var o=Object.keys(e),i=o.length,s=n,u,c,d;for(r===void 0?(u=1,d=e[o[0]]):(u=0,d=r);u<i;u++)c=o[u],d=s(d,e[c],c,e);return d};function Ka(t){const e=[];let n=0;const r=t.length;for(;n<r;){const a=t.charCodeAt(n++);if(a>=55296&&a<=56319&&n<r){const o=t.charCodeAt(n++);(o&64512)==56320?e.push(((a&1023)<<10)+(o&1023)+65536):(e.push(a),n--)}else e.push(a)}return e}function Qt(t){const e=Ka(t);return e.length===1?e[0].toString(16):null}function qa(t,e){const n=t.length;let r=t.charCodeAt(e),a;return r>=55296&&r<=56319&&n>e+1&&(a=t.charCodeAt(e+1),a>=56320&&a<=57343)?(r-55296)*1024+a-56320+65536:r}function pn(t){return Object.keys(t).reduce((e,n)=>{const r=t[n];return!!r.icon?e[r.iconName]=r.icon:e[n]=r,e},{})}function te(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:r=!1}=n,a=pn(e);typeof R.hooks.addPack=="function"&&!r?R.hooks.addPack(t,pn(e)):R.styles[t]=f(f({},R.styles[t]||{}),a),t==="fas"&&te("fa",e)}const{styles:ct,shims:Ja}=R,hn=Object.keys(Zt),Qa=hn.reduce((t,e)=>(t[e]=Object.keys(Zt[e]),t),{});let ee=null,gn={},bn={},yn={},vn={},xn={};function to(t){return~Da.indexOf(t)}function eo(t,e){const n=e.split("-"),r=n[0],a=n.slice(1).join("-");return r===t&&a!==""&&!to(a)?a:null}const wn=()=>{const t=r=>Jt(ct,(a,o,i)=>(a[i]=Jt(o,r,{}),a),{});gn=t((r,a,o)=>(a[3]&&(r[a[3]]=o),a[2]&&a[2].filter(s=>typeof s=="number").forEach(s=>{r[s.toString(16)]=o}),r)),bn=t((r,a,o)=>(r[o]=o,a[2]&&a[2].filter(s=>typeof s=="string").forEach(s=>{r[s]=o}),r)),xn=t((r,a,o)=>{const i=a[2];return r[o]=o,i.forEach(s=>{r[s]=o}),r});const e="far"in ct||m.autoFetchSvg,n=Jt(Ja,(r,a)=>{const o=a[0];let i=a[1];const s=a[2];return i==="far"&&!e&&(i="fas"),typeof o=="string"&&(r.names[o]={prefix:i,iconName:s}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:i,iconName:s}),r},{names:{},unicodes:{}});yn=n.names,vn=n.unicodes,ee=_t(m.styleDefault,{family:m.familyDefault})};Ua(t=>{ee=_t(t.styleDefault,{family:m.familyDefault})}),wn();function ne(t,e){return(gn[t]||{})[e]}function no(t,e){return(bn[t]||{})[e]}function $(t,e){return(xn[t]||{})[e]}function An(t){return yn[t]||{prefix:null,iconName:null}}function ro(t){const e=vn[t],n=ne("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function W(){return ee}const Cn=()=>({prefix:null,iconName:null,rest:[]});function ao(t){let e=I;const n=hn.reduce((r,a)=>(r[a]="".concat(m.cssPrefix,"-").concat(a),r),{});return Xe.forEach(r=>{(t.includes(n[r])||t.some(a=>Qa[r].includes(a)))&&(e=r)}),e}function _t(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=I}=e,r=Fa[n][t];if(n===xt&&!t)return"fad";const a=an[n][t]||an[n][r],o=t in R.styles?t:null;return a||o||null}function oo(t){let e=[],n=null;return t.forEach(r=>{const a=eo(m.cssPrefix,r);a?n=a:r&&e.push(r)}),{iconName:n,rest:e}}function _n(t){return t.sort().filter((e,n,r)=>r.indexOf(e)===n)}function Et(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let r=null;const a=Ht.concat(wa),o=_n(t.filter(b=>a.includes(b))),i=_n(t.filter(b=>!Ht.includes(b))),s=o.filter(b=>(r=b,!Ge.includes(b))),[u=null]=s,c=ao(o),d=f(f({},oo(i)),{},{prefix:_t(u,{family:c})});return f(f(f({},d),co({values:t,family:c,styles:ct,config:m,canonical:d,givenPrefix:r})),io(n,r,d))}function io(t,e,n){let{prefix:r,iconName:a}=n;if(t||!r||!a)return{prefix:r,iconName:a};const o=e==="fa"?An(a):{},i=$(r,a);return a=o.iconName||i||a,r=o.prefix||r,r==="far"&&!ct.far&&ct.fas&&!m.autoFetchSvg&&(r="fas"),{prefix:r,iconName:a}}const so=Xe.filter(t=>t!==I||t!==xt),lo=Object.keys(Dt).filter(t=>t!==I).map(t=>Object.keys(Dt[t])).flat();function co(t){const{values:e,family:n,canonical:r,givenPrefix:a="",styles:o={},config:i={}}=t,s=n===xt,u=e.includes("fa-duotone")||e.includes("fad"),c=i.familyDefault==="duotone",d=r.prefix==="fad"||r.prefix==="fa-duotone";if(!s&&(u||c||d)&&(r.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(r.prefix="fab"),!r.prefix&&so.includes(n)&&(Object.keys(o).find(g=>lo.includes(g))||i.autoFetchSvg)){const g=ma.get(n).defaultShortPrefixId;r.prefix=g,r.iconName=$(r.prefix,r.iconName)||r.iconName}return(r.prefix==="fa"||a==="fa")&&(r.prefix=W()||"fas"),r}class fo{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];const a=n.reduce(this._pullDefinitions,{});Object.keys(a).forEach(o=>{this.definitions[o]=f(f({},this.definitions[o]||{}),a[o]),te(o,a[o]);const i=Zt[I][o];i&&te(i,a[o]),wn()})}reset(){this.definitions={}}_pullDefinitions(e,n){const r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(a=>{const{prefix:o,iconName:i,icon:s}=r[a],u=s[2];e[o]||(e[o]={}),u.length>0&&u.forEach(c=>{typeof c=="string"&&(e[o][c]=s)}),e[o][i]=s}),e}}let En=[],Q={};const tt={},uo=Object.keys(tt);function mo(t,e){let{mixoutsTo:n}=e;return En=t,Q={},Object.keys(tt).forEach(r=>{uo.indexOf(r)===-1&&delete tt[r]}),En.forEach(r=>{const a=r.mixout?r.mixout():{};if(Object.keys(a).forEach(o=>{typeof a[o]=="function"&&(n[o]=a[o]),typeof a[o]=="object"&&Object.keys(a[o]).forEach(i=>{n[o]||(n[o]={}),n[o][i]=a[o][i]})}),r.hooks){const o=r.hooks();Object.keys(o).forEach(i=>{Q[i]||(Q[i]=[]),Q[i].push(o[i])})}r.provides&&r.provides(tt)}),n}function re(t,e){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];return(Q[t]||[]).forEach(i=>{e=i.apply(null,[e,...r])}),e}function G(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];(Q[t]||[]).forEach(o=>{o.apply(null,n)})}function Y(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return tt[t]?tt[t].apply(null,e):void 0}function ae(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||W();if(e)return e=$(n,e)||e,mn(kn.definitions,n,e)||mn(R.styles,n,e)}const kn=new fo,L={noAuto:()=>{m.autoReplaceSvg=!1,m.observeMutations=!1,G("noAuto")},config:m,dom:{i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return H?(G("beforeI2svg",t),Y("pseudoElements2svg",t),Y("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,Xa(()=>{po({autoReplaceSvgRoot:e}),G("watch",t)})}},parse:{icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:$(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=_t(t[0]);return{prefix:n,iconName:$(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(m.cssPrefix,"-"))>-1||t.match(Na))){const e=Et(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||W(),iconName:$(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=W();return{prefix:e,iconName:$(e,t)||t}}}},library:kn,findIconDefinition:ae,toHtml:lt},po=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=A}=t;(Object.keys(R.styles).length>0||m.autoFetchSvg)&&H&&m.autoReplaceSvg&&L.dom.i2svg({node:e})};function kt(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>lt(n))}}),Object.defineProperty(t,"node",{get:function(){if(!H)return;const n=A.createElement("div");return n.innerHTML=t.html,n.children}}),t}function ho(t){let{children:e,main:n,mask:r,attributes:a,styles:o,transform:i}=t;if(Kt(i)&&n.found&&!r.found){const{width:s,height:u}=n,c={x:s/u/2,y:.5};a.style=At(f(f({},o),{},{"transform-origin":"".concat(c.x+i.x/16,"em ").concat(c.y+i.y/16,"em")}))}return[{tag:"svg",attributes:a,children:e}]}function go(t){let{prefix:e,iconName:n,children:r,attributes:a,symbol:o}=t;const i=o===!0?"".concat(e,"-").concat(m.cssPrefix,"-").concat(n):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},a),{},{id:i}),children:r}]}]}function oe(t){const{icons:{main:e,mask:n},prefix:r,iconName:a,transform:o,symbol:i,title:s,maskId:u,titleId:c,extra:d,watchable:b=!1}=t,{width:g,height:w}=n.found?n:e,T=ya.includes(r),F=[m.replacementClass,a?"".concat(m.cssPrefix,"-").concat(a):""].filter(h=>d.classes.indexOf(h)===-1).filter(h=>h!==""||!!h).concat(d.classes).join(" ");let C={children:[],attributes:f(f({},d.attributes),{},{"data-prefix":r,"data-icon":a,class:F,role:d.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(g," ").concat(w)})};const O=T&&!~d.classes.indexOf("fa-fw")?{width:"".concat(g/w*16*.0625,"em")}:{};b&&(C.attributes[Z]=""),s&&(C.children.push({tag:"title",attributes:{id:C.attributes["aria-labelledby"]||"title-".concat(c||st())},children:[s]}),delete C.attributes.title);const P=f(f({},C),{},{prefix:r,iconName:a,main:e,mask:n,maskId:u,transform:o,symbol:i,styles:f(f({},O),d.styles)}),{children:j,attributes:p}=n.found&&e.found?Y("generateAbstractMask",P)||{children:[],attributes:{}}:Y("generateAbstractIcon",P)||{children:[],attributes:{}};return P.children=j,P.attributes=p,i?go(P):ho(P)}function Pn(t){const{content:e,width:n,height:r,transform:a,title:o,extra:i,watchable:s=!1}=t,u=f(f(f({},i.attributes),o?{title:o}:{}),{},{class:i.classes.join(" ")});s&&(u[Z]="");const c=f({},i.styles);Kt(a)&&(c.transform=Za({transform:a,startCentered:!0,width:n,height:r}),c["-webkit-transform"]=c.transform);const d=At(c);d.length>0&&(u.style=d);const b=[];return b.push({tag:"span",attributes:u,children:[e]}),o&&b.push({tag:"span",attributes:{class:"sr-only"},children:[o]}),b}function bo(t){const{content:e,title:n,extra:r}=t,a=f(f(f({},r.attributes),n?{title:n}:{}),{},{class:r.classes.join(" ")}),o=At(r.styles);o.length>0&&(a.style=o);const i=[];return i.push({tag:"span",attributes:a,children:[e]}),n&&i.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),i}const{styles:ie}=R;function se(t){const e=t[0],n=t[1],[r]=t.slice(4);let a=null;return Array.isArray(r)?a={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Gt.PRIMARY),fill:"currentColor",d:r[1]}}]}:a={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:e,height:n,icon:a}}const yo={found:!1,width:512,height:512};function vo(t,e){!nn&&!m.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function le(t,e){let n=e;return e==="fa"&&m.styleDefault!==null&&(e=W()),new Promise((r,a)=>{if(n==="fa"){const o=An(t)||{};t=o.iconName||t,e=o.prefix||e}if(t&&e&&ie[e]&&ie[e][t]){const o=ie[e][t];return r(se(o))}vo(t,e),r(f(f({},yo),{},{icon:m.showMissingIcons&&t?Y("missingIconAbstract")||{}:{}}))})}const On=()=>{},ce=m.measurePerformance&&vt&&vt.mark&&vt.measure?vt:{mark:On,measure:On},ft='FA "6.7.2"',xo=t=>(ce.mark("".concat(ft," ").concat(t," begins")),()=>Sn(t)),Sn=t=>{ce.mark("".concat(ft," ").concat(t," ends")),ce.measure("".concat(ft," ").concat(t),"".concat(ft," ").concat(t," begins"),"".concat(ft," ").concat(t," ends"))};var fe={begin:xo,end:Sn};const Pt=()=>{};function jn(t){return typeof(t.getAttribute?t.getAttribute(Z):null)=="string"}function wo(t){const e=t.getAttribute?t.getAttribute(Vt):null,n=t.getAttribute?t.getAttribute(Bt):null;return e&&n}function Ao(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(m.replacementClass)}function Co(){return m.autoReplaceSvg===!0?Ot.replace:Ot[m.autoReplaceSvg]||Ot.replace}function _o(t){return A.createElementNS("http://www.w3.org/2000/svg",t)}function Eo(t){return A.createElement(t)}function In(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?_o:Eo}=e;if(typeof t=="string")return A.createTextNode(t);const r=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(o){r.setAttribute(o,t.attributes[o])}),(t.children||[]).forEach(function(o){r.appendChild(In(o,{ceFn:n}))}),r}function ko(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const Ot={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(In(n),e)}),e.getAttribute(Z)===null&&m.keepOriginalSource){let n=A.createComment(ko(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~Xt(e).indexOf(m.replacementClass))return Ot.replace(t);const r=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const o=n[0].attributes.class.split(" ").reduce((i,s)=>(s===m.replacementClass||s.match(r)?i.toSvg.push(s):i.toNode.push(s),i),{toNode:[],toSvg:[]});n[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",o.toNode.join(" "))}const a=n.map(o=>lt(o)).join(`
`);e.setAttribute(Z,""),e.innerHTML=a}};function Tn(t){t()}function Fn(t,e){const n=typeof e=="function"?e:Pt;if(t.length===0)n();else{let r=Tn;m.mutateApproach===Ia&&(r=V.requestAnimationFrame||Tn),r(()=>{const a=Co(),o=fe.begin("mutate");t.map(a),o(),n()})}}let ue=!1;function Nn(){ue=!0}function de(){ue=!1}let St=null;function Ln(t){if(!Ye||!m.observeMutations)return;const{treeCallback:e=Pt,nodeCallback:n=Pt,pseudoElementsCallback:r=Pt,observeMutationsRoot:a=A}=t;St=new Ye(o=>{if(ue)return;const i=W();J(o).forEach(s=>{if(s.type==="childList"&&s.addedNodes.length>0&&!jn(s.addedNodes[0])&&(m.searchPseudoElements&&r(s.target),e(s.target)),s.type==="attributes"&&s.target.parentNode&&m.searchPseudoElements&&r(s.target.parentNode),s.type==="attributes"&&jn(s.target)&&~Ra.indexOf(s.attributeName))if(s.attributeName==="class"&&wo(s.target)){const{prefix:u,iconName:c}=Et(Xt(s.target));s.target.setAttribute(Vt,u||i),c&&s.target.setAttribute(Bt,c)}else Ao(s.target)&&n(s.target)})}),H&&St.observe(a,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Po(){St&&St.disconnect()}function Oo(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((r,a)=>{const o=a.split(":"),i=o[0],s=o.slice(1);return i&&s.length>0&&(r[i]=s.join(":").trim()),r},{})),n}function So(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),r=t.innerText!==void 0?t.innerText.trim():"";let a=Et(Xt(t));return a.prefix||(a.prefix=W()),e&&n&&(a.prefix=e,a.iconName=n),a.iconName&&a.prefix||(a.prefix&&r.length>0&&(a.iconName=no(a.prefix,t.innerText)||ne(a.prefix,Qt(t.innerText))),!a.iconName&&m.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(a.iconName=t.firstChild.data)),a}function jo(t){const e=J(t.attributes).reduce((a,o)=>(a.name!=="class"&&a.name!=="style"&&(a[o.name]=o.value),a),{}),n=t.getAttribute("title"),r=t.getAttribute("data-fa-title-id");return m.autoA11y&&(n?e["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(r||st()):(e["aria-hidden"]="true",e.focusable="false")),e}function Io(){return{iconName:null,title:null,titleId:null,prefix:null,transform:M,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Mn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:r,rest:a}=So(t),o=jo(t),i=re("parseNodeAttributes",{},t);let s=e.styleParser?Oo(t):[];return f({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:r,transform:M,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:s,attributes:o}},i)}const{styles:To}=R;function Rn(t){const e=m.autoReplaceSvg==="nest"?Mn(t,{styleParser:!1}):Mn(t);return~e.extra.classes.indexOf(on)?Y("generateLayersText",t,e):Y("generateSvgReplacementMutation",t,e)}function Fo(){return[...ha,...Ht]}function Dn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!H)return Promise.resolve();const n=A.documentElement.classList,r=d=>n.add("".concat(en,"-").concat(d)),a=d=>n.remove("".concat(en,"-").concat(d)),o=m.autoFetchSvg?Fo():Ge.concat(Object.keys(To));o.includes("fa")||o.push("fa");const i=[".".concat(on,":not([").concat(Z,"])")].concat(o.map(d=>".".concat(d,":not([").concat(Z,"])"))).join(", ");if(i.length===0)return Promise.resolve();let s=[];try{s=J(t.querySelectorAll(i))}catch{}if(s.length>0)r("pending"),a("complete");else return Promise.resolve();const u=fe.begin("onTree"),c=s.reduce((d,b)=>{try{const g=Rn(b);g&&d.push(g)}catch(g){nn||g.name==="MissingIcon"&&console.error(g)}return d},[]);return new Promise((d,b)=>{Promise.all(c).then(g=>{Fn(g,()=>{r("active"),r("complete"),a("pending"),typeof e=="function"&&e(),u(),d()})}).catch(g=>{u(),b(g)})})}function No(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Rn(t).then(n=>{n&&Fn([n],e)})}function Lo(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const r=(e||{}).icon?e:ae(e||{});let{mask:a}=n;return a&&(a=(a||{}).icon?a:ae(a||{})),t(r,f(f({},n),{},{mask:a}))}}const Mo=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=M,symbol:r=!1,mask:a=null,maskId:o=null,title:i=null,titleId:s=null,classes:u=[],attributes:c={},styles:d={}}=e;if(!t)return;const{prefix:b,iconName:g,icon:w}=t;return kt(f({type:"icon"},t),()=>(G("beforeDOMElementCreation",{iconDefinition:t,params:e}),m.autoA11y&&(i?c["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(s||st()):(c["aria-hidden"]="true",c.focusable="false")),oe({icons:{main:se(w),mask:a?se(a.icon):{found:!1,width:null,height:null,icon:{}}},prefix:b,iconName:g,transform:f(f({},M),n),symbol:r,title:i,maskId:o,titleId:s,extra:{attributes:c,styles:d,classes:u}})))};var Ro={mixout(){return{icon:Lo(Mo)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Dn,t.nodeCallback=No,t}}},provides(t){t.i2svg=function(e){const{node:n=A,callback:r=()=>{}}=e;return Dn(n,r)},t.generateSvgReplacementMutation=function(e,n){const{iconName:r,title:a,titleId:o,prefix:i,transform:s,symbol:u,mask:c,maskId:d,extra:b}=n;return new Promise((g,w)=>{Promise.all([le(r,i),c.iconName?le(c.iconName,c.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(T=>{let[F,C]=T;g([e,oe({icons:{main:F,mask:C},prefix:i,iconName:r,transform:s,symbol:u,maskId:d,title:a,titleId:o,extra:b,watchable:!0})])}).catch(w)})},t.generateAbstractIcon=function(e){let{children:n,attributes:r,main:a,transform:o,styles:i}=e;const s=At(i);s.length>0&&(r.style=s);let u;return Kt(o)&&(u=Y("generateAbstractTransformGrouping",{main:a,transform:o,containerWidth:a.width,iconWidth:a.width})),n.push(u||a.icon),{children:n,attributes:r}}}},Do={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return kt({type:"layer"},()=>{G("beforeDOMElementCreation",{assembler:t,params:e});let r=[];return t(a=>{Array.isArray(a)?a.map(o=>{r=r.concat(o.abstract)}):r=r.concat(a.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers"),...n].join(" ")},children:r}]})}}}},Ho={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:r=[],attributes:a={},styles:o={}}=e;return kt({type:"counter",content:t},()=>(G("beforeDOMElementCreation",{content:t,params:e}),bo({content:t.toString(),title:n,extra:{attributes:a,styles:o,classes:["".concat(m.cssPrefix,"-layers-counter"),...r]}})))}}}},zo={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=M,title:r=null,classes:a=[],attributes:o={},styles:i={}}=e;return kt({type:"text",content:t},()=>(G("beforeDOMElementCreation",{content:t,params:e}),Pn({content:t,transform:f(f({},M),n),title:r,extra:{attributes:o,styles:i,classes:["".concat(m.cssPrefix,"-layers-text"),...a]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:r,transform:a,extra:o}=n;let i=null,s=null;if(Ze){const u=parseInt(getComputedStyle(e).fontSize,10),c=e.getBoundingClientRect();i=c.width/u,s=c.height/u}return m.autoA11y&&!r&&(o.attributes["aria-hidden"]="true"),Promise.resolve([e,Pn({content:e.innerHTML,width:i,height:s,transform:a,title:r,extra:o,watchable:!0})])}}};const Uo=new RegExp('"',"ug"),Hn=[1105920,1112319],zn=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),da),Sa),Aa),me=Object.keys(zn).reduce((t,e)=>(t[e.toLowerCase()]=zn[e],t),{}),Vo=Object.keys(me).reduce((t,e)=>{const n=me[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Bo(t){const e=t.replace(Uo,""),n=qa(e,0),r=n>=Hn[0]&&n<=Hn[1],a=e.length===2?e[0]===e[1]:!1;return{value:Qt(a?e[0]:e),isSecondary:r||a}}function Wo(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),r=parseInt(e),a=isNaN(r)?"normal":r;return(me[n]||{})[a]||Vo[n]}function Un(t,e){const n="".concat(ja).concat(e.replace(":","-"));return new Promise((r,a)=>{if(t.getAttribute(n)!==null)return r();const i=J(t.children).filter(g=>g.getAttribute(Ut)===e)[0],s=V.getComputedStyle(t,e),u=s.getPropertyValue("font-family"),c=u.match(La),d=s.getPropertyValue("font-weight"),b=s.getPropertyValue("content");if(i&&!c)return t.removeChild(i),r();if(c&&b!=="none"&&b!==""){const g=s.getPropertyValue("content");let w=Wo(u,d);const{value:T,isSecondary:F}=Bo(g),C=c[0].startsWith("FontAwesome");let O=ne(w,T),P=O;if(C){const j=ro(T);j.iconName&&j.prefix&&(O=j.iconName,w=j.prefix)}if(O&&!F&&(!i||i.getAttribute(Vt)!==w||i.getAttribute(Bt)!==P)){t.setAttribute(n,P),i&&t.removeChild(i);const j=Io(),{extra:p}=j;p.attributes[Ut]=e,le(O,w).then(h=>{const x=oe(f(f({},j),{},{icons:{main:h,mask:Cn()},prefix:w,iconName:P,extra:p,watchable:!0})),_=A.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(_,t.firstChild):t.appendChild(_),_.outerHTML=x.map(S=>lt(S)).join(`
`),t.removeAttribute(n),r()}).catch(a)}else r()}else r()})}function Yo(t){return Promise.all([Un(t,"::before"),Un(t,"::after")])}function Zo(t){return t.parentNode!==document.head&&!~Ta.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Ut)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Vn(t){if(H)return new Promise((e,n)=>{const r=J(t.querySelectorAll("*")).filter(Zo).map(Yo),a=fe.begin("searchPseudoElements");Nn(),Promise.all(r).then(()=>{a(),de(),e()}).catch(()=>{a(),de(),n()})})}var $o={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Vn,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=A}=e;m.searchPseudoElements&&Vn(n)}}};let Bn=!1;var Go={mixout(){return{dom:{unwatch(){Nn(),Bn=!0}}}},hooks(){return{bootstrap(){Ln(re("mutationObserverCallbacks",{}))},noAuto(){Po()},watch(t){const{observeMutationsRoot:e}=t;Bn?de():Ln(re("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Wn=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,r)=>{const a=r.toLowerCase().split("-"),o=a[0];let i=a.slice(1).join("-");if(o&&i==="h")return n.flipX=!0,n;if(o&&i==="v")return n.flipY=!0,n;if(i=parseFloat(i),isNaN(i))return n;switch(o){case"grow":n.size=n.size+i;break;case"shrink":n.size=n.size-i;break;case"left":n.x=n.x-i;break;case"right":n.x=n.x+i;break;case"up":n.y=n.y-i;break;case"down":n.y=n.y+i;break;case"rotate":n.rotate=n.rotate+i;break}return n},e)};var Xo={mixout(){return{parse:{transform:t=>Wn(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Wn(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:r,containerWidth:a,iconWidth:o}=e;const i={transform:"translate(".concat(a/2," 256)")},s="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),c="rotate(".concat(r.rotate," 0 0)"),d={transform:"".concat(s," ").concat(u," ").concat(c)},b={transform:"translate(".concat(o/2*-1," -256)")},g={outer:i,inner:d,path:b};return{tag:"g",attributes:f({},g.outer),children:[{tag:"g",attributes:f({},g.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:f(f({},n.icon.attributes),g.path)}]}]}}}};const pe={x:0,y:0,width:"100%",height:"100%"};function Yn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Ko(t){return t.tag==="g"?t.children:[t]}var qo={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),r=n?Et(n.split(" ").map(a=>a.trim())):Cn();return r.prefix||(r.prefix=W()),t.mask=r,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:r,main:a,mask:o,maskId:i,transform:s}=e;const{width:u,icon:c}=a,{width:d,icon:b}=o,g=Ya({transform:s,containerWidth:d,iconWidth:u}),w={tag:"rect",attributes:f(f({},pe),{},{fill:"white"})},T=c.children?{children:c.children.map(Yn)}:{},F={tag:"g",attributes:f({},g.inner),children:[Yn(f({tag:c.tag,attributes:f(f({},c.attributes),g.path)},T))]},C={tag:"g",attributes:f({},g.outer),children:[F]},O="mask-".concat(i||st()),P="clip-".concat(i||st()),j={tag:"mask",attributes:f(f({},pe),{},{id:O,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[w,C]},p={tag:"defs",children:[{tag:"clipPath",attributes:{id:P},children:Ko(b)},j]};return n.push(p,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(P,")"),mask:"url(#".concat(O,")")},pe)}),{children:n,attributes:r}}}},Jo={provides(t){let e=!1;V.matchMedia&&(e=V.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],r={fill:"currentColor"},a={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:f(f({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const o=f(f({},a),{},{attributeName:"opacity"}),i={tag:"circle",attributes:f(f({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||i.children.push({tag:"animate",attributes:f(f({},a),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},o),{},{values:"1;0;1;1;0;1;"})}),n.push(i),n.push({tag:"path",attributes:f(f({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:f(f({},o),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:f(f({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Qo={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),r=n===null?!1:n===""?!0:n;return t.symbol=r,t}}}},ti=[Ga,Ro,Do,Ho,zo,$o,Go,Xo,qo,Jo,Qo];mo(ti,{mixoutsTo:L}),L.noAuto,L.config,L.library,L.dom;const he=L.parse;L.findIconDefinition,L.toHtml;const ei=L.icon;L.layer,L.text,L.counter;var Zn={exports:{}},ni="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",ri=ni,ai=ri;function $n(){}function Gn(){}Gn.resetWarningCache=$n;var oi=function(){function t(r,a,o,i,s,u){if(u!==ai){var c=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}t.isRequired=t;function e(){return t}var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Gn,resetWarningCache:$n};return n.PropTypes=n,n};Zn.exports=oi();var ii=Zn.exports;const v=K(ii);function Xn(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function D(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Xn(Object(n),!0).forEach(function(r){et(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Xn(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function jt(t){"@babel/helpers - typeof";return jt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},jt(t)}function et(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function si(t,e){if(t==null)return{};var n={},r=Object.keys(t),a,o;for(o=0;o<r.length;o++)a=r[o],!(e.indexOf(a)>=0)&&(n[a]=t[a]);return n}function li(t,e){if(t==null)return{};var n=si(t,e),r,a;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(a=0;a<o.length;a++)r=o[a],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function ge(t){return ci(t)||fi(t)||ui(t)||di()}function ci(t){if(Array.isArray(t))return be(t)}function fi(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function ui(t,e){if(t){if(typeof t=="string")return be(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return be(t,e)}}function be(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function di(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function mi(t){var e,n=t.beat,r=t.fade,a=t.beatFade,o=t.bounce,i=t.shake,s=t.flash,u=t.spin,c=t.spinPulse,d=t.spinReverse,b=t.pulse,g=t.fixedWidth,w=t.inverse,T=t.border,F=t.listItem,C=t.flip,O=t.size,P=t.rotation,j=t.pull,p=(e={"fa-beat":n,"fa-fade":r,"fa-beat-fade":a,"fa-bounce":o,"fa-shake":i,"fa-flash":s,"fa-spin":u,"fa-spin-reverse":d,"fa-spin-pulse":c,"fa-pulse":b,"fa-fw":g,"fa-inverse":w,"fa-border":T,"fa-li":F,"fa-flip":C===!0,"fa-flip-horizontal":C==="horizontal"||C==="both","fa-flip-vertical":C==="vertical"||C==="both"},et(e,"fa-".concat(O),typeof O<"u"&&O!==null),et(e,"fa-rotate-".concat(P),typeof P<"u"&&P!==null&&P!==0),et(e,"fa-pull-".concat(j),typeof j<"u"&&j!==null),et(e,"fa-swap-opacity",t.swapOpacity),e);return Object.keys(p).map(function(h){return p[h]?h:null}).filter(function(h){return h})}function pi(t){return t=t-0,t===t}function Kn(t){return pi(t)?t:(t=t.replace(/[\-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""}),t.substr(0,1).toLowerCase()+t.substr(1))}var hi=["style"];function gi(t){return t.charAt(0).toUpperCase()+t.slice(1)}function bi(t){return t.split(";").map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,n){var r=n.indexOf(":"),a=Kn(n.slice(0,r)),o=n.slice(r+1).trim();return a.startsWith("webkit")?e[gi(a)]=o:e[a]=o,e},{})}function qn(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var r=(e.children||[]).map(function(u){return qn(t,u)}),a=Object.keys(e.attributes||{}).reduce(function(u,c){var d=e.attributes[c];switch(c){case"class":u.attrs.className=d,delete e.attributes.class;break;case"style":u.attrs.style=bi(d);break;default:c.indexOf("aria-")===0||c.indexOf("data-")===0?u.attrs[c.toLowerCase()]=d:u.attrs[Kn(c)]=d}return u},{attrs:{}}),o=n.style,i=o===void 0?{}:o,s=li(n,hi);return a.attrs.style=D(D({},a.attrs.style),i),t.apply(void 0,[e.tag,D(D({},a.attrs),s)].concat(ge(r)))}var Jn=!1;try{Jn=!0}catch{}function yi(){if(!Jn&&console&&typeof console.error=="function"){var t;(t=console).error.apply(t,arguments)}}function Qn(t){if(t&&jt(t)==="object"&&t.prefix&&t.iconName&&t.icon)return t;if(he.icon)return he.icon(t);if(t===null)return null;if(t&&jt(t)==="object"&&t.prefix&&t.iconName)return t;if(Array.isArray(t)&&t.length===2)return{prefix:t[0],iconName:t[1]};if(typeof t=="string")return{prefix:"fas",iconName:t}}function ye(t,e){return Array.isArray(e)&&e.length>0||!Array.isArray(e)&&e?et({},t,e):{}}var tr={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},ve=y.forwardRef(function(t,e){var n=D(D({},tr),t),r=n.icon,a=n.mask,o=n.symbol,i=n.className,s=n.title,u=n.titleId,c=n.maskId,d=Qn(r),b=ye("classes",[].concat(ge(mi(n)),ge((i||"").split(" ")))),g=ye("transform",typeof n.transform=="string"?he.transform(n.transform):n.transform),w=ye("mask",Qn(a)),T=ei(d,D(D(D(D({},b),g),w),{},{symbol:o,title:s,titleId:u,maskId:c}));if(!T)return yi("Could not find icon",d),null;var F=T.abstract,C={ref:e};return Object.keys(n).forEach(function(O){tr.hasOwnProperty(O)||(C[O]=n[O])}),vi(F[0],C)});ve.displayName="FontAwesomeIcon",ve.propTypes={beat:v.bool,border:v.bool,beatFade:v.bool,bounce:v.bool,className:v.string,fade:v.bool,flash:v.bool,mask:v.oneOfType([v.object,v.array,v.string]),maskId:v.string,fixedWidth:v.bool,inverse:v.bool,flip:v.oneOf([!0,!1,"horizontal","vertical","both"]),icon:v.oneOfType([v.object,v.array,v.string]),listItem:v.bool,pull:v.oneOf(["right","left"]),pulse:v.bool,rotation:v.oneOf([0,90,180,270]),shake:v.bool,size:v.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:v.bool,spinPulse:v.bool,spinReverse:v.bool,symbol:v.oneOfType([v.bool,v.string]),title:v.string,titleId:v.string,transform:v.oneOfType([v.string,v.object]),swapOpacity:v.bool};var vi=qn.bind(null,y.createElement);/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const xi={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]};function wi({title:t,name:e,iconElement:n,isPro:r,isProPlugin:a,showUpsell:o,demoUrl:i=null}){return l.jsx("div",{className:"tableberg-block-control","data-enabled":JSON.stringify(a?!0:!r),children:l.jsxs("div",{className:"tableberg-block-title",children:[l.jsxs("div",{className:"tableberg-block-title-left-container","data-demo":i!==null,children:[l.jsx("div",{className:"tableberg-title-icon",children:n}),l.jsxs("div",{className:"tableberg-title-text",children:[t,r&&l.jsx("span",{className:"tableberg-pro-block-card-title-suffix",children:"PRO"})]}),i&&l.jsx("div",{className:"tableberg-title-demo",children:l.jsx("a",{href:i,target:"_blank",rel:"noreferrer",className:"tableberg-strip-anchor-styles",children:Nt("See Documentation","tableberg")})})]}),r&&!a&&l.jsx("div",{className:"tableberg-block-title-right-container",children:l.jsx("div",{role:"button",className:"tableberg-pro-block-card-info-button",onClick:s=>{s.preventDefault(),o(e)},children:l.jsx(ve,{icon:xi})})})]})})}function Ai({info:t,onClose:e}){return l.jsxs("div",{className:"tableberg-upsell-modal",children:[l.jsx("div",{className:"tableberg-upsell-modal-backdrop"}),l.jsx("div",{className:"tableberg-upsell-modal-container",children:l.jsxs("div",{className:"tableberg-upsell-modal-area",children:[l.jsxs("h2",{children:[t.icon," ",t.title]}),l.jsxs("div",{className:"tableberg-upsell-modal-content",children:[l.jsx("img",{src:TABLEBERG_CFG.plugin_url+"includes/Admin/images/upsell/"+t.image,alt:t.title+" Demo"}),l.jsx("p",{children:t.upsellText}),l.jsxs("p",{children:["Limited Time: Use code ",l.jsx("b",{children:"TB20"})," to get a 20% discount."]})]}),l.jsxs("div",{className:"tableberg-upsell-modal-footer",children:[l.jsx("button",{onClick:e,children:"Cancel"}),l.jsx(bt,{assetIds:["proBuyUrl"],children:({proBuyUrl:n})=>l.jsx("a",{href:n,children:"Buy PRO"})})]})]})})]})}function Ci(){const[t,e]=y.useState(null);return l.jsxs("div",{style:{display:"flex",flexFlow:"column",gap:"30px"},children:[l.jsx("div",{className:"tableberg-controls-container controls-container","data-show-info":"false",children:na.map(n=>{const{title:r,name:a,icon:o,isPro:i,demoUrl:s}=n;return l.jsx(wi,{name:a,title:r,iconElement:o,isPro:i,showUpsell:()=>e(n),isProPlugin:tablebergAdminMenuData.misc.pro_status,demoUrl:s},a)})}),!tablebergAdminMenuData.misc.pro_status&&l.jsx(Re,{}),t&&l.jsx(Ai,{info:t,onClose:()=>e(null)})]})}const er=[{path:"welcome",title:"Welcome",element:l.jsx(Yr,{})},{path:"blocks",title:"Blocks",element:l.jsx(Ci,{})},{path:"404",title:"404",element:l.jsx("div",{children:"404"})}],nr=Fe(er);function _i({currentRoutePath:t,setCurrentRoutePath:e}){y.useEffect(()=>{const a=new URL(window.location.href);a.searchParams.set("route",t),window.history.pushState(null,null,a.href)},[t]);const n=y.useMemo(()=>nr.slice(0,nr.length-1),[]),r=tablebergAdminMenuData==null?void 0:tablebergAdminMenuData.assets.logo;return l.jsxs("div",{className:"header-wrapper",children:[l.jsxs("div",{className:"menu-header",children:[l.jsx("div",{className:"left-container",children:l.jsxs("div",{className:"logo-container",children:[l.jsx("img",{alt:"plugin logo",src:r}),l.jsx("div",{className:"tableberg-plugin-logo-text",children:"Tableberg"})]})}),l.jsx("div",{className:"tableberg-menu-navigation-wrapper",children:l.jsx(Ne,{routes:n,currentRoutePath:t,setRoute:e})}),l.jsx("div",{className:"right-container",children:!tablebergAdminMenuData.misc.pro_status&&l.jsx(Fr,{children:l.jsx(bt,{assetIds:["proBuyUrl"],children:({proBuyUrl:a})=>l.jsx(gt,{url:a,title:"Upgrade to PRO"})})})})]}),l.jsx("div",{className:"dropdown-navigation",children:l.jsx("div",{className:"dropdown-drawer",children:l.jsx(Ne,{routes:n,currentRoutePath:t,setRoute:e})})})]})}function rr({routes:t,currentRoutePath:e}){const[n,r]=y.useState(null);return y.useEffect(()=>{const a=t.find(o=>o.getPath()===e);if(a)r(a.getElement());else{const o=t[t.length-1];r(o.getElement())}},[e,t]),l.jsx("div",{className:"tableberg-router-content-wrapper","data-route-path":e,children:n},e)}function ar(){this.name="NoRouterComponentFoundError",this.message="No router component found within RouterProvider. Please make sure you have passed Router component as a child of RouterProvider."}ar.prototype=Error.prototype;function Ei({children:t,currentRoutePath:e,setCurrentRoutePath:n}){const r=y.useMemo(()=>{const i=(t==null?void 0:t.type)===rr?t.type:null;if(i===null)throw new ar;return i},[e]),a=y.useMemo(()=>Fe(er),[]),o=()=>{const s=new URL(window.location.href).searchParams.get("route");s&&n(s)};return y.useEffect(()=>{window.addEventListener("popstate",o)},[]),y.useEffect(()=>{o()},[]),y.useEffect(()=>{const i=new URL(window.location.href);i.searchParams.set("route",e),window.history.pushState(null,null,i.href)},[e]),l.jsx(r,{routes:a,currentRoutePath:e})}function ki({currentRoutePath:t,setCurrentRoutePath:e}){return l.jsx(Ei,{currentRoutePath:t,setCurrentRoutePath:e,children:l.jsx(rr,{})})}function Pi(){const e=new URL(window.location.href).searchParams.get("route"),[n,r]=y.useState(e??"welcome");return l.jsxs("div",{className:"tableberg-admin-menu-container",children:[l.jsx(_i,{currentRoutePath:n,setCurrentRoutePath:r}),l.jsx(ki,{currentRoutePath:n,setCurrentRoutePath:r})]})}function Oi({children:t}){return y.useEffect(()=>{const e=document.querySelector("#wpcontent"),n=document.querySelector("#wpbody"),r=document.querySelector("#wpadminbar");if(n){const a=r?r.offsetHeight:0;n.style.height=`calc( 100vh - ${a}px)`,e.style.padding=0}},[]),l.jsx("div",{className:"tableberg-admin-menu-wrapper",children:t})}const or=document.querySelector("#tableberg-admin-menu");or&&N.createRoot(or).render(l.jsx(Oi,{children:l.jsx(Pi,{})}))});

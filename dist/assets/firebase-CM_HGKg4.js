const Pf=()=>{};var Bu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yl=function(r){const t=[];let e=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Vf=function(r){const t=[];let e=0,n=0;for(;e<r.length;){const s=r[e++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[e++];t[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[e++],a=r[e++],u=r[e++],l=((s&7)<<18|(i&63)<<12|(a&63)<<6|u&63)-65536;t[n++]=String.fromCharCode(55296+(l>>10)),t[n++]=String.fromCharCode(56320+(l&1023))}else{const i=r[e++],a=r[e++];t[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return t.join("")},Il={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,t){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],a=s+1<r.length,u=a?r[s+1]:0,l=s+2<r.length,d=l?r[s+2]:0,f=i>>2,g=(i&3)<<4|u>>4;let I=(u&15)<<2|d>>6,S=d&63;l||(S=64,a||(I=64)),n.push(e[f],e[g],e[I],e[S])}return n.join("")},encodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(r):this.encodeByteArray(yl(r),t)},decodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(r):Vf(this.decodeStringToByteArray(r,t))},decodeStringToByteArray(r,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=e[r.charAt(s++)],u=s<r.length?e[r.charAt(s)]:0;++s;const d=s<r.length?e[r.charAt(s)]:64;++s;const g=s<r.length?e[r.charAt(s)]:64;if(++s,i==null||u==null||d==null||g==null)throw new Cf;const I=i<<2|u>>4;if(n.push(I),d!==64){const S=u<<4&240|d>>2;if(n.push(S),g!==64){const D=d<<6&192|g;n.push(D)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Cf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Df=function(r){const t=yl(r);return Il.encodeByteArray(t,!0)},Fs=function(r){return Df(r).replace(/\./g,"")},xf=function(r){try{return Il.decodeString(r,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function El(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nf=()=>El().__FIREBASE_DEFAULTS__,kf=()=>{if(typeof process>"u"||typeof Bu>"u")return;const r=Bu.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Of=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=r&&xf(r[1]);return t&&JSON.parse(t)},oi=()=>{try{return Pf()||Nf()||kf()||Of()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Mf=r=>{var t,e;return(e=(t=oi())==null?void 0:t.emulatorHosts)==null?void 0:e[r]},Ff=r=>{const t=Mf(r);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const n=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),n]:[t.substring(0,e),n]},Tl=()=>{var r;return(r=oi())==null?void 0:r.config},Ky=r=>{var t;return(t=oi())==null?void 0:t[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,n)=>{e?this.reject(e):this.resolve(n),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bf(r,t){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},n=t||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Fs(JSON.stringify(e)),Fs(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Gy(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Tn())}function wl(){var t;const r=(t=oi())==null?void 0:t.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Qy(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Hy(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Wy(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Jy(){const r=Tn();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function vl(){return!wl()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Al(){return!wl()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function bl(){try{return typeof indexedDB=="object"}catch{return!1}}function Uf(){return new Promise((r,t)=>{try{let e=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var i;t(((i=s.error)==null?void 0:i.message)||"")}}catch(e){t(e)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf="FirebaseError";class Fn extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name=qf,Object.setPrototypeOf(this,Fn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Rl.prototype.create)}}class Rl{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],a=i?jf(i,n):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new Fn(s,u,n)}}function jf(r,t){return r.replace(zf,(e,n)=>{const s=t[n];return s!=null?String(s):`<${n}?>`})}const zf=/\{\$([^}]+)}/g;function Xy(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}function Ls(r,t){if(r===t)return!0;const e=Object.keys(r),n=Object.keys(t);for(const s of e){if(!n.includes(s))return!1;const i=r[s],a=t[s];if(Uu(i)&&Uu(a)){if(!Ls(i,a))return!1}else if(i!==a)return!1}for(const s of n)if(!e.includes(s))return!1;return!0}function Uu(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yy(r){const t=[];for(const[e,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function Zy(r){const t={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function tI(r){const t=r.indexOf("?");if(!t)return"";const e=r.indexOf("#",t);return r.substring(t,e>0?e:void 0)}function eI(r,t){const e=new $f(r,t);return e.subscribe.bind(e)}class $f{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,n){let s;if(t===void 0&&e===void 0&&n===void 0)throw new Error("Missing Observer.");Kf(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:n},s.next===void 0&&(s.next=Yi),s.error===void 0&&(s.error=Yi),s.complete===void 0&&(s.complete=Yi);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Kf(r,t){if(typeof r!="object"||r===null)return!1;for(const e of t)if(e in r&&typeof r[e]=="function")return!0;return!1}function Yi(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Gf(r){return(await fetch(r,{credentials:"include"})).ok}class Ar{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const n=new Lf;if(this.instancesDeferred.set(e,n),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),n=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Wf(t))try{this.getOrInitializeService({instanceIdentifier:Me})}catch{}for(const[e,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(t=Me){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Me){return this.instances.has(t)}getOptions(t=Me){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[i,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);n===u&&a.resolve(s)}return s}onInit(t,e){const n=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(n)??new Set;s.add(t),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&t(i,n),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const s of n)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Hf(t),options:e}),this.instances.set(t,n),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch{}return n||null}normalizeInstanceIdentifier(t=Me){return this.component?this.component.multipleInstances?t:Me:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Hf(r){return r===Me?void 0:r}function Wf(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new Qf(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(H||(H={}));const Xf={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Yf=H.INFO,Zf={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},tm=(r,t,...e)=>{if(t<r.logLevel)return;const n=new Date().toISOString(),s=Zf[t];if(s)console[s](`[${n}]  ${r.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Pl{constructor(t){this.name=t,this._logLevel=Yf,this._logHandler=tm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in H))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Xf[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...t),this._logHandler(this,H.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...t),this._logHandler(this,H.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,H.INFO,...t),this._logHandler(this,H.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,H.WARN,...t),this._logHandler(this,H.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...t),this._logHandler(this,H.ERROR,...t)}}const em=(r,t)=>t.some(e=>r instanceof e);let qu,ju;function nm(){return qu||(qu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function rm(){return ju||(ju=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Vl=new WeakMap,ho=new WeakMap,Cl=new WeakMap,Zi=new WeakMap,qo=new WeakMap;function sm(r){const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",a)},i=()=>{e(_e(r.result)),s()},a=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&Vl.set(e,r)}).catch(()=>{}),qo.set(t,r),t}function im(r){if(ho.has(r))return;const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",a),r.removeEventListener("abort",a)},i=()=>{e(),s()},a=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",a),r.addEventListener("abort",a)});ho.set(r,t)}let fo={get(r,t,e){if(r instanceof IDBTransaction){if(t==="done")return ho.get(r);if(t==="objectStoreNames")return r.objectStoreNames||Cl.get(r);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return _e(r[t])},set(r,t,e){return r[t]=e,!0},has(r,t){return r instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in r}};function om(r){fo=r(fo)}function am(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const n=r.call(to(this),t,...e);return Cl.set(n,t.sort?t.sort():[t]),_e(n)}:rm().includes(r)?function(...t){return r.apply(to(this),t),_e(Vl.get(this))}:function(...t){return _e(r.apply(to(this),t))}}function um(r){return typeof r=="function"?am(r):(r instanceof IDBTransaction&&im(r),em(r,nm())?new Proxy(r,fo):r)}function _e(r){if(r instanceof IDBRequest)return sm(r);if(Zi.has(r))return Zi.get(r);const t=um(r);return t!==r&&(Zi.set(r,t),qo.set(t,r)),t}const to=r=>qo.get(r);function cm(r,t,{blocked:e,upgrade:n,blocking:s,terminated:i}={}){const a=indexedDB.open(r,t),u=_e(a);return n&&a.addEventListener("upgradeneeded",l=>{n(_e(a.result),l.oldVersion,l.newVersion,_e(a.transaction),l)}),e&&a.addEventListener("blocked",l=>e(l.oldVersion,l.newVersion,l)),u.then(l=>{i&&l.addEventListener("close",()=>i()),s&&l.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const lm=["get","getKey","getAll","getAllKeys","count"],hm=["put","add","delete","clear"],eo=new Map;function zu(r,t){if(!(r instanceof IDBDatabase&&!(t in r)&&typeof t=="string"))return;if(eo.get(t))return eo.get(t);const e=t.replace(/FromIndex$/,""),n=t!==e,s=hm.includes(e);if(!(e in(n?IDBIndex:IDBObjectStore).prototype)||!(s||lm.includes(e)))return;const i=async function(a,...u){const l=this.transaction(a,s?"readwrite":"readonly");let d=l.store;return n&&(d=d.index(u.shift())),(await Promise.all([d[e](...u),s&&l.done]))[0]};return eo.set(t,i),i}om(r=>({...r,get:(t,e,n)=>zu(t,e)||r.get(t,e,n),has:(t,e)=>!!zu(t,e)||r.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(fm(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function fm(r){const t=r.getComponent();return(t==null?void 0:t.type)==="VERSION"}const mo="@firebase/app",$u="0.14.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt=new Pl("@firebase/app"),mm="@firebase/app-compat",gm="@firebase/analytics-compat",pm="@firebase/analytics",_m="@firebase/app-check-compat",ym="@firebase/app-check",Im="@firebase/auth",Em="@firebase/auth-compat",Tm="@firebase/database",wm="@firebase/data-connect",vm="@firebase/database-compat",Am="@firebase/functions",bm="@firebase/functions-compat",Rm="@firebase/installations",Sm="@firebase/installations-compat",Pm="@firebase/messaging",Vm="@firebase/messaging-compat",Cm="@firebase/performance",Dm="@firebase/performance-compat",xm="@firebase/remote-config",Nm="@firebase/remote-config-compat",km="@firebase/storage",Om="@firebase/storage-compat",Mm="@firebase/firestore",Fm="@firebase/ai",Lm="@firebase/firestore-compat",Bm="firebase",Um="12.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go="[DEFAULT]",qm={[mo]:"fire-core",[mm]:"fire-core-compat",[pm]:"fire-analytics",[gm]:"fire-analytics-compat",[ym]:"fire-app-check",[_m]:"fire-app-check-compat",[Im]:"fire-auth",[Em]:"fire-auth-compat",[Tm]:"fire-rtdb",[wm]:"fire-data-connect",[vm]:"fire-rtdb-compat",[Am]:"fire-fn",[bm]:"fire-fn-compat",[Rm]:"fire-iid",[Sm]:"fire-iid-compat",[Pm]:"fire-fcm",[Vm]:"fire-fcm-compat",[Cm]:"fire-perf",[Dm]:"fire-perf-compat",[xm]:"fire-rc",[Nm]:"fire-rc-compat",[km]:"fire-gcs",[Om]:"fire-gcs-compat",[Mm]:"fire-fst",[Lm]:"fire-fst-compat",[Fm]:"fire-vertex","fire-js":"fire-js",[Bm]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bs=new Map,jm=new Map,po=new Map;function Ku(r,t){try{r.container.addComponent(t)}catch(e){Zt.debug(`Component ${t.name} failed to register with FirebaseApp ${r.name}`,e)}}function Us(r){const t=r.name;if(po.has(t))return Zt.debug(`There were multiple attempts to register component ${t}.`),!1;po.set(t,r);for(const e of Bs.values())Ku(e,r);for(const e of jm.values())Ku(e,r);return!0}function zm(r,t){const e=r.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),r.container.getProvider(t)}function $m(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Km={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ye=new Rl("app","Firebase",Km);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(t,e,n){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Ar("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw ye.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qm=Um;function Hm(r,t={}){let e=r;typeof t!="object"&&(t={name:t});const n={name:go,automaticDataCollectionEnabled:!0,...t},s=n.name;if(typeof s!="string"||!s)throw ye.create("bad-app-name",{appName:String(s)});if(e||(e=Tl()),!e)throw ye.create("no-options");const i=Bs.get(s);if(i){if(Ls(e,i.options)&&Ls(n,i.config))return i;throw ye.create("duplicate-app",{appName:s})}const a=new Jf(s);for(const l of po.values())a.addComponent(l);const u=new Gm(e,n,a);return Bs.set(s,u),u}function Wm(r=go){const t=Bs.get(r);if(!t&&r===go&&Tl())return Hm();if(!t)throw ye.create("no-app",{appName:r});return t}function yn(r,t,e){let n=qm[r]??r;e&&(n+=`-${e}`);const s=n.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const a=[`Unable to register library "${n}" with version "${t}":`];s&&a.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Zt.warn(a.join(" "));return}Us(new Ar(`${n}-version`,()=>({library:n,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jm="firebase-heartbeat-database",Xm=1,br="firebase-heartbeat-store";let no=null;function Dl(){return no||(no=cm(Jm,Xm,{upgrade:(r,t)=>{switch(t){case 0:try{r.createObjectStore(br)}catch(e){console.warn(e)}}}}).catch(r=>{throw ye.create("idb-open",{originalErrorMessage:r.message})})),no}async function Ym(r){try{const e=(await Dl()).transaction(br),n=await e.objectStore(br).get(xl(r));return await e.done,n}catch(t){if(t instanceof Fn)Zt.warn(t.message);else{const e=ye.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Zt.warn(e.message)}}}async function Gu(r,t){try{const n=(await Dl()).transaction(br,"readwrite");await n.objectStore(br).put(t,xl(r)),await n.done}catch(e){if(e instanceof Fn)Zt.warn(e.message);else{const n=ye.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Zt.warn(n.message)}}}function xl(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zm=1024,tg=30;class eg{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new rg(e),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Qu();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>tg){const a=sg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Zt.warn(n)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Qu(),{heartbeatsToSend:n,unsentEntries:s}=ng(this._heartbeatsCache.heartbeats),i=Fs(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return Zt.warn(e),""}}}function Qu(){return new Date().toISOString().substring(0,10)}function ng(r,t=Zm){const e=[];let n=r.slice();for(const s of r){const i=e.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),Hu(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),Hu(e)>t){e.pop();break}n=n.slice(1)}return{heartbeatsToSend:e,unsentEntries:n}}class rg{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return bl()?Uf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Ym(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return Gu(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return Gu(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...t.heartbeats]})}else return}}function Hu(r){return Fs(JSON.stringify({version:2,heartbeats:r})).length}function sg(r){if(r.length===0)return-1;let t=0,e=r[0].date;for(let n=1;n<r.length;n++)r[n].date<e&&(e=r[n].date,t=n);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ig(r){Us(new Ar("platform-logger",t=>new dm(t),"PRIVATE")),Us(new Ar("heartbeat",t=>new eg(t),"PRIVATE")),yn(mo,$u,r),yn(mo,$u,"esm2020"),yn("fire-js","")}ig("");var Wu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ie,Nl;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(E,p){function y(){}y.prototype=p.prototype,E.F=p.prototype,E.prototype=new y,E.prototype.constructor=E,E.D=function(w,T,b){for(var _=Array(arguments.length-2),Ct=2;Ct<arguments.length;Ct++)_[Ct-2]=arguments[Ct];return p.prototype[T].apply(w,_)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(n,e),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,p,y){y||(y=0);const w=Array(16);if(typeof p=="string")for(var T=0;T<16;++T)w[T]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(T=0;T<16;++T)w[T]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=E.g[0],y=E.g[1],T=E.g[2];let b=E.g[3],_;_=p+(b^y&(T^b))+w[0]+3614090360&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(T^p&(y^T))+w[1]+3905402710&4294967295,b=p+(_<<12&4294967295|_>>>20),_=T+(y^b&(p^y))+w[2]+606105819&4294967295,T=b+(_<<17&4294967295|_>>>15),_=y+(p^T&(b^p))+w[3]+3250441966&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(b^y&(T^b))+w[4]+4118548399&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(T^p&(y^T))+w[5]+1200080426&4294967295,b=p+(_<<12&4294967295|_>>>20),_=T+(y^b&(p^y))+w[6]+2821735955&4294967295,T=b+(_<<17&4294967295|_>>>15),_=y+(p^T&(b^p))+w[7]+4249261313&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(b^y&(T^b))+w[8]+1770035416&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(T^p&(y^T))+w[9]+2336552879&4294967295,b=p+(_<<12&4294967295|_>>>20),_=T+(y^b&(p^y))+w[10]+4294925233&4294967295,T=b+(_<<17&4294967295|_>>>15),_=y+(p^T&(b^p))+w[11]+2304563134&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(b^y&(T^b))+w[12]+1804603682&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(T^p&(y^T))+w[13]+4254626195&4294967295,b=p+(_<<12&4294967295|_>>>20),_=T+(y^b&(p^y))+w[14]+2792965006&4294967295,T=b+(_<<17&4294967295|_>>>15),_=y+(p^T&(b^p))+w[15]+1236535329&4294967295,y=T+(_<<22&4294967295|_>>>10),_=p+(T^b&(y^T))+w[1]+4129170786&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^T&(p^y))+w[6]+3225465664&4294967295,b=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(b^p))+w[11]+643717713&4294967295,T=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(T^b))+w[0]+3921069994&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^b&(y^T))+w[5]+3593408605&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^T&(p^y))+w[10]+38016083&4294967295,b=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(b^p))+w[15]+3634488961&4294967295,T=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(T^b))+w[4]+3889429448&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^b&(y^T))+w[9]+568446438&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^T&(p^y))+w[14]+3275163606&4294967295,b=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(b^p))+w[3]+4107603335&4294967295,T=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(T^b))+w[8]+1163531501&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(T^b&(y^T))+w[13]+2850285829&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^T&(p^y))+w[2]+4243563512&4294967295,b=p+(_<<9&4294967295|_>>>23),_=T+(p^y&(b^p))+w[7]+1735328473&4294967295,T=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(T^b))+w[12]+2368359562&4294967295,y=T+(_<<20&4294967295|_>>>12),_=p+(y^T^b)+w[5]+4294588738&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^T)+w[8]+2272392833&4294967295,b=p+(_<<11&4294967295|_>>>21),_=T+(b^p^y)+w[11]+1839030562&4294967295,T=b+(_<<16&4294967295|_>>>16),_=y+(T^b^p)+w[14]+4259657740&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^b)+w[1]+2763975236&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^T)+w[4]+1272893353&4294967295,b=p+(_<<11&4294967295|_>>>21),_=T+(b^p^y)+w[7]+4139469664&4294967295,T=b+(_<<16&4294967295|_>>>16),_=y+(T^b^p)+w[10]+3200236656&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^b)+w[13]+681279174&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^T)+w[0]+3936430074&4294967295,b=p+(_<<11&4294967295|_>>>21),_=T+(b^p^y)+w[3]+3572445317&4294967295,T=b+(_<<16&4294967295|_>>>16),_=y+(T^b^p)+w[6]+76029189&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(y^T^b)+w[9]+3654602809&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^T)+w[12]+3873151461&4294967295,b=p+(_<<11&4294967295|_>>>21),_=T+(b^p^y)+w[15]+530742520&4294967295,T=b+(_<<16&4294967295|_>>>16),_=y+(T^b^p)+w[2]+3299628645&4294967295,y=T+(_<<23&4294967295|_>>>9),_=p+(T^(y|~b))+w[0]+4096336452&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~T))+w[7]+1126891415&4294967295,b=p+(_<<10&4294967295|_>>>22),_=T+(p^(b|~y))+w[14]+2878612391&4294967295,T=b+(_<<15&4294967295|_>>>17),_=y+(b^(T|~p))+w[5]+4237533241&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~b))+w[12]+1700485571&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~T))+w[3]+2399980690&4294967295,b=p+(_<<10&4294967295|_>>>22),_=T+(p^(b|~y))+w[10]+4293915773&4294967295,T=b+(_<<15&4294967295|_>>>17),_=y+(b^(T|~p))+w[1]+2240044497&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~b))+w[8]+1873313359&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~T))+w[15]+4264355552&4294967295,b=p+(_<<10&4294967295|_>>>22),_=T+(p^(b|~y))+w[6]+2734768916&4294967295,T=b+(_<<15&4294967295|_>>>17),_=y+(b^(T|~p))+w[13]+1309151649&4294967295,y=T+(_<<21&4294967295|_>>>11),_=p+(T^(y|~b))+w[4]+4149444226&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~T))+w[11]+3174756917&4294967295,b=p+(_<<10&4294967295|_>>>22),_=T+(p^(b|~y))+w[2]+718787259&4294967295,T=b+(_<<15&4294967295|_>>>17),_=y+(b^(T|~p))+w[9]+3951481745&4294967295,E.g[0]=E.g[0]+p&4294967295,E.g[1]=E.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+b&4294967295}n.prototype.v=function(E,p){p===void 0&&(p=E.length);const y=p-this.blockSize,w=this.C;let T=this.h,b=0;for(;b<p;){if(T==0)for(;b<=y;)s(this,E,b),b+=this.blockSize;if(typeof E=="string"){for(;b<p;)if(w[T++]=E.charCodeAt(b++),T==this.blockSize){s(this,w),T=0;break}}else for(;b<p;)if(w[T++]=E[b++],T==this.blockSize){s(this,w),T=0;break}}this.h=T,this.o+=p},n.prototype.A=function(){var E=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);E[0]=128;for(var p=1;p<E.length-8;++p)E[p]=0;p=this.o*8;for(var y=E.length-8;y<E.length;++y)E[y]=p&255,p/=256;for(this.v(E),E=Array(16),p=0,y=0;y<4;++y)for(let w=0;w<32;w+=8)E[p++]=this.g[y]>>>w&255;return E};function i(E,p){var y=u;return Object.prototype.hasOwnProperty.call(y,E)?y[E]:y[E]=p(E)}function a(E,p){this.h=p;const y=[];let w=!0;for(let T=E.length-1;T>=0;T--){const b=E[T]|0;w&&b==p||(y[T]=b,w=!1)}this.g=y}var u={};function l(E){return-128<=E&&E<128?i(E,function(p){return new a([p|0],p<0?-1:0)}):new a([E|0],E<0?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return g;if(E<0)return N(d(-E));const p=[];let y=1;for(let w=0;E>=y;w++)p[w]=E/y|0,y*=4294967296;return new a(p,0)}function f(E,p){if(E.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(E.charAt(0)=="-")return N(f(E.substring(1),p));if(E.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=d(Math.pow(p,8));let w=g;for(let b=0;b<E.length;b+=8){var T=Math.min(8,E.length-b);const _=parseInt(E.substring(b,b+T),p);T<8?(T=d(Math.pow(p,T)),w=w.j(T).add(d(_))):(w=w.j(y),w=w.add(d(_)))}return w}var g=l(0),I=l(1),S=l(16777216);r=a.prototype,r.m=function(){if(k(this))return-N(this).m();let E=0,p=1;for(let y=0;y<this.g.length;y++){const w=this.i(y);E+=(w>=0?w:4294967296+w)*p,p*=4294967296}return E},r.toString=function(E){if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(D(this))return"0";if(k(this))return"-"+N(this).toString(E);const p=d(Math.pow(E,6));var y=this;let w="";for(;;){const T=nt(y,p).g;y=G(y,T.j(p));let b=((y.g.length>0?y.g[0]:y.h)>>>0).toString(E);if(y=T,D(y))return b+w;for(;b.length<6;)b="0"+b;w=b+w}},r.i=function(E){return E<0?0:E<this.g.length?this.g[E]:this.h};function D(E){if(E.h!=0)return!1;for(let p=0;p<E.g.length;p++)if(E.g[p]!=0)return!1;return!0}function k(E){return E.h==-1}r.l=function(E){return E=G(this,E),k(E)?-1:D(E)?0:1};function N(E){const p=E.g.length,y=[];for(let w=0;w<p;w++)y[w]=~E.g[w];return new a(y,~E.h).add(I)}r.abs=function(){return k(this)?N(this):this},r.add=function(E){const p=Math.max(this.g.length,E.g.length),y=[];let w=0;for(let T=0;T<=p;T++){let b=w+(this.i(T)&65535)+(E.i(T)&65535),_=(b>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);w=_>>>16,b&=65535,_&=65535,y[T]=_<<16|b}return new a(y,y[y.length-1]&-2147483648?-1:0)};function G(E,p){return E.add(N(p))}r.j=function(E){if(D(this)||D(E))return g;if(k(this))return k(E)?N(this).j(N(E)):N(N(this).j(E));if(k(E))return N(this.j(N(E)));if(this.l(S)<0&&E.l(S)<0)return d(this.m()*E.m());const p=this.g.length+E.g.length,y=[];for(var w=0;w<2*p;w++)y[w]=0;for(w=0;w<this.g.length;w++)for(let T=0;T<E.g.length;T++){const b=this.i(w)>>>16,_=this.i(w)&65535,Ct=E.i(T)>>>16,Ve=E.i(T)&65535;y[2*w+2*T]+=_*Ve,j(y,2*w+2*T),y[2*w+2*T+1]+=b*Ve,j(y,2*w+2*T+1),y[2*w+2*T+1]+=_*Ct,j(y,2*w+2*T+1),y[2*w+2*T+2]+=b*Ct,j(y,2*w+2*T+2)}for(E=0;E<p;E++)y[E]=y[2*E+1]<<16|y[2*E];for(E=p;E<2*p;E++)y[E]=0;return new a(y,0)};function j(E,p){for(;(E[p]&65535)!=E[p];)E[p+1]+=E[p]>>>16,E[p]&=65535,p++}function U(E,p){this.g=E,this.h=p}function nt(E,p){if(D(p))throw Error("division by zero");if(D(E))return new U(g,g);if(k(E))return p=nt(N(E),p),new U(N(p.g),N(p.h));if(k(p))return p=nt(E,N(p)),new U(N(p.g),p.h);if(E.g.length>30){if(k(E)||k(p))throw Error("slowDivide_ only works with positive integers.");for(var y=I,w=p;w.l(E)<=0;)y=W(y),w=W(w);var T=J(y,1),b=J(w,1);for(w=J(w,2),y=J(y,2);!D(w);){var _=b.add(w);_.l(E)<=0&&(T=T.add(y),b=_),w=J(w,1),y=J(y,1)}return p=G(E,T.j(p)),new U(T,p)}for(T=g;E.l(p)>=0;){for(y=Math.max(1,Math.floor(E.m()/p.m())),w=Math.ceil(Math.log(y)/Math.LN2),w=w<=48?1:Math.pow(2,w-48),b=d(y),_=b.j(p);k(_)||_.l(E)>0;)y-=w,b=d(y),_=b.j(p);D(b)&&(b=I),T=T.add(b),E=G(E,_)}return new U(T,E)}r.B=function(E){return nt(this,E).h},r.and=function(E){const p=Math.max(this.g.length,E.g.length),y=[];for(let w=0;w<p;w++)y[w]=this.i(w)&E.i(w);return new a(y,this.h&E.h)},r.or=function(E){const p=Math.max(this.g.length,E.g.length),y=[];for(let w=0;w<p;w++)y[w]=this.i(w)|E.i(w);return new a(y,this.h|E.h)},r.xor=function(E){const p=Math.max(this.g.length,E.g.length),y=[];for(let w=0;w<p;w++)y[w]=this.i(w)^E.i(w);return new a(y,this.h^E.h)};function W(E){const p=E.g.length+1,y=[];for(let w=0;w<p;w++)y[w]=E.i(w)<<1|E.i(w-1)>>>31;return new a(y,E.h)}function J(E,p){const y=p>>5;p%=32;const w=E.g.length-y,T=[];for(let b=0;b<w;b++)T[b]=p>0?E.i(b+y)>>>p|E.i(b+y+1)<<32-p:E.i(b+y);return new a(T,E.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Nl=n,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Ie=a}).apply(typeof Wu<"u"?Wu:typeof self<"u"?self:typeof window<"u"?window:{});var ys=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var kl,hr,Ol,bs,_o,Ml,Fl,Ll;(function(){var r,t=Object.defineProperty;function e(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ys=="object"&&ys];for(var c=0;c<o.length;++c){var h=o[c];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var n=e(this);function s(o,c){if(c)t:{var h=n;o=o.split(".");for(var m=0;m<o.length-1;m++){var A=o[m];if(!(A in h))break t;h=h[A]}o=o[o.length-1],m=h[o],c=c(m),c!=m&&c!=null&&t(h,o,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(o){return o||function(c){var h=[],m;for(m in c)Object.prototype.hasOwnProperty.call(c,m)&&h.push([m,c[m]]);return h}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function u(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function l(o,c,h){return o.call.apply(o.bind,arguments)}function d(o,c,h){return d=l,d.apply(null,arguments)}function f(o,c){var h=Array.prototype.slice.call(arguments,1);return function(){var m=h.slice();return m.push.apply(m,arguments),o.apply(this,m)}}function g(o,c){function h(){}h.prototype=c.prototype,o.Z=c.prototype,o.prototype=new h,o.prototype.constructor=o,o.Ob=function(m,A,R){for(var x=Array(arguments.length-2),z=2;z<arguments.length;z++)x[z-2]=arguments[z];return c.prototype[A].apply(m,x)}}var I=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function S(o){const c=o.length;if(c>0){const h=Array(c);for(let m=0;m<c;m++)h[m]=o[m];return h}return[]}function D(o,c){for(let m=1;m<arguments.length;m++){const A=arguments[m];var h=typeof A;if(h=h!="object"?h:A?Array.isArray(A)?"array":h:"null",h=="array"||h=="object"&&typeof A.length=="number"){h=o.length||0;const R=A.length||0;o.length=h+R;for(let x=0;x<R;x++)o[h+x]=A[x]}else o.push(A)}}class k{constructor(c,h){this.i=c,this.j=h,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function N(o){a.setTimeout(()=>{throw o},0)}function G(){var o=E;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class j{constructor(){this.h=this.g=null}add(c,h){const m=U.get();m.set(c,h),this.h?this.h.next=m:this.g=m,this.h=m}}var U=new k(()=>new nt,o=>o.reset());class nt{constructor(){this.next=this.g=this.h=null}set(c,h){this.h=c,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let W,J=!1,E=new j,p=()=>{const o=Promise.resolve(void 0);W=()=>{o.then(y)}};function y(){for(var o;o=G();){try{o.h.call(o.g)}catch(h){N(h)}var c=U;c.j(o),c.h<100&&(c.h++,o.next=c.g,c.g=o)}J=!1}function w(){this.u=this.u,this.C=this.C}w.prototype.u=!1,w.prototype.dispose=function(){this.u||(this.u=!0,this.N())},w.prototype[Symbol.dispose]=function(){this.dispose()},w.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var b=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};a.addEventListener("test",h,c),a.removeEventListener("test",h,c)}catch{}return o}();function _(o){return/^[\s\xa0]*$/.test(o)}function Ct(o,c){T.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,c)}g(Ct,T),Ct.prototype.init=function(o,c){const h=this.type=o.type,m=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget,c||(h=="mouseover"?c=o.fromElement:h=="mouseout"&&(c=o.toElement)),this.relatedTarget=c,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Ct.Z.h.call(this)},Ct.prototype.h=function(){Ct.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Ve="closure_listenable_"+(Math.random()*1e6|0),Wd=0;function Jd(o,c,h,m,A){this.listener=o,this.proxy=null,this.src=c,this.type=h,this.capture=!!m,this.ha=A,this.key=++Wd,this.da=this.fa=!1}function rs(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function ss(o,c,h){for(const m in o)c.call(h,o[m],m,o)}function Xd(o,c){for(const h in o)c.call(void 0,o[h],h,o)}function La(o){const c={};for(const h in o)c[h]=o[h];return c}const Ba="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ua(o,c){let h,m;for(let A=1;A<arguments.length;A++){m=arguments[A];for(h in m)o[h]=m[h];for(let R=0;R<Ba.length;R++)h=Ba[R],Object.prototype.hasOwnProperty.call(m,h)&&(o[h]=m[h])}}function is(o){this.src=o,this.g={},this.h=0}is.prototype.add=function(o,c,h,m,A){const R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);const x=Vi(o,c,m,A);return x>-1?(c=o[x],h||(c.fa=!1)):(c=new Jd(c,this.src,R,!!m,A),c.fa=h,o.push(c)),c};function Pi(o,c){const h=c.type;if(h in o.g){var m=o.g[h],A=Array.prototype.indexOf.call(m,c,void 0),R;(R=A>=0)&&Array.prototype.splice.call(m,A,1),R&&(rs(c),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Vi(o,c,h,m){for(let A=0;A<o.length;++A){const R=o[A];if(!R.da&&R.listener==c&&R.capture==!!h&&R.ha==m)return A}return-1}var Ci="closure_lm_"+(Math.random()*1e6|0),Di={};function qa(o,c,h,m,A){if(Array.isArray(c)){for(let R=0;R<c.length;R++)qa(o,c[R],h,m,A);return null}return h=$a(h),o&&o[Ve]?o.J(c,h,u(m)?!!m.capture:!1,A):Yd(o,c,h,!1,m,A)}function Yd(o,c,h,m,A,R){if(!c)throw Error("Invalid event type");const x=u(A)?!!A.capture:!!A;let z=Ni(o);if(z||(o[Ci]=z=new is(o)),h=z.add(c,h,m,x,R),h.proxy)return h;if(m=Zd(),h.proxy=m,m.src=o,m.listener=h,o.addEventListener)b||(A=x),A===void 0&&(A=!1),o.addEventListener(c.toString(),m,A);else if(o.attachEvent)o.attachEvent(za(c.toString()),m);else if(o.addListener&&o.removeListener)o.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Zd(){function o(h){return c.call(o.src,o.listener,h)}const c=tf;return o}function ja(o,c,h,m,A){if(Array.isArray(c))for(var R=0;R<c.length;R++)ja(o,c[R],h,m,A);else m=u(m)?!!m.capture:!!m,h=$a(h),o&&o[Ve]?(o=o.i,R=String(c).toString(),R in o.g&&(c=o.g[R],h=Vi(c,h,m,A),h>-1&&(rs(c[h]),Array.prototype.splice.call(c,h,1),c.length==0&&(delete o.g[R],o.h--)))):o&&(o=Ni(o))&&(c=o.g[c.toString()],o=-1,c&&(o=Vi(c,h,m,A)),(h=o>-1?c[o]:null)&&xi(h))}function xi(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[Ve])Pi(c.i,o);else{var h=o.type,m=o.proxy;c.removeEventListener?c.removeEventListener(h,m,o.capture):c.detachEvent?c.detachEvent(za(h),m):c.addListener&&c.removeListener&&c.removeListener(m),(h=Ni(c))?(Pi(h,o),h.h==0&&(h.src=null,c[Ci]=null)):rs(o)}}}function za(o){return o in Di?Di[o]:Di[o]="on"+o}function tf(o,c){if(o.da)o=!0;else{c=new Ct(c,this);const h=o.listener,m=o.ha||o.src;o.fa&&xi(o),o=h.call(m,c)}return o}function Ni(o){return o=o[Ci],o instanceof is?o:null}var ki="__closure_events_fn_"+(Math.random()*1e9>>>0);function $a(o){return typeof o=="function"?o:(o[ki]||(o[ki]=function(c){return o.handleEvent(c)}),o[ki])}function Et(){w.call(this),this.i=new is(this),this.M=this,this.G=null}g(Et,w),Et.prototype[Ve]=!0,Et.prototype.removeEventListener=function(o,c,h,m){ja(this,o,c,h,m)};function Rt(o,c){var h,m=o.G;if(m)for(h=[];m;m=m.G)h.push(m);if(o=o.M,m=c.type||c,typeof c=="string")c=new T(c,o);else if(c instanceof T)c.target=c.target||o;else{var A=c;c=new T(m,o),Ua(c,A)}A=!0;let R,x;if(h)for(x=h.length-1;x>=0;x--)R=c.g=h[x],A=os(R,m,!0,c)&&A;if(R=c.g=o,A=os(R,m,!0,c)&&A,A=os(R,m,!1,c)&&A,h)for(x=0;x<h.length;x++)R=c.g=h[x],A=os(R,m,!1,c)&&A}Et.prototype.N=function(){if(Et.Z.N.call(this),this.i){var o=this.i;for(const c in o.g){const h=o.g[c];for(let m=0;m<h.length;m++)rs(h[m]);delete o.g[c],o.h--}}this.G=null},Et.prototype.J=function(o,c,h,m){return this.i.add(String(o),c,!1,h,m)},Et.prototype.K=function(o,c,h,m){return this.i.add(String(o),c,!0,h,m)};function os(o,c,h,m){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();let A=!0;for(let R=0;R<c.length;++R){const x=c[R];if(x&&!x.da&&x.capture==h){const z=x.listener,ft=x.ha||x.src;x.fa&&Pi(o.i,x),A=z.call(ft,m)!==!1&&A}}return A&&!m.defaultPrevented}function ef(o,c){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=d(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(o,c||0)}function Ka(o){o.g=ef(()=>{o.g=null,o.i&&(o.i=!1,Ka(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class nf extends w{constructor(c,h){super(),this.m=c,this.l=h,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Ka(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function jn(o){w.call(this),this.h=o,this.g={}}g(jn,w);var Ga=[];function Qa(o){ss(o.g,function(c,h){this.g.hasOwnProperty(h)&&xi(c)},o),o.g={}}jn.prototype.N=function(){jn.Z.N.call(this),Qa(this)},jn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Oi=a.JSON.stringify,rf=a.JSON.parse,sf=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function Ha(){}function Wa(){}var zn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Mi(){T.call(this,"d")}g(Mi,T);function Fi(){T.call(this,"c")}g(Fi,T);var Ce={},Ja=null;function as(){return Ja=Ja||new Et}Ce.Ia="serverreachability";function Xa(o){T.call(this,Ce.Ia,o)}g(Xa,T);function $n(o){const c=as();Rt(c,new Xa(c))}Ce.STAT_EVENT="statevent";function Ya(o,c){T.call(this,Ce.STAT_EVENT,o),this.stat=c}g(Ya,T);function St(o){const c=as();Rt(c,new Ya(c,o))}Ce.Ja="timingevent";function Za(o,c){T.call(this,Ce.Ja,o),this.size=c}g(Za,T);function Kn(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},c)}function Gn(){this.g=!0}Gn.prototype.ua=function(){this.g=!1};function of(o,c,h,m,A,R){o.info(function(){if(o.g)if(R){var x="",z=R.split("&");for(let et=0;et<z.length;et++){var ft=z[et].split("=");if(ft.length>1){const pt=ft[0];ft=ft[1];const $t=pt.split("_");x=$t.length>=2&&$t[1]=="type"?x+(pt+"="+ft+"&"):x+(pt+"=redacted&")}}}else x=null;else x=R;return"XMLHTTP REQ ("+m+") [attempt "+A+"]: "+c+`
`+h+`
`+x})}function af(o,c,h,m,A,R,x){o.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+A+"]: "+c+`
`+h+`
`+R+" "+x})}function rn(o,c,h,m){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+cf(o,h)+(m?" "+m:"")})}function uf(o,c){o.info(function(){return"TIMEOUT: "+c})}Gn.prototype.info=function(){};function cf(o,c){if(!o.g)return c;if(!c)return null;try{const R=JSON.parse(c);if(R){for(o=0;o<R.length;o++)if(Array.isArray(R[o])){var h=R[o];if(!(h.length<2)){var m=h[1];if(Array.isArray(m)&&!(m.length<1)){var A=m[0];if(A!="noop"&&A!="stop"&&A!="close")for(let x=1;x<m.length;x++)m[x]=""}}}}return Oi(R)}catch{return c}}var us={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},tu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},eu;function Li(){}g(Li,Ha),Li.prototype.g=function(){return new XMLHttpRequest},eu=new Li;function Qn(o){return encodeURIComponent(String(o))}function lf(o){var c=1;o=o.split(":");const h=[];for(;c>0&&o.length;)h.push(o.shift()),c--;return o.length&&h.push(o.join(":")),h}function oe(o,c,h,m){this.j=o,this.i=c,this.l=h,this.S=m||1,this.V=new jn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new nu}function nu(){this.i=null,this.g="",this.h=!1}var ru={},Bi={};function Ui(o,c,h){o.M=1,o.A=ls(zt(c)),o.u=h,o.R=!0,su(o,null)}function su(o,c){o.F=Date.now(),cs(o),o.B=zt(o.A);var h=o.B,m=o.S;Array.isArray(m)||(m=[String(m)]),_u(h.i,"t",m),o.C=0,h=o.j.L,o.h=new nu,o.g=Ou(o.j,h?c:null,!o.u),o.P>0&&(o.O=new nf(d(o.Y,o,o.g),o.P)),c=o.V,h=o.g,m=o.ba;var A="readystatechange";Array.isArray(A)||(A&&(Ga[0]=A.toString()),A=Ga);for(let R=0;R<A.length;R++){const x=qa(h,A[R],m||c.handleEvent,!1,c.h||c);if(!x)break;c.g[x.key]=x}c=o.J?La(o.J):{},o.u?(o.v||(o.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,c)):(o.v="GET",o.g.ea(o.B,o.v,null,c)),$n(),of(o.i,o.v,o.B,o.l,o.S,o.u)}oe.prototype.ba=function(o){o=o.target;const c=this.O;c&&ce(o)==3?c.j():this.Y(o)},oe.prototype.Y=function(o){try{if(o==this.g)t:{const z=ce(this.g),ft=this.g.ya(),et=this.g.ca();if(!(z<3)&&(z!=3||this.g&&(this.h.h||this.g.la()||Au(this.g)))){this.K||z!=4||ft==7||(ft==8||et<=0?$n(3):$n(2)),qi(this);var c=this.g.ca();this.X=c;var h=hf(this);if(this.o=c==200,af(this.i,this.v,this.B,this.l,this.S,z,c),this.o){if(this.U&&!this.L){e:{if(this.g){var m,A=this.g;if((m=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(m)){var R=m;break e}}R=null}if(o=R)rn(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ji(this,o);else{this.o=!1,this.m=3,St(12),De(this),Hn(this);break t}}if(this.R){o=!0;let pt;for(;!this.K&&this.C<h.length;)if(pt=df(this,h),pt==Bi){z==4&&(this.m=4,St(14),o=!1),rn(this.i,this.l,null,"[Incomplete Response]");break}else if(pt==ru){this.m=4,St(15),rn(this.i,this.l,h,"[Invalid Chunk]"),o=!1;break}else rn(this.i,this.l,pt,null),ji(this,pt);if(iu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),z!=4||h.length!=0||this.h.h||(this.m=1,St(16),o=!1),this.o=this.o&&o,!o)rn(this.i,this.l,h,"[Invalid Chunked Response]"),De(this),Hn(this);else if(h.length>0&&!this.W){this.W=!0;var x=this.j;x.g==this&&x.aa&&!x.P&&(x.j.info("Great, no buffering proxy detected. Bytes received: "+h.length),Ji(x),x.P=!0,St(11))}}else rn(this.i,this.l,h,null),ji(this,h);z==4&&De(this),this.o&&!this.K&&(z==4?Du(this.j,this):(this.o=!1,cs(this)))}else Rf(this.g),c==400&&h.indexOf("Unknown SID")>0?(this.m=3,St(12)):(this.m=0,St(13)),De(this),Hn(this)}}}catch{}finally{}};function hf(o){if(!iu(o))return o.g.la();const c=Au(o.g);if(c==="")return"";let h="";const m=c.length,A=ce(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return De(o),Hn(o),"";o.h.i=new a.TextDecoder}for(let R=0;R<m;R++)o.h.h=!0,h+=o.h.i.decode(c[R],{stream:!(A&&R==m-1)});return c.length=0,o.h.g+=h,o.C=0,o.h.g}function iu(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function df(o,c){var h=o.C,m=c.indexOf(`
`,h);return m==-1?Bi:(h=Number(c.substring(h,m)),isNaN(h)?ru:(m+=1,m+h>c.length?Bi:(c=c.slice(m,m+h),o.C=m+h,c)))}oe.prototype.cancel=function(){this.K=!0,De(this)};function cs(o){o.T=Date.now()+o.H,ou(o,o.H)}function ou(o,c){if(o.D!=null)throw Error("WatchDog timer not null");o.D=Kn(d(o.aa,o),c)}function qi(o){o.D&&(a.clearTimeout(o.D),o.D=null)}oe.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(uf(this.i,this.B),this.M!=2&&($n(),St(17)),De(this),this.m=2,Hn(this)):ou(this,this.T-o)};function Hn(o){o.j.I==0||o.K||Du(o.j,o)}function De(o){qi(o);var c=o.O;c&&typeof c.dispose=="function"&&c.dispose(),o.O=null,Qa(o.V),o.g&&(c=o.g,o.g=null,c.abort(),c.dispose())}function ji(o,c){try{var h=o.j;if(h.I!=0&&(h.g==o||zi(h.h,o))){if(!o.L&&zi(h.h,o)&&h.I==3){try{var m=h.Ba.g.parse(c)}catch{m=null}if(Array.isArray(m)&&m.length==3){var A=m;if(A[0]==0){t:if(!h.v){if(h.g)if(h.g.F+3e3<o.F)gs(h),fs(h);else break t;Wi(h),St(18)}}else h.xa=A[1],0<h.xa-h.K&&A[2]<37500&&h.F&&h.A==0&&!h.C&&(h.C=Kn(d(h.Va,h),6e3));cu(h.h)<=1&&h.ta&&(h.ta=void 0)}else Ne(h,11)}else if((o.L||h.g==o)&&gs(h),!_(c))for(A=h.Ba.g.parse(c),c=0;c<A.length;c++){let et=A[c];const pt=et[0];if(!(pt<=h.K))if(h.K=pt,et=et[1],h.I==2)if(et[0]=="c"){h.M=et[1],h.ba=et[2];const $t=et[3];$t!=null&&(h.ka=$t,h.j.info("VER="+h.ka));const ke=et[4];ke!=null&&(h.za=ke,h.j.info("SVER="+h.za));const le=et[5];le!=null&&typeof le=="number"&&le>0&&(m=1.5*le,h.O=m,h.j.info("backChannelRequestTimeoutMs_="+m)),m=h;const he=o.g;if(he){const _s=he.g?he.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(_s){var R=m.h;R.g||_s.indexOf("spdy")==-1&&_s.indexOf("quic")==-1&&_s.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&($i(R,R.h),R.h=null))}if(m.G){const Xi=he.g?he.g.getResponseHeader("X-HTTP-Session-Id"):null;Xi&&(m.wa=Xi,rt(m.J,m.G,Xi))}}h.I=3,h.l&&h.l.ra(),h.aa&&(h.T=Date.now()-o.F,h.j.info("Handshake RTT: "+h.T+"ms")),m=h;var x=o;if(m.na=ku(m,m.L?m.ba:null,m.W),x.L){lu(m.h,x);var z=x,ft=m.O;ft&&(z.H=ft),z.D&&(qi(z),cs(z)),m.g=x}else Vu(m);h.i.length>0&&ms(h)}else et[0]!="stop"&&et[0]!="close"||Ne(h,7);else h.I==3&&(et[0]=="stop"||et[0]=="close"?et[0]=="stop"?Ne(h,7):Hi(h):et[0]!="noop"&&h.l&&h.l.qa(et),h.A=0)}}$n(4)}catch{}}var ff=class{constructor(o,c){this.g=o,this.map=c}};function au(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function uu(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function cu(o){return o.h?1:o.g?o.g.size:0}function zi(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function $i(o,c){o.g?o.g.add(c):o.h=c}function lu(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}au.prototype.cancel=function(){if(this.i=hu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function hu(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const h of o.g.values())c=c.concat(h.G);return c}return S(o.i)}var du=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function mf(o,c){if(o){o=o.split("&");for(let h=0;h<o.length;h++){const m=o[h].indexOf("=");let A,R=null;m>=0?(A=o[h].substring(0,m),R=o[h].substring(m+1)):A=o[h],c(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function ae(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;o instanceof ae?(this.l=o.l,Wn(this,o.j),this.o=o.o,this.g=o.g,Jn(this,o.u),this.h=o.h,Ki(this,yu(o.i)),this.m=o.m):o&&(c=String(o).match(du))?(this.l=!1,Wn(this,c[1]||"",!0),this.o=Xn(c[2]||""),this.g=Xn(c[3]||"",!0),Jn(this,c[4]),this.h=Xn(c[5]||"",!0),Ki(this,c[6]||"",!0),this.m=Xn(c[7]||"")):(this.l=!1,this.i=new Zn(null,this.l))}ae.prototype.toString=function(){const o=[];var c=this.j;c&&o.push(Yn(c,fu,!0),":");var h=this.g;return(h||c=="file")&&(o.push("//"),(c=this.o)&&o.push(Yn(c,fu,!0),"@"),o.push(Qn(h).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.u,h!=null&&o.push(":",String(h))),(h=this.h)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Yn(h,h.charAt(0)=="/"?_f:pf,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Yn(h,If)),o.join("")},ae.prototype.resolve=function(o){const c=zt(this);let h=!!o.j;h?Wn(c,o.j):h=!!o.o,h?c.o=o.o:h=!!o.g,h?c.g=o.g:h=o.u!=null;var m=o.h;if(h)Jn(c,o.u);else if(h=!!o.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var A=c.h.lastIndexOf("/");A!=-1&&(m=c.h.slice(0,A+1)+m)}if(A=m,A==".."||A==".")m="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){m=A.lastIndexOf("/",0)==0,A=A.split("/");const R=[];for(let x=0;x<A.length;){const z=A[x++];z=="."?m&&x==A.length&&R.push(""):z==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),m&&x==A.length&&R.push("")):(R.push(z),m=!0)}m=R.join("/")}else m=A}return h?c.h=m:h=o.i.toString()!=="",h?Ki(c,yu(o.i)):h=!!o.m,h&&(c.m=o.m),c};function zt(o){return new ae(o)}function Wn(o,c,h){o.j=h?Xn(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function Jn(o,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);o.u=c}else o.u=null}function Ki(o,c,h){c instanceof Zn?(o.i=c,Ef(o.i,o.l)):(h||(c=Yn(c,yf)),o.i=new Zn(c,o.l))}function rt(o,c,h){o.i.set(c,h)}function ls(o){return rt(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function Xn(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Yn(o,c,h){return typeof o=="string"?(o=encodeURI(o).replace(c,gf),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function gf(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var fu=/[#\/\?@]/g,pf=/[#\?:]/g,_f=/[#\?]/g,yf=/[#\?@]/g,If=/#/g;function Zn(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function xe(o){o.g||(o.g=new Map,o.h=0,o.i&&mf(o.i,function(c,h){o.add(decodeURIComponent(c.replace(/\+/g," ")),h)}))}r=Zn.prototype,r.add=function(o,c){xe(this),this.i=null,o=sn(this,o);let h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(c),this.h+=1,this};function mu(o,c){xe(o),c=sn(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function gu(o,c){return xe(o),c=sn(o,c),o.g.has(c)}r.forEach=function(o,c){xe(this),this.g.forEach(function(h,m){h.forEach(function(A){o.call(c,A,m,this)},this)},this)};function pu(o,c){xe(o);let h=[];if(typeof c=="string")gu(o,c)&&(h=h.concat(o.g.get(sn(o,c))));else for(o=Array.from(o.g.values()),c=0;c<o.length;c++)h=h.concat(o[c]);return h}r.set=function(o,c){return xe(this),this.i=null,o=sn(this,o),gu(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},r.get=function(o,c){return o?(o=pu(this,o),o.length>0?String(o[0]):c):c};function _u(o,c,h){mu(o,c),h.length>0&&(o.i=null,o.g.set(sn(o,c),S(h)),o.h+=h.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(let m=0;m<c.length;m++){var h=c[m];const A=Qn(h);h=pu(this,h);for(let R=0;R<h.length;R++){let x=A;h[R]!==""&&(x+="="+Qn(h[R])),o.push(x)}}return this.i=o.join("&")};function yu(o){const c=new Zn;return c.i=o.i,o.g&&(c.g=new Map(o.g),c.h=o.h),c}function sn(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function Ef(o,c){c&&!o.j&&(xe(o),o.i=null,o.g.forEach(function(h,m){const A=m.toLowerCase();m!=A&&(mu(this,m),_u(this,A,h))},o)),o.j=c}function Tf(o,c){const h=new Gn;if(a.Image){const m=new Image;m.onload=f(ue,h,"TestLoadImage: loaded",!0,c,m),m.onerror=f(ue,h,"TestLoadImage: error",!1,c,m),m.onabort=f(ue,h,"TestLoadImage: abort",!1,c,m),m.ontimeout=f(ue,h,"TestLoadImage: timeout",!1,c,m),a.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=o}else c(!1)}function wf(o,c){const h=new Gn,m=new AbortController,A=setTimeout(()=>{m.abort(),ue(h,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:m.signal}).then(R=>{clearTimeout(A),R.ok?ue(h,"TestPingServer: ok",!0,c):ue(h,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(A),ue(h,"TestPingServer: error",!1,c)})}function ue(o,c,h,m,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),m(h)}catch{}}function vf(){this.g=new sf}function Gi(o){this.i=o.Sb||null,this.h=o.ab||!1}g(Gi,Ha),Gi.prototype.g=function(){return new hs(this.i,this.h)};function hs(o,c){Et.call(this),this.H=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}g(hs,Et),r=hs.prototype,r.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=c,this.readyState=1,er(this)},r.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(c.body=o),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,tr(this)),this.readyState=0},r.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,er(this)),this.g&&(this.readyState=3,er(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Iu(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function Iu(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}r.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?tr(this):er(this),this.readyState==3&&Iu(this)}},r.Oa=function(o){this.g&&(this.response=this.responseText=o,tr(this))},r.Na=function(o){this.g&&(this.response=o,tr(this))},r.ga=function(){this.g&&tr(this)};function tr(o){o.readyState=4,o.l=null,o.j=null,o.B=null,er(o)}r.setRequestHeader=function(o,c){this.A.append(o,c)},r.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var h=c.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=c.next();return o.join(`\r
`)};function er(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(hs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Eu(o){let c="";return ss(o,function(h,m){c+=m,c+=":",c+=h,c+=`\r
`}),c}function Qi(o,c,h){t:{for(m in h){var m=!1;break t}m=!0}m||(h=Eu(h),typeof o=="string"?h!=null&&Qn(h):rt(o,c,h))}function at(o){Et.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}g(at,Et);var Af=/^https?$/i,bf=["POST","PUT"];r=at.prototype,r.Fa=function(o){this.H=o},r.ea=function(o,c,h,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():eu.g(),this.g.onreadystatechange=I(d(this.Ca,this));try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(R){Tu(this,R);return}if(o=h||"",h=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var A in m)h.set(A,m[A]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const R of m.keys())h.set(R,m.get(R));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),A=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(bf,c,void 0)>=0)||m||A||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,x]of h)this.g.setRequestHeader(R,x);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(R){Tu(this,R)}};function Tu(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.o=5,wu(o),ds(o)}function wu(o){o.A||(o.A=!0,Rt(o,"complete"),Rt(o,"error"))}r.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,Rt(this,"complete"),Rt(this,"abort"),ds(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ds(this,!0)),at.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?vu(this):this.Xa())},r.Xa=function(){vu(this)};function vu(o){if(o.h&&typeof i<"u"){if(o.v&&ce(o)==4)setTimeout(o.Ca.bind(o),0);else if(Rt(o,"readystatechange"),ce(o)==4){o.h=!1;try{const R=o.ca();t:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break t;default:c=!1}var h;if(!(h=c)){var m;if(m=R===0){let x=String(o.D).match(du)[1]||null;!x&&a.self&&a.self.location&&(x=a.self.location.protocol.slice(0,-1)),m=!Af.test(x?x.toLowerCase():"")}h=m}if(h)Rt(o,"complete"),Rt(o,"success");else{o.o=6;try{var A=ce(o)>2?o.g.statusText:""}catch{A=""}o.l=A+" ["+o.ca()+"]",wu(o)}}finally{ds(o)}}}}function ds(o,c){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const h=o.g;o.g=null,c||Rt(o,"ready");try{h.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function ce(o){return o.g?o.g.readyState:0}r.ca=function(){try{return ce(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),rf(c)}};function Au(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Rf(o){const c={};o=(o.g&&ce(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<o.length;m++){if(_(o[m]))continue;var h=lf(o[m]);const A=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=c[A]||[];c[A]=R,R.push(h)}Xd(c,function(m){return m.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function nr(o,c,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||c}function bu(o){this.za=0,this.i=[],this.j=new Gn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=nr("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=nr("baseRetryDelayMs",5e3,o),this.Za=nr("retryDelaySeedMs",1e4,o),this.Ta=nr("forwardChannelMaxRetries",2,o),this.va=nr("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new au(o&&o.concurrentRequestLimit),this.Ba=new vf,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=bu.prototype,r.ka=8,r.I=1,r.connect=function(o,c,h,m){St(0),this.W=o,this.H=c||{},h&&m!==void 0&&(this.H.OSID=h,this.H.OAID=m),this.F=this.X,this.J=ku(this,null,this.W),ms(this)};function Hi(o){if(Ru(o),o.I==3){var c=o.V++,h=zt(o.J);if(rt(h,"SID",o.M),rt(h,"RID",c),rt(h,"TYPE","terminate"),rr(o,h),c=new oe(o,o.j,c),c.M=2,c.A=ls(zt(h)),h=!1,a.navigator&&a.navigator.sendBeacon)try{h=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!h&&a.Image&&(new Image().src=c.A,h=!0),h||(c.g=Ou(c.j,null),c.g.ea(c.A)),c.F=Date.now(),cs(c)}Nu(o)}function fs(o){o.g&&(Ji(o),o.g.cancel(),o.g=null)}function Ru(o){fs(o),o.v&&(a.clearTimeout(o.v),o.v=null),gs(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function ms(o){if(!uu(o.h)&&!o.m){o.m=!0;var c=o.Ea;W||p(),J||(W(),J=!0),E.add(c,o),o.D=0}}function Sf(o,c){return cu(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=c.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=Kn(d(o.Ea,o,c),xu(o,o.D)),o.D++,!0)}r.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const A=new oe(this,this.j,o);let R=this.o;if(this.U&&(R?(R=La(R),Ua(R,this.U)):R=this.U),this.u!==null||this.R||(A.J=R,R=null),this.S)t:{for(var c=0,h=0;h<this.i.length;h++){e:{var m=this.i[h];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break e}m=void 0}if(m===void 0)break;if(c+=m,c>4096){c=h;break t}if(c===4096||h===this.i.length-1){c=h+1;break t}}c=1e3}else c=1e3;c=Pu(this,A,c),h=zt(this.J),rt(h,"RID",o),rt(h,"CVER",22),this.G&&rt(h,"X-HTTP-Session-Id",this.G),rr(this,h),R&&(this.R?c="headers="+Qn(Eu(R))+"&"+c:this.u&&Qi(h,this.u,R)),$i(this.h,A),this.Ra&&rt(h,"TYPE","init"),this.S?(rt(h,"$req",c),rt(h,"SID","null"),A.U=!0,Ui(A,h,null)):Ui(A,h,c),this.I=2}}else this.I==3&&(o?Su(this,o):this.i.length==0||uu(this.h)||Su(this))};function Su(o,c){var h;c?h=c.l:h=o.V++;const m=zt(o.J);rt(m,"SID",o.M),rt(m,"RID",h),rt(m,"AID",o.K),rr(o,m),o.u&&o.o&&Qi(m,o.u,o.o),h=new oe(o,o.j,h,o.D+1),o.u===null&&(h.J=o.o),c&&(o.i=c.G.concat(o.i)),c=Pu(o,h,1e3),h.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),$i(o.h,h),Ui(h,m,c)}function rr(o,c){o.H&&ss(o.H,function(h,m){rt(c,m,h)}),o.l&&ss({},function(h,m){rt(c,m,h)})}function Pu(o,c,h){h=Math.min(o.i.length,h);const m=o.l?d(o.l.Ka,o.l,o):null;t:{var A=o.i;let z=-1;for(;;){const ft=["count="+h];z==-1?h>0?(z=A[0].g,ft.push("ofs="+z)):z=0:ft.push("ofs="+z);let et=!0;for(let pt=0;pt<h;pt++){var R=A[pt].g;const $t=A[pt].map;if(R-=z,R<0)z=Math.max(0,A[pt].g-100),et=!1;else try{R="req"+R+"_"||"";try{var x=$t instanceof Map?$t:Object.entries($t);for(const[ke,le]of x){let he=le;u(le)&&(he=Oi(le)),ft.push(R+ke+"="+encodeURIComponent(he))}}catch(ke){throw ft.push(R+"type="+encodeURIComponent("_badmap")),ke}}catch{m&&m($t)}}if(et){x=ft.join("&");break t}}x=void 0}return o=o.i.splice(0,h),c.G=o,x}function Vu(o){if(!o.g&&!o.v){o.Y=1;var c=o.Da;W||p(),J||(W(),J=!0),E.add(c,o),o.A=0}}function Wi(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=Kn(d(o.Da,o),xu(o,o.A)),o.A++,!0)}r.Da=function(){if(this.v=null,Cu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=Kn(d(this.Wa,this),o)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,St(10),fs(this),Cu(this))};function Ji(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function Cu(o){o.g=new oe(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var c=zt(o.na);rt(c,"RID","rpc"),rt(c,"SID",o.M),rt(c,"AID",o.K),rt(c,"CI",o.F?"0":"1"),!o.F&&o.ia&&rt(c,"TO",o.ia),rt(c,"TYPE","xmlhttp"),rr(o,c),o.u&&o.o&&Qi(c,o.u,o.o),o.O&&(o.g.H=o.O);var h=o.g;o=o.ba,h.M=1,h.A=ls(zt(c)),h.u=null,h.R=!0,su(h,o)}r.Va=function(){this.C!=null&&(this.C=null,fs(this),Wi(this),St(19))};function gs(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function Du(o,c){var h=null;if(o.g==c){gs(o),Ji(o),o.g=null;var m=2}else if(zi(o.h,c))h=c.G,lu(o.h,c),m=1;else return;if(o.I!=0){if(c.o)if(m==1){h=c.u?c.u.length:0,c=Date.now()-c.F;var A=o.D;m=as(),Rt(m,new Za(m,h)),ms(o)}else Vu(o);else if(A=c.m,A==3||A==0&&c.X>0||!(m==1&&Sf(o,c)||m==2&&Wi(o)))switch(h&&h.length>0&&(c=o.h,c.i=c.i.concat(h)),A){case 1:Ne(o,5);break;case 4:Ne(o,10);break;case 3:Ne(o,6);break;default:Ne(o,2)}}}function xu(o,c){let h=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(h*=2),h*c}function Ne(o,c){if(o.j.info("Error code "+c),c==2){var h=d(o.bb,o),m=o.Ua;const A=!m;m=new ae(m||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Wn(m,"https"),ls(m),A?Tf(m.toString(),h):wf(m.toString(),h)}else St(2);o.I=0,o.l&&o.l.pa(c),Nu(o),Ru(o)}r.bb=function(o){o?(this.j.info("Successfully pinged google.com"),St(2)):(this.j.info("Failed to ping google.com"),St(1))};function Nu(o){if(o.I=0,o.ja=[],o.l){const c=hu(o.h);(c.length!=0||o.i.length!=0)&&(D(o.ja,c),D(o.ja,o.i),o.h.i.length=0,S(o.i),o.i.length=0),o.l.oa()}}function ku(o,c,h){var m=h instanceof ae?zt(h):new ae(h);if(m.g!="")c&&(m.g=c+"."+m.g),Jn(m,m.u);else{var A=a.location;m=A.protocol,c=c?c+"."+A.hostname:A.hostname,A=+A.port;const R=new ae(null);m&&Wn(R,m),c&&(R.g=c),A&&Jn(R,A),h&&(R.h=h),m=R}return h=o.G,c=o.wa,h&&c&&rt(m,h,c),rt(m,"VER",o.ka),rr(o,m),m}function Ou(o,c,h){if(c&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Aa&&!o.ma?new at(new Gi({ab:h})):new at(o.ma),c.Fa(o.L),c}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Mu(){}r=Mu.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function ps(){}ps.prototype.g=function(o,c){return new xt(o,c)};function xt(o,c){Et.call(this),this.g=new bu(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(o?o["X-WebChannel-Client-Profile"]=c.sa:o={"X-WebChannel-Client-Profile":c.sa}),this.g.U=o,(o=c&&c.Qb)&&!_(o)&&(this.g.u=o),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!_(c)&&(this.g.G=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new on(this)}g(xt,Et),xt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},xt.prototype.close=function(){Hi(this.g)},xt.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.v&&(h={},h.__data__=Oi(o),o=h);c.i.push(new ff(c.Ya++,o)),c.I==3&&ms(c)},xt.prototype.N=function(){this.g.l=null,delete this.j,Hi(this.g),delete this.g,xt.Z.N.call(this)};function Fu(o){Mi.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){t:{for(const h in c){o=h;break t}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}g(Fu,Mi);function Lu(){Fi.call(this),this.status=1}g(Lu,Fi);function on(o){this.g=o}g(on,Mu),on.prototype.ra=function(){Rt(this.g,"a")},on.prototype.qa=function(o){Rt(this.g,new Fu(o))},on.prototype.pa=function(o){Rt(this.g,new Lu)},on.prototype.oa=function(){Rt(this.g,"b")},ps.prototype.createWebChannel=ps.prototype.g,xt.prototype.send=xt.prototype.o,xt.prototype.open=xt.prototype.m,xt.prototype.close=xt.prototype.close,Ll=function(){return new ps},Fl=function(){return as()},Ml=Ce,_o={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},us.NO_ERROR=0,us.TIMEOUT=8,us.HTTP_ERROR=6,bs=us,tu.COMPLETE="complete",Ol=tu,Wa.EventType=zn,zn.OPEN="a",zn.CLOSE="b",zn.ERROR="c",zn.MESSAGE="d",Et.prototype.listen=Et.prototype.J,hr=Wa,at.prototype.listenOnce=at.prototype.K,at.prototype.getLastError=at.prototype.Ha,at.prototype.getLastErrorCode=at.prototype.ya,at.prototype.getStatus=at.prototype.ca,at.prototype.getResponseJson=at.prototype.La,at.prototype.getResponseText=at.prototype.la,at.prototype.send=at.prototype.ea,at.prototype.setWithCredentials=at.prototype.Fa,kl=at}).apply(typeof ys<"u"?ys:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}yt.UNAUTHENTICATED=new yt(null),yt.GOOGLE_CREDENTIALS=new yt("google-credentials-uid"),yt.FIRST_PARTY=new yt("first-party-uid"),yt.MOCK_USER=new yt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ln="12.14.0";function og(r){Ln=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const We=new Pl("@firebase/firestore");function fn(){return We.logLevel}function V(r,...t){if(We.logLevel<=H.DEBUG){const e=t.map(jo);We.debug(`Firestore (${Ln}): ${r}`,...e)}}function Pt(r,...t){if(We.logLevel<=H.ERROR){const e=t.map(jo);We.error(`Firestore (${Ln}): ${r}`,...e)}}function we(r,...t){if(We.logLevel<=H.WARN){const e=t.map(jo);We.warn(`Firestore (${Ln}): ${r}`,...e)}}function jo(r){if(typeof r=="string")return r;try{return function(e){return JSON.stringify(e)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,Bl(r,n,e)}function Bl(r,t,e){let n=`FIRESTORE (${Ln}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw Pt(n),new Error(n)}function F(r,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,r||Bl(t,s,n)}function q(r,t){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class C extends Fn{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class ag{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(yt.UNAUTHENTICATED))}shutdown(){}}class ug{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class cg{constructor(t){this.t=t,this.currentUser=yt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){F(this.o===void 0,42304);let n=this.i;const s=l=>this.i!==n?(n=this.i,e(l)):Promise.resolve();let i=new Wt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Wt,t.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const l=i;t.enqueueRetryable(async()=>{await l.promise,await s(this.currentUser)})},u=l=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(l=>u(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?u(l):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Wt)}},0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(n=>this.i!==t?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(F(typeof n.accessToken=="string",31837,{l:n}),new Ul(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return F(t===null||typeof t=="string",2055,{h:t}),new yt(t)}}class lg{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=yt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const t=this.A();return t&&this.R.set("Authorization",t),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class hg{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new lg(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable(()=>e(yt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ju{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class dg{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,$m(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){F(this.o===void 0,3512);const n=i=>{i.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.m;return this.m=i.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable(()=>n(i))};const s=i=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new Ju(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(e=>e?(F(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new Ju(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fg(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=fg(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<e&&(n+=t.charAt(s[i]%62))}return n}}function B(r,t){return r<t?-1:r>t?1:0}function yo(r,t){const e=Math.min(r.length,t.length);for(let n=0;n<e;n++){const s=r.charAt(n),i=t.charAt(n);if(s!==i)return ro(s)===ro(i)?B(s,i):ro(s)?1:-1}return B(r.length,t.length)}const mg=55296,gg=57343;function ro(r){const t=r.charCodeAt(0);return t>=mg&&t<=gg}function wn(r,t,e){return r.length===t.length&&r.every((n,s)=>e(n,t[s]))}function ql(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu="__name__";class Kt{constructor(t,e,n){e===void 0?e=0:e>t.length&&M(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&M(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return Kt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Kt?t.forEach(n=>{e.push(n)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const i=Kt.compareSegments(t.get(s),e.get(s));if(i!==0)return i}return B(t.length,e.length)}static compareSegments(t,e){const n=Kt.isNumericId(t),s=Kt.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?Kt.extractNumericId(t).compare(Kt.extractNumericId(e)):yo(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Ie.fromString(t.substring(4,t.length-2))}}class X extends Kt{construct(t,e,n){return new X(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new C(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter(s=>s.length>0))}return new X(e)}static emptyPath(){return new X([])}}const pg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ot extends Kt{construct(t,e,n){return new ot(t,e,n)}static isValidIdentifier(t){return pg.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ot.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Xu}static keyField(){return new ot([Xu])}static fromServerFormat(t){const e=[];let n="",s=0;const i=()=>{if(n.length===0)throw new C(P.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let a=!1;for(;s<t.length;){const u=t[s];if(u==="\\"){if(s+1===t.length)throw new C(P.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const l=t[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new C(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=l,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(n+=u,s++):(i(),s++)}if(i(),a)throw new C(P.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new ot(e)}static emptyPath(){return new ot([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(t){this.path=t}static fromPath(t){return new O(X.fromString(t))}static fromName(t){return new O(X.fromString(t).popFirst(5))}static empty(){return new O(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&X.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return X.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new O(new X(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(r,t,e){if(!e)throw new C(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function _g(r,t,e,n){if(t===!0&&n===!0)throw new C(P.INVALID_ARGUMENT,`${r} and ${e} cannot be used together.`)}function Yu(r){if(!O.isDocumentKey(r))throw new C(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Zu(r){if(O.isDocumentKey(r))throw new C(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function zl(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function ai(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=function(n){return n.constructor?n.constructor.name:null}(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":M(12329,{type:typeof r})}function At(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new C(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=ai(r);throw new C(P.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return r}function yg(r,t){if(t<=0)throw new C(P.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(r,t){const e={typeString:r};return t&&(e.value=t),e}function qr(r,t){if(!zl(r))throw new C(P.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,i="value"in t[n]?{value:t[n].value}:void 0;if(!(n in r)){e=`JSON missing required field: '${n}'`;break}const a=r[n];if(s&&typeof a!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){e=`Expected '${n}' field to equal '${i.value}'`;break}}if(e)throw new C(P.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=-62135596800,ec=1e6;class Y{static now(){return Y.fromMillis(Date.now())}static fromDate(t){return Y.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*ec);return new Y(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new C(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new C(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<tc)throw new C(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new C(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ec}_compareTo(t){return this.seconds===t.seconds?B(this.nanoseconds,t.nanoseconds):B(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Y._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(qr(t,Y._jsonSchema))return new Y(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-tc;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Y._jsonSchemaVersion="firestore/timestamp/1.0",Y._jsonSchema={type:ht("string",Y._jsonSchemaVersion),seconds:ht("number"),nanoseconds:ht("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static fromTimestamp(t){return new L(t)}static min(){return new L(new Y(0,0))}static max(){return new L(new Y(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr=-1;class qs{constructor(t,e,n,s){this.indexId=t,this.collectionGroup=e,this.fields=n,this.indexState=s}}function Io(r){return r.fields.find(t=>t.kind===2)}function Fe(r){return r.fields.filter(t=>t.kind!==2)}qs.UNKNOWN_ID=-1;class Rs{constructor(t,e){this.fieldPath=t,this.kind=e}}class Sr{constructor(t,e){this.sequenceNumber=t,this.offset=e}static empty(){return new Sr(0,Ot.min())}}function Ig(r,t){const e=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=L.fromTimestamp(n===1e9?new Y(e+1,0):new Y(e,n));return new Ot(s,O.empty(),t)}function $l(r){return new Ot(r.readTime,r.key,Rr)}class Ot{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new Ot(L.min(),O.empty(),Rr)}static max(){return new Ot(L.max(),O.empty(),Rr)}}function $o(r,t){let e=r.readTime.compareTo(t.readTime);return e!==0?e:(e=O.comparator(r.documentKey,t.documentKey),e!==0?e:B(r.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Gl{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function en(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==Kl)throw r;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new v((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(n,s)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof v?e:v.resolve(e)}catch(e){return v.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):v.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):v.reject(e)}static resolve(t){return new v((e,n)=>{e(t)})}static reject(t){return new v((e,n)=>{n(t)})}static waitFor(t){return new v((e,n)=>{let s=0,i=0,a=!1;t.forEach(u=>{++s,u.next(()=>{++i,a&&i===s&&e()},l=>n(l))}),a=!0,i===s&&e()})}static or(t){let e=v.resolve(!1);for(const n of t)e=e.next(s=>s?v.resolve(s):n());return e}static forEach(t,e){const n=[];return t.forEach((s,i)=>{n.push(e.call(this,s,i))}),this.waitFor(n)}static mapArray(t,e){return new v((n,s)=>{const i=t.length,a=new Array(i);let u=0;for(let l=0;l<i;l++){const d=l;e(t[d]).next(f=>{a[d]=f,++u,u===i&&n(a)},f=>s(f))}})}static doWhile(t,e){return new v((n,s)=>{const i=()=>{t()===!0?e().next(()=>{i()},s):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt="SimpleDb";class ui{static open(t,e,n,s){try{return new ui(e,t.transaction(s,n))}catch(i){throw new pr(e,i)}}constructor(t,e){this.action=t,this.transaction=e,this.aborted=!1,this.S=new Wt,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{e.error?this.S.reject(new pr(t,e.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=Ko(n.target.error);this.S.reject(new pr(t,s))}}get D(){return this.S.promise}abort(t){t&&this.S.reject(t),this.aborted||(V(Nt,"Aborting transaction:",t?t.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const t=this.transaction;this.aborted||typeof t.commit!="function"||t.commit()}store(t){const e=this.transaction.objectStore(t);return new Tg(e)}}class Ee{static delete(t){return V(Nt,"Removing database:",t),Be(El().indexedDB.deleteDatabase(t)).toPromise()}static v(){if(!bl())return!1;if(Ee.F())return!0;const t=Tn(),e=Ee.M(t),n=0<e&&e<10,s=Ql(t),i=0<s&&s<4.5;return!(t.indexOf("MSIE ")>0||t.indexOf("Trident/")>0||t.indexOf("Edge/")>0||n||i)}static F(){var t;return typeof process<"u"&&((t=process.__PRIVATE_env)==null?void 0:t.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static O(t,e){return t.store(e)}static M(t){const e=t.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=e?e[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(t,e,n){this.name=t,this.version=e,this.N=n,this.B=null,Ee.M(Tn())===12.2&&Pt("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(t){return this.db||(V(Nt,"Opening database:",this.name),this.db=await new Promise((e,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const a=i.target.result;e(a)},s.onblocked=()=>{n(new pr(t,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const a=i.target.error;a.name==="VersionError"?n(new C(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):a.name==="InvalidStateError"?n(new C(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+a)):n(new pr(t,a))},s.onupgradeneeded=i=>{V(Nt,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const a=i.target.result;this.N.k(a,s.transaction,i.oldVersion,this.version).next(()=>{V(Nt,"Database upgrade to version "+this.version+" complete")})}})),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}K(t){this.q=t,this.db&&(this.db.onversionchange=e=>t(e))}async runTransaction(t,e,n,s){const i=e==="readonly";let a=0;for(;;){++a;try{this.db=await this.L(t);const u=ui.open(this.db,t,i?"readonly":"readwrite",n),l=s(u).next(d=>(u.C(),d)).catch(d=>(u.abort(d),v.reject(d))).toPromise();return l.catch(()=>{}),await u.D,l}catch(u){const l=u,d=l.name!=="FirebaseError"&&a<3;if(V(Nt,"Transaction failed with error:",l.message,"Retrying:",d),this.close(),!d)return Promise.reject(l)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Ql(r){const t=r.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}class Eg{constructor(t){this.U=t,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(t){this.U=t}done(){this.$=!0}j(t){this.W=t}delete(){return Be(this.U.delete())}}class pr extends C{constructor(t,e){super(P.UNAVAILABLE,`IndexedDB transaction '${t}' failed: ${e}`),this.name="IndexedDbTransactionError"}}function Se(r){return r.name==="IndexedDbTransactionError"}class Tg{constructor(t){this.store=t}put(t,e){let n;return e!==void 0?(V(Nt,"PUT",this.store.name,t,e),n=this.store.put(e,t)):(V(Nt,"PUT",this.store.name,"<auto-key>",t),n=this.store.put(t)),Be(n)}add(t){return V(Nt,"ADD",this.store.name,t,t),Be(this.store.add(t))}get(t){return Be(this.store.get(t)).next(e=>(e===void 0&&(e=null),V(Nt,"GET",this.store.name,t,e),e))}delete(t){return V(Nt,"DELETE",this.store.name,t),Be(this.store.delete(t))}count(){return V(Nt,"COUNT",this.store.name),Be(this.store.count())}J(t,e){const n=this.options(t,e),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new v((a,u)=>{i.onerror=l=>{u(l.target.error)},i.onsuccess=l=>{a(l.target.result)}})}{const i=this.cursor(n),a=[];return this.H(i,(u,l)=>{a.push(l)}).next(()=>a)}}Z(t,e){const n=this.store.getAll(t,e===null?void 0:e);return new v((s,i)=>{n.onerror=a=>{i(a.target.error)},n.onsuccess=a=>{s(a.target.result)}})}X(t,e){V(Nt,"DELETE ALL",this.store.name);const n=this.options(t,e);n.Y=!1;const s=this.cursor(n);return this.H(s,(i,a,u)=>u.delete())}ee(t,e){let n;e?n=t:(n={},e=t);const s=this.cursor(n);return this.H(s,e)}te(t){const e=this.cursor({});return new v((n,s)=>{e.onerror=i=>{const a=Ko(i.target.error);s(a)},e.onsuccess=i=>{const a=i.target.result;a?t(a.primaryKey,a.value).next(u=>{u?a.continue():n()}):n()}})}H(t,e){const n=[];return new v((s,i)=>{t.onerror=a=>{i(a.target.error)},t.onsuccess=a=>{const u=a.target.result;if(!u)return void s();const l=new Eg(u),d=e(u.primaryKey,u.value,l);if(d instanceof v){const f=d.catch(g=>(l.done(),v.reject(g)));n.push(f)}l.isDone?s():l.G===null?u.continue():u.continue(l.G)}}).next(()=>v.waitFor(n))}options(t,e){let n;return t!==void 0&&(typeof t=="string"?n=t:e=t),{index:n,range:e}}cursor(t){let e="next";if(t.reverse&&(e="prev"),t.index){const n=this.store.index(t.index);return t.Y?n.openKeyCursor(t.range,e):n.openCursor(t.range,e)}return this.store.openCursor(t.range,e)}}function Be(r){return new v((t,e)=>{r.onsuccess=n=>{const s=n.target.result;t(s)},r.onerror=n=>{const s=Ko(n.target.error);e(s)}})}let nc=!1;function Ko(r){const t=Ee.M(Tn());if(t>=12.2&&t<13){const e="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(e)>=0){const n=new C("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return nc||(nc=!0,setTimeout(()=>{throw n},0)),n}}return r}const _r="IndexBackfiller";class wg{constructor(t,e){this.asyncQueue=t,this.ne=e,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(t){V(_r,`Scheduled in ${t}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",t,async()=>{this.task=null;try{const e=await this.ne.ie();V(_r,`Documents written: ${e}`)}catch(e){Se(e)?V(_r,"Ignoring IndexedDB error during index backfill: ",e):await en(e)}await this.re(6e4)})}}class vg{constructor(t,e){this.localStore=t,this.persistence=e}async ie(t=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",e=>this.se(e,t))}se(t,e){const n=new Set;let s=e,i=!0;return v.doWhile(()=>i===!0&&s>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(t).next(a=>{if(a!==null&&!n.has(a))return V(_r,`Processing collection: ${a}`),this.oe(t,a,s).next(u=>{s-=u,n.add(a)});i=!1})).next(()=>e-s)}oe(t,e,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(t,e).next(s=>this.localStore.localDocuments.getNextDocuments(t,e,s,n).next(i=>{const a=i.changes;return this.localStore.indexManager.updateIndexEntries(t,a).next(()=>this._e(s,i)).next(u=>(V(_r,`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(t,e,u))).next(()=>a.size)}))}_e(t,e){let n=t;return e.changes.forEach((s,i)=>{const a=$l(i);$o(a,n)>0&&(n=a)}),new Ot(n.readTime,n.documentKey,Math.max(e.batchId,t.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>e.writeSequenceNumber(n))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}Ft.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e=-1;function ci(r){return r==null}function Pr(r){return r===0&&1/r==-1/0}function Ag(r){return typeof r=="number"&&Number.isInteger(r)&&!Pr(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js="";function bt(r){let t="";for(let e=0;e<r.length;e++)t.length>0&&(t=rc(t)),t=bg(r.get(e),t);return rc(t)}function bg(r,t){let e=t;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":e+="";break;case js:e+="";break;default:e+=i}}return e}function rc(r){return r+js+""}function Gt(r){const t=r.length;if(F(t>=2,64408,{path:r}),t===2)return F(r.charAt(0)===js&&r.charAt(1)==="",56145,{path:r}),X.emptyPath();const e=t-2,n=[];let s="";for(let i=0;i<t;){const a=r.indexOf(js,i);switch((a<0||a>e)&&M(50515,{path:r}),r.charAt(a+1)){case"":const u=r.substring(i,a);let l;s.length===0?l=u:(s+=u,l=s,s=""),n.push(l);break;case"":s+=r.substring(i,a),s+="\0";break;case"":s+=r.substring(i,a+1);break;default:M(61167,{path:r})}i=a+2}return new X(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le="remoteDocuments",jr="owner",an="owner",Vr="mutationQueues",Rg="userId",Ut="mutations",sc="batchId",ze="userMutationsIndex",ic=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ss(r,t){return[r,bt(t)]}function Hl(r,t,e){return[r,bt(t),e]}const Sg={},vn="documentMutations",zs="remoteDocumentsV14",Pg=["prefixPath","collectionGroup","readTime","documentId"],Ps="documentKeyIndex",Vg=["prefixPath","collectionGroup","documentId"],Wl="collectionGroupIndex",Cg=["collectionGroup","readTime","prefixPath","documentId"],Cr="remoteDocumentGlobal",Eo="remoteDocumentGlobalKey",An="targets",Jl="queryTargetsIndex",Dg=["canonicalId","targetId"],bn="targetDocuments",xg=["targetId","path"],Go="documentTargetsIndex",Ng=["path","targetId"],$s="targetGlobalKey",Ke="targetGlobal",Dr="collectionParents",kg=["collectionId","parent"],Rn="clientMetadata",Og="clientId",li="bundles",Mg="bundleId",hi="namedQueries",Fg="name",Qo="indexConfiguration",Lg="indexId",To="collectionGroupIndex",Bg="collectionGroup",yr="indexState",Ug=["indexId","uid"],Xl="sequenceNumberIndex",qg=["uid","sequenceNumber"],Ir="indexEntries",jg=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Yl="documentKeyIndex",zg=["indexId","uid","orderedDocumentKey"],di="documentOverlays",$g=["userId","collectionPath","documentId"],wo="collectionPathOverlayIndex",Kg=["userId","collectionPath","largestBatchId"],Zl="collectionGroupOverlayIndex",Gg=["userId","collectionGroup","largestBatchId"],Ho="globals",Qg="name",th=[Vr,Ut,vn,Le,An,jr,Ke,bn,Rn,Cr,Dr,li,hi],Hg=[...th,di],eh=[Vr,Ut,vn,zs,An,jr,Ke,bn,Rn,Cr,Dr,li,hi,di],nh=eh,Wo=[...nh,Qo,yr,Ir],Wg=Wo,rh=[...Wo,Ho],Jg=rh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo extends Gl{constructor(t,e){super(),this.le=t,this.currentSequenceNumber=e}}function gt(r,t){const e=q(r);return Ee.O(e.le,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oc(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function Pe(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}function sh(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(t,e){this.comparator=t,this.root=e||It.EMPTY}insert(t,e){return new st(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,It.BLACK,null,null))}remove(t){return new st(this.comparator,this.root.remove(t,this.comparator).copy(null,null,It.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return e+n.left.size;s<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,n)=>(t(e,n),!1))}toString(){const t=[];return this.inorderTraversal((e,n)=>(t.push(`${e}:${n}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Is(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Is(this.root,t,this.comparator,!1)}getReverseIterator(){return new Is(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Is(this.root,t,this.comparator,!0)}}class Is{constructor(t,e,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class It{constructor(t,e,n,s,i){this.key=t,this.value=e,this.color=n??It.RED,this.left=s??It.EMPTY,this.right=i??It.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,s,i){return new It(t??this.key,e??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let s=this;const i=n(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,n),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return It.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return It.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,It.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,It.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw M(27949);return t+(this.isRed()?0:1)}}It.EMPTY=null,It.RED=!0,It.BLACK=!1;It.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(t,e,n,s,i){return this}insert(t,e,n){return new It(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(t){this.comparator=t,this.data=new st(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,n)=>(t(e),!1))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new ac(this.data.getIterator())}getIteratorFrom(t){return new ac(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(n=>{e=e.add(n)}),e}isEqual(t){if(!(t instanceof tt)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new tt(this.comparator);return e.data=t,e}}class ac{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function un(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(t){this.fields=t,t.sort(ot.comparator)}static empty(){return new Dt([])}unionWith(t){let e=new tt(ot.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new Dt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return wn(this.fields,t.fields,(e,n)=>e.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new ih("Invalid base64 string: "+i):i}}(t);return new dt(e)}static fromUint8Array(t){const e=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(t);return new dt(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return B(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}dt.EMPTY_BYTE_STRING=new dt("");const Xg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function te(r){if(F(!!r,39018),typeof r=="string"){let t=0;const e=Xg.exec(r);if(F(!!e,46558,{timestamp:r}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:it(r.seconds),nanos:it(r.nanos)}}function it(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function ee(r){return typeof r=="string"?dt.fromBase64String(r):dt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oh="server_timestamp",ah="__type__",uh="__previous_value__",ch="__local_write_time__";function Jo(r){var e,n;return((n=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[ah])==null?void 0:n.stringValue)===oh}function fi(r){const t=r.mapValue.fields[uh];return Jo(t)?fi(t):t}function xr(r){const t=te(r.mapValue.fields[ch].timestampValue);return new Y(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yg{constructor(t,e,n,s,i,a,u,l,d,f,g){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=l,this.useFetchStreams=d,this.isUsingEmulator=f,this.apiKey=g}}const Ks="(default)";class Je{constructor(t,e){this.projectId=t,this.database=e||Ks}static empty(){return new Je("","")}get isDefaultDatabase(){return this.database===Ks}isEqual(t){return t instanceof Je&&t.projectId===this.projectId&&t.database===this.database}}function Zg(r,t){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new C(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Je(r.options.projectId,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo="__type__",lh="__max__",pe={mapValue:{fields:{__type__:{stringValue:lh}}}},Yo="__vector__",Sn="value",Vs={nullValue:"NULL_VALUE"};function ve(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Jo(r)?4:dh(r)?9007199254740991:mi(r)?10:11:M(28295,{value:r})}function Xt(r,t){if(r===t)return!0;const e=ve(r);if(e!==ve(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return xr(r).isEqual(xr(t));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=te(s.timestampValue),u=te(i.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(r,t);case 5:return r.stringValue===t.stringValue;case 6:return function(s,i){return ee(s.bytesValue).isEqual(ee(i.bytesValue))}(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return function(s,i){return it(s.geoPointValue.latitude)===it(i.geoPointValue.latitude)&&it(s.geoPointValue.longitude)===it(i.geoPointValue.longitude)}(r,t);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return it(s.integerValue)===it(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=it(s.doubleValue),u=it(i.doubleValue);return a===u?Pr(a)===Pr(u):isNaN(a)&&isNaN(u)}return!1}(r,t);case 9:return wn(r.arrayValue.values||[],t.arrayValue.values||[],Xt);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},u=i.mapValue.fields||{};if(oc(a)!==oc(u))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(u[l]===void 0||!Xt(a[l],u[l])))return!1;return!0}(r,t);default:return M(52216,{left:r})}}function Nr(r,t){return(r.values||[]).find(e=>Xt(e,t))!==void 0}function Ae(r,t){if(r===t)return 0;const e=ve(r),n=ve(t);if(e!==n)return B(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return B(r.booleanValue,t.booleanValue);case 2:return function(i,a){const u=it(i.integerValue||i.doubleValue),l=it(a.integerValue||a.doubleValue);return u<l?-1:u>l?1:u===l?0:isNaN(u)?isNaN(l)?0:-1:1}(r,t);case 3:return uc(r.timestampValue,t.timestampValue);case 4:return uc(xr(r),xr(t));case 5:return yo(r.stringValue,t.stringValue);case 6:return function(i,a){const u=ee(i),l=ee(a);return u.compareTo(l)}(r.bytesValue,t.bytesValue);case 7:return function(i,a){const u=i.split("/"),l=a.split("/");for(let d=0;d<u.length&&d<l.length;d++){const f=B(u[d],l[d]);if(f!==0)return f}return B(u.length,l.length)}(r.referenceValue,t.referenceValue);case 8:return function(i,a){const u=B(it(i.latitude),it(a.latitude));return u!==0?u:B(it(i.longitude),it(a.longitude))}(r.geoPointValue,t.geoPointValue);case 9:return cc(r.arrayValue,t.arrayValue);case 10:return function(i,a){var I,S,D,k;const u=i.fields||{},l=a.fields||{},d=(I=u[Sn])==null?void 0:I.arrayValue,f=(S=l[Sn])==null?void 0:S.arrayValue,g=B(((D=d==null?void 0:d.values)==null?void 0:D.length)||0,((k=f==null?void 0:f.values)==null?void 0:k.length)||0);return g!==0?g:cc(d,f)}(r.mapValue,t.mapValue);case 11:return function(i,a){if(i===pe.mapValue&&a===pe.mapValue)return 0;if(i===pe.mapValue)return 1;if(a===pe.mapValue)return-1;const u=i.fields||{},l=Object.keys(u),d=a.fields||{},f=Object.keys(d);l.sort(),f.sort();for(let g=0;g<l.length&&g<f.length;++g){const I=yo(l[g],f[g]);if(I!==0)return I;const S=Ae(u[l[g]],d[f[g]]);if(S!==0)return S}return B(l.length,f.length)}(r.mapValue,t.mapValue);default:throw M(23264,{he:e})}}function uc(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return B(r,t);const e=te(r),n=te(t),s=B(e.seconds,n.seconds);return s!==0?s:B(e.nanos,n.nanos)}function cc(r,t){const e=r.values||[],n=t.values||[];for(let s=0;s<e.length&&s<n.length;++s){const i=Ae(e[s],n[s]);if(i)return i}return B(e.length,n.length)}function Pn(r){return Ao(r)}function Ao(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(e){const n=te(e);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(e){return ee(e).toBase64()}(r.bytesValue):"referenceValue"in r?function(e){return O.fromName(e).toString()}(r.referenceValue):"geoPointValue"in r?function(e){return`geo(${e.latitude},${e.longitude})`}(r.geoPointValue):"arrayValue"in r?function(e){let n="[",s=!0;for(const i of e.values||[])s?s=!1:n+=",",n+=Ao(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(e){const n=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const a of n)i?i=!1:s+=",",s+=`${a}:${Ao(e.fields[a])}`;return s+"}"}(r.mapValue):M(61005,{value:r})}function Cs(r){switch(ve(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=fi(r);return t?16+Cs(t):16;case 5:return 2*r.stringValue.length;case 6:return ee(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,i)=>s+Cs(i),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return Pe(n.fields,(i,a)=>{s+=i.length+Cs(a)}),s}(r.mapValue);default:throw M(13486,{value:r})}}function kr(r,t){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${t.path.canonicalString()}`}}function Or(r){return!!r&&"integerValue"in r}function hh(r){return Or(r)||function(e){return!!e&&"doubleValue"in e}(r)}function Mr(r){return!!r&&"arrayValue"in r}function lc(r){return!!r&&"nullValue"in r}function hc(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ds(r){return!!r&&"mapValue"in r}function mi(r){var e,n;return((n=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[Xo])==null?void 0:n.stringValue)===Yo}function Er(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const t={mapValue:{fields:{}}};return Pe(r.mapValue.fields,(e,n)=>t.mapValue.fields[e]=Er(n)),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=Er(r.arrayValue.values[e]);return t}return{...r}}function dh(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===lh}const fh={mapValue:{fields:{[Xo]:{stringValue:Yo},[Sn]:{arrayValue:{}}}}};function tp(r){return"nullValue"in r?Vs:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?kr(Je.empty(),O.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?mi(r)?fh:{mapValue:{}}:M(35942,{value:r})}function ep(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?kr(Je.empty(),O.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?fh:"mapValue"in r?mi(r)?{mapValue:{}}:pe:M(61959,{value:r})}function dc(r,t){const e=Ae(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?-1:!r.inclusive&&t.inclusive?1:0}function fc(r,t){const e=Ae(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?1:!r.inclusive&&t.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(t){this.value=t}static empty(){return new vt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!Ds(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=Er(e)}setAll(t){let e=ot.emptyPath(),n={},s=[];t.forEach((a,u)=>{if(!e.isImmediateParentOf(u)){const l=this.getFieldsMap(e);this.applyChanges(l,n,s),n={},s=[],e=u.popLast()}a?n[u.lastSegment()]=Er(a):s.push(u.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,n,s)}delete(t){const e=this.field(t.popLast());Ds(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Xt(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let s=e.mapValue.fields[t.get(n)];Ds(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,n){Pe(e,(s,i)=>t[s]=i);for(const s of n)delete t[s]}clone(){return new vt(Er(this.value))}}function mh(r){const t=[];return Pe(r.fields,(e,n)=>{const s=new ot([e]);if(Ds(n)){const i=mh(n.mapValue).fields;if(i.length===0)t.push(s);else for(const a of i)t.push(s.child(a))}else t.push(s)}),new Dt(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(t,e,n,s,i,a,u){this.key=t,this.documentType=e,this.version=n,this.readTime=s,this.createTime=i,this.data=a,this.documentState=u}static newInvalidDocument(t){return new ut(t,0,L.min(),L.min(),L.min(),vt.empty(),0)}static newFoundDocument(t,e,n,s){return new ut(t,1,e,L.min(),n,s,0)}static newNoDocument(t,e){return new ut(t,2,e,L.min(),L.min(),vt.empty(),0)}static newUnknownDocument(t,e){return new ut(t,3,e,L.min(),L.min(),vt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=vt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=vt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof ut&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new ut(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(t,e){this.position=t,this.inclusive=e}}function mc(r,t,e){let n=0;for(let s=0;s<r.position.length;s++){const i=t[s],a=r.position[s];if(i.field.isKeyField()?n=O.comparator(O.fromName(a.referenceValue),e.key):n=Ae(a,e.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function gc(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!Xt(r.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(t,e="asc"){this.field=t,this.dir=e}}function np(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh{}class K extends gh{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new rp(t,e,n):e==="array-contains"?new op(t,n):e==="in"?new Th(t,n):e==="not-in"?new ap(t,n):e==="array-contains-any"?new up(t,n):new K(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new sp(t,n):new ip(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Ae(e,this.value)):e!==null&&ve(this.value)===ve(e)&&this.matchesComparison(Ae(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Z extends gh{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Z(t,e)}matches(t){return Cn(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Cn(r){return r.op==="and"}function bo(r){return r.op==="or"}function Zo(r){return ph(r)&&Cn(r)}function ph(r){for(const t of r.filters)if(t instanceof Z)return!1;return!0}function Ro(r){if(r instanceof K)return r.field.canonicalString()+r.op.toString()+Pn(r.value);if(Zo(r))return r.filters.map(t=>Ro(t)).join(",");{const t=r.filters.map(e=>Ro(e)).join(",");return`${r.op}(${t})`}}function _h(r,t){return r instanceof K?function(n,s){return s instanceof K&&n.op===s.op&&n.field.isEqual(s.field)&&Xt(n.value,s.value)}(r,t):r instanceof Z?function(n,s){return s instanceof Z&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,a,u)=>i&&_h(a,s.filters[u]),!0):!1}(r,t):void M(19439)}function yh(r,t){const e=r.filters.concat(t);return Z.create(e,r.op)}function Ih(r){return r instanceof K?function(e){return`${e.field.canonicalString()} ${e.op} ${Pn(e.value)}`}(r):r instanceof Z?function(e){return e.op.toString()+" {"+e.getFilters().map(Ih).join(" ,")+"}"}(r):"Filter"}class rp extends K{constructor(t,e,n){super(t,e,n),this.key=O.fromName(n.referenceValue)}matches(t){const e=O.comparator(t.key,this.key);return this.matchesComparison(e)}}class sp extends K{constructor(t,e){super(t,"in",e),this.keys=Eh("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class ip extends K{constructor(t,e){super(t,"not-in",e),this.keys=Eh("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function Eh(r,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map(n=>O.fromName(n.referenceValue))}class op extends K{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Mr(e)&&Nr(e.arrayValue,this.value)}}class Th extends K{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Nr(this.value.arrayValue,e)}}class ap extends K{constructor(t,e){super(t,"not-in",e)}matches(t){if(Nr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!Nr(this.value.arrayValue,e)}}class up extends K{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Mr(e)||!e.arrayValue.values)&&e.arrayValue.values.some(n=>Nr(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{constructor(t,e=null,n=[],s=[],i=null,a=null,u=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=a,this.endAt=u,this.Te=null}}function So(r,t=null,e=[],n=[],s=null,i=null,a=null){return new cp(r,t,e,n,s,i,a)}function Xe(r){const t=q(r);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(n=>Ro(n)).join(","),e+="|ob:",e+=t.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),ci(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(n=>Pn(n)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(n=>Pn(n)).join(",")),t.Te=e}return t.Te}function zr(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<r.orderBy.length;e++)if(!np(r.orderBy[e],t.orderBy[e]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let e=0;e<r.filters.length;e++)if(!_h(r.filters[e],t.filters[e]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!gc(r.startAt,t.startAt)&&gc(r.endAt,t.endAt)}function Gs(r){return O.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Qs(r,t){return r.filters.filter(e=>e instanceof K&&e.field.isEqual(t))}function pc(r,t,e){let n=Vs,s=!0;for(const i of Qs(r,t)){let a=Vs,u=!0;switch(i.op){case"<":case"<=":a=tp(i.value);break;case"==":case"in":case">=":a=i.value;break;case">":a=i.value,u=!1;break;case"!=":case"not-in":a=Vs}dc({value:n,inclusive:s},{value:a,inclusive:u})<0&&(n=a,s=u)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const a=e.position[i];dc({value:n,inclusive:s},{value:a,inclusive:e.inclusive})<0&&(n=a,s=e.inclusive);break}}return{value:n,inclusive:s}}function _c(r,t,e){let n=pe,s=!0;for(const i of Qs(r,t)){let a=pe,u=!0;switch(i.op){case">=":case">":a=ep(i.value),u=!1;break;case"==":case"in":case"<=":a=i.value;break;case"<":a=i.value,u=!1;break;case"!=":case"not-in":a=pe}fc({value:n,inclusive:s},{value:a,inclusive:u})>0&&(n=a,s=u)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const a=e.position[i];fc({value:n,inclusive:s},{value:a,inclusive:e.inclusive})>0&&(n=a,s=e.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(t,e=null,n=[],s=[],i=null,a="F",u=null,l=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=a,this.startAt=u,this.endAt=l,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function lp(r,t,e,n,s,i,a,u){return new Bn(r,t,e,n,s,i,a,u)}function $r(r){return new Bn(r)}function yc(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function hp(r){return O.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function wh(r){return r.collectionGroup!==null}function Tr(r){const t=q(r);if(t.Ie===null){t.Ie=[];const e=new Set;for(const i of t.explicitOrderBy)t.Ie.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new tt(ot.comparator);return a.filters.forEach(l=>{l.getFlattenedFilters().forEach(d=>{d.isInequality()&&(u=u.add(d.field))})}),u})(t).forEach(i=>{e.has(i.canonicalString())||i.isKeyField()||t.Ie.push(new Fr(i,n))}),e.has(ot.keyField().canonicalString())||t.Ie.push(new Fr(ot.keyField(),n))}return t.Ie}function Lt(r){const t=q(r);return t.Ee||(t.Ee=dp(t,Tr(r))),t.Ee}function dp(r,t){if(r.limitType==="F")return So(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Fr(s.field,i)});const e=r.endAt?new Vn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Vn(r.startAt.position,r.startAt.inclusive):null;return So(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function Po(r,t){const e=r.filters.concat([t]);return new Bn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),e,r.limit,r.limitType,r.startAt,r.endAt)}function fp(r,t){const e=r.explicitOrderBy.concat([t]);return new Bn(r.path,r.collectionGroup,e,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Hs(r,t,e){return new Bn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,e,r.startAt,r.endAt)}function gi(r,t){return zr(Lt(r),Lt(t))&&r.limitType===t.limitType}function vh(r){return`${Xe(Lt(r))}|lt:${r.limitType}`}function mn(r){return`Query(target=${function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map(s=>Ih(s)).join(", ")}]`),ci(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(s=>Pn(s)).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(s=>Pn(s)).join(",")),`Target(${n})`}(Lt(r))}; limitType=${r.limitType})`}function Kr(r,t){return t.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):O.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,t)&&function(n,s){for(const i of Tr(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,t)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,t)&&function(n,s){return!(n.startAt&&!function(a,u,l){const d=mc(a,u,l);return a.inclusive?d<=0:d<0}(n.startAt,Tr(n),s)||n.endAt&&!function(a,u,l){const d=mc(a,u,l);return a.inclusive?d>=0:d>0}(n.endAt,Tr(n),s))}(r,t)}function mp(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Ah(r){return(t,e)=>{let n=!1;for(const s of Tr(r)){const i=gp(s,t,e);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function gp(r,t,e){const n=r.field.isKeyField()?O.comparator(t.key,e.key):function(i,a,u){const l=a.data.field(i),d=u.data.field(i);return l!==null&&d!==null?Ae(l,d):M(42886)}(r.field,t,e);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],t))return n.length===1?delete this.inner[e]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Pe(this.inner,(e,n)=>{for(const[s,i]of n)t(s,i)})}isEmpty(){return sh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pp=new st(O.comparator);function kt(){return pp}const bh=new st(O.comparator);function dr(...r){let t=bh;for(const e of r)t=t.insert(e.key,e);return t}function Rh(r){let t=bh;return r.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function Qt(){return wr()}function Sh(){return wr()}function wr(){return new re(r=>r.toString(),(r,t)=>r.isEqual(t))}const _p=new st(O.comparator),yp=new tt(O.comparator);function $(...r){let t=yp;for(const e of r)t=t.add(e);return t}const Ip=new tt(B);function Ep(){return Ip}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pi(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pr(t)?"-0":t}}function ta(r){return{integerValue:""+r}}function Tp(r,t){return Ag(t)?ta(t):pi(r,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(){this._=void 0}}function wp(r,t,e){return r instanceof Dn?function(s,i){const a={fields:{[ah]:{stringValue:oh},[ch]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Jo(i)&&(i=fi(i)),i&&(a.fields[uh]=i),{mapValue:a}}(e,t):r instanceof xn?Vh(r,t):r instanceof Nn?Ch(r,t):r instanceof kn?function(s,i){const a=Ph(s,i),u=Ws(a)+Ws(s.Ae);return Or(a)&&Or(s.Ae)?ta(u):pi(s.serializer,u)}(r,t):r instanceof Lr?function(s,i){return Ic(s,i,Math.min)}(r,t):r instanceof Br?function(s,i){return Ic(s,i,Math.max)}(r,t):void 0}function vp(r,t,e){return r instanceof xn?Vh(r,t):r instanceof Nn?Ch(r,t):e}function Ph(r,t){return r instanceof kn?hh(t)?t:{integerValue:0}:null}class Dn extends _i{}class xn extends _i{constructor(t){super(),this.elements=t}}function Vh(r,t){const e=Dh(t);for(const n of r.elements)e.some(s=>Xt(s,n))||e.push(n);return{arrayValue:{values:e}}}class Nn extends _i{constructor(t){super(),this.elements=t}}function Ch(r,t){let e=Dh(t);for(const n of r.elements)e=e.filter(s=>!Xt(s,n));return{arrayValue:{values:e}}}class ea extends _i{constructor(t,e){super(),this.serializer=t,this.Ae=e}}class kn extends ea{}class Lr extends ea{}class Br extends ea{}function Ic(r,t,e){if(!hh(t))return r.Ae;const n=e(Ws(t),Ws(r.Ae));return Or(t)&&Or(r.Ae)?ta(n):pi(r.serializer,n)}function Ws(r){return it(r.integerValue||r.doubleValue)}function Dh(r){return Mr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(t,e){this.field=t,this.transform=e}}function Ap(r,t){return r.field.isEqual(t.field)&&function(n,s){return n instanceof xn&&s instanceof xn||n instanceof Nn&&s instanceof Nn?wn(n.elements,s.elements,Xt):n instanceof kn&&s instanceof kn||n instanceof Lr&&s instanceof Lr||n instanceof Br&&s instanceof Br?Xt(n.Ae,s.Ae):n instanceof Dn&&s instanceof Dn}(r.transform,t.transform)}class bp{constructor(t,e){this.version=t,this.transformResults=e}}class mt{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new mt}static exists(t){return new mt(void 0,t)}static updateTime(t){return new mt(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function xs(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class yi{}function Nh(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new Gr(r.key,mt.none()):new Un(r.key,r.data,mt.none());{const e=r.data,n=vt.empty();let s=new tt(ot.comparator);for(let i of t.fields)if(!s.has(i)){let a=e.field(i);a===null&&i.length>1&&(i=i.popLast(),a=e.field(i)),a===null?n.delete(i):n.set(i,a),s=s.add(i)}return new se(r.key,n,new Dt(s.toArray()),mt.none())}}function Rp(r,t,e){r instanceof Un?function(s,i,a){const u=s.value.clone(),l=Tc(s.fieldTransforms,i,a.transformResults);u.setAll(l),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()}(r,t,e):r instanceof se?function(s,i,a){if(!xs(s.precondition,i))return void i.convertToUnknownDocument(a.version);const u=Tc(s.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(kh(s)),l.setAll(u),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(r,t,e):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,t,e)}function vr(r,t,e,n){return r instanceof Un?function(i,a,u,l){if(!xs(i.precondition,a))return u;const d=i.value.clone(),f=wc(i.fieldTransforms,l,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(r,t,e,n):r instanceof se?function(i,a,u,l){if(!xs(i.precondition,a))return u;const d=wc(i.fieldTransforms,l,a),f=a.data;return f.setAll(kh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(g=>g.field))}(r,t,e,n):function(i,a,u){return xs(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u}(r,t,e)}function Sp(r,t){let e=null;for(const n of r.fieldTransforms){const s=t.data.field(n.field),i=Ph(n.transform,s||null);i!=null&&(e===null&&(e=vt.empty()),e.set(n.field,i))}return e||null}function Ec(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&wn(n,s,(i,a)=>Ap(i,a))}(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class Un extends yi{constructor(t,e,n,s=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class se extends yi{constructor(t,e,n,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function kh(r){const t=new Map;return r.fieldMask.fields.forEach(e=>{if(!e.isEmpty()){const n=r.data.field(e);t.set(e,n)}}),t}function Tc(r,t,e){const n=new Map;F(r.length===e.length,32656,{Ve:e.length,de:r.length});for(let s=0;s<e.length;s++){const i=r[s],a=i.transform,u=t.data.field(i.field);n.set(i.field,vp(a,u,e[s]))}return n}function wc(r,t,e){const n=new Map;for(const s of r){const i=s.transform,a=e.data.field(s.field);n.set(s.field,wp(i,a,t))}return n}class Gr extends yi{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Oh extends yi{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class na{constructor(t,e,n,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&Rp(i,t,n[s])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=vr(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=vr(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=Sh();return this.mutations.forEach(s=>{const i=t.get(s.key),a=i.overlayedDocument;let u=this.applyToLocalView(a,i.mutatedFields);u=e.has(s.key)?null:u;const l=Nh(a,u);l!==null&&n.set(s.key,l),a.isValidDocument()||a.convertToNoDocument(L.min())}),n}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),$())}isEqual(t){return this.batchId===t.batchId&&wn(this.mutations,t.mutations,(e,n)=>Ec(e,n))&&wn(this.baseMutations,t.baseMutations,(e,n)=>Ec(e,n))}}class ra{constructor(t,e,n,s){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=s}static from(t,e,n){F(t.mutations.length===n.length,58842,{me:t.mutations.length,fe:n.length});let s=function(){return _p}();const i=t.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,n[a].version);return new ra(t,e,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sa{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lt,Q;function Vp(r){switch(r){case P.OK:return M(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return M(15467,{code:r})}}function Mh(r){if(r===void 0)return Pt("GRPC error has no .code"),P.UNKNOWN;switch(r){case lt.OK:return P.OK;case lt.CANCELLED:return P.CANCELLED;case lt.UNKNOWN:return P.UNKNOWN;case lt.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case lt.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case lt.INTERNAL:return P.INTERNAL;case lt.UNAVAILABLE:return P.UNAVAILABLE;case lt.UNAUTHENTICATED:return P.UNAUTHENTICATED;case lt.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case lt.NOT_FOUND:return P.NOT_FOUND;case lt.ALREADY_EXISTS:return P.ALREADY_EXISTS;case lt.PERMISSION_DENIED:return P.PERMISSION_DENIED;case lt.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case lt.ABORTED:return P.ABORTED;case lt.OUT_OF_RANGE:return P.OUT_OF_RANGE;case lt.UNIMPLEMENTED:return P.UNIMPLEMENTED;case lt.DATA_LOSS:return P.DATA_LOSS;default:return M(39323,{code:r})}}(Q=lt||(lt={}))[Q.OK=0]="OK",Q[Q.CANCELLED=1]="CANCELLED",Q[Q.UNKNOWN=2]="UNKNOWN",Q[Q.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Q[Q.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Q[Q.NOT_FOUND=5]="NOT_FOUND",Q[Q.ALREADY_EXISTS=6]="ALREADY_EXISTS",Q[Q.PERMISSION_DENIED=7]="PERMISSION_DENIED",Q[Q.UNAUTHENTICATED=16]="UNAUTHENTICATED",Q[Q.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Q[Q.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Q[Q.ABORTED=10]="ABORTED",Q[Q.OUT_OF_RANGE=11]="OUT_OF_RANGE",Q[Q.UNIMPLEMENTED=12]="UNIMPLEMENTED",Q[Q.INTERNAL=13]="INTERNAL",Q[Q.UNAVAILABLE=14]="UNAVAILABLE",Q[Q.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cp(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dp=new Ie([4294967295,4294967295],0);function vc(r){const t=Cp().encode(r),e=new Nl;return e.update(t),new Uint8Array(e.digest())}function Ac(r){const t=new DataView(r.buffer),e=t.getUint32(0,!0),n=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new Ie([e,n],0),new Ie([s,i],0)]}class ia{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new fr(`Invalid padding: ${e}`);if(n<0)throw new fr(`Invalid hash count: ${n}`);if(t.length>0&&this.hashCount===0)throw new fr(`Invalid hash count: ${n}`);if(t.length===0&&e!==0)throw new fr(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=Ie.fromNumber(this.ge)}ye(t,e,n){let s=t.add(e.multiply(Ie.fromNumber(n)));return s.compare(Dp)===1&&(s=new Ie([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=vc(t),[n,s]=Ac(e);for(let i=0;i<this.hashCount;i++){const a=this.ye(n,s,i);if(!this.we(a))return!1}return!0}static create(t,e,n){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),a=new ia(i,s,e);return n.forEach(u=>a.insert(u)),a}insert(t){if(this.ge===0)return;const e=vc(t),[n,s]=Ac(e);for(let i=0;i<this.hashCount;i++){const a=this.ye(n,s,i);this.Se(a)}}Se(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class fr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(t,e,n,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const s=new Map;return s.set(t,Hr.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new Qr(L.min(),s,new st(B),kt(),$())}}class Hr{constructor(t,e,n,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Hr(n,e,$(),$(),$())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(t,e,n,s){this.be=t,this.removedTargetIds=e,this.key=n,this.De=s}}class Fh{constructor(t,e){this.targetId=t,this.Ce=e}}class Lh{constructor(t,e,n=dt.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=s}}class bc{constructor(t){this.targetId=t,this.ve=0,this.Fe=Rc(),this.Me=dt.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=$(),e=$(),n=$();return this.Fe.forEach((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:n=n.add(s);break;default:M(38017,{changeType:i})}}),new Hr(this.Me,this.xe,t,e,n)}qe(){this.Oe=!1,this.Fe=Rc()}Ke(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}Ue(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}$e(){this.ve+=1}We(){this.ve-=1,F(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const sr="WatchChangeAggregator";class xp{constructor(t){this.Ge=t,this.ze=new Map,this.je=kt(),this.Je=Es(),this.He=Es(),this.Ze=new st(B)}Xe(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Ye(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,e=>{const n=this.ze.get(e);if(n)switch(t.state){case 0:this.nt(e)&&n.Le(t.resumeToken);break;case 1:n.We(),n.Ne||n.qe(),n.Le(t.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(e);break;case 3:this.nt(e)&&(n.Qe(),n.Le(t.resumeToken));break;case 4:this.nt(e)&&(this.rt(e),n.Le(t.resumeToken));break;default:M(56790,{state:t.state})}else V(sr,`handleTargetChange received targetChange for untracked target ID (${e}) with state (${t.state})`)})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach((n,s)=>{this.nt(s)&&e(s)})}it(t){const e=t.targetId,n=t.Ce.count,s=this.st(e);if(s){const i=s.target;if(Gs(i))if(n===0){const a=new O(i.path);this.et(e,a,ut.newNoDocument(a,L.min()))}else F(n===1,20013,{expectedCount:n});else{const a=this.ot(e);if(a!==n){const u=this._t(t),l=u?this.ut(u,t,a):1;if(l!==0){this.rt(e);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(e,d)}}}}}_t(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=e;let a,u;try{a=ee(n).toUint8Array()}catch(l){if(l instanceof ih)return we("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{u=new ia(a,s,i)}catch(l){return we(l instanceof fr?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return u.ge===0?null:u}ut(t,e,n){return e.Ce.count===n-this.ht(t,e.targetId)?0:2}ht(t,e){const n=this.Ge.getRemoteKeysForTarget(e);let s=0;return n.forEach(i=>{const a=this.Ge.lt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;t.mightContain(u)||(this.et(e,i,null),s++)}),s}Pt(t){const e=new Map;this.ze.forEach((i,a)=>{const u=this.st(a);if(u){if(i.current&&Gs(u.target)){const l=new O(u.target.path);this.Tt(l).has(a)||this.It(a,l)||this.et(a,l,ut.newNoDocument(l,t))}i.Be&&(e.set(a,i.ke()),i.qe())}});let n=$();this.He.forEach((i,a)=>{let u=!0;a.forEachWhile(l=>{const d=this.st(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(n=n.add(i))}),this.je.forEach((i,a)=>a.setReadTime(t));const s=new Qr(t,e,this.Ze,this.je,n);return this.je=kt(),this.Je=Es(),this.He=Es(),this.Ze=new st(B),s}Ye(t,e){const n=this.ze.get(t);if(!n||!this.nt(t))return void V(sr,`addDocumentToTarget received document for unknown inactive target (${t})`);const s=this.It(t,e.key)?2:0;n.Ke(e.key,s),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.Tt(e.key).add(t)),this.He=this.He.insert(e.key,this.Et(e.key).add(t))}et(t,e,n){const s=this.ze.get(t);s&&this.nt(t)?(this.It(t,e)?s.Ke(e,1):s.Ue(e),this.He=this.He.insert(e,this.Et(e).delete(t)),this.He=this.He.insert(e,this.Et(e).add(t)),n&&(this.je=this.je.insert(e,n))):V(sr,`removeDocumentFromTarget received document for unknown or inactive target (${t})`)}removeTarget(t){this.ze.delete(t)}ot(t){const e=this.ze.get(t);if(!e)return 0;const n=e.ke();return this.Ge.getRemoteKeysForTarget(t).size+n.addedDocuments.size-n.removedDocuments.size}$e(t){let e=this.ze.get(t);e||(V(sr,`recordPendingTargetRequest set up tracking for target ID ${t}`),e=new bc(t),this.ze.set(t,e)),e.$e()}Et(t){let e=this.He.get(t);return e||(e=new tt(B),this.He=this.He.insert(t,e)),e}Tt(t){let e=this.Je.get(t);return e||(e=new tt(B),this.Je=this.Je.insert(t,e)),e}nt(t){const e=this.st(t)!==null;return e||V(sr,"Detected inactive target",t),e}st(t){const e=this.ze.get(t);return e===void 0||e.Ne?null:this.Ge.Rt(t)}rt(t){this.ze.set(t,new bc(t)),this.Ge.getRemoteKeysForTarget(t).forEach(e=>{this.et(t,e,null)})}It(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function Es(){return new st(O.comparator)}function Rc(){return new st(O.comparator)}const Np={asc:"ASCENDING",desc:"DESCENDING"},kp={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Op={and:"AND",or:"OR"};class Mp{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Vo(r,t){return r.useProto3Json||ci(t)?t:{value:t}}function On(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Bh(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function Fp(r,t){return On(r,t.toTimestamp())}function Vt(r){return F(!!r,49232),L.fromTimestamp(function(e){const n=te(e);return new Y(n.seconds,n.nanos)}(r))}function oa(r,t){return Co(r,t).canonicalString()}function Co(r,t){const e=function(s){return new X(["projects",s.projectId,"databases",s.database])}(r).child("documents");return t===void 0?e:e.child(t)}function Uh(r){const t=X.fromString(r);return F(Wh(t),10190,{key:t.toString()}),t}function Js(r,t){return oa(r.databaseId,t.path)}function Ge(r,t){const e=Uh(t);if(e.get(1)!==r.databaseId.projectId)throw new C(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new C(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new O(zh(e))}function qh(r,t){return oa(r.databaseId,t)}function jh(r){const t=Uh(r);return t.length===4?X.emptyPath():zh(t)}function Do(r){return new X(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function zh(r){return F(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Sc(r,t,e){return{name:Js(r,t),fields:e.value.mapValue.fields}}function Lp(r,t,e){const n=Ge(r,t.name),s=Vt(t.updateTime),i=t.createTime?Vt(t.createTime):L.min(),a=new vt({mapValue:{fields:t.fields}}),u=ut.newFoundDocument(n,s,i,a);return e&&u.setHasCommittedMutations(),e?u.setHasCommittedMutations():u}function Bp(r,t){let e;if("targetChange"in t){t.targetChange;const n=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})}(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(F(f===void 0||typeof f=="string",58123),dt.fromBase64String(f||"")):(F(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),dt.fromUint8Array(f||new Uint8Array))}(r,t.targetChange.resumeToken),a=t.targetChange.cause,u=a&&function(d){const f=d.code===void 0?P.UNKNOWN:Mh(d.code);return new C(f,d.message||"")}(a);e=new Lh(n,s,i,u||null)}else if("documentChange"in t){t.documentChange;const n=t.documentChange;n.document,n.document.name,n.document.updateTime;const s=Ge(r,n.document.name),i=Vt(n.document.updateTime),a=n.document.createTime?Vt(n.document.createTime):L.min(),u=new vt({mapValue:{fields:n.document.fields}}),l=ut.newFoundDocument(s,i,a,u),d=n.targetIds||[],f=n.removedTargetIds||[];e=new Ns(d,f,l.key,l)}else if("documentDelete"in t){t.documentDelete;const n=t.documentDelete;n.document;const s=Ge(r,n.document),i=n.readTime?Vt(n.readTime):L.min(),a=ut.newNoDocument(s,i),u=n.removedTargetIds||[];e=new Ns([],u,a.key,a)}else if("documentRemove"in t){t.documentRemove;const n=t.documentRemove;n.document;const s=Ge(r,n.document),i=n.removedTargetIds||[];e=new Ns([],i,s,null)}else{if(!("filter"in t))return M(11601,{At:t});{t.filter;const n=t.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,a=new Pp(s,i),u=n.targetId;e=new Fh(u,a)}}return e}function Xs(r,t){let e;if(t instanceof Un)e={update:Sc(r,t.key,t.value)};else if(t instanceof Gr)e={delete:Js(r,t.key)};else if(t instanceof se)e={update:Sc(r,t.key,t.data),updateMask:Kp(t.fieldMask)};else{if(!(t instanceof Oh))return M(16599,{Vt:t.type});e={verify:Js(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(n=>function(i,a){const u=a.transform;if(u instanceof Dn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof xn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Nn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof kn)return{fieldPath:a.field.canonicalString(),increment:u.Ae};if(u instanceof Lr)return{fieldPath:a.field.canonicalString(),minimum:u.Ae};if(u instanceof Br)return{fieldPath:a.field.canonicalString(),maximum:u.Ae};throw M(20930,{transform:a.transform})}(0,n))),t.precondition.isNone||(e.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:Fp(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:M(27497)}(r,t.precondition)),e}function xo(r,t){const e=t.currentDocument?function(i){return i.updateTime!==void 0?mt.updateTime(Vt(i.updateTime)):i.exists!==void 0?mt.exists(i.exists):mt.none()}(t.currentDocument):mt.none(),n=t.updateTransforms?t.updateTransforms.map(s=>function(a,u){let l=null;if("setToServerValue"in u)F(u.setToServerValue==="REQUEST_TIME",16630,{proto:u}),l=new Dn;else if("appendMissingElements"in u){const f=u.appendMissingElements.values||[];l=new xn(f)}else if("removeAllFromArray"in u){const f=u.removeAllFromArray.values||[];l=new Nn(f)}else"increment"in u?l=new kn(a,u.increment):"minimum"in u?l=new Lr(a,u.minimum):"maximum"in u?l=new Br(a,u.maximum):M(16584,{proto:u});const d=ot.fromServerFormat(u.fieldPath);return new xh(d,l)}(r,s)):[];if(t.update){t.update.name;const s=Ge(r,t.update.name),i=new vt({mapValue:{fields:t.update.fields}});if(t.updateMask){const a=function(l){const d=l.fieldPaths||[];return new Dt(d.map(f=>ot.fromServerFormat(f)))}(t.updateMask);return new se(s,i,a,e,n)}return new Un(s,i,e,n)}if(t.delete){const s=Ge(r,t.delete);return new Gr(s,e)}if(t.verify){const s=Ge(r,t.verify);return new Oh(s,e)}return M(1463,{proto:t})}function Up(r,t){return r&&r.length>0?(F(t!==void 0,14353),r.map(e=>function(s,i){let a=s.updateTime?Vt(s.updateTime):Vt(i);return a.isEqual(L.min())&&(a=Vt(i)),new bp(a,s.transformResults||[])}(e,t))):[]}function $h(r,t){return{documents:[qh(r,t.path)]}}function Kh(r,t){const e={structuredQuery:{}},n=t.path;let s;t.collectionGroup!==null?(s=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=qh(r,s);const i=function(d){if(d.length!==0)return Hh(Z.create(d,"and"))}(t.filters);i&&(e.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(I){return{field:gn(I.field),direction:jp(I.dir)}}(f))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const u=Vo(r,t.limit);return u!==null&&(e.structuredQuery.limit=u),t.startAt&&(e.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(t.endAt)),{dt:e,parent:s}}function Gh(r){let t=jh(r.parent);const e=r.structuredQuery,n=e.from?e.from.length:0;let s=null;if(n>0){F(n===1,65062);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=function(g){const I=Qh(g);return I instanceof Z&&Zo(I)?I.getFilters():[I]}(e.where));let a=[];e.orderBy&&(a=function(g){return g.map(I=>function(D){return new Fr(pn(D.field),function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(D.direction))}(I))}(e.orderBy));let u=null;e.limit&&(u=function(g){let I;return I=typeof g=="object"?g.value:g,ci(I)?null:I}(e.limit));let l=null;e.startAt&&(l=function(g){const I=!!g.before,S=g.values||[];return new Vn(S,I)}(e.startAt));let d=null;return e.endAt&&(d=function(g){const I=!g.before,S=g.values||[];return new Vn(S,I)}(e.endAt)),lp(t,s,a,i,u,"F",l,d)}function qp(r,t){const e=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}}(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Qh(r){return r.unaryFilter!==void 0?function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=pn(e.unaryFilter.field);return K.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=pn(e.unaryFilter.field);return K.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=pn(e.unaryFilter.field);return K.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=pn(e.unaryFilter.field);return K.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(r):r.fieldFilter!==void 0?function(e){return K.create(pn(e.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(e){return Z.create(e.compositeFilter.filters.map(n=>Qh(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(e.compositeFilter.op))}(r):M(30097,{filter:r})}function jp(r){return Np[r]}function zp(r){return kp[r]}function $p(r){return Op[r]}function gn(r){return{fieldPath:r.canonicalString()}}function pn(r){return ot.fromServerFormat(r.fieldPath)}function Hh(r){return r instanceof K?function(e){if(e.op==="=="){if(hc(e.value))return{unaryFilter:{field:gn(e.field),op:"IS_NAN"}};if(lc(e.value))return{unaryFilter:{field:gn(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(hc(e.value))return{unaryFilter:{field:gn(e.field),op:"IS_NOT_NAN"}};if(lc(e.value))return{unaryFilter:{field:gn(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:gn(e.field),op:zp(e.op),value:e.value}}}(r):r instanceof Z?function(e){const n=e.getFilters().map(s=>Hh(s));return n.length===1?n[0]:{compositeFilter:{op:$p(e.op),filters:n}}}(r):M(54877,{filter:r})}function Kp(r){const t=[];return r.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Wh(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function Jh(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t,e,n,s,i=L.min(),a=L.min(),u=dt.EMPTY_BYTE_STRING,l=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=l}withSequenceNumber(t){return new Ht(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new Ht(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new Ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new Ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xh{constructor(t){this.gt=t}}function Gp(r,t){let e;if(t.document)e=Lp(r.gt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const n=O.fromSegments(t.noDocument.path),s=Ze(t.noDocument.readTime);e=ut.newNoDocument(n,s),t.hasCommittedMutations&&e.setHasCommittedMutations()}else{if(!t.unknownDocument)return M(56709);{const n=O.fromSegments(t.unknownDocument.path),s=Ze(t.unknownDocument.version);e=ut.newUnknownDocument(n,s)}}return t.readTime&&e.setReadTime(function(s){const i=new Y(s[0],s[1]);return L.fromTimestamp(i)}(t.readTime)),e}function Pc(r,t){const e=t.key,n={prefixPath:e.getCollectionPath().popLast().toArray(),collectionGroup:e.collectionGroup,documentId:e.path.lastSegment(),readTime:Ys(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())n.document=function(i,a){return{name:Js(i,a.key),fields:a.data.value.mapValue.fields,updateTime:On(i,a.version.toTimestamp()),createTime:On(i,a.createTime.toTimestamp())}}(r.gt,t);else if(t.isNoDocument())n.noDocument={path:e.path.toArray(),readTime:Ye(t.version)};else{if(!t.isUnknownDocument())return M(57904,{document:t});n.unknownDocument={path:e.path.toArray(),version:Ye(t.version)}}return n}function Ys(r){const t=r.toTimestamp();return[t.seconds,t.nanoseconds]}function Ye(r){const t=r.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Ze(r){const t=new Y(r.seconds,r.nanoseconds);return L.fromTimestamp(t)}function Ue(r,t){const e=(t.baseMutations||[]).map(i=>xo(r.gt,i));for(let i=0;i<t.mutations.length-1;++i){const a=t.mutations[i];if(i+1<t.mutations.length&&t.mutations[i+1].transform!==void 0){const u=t.mutations[i+1];a.updateTransforms=u.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const n=t.mutations.map(i=>xo(r.gt,i)),s=Y.fromMillis(t.localWriteTimeMs);return new na(t.batchId,s,e,n)}function mr(r){const t=Ze(r.readTime),e=r.lastLimboFreeSnapshotVersion!==void 0?Ze(r.lastLimboFreeSnapshotVersion):L.min();let n;return n=function(i){return i.documents!==void 0}(r.query)?function(i){const a=i.documents.length;return F(a===1,1966,{count:a}),Lt($r(jh(i.documents[0])))}(r.query):function(i){return Lt(Gh(i))}(r.query),new Ht(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,t,e,dt.fromBase64String(r.resumeToken))}function Yh(r,t){const e=Ye(t.snapshotVersion),n=Ye(t.lastLimboFreeSnapshotVersion);let s;s=Gs(t.target)?$h(r.gt,t.target):Kh(r.gt,t.target).dt;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Xe(t.target),readTime:e,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Zh(r){const t=Gh({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Hs(t,t.limit,"L"):t}function so(r,t){return new sa(t.largestBatchId,xo(r.gt,t.overlayMutation))}function Vc(r,t){const e=t.path.lastSegment();return[r,bt(t.path.popLast()),e]}function Cc(r,t,e,n){return{indexId:r,uid:t,sequenceNumber:e,readTime:Ye(n.readTime),documentKey:bt(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{getBundleMetadata(t,e){return Dc(t).get(e).next(n=>{if(n)return function(i){return{id:i.bundleId,createTime:Ze(i.createTime),version:i.version}}(n)})}saveBundleMetadata(t,e){return Dc(t).put(function(s){return{bundleId:s.id,createTime:Ye(Vt(s.createTime)),version:s.version}}(e))}getNamedQuery(t,e){return xc(t).get(e).next(n=>{if(n)return function(i){return{name:i.name,query:Zh(i.bundledQuery),readTime:Ze(i.readTime)}}(n)})}saveNamedQuery(t,e){return xc(t).put(function(s){return{name:s.name,readTime:Ye(Vt(s.readTime)),bundledQuery:s.bundledQuery}}(e))}}function Dc(r){return gt(r,li)}function xc(r){return gt(r,hi)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(t,e){this.serializer=t,this.userId=e}static yt(t,e){const n=e.uid||"";return new Ii(t,n)}getOverlay(t,e){return ir(t).get(Vc(this.userId,e)).next(n=>n?so(this.serializer,n):null)}getOverlays(t,e){const n=Qt();return v.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(t,e,n){const s=[];return n.forEach((i,a)=>{const u=new sa(e,a);s.push(this.wt(t,u))}),v.waitFor(s)}removeOverlaysForBatchId(t,e,n){const s=new Set;e.forEach(a=>s.add(bt(a.getCollectionPath())));const i=[];return s.forEach(a=>{const u=IDBKeyRange.bound([this.userId,a,n],[this.userId,a,n+1],!1,!0);i.push(ir(t).X(wo,u))}),v.waitFor(i)}getOverlaysForCollection(t,e,n){const s=Qt(),i=bt(e),a=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return ir(t).J(wo,a).next(u=>{for(const l of u){const d=so(this.serializer,l);s.set(d.getKey(),d)}return s})}getOverlaysForCollectionGroup(t,e,n,s){const i=Qt();let a;const u=IDBKeyRange.bound([this.userId,e,n],[this.userId,e,Number.POSITIVE_INFINITY],!0);return ir(t).ee({index:Zl,range:u},(l,d,f)=>{const g=so(this.serializer,d);i.size()<s||g.largestBatchId===a?(i.set(g.getKey(),g),a=g.largestBatchId):f.done()}).next(()=>i)}wt(t,e){return ir(t).put(function(s,i,a){const[u,l,d]=Vc(i,a.mutation.key);return{userId:i,collectionPath:l,documentId:d,collectionGroup:a.mutation.key.getCollectionGroup(),largestBatchId:a.largestBatchId,overlayMutation:Xs(s.gt,a.mutation)}}(this.serializer,this.userId,e))}}function ir(r){return gt(r,di)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{St(t){return gt(t,Ho)}getSessionToken(t){return this.St(t).get("sessionToken").next(e=>{const n=e==null?void 0:e.value;return n?dt.fromUint8Array(n):dt.EMPTY_BYTE_STRING})}setSessionToken(t,e){return this.St(t).put({name:"sessionToken",value:e.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{constructor(){}bt(t,e){this.Dt(t,e),e.Ct()}Dt(t,e){if("nullValue"in t)this.vt(e,5);else if("booleanValue"in t)this.vt(e,10),e.Ft(t.booleanValue?1:0);else if("integerValue"in t)this.vt(e,15),e.Ft(it(t.integerValue));else if("doubleValue"in t){const n=it(t.doubleValue);isNaN(n)?this.vt(e,13):(this.vt(e,15),Pr(n)?e.Ft(0):e.Ft(n))}else if("timestampValue"in t){let n=t.timestampValue;this.vt(e,20),typeof n=="string"&&(n=te(n)),e.Mt(`${n.seconds||""}`),e.Ft(n.nanos||0)}else if("stringValue"in t)this.xt(t.stringValue,e),this.Ot(e);else if("bytesValue"in t)this.vt(e,30),e.Nt(ee(t.bytesValue)),this.Ot(e);else if("referenceValue"in t)this.Bt(t.referenceValue,e);else if("geoPointValue"in t){const n=t.geoPointValue;this.vt(e,45),e.Ft(n.latitude||0),e.Ft(n.longitude||0)}else"mapValue"in t?dh(t)?this.vt(e,Number.MAX_SAFE_INTEGER):mi(t)?this.Lt(t.mapValue,e):(this.kt(t.mapValue,e),this.Ot(e)):"arrayValue"in t?(this.qt(t.arrayValue,e),this.Ot(e)):M(19022,{Kt:t})}xt(t,e){this.vt(e,25),this.Ut(t,e)}Ut(t,e){e.Mt(t)}kt(t,e){const n=t.fields||{};this.vt(e,55);for(const s of Object.keys(n))this.xt(s,e),this.Dt(n[s],e)}Lt(t,e){var a,u;const n=t.fields||{};this.vt(e,53);const s=Sn,i=((u=(a=n[s].arrayValue)==null?void 0:a.values)==null?void 0:u.length)||0;this.vt(e,15),e.Ft(it(i)),this.xt(s,e),this.Dt(n[s],e)}qt(t,e){const n=t.values||[];this.vt(e,50);for(const s of n)this.Dt(s,e)}Bt(t,e){this.vt(e,37),O.fromName(t).path.forEach(n=>{this.vt(e,60),this.Ut(n,e)})}vt(t,e){t.Ft(e)}Ot(t){t.Ft(2)}}qe.$t=new qe;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn=255;function Wp(r){if(r===0)return 8;let t=0;return r>>4||(t+=4,r<<=4),r>>6||(t+=2,r<<=2),r>>7||(t+=1),t}function Nc(r){const t=64-function(n){let s=0;for(let i=0;i<8;++i){const a=Wp(255&n[i]);if(s+=a,a!==8)break}return s}(r);return Math.ceil(t/8)}class Jp{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Qt(n.value),n=e.next();this.Gt()}zt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.jt(n.value),n=e.next();this.Jt()}Ht(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.Qt(n);else if(n<2048)this.Qt(960|n>>>6),this.Qt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.Qt(480|n>>>12),this.Qt(128|63&n>>>6),this.Qt(128|63&n);else{const s=e.codePointAt(0);this.Qt(240|s>>>18),this.Qt(128|63&s>>>12),this.Qt(128|63&s>>>6),this.Qt(128|63&s)}}this.Gt()}Zt(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.jt(n);else if(n<2048)this.jt(960|n>>>6),this.jt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.jt(480|n>>>12),this.jt(128|63&n>>>6),this.jt(128|63&n);else{const s=e.codePointAt(0);this.jt(240|s>>>18),this.jt(128|63&s>>>12),this.jt(128|63&s>>>6),this.jt(128|63&s)}}this.Jt()}Xt(t){const e=this.Yt(t),n=Nc(e);this.en(1+n),this.buffer[this.position++]=255&n;for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=255&e[s]}tn(t){const e=this.Yt(t),n=Nc(e);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=~(255&e[s])}nn(){this.rn(cn),this.rn(255)}sn(){this._n(cn),this._n(255)}reset(){this.position=0}seed(t){this.en(t.length),this.buffer.set(t,this.position),this.position+=t.length}an(){return this.buffer.slice(0,this.position)}Yt(t){const e=function(i){const a=new DataView(new ArrayBuffer(8));return a.setFloat64(0,i,!1),new Uint8Array(a.buffer)}(t),n=!!(128&e[0]);e[0]^=n?255:128;for(let s=1;s<e.length;++s)e[s]^=n?255:0;return e}Qt(t){const e=255&t;e===0?(this.rn(0),this.rn(255)):e===cn?(this.rn(cn),this.rn(0)):this.rn(e)}jt(t){const e=255&t;e===0?(this._n(0),this._n(255)):e===cn?(this._n(cn),this._n(0)):this._n(t)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(t){this.en(1),this.buffer[this.position++]=t}_n(t){this.en(1),this.buffer[this.position++]=~t}en(t){const e=t+this.position;if(e<=this.buffer.length)return;let n=2*this.buffer.length;n<e&&(n=e);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Xp{constructor(t){this.un=t}Nt(t){this.un.Wt(t)}Mt(t){this.un.Ht(t)}Ft(t){this.un.Xt(t)}Ct(){this.un.nn()}}class Yp{constructor(t){this.un=t}Nt(t){this.un.zt(t)}Mt(t){this.un.Zt(t)}Ft(t){this.un.tn(t)}Ct(){this.un.sn()}}class or{constructor(){this.un=new Jp,this.ascending=new Xp(this.un),this.descending=new Yp(this.un)}seed(t){this.un.seed(t)}cn(t){return t===0?this.ascending:this.descending}an(){return this.un.an()}reset(){this.un.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(t,e,n,s){this.ln=t,this.hn=e,this.Pn=n,this.Tn=s}In(){const t=this.Tn.length,e=t===0||this.Tn[t-1]===255?t+1:t,n=new Uint8Array(e);return n.set(this.Tn,0),e!==t?n.set([0],this.Tn.length):++n[n.length-1],new je(this.ln,this.hn,this.Pn,n)}En(t,e,n){return{indexId:this.ln,uid:t,arrayValue:ks(this.Pn),directionalValue:ks(this.Tn),orderedDocumentKey:ks(e),documentKey:n.path.toArray()}}Rn(t,e,n){const s=this.En(t,e,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function de(r,t){let e=r.ln-t.ln;return e!==0?e:(e=kc(r.Pn,t.Pn),e!==0?e:(e=kc(r.Tn,t.Tn),e!==0?e:O.comparator(r.hn,t.hn)))}function kc(r,t){for(let e=0;e<r.length&&e<t.length;++e){const n=r[e]-t[e];if(n!==0)return n}return r.length-t.length}function ks(r){return Al()?function(e){let n="";for(let s=0;s<e.length;s++)n+=String.fromCharCode(e[s]);return n}(r):r}function Oc(r){return typeof r!="string"?r:function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n}(r)}class Mc{constructor(t){this.An=new tt((e,n)=>ot.comparator(e.field,n.field)),this.collectionId=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment(),this.Vn=t.orderBy,this.dn=[];for(const e of t.filters){const n=e;n.isInequality()?this.An=this.An.add(n):this.dn.push(n)}}get mn(){return this.An.size>1}fn(t){if(F(t.collectionGroup===this.collectionId,49279),this.mn)return!1;const e=Io(t);if(e!==void 0&&!this.gn(e))return!1;const n=Fe(t);let s=new Set,i=0,a=0;for(;i<n.length&&this.gn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.An.size>0){const u=this.An.getIterator().getNext();if(!s.has(u.field.canonicalString())){const l=n[i];if(!this.pn(u,l)||!this.yn(this.Vn[a++],l))return!1}++i}for(;i<n.length;++i){const u=n[i];if(a>=this.Vn.length||!this.yn(this.Vn[a++],u))return!1}return!0}wn(){if(this.mn)return null;let t=new tt(ot.comparator);const e=[];for(const n of this.dn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")e.push(new Rs(n.field,2));else{if(t.has(n.field))continue;t=t.add(n.field),e.push(new Rs(n.field,0))}for(const n of this.Vn)n.field.isKeyField()||t.has(n.field)||(t=t.add(n.field),e.push(new Rs(n.field,n.dir==="asc"?0:1)));return new qs(qs.UNKNOWN_ID,this.collectionId,e,Sr.empty())}gn(t){for(const e of this.dn)if(this.pn(e,t))return!0;return!1}pn(t,e){if(t===void 0||!t.field.isEqual(e.fieldPath))return!1;const n=t.op==="array-contains"||t.op==="array-contains-any";return e.kind===2===n}yn(t,e){return!!t.field.isEqual(e.fieldPath)&&(e.kind===0&&t.dir==="asc"||e.kind===1&&t.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function td(r){var e,n;if(F(r instanceof K||r instanceof Z,20012),r instanceof K){if(r instanceof Th){const s=((n=(e=r.value.arrayValue)==null?void 0:e.values)==null?void 0:n.map(i=>K.create(r.field,"==",i)))||[];return Z.create(s,"or")}return r}const t=r.filters.map(s=>td(s));return Z.create(t,r.op)}function Zp(r){if(r.getFilters().length===0)return[];const t=Oo(td(r));return F(ed(t),7391),No(t)||ko(t)?[t]:t.getFilters()}function No(r){return r instanceof K}function ko(r){return r instanceof Z&&Zo(r)}function ed(r){return No(r)||ko(r)||function(e){if(e instanceof Z&&bo(e)){for(const n of e.getFilters())if(!No(n)&&!ko(n))return!1;return!0}return!1}(r)}function Oo(r){if(F(r instanceof K||r instanceof Z,34018),r instanceof K)return r;if(r.filters.length===1)return Oo(r.filters[0]);const t=r.filters.map(n=>Oo(n));let e=Z.create(t,r.op);return e=Zs(e),ed(e)?e:(F(e instanceof Z,64498),F(Cn(e),40251),F(e.filters.length>1,57927),e.filters.reduce((n,s)=>aa(n,s)))}function aa(r,t){let e;return F(r instanceof K||r instanceof Z,38388),F(t instanceof K||t instanceof Z,25473),e=r instanceof K?t instanceof K?function(s,i){return Z.create([s,i],"and")}(r,t):Fc(r,t):t instanceof K?Fc(t,r):function(s,i){if(F(s.filters.length>0&&i.filters.length>0,48005),Cn(s)&&Cn(i))return yh(s,i.getFilters());const a=bo(s)?s:i,u=bo(s)?i:s,l=a.filters.map(d=>aa(d,u));return Z.create(l,"or")}(r,t),Zs(e)}function Fc(r,t){if(Cn(t))return yh(t,r.getFilters());{const e=t.filters.map(n=>aa(r,n));return Z.create(e,"or")}}function Zs(r){if(F(r instanceof K||r instanceof Z,11850),r instanceof K)return r;const t=r.getFilters();if(t.length===1)return Zs(t[0]);if(ph(r))return r;const e=t.map(s=>Zs(s)),n=[];return e.forEach(s=>{s instanceof K?n.push(s):s instanceof Z&&(s.op===r.op?n.push(...s.filters):n.push(s))}),n.length===1?n[0]:Z.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t_{constructor(){this.Sn=new ua}addToCollectionParentIndex(t,e){return this.Sn.add(e),v.resolve()}getCollectionParents(t,e){return v.resolve(this.Sn.getEntries(e))}addFieldIndex(t,e){return v.resolve()}deleteFieldIndex(t,e){return v.resolve()}deleteAllFieldIndexes(t){return v.resolve()}createTargetIndexes(t,e){return v.resolve()}getDocumentsMatchingTarget(t,e){return v.resolve(null)}getIndexType(t,e){return v.resolve(0)}getFieldIndexes(t,e){return v.resolve([])}getNextCollectionGroupToUpdate(t){return v.resolve(null)}getMinOffset(t,e){return v.resolve(Ot.min())}getMinOffsetFromCollectionGroup(t,e){return v.resolve(Ot.min())}updateCollectionGroup(t,e,n){return v.resolve()}updateIndexEntries(t,e){return v.resolve()}}class ua{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e]||new tt(X.comparator),i=!s.has(n);return this.index[e]=s.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e];return s&&s.has(n)}getEntries(t){return(this.index[t]||new tt(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc="IndexedDbIndexManager",Ts=new Uint8Array(0);class e_{constructor(t,e){this.databaseId=e,this.bn=new ua,this.Dn=new re(n=>Xe(n),(n,s)=>zr(n,s)),this.uid=t.uid||""}addToCollectionParentIndex(t,e){if(!this.bn.has(e)){const n=e.lastSegment(),s=e.popLast();t.addOnCommittedListener(()=>{this.bn.add(e)});const i={collectionId:n,parent:bt(s)};return Bc(t).put(i)}return v.resolve()}getCollectionParents(t,e){const n=[],s=IDBKeyRange.bound([e,""],[ql(e),""],!1,!0);return Bc(t).J(s).next(i=>{for(const a of i){if(a.collectionId!==e)break;n.push(Gt(a.parent))}return n})}addFieldIndex(t,e){const n=ar(t),s=function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map(l=>[l.fieldPath.canonicalString(),l.kind])}}(e);delete s.indexId;const i=n.add(s);if(e.indexState){const a=hn(t);return i.next(u=>{a.put(Cc(u,this.uid,e.indexState.sequenceNumber,e.indexState.offset))})}return i.next()}deleteFieldIndex(t,e){const n=ar(t),s=hn(t),i=ln(t);return n.delete(e.indexId).next(()=>s.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0)))}deleteAllFieldIndexes(t){const e=ar(t),n=ln(t),s=hn(t);return e.X().next(()=>n.X()).next(()=>s.X())}createTargetIndexes(t,e){return v.forEach(this.Cn(e),n=>this.getIndexType(t,n).next(s=>{if(s===0||s===1){const i=new Mc(n).wn();if(i!=null)return this.addFieldIndex(t,i)}}))}getDocumentsMatchingTarget(t,e){const n=ln(t);let s=!0;const i=new Map;return v.forEach(this.Cn(e),a=>this.vn(t,a).next(u=>{s&&(s=!!u),i.set(a,u)})).next(()=>{if(s){let a=$();const u=[];return v.forEach(i,(l,d)=>{V(Lc,`Using index ${function(U){return`id=${U.indexId}|cg=${U.collectionGroup}|f=${U.fields.map(nt=>`${nt.fieldPath}:${nt.kind}`).join(",")}`}(l)} to execute ${Xe(e)}`);const f=function(U,nt){const W=Io(nt);if(W===void 0)return null;for(const J of Qs(U,W.fieldPath))switch(J.op){case"array-contains-any":return J.value.arrayValue.values||[];case"array-contains":return[J.value]}return null}(d,l),g=function(U,nt){const W=new Map;for(const J of Fe(nt))for(const E of Qs(U,J.fieldPath))switch(E.op){case"==":case"in":W.set(J.fieldPath.canonicalString(),E.value);break;case"not-in":case"!=":return W.set(J.fieldPath.canonicalString(),E.value),Array.from(W.values())}return null}(d,l),I=function(U,nt){const W=[];let J=!0;for(const E of Fe(nt)){const p=E.kind===0?pc(U,E.fieldPath,U.startAt):_c(U,E.fieldPath,U.startAt);W.push(p.value),J&&(J=p.inclusive)}return new Vn(W,J)}(d,l),S=function(U,nt){const W=[];let J=!0;for(const E of Fe(nt)){const p=E.kind===0?_c(U,E.fieldPath,U.endAt):pc(U,E.fieldPath,U.endAt);W.push(p.value),J&&(J=p.inclusive)}return new Vn(W,J)}(d,l),D=this.Fn(l,d,I),k=this.Fn(l,d,S),N=this.Mn(l,d,g),G=this.xn(l.indexId,f,D,I.inclusive,k,S.inclusive,N);return v.forEach(G,j=>n.Z(j,e.limit).next(U=>{U.forEach(nt=>{const W=O.fromSegments(nt.documentKey);a.has(W)||(a=a.add(W),u.push(W))})}))}).next(()=>u)}return v.resolve(null)})}Cn(t){let e=this.Dn.get(t);return e||(t.filters.length===0?e=[t]:e=Zp(Z.create(t.filters,"and")).map(n=>So(t.path,t.collectionGroup,t.orderBy,n.getFilters(),t.limit,t.startAt,t.endAt)),this.Dn.set(t,e),e)}xn(t,e,n,s,i,a,u){const l=(e!=null?e.length:1)*Math.max(n.length,i.length),d=l/(e!=null?e.length:1),f=[];for(let g=0;g<l;++g){const I=e?this.On(e[g/d]):Ts,S=this.Nn(t,I,n[g%d],s),D=this.Bn(t,I,i[g%d],a),k=u.map(N=>this.Nn(t,I,N,!0));f.push(...this.createRange(S,D,k))}return f}Nn(t,e,n,s){const i=new je(t,O.empty(),e,n);return s?i:i.In()}Bn(t,e,n,s){const i=new je(t,O.empty(),e,n);return s?i.In():i}vn(t,e){const n=new Mc(e),s=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment();return this.getFieldIndexes(t,s).next(i=>{let a=null;for(const u of i)n.fn(u)&&(!a||u.fields.length>a.fields.length)&&(a=u);return a})}getIndexType(t,e){let n=2;const s=this.Cn(e);return v.forEach(s,i=>this.vn(t,i).next(a=>{a?n!==0&&a.fields.length<function(l){let d=new tt(ot.comparator),f=!1;for(const g of l.filters)for(const I of g.getFlattenedFilters())I.field.isKeyField()||(I.op==="array-contains"||I.op==="array-contains-any"?f=!0:d=d.add(I.field));for(const g of l.orderBy)g.field.isKeyField()||(d=d.add(g.field));return d.size+(f?1:0)}(i)&&(n=1):n=0})).next(()=>function(a){return a.limit!==null}(e)&&s.length>1&&n===2?1:n)}Ln(t,e){const n=new or;for(const s of Fe(t)){const i=e.data.field(s.fieldPath);if(i==null)return null;const a=n.cn(s.kind);qe.$t.bt(i,a)}return n.an()}On(t){const e=new or;return qe.$t.bt(t,e.cn(0)),e.an()}kn(t,e){const n=new or;return qe.$t.bt(kr(this.databaseId,e),n.cn(function(i){const a=Fe(i);return a.length===0?0:a[a.length-1].kind}(t))),n.an()}Mn(t,e,n){if(n===null)return[];let s=[];s.push(new or);let i=0;for(const a of Fe(t)){const u=n[i++];for(const l of s)if(this.qn(e,a.fieldPath)&&Mr(u))s=this.Kn(s,a,u);else{const d=l.cn(a.kind);qe.$t.bt(u,d)}}return this.Un(s)}Fn(t,e,n){return this.Mn(t,e,n.position)}Un(t){const e=[];for(let n=0;n<t.length;++n)e[n]=t[n].an();return e}Kn(t,e,n){const s=[...t],i=[];for(const a of n.arrayValue.values||[])for(const u of s){const l=new or;l.seed(u.an()),qe.$t.bt(a,l.cn(e.kind)),i.push(l)}return i}qn(t,e){return!!t.filters.find(n=>n instanceof K&&n.field.isEqual(e)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(t,e){const n=ar(t),s=hn(t);return(e?n.J(To,IDBKeyRange.bound(e,e)):n.J()).next(i=>{const a=[];return v.forEach(i,u=>s.get([u.indexId,this.uid]).next(l=>{a.push(function(f,g){const I=g?new Sr(g.sequenceNumber,new Ot(Ze(g.readTime),new O(Gt(g.documentKey)),g.largestBatchId)):Sr.empty(),S=f.fields.map(([D,k])=>new Rs(ot.fromServerFormat(D),k));return new qs(f.indexId,f.collectionGroup,S,I)}(u,l))})).next(()=>a)})}getNextCollectionGroupToUpdate(t){return this.getFieldIndexes(t).next(e=>e.length===0?null:(e.sort((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:B(n.collectionGroup,s.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(t,e,n){const s=ar(t),i=hn(t);return this.$n(t).next(a=>s.J(To,IDBKeyRange.bound(e,e)).next(u=>v.forEach(u,l=>i.put(Cc(l.indexId,this.uid,a,n)))))}updateIndexEntries(t,e){const n=new Map;return v.forEach(e,(s,i)=>{const a=n.get(s.collectionGroup);return(a?v.resolve(a):this.getFieldIndexes(t,s.collectionGroup)).next(u=>(n.set(s.collectionGroup,u),v.forEach(u,l=>this.Wn(t,s,l).next(d=>{const f=this.Qn(i,l);return d.isEqual(f)?v.resolve():this.Gn(t,i,l,d,f)}))))})}zn(t,e,n,s){return ln(t).put(s.En(this.uid,this.kn(n,e.key),e.key))}jn(t,e,n,s){return ln(t).delete(s.Rn(this.uid,this.kn(n,e.key),e.key))}Wn(t,e,n){const s=ln(t);let i=new tt(de);return s.ee({index:Yl,range:IDBKeyRange.only([n.indexId,this.uid,ks(this.kn(n,e))])},(a,u)=>{i=i.add(new je(n.indexId,e,Oc(u.arrayValue),Oc(u.directionalValue)))}).next(()=>i)}Qn(t,e){let n=new tt(de);const s=this.Ln(e,t);if(s==null)return n;const i=Io(e);if(i!=null){const a=t.data.field(i.fieldPath);if(Mr(a))for(const u of a.arrayValue.values||[])n=n.add(new je(e.indexId,t.key,this.On(u),s))}else n=n.add(new je(e.indexId,t.key,Ts,s));return n}Gn(t,e,n,s,i){V(Lc,"Updating index entries for document '%s'",e.key);const a=[];return function(l,d,f,g,I){const S=l.getIterator(),D=d.getIterator();let k=un(S),N=un(D);for(;k||N;){let G=!1,j=!1;if(k&&N){const U=f(k,N);U<0?j=!0:U>0&&(G=!0)}else k!=null?j=!0:G=!0;G?(g(N),N=un(D)):j?(I(k),k=un(S)):(k=un(S),N=un(D))}}(s,i,de,u=>{a.push(this.zn(t,e,n,u))},u=>{a.push(this.jn(t,e,n,u))}),v.waitFor(a)}$n(t){let e=1;return hn(t).ee({index:Xl,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,s,i)=>{i.done(),e=s.sequenceNumber+1}).next(()=>e)}createRange(t,e,n){n=n.sort((a,u)=>de(a,u)).filter((a,u,l)=>!u||de(a,l[u-1])!==0);const s=[];s.push(t);for(const a of n){const u=de(a,t),l=de(a,e);if(u===0)s[0]=t.In();else if(u>0&&l<0)s.push(a),s.push(a.In());else if(l>0)break}s.push(e);const i=[];for(let a=0;a<s.length;a+=2){if(this.Jn(s[a],s[a+1]))return[];const u=s[a].Rn(this.uid,Ts,O.empty()),l=s[a+1].Rn(this.uid,Ts,O.empty());i.push(IDBKeyRange.bound(u,l))}return i}Jn(t,e){return de(t,e)>0}getMinOffsetFromCollectionGroup(t,e){return this.getFieldIndexes(t,e).next(Uc)}getMinOffset(t,e){return v.mapArray(this.Cn(e),n=>this.vn(t,n).next(s=>s||M(44426))).next(Uc)}}function Bc(r){return gt(r,Dr)}function ln(r){return gt(r,Ir)}function ar(r){return gt(r,Qo)}function hn(r){return gt(r,yr)}function Uc(r){F(r.length!==0,28825);let t=r[0].indexState.offset,e=t.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;$o(s,t)<0&&(t=s),e<s.largestBatchId&&(e=s.largestBatchId)}return new Ot(t.readTime,t.documentKey,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qc={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},nd=41943040;class wt{static withCacheSize(t){return new wt(t,wt.DEFAULT_COLLECTION_PERCENTILE,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rd(r,t,e){const n=r.store(Ut),s=r.store(vn),i=[],a=IDBKeyRange.only(e.batchId);let u=0;const l=n.ee({range:a},(f,g,I)=>(u++,I.delete()));i.push(l.next(()=>{F(u===1,47070,{batchId:e.batchId})}));const d=[];for(const f of e.mutations){const g=Hl(t,f.key.path,e.batchId);i.push(s.delete(g)),d.push(f.key)}return v.waitFor(i).next(()=>d)}function ti(r){if(!r)return 0;let t;if(r.document)t=r.document;else if(r.unknownDocument)t=r.unknownDocument;else{if(!r.noDocument)throw M(14731);t=r.noDocument}return JSON.stringify(t).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */wt.DEFAULT_COLLECTION_PERCENTILE=10,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,wt.DEFAULT=new wt(nd,wt.DEFAULT_COLLECTION_PERCENTILE,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),wt.DISABLED=new wt(-1,0,0);class Ei{constructor(t,e,n,s){this.userId=t,this.serializer=e,this.indexManager=n,this.referenceDelegate=s,this.Hn={}}static yt(t,e,n,s){F(t.uid!=="",64387);const i=t.isAuthenticated()?t.uid:"";return new Ei(i,e,n,s)}checkEmpty(t){let e=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return fe(t).ee({index:ze,range:n},(s,i,a)=>{e=!1,a.done()}).next(()=>e)}addMutationBatch(t,e,n,s){const i=_n(t),a=fe(t);return a.add({}).next(u=>{F(typeof u=="number",49019);const l=new na(u,e,n,s),d=function(S,D,k){const N=k.baseMutations.map(j=>Xs(S.gt,j)),G=k.mutations.map(j=>Xs(S.gt,j));return{userId:D,batchId:k.batchId,localWriteTimeMs:k.localWriteTime.toMillis(),baseMutations:N,mutations:G}}(this.serializer,this.userId,l),f=[];let g=new tt((I,S)=>B(I.canonicalString(),S.canonicalString()));for(const I of s){const S=Hl(this.userId,I.key.path,u);g=g.add(I.key.path.popLast()),f.push(a.put(d)),f.push(i.put(S,Sg))}return g.forEach(I=>{f.push(this.indexManager.addToCollectionParentIndex(t,I))}),t.addOnCommittedListener(()=>{this.Hn[u]=l.keys()}),v.waitFor(f).next(()=>l)})}lookupMutationBatch(t,e){return fe(t).get(e).next(n=>n?(F(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:e}),Ue(this.serializer,n)):null)}Zn(t,e){return this.Hn[e]?v.resolve(this.Hn[e]):this.lookupMutationBatch(t,e).next(n=>{if(n){const s=n.keys();return this.Hn[e]=s,s}return null})}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return fe(t).ee({index:ze,range:s},(a,u,l)=>{u.userId===this.userId&&(F(u.batchId>=n,47524,{Xn:n}),i=Ue(this.serializer,u)),l.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(t){const e=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=$e;return fe(t).ee({index:ze,range:e,reverse:!0},(s,i,a)=>{n=i.batchId,a.done()}).next(()=>n)}getAllMutationBatches(t){const e=IDBKeyRange.bound([this.userId,$e],[this.userId,Number.POSITIVE_INFINITY]);return fe(t).J(ze,e).next(n=>n.map(s=>Ue(this.serializer,s)))}getAllMutationBatchesAffectingDocumentKey(t,e){const n=Ss(this.userId,e.path),s=IDBKeyRange.lowerBound(n),i=[];return _n(t).ee({range:s},(a,u,l)=>{const[d,f,g]=a,I=Gt(f);if(d===this.userId&&e.path.isEqual(I))return fe(t).get(g).next(S=>{if(!S)throw M(61480,{Yn:a,batchId:g});F(S.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:S.userId,batchId:g}),i.push(Ue(this.serializer,S))});l.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new tt(B);const s=[];return e.forEach(i=>{const a=Ss(this.userId,i.path),u=IDBKeyRange.lowerBound(a),l=_n(t).ee({range:u},(d,f,g)=>{const[I,S,D]=d,k=Gt(S);I===this.userId&&i.path.isEqual(k)?n=n.add(D):g.done()});s.push(l)}),v.waitFor(s).next(()=>this.er(t,n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1,i=Ss(this.userId,n),a=IDBKeyRange.lowerBound(i);let u=new tt(B);return _n(t).ee({range:a},(l,d,f)=>{const[g,I,S]=l,D=Gt(I);g===this.userId&&n.isPrefixOf(D)?D.length===s&&(u=u.add(S)):f.done()}).next(()=>this.er(t,u))}er(t,e){const n=[],s=[];return e.forEach(i=>{s.push(fe(t).get(i).next(a=>{if(a===null)throw M(35274,{batchId:i});F(a.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:a.userId,batchId:i}),n.push(Ue(this.serializer,a))}))}),v.waitFor(s).next(()=>n)}removeMutationBatch(t,e){return rd(t.le,this.userId,e).next(n=>(t.addOnCommittedListener(()=>{this.tr(e.batchId)}),v.forEach(n,s=>this.referenceDelegate.markPotentiallyOrphaned(t,s))))}tr(t){delete this.Hn[t]}performConsistencyCheck(t){return this.checkEmpty(t).next(e=>{if(!e)return v.resolve();const n=IDBKeyRange.lowerBound(function(a){return[a]}(this.userId)),s=[];return _n(t).ee({range:n},(i,a,u)=>{if(i[0]===this.userId){const l=Gt(i[1]);s.push(l)}else u.done()}).next(()=>{F(s.length===0,56720,{nr:s.map(i=>i.canonicalString())})})})}containsKey(t,e){return sd(t,this.userId,e)}rr(t){return id(t).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:$e,lastStreamToken:""})}}function sd(r,t,e){const n=Ss(t,e.path),s=n[1],i=IDBKeyRange.lowerBound(n);let a=!1;return _n(r).ee({range:i,Y:!0},(u,l,d)=>{const[f,g,I]=u;f===t&&g===s&&(a=!0),d.done()}).next(()=>a)}function fe(r){return gt(r,Ut)}function _n(r){return gt(r,vn)}function id(r){return gt(r,Vr)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(t){this.ir=t}next(){return this.ir+=2,this.ir}static sr(){return new ne(0)}static _r(){return new ne(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n_{constructor(t,e){this.referenceDelegate=t,this.serializer=e}allocateTargetId(t){return this.ar(t).next(e=>{const n=new ne(e.highestTargetId);return e.highestTargetId=n.next(),this.ur(t,e).next(()=>e.highestTargetId)})}getLastRemoteSnapshotVersion(t){return this.ar(t).next(e=>L.fromTimestamp(new Y(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(t){return this.ar(t).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(t,e,n){return this.ar(t).next(s=>(s.highestListenSequenceNumber=e,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),e>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=e),this.ur(t,s)))}addTargetData(t,e){return this.cr(t,e).next(()=>this.ar(t).next(n=>(n.targetCount+=1,this.lr(e,n),this.ur(t,n))))}updateTargetData(t,e){return this.cr(t,e)}removeTargetData(t,e){return this.removeMatchingKeysForTargetId(t,e.targetId).next(()=>dn(t).delete(e.targetId)).next(()=>this.ar(t)).next(n=>(F(n.targetCount>0,8065),n.targetCount-=1,this.ur(t,n)))}removeTargets(t,e,n){let s=0;const i=[];return dn(t).ee((a,u)=>{const l=mr(u);l.sequenceNumber<=e&&n.get(l.targetId)===null&&(s++,i.push(this.removeTargetData(t,l)))}).next(()=>v.waitFor(i)).next(()=>s)}forEachTarget(t,e){return dn(t).ee((n,s)=>{const i=mr(s);e(i)})}ar(t){return jc(t).get($s).next(e=>(F(e!==null,2888),e))}ur(t,e){return jc(t).put($s,e)}cr(t,e){return dn(t).put(Yh(this.serializer,e))}lr(t,e){let n=!1;return t.targetId>e.highestTargetId&&(e.highestTargetId=t.targetId,n=!0),t.sequenceNumber>e.highestListenSequenceNumber&&(e.highestListenSequenceNumber=t.sequenceNumber,n=!0),n}getTargetCount(t){return this.ar(t).next(e=>e.targetCount)}getTargetData(t,e){const n=Xe(e),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return dn(t).ee({range:s,index:Jl},(a,u,l)=>{const d=mr(u);zr(e,d.target)&&(i=d,l.done())}).next(()=>i)}addMatchingKeys(t,e,n){const s=[],i=ge(t);return e.forEach(a=>{const u=bt(a.path);s.push(i.put({targetId:n,path:u})),s.push(this.referenceDelegate.addReference(t,n,a))}),v.waitFor(s)}removeMatchingKeys(t,e,n){const s=ge(t);return v.forEach(e,i=>{const a=bt(i.path);return v.waitFor([s.delete([n,a]),this.referenceDelegate.removeReference(t,n,i)])})}removeMatchingKeysForTargetId(t,e){const n=ge(t),s=IDBKeyRange.bound([e],[e+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(t,e){const n=IDBKeyRange.bound([e],[e+1],!1,!0),s=ge(t);let i=$();return s.ee({range:n,Y:!0},(a,u,l)=>{const d=Gt(a[1]),f=new O(d);i=i.add(f)}).next(()=>i)}containsKey(t,e){const n=bt(e.path),s=IDBKeyRange.bound([n],[ql(n)],!1,!0);let i=0;return ge(t).ee({index:Go,Y:!0,range:s},([a,u],l,d)=>{a!==0&&(i++,d.done())}).next(()=>i>0)}Rt(t,e){return dn(t).get(e).next(n=>n?mr(n):null)}}function dn(r){return gt(r,An)}function jc(r){return gt(r,Ke)}function ge(r){return gt(r,bn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc="LruGarbageCollector",r_=1048576;function $c([r,t],[e,n]){const s=B(r,e);return s===0?B(t,n):s}class s_{constructor(t){this.hr=t,this.buffer=new tt($c),this.Pr=0}Tr(){return++this.Pr}Ir(t){const e=[t,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(e);else{const n=this.buffer.last();$c(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e))}}get maxValue(){return this.buffer.last()[0]}}class od{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(t){V(zc,`Garbage collection scheduled in ${t}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Se(e)?V(zc,"Ignoring IndexedDB error during garbage collection: ",e):await en(e)}await this.Rr(3e5)})}}class i_{constructor(t,e){this.Ar=t,this.params=e}calculateTargetCount(t,e){return this.Ar.Vr(t).next(n=>Math.floor(e/100*n))}nthSequenceNumber(t,e){if(e===0)return v.resolve(Ft.ce);const n=new s_(e);return this.Ar.forEachTarget(t,s=>n.Ir(s.sequenceNumber)).next(()=>this.Ar.dr(t,s=>n.Ir(s))).next(()=>n.maxValue)}removeTargets(t,e,n){return this.Ar.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.Ar.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),v.resolve(qc)):this.getCacheSize(t).next(n=>n<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),qc):this.mr(t,e))}getCacheSize(t){return this.Ar.getCacheSize(t)}mr(t,e){let n,s,i,a,u,l,d;const f=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(g=>(g>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),s=this.params.maximumSequenceNumbersToCollect):s=g,a=Date.now(),this.nthSequenceNumber(t,s))).next(g=>(n=g,u=Date.now(),this.removeTargets(t,n,e))).next(g=>(i=g,l=Date.now(),this.removeOrphanedDocuments(t,n))).next(g=>(d=Date.now(),fn()<=H.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${i} targets in `+(l-u)+`ms
	Removed ${g} documents in `+(d-l)+`ms
Total Duration: ${d-f}ms`),v.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:g})))}}function ad(r,t){return new i_(r,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(t,e){this.db=t,this.garbageCollector=ad(this,e)}Vr(t){const e=this.gr(t);return this.db.getTargetCache().getTargetCount(t).next(n=>e.next(s=>n+s))}gr(t){let e=0;return this.dr(t,n=>{e++}).next(()=>e)}forEachTarget(t,e){return this.db.getTargetCache().forEachTarget(t,e)}dr(t,e){return this.pr(t,(n,s)=>e(s))}addReference(t,e,n){return ws(t,n)}removeReference(t,e,n){return ws(t,n)}removeTargets(t,e,n){return this.db.getTargetCache().removeTargets(t,e,n)}markPotentiallyOrphaned(t,e){return ws(t,e)}yr(t,e){return function(s,i){let a=!1;return id(s).te(u=>sd(s,u,i).next(l=>(l&&(a=!0),v.resolve(!l)))).next(()=>a)}(t,e)}removeOrphanedDocuments(t,e){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.pr(t,(a,u)=>{if(u<=e){const l=this.yr(t,a).next(d=>{if(!d)return i++,n.getEntry(t,a).next(()=>(n.removeEntry(a,L.min()),ge(t).delete(function(g){return[0,bt(g.path)]}(a))))});s.push(l)}}).next(()=>v.waitFor(s)).next(()=>n.apply(t)).next(()=>i)}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(t,n)}updateLimboDocument(t,e){return ws(t,e)}pr(t,e){const n=ge(t);let s,i=Ft.ce;return n.ee({index:Go},([a,u],{path:l,sequenceNumber:d})=>{a===0?(i!==Ft.ce&&e(new O(Gt(s)),i),i=d,s=l):i=Ft.ce}).next(()=>{i!==Ft.ce&&e(new O(Gt(s)),i)})}getCacheSize(t){return this.db.getRemoteDocumentCache().getSize(t)}}function ws(r,t){return ge(r).put(function(n,s){return{targetId:0,path:bt(n.path),sequenceNumber:s}}(t,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(){this.changes=new re(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,ut.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return n!==void 0?v.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(t){this.serializer=t}setIndexManager(t){this.indexManager=t}addEntry(t,e,n){return Oe(t).put(n)}removeEntry(t,e,n){return Oe(t).delete(function(i,a){const u=i.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],Ys(a),u[u.length-1]]}(e,n))}updateMetadata(t,e){return this.getMetadata(t).next(n=>(n.byteSize+=e,this.wr(t,n)))}getEntry(t,e){let n=ut.newInvalidDocument(e);return Oe(t).ee({index:Ps,range:IDBKeyRange.only(ur(e))},(s,i)=>{n=this.Sr(e,i)}).next(()=>n)}br(t,e){let n={size:0,document:ut.newInvalidDocument(e)};return Oe(t).ee({index:Ps,range:IDBKeyRange.only(ur(e))},(s,i)=>{n={document:this.Sr(e,i),size:ti(i)}}).next(()=>n)}getEntries(t,e){let n=kt();return this.Dr(t,e,(s,i)=>{const a=this.Sr(s,i);n=n.insert(s,a)}).next(()=>n)}Cr(t,e){let n=kt(),s=new st(O.comparator);return this.Dr(t,e,(i,a)=>{const u=this.Sr(i,a);n=n.insert(i,u),s=s.insert(i,ti(a))}).next(()=>({documents:n,vr:s}))}Dr(t,e,n){if(e.isEmpty())return v.resolve();let s=new tt(Qc);e.forEach(l=>s=s.add(l));const i=IDBKeyRange.bound(ur(s.first()),ur(s.last())),a=s.getIterator();let u=a.getNext();return Oe(t).ee({index:Ps,range:i},(l,d,f)=>{const g=O.fromSegments([...d.prefixPath,d.collectionGroup,d.documentId]);for(;u&&Qc(u,g)<0;)n(u,null),u=a.getNext();u&&u.isEqual(g)&&(n(u,d),u=a.hasNext()?a.getNext():null),u?f.j(ur(u)):f.done()}).next(()=>{for(;u;)n(u,null),u=a.hasNext()?a.getNext():null})}getDocumentsMatchingQuery(t,e,n,s,i){const a=e.path,u=[a.popLast().toArray(),a.lastSegment(),Ys(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],l=[a.popLast().toArray(),a.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Oe(t).J(IDBKeyRange.bound(u,l,!0)).next(d=>{i==null||i.incrementDocumentReadCount(d.length);let f=kt();for(const g of d){const I=this.Sr(O.fromSegments(g.prefixPath.concat(g.collectionGroup,g.documentId)),g);I.isFoundDocument()&&(Kr(e,I)||s.has(I.key))&&(f=f.insert(I.key,I))}return f})}getAllFromCollectionGroup(t,e,n,s){let i=kt();const a=Gc(e,n),u=Gc(e,Ot.max());return Oe(t).ee({index:Wl,range:IDBKeyRange.bound(a,u,!0)},(l,d,f)=>{const g=this.Sr(O.fromSegments(d.prefixPath.concat(d.collectionGroup,d.documentId)),d);i=i.insert(g.key,g),i.size===s&&f.done()}).next(()=>i)}newChangeBuffer(t){return new u_(this,!!t&&t.trackRemovals)}getSize(t){return this.getMetadata(t).next(e=>e.byteSize)}getMetadata(t){return Kc(t).get(Eo).next(e=>(F(!!e,20021),e))}wr(t,e){return Kc(t).put(Eo,e)}Sr(t,e){if(e){const n=Gp(this.serializer,e);if(!(n.isNoDocument()&&n.version.isEqual(L.min())))return n}return ut.newInvalidDocument(t)}}function cd(r){return new a_(r)}class u_ extends ud{constructor(t,e){super(),this.Fr=t,this.trackRemovals=e,this.Mr=new re(n=>n.toString(),(n,s)=>n.isEqual(s))}applyChanges(t){const e=[];let n=0,s=new tt((i,a)=>B(i.canonicalString(),a.canonicalString()));return this.changes.forEach((i,a)=>{const u=this.Mr.get(i);if(e.push(this.Fr.removeEntry(t,i,u.readTime)),a.isValidDocument()){const l=Pc(this.Fr.serializer,a);s=s.add(i.path.popLast());const d=ti(l);n+=d-u.size,e.push(this.Fr.addEntry(t,i,l))}else if(n-=u.size,this.trackRemovals){const l=Pc(this.Fr.serializer,a.convertToNoDocument(L.min()));e.push(this.Fr.addEntry(t,i,l))}}),s.forEach(i=>{e.push(this.Fr.indexManager.addToCollectionParentIndex(t,i))}),e.push(this.Fr.updateMetadata(t,n)),v.waitFor(e)}getFromCache(t,e){return this.Fr.br(t,e).next(n=>(this.Mr.set(e,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(t,e){return this.Fr.Cr(t,e).next(({documents:n,vr:s})=>(s.forEach((i,a)=>{this.Mr.set(i,{size:a,readTime:n.get(i).readTime})}),n))}}function Kc(r){return gt(r,Cr)}function Oe(r){return gt(r,zs)}function ur(r){const t=r.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Gc(r,t){const e=t.documentKey.path.toArray();return[r,Ys(t.readTime),e.slice(0,e.length-2),e.length>0?e[e.length-1]:""]}function Qc(r,t){const e=r.path.toArray(),n=t.path.toArray();let s=0;for(let i=0;i<e.length-2&&i<n.length-2;++i)if(s=B(e[i],n[i]),s)return s;return s=B(e.length,n.length),s||(s=B(e[e.length-2],n[n.length-2]),s||B(e[e.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c_{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ld{constructor(t,e,n,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=s}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next(s=>(n=s,this.remoteDocumentCache.getEntry(t,e))).next(s=>(n!==null&&vr(n.mutation,s,Dt.empty(),Y.now()),s))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(n=>this.getLocalViewOfDocuments(t,n,$()).next(()=>n))}getLocalViewOfDocuments(t,e,n=$()){const s=Qt();return this.populateOverlays(t,s,e).next(()=>this.computeViews(t,e,s,n).next(i=>{let a=dr();return i.forEach((u,l)=>{a=a.insert(u,l.overlayedDocument)}),a}))}getOverlayedDocuments(t,e){const n=Qt();return this.populateOverlays(t,n,e).next(()=>this.computeViews(t,e,n,$()))}populateOverlays(t,e,n){const s=[];return n.forEach(i=>{e.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(t,s).next(i=>{i.forEach((a,u)=>{e.set(a,u)})})}computeViews(t,e,n,s){let i=kt();const a=wr(),u=function(){return wr()}();return e.forEach((l,d)=>{const f=n.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof se)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),vr(f.mutation,d,f.mutation.getFieldMask(),Y.now())):a.set(d.key,Dt.empty())}),this.recalculateAndSaveOverlays(t,i).next(l=>(l.forEach((d,f)=>a.set(d,f)),e.forEach((d,f)=>u.set(d,new c_(f,a.get(d)??null))),u))}recalculateAndSaveOverlays(t,e){const n=wr();let s=new st((a,u)=>a-u),i=$();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(a=>{for(const u of a)u.keys().forEach(l=>{const d=e.get(l);if(d===null)return;let f=n.get(l)||Dt.empty();f=u.applyToLocalView(d,f),n.set(l,f);const g=(s.get(u.batchId)||$()).add(l);s=s.insert(u.batchId,g)})}).next(()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const l=u.getNext(),d=l.key,f=l.value,g=Sh();f.forEach(I=>{if(!i.has(I)){const S=Nh(e.get(I),n.get(I));S!==null&&g.set(I,S),i=i.add(I)}}),a.push(this.documentOverlayCache.saveOverlays(t,d,g))}return v.waitFor(a)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(n=>this.recalculateAndSaveOverlays(t,n))}getDocumentsMatchingQuery(t,e,n,s){return hp(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):wh(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,s):this.getDocumentsMatchingCollectionQuery(t,e,n,s)}getNextDocuments(t,e,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,s-i.size):v.resolve(Qt());let u=Rr,l=i;return a.next(d=>v.forEach(d,(f,g)=>(u<g.largestBatchId&&(u=g.largestBatchId),i.get(f)?v.resolve():this.remoteDocumentCache.getEntry(t,f).next(I=>{l=l.insert(f,I)}))).next(()=>this.populateOverlays(t,d,i)).next(()=>this.computeViews(t,l,d,$())).next(f=>({batchId:u,changes:Rh(f)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new O(e)).next(n=>{let s=dr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(t,e,n,s){const i=e.collectionGroup;let a=dr();return this.indexManager.getCollectionParents(t,i).next(u=>v.forEach(u,l=>{const d=function(g,I){return new Bn(I,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(e,l.child(i));return this.getDocumentsMatchingCollectionQuery(t,d,n,s).next(f=>{f.forEach((g,I)=>{a=a.insert(g,I)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(t,e,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s))).next(a=>{i.forEach((l,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,ut.newInvalidDocument(f)))});let u=dr();return a.forEach((l,d)=>{const f=i.get(l);f!==void 0&&vr(f.mutation,d,Dt.empty(),Y.now()),Kr(e,d)&&(u=u.insert(l,d))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l_{constructor(t){this.serializer=t,this.Or=new Map,this.Nr=new Map}getBundleMetadata(t,e){return v.resolve(this.Or.get(e))}saveBundleMetadata(t,e){return this.Or.set(e.id,function(s){return{id:s.id,version:s.version,createTime:Vt(s.createTime)}}(e)),v.resolve()}getNamedQuery(t,e){return v.resolve(this.Nr.get(e))}saveNamedQuery(t,e){return this.Nr.set(e.name,function(s){return{name:s.name,query:Zh(s.bundledQuery),readTime:Vt(s.readTime)}}(e)),v.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(){this.overlays=new st(O.comparator),this.Br=new Map}getOverlay(t,e){return v.resolve(this.overlays.get(e))}getOverlays(t,e){const n=Qt();return v.forEach(e,s=>this.getOverlay(t,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(t,e,n){return n.forEach((s,i)=>{this.wt(t,e,i)}),v.resolve()}removeOverlaysForBatchId(t,e,n){const s=this.Br.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Br.delete(n)),v.resolve()}getOverlaysForCollection(t,e,n){const s=Qt(),i=e.length+1,a=new O(e.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const l=u.getNext().value,d=l.getKey();if(!e.isPrefixOf(d.path))break;d.path.length===i&&l.largestBatchId>n&&s.set(l.getKey(),l)}return v.resolve(s)}getOverlaysForCollectionGroup(t,e,n,s){let i=new st((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===e&&d.largestBatchId>n){let f=i.get(d.largestBatchId);f===null&&(f=Qt(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const u=Qt(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((d,f)=>u.set(d,f)),!(u.size()>=s)););return v.resolve(u)}wt(t,e,n){const s=this.overlays.get(n.key);if(s!==null){const a=this.Br.get(s.largestBatchId).delete(n.key);this.Br.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new sa(e,n));let i=this.Br.get(e);i===void 0&&(i=$(),this.Br.set(e,i)),this.Br.set(e,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(){this.sessionToken=dt.EMPTY_BYTE_STRING}getSessionToken(t){return v.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,v.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ca{constructor(){this.Lr=new tt(_t.kr),this.qr=new tt(_t.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(t,e){const n=new _t(t,e);this.Lr=this.Lr.add(n),this.qr=this.qr.add(n)}Ur(t,e){t.forEach(n=>this.addReference(n,e))}removeReference(t,e){this.$r(new _t(t,e))}Wr(t,e){t.forEach(n=>this.removeReference(n,e))}Qr(t){const e=new O(new X([])),n=new _t(e,t),s=new _t(e,t+1),i=[];return this.qr.forEachInRange([n,s],a=>{this.$r(a),i.push(a.key)}),i}Gr(){this.Lr.forEach(t=>this.$r(t))}$r(t){this.Lr=this.Lr.delete(t),this.qr=this.qr.delete(t)}zr(t){const e=new O(new X([])),n=new _t(e,t),s=new _t(e,t+1);let i=$();return this.qr.forEachInRange([n,s],a=>{i=i.add(a.key)}),i}containsKey(t){const e=new _t(t,0),n=this.Lr.firstAfterOrEqual(e);return n!==null&&t.isEqual(n.key)}}class _t{constructor(t,e){this.key=t,this.jr=e}static kr(t,e){return O.comparator(t.key,e.key)||B(t.jr,e.jr)}static Kr(t,e){return B(t.jr,e.jr)||O.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Xn=1,this.Jr=new tt(_t.kr)}checkEmpty(t){return v.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,n,s){const i=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new na(i,e,n,s);this.mutationQueue.push(a);for(const u of s)this.Jr=this.Jr.add(new _t(u.key,i)),this.indexManager.addToCollectionParentIndex(t,u.key.path.popLast());return v.resolve(a)}lookupMutationBatch(t,e){return v.resolve(this.Hr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=this.Zr(n),i=s<0?0:s;return v.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return v.resolve(this.mutationQueue.length===0?$e:this.Xn-1)}getAllMutationBatches(t){return v.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new _t(e,0),s=new _t(e,Number.POSITIVE_INFINITY),i=[];return this.Jr.forEachInRange([n,s],a=>{const u=this.Hr(a.jr);i.push(u)}),v.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new tt(B);return e.forEach(s=>{const i=new _t(s,0),a=new _t(s,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([i,a],u=>{n=n.add(u.jr)})}),v.resolve(this.Xr(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1;let i=n;O.isDocumentKey(i)||(i=i.child(""));const a=new _t(new O(i),0);let u=new tt(B);return this.Jr.forEachWhile(l=>{const d=l.key.path;return!!n.isPrefixOf(d)&&(d.length===s&&(u=u.add(l.jr)),!0)},a),v.resolve(this.Xr(u))}Xr(t){const e=[];return t.forEach(n=>{const s=this.Hr(n);s!==null&&e.push(s)}),e}removeMutationBatch(t,e){F(this.Yr(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Jr;return v.forEach(e.mutations,s=>{const i=new _t(s.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)}).next(()=>{this.Jr=n})}tr(t){}containsKey(t,e){const n=new _t(e,0),s=this.Jr.firstAfterOrEqual(n);return v.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,v.resolve()}Yr(t,e){return this.Zr(t)}Zr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Hr(t){const e=this.Zr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m_{constructor(t){this.ei=t,this.docs=function(){return new st(O.comparator)}(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,s=this.docs.get(n),i=s?s.size:0,a=this.ei(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return v.resolve(n?n.document.mutableCopy():ut.newInvalidDocument(e))}getEntries(t,e){let n=kt();return e.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ut.newInvalidDocument(s))}),v.resolve(n)}getDocumentsMatchingQuery(t,e,n,s){let i=kt();const a=e.path,u=new O(a.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:d,value:{document:f}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||$o($l(f),n)<=0||(s.has(f.key)||Kr(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return v.resolve(i)}getAllFromCollectionGroup(t,e,n,s){M(9500)}ti(t,e){return v.forEach(this.docs,n=>e(n))}newChangeBuffer(t){return new g_(this)}getSize(t){return v.resolve(this.size)}}class g_ extends ud{constructor(t){super(),this.Fr=t}applyChanges(t){const e=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?e.push(this.Fr.addEntry(t,s)):this.Fr.removeEntry(n)}),v.waitFor(e)}getFromCache(t,e){return this.Fr.getEntry(t,e)}getAllFromCache(t,e){return this.Fr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(t){this.persistence=t,this.ni=new re(e=>Xe(e),zr),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.ri=0,this.ii=new ca,this.targetCount=0,this.si=ne.sr()}forEachTarget(t,e){return this.ni.forEach((n,s)=>e(s)),v.resolve()}getLastRemoteSnapshotVersion(t){return v.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return v.resolve(this.ri)}allocateTargetId(t){return this.highestTargetId=this.si.next(),v.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.ri&&(this.ri=e),v.resolve()}cr(t){this.ni.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.si=new ne(e),this.highestTargetId=e),t.sequenceNumber>this.ri&&(this.ri=t.sequenceNumber)}addTargetData(t,e){return this.cr(e),this.targetCount+=1,v.resolve()}updateTargetData(t,e){return this.cr(e),v.resolve()}removeTargetData(t,e){return this.ni.delete(e.target),this.ii.Qr(e.targetId),this.targetCount-=1,v.resolve()}removeTargets(t,e,n){let s=0;const i=[];return this.ni.forEach((a,u)=>{u.sequenceNumber<=e&&n.get(u.targetId)===null&&(this.ni.delete(a),i.push(this.removeMatchingKeysForTargetId(t,u.targetId)),s++)}),v.waitFor(i).next(()=>s)}getTargetCount(t){return v.resolve(this.targetCount)}getTargetData(t,e){const n=this.ni.get(e)||null;return v.resolve(n)}addMatchingKeys(t,e,n){return this.ii.Ur(e,n),v.resolve()}removeMatchingKeys(t,e,n){this.ii.Wr(e,n);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach(a=>{i.push(s.markPotentiallyOrphaned(t,a))}),v.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.ii.Qr(e),v.resolve()}getMatchingKeysForTargetId(t,e){const n=this.ii.zr(e);return v.resolve(n)}containsKey(t,e){return v.resolve(this.ii.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(t,e){this.oi={},this.overlays={},this._i=new Ft(0),this.ai=!1,this.ai=!0,this.ui=new d_,this.referenceDelegate=t(this),this.ci=new p_(this),this.indexManager=new t_,this.remoteDocumentCache=function(s){return new m_(s)}(n=>this.referenceDelegate.li(n)),this.serializer=new Xh(e),this.hi=new l_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new h_,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.oi[t.toKey()];return n||(n=new f_(e,this.referenceDelegate),this.oi[t.toKey()]=n),n}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(t,e,n){V("MemoryPersistence","Starting transaction:",t);const s=new __(this._i.next());return this.referenceDelegate.Pi(),n(s).next(i=>this.referenceDelegate.Ti(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Ii(t,e){return v.or(Object.values(this.oi).map(n=>()=>n.containsKey(t,e)))}}class __ extends Gl{constructor(t){super(),this.currentSequenceNumber=t}}class Ti{constructor(t){this.persistence=t,this.Ei=new ca,this.Ri=null}static Ai(t){return new Ti(t)}get Vi(){if(this.Ri)return this.Ri;throw M(60996)}addReference(t,e,n){return this.Ei.addReference(n,e),this.Vi.delete(n.toString()),v.resolve()}removeReference(t,e,n){return this.Ei.removeReference(n,e),this.Vi.add(n.toString()),v.resolve()}markPotentiallyOrphaned(t,e){return this.Vi.add(e.toString()),v.resolve()}removeTarget(t,e){this.Ei.Qr(e.targetId).forEach(s=>this.Vi.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next(s=>{s.forEach(i=>this.Vi.add(i.toString()))}).next(()=>n.removeTargetData(t,e))}Pi(){this.Ri=new Set}Ti(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return v.forEach(this.Vi,n=>{const s=O.fromPath(n);return this.di(t,s).next(i=>{i||e.removeEntry(s,L.min())})}).next(()=>(this.Ri=null,e.apply(t)))}updateLimboDocument(t,e){return this.di(t,e).next(n=>{n?this.Vi.delete(e.toString()):this.Vi.add(e.toString())})}li(t){return 0}di(t,e){return v.or([()=>v.resolve(this.Ei.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ii(t,e)])}}class ei{constructor(t,e){this.persistence=t,this.mi=new re(n=>bt(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=ad(this,e)}static Ai(t,e){return new ei(t,e)}Pi(){}Ti(t){return v.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}Vr(t){const e=this.gr(t);return this.persistence.getTargetCache().getTargetCount(t).next(n=>e.next(s=>n+s))}gr(t){let e=0;return this.dr(t,n=>{e++}).next(()=>e)}dr(t,e){return v.forEach(this.mi,(n,s)=>this.yr(t,n,s).next(i=>i?v.resolve():e(s)))}removeTargets(t,e,n){return this.persistence.getTargetCache().removeTargets(t,e,n)}removeOrphanedDocuments(t,e){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ti(t,a=>this.yr(t,a,e).next(u=>{u||(n++,i.removeEntry(a,L.min()))})).next(()=>i.apply(t)).next(()=>n)}markPotentiallyOrphaned(t,e){return this.mi.set(e,t.currentSequenceNumber),v.resolve()}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,n)}addReference(t,e,n){return this.mi.set(n,t.currentSequenceNumber),v.resolve()}removeReference(t,e,n){return this.mi.set(n,t.currentSequenceNumber),v.resolve()}updateLimboDocument(t,e){return this.mi.set(e,t.currentSequenceNumber),v.resolve()}li(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Cs(t.data.value)),e}yr(t,e,n){return v.or([()=>this.persistence.Ii(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.mi.get(e);return v.resolve(s!==void 0&&s>n)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(t){this.serializer=t}k(t,e,n,s){const i=new ui("createOrUpgrade",e);n<1&&s>=1&&(function(l){l.createObjectStore(jr)}(t),function(l){l.createObjectStore(Vr,{keyPath:Rg}),l.createObjectStore(Ut,{keyPath:sc,autoIncrement:!0}).createIndex(ze,ic,{unique:!0}),l.createObjectStore(vn)}(t),Hc(t),function(l){l.createObjectStore(Le)}(t));let a=v.resolve();return n<3&&s>=3&&(n!==0&&(function(l){l.deleteObjectStore(bn),l.deleteObjectStore(An),l.deleteObjectStore(Ke)}(t),Hc(t)),a=a.next(()=>function(l){const d=l.store(Ke),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:L.min().toTimestamp(),targetCount:0};return d.put($s,f)}(i))),n<4&&s>=4&&(n!==0&&(a=a.next(()=>function(l,d){return d.store(Ut).J().next(g=>{l.deleteObjectStore(Ut),l.createObjectStore(Ut,{keyPath:sc,autoIncrement:!0}).createIndex(ze,ic,{unique:!0});const I=d.store(Ut),S=g.map(D=>I.put(D));return v.waitFor(S)})}(t,i))),a=a.next(()=>{(function(l){l.createObjectStore(Rn,{keyPath:Og})})(t)})),n<5&&s>=5&&(a=a.next(()=>this.fi(i))),n<6&&s>=6&&(a=a.next(()=>(function(l){l.createObjectStore(Cr)}(t),this.gi(i)))),n<7&&s>=7&&(a=a.next(()=>this.pi(i))),n<8&&s>=8&&(a=a.next(()=>this.yi(t,i))),n<9&&s>=9&&(a=a.next(()=>{(function(l){l.objectStoreNames.contains("remoteDocumentChanges")&&l.deleteObjectStore("remoteDocumentChanges")})(t)})),n<10&&s>=10&&(a=a.next(()=>this.wi(i))),n<11&&s>=11&&(a=a.next(()=>{(function(l){l.createObjectStore(li,{keyPath:Mg})})(t),function(l){l.createObjectStore(hi,{keyPath:Fg})}(t)})),n<12&&s>=12&&(a=a.next(()=>{(function(l){const d=l.createObjectStore(di,{keyPath:$g});d.createIndex(wo,Kg,{unique:!1}),d.createIndex(Zl,Gg,{unique:!1})})(t)})),n<13&&s>=13&&(a=a.next(()=>function(l){const d=l.createObjectStore(zs,{keyPath:Pg});d.createIndex(Ps,Vg),d.createIndex(Wl,Cg)}(t)).next(()=>this.Si(t,i)).next(()=>t.deleteObjectStore(Le))),n<14&&s>=14&&(a=a.next(()=>this.bi(t,i))),n<15&&s>=15&&(a=a.next(()=>function(l){l.createObjectStore(Qo,{keyPath:Lg,autoIncrement:!0}).createIndex(To,Bg,{unique:!1}),l.createObjectStore(yr,{keyPath:Ug}).createIndex(Xl,qg,{unique:!1}),l.createObjectStore(Ir,{keyPath:jg}).createIndex(Yl,zg,{unique:!1})}(t))),n<16&&s>=16&&(a=a.next(()=>{e.objectStore(yr).clear()}).next(()=>{e.objectStore(Ir).clear()})),n<17&&s>=17&&(a=a.next(()=>{(function(l){l.createObjectStore(Ho,{keyPath:Qg})})(t)})),n<18&&s>=18&&Al()&&(a=a.next(()=>{e.objectStore(yr).clear()}).next(()=>{e.objectStore(Ir).clear()})),a}gi(t){let e=0;return t.store(Le).ee((n,s)=>{e+=ti(s)}).next(()=>{const n={byteSize:e};return t.store(Cr).put(Eo,n)})}fi(t){const e=t.store(Vr),n=t.store(Ut);return e.J().next(s=>v.forEach(s,i=>{const a=IDBKeyRange.bound([i.userId,$e],[i.userId,i.lastAcknowledgedBatchId]);return n.J(ze,a).next(u=>v.forEach(u,l=>{F(l.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:l.batchId});const d=Ue(this.serializer,l);return rd(t,i.userId,d).next(()=>{})}))}))}pi(t){const e=t.store(bn),n=t.store(Le);return t.store(Ke).get($s).next(s=>{const i=[];return n.ee((a,u)=>{const l=new X(a),d=function(g){return[0,bt(g)]}(l);i.push(e.get(d).next(f=>f?v.resolve():(g=>e.put({targetId:0,path:bt(g),sequenceNumber:s.highestListenSequenceNumber}))(l)))}).next(()=>v.waitFor(i))})}yi(t,e){t.createObjectStore(Dr,{keyPath:kg});const n=e.store(Dr),s=new ua,i=a=>{if(s.add(a)){const u=a.lastSegment(),l=a.popLast();return n.put({collectionId:u,parent:bt(l)})}};return e.store(Le).ee({Y:!0},(a,u)=>{const l=new X(a);return i(l.popLast())}).next(()=>e.store(vn).ee({Y:!0},([a,u,l],d)=>{const f=Gt(u);return i(f.popLast())}))}wi(t){const e=t.store(An);return e.ee((n,s)=>{const i=mr(s),a=Yh(this.serializer,i);return e.put(a)})}Si(t,e){const n=e.store(Le),s=[];return n.ee((i,a)=>{const u=e.store(zs),l=function(g){return g.document?new O(X.fromString(g.document.name).popFirst(5)):g.noDocument?O.fromSegments(g.noDocument.path):g.unknownDocument?O.fromSegments(g.unknownDocument.path):M(36783)}(a).path.toArray(),d={prefixPath:l.slice(0,l.length-2),collectionGroup:l[l.length-2],documentId:l[l.length-1],readTime:a.readTime||[0,0],unknownDocument:a.unknownDocument,noDocument:a.noDocument,document:a.document,hasCommittedMutations:!!a.hasCommittedMutations};s.push(u.put(d))}).next(()=>v.waitFor(s))}bi(t,e){const n=e.store(Ut),s=cd(this.serializer),i=new la(Ti.Ai,this.serializer.gt);return n.J().next(a=>{const u=new Map;return a.forEach(l=>{let d=u.get(l.userId)??$();Ue(this.serializer,l).keys().forEach(f=>d=d.add(f)),u.set(l.userId,d)}),v.forEach(u,(l,d)=>{const f=new yt(d),g=Ii.yt(this.serializer,f),I=i.getIndexManager(f),S=Ei.yt(f,this.serializer,I,i.referenceDelegate);return new ld(s,S,g,I).recalculateAndSaveOverlaysForDocumentKeys(new vo(e,Ft.ce),l).next()})})}}function Hc(r){r.createObjectStore(bn,{keyPath:xg}).createIndex(Go,Ng,{unique:!0}),r.createObjectStore(An,{keyPath:"targetId"}).createIndex(Jl,Dg,{unique:!0}),r.createObjectStore(Ke)}const me="IndexedDbPersistence",io=18e5,oo=5e3,ao="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",I_="main";class ha{constructor(t,e,n,s,i,a,u,l,d,f,g=18){if(this.allowTabSynchronization=t,this.persistenceKey=e,this.clientId=n,this.Di=i,this.window=a,this.document=u,this.Ci=d,this.Fi=f,this.Mi=g,this._i=null,this.ai=!1,this.isPrimary=!1,this.networkEnabled=!0,this.xi=null,this.inForeground=!1,this.Oi=null,this.Ni=null,this.Bi=Number.NEGATIVE_INFINITY,this.Li=I=>Promise.resolve(),!ha.v())throw new C(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new o_(this,s),this.ki=e+I_,this.serializer=new Xh(l),this.qi=new Ee(this.ki,this.Mi,new y_(this.serializer)),this.ui=new Hp,this.ci=new n_(this.referenceDelegate,this.serializer),this.remoteDocumentCache=cd(this.serializer),this.hi=new Qp,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,f===!1&&Pt(me,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ui().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new C(P.FAILED_PRECONDITION,ao);return this.$i(),this.Wi(),this.Qi(),this.runTransaction("getHighestListenSequenceNumber","readonly",t=>this.ci.getHighestSequenceNumber(t))}).then(t=>{this._i=new Ft(t,this.Ci)}).then(()=>{this.ai=!0}).catch(t=>(this.qi&&this.qi.close(),Promise.reject(t)))}Gi(t){return this.Li=async e=>{if(this.started)return t(e)},t(this.isPrimary)}setDatabaseDeletedListener(t){this.qi.K(async e=>{e.newVersion===null&&await t()})}setNetworkEnabled(t){this.networkEnabled!==t&&(this.networkEnabled=t,this.Di.enqueueAndForget(async()=>{this.started&&await this.Ui()}))}Ui(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",t=>vs(t).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.zi(t).next(e=>{e||(this.isPrimary=!1,this.Di.enqueueRetryable(()=>this.Li(!1)))})}).next(()=>this.ji(t)).next(e=>this.isPrimary&&!e?this.Ji(t).next(()=>!1):!!e&&this.Hi(t).next(()=>!0))).catch(t=>{if(Se(t))return V(me,"Failed to extend owner lease: ",t),this.isPrimary;if(!this.allowTabSynchronization)throw t;return V(me,"Releasing owner lease after error during lease refresh",t),!1}).then(t=>{this.isPrimary!==t&&this.Di.enqueueRetryable(()=>this.Li(t)),this.isPrimary=t})}zi(t){return cr(t).get(an).next(e=>v.resolve(this.Zi(e)))}Xi(t){return vs(t).delete(this.clientId)}async Yi(){if(this.isPrimary&&!this.es(this.Bi,io)){this.Bi=Date.now();const t=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const n=gt(e,Rn);return n.J().next(s=>{const i=this.ts(s,io),a=s.filter(u=>i.indexOf(u)===-1);return v.forEach(a,u=>n.delete(u.clientId)).next(()=>a)})}).catch(()=>[]);if(this.Ki)for(const e of t)this.Ki.removeItem(this.ns(e.clientId))}}Qi(){this.Ni=this.Di.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ui().then(()=>this.Yi()).then(()=>this.Qi()))}Zi(t){return!!t&&t.ownerId===this.clientId}ji(t){return this.Fi?v.resolve(!0):cr(t).get(an).next(e=>{if(e!==null&&this.es(e.leaseTimestampMs,oo)&&!this.rs(e.ownerId)){if(this.Zi(e)&&this.networkEnabled)return!0;if(!this.Zi(e)){if(!e.allowTabSynchronization)throw new C(P.FAILED_PRECONDITION,ao);return!1}}return!(!this.networkEnabled||!this.inForeground)||vs(t).J().next(n=>this.ts(n,oo).find(s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,a=!this.inForeground&&s.inForeground,u=this.networkEnabled===s.networkEnabled;if(i||a&&u)return!0}return!1})===void 0)}).next(e=>(this.isPrimary!==e&&V(me,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.ai=!1,this.ss(),this.Ni&&(this.Ni.cancel(),this.Ni=null),this._s(),this.us(),await this.qi.runTransaction("shutdown","readwrite",[jr,Rn],t=>{const e=new vo(t,Ft.ce);return this.Ji(e).next(()=>this.Xi(e))}),this.qi.close(),this.cs()}ts(t,e){return t.filter(n=>this.es(n.updateTimeMs,e)&&!this.rs(n.clientId))}ls(){return this.runTransaction("getActiveClients","readonly",t=>vs(t).J().next(e=>this.ts(e,io).map(n=>n.clientId)))}get started(){return this.ai}getGlobalsCache(){return this.ui}getMutationQueue(t,e){return Ei.yt(t,this.serializer,e,this.referenceDelegate)}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(t){return new e_(t,this.serializer.gt.databaseId)}getDocumentOverlayCache(t){return Ii.yt(this.serializer,t)}getBundleCache(){return this.hi}runTransaction(t,e,n){V(me,"Starting transaction:",t);const s=e==="readonly"?"readonly":"readwrite",i=function(l){return l===18?Jg:l===17?rh:l===16?Wg:l===15?Wo:l===14?nh:l===13?eh:l===12?Hg:l===11?th:void M(60245)}(this.Mi);let a;return this.qi.runTransaction(t,s,i,u=>(a=new vo(u,this._i?this._i.next():Ft.ce),e==="readwrite-primary"?this.zi(a).next(l=>!!l||this.ji(a)).next(l=>{if(!l)throw Pt(`Failed to obtain primary lease for action '${t}'.`),this.isPrimary=!1,this.Di.enqueueRetryable(()=>this.Li(!1)),new C(P.FAILED_PRECONDITION,Kl);return n(a)}).next(l=>this.Hi(a).next(()=>l)):this.hs(a).next(()=>n(a)))).then(u=>(a.raiseOnCommittedEvent(),u))}hs(t){return cr(t).get(an).next(e=>{if(e!==null&&this.es(e.leaseTimestampMs,oo)&&!this.rs(e.ownerId)&&!this.Zi(e)&&!(this.Fi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new C(P.FAILED_PRECONDITION,ao)})}Hi(t){const e={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return cr(t).put(an,e)}static v(){return Ee.v()}Ji(t){const e=cr(t);return e.get(an).next(n=>this.Zi(n)?(V(me,"Releasing primary lease."),e.delete(an)):v.resolve())}es(t,e){const n=Date.now();return!(t<n-e)&&(!(t>n)||(Pt(`Detected an update time that is in the future: ${t} > ${n}`),!1))}$i(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Oi=()=>{this.Di.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.Ui()))},this.document.addEventListener("visibilitychange",this.Oi),this.inForeground=this.document.visibilityState==="visible")}_s(){this.Oi&&(this.document.removeEventListener("visibilitychange",this.Oi),this.Oi=null)}Wi(){var t;typeof((t=this.window)==null?void 0:t.addEventListener)=="function"&&(this.xi=()=>{this.ss();const e=/(?:Version|Mobile)\/1[456]/;vl()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Di.enterRestrictedMode(!0),this.Di.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.xi))}us(){this.xi&&(this.window.removeEventListener("pagehide",this.xi),this.xi=null)}rs(t){var e;try{const n=((e=this.Ki)==null?void 0:e.getItem(this.ns(t)))!==null;return V(me,`Client '${t}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Pt(me,"Failed to get zombied client id.",n),!1}}ss(){if(this.Ki)try{this.Ki.setItem(this.ns(this.clientId),String(Date.now()))}catch(t){Pt("Failed to set zombie client id.",t)}}cs(){if(this.Ki)try{this.Ki.removeItem(this.ns(this.clientId))}catch{}}ns(t){return`firestore_zombie_${this.persistenceKey}_${t}`}}function cr(r){return gt(r,jr)}function vs(r){return gt(r,Rn)}function E_(r,t){let e=r.projectId;return r.isDefaultDatabase||(e+="."+r.database),"firestore/"+t+"/"+e+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(t,e,n,s){this.targetId=t,this.fromCache=e,this.Ps=n,this.Ts=s}static Is(t,e){let n=$(),s=$();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new da(t,e.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=function(){return vl()?8:Ql(Tn())>0?6:4}()}initialize(t,e){this.ds=t,this.indexManager=e,this.Es=!0}getDocumentsMatchingQuery(t,e,n,s){const i={result:null};return this.fs(t,e).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.gs(t,e,s,n).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new T_;return this.ps(t,e,a).next(u=>{if(i.result=u,this.Rs)return this.ys(t,e,a,u.size)})}).next(()=>i.result)}ys(t,e,n,s){return n.documentReadCount<this.As?(fn()<=H.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",mn(e),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),v.resolve()):(fn()<=H.DEBUG&&V("QueryEngine","Query:",mn(e),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Vs*s?(fn()<=H.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",mn(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Lt(e))):v.resolve())}fs(t,e){if(yc(e))return v.resolve(null);let n=Lt(e);return this.indexManager.getIndexType(t,n).next(s=>s===0?null:(e.limit!==null&&s===1&&(e=Hs(e,null,"F"),n=Lt(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next(i=>{const a=$(...i);return this.ds.getDocuments(t,a).next(u=>this.indexManager.getMinOffset(t,n).next(l=>{const d=this.ws(e,u);return this.Ss(e,d,a,l.readTime)?this.fs(t,Hs(e,null,"F")):this.bs(t,d,e,l)}))})))}gs(t,e,n,s){return yc(e)||s.isEqual(L.min())?v.resolve(null):this.ds.getDocuments(t,n).next(i=>{const a=this.ws(e,i);return this.Ss(e,a,n,s)?v.resolve(null):(fn()<=H.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),mn(e)),this.bs(t,a,e,Ig(s,Rr)).next(u=>u))})}ws(t,e){let n=new tt(Ah(t));return e.forEach((s,i)=>{Kr(t,i)&&(n=n.add(i))}),n}Ss(t,e,n,s){if(t.limit===null)return!1;if(n.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ps(t,e,n){return fn()<=H.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",mn(e)),this.ds.getDocumentsMatchingQuery(t,e,Ot.min(),n)}bs(t,e,n,s){return this.ds.getDocumentsMatchingQuery(t,n,s).next(i=>(e.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fa="LocalStore",w_=3e8;class v_{constructor(t,e,n,s){this.persistence=t,this.Ds=e,this.serializer=s,this.Cs=new st(B),this.vs=new re(i=>Xe(i),zr),this.Fs=new Map,this.Ms=t.getRemoteDocumentCache(),this.ci=t.getTargetCache(),this.hi=t.getBundleCache(),this.xs(n)}xs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new ld(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.Cs))}}function dd(r,t,e,n){return new v_(r,t,e,n)}async function fd(r,t){const e=q(r);return await e.persistence.runTransaction("Handle user change","readonly",n=>{let s;return e.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,e.xs(t),e.mutationQueue.getAllMutationBatches(n))).next(i=>{const a=[],u=[];let l=$();for(const d of s){a.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}for(const d of i){u.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}return e.localDocuments.getDocuments(n,l).next(d=>({Os:d,removedBatchIds:a,addedBatchIds:u}))})})}function A_(r,t){const e=q(r);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=t.batch.keys(),i=e.Ms.newChangeBuffer({trackRemovals:!0});return function(u,l,d,f){const g=d.batch,I=g.keys();let S=v.resolve();return I.forEach(D=>{S=S.next(()=>f.getEntry(l,D)).next(k=>{const N=d.docVersions.get(D);F(N!==null,48541),k.version.compareTo(N)<0&&(g.applyToRemoteDocument(k,d),k.isValidDocument()&&(k.setReadTime(d.commitVersion),f.addEntry(k)))})}),S.next(()=>u.mutationQueue.removeMutationBatch(l,g))}(e,n,t,i).next(()=>i.apply(n)).next(()=>e.mutationQueue.performConsistencyCheck(n)).next(()=>e.documentOverlayCache.removeOverlaysForBatchId(n,s,t.batch.batchId)).next(()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(u){let l=$();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(l=l.add(u.batch.mutations[d].key));return l}(t))).next(()=>e.localDocuments.getDocuments(n,s))})}function md(r){const t=q(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.ci.getLastRemoteSnapshotVersion(e))}function b_(r,t){const e=q(r),n=t.snapshotVersion;let s=e.Cs;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=e.Ms.newChangeBuffer({trackRemovals:!0});s=e.Cs;const u=[];t.targetChanges.forEach((f,g)=>{const I=s.get(g);if(!I)return;u.push(e.ci.removeMatchingKeys(i,f.removedDocuments,g).next(()=>e.ci.addMatchingKeys(i,f.addedDocuments,g)));let S=I.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(g)!==null?S=S.withResumeToken(dt.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):f.resumeToken.approximateByteSize()>0&&(S=S.withResumeToken(f.resumeToken,n)),s=s.insert(g,S),function(k,N,G){return k.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=w_?!0:G.addedDocuments.size+G.modifiedDocuments.size+G.removedDocuments.size>0}(I,S,f)&&u.push(e.ci.updateTargetData(i,S))});let l=kt(),d=$();if(t.documentUpdates.forEach(f=>{t.resolvedLimboDocuments.has(f)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))}),u.push(R_(i,a,t.documentUpdates).next(f=>{l=f.Ns,d=f.Bs})),!n.isEqual(L.min())){const f=e.ci.getLastRemoteSnapshotVersion(i).next(g=>e.ci.setTargetsMetadata(i,i.currentSequenceNumber,n));u.push(f)}return v.waitFor(u).next(()=>a.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,l,d)).next(()=>l)}).then(i=>(e.Cs=s,i))}function R_(r,t,e){let n=$(),s=$();return e.forEach(i=>n=n.add(i)),t.getEntries(r,n).next(i=>{let a=kt();return e.forEach((u,l)=>{const d=i.get(u);l.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(u)),l.isNoDocument()&&l.version.isEqual(L.min())?(t.removeEntry(u,l.readTime),a=a.insert(u,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(t.addEntry(l),a=a.insert(u,l)):V(fa,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",l.version)}),{Ns:a,Bs:s}})}function S_(r,t){const e=q(r);return e.persistence.runTransaction("Get next mutation batch","readonly",n=>(t===void 0&&(t=$e),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t)))}function P_(r,t){const e=q(r);return e.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return e.ci.getTargetData(n,t).next(i=>i?(s=i,v.resolve(s)):e.ci.allocateTargetId(n).next(a=>(s=new Ht(t,a,"TargetPurposeListen",n.currentSequenceNumber),e.ci.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=e.Cs.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Cs=e.Cs.insert(n.targetId,n),e.vs.set(t,n.targetId)),n})}async function Mo(r,t,e){const n=q(r),s=n.Cs.get(t),i=e?"readwrite":"readwrite-primary";try{e||await n.persistence.runTransaction("Release target",i,a=>n.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Se(a))throw a;V(fa,`Failed to update sequence numbers for target ${t}: ${a}`)}n.Cs=n.Cs.remove(t),n.vs.delete(s.target)}function Wc(r,t,e){const n=q(r);let s=L.min(),i=$();return n.persistence.runTransaction("Execute query","readwrite",a=>function(l,d,f){const g=q(l),I=g.vs.get(f);return I!==void 0?v.resolve(g.Cs.get(I)):g.ci.getTargetData(d,f)}(n,a,Lt(t)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.ci.getMatchingKeysForTargetId(a,u.targetId).next(l=>{i=l})}).next(()=>n.Ds.getDocumentsMatchingQuery(a,t,e?s:L.min(),e?i:$())).next(u=>(V_(n,mp(t),u),{documents:u,Ls:i})))}function V_(r,t,e){let n=r.Fs.get(t)||L.min();e.forEach((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),r.Fs.set(t,n)}class Jc{constructor(){this.activeTargetIds=Ep()}Ws(t){this.activeTargetIds=this.activeTargetIds.add(t)}Qs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}$s(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class gd{constructor(){this.Co=new Jc,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.Co.Ws(t),this.vo[t]||"not-current"}updateQueryState(t,e,n){this.vo[t]=e}removeLocalQueryTarget(t){this.Co.Qs(t)}isLocalQueryTarget(t){return this.Co.activeTargetIds.has(t)}clearQueryState(t){delete this.vo[t]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(t){return this.Co.activeTargetIds.has(t)}start(){return this.Co=new Jc,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C_{Fo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xc="ConnectivityMonitor";class Yc{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(t){this.Bo.push(t)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){V(Xc,"Network connectivity changed: AVAILABLE");for(const t of this.Bo)t(0)}No(){V(Xc,"Network connectivity changed: UNAVAILABLE");for(const t of this.Bo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let As=null;function Fo(){return As===null?As=function(){return 268435456+Math.round(2147483648*Math.random())}():As++,"0x"+As.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uo="RestConnection",D_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class x_{get ko(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=e+"://"+t.host,this.Ko=`projects/${n}/databases/${s}`,this.Uo=this.databaseId.database===Ks?`project_id=${n}`:`project_id=${n}&database_id=${s}`}$o(t,e,n,s,i){const a=Fo(),u=this.Wo(t,e.toUriEncodedString());V(uo,`Sending RPC '${t}' ${a}:`,u,n);const l={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(l,s,i);const{host:d}=new URL(u),f=Sl(d);return this.Go(t,u,l,n,f).then(g=>(V(uo,`Received RPC '${t}' ${a}: `,g),g),g=>{throw we(uo,`RPC '${t}' ${a} failed with error: `,g,"url: ",u,"request:",n),g})}zo(t,e,n,s,i,a){return this.$o(t,e,n,s,i)}Qo(t,e,n){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Ln}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((s,i)=>t[i]=s),n&&n.headers.forEach((s,i)=>t[i]=s)}Wo(t,e){const n=D_[t];let s=`${this.qo}/v1/${e}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(t){this.jo=t.jo,this.Jo=t.Jo}Ho(t){this.Zo=t}Xo(t){this.Yo=t}e_(t){this.t_=t}onMessage(t){this.n_=t}close(){this.Jo()}send(t){this.jo(t)}r_(){this.Zo()}i_(){this.Yo()}s_(t){this.t_(t)}o_(t){this.n_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt="WebChannelConnection",lr=(r,t,e)=>{r.listen(t,n=>{try{e(n)}catch(s){setTimeout(()=>{throw s},0)}})};class In extends x_{constructor(t){super(t),this.__=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}static a_(){if(!In.u_){const t=Fl();lr(t,Ml.STAT_EVENT,e=>{e.stat===_o.PROXY?V(Tt,"STAT_EVENT: detected buffering proxy"):e.stat===_o.NOPROXY&&V(Tt,"STAT_EVENT: detected no buffering proxy")}),In.u_=!0}}Go(t,e,n,s,i){const a=Fo();return new Promise((u,l)=>{const d=new kl;d.setWithCredentials(!0),d.listenOnce(Ol.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case bs.NO_ERROR:const g=d.getResponseJson();V(Tt,`XHR for RPC '${t}' ${a} received:`,JSON.stringify(g)),u(g);break;case bs.TIMEOUT:V(Tt,`RPC '${t}' ${a} timed out`),l(new C(P.DEADLINE_EXCEEDED,"Request time out"));break;case bs.HTTP_ERROR:const I=d.getStatus();if(V(Tt,`RPC '${t}' ${a} failed with status:`,I,"response text:",d.getResponseText()),I>0){let S=d.getResponseJson();Array.isArray(S)&&(S=S[0]);const D=S==null?void 0:S.error;if(D&&D.status&&D.message){const k=function(G){const j=G.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(j)>=0?j:P.UNKNOWN}(D.status);l(new C(k,D.message))}else l(new C(P.UNKNOWN,"Server responded with status "+d.getStatus()))}else l(new C(P.UNAVAILABLE,"Connection failed."));break;default:M(9055,{c_:t,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{V(Tt,`RPC '${t}' ${a} completed.`)}});const f=JSON.stringify(s);V(Tt,`RPC '${t}' ${a} sending request:`,s),d.send(e,"POST",f,n,15)})}P_(t,e,n){const s=Fo(),i=[this.qo,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(u.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Qo(u.initMessageHeaders,e,n),u.encodeInitMessageHeaders=!0;const d=i.join("");V(Tt,`Creating RPC '${t}' stream ${s}: ${d}`,u);const f=a.createWebChannel(d,u);this.T_(f);let g=!1,I=!1;const S=new N_({jo:D=>{I?V(Tt,`Not sending because RPC '${t}' stream ${s} is closed:`,D):(g||(V(Tt,`Opening RPC '${t}' stream ${s} transport.`),f.open(),g=!0),V(Tt,`RPC '${t}' stream ${s} sending:`,D),f.send(D))},Jo:()=>f.close()});return lr(f,hr.EventType.OPEN,()=>{I||(V(Tt,`RPC '${t}' stream ${s} transport opened.`),S.r_())}),lr(f,hr.EventType.CLOSE,()=>{I||(I=!0,V(Tt,`RPC '${t}' stream ${s} transport closed`),S.s_(),this.I_(f))}),lr(f,hr.EventType.ERROR,D=>{I||(I=!0,we(Tt,`RPC '${t}' stream ${s} transport errored. Name:`,D.name,"Message:",D.message),S.s_(new C(P.UNAVAILABLE,"The operation could not be completed")))}),lr(f,hr.EventType.MESSAGE,D=>{var k;if(!I){const N=D.data[0];F(!!N,16349);const G=N,j=(G==null?void 0:G.error)||((k=G[0])==null?void 0:k.error);if(j){V(Tt,`RPC '${t}' stream ${s} received error:`,j);const U=j.status;let nt=function(E){const p=lt[E];if(p!==void 0)return Mh(p)}(U),W=j.message;U==="NOT_FOUND"&&W.includes("database")&&W.includes("does not exist")&&W.includes(this.databaseId.database)&&we(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),nt===void 0&&(nt=P.INTERNAL,W="Unknown error status: "+U+" with message "+j.message),I=!0,S.s_(new C(nt,W)),f.close()}else V(Tt,`RPC '${t}' stream ${s} received:`,N),S.o_(N)}}),In.a_(),setTimeout(()=>{S.i_()},0),S}terminate(){this.__.forEach(t=>t.close()),this.__=[]}T_(t){this.__.push(t)}I_(t){this.__=this.__.filter(e=>e===t)}Qo(t,e,n){super.Qo(t,e,n),this.databaseInfo.apiKey&&(t["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Ll()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k_(r){return new In(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O_(){return typeof window<"u"?window:null}function Os(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(r){return new Mp(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */In.u_=!1;class pd{constructor(t,e,n=1e3,s=1.5,i=6e4){this.Di=t,this.timerId=e,this.E_=n,this.R_=s,this.A_=i,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(t){this.cancel();const e=Math.floor(this.V_+this.p_()),n=Math.max(0,Date.now()-this.m_),s=Math.max(0,e-n);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,s,()=>(this.m_=Date.now(),t())),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zc="PersistentStream";class _d{constructor(t,e,n,s,i,a,u,l){this.Di=t,this.w_=n,this.S_=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=l,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new pd(t,e)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(t){this.q_(),this.stream.send(t)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(t,e){this.q_(),this.K_(),this.F_.cancel(),this.b_++,t!==4?this.F_.reset():e&&e.code===P.RESOURCE_EXHAUSTED?(Pt(e.toString()),Pt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):e&&e.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.e_(e)}U_(){}auth(){this.state=1;const t=this.W_(this.b_),e=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.b_===e&&this.Q_(n,s)},n=>{t(()=>{const s=new C(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.G_(s)})})}Q_(t,e){const n=this.W_(this.b_);this.stream=this.z_(t,e),this.stream.Ho(()=>{n(()=>this.listener.Ho())}),this.stream.Xo(()=>{n(()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.Xo()))}),this.stream.e_(s=>{n(()=>this.G_(s))}),this.stream.onMessage(s=>{n(()=>++this.v_==1?this.j_(s):this.onNext(s))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(t){return V(Zc,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Di.enqueueAndForget(()=>this.b_===t?e():(V(Zc,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class M_ extends _d{constructor(t,e,n,s,i,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,s,a),this.serializer=i}z_(t,e){return this.connection.P_("Listen",t,e)}j_(t){return this.onNext(t)}onNext(t){this.F_.reset();const e=Bp(this.serializer,t),n=function(i){if(!("targetChange"in i))return L.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?Vt(a.readTime):L.min()}(t);return this.listener.J_(e,n)}H_(t){const e={};e.database=Do(this.serializer),e.addTarget=function(i,a){let u;const l=a.target;if(u=Gs(l)?{documents:$h(i,l)}:{query:Kh(i,l).dt},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Bh(i,a.resumeToken);const d=Vo(i,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(L.min())>0){u.readTime=On(i,a.snapshotVersion.toTimestamp());const d=Vo(i,a.expectedCount);d!==null&&(u.expectedCount=d)}return u}(this.serializer,t);const n=qp(this.serializer,t);n&&(e.labels=n),this.k_(e)}Z_(t){const e={};e.database=Do(this.serializer),e.removeTarget=t,this.k_(e)}}class F_ extends _d{constructor(t,e,n,s,i,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,s,a),this.serializer=i}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(t,e){return this.connection.P_("Write",t,e)}j_(t){return F(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,F(!t.writeResults||t.writeResults.length===0,55816),this.listener.ea()}onNext(t){F(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.F_.reset();const e=Up(t.writeResults,t.commitTime),n=Vt(t.commitTime);return this.listener.ta(n,e)}na(){const t={};t.database=Do(this.serializer),this.k_(t)}Y_(t){const e={streamToken:this.lastStreamToken,writes:t.map(n=>Xs(this.serializer,n))};this.k_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{}class B_ extends L_{constructor(t,e,n,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new C(P.FAILED_PRECONDITION,"The client has already been terminated.")}$o(t,e,n,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.$o(t,Co(e,n),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new C(P.UNKNOWN,i.toString())})}zo(t,e,n,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,u])=>this.connection.zo(t,Co(e,n),s,a,u,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new C(P.UNKNOWN,a.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}function U_(r,t,e,n){return new B_(r,t,e,n)}class q_{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(t){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ua("Offline")))}set(t){this.ha(),this.sa=0,t==="Online"&&(this._a=!1),this.ua(t)}ua(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}ca(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Pt(e),this._a=!1):V("OnlineStateTracker",e)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="RemoteStore";class j_{constructor(t,e,n,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new ne(1e3),this.Aa=new ne(1001),this.Va=new Set,this.da=[],this.ma=i,this.ma.Fo(a=>{n.enqueueAndForget(async()=>{nn(this)&&(V(Yt,"Restarting streams for network reachability change."),await async function(l){const d=q(l);d.Va.add(4),await Wr(d),d.fa.set("Unknown"),d.Va.delete(4),await vi(d)}(this))})}),this.fa=new q_(n,s)}}async function vi(r){if(nn(r))for(const t of r.da)await t(!0)}async function Wr(r){for(const t of r.da)await t(!1)}function Lo(r,t){return r.Ia.get(t)||void 0}function yd(r,t){const e=q(r),n=Lo(e,t.targetId);if(n!==void 0&&e.Ta.has(n))return;const s=function(u,l){const d=Lo(u,l);d!==void 0&&u.Ea.delete(d);const f=function(I,S){return S%2!=0?I.Aa.next():I.Ra.next()}(u,l);return u.Ia.set(l,f),u.Ea.set(f,l),f}(e,t.targetId);V(Yt,"remoteStoreListen mapping SDK target ID to remote",t.targetId,s);const i=new Ht(t.target,s,t.purpose,t.sequenceNumber,t.snapshotVersion,t.lastLimboFreeSnapshotVersion,t.resumeToken);e.Ta.set(s,i),_a(e)?pa(e):qn(e).x_()&&ga(e,i)}function ma(r,t){const e=q(r),n=qn(e),s=Lo(e,t);V(Yt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",t,s),e.Ta.delete(s),e.Ia.delete(t),e.Ea.delete(s),n.x_()&&Id(e,s),e.Ta.size===0&&(n.x_()?n.B_():nn(e)&&e.fa.set("Unknown"))}function ga(r,t){if(r.ga.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(L.min())>0){const e=r.Ea.get(t.targetId);if(e===void 0)return void V(Yt,"SDK target ID not found for remote ID: "+t.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(e).size;t=t.withExpectedCount(n)}qn(r).H_(t)}function Id(r,t){r.ga.$e(t),qn(r).Z_(t)}function pa(r){r.ga=new xp({getRemoteKeysForTarget:t=>{const e=r.Ea.get(t);return e!==void 0?r.remoteSyncer.getRemoteKeysForTarget(e):$()},Rt:t=>r.Ta.get(t)||null,lt:()=>r.datastore.serializer.databaseId}),qn(r).start(),r.fa.aa()}function _a(r){return nn(r)&&!qn(r).M_()&&r.Ta.size>0}function nn(r){return q(r).Va.size===0}function Ed(r){r.ga=void 0}async function z_(r){r.fa.set("Online")}async function $_(r){r.Ta.forEach((t,e)=>{ga(r,t)})}async function K_(r,t){Ed(r),_a(r)?(r.fa.la(t),pa(r)):r.fa.set("Unknown")}async function G_(r,t,e){if(r.fa.set("Online"),t instanceof Lh&&t.state===2&&t.cause)try{await async function(s,i){const a=i.cause;for(const u of i.targetIds){if(s.Ta.has(u)){const l=s.Ea.get(u);l!==void 0&&(await s.remoteSyncer.rejectListen(l,a),s.Ia.delete(l),s.Ea.delete(u)),s.Ta.delete(u)}s.ga.removeTarget(u)}}(r,t)}catch(n){V(Yt,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await ni(r,n)}else if(t instanceof Ns?r.ga.Xe(t):t instanceof Fh?r.ga.it(t):r.ga.tt(t),!e.isEqual(L.min()))try{const n=await md(r.localStore);e.compareTo(n)>=0&&await function(i,a){const u=i.ga.Pt(a);u.targetChanges.forEach((d,f)=>{if(d.resumeToken.approximateByteSize()>0){const g=i.Ta.get(f);g&&i.Ta.set(f,g.withResumeToken(d.resumeToken,a))}}),u.targetMismatches.forEach((d,f)=>{const g=i.Ta.get(d);if(!g)return;i.Ta.set(d,g.withResumeToken(dt.EMPTY_BYTE_STRING,g.snapshotVersion)),Id(i,d);const I=new Ht(g.target,d,f,g.sequenceNumber);ga(i,I)});const l=function(f,g){const I=new Map;g.targetChanges.forEach((D,k)=>{const N=f.Ea.get(k);N!==void 0&&I.set(N,D)});let S=new st(B);return g.targetMismatches.forEach((D,k)=>{const N=f.Ea.get(D);N!==void 0&&(S=S.insert(N,k))}),new Qr(g.snapshotVersion,I,S,g.documentUpdates,g.resolvedLimboDocuments)}(i,u);return i.remoteSyncer.applyRemoteEvent(l)}(r,e)}catch(n){V(Yt,"Failed to raise snapshot:",n),await ni(r,n)}}async function ni(r,t,e){if(!Se(t))throw t;r.Va.add(1),await Wr(r),r.fa.set("Offline"),e||(e=()=>md(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{V(Yt,"Retrying IndexedDB access"),await e(),r.Va.delete(1),await vi(r)})}function Td(r,t){return t().catch(e=>ni(r,e,t))}async function Jr(r){const t=q(r),e=be(t);let n=t.Pa.length>0?t.Pa[t.Pa.length-1].batchId:$e;for(;Q_(t);)try{const s=await S_(t.localStore,n);if(s===null){t.Pa.length===0&&e.B_();break}n=s.batchId,H_(t,s)}catch(s){await ni(t,s)}wd(t)&&vd(t)}function Q_(r){return nn(r)&&r.Pa.length<10}function H_(r,t){r.Pa.push(t);const e=be(r);e.x_()&&e.X_&&e.Y_(t.mutations)}function wd(r){return nn(r)&&!be(r).M_()&&r.Pa.length>0}function vd(r){be(r).start()}async function W_(r){be(r).na()}async function J_(r){const t=be(r);for(const e of r.Pa)t.Y_(e.mutations)}async function X_(r,t,e){const n=r.Pa.shift(),s=ra.from(n,t,e);await Td(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await Jr(r)}async function Y_(r,t){t&&be(r).X_&&await async function(n,s){if(function(a){return Vp(a)&&a!==P.ABORTED}(s.code)){const i=n.Pa.shift();be(n).N_(),await Td(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Jr(n)}}(r,t),wd(r)&&vd(r)}async function tl(r,t){const e=q(r);e.asyncQueue.verifyOperationInProgress(),V(Yt,"RemoteStore received new credentials");const n=nn(e);e.Va.add(3),await Wr(e),n&&e.fa.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Va.delete(3),await vi(e)}async function Z_(r,t){const e=q(r);t?(e.Va.delete(2),await vi(e)):t||(e.Va.add(2),await Wr(e),e.fa.set("Unknown"))}function qn(r){return r.pa||(r.pa=function(e,n,s){const i=q(e);return i.ia(),new M_(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Ho:z_.bind(null,r),Xo:$_.bind(null,r),e_:K_.bind(null,r),J_:G_.bind(null,r)}),r.da.push(async t=>{t?(r.pa.N_(),_a(r)?pa(r):r.fa.set("Unknown")):(await r.pa.stop(),Ed(r))})),r.pa}function be(r){return r.ya||(r.ya=function(e,n,s){const i=q(e);return i.ia(),new F_(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Ho:()=>Promise.resolve(),Xo:W_.bind(null,r),e_:Y_.bind(null,r),ea:J_.bind(null,r),ta:X_.bind(null,r)}),r.da.push(async t=>{t?(r.ya.N_(),await Jr(r)):(await r.ya.stop(),r.Pa.length>0&&(V(Yt,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))})),r.ya}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya{constructor(t,e,n,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Wt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,i){const a=Date.now()+n,u=new ya(t,e,a,s,i);return u.start(n),u}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new C(P.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Ia(r,t){if(Pt("AsyncQueue",`${t}: ${r}`),Se(r))return new C(P.UNAVAILABLE,`${t}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{static emptySet(t){return new En(t.comparator)}constructor(t){this.comparator=t?(e,n)=>t(e,n)||O.comparator(e.key,n.key):(e,n)=>O.comparator(e.key,n.key),this.keyedMap=dr(),this.sortedSet=new st(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,n)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof En)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const n=new En;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(){this.wa=new st(O.comparator)}track(t){const e=t.doc.key,n=this.wa.get(e);n?t.type!==0&&n.type===3?this.wa=this.wa.insert(e,t):t.type===3&&n.type!==1?this.wa=this.wa.insert(e,{type:n.type,doc:t.doc}):t.type===2&&n.type===2?this.wa=this.wa.insert(e,{type:2,doc:t.doc}):t.type===2&&n.type===0?this.wa=this.wa.insert(e,{type:0,doc:t.doc}):t.type===1&&n.type===0?this.wa=this.wa.remove(e):t.type===1&&n.type===2?this.wa=this.wa.insert(e,{type:1,doc:n.doc}):t.type===0&&n.type===1?this.wa=this.wa.insert(e,{type:2,doc:t.doc}):M(63341,{At:t,Sa:n}):this.wa=this.wa.insert(e,t)}ba(){const t=[];return this.wa.inorderTraversal((e,n)=>{t.push(n)}),t}}class Mn{constructor(t,e,n,s,i,a,u,l,d){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(t,e,n,s,i){const a=[];return e.forEach(u=>{a.push({type:0,doc:u})}),new Mn(t,e,En.emptySet(e),a,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&gi(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==n[s].type||!e[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some(t=>t.Fa())}}class ey{constructor(){this.queries=nl(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(e,n){const s=q(e),i=s.queries;s.queries=nl(),i.forEach((a,u)=>{for(const l of u.Ca)l.onError(n)})})(this,new C(P.ABORTED,"Firestore shutting down"))}}function nl(){return new re(r=>vh(r),gi)}async function Ea(r,t){const e=q(r);let n=3;const s=t.query;let i=e.queries.get(s);i?!i.va()&&t.Fa()&&(n=2):(i=new ty,n=t.Fa()?0:1);try{switch(n){case 0:i.Da=await e.onListen(s,!0);break;case 1:i.Da=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const u=Ia(a,`Initialization of query '${mn(t.query)}' failed`);return void t.onError(u)}e.queries.set(s,i),i.Ca.push(t),t.xa(e.onlineState),i.Da&&t.Oa(i.Da)&&wa(e)}async function Ta(r,t){const e=q(r),n=t.query;let s=3;const i=e.queries.get(n);if(i){const a=i.Ca.indexOf(t);a>=0&&(i.Ca.splice(a,1),i.Ca.length===0?s=t.Fa()?0:1:!i.va()&&t.Fa()&&(s=2))}switch(s){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function ny(r,t){const e=q(r);let n=!1;for(const s of t){const i=s.query,a=e.queries.get(i);if(a){for(const u of a.Ca)u.Oa(s)&&(n=!0);a.Da=s}}n&&wa(e)}function ry(r,t,e){const n=q(r),s=n.queries.get(t);if(s)for(const i of s.Ca)i.onError(e);n.queries.delete(t)}function wa(r){r.Ma.forEach(t=>{t.next()})}var Bo,rl;(rl=Bo||(Bo={})).Na="default",rl.Cache="cache";class va{constructor(t,e,n){this.query=t,this.Ba=e,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=n||{}}Oa(t){if(!this.options.includeMetadataChanges){const n=[];for(const s of t.docChanges)s.type!==3&&n.push(s);t=new Mn(t.query,t.docs,t.oldDocs,n,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.La?this.qa(t)&&(this.Ba.next(t),e=!0):this.Ka(t,this.onlineState)&&(this.Ua(t),e=!0),this.ka=t,e}onError(t){this.Ba.error(t)}xa(t){this.onlineState=t;let e=!1;return this.ka&&!this.La&&this.Ka(this.ka,t)&&(this.Ua(this.ka),e=!0),e}Ka(t,e){if(!t.fromCache||!this.Fa())return!0;const n=e!=="Offline";return(!this.options.$a||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}qa(t){if(t.docChanges.length>0)return!0;const e=this.ka&&this.ka.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}Ua(t){t=Mn.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.La=!0,this.Ba.next(t)}Fa(){return this.options.source!==Bo.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(t){this.key=t}}class bd{constructor(t){this.key=t}}class sy{constructor(t,e){this.query=t,this.eu=e,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=$(),this.mutatedKeys=$(),this.ru=Ah(t),this.iu=new En(this.ru)}get su(){return this.eu}ou(t,e){const n=e?e._u:new el,s=e?e.iu:this.iu;let i=e?e.mutatedKeys:this.mutatedKeys,a=s,u=!1;const l=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal((f,g)=>{const I=s.get(f),S=Kr(this.query,g)?g:null,D=!!I&&this.mutatedKeys.has(I.key),k=!!S&&(S.hasLocalMutations||this.mutatedKeys.has(S.key)&&S.hasCommittedMutations);let N=!1;I&&S?I.data.isEqual(S.data)?D!==k&&(n.track({type:3,doc:S}),N=!0):this.au(I,S)||(n.track({type:2,doc:S}),N=!0,(l&&this.ru(S,l)>0||d&&this.ru(S,d)<0)&&(u=!0)):!I&&S?(n.track({type:0,doc:S}),N=!0):I&&!S&&(n.track({type:1,doc:I}),N=!0,(l||d)&&(u=!0)),N&&(S?(a=a.add(S),i=k?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{iu:a,_u:n,Ss:u,mutatedKeys:i}}au(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,s){const i=this.iu;this.iu=t.iu,this.mutatedKeys=t.mutatedKeys;const a=t._u.ba();a.sort((f,g)=>function(S,D){const k=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{At:N})}};return k(S)-k(D)}(f.type,g.type)||this.ru(f.doc,g.doc)),this.uu(n),s=s??!1;const u=e&&!s?this.cu():[],l=this.nu.size===0&&this.current&&!s?1:0,d=l!==this.tu;return this.tu=l,a.length!==0||d?{snapshot:new Mn(this.query,t.iu,i,a,t.mutatedKeys,l===0,d,!1,!!n&&n.resumeToken.approximateByteSize()>0),lu:u}:{lu:u}}xa(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new el,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(t){return!this.eu.has(t)&&!!this.iu.has(t)&&!this.iu.get(t).hasLocalMutations}uu(t){t&&(t.addedDocuments.forEach(e=>this.eu=this.eu.add(e)),t.modifiedDocuments.forEach(e=>{}),t.removedDocuments.forEach(e=>this.eu=this.eu.delete(e)),this.current=t.current)}cu(){if(!this.current)return[];const t=this.nu;this.nu=$(),this.iu.forEach(n=>{this.hu(n.key)&&(this.nu=this.nu.add(n.key))});const e=[];return t.forEach(n=>{this.nu.has(n)||e.push(new bd(n))}),this.nu.forEach(n=>{t.has(n)||e.push(new Ad(n))}),e}Pu(t){this.eu=t.Ls,this.nu=$();const e=this.ou(t.documents);return this.applyChanges(e,!0)}Tu(){return Mn.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const Aa="SyncEngine";class iy{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class oy{constructor(t){this.key=t,this.Iu=!1}}class ay{constructor(t,e,n,s,i,a){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Eu={},this.Ru=new re(u=>vh(u),gi),this.Au=new Map,this.Vu=new Set,this.du=new st(O.comparator),this.mu=new Map,this.fu=new ca,this.gu={},this.pu=new Map,this.yu=ne._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function uy(r,t,e=!0){const n=Dd(r);let s;const i=n.Ru.get(t);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Tu()):s=await Rd(n,t,e,!0),s}async function cy(r,t){const e=Dd(r);await Rd(e,t,!0,!1)}async function Rd(r,t,e,n){const s=await P_(r.localStore,Lt(t)),i=s.targetId,a=r.sharedClientState.addLocalQueryTarget(i,e);let u;return n&&(u=await ly(r,t,i,a==="current",s.resumeToken)),r.isPrimaryClient&&e&&yd(r.remoteStore,s),u}async function ly(r,t,e,n,s){r.Su=(g,I,S)=>async function(k,N,G,j){let U=N.view.ou(G);U.Ss&&(U=await Wc(k.localStore,N.query,!1).then(({documents:E})=>N.view.ou(E,U)));const nt=j&&j.targetChanges.get(N.targetId),W=j&&j.targetMismatches.get(N.targetId)!=null,J=N.view.applyChanges(U,k.isPrimaryClient,nt,W);return il(k,N.targetId,J.lu),J.snapshot}(r,g,I,S);const i=await Wc(r.localStore,t,!0),a=new sy(t,i.Ls),u=a.ou(i.documents),l=Hr.createSynthesizedTargetChangeForCurrentChange(e,n&&r.onlineState!=="Offline",s),d=a.applyChanges(u,r.isPrimaryClient,l);il(r,e,d.lu);const f=new iy(t,e,a);return r.Ru.set(t,f),r.Au.has(e)?r.Au.get(e).push(t):r.Au.set(e,[t]),d.snapshot}async function hy(r,t,e){const n=q(r),s=n.Ru.get(t),i=n.Au.get(s.targetId);if(i.length>1)return n.Au.set(s.targetId,i.filter(a=>!gi(a,t))),void n.Ru.delete(t);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await Mo(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),e&&ma(n.remoteStore,s.targetId),Uo(n,s.targetId)}).catch(en)):(Uo(n,s.targetId),await Mo(n.localStore,s.targetId,!0))}async function dy(r,t){const e=q(r),n=e.Ru.get(t),s=e.Au.get(n.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),ma(e.remoteStore,n.targetId))}async function fy(r,t,e){const n=xd(r);try{const s=await function(a,u){const l=q(a),d=Y.now(),f=u.reduce((S,D)=>S.add(D.key),$());let g,I;return l.persistence.runTransaction("Locally write mutations","readwrite",S=>{let D=kt(),k=$();return l.Ms.getEntries(S,f).next(N=>{D=N,D.forEach((G,j)=>{j.isValidDocument()||(k=k.add(G))})}).next(()=>l.localDocuments.getOverlayedDocuments(S,D)).next(N=>{g=N;const G=[];for(const j of u){const U=Sp(j,g.get(j.key).overlayedDocument);U!=null&&G.push(new se(j.key,U,mh(U.value.mapValue),mt.exists(!0)))}return l.mutationQueue.addMutationBatch(S,d,G,u)}).next(N=>{I=N;const G=N.applyToLocalDocumentSet(g,k);return l.documentOverlayCache.saveOverlays(S,N.batchId,G)})}).then(()=>({batchId:I.batchId,changes:Rh(g)}))}(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),function(a,u,l){let d=a.gu[a.currentUser.toKey()];d||(d=new st(B)),d=d.insert(u,l),a.gu[a.currentUser.toKey()]=d}(n,s.batchId,e),await Xr(n,s.changes),await Jr(n.remoteStore)}catch(s){const i=Ia(s,"Failed to persist write");e.reject(i)}}async function Sd(r,t){const e=q(r);try{const n=await b_(e.localStore,t);t.targetChanges.forEach((s,i)=>{const a=e.mu.get(i);a&&(F(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Iu=!0:s.modifiedDocuments.size>0?F(a.Iu,14607):s.removedDocuments.size>0&&(F(a.Iu,42227),a.Iu=!1))}),await Xr(e,n,t)}catch(n){await en(n)}}function sl(r,t,e){const n=q(r);if(n.isPrimaryClient&&e===0||!n.isPrimaryClient&&e===1){const s=[];n.Ru.forEach((i,a)=>{const u=a.view.xa(t);u.snapshot&&s.push(u.snapshot)}),function(a,u){const l=q(a);l.onlineState=u;let d=!1;l.queries.forEach((f,g)=>{for(const I of g.Ca)I.xa(u)&&(d=!0)}),d&&wa(l)}(n.eventManager,t),s.length&&n.Eu.J_(s),n.onlineState=t,n.isPrimaryClient&&n.sharedClientState.setOnlineState(t)}}async function my(r,t,e){const n=q(r);n.sharedClientState.updateQueryState(t,"rejected",e);const s=n.mu.get(t),i=s&&s.key;if(i){let a=new st(O.comparator);a=a.insert(i,ut.newNoDocument(i,L.min()));const u=$().add(i),l=new Qr(L.min(),new Map,new st(B),a,u);await Sd(n,l),n.du=n.du.remove(i),n.mu.delete(t),ba(n)}else await Mo(n.localStore,t,!1).then(()=>Uo(n,t,e)).catch(en)}async function gy(r,t){const e=q(r),n=t.batch.batchId;try{const s=await A_(e.localStore,t);Vd(e,n,null),Pd(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await Xr(e,s)}catch(s){await en(s)}}async function py(r,t,e){const n=q(r);try{const s=await function(a,u){const l=q(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return l.mutationQueue.lookupMutationBatch(d,u).next(g=>(F(g!==null,37113),f=g.keys(),l.mutationQueue.removeMutationBatch(d,g))).next(()=>l.mutationQueue.performConsistencyCheck(d)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(d,f,u)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>l.localDocuments.getDocuments(d,f))})}(n.localStore,t);Vd(n,t,e),Pd(n,t),n.sharedClientState.updateMutationState(t,"rejected",e),await Xr(n,s)}catch(s){await en(s)}}function Pd(r,t){(r.pu.get(t)||[]).forEach(e=>{e.resolve()}),r.pu.delete(t)}function Vd(r,t,e){const n=q(r);let s=n.gu[n.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),n.gu[n.currentUser.toKey()]=s}}function Uo(r,t,e=null){r.sharedClientState.removeLocalQueryTarget(t);for(const n of r.Au.get(t))r.Ru.delete(n),e&&r.Eu.bu(n,e);r.Au.delete(t),r.isPrimaryClient&&r.fu.Qr(t).forEach(n=>{r.fu.containsKey(n)||Cd(r,n)})}function Cd(r,t){r.Vu.delete(t.path.canonicalString());const e=r.du.get(t);e!==null&&(ma(r.remoteStore,e),r.du=r.du.remove(t),r.mu.delete(e),ba(r))}function il(r,t,e){for(const n of e)n instanceof Ad?(r.fu.addReference(n.key,t),_y(r,n)):n instanceof bd?(V(Aa,"Document no longer in limbo: "+n.key),r.fu.removeReference(n.key,t),r.fu.containsKey(n.key)||Cd(r,n.key)):M(19791,{Du:n})}function _y(r,t){const e=t.key,n=e.path.canonicalString();r.du.get(e)||r.Vu.has(n)||(V(Aa,"New document in limbo: "+e),r.Vu.add(n),ba(r))}function ba(r){for(;r.Vu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const t=r.Vu.values().next().value;r.Vu.delete(t);const e=new O(X.fromString(t)),n=r.yu.next();r.mu.set(n,new oy(e)),r.du=r.du.insert(e,n),yd(r.remoteStore,new Ht(Lt($r(e.path)),n,"TargetPurposeLimboResolution",Ft.ce))}}async function Xr(r,t,e){const n=q(r),s=[],i=[],a=[];n.Ru.isEmpty()||(n.Ru.forEach((u,l)=>{a.push(n.Su(l,t,e).then(d=>{var f;if((d||e)&&n.isPrimaryClient){const g=d?!d.fromCache:(f=e==null?void 0:e.targetChanges.get(l.targetId))==null?void 0:f.current;n.sharedClientState.updateQueryState(l.targetId,g?"current":"not-current")}if(d){s.push(d);const g=da.Is(l.targetId,d);i.push(g)}}))}),await Promise.all(a),n.Eu.J_(s),await async function(l,d){const f=q(l);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>v.forEach(d,I=>v.forEach(I.Ps,S=>f.persistence.referenceDelegate.addReference(g,I.targetId,S)).next(()=>v.forEach(I.Ts,S=>f.persistence.referenceDelegate.removeReference(g,I.targetId,S)))))}catch(g){if(!Se(g))throw g;V(fa,"Failed to update sequence numbers: "+g)}for(const g of d){const I=g.targetId;if(!g.fromCache){const S=f.Cs.get(I),D=S.snapshotVersion,k=S.withLastLimboFreeSnapshotVersion(D);f.Cs=f.Cs.insert(I,k)}}}(n.localStore,i))}async function yy(r,t){const e=q(r);if(!e.currentUser.isEqual(t)){V(Aa,"User change. New user:",t.toKey());const n=await fd(e.localStore,t);e.currentUser=t,function(i,a){i.pu.forEach(u=>{u.forEach(l=>{l.reject(new C(P.CANCELLED,a))})}),i.pu.clear()}(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await Xr(e,n.Os)}}function Iy(r,t){const e=q(r),n=e.mu.get(t);if(n&&n.Iu)return $().add(n.key);{let s=$();const i=e.Au.get(t);if(!i)return s;for(const a of i){const u=e.Ru.get(a);s=s.unionWith(u.view.su)}return s}}function Dd(r){const t=q(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=Sd.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Iy.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=my.bind(null,t),t.Eu.J_=ny.bind(null,t.eventManager),t.Eu.bu=ry.bind(null,t.eventManager),t}function xd(r){const t=q(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=gy.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=py.bind(null,t),t}class Ur{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=wi(t.databaseInfo.databaseId),this.sharedClientState=this.Fu(t),this.persistence=this.Mu(t),await this.persistence.start(),this.localStore=this.xu(t),this.gcScheduler=this.Ou(t,this.localStore),this.indexBackfillerScheduler=this.Nu(t,this.localStore)}Ou(t,e){return null}Nu(t,e){return null}xu(t){return dd(this.persistence,new hd,t.initialUser,this.serializer)}Mu(t){return new la(Ti.Ai,this.serializer)}Fu(t){return new gd}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ur.provider={build:()=>new Ur};class Ey extends Ur{constructor(t){super(),this.cacheSizeBytes=t}Ou(t,e){F(this.persistence.referenceDelegate instanceof ei,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new od(n,t.asyncQueue,e)}Mu(t){const e=this.cacheSizeBytes!==void 0?wt.withCacheSize(this.cacheSizeBytes):wt.DEFAULT;return new la(n=>ei.Ai(n,e),this.serializer)}}class Ty extends Ur{constructor(t,e,n){super(),this.Bu=t,this.cacheSizeBytes=e,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(t){await super.initialize(t),await this.Bu.initialize(this,t),await xd(this.Bu.syncEngine),await Jr(this.Bu.remoteStore),await this.persistence.Gi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}xu(t){return dd(this.persistence,new hd,t.initialUser,this.serializer)}Ou(t,e){const n=this.persistence.referenceDelegate.garbageCollector;return new od(n,t.asyncQueue,e)}Nu(t,e){const n=new vg(e,this.persistence);return new wg(t.asyncQueue,n)}Mu(t){const e=E_(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?wt.withCacheSize(this.cacheSizeBytes):wt.DEFAULT;return new ha(this.synchronizeTabs,e,t.clientId,n,t.asyncQueue,O_(),Os(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Fu(t){return new gd}}class ri{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>sl(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=yy.bind(null,this.syncEngine),await Z_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return function(){return new ey}()}createDatastore(t){const e=wi(t.databaseInfo.databaseId),n=k_(t.databaseInfo);return U_(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return function(n,s,i,a,u){return new j_(n,s,i,a,u)}(this.localStore,this.datastore,t.asyncQueue,e=>sl(this.syncEngine,e,0),function(){return Yc.v()?new Yc:new C_}())}createSyncEngine(t,e){return function(s,i,a,u,l,d,f){const g=new ay(s,i,a,u,l,d);return f&&(g.wu=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(s){const i=q(s);V(Yt,"RemoteStore shutting down."),i.Va.add(5),await Wr(i),i.ma.shutdown(),i.fa.set("Unknown")}(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}ri.provider={build:()=>new ri};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Lu(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Lu(this.observer.error,t):Pt("Uncaught Error in snapshot listener:",t.toString()))}ku(){this.muted=!0}Lu(t,e){setTimeout(()=>{this.muted||t(e)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re="FirestoreClient";class wy{constructor(t,e,n,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this._databaseInfo=s,this.user=yt.UNAUTHENTICATED,this.clientId=zo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async a=>{V(Re,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(n,a=>(V(Re,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Wt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=Ia(e,"Failed to shutdown persistence");t.reject(n)}}),t.promise}}async function co(r,t){r.asyncQueue.verifyOperationInProgress(),V(Re,"Initializing OfflineComponentProvider");const e=r.configuration;await t.initialize(e);let n=e.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await fd(t.localStore,s),n=s)}),t.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=t}async function ol(r,t){r.asyncQueue.verifyOperationInProgress();const e=await vy(r);V(Re,"Initializing OnlineComponentProvider"),await t.initialize(e,r.configuration),r.setCredentialChangeListener(n=>tl(t.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>tl(t.remoteStore,s)),r._onlineComponents=t}async function vy(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){V(Re,"Using user provided OfflineComponentProvider");try{await co(r,r._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(e))throw e;we("Error using user provided cache. Falling back to memory cache: "+e),await co(r,new Ur)}}else V(Re,"Using default OfflineComponentProvider"),await co(r,new Ey(void 0));return r._offlineComponents}async function Nd(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(V(Re,"Using user provided OnlineComponentProvider"),await ol(r,r._uninitializedComponentsProvider._online)):(V(Re,"Using default OnlineComponentProvider"),await ol(r,new ri))),r._onlineComponents}function Ay(r){return Nd(r).then(t=>t.syncEngine)}async function si(r){const t=await Nd(r),e=t.eventManager;return e.onListen=uy.bind(null,t.syncEngine),e.onUnlisten=hy.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=cy.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=dy.bind(null,t.syncEngine),e}function by(r,t,e,n){const s=new Ra(n),i=new va(t,s,e);return r.asyncQueue.enqueueAndForget(async()=>Ea(await si(r),i)),()=>{s.ku(),r.asyncQueue.enqueueAndForget(async()=>Ta(await si(r),i))}}function Ry(r,t,e={}){const n=new Wt;return r.asyncQueue.enqueueAndForget(async()=>function(i,a,u,l,d){const f=new Ra({next:I=>{f.ku(),a.enqueueAndForget(()=>Ta(i,g));const S=I.docs.has(u);!S&&I.fromCache?d.reject(new C(P.UNAVAILABLE,"Failed to get document because the client is offline.")):S&&I.fromCache&&l&&l.source==="server"?d.reject(new C(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(I)},error:I=>d.reject(I)}),g=new va($r(u.path),f,{includeMetadataChanges:!0,$a:!0});return Ea(i,g)}(await si(r),r.asyncQueue,t,e,n)),n.promise}function Sy(r,t,e={}){const n=new Wt;return r.asyncQueue.enqueueAndForget(async()=>function(i,a,u,l,d){const f=new Ra({next:I=>{f.ku(),a.enqueueAndForget(()=>Ta(i,g)),I.fromCache&&l.source==="server"?d.reject(new C(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(I)},error:I=>d.reject(I)}),g=new va(u,f,{includeMetadataChanges:!0,$a:!0});return Ea(i,g)}(await si(r),r.asyncQueue,t,e,n)),n.promise}function Py(r,t){const e=new Wt;return r.asyncQueue.enqueueAndForget(async()=>fy(await Ay(r),t,e)),e.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kd(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vy="ComponentProvider",al=new Map;function Cy(r,t,e,n,s){return new Yg(r,t,e,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,kd(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od="firestore.googleapis.com",ul=!0;class cl{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new C(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Od,this.ssl=ul}else this.host=t.host,this.ssl=t.ssl??ul;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=nd;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<r_)throw new C(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}_g("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=kd(t.experimentalLongPollingOptions??{}),function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Ai{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new cl({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new C(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new C(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new cl(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new ag;switch(n.type){case"firstParty":return new hg(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new C(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const n=al.get(e);n&&(V(Vy,"Removing Datastore"),al.delete(e),n.terminate())}(this),Promise.resolve()}}function Dy(r,t,e,n={}){var d;r=At(r,Ai);const s=Sl(t),i=r._getSettings(),a={...i,emulatorOptions:r._getEmulatorOptions()},u=`${t}:${e}`;s&&Gf(`https://${u}`),i.host!==Od&&i.host!==u&&we("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...i,host:u,ssl:s,emulatorOptions:n};if(!Ls(l,a)&&(r._setSettings(l),n.mockUserToken)){let f,g;if(typeof n.mockUserToken=="string")f=n.mockUserToken,g=yt.MOCK_USER;else{f=Bf(n.mockUserToken,(d=r._app)==null?void 0:d.options.projectId);const I=n.mockUserToken.sub||n.mockUserToken.user_id;if(!I)throw new C(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new yt(I)}r._authCredentials=new ug(new Ul(f,g))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new ie(this.firestore,t,this._query)}}class ct{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Te(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new ct(this.firestore,t,this._key)}toJSON(){return{type:ct._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(qr(e,ct._jsonSchema))return new ct(t,n||null,new O(X.fromString(e.referencePath)))}}ct._jsonSchemaVersion="firestore/documentReference/1.0",ct._jsonSchema={type:ht("string",ct._jsonSchemaVersion),referencePath:ht("string")};class Te extends ie{constructor(t,e,n){super(t,e,$r(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new ct(this.firestore,null,new O(t))}withConverter(t){return new Te(this.firestore,t,this._path)}}function rI(r,t,...e){if(r=Bt(r),jl("collection","path",t),r instanceof Ai){const n=X.fromString(t,...e);return Zu(n),new Te(r,null,n)}{if(!(r instanceof ct||r instanceof Te))throw new C(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(X.fromString(t,...e));return Zu(n),new Te(r.firestore,null,n)}}function xy(r,t,...e){if(r=Bt(r),arguments.length===1&&(t=zo.newId()),jl("doc","path",t),r instanceof Ai){const n=X.fromString(t,...e);return Yu(n),new ct(r,null,new O(n))}{if(!(r instanceof ct||r instanceof Te))throw new C(P.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(X.fromString(t,...e));return Yu(n),new ct(r.firestore,r instanceof Te?r.converter:null,new O(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll="AsyncQueue";class hl{constructor(t=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new pd(this,"async_queue_retry"),this.cc=()=>{const n=Os();n&&V(ll,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this.lc=t;const e=Os();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.hc(),this.Pc(t)}enterRestrictedMode(t){if(!this.rc){this.rc=!0,this.ac=t||!1;const e=Os();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.cc)}}enqueue(t){if(this.hc(),this.rc)return new Promise(()=>{});const e=new Wt;return this.Pc(()=>this.rc&&this.ac?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.nc.push(t),this.Tc()))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(t){if(!Se(t))throw t;V(ll,"Operation failed with retryable error: "+t)}this.nc.length>0&&this.F_.g_(()=>this.Tc())}}Pc(t){const e=this.lc.then(()=>(this._c=!0,t().catch(n=>{throw this.oc=n,this._c=!1,Pt("INTERNAL UNHANDLED ERROR: ",dl(n)),n}).then(n=>(this._c=!1,n))));return this.lc=e,e}enqueueAfterDelay(t,e,n){this.hc(),this.uc.indexOf(t)>-1&&(e=0);const s=ya.createAndSchedule(this,t,e,n,i=>this.Ic(i));return this.sc.push(s),s}hc(){this.oc&&M(47125,{Ec:dl(this.oc)})}verifyOperationInProgress(){}async Rc(){let t;do t=this.lc,await t;while(t!==this.lc)}Ac(t){for(const e of this.sc)if(e.timerId===t)return!0;return!1}Vc(t){return this.Rc().then(()=>{this.sc.sort((e,n)=>e.targetTimeMs-n.targetTimeMs);for(const e of this.sc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Rc()})}dc(t){this.uc.push(t)}Ic(t){const e=this.sc.indexOf(t);this.sc.splice(e,1)}}function dl(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}class jt extends Ai{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new hl,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new hl(t),this._firestoreClient=void 0,await t}}}function sI(r,t){const e=typeof r=="object"?r:Wm(),n=typeof r=="string"?r:Ks,s=zm(e,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Ff("firestore");i&&Dy(s,...i)}return s}function Yr(r){if(r._terminated)throw new C(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Md(r),r._firestoreClient}function Md(r){var n,s,i,a;const t=r._freezeSettings(),e=Cy(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,t);r._componentsProvider||(i=t.localCache)!=null&&i._offlineComponentProvider&&((a=t.localCache)!=null&&a._onlineComponentProvider)&&(r._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),r._firestoreClient=new wy(r._authCredentials,r._appCheckCredentials,r._queue,e,r._componentsProvider&&function(l){const d=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(d),_online:d}}(r._componentsProvider))}function iI(r,t){we("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();return Ny(r,ri.provider,{build:n=>new Ty(n,e.cacheSizeBytes,t==null?void 0:t.forceOwnership)}),Promise.resolve()}function Ny(r,t,e){if((r=At(r,jt))._firestoreClient||r._terminated)throw new C(P.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new C(P.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:t,_offline:e},Md(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Mt(dt.fromBase64String(t))}catch(e){throw new C(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Mt(dt.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Mt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(qr(t,Mt._jsonSchema))return Mt.fromBase64String(t.bytes)}}Mt._jsonSchemaVersion="firestore/bytes/1.0",Mt._jsonSchema={type:ht("string",Mt._jsonSchemaVersion),bytes:ht("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new C(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ot(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new C(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new C(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return B(this._lat,t._lat)||B(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Jt._jsonSchemaVersion}}static fromJSON(t){if(qr(t,Jt._jsonSchema))return new Jt(t.latitude,t.longitude)}}Jt._jsonSchemaVersion="firestore/geoPoint/1.0",Jt._jsonSchema={type:ht("string",Jt._jsonSchemaVersion),latitude:ht("number"),longitude:ht("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,t._values)}toJSON(){return{type:qt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(qr(t,qt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every(e=>typeof e=="number"))return new qt(t.vectorValues);throw new C(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}qt._jsonSchemaVersion="firestore/vectorValue/1.0",qt._jsonSchema={type:ht("string",qt._jsonSchemaVersion),vectorValues:ht("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=/^__.*__$/;class Oy{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new se(t,this.data,this.fieldMask,e,this.fieldTransforms):new Un(t,this.data,e,this.fieldTransforms)}}class Fd{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new se(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Ld(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{dataSource:r})}}class Sa{constructor(t,e,n,s,i,a){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.mc(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(t){return new Sa({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),n=this.i({path:e,arrayElement:!1});return n.yc(t),n}wc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),n=this.i({path:e,arrayElement:!1});return n.mc(),n}Sc(t){return this.i({path:void 0,arrayElement:!0})}bc(t){return ii(t,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}mc(){if(this.path)for(let t=0;t<this.path.length;t++)this.yc(this.path.get(t))}yc(t){if(t.length===0)throw this.bc("Document fields must not be empty");if(Ld(this.dataSource)&&ky.test(t))throw this.bc('Document fields cannot begin and end with "__"')}}class My{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||wi(t)}V(t,e,n,s=!1){return new Sa({dataSource:t,methodName:e,targetDoc:n,path:ot.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Zr(r){const t=r._freezeSettings(),e=wi(r._databaseId);return new My(r._databaseId,!!t.ignoreUndefinedProperties,e)}function Pa(r,t,e,n,s,i={}){const a=r.V(i.merge||i.mergeFields?2:0,t,e,s);Ca("Data must be an object, but it was:",a,n);const u=qd(n,a);let l,d;if(i.merge)l=new Dt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const g of i.mergeFields){const I=tn(t,g,e);if(!a.contains(I))throw new C(P.INVALID_ARGUMENT,`Field '${I}' is specified in your field mask but missing from your input data.`);$d(f,I)||f.push(I)}l=new Dt(f),d=a.fieldTransforms.filter(g=>l.covers(g.field))}else l=null,d=a.fieldTransforms;return new Oy(new vt(u),l,d)}class ts extends Ri{_toFieldTransform(t){if(t.dataSource!==2)throw t.dataSource===1?t.bc(`${this._methodName}() can only appear at the top level of your update data`):t.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof ts}}class Va extends Ri{_toFieldTransform(t){return new xh(t.path,new Dn)}isEqual(t){return t instanceof Va}}function Bd(r,t,e,n){const s=r.V(1,t,e);Ca("Data must be an object, but it was:",s,n);const i=[],a=vt.empty();Pe(n,(l,d)=>{const f=zd(t,l,e);d=Bt(d);const g=s.wc(f);if(d instanceof ts)i.push(f);else{const I=es(d,g);I!=null&&(i.push(f),a.set(f,I))}});const u=new Dt(i);return new Fd(a,u,s.fieldTransforms)}function Ud(r,t,e,n,s,i){const a=r.V(1,t,e),u=[tn(t,n,e)],l=[s];if(i.length%2!=0)throw new C(P.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let I=0;I<i.length;I+=2)u.push(tn(t,i[I])),l.push(i[I+1]);const d=[],f=vt.empty();for(let I=u.length-1;I>=0;--I)if(!$d(d,u[I])){const S=u[I];let D=l[I];D=Bt(D);const k=a.wc(S);if(D instanceof ts)d.push(S);else{const N=es(D,k);N!=null&&(d.push(S),f.set(S,N))}}const g=new Dt(d);return new Fd(f,g,a.fieldTransforms)}function Fy(r,t,e,n=!1){return es(e,r.V(n?4:3,t))}function es(r,t){if(jd(r=Bt(r)))return Ca("Unsupported field value:",t,r),qd(r,t);if(r instanceof Ri)return function(n,s){if(!Ld(s.dataSource))throw s.bc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.bc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.arrayElement&&t.dataSource!==4)throw t.bc("Nested arrays are not supported");return function(n,s){const i=[];let a=0;for(const u of n){let l=es(u,s.Sc(a));l==null&&(l={nullValue:"NULL_VALUE"}),i.push(l),a++}return{arrayValue:{values:i}}}(r,t)}return function(n,s){if((n=Bt(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Tp(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=Y.fromDate(n);return{timestampValue:On(s.serializer,i)}}if(n instanceof Y){const i=new Y(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:On(s.serializer,i)}}if(n instanceof Jt)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Mt)return{bytesValue:Bh(s.serializer,n._byteString)};if(n instanceof ct){const i=s.databaseId,a=n.firestore._databaseId;if(!a.isEqual(i))throw s.bc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:oa(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof qt)return function(a,u){const l=a instanceof qt?a.toArray():a;return{mapValue:{fields:{[Xo]:{stringValue:Yo},[Sn]:{arrayValue:{values:l.map(f=>{if(typeof f!="number")throw u.bc("VectorValues must only contain numeric values.");return pi(u.serializer,f)})}}}}}}(n,s);if(Jh(n))return n._toProto(s.serializer);throw s.bc(`Unsupported field value: ${ai(n)}`)}(r,t)}function qd(r,t){const e={};return sh(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Pe(r,(n,s)=>{const i=es(s,t.gc(n));i!=null&&(e[n]=i)}),{mapValue:{fields:e}}}function jd(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Y||r instanceof Jt||r instanceof Mt||r instanceof ct||r instanceof Ri||r instanceof qt||Jh(r))}function Ca(r,t,e){if(!jd(e)||!zl(e)){const n=ai(e);throw n==="an object"?t.bc(r+" a custom object"):t.bc(r+" "+n)}}function tn(r,t,e){if((t=Bt(t))instanceof bi)return t._internalPath;if(typeof t=="string")return zd(r,t);throw ii("Field path arguments must be of type string or ",r,!1,void 0,e)}const Ly=new RegExp("[~\\*/\\[\\]]");function zd(r,t,e){if(t.search(Ly)>=0)throw ii(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new bi(...t.split("."))._internalPath}catch{throw ii(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function ii(r,t,e,n,s){const i=n&&!n.isEmpty(),a=s!==void 0;let u=`Function ${t}() called with invalid data`;e&&(u+=" (via `toFirestore()`)"),u+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${n}`),a&&(l+=` in document ${s}`),l+=")"),new C(P.INVALID_ARGUMENT,u+r+l)}function $d(r,t){return r.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{convertValue(t,e="none"){switch(ve(t)){case 0:return null;case 1:return t.booleanValue;case 2:return it(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(ee(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw M(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return Pe(t,(s,i)=>{n[s]=this.convertValue(i,e)}),n}convertVectorValue(t){var n,s,i;const e=(i=(s=(n=t.fields)==null?void 0:n[Sn].arrayValue)==null?void 0:s.values)==null?void 0:i.map(a=>it(a.doubleValue));return new qt(e)}convertGeoPoint(t){return new Jt(it(t.latitude),it(t.longitude))}convertArray(t,e){return(t.values||[]).map(n=>this.convertValue(n,e))}convertServerTimestamp(t,e){switch(e){case"previous":const n=fi(t);return n==null?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(xr(t));default:return null}}convertTimestamp(t){const e=te(t);return new Y(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=X.fromString(t);F(Wh(n),9688,{name:t});const s=new Je(n.get(1),n.get(3)),i=new O(n.popFirst(5));return s.isEqual(e)||Pt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da extends By{constructor(t){super(),this.firestore=t}convertBytes(t){return new Mt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new ct(this.firestore,null,e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oI(){return new ts("deleteField")}function aI(){return new Va("serverTimestamp")}const fl="@firebase/firestore",ml="4.15.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(r){return function(e,n){if(typeof e!="object"||e===null)return!1;const s=e;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1}(r,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(t,e,n,s,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new Uy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var t;return((t=this._document)==null?void 0:t.data.clone().value.mapValue.fields)??void 0}get(t){if(this._document){const e=this._document.data.field(tn("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class Uy extends Kd{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gd(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new C(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class xa{}class Na extends xa{}function uI(r,t,...e){let n=[];t instanceof xa&&n.push(t),n=n.concat(e),function(i){const a=i.filter(l=>l instanceof ka).length,u=i.filter(l=>l instanceof Si).length;if(a>1||a>0&&u>0)throw new C(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class Si extends Na{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new Si(t,e,n)}_apply(t){const e=this._parse(t);return Qd(t._query,e),new ie(t.firestore,t.converter,Po(t._query,e))}_parse(t){const e=Zr(t.firestore);return function(i,a,u,l,d,f,g){let I;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new C(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){_l(g,f);const D=[];for(const k of g)D.push(pl(l,i,k));I={arrayValue:{values:D}}}else I=pl(l,i,g)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||_l(g,f),I=Fy(u,a,g,f==="in"||f==="not-in");return K.create(d,f,I)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function cI(r,t,e){const n=t,s=tn("where",r);return Si._create(s,n,e)}class ka extends xa{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new ka(t,e)}_parse(t){const e=this._queryConstraints.map(n=>n._parse(t)).filter(n=>n.getFilters().length>0);return e.length===1?e[0]:Z.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(s,i){let a=s;const u=i.getFlattenedFilters();for(const l of u)Qd(a,l),a=Po(a,l)}(t._query,e),new ie(t.firestore,t.converter,Po(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Oa extends Na{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Oa(t,e)}_apply(t){const e=function(s,i,a){if(s.startAt!==null)throw new C(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new C(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Fr(i,a)}(t._query,this._field,this._direction);return new ie(t.firestore,t.converter,fp(t._query,e))}}function lI(r,t="asc"){const e=t,n=tn("orderBy",r);return Oa._create(n,e)}class Ma extends Na{constructor(t,e,n){super(),this.type=t,this._limit=e,this._limitType=n}static _create(t,e,n){return new Ma(t,e,n)}_apply(t){return new ie(t.firestore,t.converter,Hs(t._query,this._limit,this._limitType))}}function hI(r){return yg("limit",r),Ma._create("limit",r,"F")}function pl(r,t,e){if(typeof(e=Bt(e))=="string"){if(e==="")throw new C(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!wh(t)&&e.indexOf("/")!==-1)throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const n=t.path.child(X.fromString(e));if(!O.isDocumentKey(n))throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return kr(r,new O(n))}if(e instanceof ct)return kr(r,e._key);throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ai(e)}.`)}function _l(r,t){if(!Array.isArray(r)||r.length===0)throw new C(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Qd(r,t){const e=function(s,i){for(const a of s)for(const u of a.getFlattenedFilters())if(i.indexOf(u.op)>=0)return u.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new C(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new C(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}function Fa(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class gr{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Qe extends Kd{constructor(t,e,n,s,i,a){super(t,e,n,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Ms(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(tn("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new C(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Qe._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Qe._jsonSchemaVersion="firestore/documentSnapshot/1.0",Qe._jsonSchema={type:ht("string",Qe._jsonSchemaVersion),bundleSource:ht("string","DocumentSnapshot"),bundleName:ht("string"),bundle:ht("string")};class Ms extends Qe{data(t={}){return super.data(t)}}class He{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new gr(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach(n=>{t.call(e,new Ms(this._firestore,this._userDataWriter,n.key,n,new gr(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new C(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(u=>{const l=new Ms(s._firestore,s._userDataWriter,u.doc.key,u.doc,new gr(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>i||u.type!==3).map(u=>{const l=new Ms(s._firestore,s._userDataWriter,u.doc.key,u.doc,new gr(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),f=a.indexOf(u.doc.key)),{type:qy(u.type),doc:l,oldIndex:d,newIndex:f}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new C(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=He._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=zo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach(i=>{i._document!==null&&(e.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))}),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function qy(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */He._jsonSchemaVersion="firestore/querySnapshot/1.0",He._jsonSchema={type:ht("string",He._jsonSchemaVersion),bundleSource:ht("string","QuerySnapshot"),bundleName:ht("string"),bundle:ht("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=Zr(t)}set(t,e,n){this._verifyNotCommitted();const s=lo(t,this._firestore),i=Fa(s.converter,e,n),a=Pa(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(a.toMutation(s._key,mt.none())),this}update(t,e,n,...s){this._verifyNotCommitted();const i=lo(t,this._firestore);let a;return a=typeof(e=Bt(e))=="string"||e instanceof bi?Ud(this._dataReader,"WriteBatch.update",i._key,e,n,s):Bd(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(a.toMutation(i._key,mt.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=lo(t,this._firestore);return this._mutations=this._mutations.concat(new Gr(e._key,mt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new C(P.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function lo(r,t){if((r=Bt(r)).firestore!==t)throw new C(P.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dI(r){r=At(r,ct);const t=At(r.firestore,jt),e=Yr(t);return Ry(e,r._key).then(n=>Hd(t,r,n))}function fI(r){r=At(r,ie);const t=At(r.firestore,jt),e=Yr(t),n=new Da(t);return Gd(r._query),Sy(e,r._query).then(s=>new He(t,n,r,s))}function mI(r,t,e){r=At(r,ct);const n=At(r.firestore,jt),s=Fa(r.converter,t,e),i=Zr(n);return ns(n,[Pa(i,"setDoc",r._key,s,r.converter!==null,e).toMutation(r._key,mt.none())])}function gI(r,t,e,...n){r=At(r,ct);const s=At(r.firestore,jt),i=Zr(s);let a;return a=typeof(t=Bt(t))=="string"||t instanceof bi?Ud(i,"updateDoc",r._key,t,e,n):Bd(i,"updateDoc",r._key,t),ns(s,[a.toMutation(r._key,mt.exists(!0))])}function pI(r){return ns(At(r.firestore,jt),[new Gr(r._key,mt.none())])}function _I(r,t){const e=At(r.firestore,jt),n=xy(r),s=Fa(r.converter,t),i=Zr(r.firestore);return ns(e,[Pa(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,mt.exists(!1))]).then(()=>n)}function yI(r,...t){var d,f,g;r=Bt(r);let e={includeMetadataChanges:!1,source:"default"},n=0;typeof t[n]!="object"||gl(t[n])||(e=t[n++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(gl(t[n])){const I=t[n];t[n]=(d=I.next)==null?void 0:d.bind(I),t[n+1]=(f=I.error)==null?void 0:f.bind(I),t[n+2]=(g=I.complete)==null?void 0:g.bind(I)}let i,a,u;if(r instanceof ct)a=At(r.firestore,jt),u=$r(r._key.path),i={next:I=>{t[n]&&t[n](Hd(a,r,I))},error:t[n+1],complete:t[n+2]};else{const I=At(r,ie);a=At(I.firestore,jt),u=I._query;const S=new Da(a);i={next:D=>{t[n]&&t[n](new He(a,S,I,D))},error:t[n+1],complete:t[n+2]},Gd(r._query)}const l=Yr(a);return by(l,u,s,i)}function ns(r,t){const e=Yr(r);return Py(e,t)}function Hd(r,t,e){const n=e.docs.get(t._key),s=new Da(r);return new Qe(r,s,t._key,n,new gr(e.hasPendingWrites,e.fromCache),t.converter)}function II(r){return r=At(r,jt),Yr(r),new jy(r,t=>ns(r,t))}(function(t,e=!0){og(Qm),Us(new Ar("firestore",(n,{instanceIdentifier:s,options:i})=>{const a=n.getProvider("app").getImmediate(),u=new jt(new cg(n.getProvider("auth-internal")),new dg(a,n.getProvider("app-check-internal")),Zg(a,s),a);return i={useFetchStreams:e,...i},u._setSettings(i),u},"PUBLIC").setMultipleInstances(!0)),yn(fl,ml,t),yn(fl,ml,"esm2020")})();var zy="firebase",$y="12.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */yn(zy,$y,"app");export{Gf as A,Zy as B,tI as C,Gy as D,Rl as E,Wy as F,H as G,Tn as H,Jy as I,Xy as J,Fn as K,Pl as L,Hy as M,xf as N,Qy as O,Us as P,Ar as Q,yn as R,Qm as S,Y as T,eI as U,II as V,$m as _,yI as a,dI as b,rI as c,xy as d,iI as e,aI as f,sI as g,fI as h,Hm as i,oI as j,_I as k,hI as l,pI as m,Bt as n,lI as o,Yy as p,uI as q,zm as r,mI as s,Ky as t,gI as u,Mf as v,cI as w,Wm as x,Ls as y,Sl as z};

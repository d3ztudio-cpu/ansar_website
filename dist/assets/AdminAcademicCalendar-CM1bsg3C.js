import{t as xe,j as l,r as X}from"./index-wDeiIc-M.js";import{r as x}from"./vendor-DSga0zUN.js";import{L as ve,F as De,g as Pe,a as Le,e as Me,h as ke,_ as Fe,C as je,r as z,s as $e,t as Q,D as Ue,G as Ge}from"./firebase-Bin2EbmS.js";import{a as Z,S as ee}from"./academicCalendarData-DoQGnvkZ.js";var te="@firebase/ai",Y="2.13.0";/**
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
 */const L="AI",ne="us-central1",Ve="firebasevertexai.googleapis.com",$="v1beta",se=Y,Be="gl-js",He="hybrid",qe=180*1e3,Ye="gemini-2.5-flash-lite";/**
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
 */class h extends De{constructor(e,n,s){const a=L,o=`${a}/${e}`,i=`${a}: ${n} (${o})`;super(e,i),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,h),Object.setPrototypeOf(this,h.prototype),this.toString=()=>i}}/**
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
 */const ae=["user","model","function","system"],fe={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},S={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},I={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},v={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
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
 */const u={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
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
 */const T={VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};/**
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
 */class me{constructor(e){this.backendType=e}}class G extends me{constructor(){super(T.GOOGLE_AI)}_getModelPath(e,n){return`/${$}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${$}/projects/${e}/templates/${n}`}}class J extends me{constructor(e=ne){super(T.VERTEX_AI),e?this.location=e:this.location=ne}_getModelPath(e,n){return`/${$}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${$}/projects/${e}/locations/${this.location}/templates/${n}`}}/**
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
 */function Je(t){if(t instanceof G)return`${L}/googleai`;if(t instanceof J)return`${L}/vertexai/${t.location}`;throw new h(u.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function Ke(t){const e=t.split("/");if(e[0]!==L)throw new h(u.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"vertexai":const s=e[2];if(!s)throw new h(u.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new J(s);case"googleai":return new G;default:throw new h(u.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
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
 */const O=new ve("@firebase/vertexai");var A;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(A||(A={}));/**
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
 */const ge={type:"text",languages:["en"]},V=[ge,{type:"image"}],B=[ge];class w{constructor(e,n,s){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:V,expectedOutputs:B}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=V),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=B)):this.onDeviceParams.createOptions={expectedInputs:V,expectedOutputs:B})}async isAvailable(e){var s;if(!this.mode)return O.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===I.ONLY_IN_CLOUD)return O.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));if(this.mode===I.ONLY_ON_DEVICE){if(n===A.UNAVAILABLE)throw new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===A.DOWNLOADABLE||n===A.DOWNLOADING){O.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(a){throw new h(u.ERROR,a.message)}return!0}return!0}return n!==A.AVAILABLE?(O.debug(`On-device inference unavailable because availability is "${n}".`),!1):w.isOnDeviceRequest(e)?!0:(O.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(w.toLanguageModelMessage)),a=await n.prompt(s,this.onDeviceParams.promptOptions);return w.toResponse(a)}async generateContentStream(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(w.toLanguageModelMessage)),a=n.promptStreaming(s,this.onDeviceParams.promptOptions);return w.toStreamResponse(a)}async countTokens(e){throw new h(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return O.debug("Empty prompt rejected for on-device inference."),!1;for(const n of e.contents){if(n.role==="function")return O.debug('"Function" role rejected for on-device inference.'),!1;for(const s of n.parts)if(s.inlineData&&w.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return O.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){var s;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));return(n===A.DOWNLOADABLE||n===A.DOWNLOADING)&&this.download(e),n}download(e){var s;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=a=>{a.addEventListener("downloadprogress",o=>{e(o.loaded)})}),this.downloadPromise=(s=this.languageModelProvider)==null?void 0:s.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const n=await Promise.all(e.parts.map(w.toLanguageModelMessageContent));return{role:w.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if(e.text)return{type:"text",value:e.text};if(e.inlineData){const s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new h(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new h(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,a){const o=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});a.enqueue(n.encode(`data: ${o}

`))}}))}}}w.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function We(t,e,n){if(typeof e<"u"&&t)return new w(e.LanguageModel,t,n)}/**
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
 */class Xe{constructor(e,n,s,a,o){this.app=e,this.backend=n,this.chromeAdapterFactory=o;const i=a==null?void 0:a.getImmediate({optional:!0}),r=s==null?void 0:s.getImmediate({optional:!0});this.auth=r||null,this.appCheck=i||null,n instanceof J?this.location=n.location:this.location=""}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
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
 */function ze(t,{instanceIdentifier:e}){if(!e)throw new h(u.ERROR,"AIService instance identifier is undefined.");const n=Ke(e),s=t.getProvider("app").getImmediate(),a=t.getProvider("auth-internal"),o=t.getProvider("app-check-internal");return new Xe(s,n,a,o,We)}/**
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
 */function Qe(t){var n,s,a,o,i,r,c;if((s=(n=t.app)==null?void 0:n.options)!=null&&s.apiKey)if((o=(a=t.app)==null?void 0:a.options)!=null&&o.projectId){if(!((r=(i=t.app)==null?void 0:i.options)!=null&&r.appId))throw new h(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new h(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new h(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,location:t.location,backend:t.backend};if(ke(t.app)&&t.app.settings.appCheckToken){const p=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:p})}else t.appCheck&&((c=t.options)!=null&&c.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}/**
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
 */class k{constructor(e,n){this._apiSettings=Qe(e),this.model=k.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===T.GOOGLE_AI?k.normalizeGoogleAIModelName(e):k.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}}/**
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
 */const Ze="Timeout has expired.",H="AbortError";class et{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var e;return((e=this.params.singleRequestOptions)==null?void 0:e.baseUrl)??`https://${Ve}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function tt(t){const e=[];return e.push(`${Be}/${se}`),e.push(`fire/${se}`),(t.params.apiSettings.inferenceMode===I.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===I.PREFER_IN_CLOUD)&&e.push(He),e.join(" ")}async function nt(t){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",tt(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&O.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){const n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function K(t,e){var p,b;const n=new et(t);let s;const a=(p=t.singleRequestOptions)==null?void 0:p.signal,o=((b=t.singleRequestOptions)==null?void 0:b.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:qe,i=new AbortController,r=setTimeout(()=>{i.abort(new DOMException(Ze,H)),O.debug(`Aborting request to ${n} due to timeout (${o}ms)`)},o),c=AbortSignal.any(a?[a,i.signal]:[i.signal]);if(a&&a.aborted)throw clearTimeout(r),new DOMException(a.reason??"Aborted externally before fetch",H);try{const m={method:"POST",headers:await nt(n),signal:c,body:e};if(s=await fetch(n.toString(),m),!s.ok){let _="",g;try{const R=await s.json();_=R.error.message,R.error.details&&(_+=` ${JSON.stringify(R.error.details)}`,g=R.error.details)}catch{}throw s.status===403&&g&&g.some(R=>R.reason==="SERVICE_DISABLED")&&g.some(R=>{var N,F;return(F=(N=R.links)==null?void 0:N[0])==null?void 0:F.description.includes("Google developers console API activation")})?new h(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:g}):new h(u.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${_}`,{status:s.status,statusText:s.statusText,errorDetails:g})}}catch(m){let _=m;throw m.code!==u.FETCH_ERROR&&m.code!==u.API_NOT_ENABLED&&m instanceof Error&&m.name!==H&&(_=new h(u.ERROR,`Error fetching from ${n.toString()}: ${m.message}`),_.stack=m.stack),_}finally{clearTimeout(r)}return s}/**
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
 */function j(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&O.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),ye(t.candidates[0]))throw new h(u.RESPONSE_ERROR,`Response error: ${D(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function U(t,e=v.IN_CLOUD){t.candidates&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0);const n=st(t);return n.inferenceSource=e,n}function st(t){return t.text=()=>{if(j(t))return oe(t,e=>!e.thought);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Text not available. ${D(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(j(t)){const e=oe(t,n=>!!n.thought);return e===""?void 0:e}else if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Thought summary not available. ${D(t)}`,{response:t})},t.inlineDataParts=()=>{if(j(t))return at(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Data not available. ${D(t)}`,{response:t})},t.functionCalls=()=>{if(j(t))return Ee(t);if(t.promptFeedback)throw new h(u.RESPONSE_ERROR,`Function call not available. ${D(t)}`,{response:t})},t}function oe(t,e){var s,a,o,i;const n=[];if((a=(s=t.candidates)==null?void 0:s[0].content)!=null&&a.parts)for(const r of(i=(o=t.candidates)==null?void 0:o[0].content)==null?void 0:i.parts)r.text&&e(r)&&n.push(r.text);return n.length>0?n.join(""):""}function Ee(t){var n,s,a,o;if(!t)return;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const i of(o=(a=t.candidates)==null?void 0:a[0].content)==null?void 0:o.parts)i.functionCall&&e.push(i.functionCall);if(e.length>0)return e}function at(t){var n,s,a,o;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const i of(o=(a=t.candidates)==null?void 0:a[0].content)==null?void 0:o.parts)i.inlineData&&e.push(i);if(e.length>0)return e}const ot=[S.RECITATION,S.SAFETY,S.BLOCKLIST,S.PROHIBITED_CONTENT,S.SPII,S.MALFORMED_FUNCTION_CALL,S.IMAGE_SAFETY,S.IMAGE_PROHIBITED_CONTENT,S.IMAGE_OTHER,S.NO_IMAGE,S.IMAGE_RECITATION,S.LANGUAGE,S.UNEXPECTED_TOOL_CALL,S.TOO_MANY_TOOL_CALLS,S.MISSING_THOUGHT_SIGNATURE,S.MALFORMED_RESPONSE];function ye(t){return!!t.finishReason&&ot.some(e=>e===t.finishReason)}function D(t){var n,s,a;let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",(n=t.promptFeedback)!=null&&n.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),(s=t.promptFeedback)!=null&&s.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if((a=t.candidates)!=null&&a[0]){const o=t.candidates[0];ye(o)&&(e+=`Candidate was blocked due to ${o.finishReason}`,o.finishMessage&&(e+=`: ${o.finishMessage}`))}return e}/**
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
 */function be(t){var e,n;if((e=t.safetySettings)==null||e.forEach(s=>{if(s.method)throw new h(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=t.generationConfig)!=null&&n.topK){const s=Math.round(t.generationConfig.topK);s!==t.generationConfig.topK&&(O.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=s)}return t}function W(t){return{candidates:t.candidates?rt(t.candidates):void 0,prompt:t.promptFeedback?ct(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function it(t,e){return{generateContentRequest:{model:e,...t}}}function rt(t){const e=[];let n;return e&&t.forEach(s=>{var i,r;let a;if(s.citationMetadata&&(a={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(c=>({...c,severity:c.severity??fe.HARM_SEVERITY_UNSUPPORTED,probabilityScore:c.probabilityScore??0,severityScore:c.severityScore??0}))),(r=(i=s.content)==null?void 0:i.parts)!=null&&r.some(c=>c==null?void 0:c.videoMetadata))throw new h(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const o={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:a,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(o)}),e}function ct(t){const e=[];return t.safetyRatings.forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??fe.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}/**
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
 */const ie=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function lt(t,e,n){const s=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),a=ht(s),[o,i]=a.tee(),{response:r,firstValue:c}=await dt(i,e,n);return{stream:pt(o,e,n),response:r,firstValue:c}}async function dt(t,e,n){const[s,a]=t.tee(),o=s.getReader(),{value:i}=await o.read();return{firstValue:i,response:ut(a,e,n)}}async function ut(t,e,n){const s=[],a=t.getReader();for(;;){const{done:o,value:i}=await a.read();if(o){let r=ft(s);return e.backend.backendType===T.GOOGLE_AI&&(r=W(r)),U(r,n)}s.push(i)}}async function*pt(t,e,n){var a,o;const s=t.getReader();for(;;){const{value:i,done:r}=await s.read();if(r)break;let c;e.backend.backendType===T.GOOGLE_AI?c=U(W(i),n):c=U(i,n);const p=(a=c.candidates)==null?void 0:a[0];!((o=p==null?void 0:p.content)!=null&&o.parts)&&!(p!=null&&p.finishReason)&&!(p!=null&&p.citationMetadata)&&!(p!=null&&p.urlContextMetadata)||(yield c)}}function ht(t){const e=t.getReader();return new ReadableStream({start(s){let a="";return o();function o(){return e.read().then(({value:i,done:r})=>{if(r){if(a.trim()){s.error(new h(u.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}a+=i;let c=a.match(ie),p;for(;c;){try{p=JSON.parse(c[1])}catch{s.error(new h(u.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}s.enqueue(p),a=a.substring(c[0].length),c=a.match(ie)}return o()})}}})}function ft(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const s of t)if(s.candidates)for(const a of s.candidates){const o=a.index||0;n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:a.index}),n.candidates[o].citationMetadata=a.citationMetadata,n.candidates[o].finishReason=a.finishReason,n.candidates[o].finishMessage=a.finishMessage,n.candidates[o].safetyRatings=a.safetyRatings,n.candidates[o].groundingMetadata=a.groundingMetadata;const i=a.urlContextMetadata;if(typeof i=="object"&&i!==null&&Object.keys(i).length>0&&(n.candidates[o].urlContextMetadata=i),a.content){if(!a.content.parts)continue;n.candidates[o].content||(n.candidates[o].content={role:a.content.role||"user",parts:[]});for(const r of a.content.parts){const c={...r};r.text!==""&&Object.keys(c).length>0&&n.candidates[o].content.parts.push(c)}}}return n}/**
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
 */const mt=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function Oe(t,e,n,s){if(!e)return{response:await s(),inferenceSource:v.IN_CLOUD};switch(e.mode){case I.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:v.ON_DEVICE};throw new h(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case I.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:v.IN_CLOUD};case I.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:v.IN_CLOUD}}catch(a){if(a instanceof h&&mt.includes(a.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:v.ON_DEVICE};throw a}case I.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:v.ON_DEVICE}:{response:await s(),inferenceSource:v.IN_CLOUD};default:throw new h(u.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
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
 */async function gt(t,e,n,s){return t.backend.backendType===T.GOOGLE_AI&&(n=be(n)),K({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function Re(t,e,n,s,a){const o=await Oe(n,s,()=>s.generateContentStream(n),()=>gt(t,e,n,a));return lt(o.response,t,o.inferenceSource)}async function Et(t,e,n,s){return t.backend.backendType===T.GOOGLE_AI&&(n=be(n)),K({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function _e(t,e,n,s,a){const o=await Oe(n,s,()=>s.generateContent(n),()=>Et(t,e,n,a)),i=await yt(o.response,t);return{response:U(i,o.inferenceSource)}}async function yt(t,e){const n=await t.json();return e.backend.backendType===T.GOOGLE_AI?W(n):n}/**
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
 */function Se(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function M(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(const n of t)typeof n=="string"?e.push({text:n}):e.push(n);return bt(e)}function bt(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,a=!1;for(const o of t)"functionResponse"in o?(n.parts.push(o),a=!0):(e.parts.push(o),s=!0);if(s&&a)throw new h(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!s&&!a)throw new h(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return s?e:n}function q(t){let e;return t.contents?e=t:e={contents:[M(t)]},t.systemInstruction&&(e.systemInstruction=Se(t.systemInstruction)),e}/**
 * @license
 * Copyright 2026 Google LLC
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
 */const re="SILENT_ERROR",ce=10;class Ot{constructor(e,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,this._history}async _sendMessage(e,n){let s={};await this._sendPromise;const a=[];return this._sendPromise=this._sendPromise.then(async()=>{var c,p,b;let o,i=0;const r=((c=this.requestOptions)==null?void 0:c.maxSequentialFunctionCalls)??ce;do{let m;if(o){i++;const R=await this._callFunctionsAsNeeded(o);m=M(R)}else m=M(e);const _=this._formatRequest(m,[...a]);a.push(m);const g=await this._callGenerateContent(_,n);if(g)if(s=g,o=this._getCallableFunctionCalls(g.response),g.response.candidates&&g.response.candidates.length>0){const R={parts:((p=g.response.candidates)==null?void 0:p[0].content.parts)||[],role:((b=g.response.candidates)==null?void 0:b[0].content.role)||"model"};a.push(R)}else{const R=D(g.response);R&&O.warn(`sendMessage() was unsuccessful. ${R}. Inspect response object for details.`)}else o=void 0}while(o&&i<r);o&&i>=r&&O.warn(`Automatic function calling exceeded the limit of ${r} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(a),s}async _sendMessageStream(e,n){await this._sendPromise;const s=[],o=(async()=>{var b;let i,r=0;const c=((b=this.requestOptions)==null?void 0:b.maxSequentialFunctionCalls)??ce;let p;do{let m;if(i){r++;const g=await this._callFunctionsAsNeeded(i);m=M(g)}else m=M(e);const _=this._formatRequest(m,[...s]);if(s.push(m),p=await this._callGenerateContentStream(_,n),i=this._getCallableFunctionCalls(p.firstValue),i&&p.firstValue&&p.firstValue.candidates&&p.firstValue.candidates.length>0){const g={...p.firstValue.candidates[0].content};g.role||(g.role="model"),s.push(g)}}while(i&&r<c);return i&&r>=c&&O.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:p.stream,response:p.response}})();return this._sendPromise=this._sendPromise.then(async()=>o).catch(i=>{throw new Error(re)}).then(i=>i.response).then(i=>{if(i.candidates&&i.candidates.length>0){this._history=this._history.concat(s);const r={...i.candidates[0].content};r.role||(r.role="model"),this._history.push(r)}else{const r=D(i);r&&O.warn(`sendMessageStream() was unsuccessful. ${r}. Inspect response object for details.`)}}).catch(i=>{i.message!==re&&i.name!=="AbortError"&&O.error(i)}),o}_getCallableFunctionCalls(e){var a,o,i;const n=(o=(a=this.params)==null?void 0:a.tools)==null?void 0:o.find(r=>r.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const s=Ee(e);if(s){for(const r of s)if(!((i=n.functionDeclarations)==null?void 0:i.some(p=>p.name===r.name&&typeof p.functionReference=="function")))return;return s}}async _callFunctionsAsNeeded(e){var o,i;const n=[],s=[],a=(i=(o=this.params)==null?void 0:o.tools)==null?void 0:i.find(r=>r.functionDeclarations);if(a&&a.functionDeclarations){for(const c of e){const p=a.functionDeclarations.find(b=>b.name===c.name);if(p!=null&&p.functionReference){const b=Promise.resolve(p.functionReference(c.args)).catch(m=>{const _=new h(u.ERROR,`Error in user-defined function "${p.name}": ${m.message}`);throw _.stack=m.stack,_});n.push({name:c.name,id:c.id,results:b}),s.push(b)}}await Promise.all(s);const r=[];for(const{name:c,id:p,results:b}of n){const m={name:c,response:await b};p&&(m.id=p),r.push({functionResponse:m})}return r}else throw new h(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
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
 */const le=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],Rt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},de={user:["model"],function:["model"],model:["user","function"],system:[]};function _t(t){let e=null;for(const n of t){const{role:s,parts:a}=n;if(!e&&s!=="user")throw new h(u.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!ae.includes(s))throw new h(u.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(ae)}`);if(!Array.isArray(a))throw new h(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(a.length===0)throw new h(u.INVALID_CONTENT,"Each Content should have at least one part");const o={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,executableCode:0,codeExecutionResult:0};for(const r of a)for(const c of le)c in r&&(o[c]+=1);const i=Rt[s];for(const r of le)if(!i.includes(r)&&o[r]>0)throw new h(u.INVALID_CONTENT,`Content with role '${s}' can't contain '${r}' part`);if(e&&!de[s].includes(e.role))throw new h(u.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(de)}`);e=n}}/**
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
 */class St extends Ot{constructor(e,n,s,a,o){super(e,a,o),this.model=n,this.chromeAdapter=s,this.params=a,this.requestOptions=o,a!=null&&a.history&&(_t(a.history),this._history=a.history)}_formatRequest(e,n){var s,a,o,i,r;return{safetySettings:(s=this.params)==null?void 0:s.safetySettings,generationConfig:(a=this.params)==null?void 0:a.generationConfig,tools:(o=this.params)==null?void 0:o.tools,toolConfig:(i=this.params)==null?void 0:i.toolConfig,systemInstruction:(r=this.params)==null?void 0:r.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return _e(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return Re(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}}/**
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
 */async function wt(t,e,n,s){let a="";if(t.backend.backendType===T.GOOGLE_AI){const i=it(n,e);a=JSON.stringify(i)}else a=JSON.stringify(n);return(await K({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:s},a)).json()}async function It(t,e,n,s,a){if((s==null?void 0:s.mode)===I.ONLY_ON_DEVICE)throw new h(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return wt(t,e,n,a)}/**
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
 */class Ct extends k{constructor(e,n,s,a){super(e,n.model),this.chromeAdapter=a,this.generationConfig=n.generationConfig||{},At(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Se(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===I.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===A.UNAVAILABLE){const s=new h(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===I.ONLY_ON_DEVICE)throw s;O.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){const s=q(e);return _e(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){const s=q(e),{stream:a,response:o}=await Re(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:a,response:o}}startChat(e){return new St(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){const s=q(e);return It(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}}function At(t){var e,n;if(((e=t.thinkingConfig)==null?void 0:e.thinkingBudget)!=null&&((n=t.thinkingConfig)!=null&&n.thinkingLevel))throw new h(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new h(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json")throw new h(u.UNSUPPORTED,'responseMimeType must be set to "application/json" if responseSchema or responseJsonSchema are set.')}/**
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
 */function Tt(t=Me(),e){t=Pe(t);const n=Le(t,L),s=(e==null?void 0:e.backend)??new G,a={useLimitedUseAppCheckTokens:(e==null?void 0:e.useLimitedUseAppCheckTokens)??!1},o=Je(s),i=n.getImmediate({identifier:o});return i.options=a,i}const Nt=["mode","onDeviceParams","inCloudParams"];function xt(t,e,n){var r;const s=e;let a;if(s.mode){for(const c of Object.keys(e))Nt.includes(c)||O.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);a=s.inCloudParams||{model:Ye}}else a=e;if(!a.model)throw new h(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const o=(r=t.chromeAdapterFactory)==null?void 0:r.call(t,s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),i=new Ct(t,a,n,o);return i._apiSettings.inferenceMode=s.mode,i}function vt(){Fe(new je(L,ze,"PUBLIC").setMultipleInstances(!0)),z(te,Y),z(te,Y,"esm2020")}vt();const Dt=Tt(xe,{backend:new G}),Pt=14*1024*1024,Lt=[5,6,7,8,9,10,11,0,1,2],Mt={type:"object",properties:{months:{type:"array",items:{type:"object",properties:{month:{type:"integer"},year:{type:"integer"},workingDays:{type:"integer"},events:{type:"array",items:{type:"object",properties:{day:{type:"integer"},text:{type:"string"}}}}}}}}};function kt(t){return new Promise((e,n)=>{const s=new FileReader;s.onerror=()=>n(new Error("The selected PDF could not be read.")),s.onload=()=>e({inlineData:{data:String(s.result).split(",")[1],mimeType:"application/pdf"}}),s.readAsDataURL(t)})}function Ft(t,e){const n=Lt[e],s=n>=5?2026:2027;if(!t||Number(t.month)!==n||Number(t.year)!==s)throw new Error("The PDF did not produce the required June 2026 to March 2027 month sequence.");const a=new Date(s,n+1,0).getDate(),o={};for(const i of Array.isArray(t.events)?t.events:[]){const r=Number(i==null?void 0:i.day),c=String((i==null?void 0:i.text)||"").trim();Number.isInteger(r)&&r>=1&&r<=a&&c&&(o[r]=[...o[r]||[],c])}return{month:n,year:s,workingDays:Math.max(0,Math.min(a,Number(t.workingDays)||0)),events:o}}async function jt(t,e){if(!(t instanceof File)||t.type!=="application/pdf")throw new Error("Choose a PDF calendar file.");if(t.size>Pt)throw new Error("Choose a PDF smaller than 14 MB.");const n=xt(Dt,{model:"gemini-3.5-flash",generationConfig:{responseMimeType:"application/json",responseSchema:Mt,maxOutputTokens:16e3}}),s=`Read this ${e==="sprouts"?"Ansar Sprouts":"Ansar English School"} academic calendar PDF. Extract only what is visibly written in the PDF; never guess or add events. Return the academic year June 2026 through March 2027 as exactly ten month objects. Use JavaScript month numbers (June is 5 and March is 2). Set workingDays to the printed total for each month. For each dated event, holiday, assessment, reopening, closing, or note, return one event item with its calendar day and the exact concise event text. Put multi-day items on every stated date only. If a date or working-day total is unclear, use an empty event list or 0 rather than inventing it.`,a=await n.generateContent([s,await kt(t)]);let o;try{o=JSON.parse(a.response.text())}catch{throw new Error("The calendar scan returned an unreadable result. Please try the PDF again.")}if(!Array.isArray(o==null?void 0:o.months)||o.months.length!==10)throw new Error("The scan did not find all ten calendar months. Please use the complete June 2026–March 2027 PDF.");return o.months.map(Ft)}const ue=t=>JSON.parse(JSON.stringify(t)),pe=t=>new Intl.DateTimeFormat("en-IN",{month:"long",year:"numeric"}).format(new Date(t.year,t.month));function he(t){return t.map(e=>({...e,workingDays:Number(e.workingDays)||0,events:Object.fromEntries(Object.entries(e.events||{}).map(([n,s])=>[n,(s||[]).map(a=>String(a).trim()).filter(Boolean)]).filter(([,n])=>n.length))}))}function Ht(){const[t,e]=x.useState({school:ue(ee.months),sprouts:ue(Z.months)}),[n,s]=x.useState("school"),[a,o]=x.useState(0),[i,r]=x.useState(!1),[c,p]=x.useState(!1),[b,m]=x.useState("");x.useEffect(()=>{$e(Q(X,"settings","global")).then(d=>{var y;const f=(y=d.data())==null?void 0:y.academicCalendars;f&&e(E=>({school:Array.isArray(f.school)&&f.school.length===ee.months.length?f.school:E.school,sprouts:Array.isArray(f.sprouts)&&f.sprouts.length===Z.months.length?f.sprouts:E.sprouts}))}).catch(d=>m(`Could not load saved calendars: ${d.message}`))},[]);const _=t[n],g=_[a],R=x.useMemo(()=>Object.entries((g==null?void 0:g.events)||{}).flatMap(([d,f])=>f.map((y,E)=>({day:Number(d),entryIndex:E,text:y}))).sort((d,f)=>d.day-f.day),[g]),N=d=>e(f=>({...f,[n]:f[n].map((y,E)=>E===a?d(y):y)})),F=(d,f,y)=>N(E=>({...E,events:{...E.events,[d]:E.events[d].map((P,C)=>C===f?y:P)}})),we=(d,f)=>N(y=>{const E={...y.events};return E[d]=E[d].filter((P,C)=>C!==f),E[d].length||delete E[d],{...y,events:E}}),Ie=()=>N(d=>({...d,events:{...d.events,1:[...d.events[1]||[],"New calendar event"]}})),Ce=(d,f,y)=>N(E=>{const P=E.events[d][f],C={...E.events,[d]:E.events[d].filter(($t,Ne)=>Ne!==f)};return C[d].length||delete C[d],C[y]=[...C[y]||[],P],{...E,events:C}}),Ae=async()=>{r(!0),m("");try{await Ue(Q(X,"settings","global"),{academicCalendars:{school:he(t.school),sprouts:he(t.sprouts)},updatedAt:Ge()},{merge:!0}),m("Academic calendars saved. The School Academics and Ansar Sprouts pages update automatically.")}catch(d){m(`Could not save calendars: ${d.message}`)}finally{r(!1)}},Te=async d=>{var y;const f=(y=d.target.files)==null?void 0:y[0];if(d.target.value="",!!f){p(!0),m("Reading the PDF calendar. This can take a few moments…");try{const E=await jt(f,n);e(P=>({...P,[n]:E})),o(0),m(`PDF scanned for ${n==="school"?"Ansar English School":"Ansar Sprouts"}. Review every month and select Save both calendars to publish it.`)}catch(E){m(`Could not scan this PDF: ${E.message}`)}finally{p(!1)}}};return l.jsxs("div",{className:"mx-auto max-w-6xl space-y-6",children:[l.jsxs("section",{className:"rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8",children:[l.jsx("p",{className:"text-xs font-black uppercase tracking-[0.2em] text-emerald-600",children:"Academic year 2026-2027"}),l.jsx("h2",{className:"mt-2 text-2xl font-extrabold text-slate-900",children:"Academic Calendar Editor"}),l.jsx("p",{className:"mt-3 max-w-3xl leading-7 text-slate-600",children:"Update the two public calendars from one place. School entries appear only on the Academics page; Sprouts entries appear only on the Ansar Sprouts page."})]}),l.jsxs("section",{className:"rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-700",children:[l.jsx("h3",{className:"font-extrabold text-slate-900",children:"How to update the calendar"}),l.jsxs("ol",{className:"mt-3 list-decimal space-y-2 pl-5 text-sm leading-6",children:[l.jsxs("li",{children:["Select ",l.jsx("strong",{children:"School"})," or ",l.jsx("strong",{children:"Sprouts"}),". They remain completely separate."]}),l.jsxs("li",{children:["To start from an official calendar, select ",l.jsx("strong",{children:"Scan PDF calendar"}),". The scan fills the editor but does ",l.jsx("strong",{children:"not"})," publish anything yet."]}),l.jsxs("li",{children:["Review all ten months, working-day totals, holidays, assessments, and reopening/closing dates against the PDF. Correct any item in the editor or use ",l.jsx("strong",{children:"Add event"}),"."]}),l.jsxs("li",{children:["Select ",l.jsx("strong",{children:"Save both calendars"})," only after review. The matching public page then updates automatically."]})]})]}),l.jsxs("section",{className:"rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7",children:[l.jsxs("div",{className:"flex flex-wrap gap-3",children:[l.jsx("button",{type:"button",onClick:()=>{s("school"),o(0)},className:`rounded-xl px-5 py-3 font-bold ${n==="school"?"bg-emerald-700 text-white":"bg-slate-100 text-slate-700"}`,children:"Ansar English School"}),l.jsx("button",{type:"button",onClick:()=>{s("sprouts"),o(0)},className:`rounded-xl px-5 py-3 font-bold ${n==="sprouts"?"bg-orange-500 text-white":"bg-slate-100 text-slate-700"}`,children:"Ansar Sprouts"})]}),l.jsx("div",{className:"mt-5 flex gap-2 overflow-x-auto pb-2",children:_.map((d,f)=>l.jsx("button",{type:"button",onClick:()=>o(f),className:`whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold ${f===a?n==="school"?"bg-emerald-100 text-emerald-800":"bg-orange-100 text-orange-800":"bg-slate-100 text-slate-600"}`,children:pe(d)},`${d.year}-${d.month}`))}),l.jsxs("div",{className:"mt-6 flex flex-wrap items-end justify-between gap-4",children:[l.jsxs("div",{children:[l.jsx("h3",{className:"text-xl font-extrabold text-slate-900",children:pe(g)}),l.jsx("p",{className:"mt-1 text-sm text-slate-500",children:"Each line is shown on the public calendar for its selected date."})]}),l.jsxs("div",{className:"flex flex-wrap items-end gap-3",children:[l.jsxs("label",{className:"block text-sm font-bold text-slate-700",children:["Working days",l.jsx("input",{type:"number",min:"0",max:"31",value:g.workingDays,onChange:d=>N(f=>({...f,workingDays:d.target.value})),className:"mt-1 block w-28 rounded-lg border border-slate-300 p-3 text-lg font-bold"})]}),l.jsxs("label",{className:`cursor-pointer rounded-lg px-4 py-3 font-bold text-white ${c?"cursor-wait bg-slate-400":n==="school"?"bg-emerald-700 hover:bg-emerald-800":"bg-orange-500 hover:bg-orange-600"}`,children:[l.jsx("input",{type:"file",accept:"application/pdf,.pdf",onChange:Te,disabled:c,className:"sr-only"}),c?"Scanning PDF…":"Scan PDF calendar"]})]})]}),l.jsx("div",{className:"mt-6 overflow-x-auto",children:l.jsxs("table",{className:"w-full min-w-[620px] text-left text-sm",children:[l.jsx("thead",{className:"border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500",children:l.jsxs("tr",{children:[l.jsx("th",{className:"p-3",children:"Date"}),l.jsx("th",{className:"p-3",children:"Event / holiday / assessment"}),l.jsx("th",{className:"p-3",children:l.jsx("span",{className:"sr-only",children:"Remove"})})]})}),l.jsx("tbody",{children:R.map(d=>l.jsxs("tr",{className:"border-b border-slate-100",children:[l.jsx("td",{className:"p-3",children:l.jsx("select",{value:d.day,onChange:f=>Ce(d.day,d.entryIndex,Number(f.target.value)),className:"rounded-lg border border-slate-300 p-2",children:Array.from({length:new Date(g.year,g.month+1,0).getDate()},(f,y)=>l.jsx("option",{value:y+1,children:y+1},y+1))})}),l.jsx("td",{className:"p-3",children:l.jsx("input",{value:d.text,onChange:f=>F(d.day,d.entryIndex,f.target.value),className:"w-full rounded-lg border border-slate-300 p-2","aria-label":`Event on ${d.day}`})}),l.jsx("td",{className:"p-3 text-right",children:l.jsx("button",{type:"button",onClick:()=>we(d.day,d.entryIndex),className:"rounded-lg px-3 py-2 font-bold text-red-600 hover:bg-red-50",children:"Remove"})})]},`${d.day}-${d.entryIndex}`))})]})}),l.jsxs("div",{className:"mt-5 flex flex-wrap items-center justify-between gap-3",children:[l.jsx("button",{type:"button",onClick:Ie,className:"rounded-lg border border-slate-300 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-50",children:"+ Add event"}),l.jsx("button",{type:"button",onClick:Ae,disabled:i,className:"rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60",children:i?"Saving…":"Save both calendars"})]}),b&&l.jsx("p",{className:`mt-5 rounded-lg p-3 text-sm font-bold ${b.startsWith("Could not")?"bg-red-50 text-red-700":"bg-emerald-50 text-emerald-800"}`,children:b})]})]})}export{Ht as default};

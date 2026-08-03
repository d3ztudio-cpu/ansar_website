import{a as Me,u as xe,b as L,c as Pe,j as h,L as Le}from"./index-BWQ1nFt9.js";import{r as M,L as ke}from"./vendor-D3HrvFD7.js";import{L as De,F as Fe,z as je,_ as Ue,A as $e,B as Ge,C as Be,D as Ve,E as ie}from"./firebase-DQ-lOI3H.js";var oe="@firebase/ai",Q="2.13.0";/**
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
 */const D="AI",re="us-central1",He="firebasevertexai.googleapis.com",q="v1beta",ce=Q,qe="gl-js",Ke="hybrid",Ye=180*1e3,Je="gemini-2.5-flash-lite";/**
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
 */class p extends Fe{constructor(n,a,e){const s=D,i=`${s}/${n}`,o=`${s}: ${a} (${i})`;super(n,o),this.code=n,this.customErrorData=e,Error.captureStackTrace&&Error.captureStackTrace(this,p),Object.setPrototypeOf(this,p.prototype),this.toString=()=>o}}/**
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
 */const le=["user","model","function","system"],ye={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},w={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},T={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},N={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
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
 */const I={VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};/**
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
 */class be{constructor(n){this.backendType=n}}class Y extends be{constructor(){super(I.GOOGLE_AI)}_getModelPath(n,a){return`/${q}/projects/${n}/${a}`}_getTemplatePath(n,a){return`/${q}/projects/${n}/templates/${a}`}}class Z extends be{constructor(n=re){super(I.VERTEX_AI),n?this.location=n:this.location=re}_getModelPath(n,a){return`/${q}/projects/${n}/locations/${this.location}/${a}`}_getTemplatePath(n,a){return`/${q}/projects/${n}/locations/${this.location}/templates/${a}`}}/**
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
 */function ze(t){if(t instanceof Y)return`${D}/googleai`;if(t instanceof Z)return`${D}/vertexai/${t.location}`;throw new p(u.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function We(t){const n=t.split("/");if(n[0]!==D)throw new p(u.ERROR,`Invalid instance identifier, unknown prefix '${n[0]}'`);switch(n[1]){case"vertexai":const e=n[2];if(!e)throw new p(u.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new Z(e);case"googleai":return new Y;default:throw new p(u.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
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
 */const A=new De("@firebase/vertexai");var C;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(C||(C={}));/**
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
 */const Ee={type:"text",languages:["en"]},J=[Ee,{type:"image"}],z=[Ee];class O{constructor(n,a,e){this.languageModelProvider=n,this.mode=a,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:J,expectedOutputs:z}},e&&(this.onDeviceParams=e,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=J),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=z)):this.onDeviceParams.createOptions={expectedInputs:J,expectedOutputs:z})}async isAvailable(n){var e;if(!this.mode)return A.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===T.ONLY_IN_CLOUD)return A.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const a=await((e=this.languageModelProvider)==null?void 0:e.availability(this.onDeviceParams.createOptions));if(this.mode===T.ONLY_ON_DEVICE){if(a===C.UNAVAILABLE)throw new p(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(a===C.DOWNLOADABLE||a===C.DOWNLOADING){A.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(s){throw new p(u.ERROR,s.message)}return!0}return!0}return a!==C.AVAILABLE?(A.debug(`On-device inference unavailable because availability is "${a}".`),!1):O.isOnDeviceRequest(n)?!0:(A.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(n){const a=await this.createSession(),e=await Promise.all(n.contents.map(O.toLanguageModelMessage)),s=await a.prompt(e,this.onDeviceParams.promptOptions);return O.toResponse(s)}async generateContentStream(n){const a=await this.createSession(),e=await Promise.all(n.contents.map(O.toLanguageModelMessage)),s=a.promptStreaming(e,this.onDeviceParams.promptOptions);return O.toStreamResponse(s)}async countTokens(n){throw new p(u.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(n){if(n.contents.length===0)return A.debug("Empty prompt rejected for on-device inference."),!1;for(const a of n.contents){if(a.role==="function")return A.debug('"Function" role rejected for on-device inference.'),!1;for(const e of a.parts)if(e.inlineData&&O.SUPPORTED_MIME_TYPES.indexOf(e.inlineData.mimeType)===-1)return A.debug(`Unsupported mime type "${e.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(n){var e;const a=await((e=this.languageModelProvider)==null?void 0:e.availability(this.onDeviceParams.createOptions));return(a===C.DOWNLOADABLE||a===C.DOWNLOADING)&&this.download(n),a}download(n){var e;if(this.downloadPromise)return;const a={...this.onDeviceParams.createOptions};a&&!a.monitor&&n&&(a.monitor=s=>{s.addEventListener("downloadprogress",i=>{n(i.loaded)})}),this.downloadPromise=(e=this.languageModelProvider)==null?void 0:e.create(a).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(n){const a=await Promise.all(n.parts.map(O.toLanguageModelMessageContent));return{role:O.toLanguageModelMessageRole(n.role),content:a}}static async toLanguageModelMessageContent(n){if(n.text)return{type:"text",value:n.text};if(n.inlineData){const e=await(await fetch(`data:${n.inlineData.mimeType};base64,${n.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(e)}}throw new p(u.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(n){return n==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new p(u.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const n=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=n,n}static toResponse(n){return{json:async()=>({candidates:[{content:{parts:[{text:n}]}}]})}}static toStreamResponse(n){const a=new TextEncoder;return{body:n.pipeThrough(new TransformStream({transform(e,s){const i=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:e}]}}]});s.enqueue(a.encode(`data: ${i}

`))}}))}}}O.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function Xe(t,n,a){if(typeof n<"u"&&t)return new O(n.LanguageModel,t,a)}/**
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
 */class Qe{constructor(n,a,e,s,i){this.app=n,this.backend=a,this.chromeAdapterFactory=i;const o=s==null?void 0:s.getImmediate({optional:!0}),r=e==null?void 0:e.getImmediate({optional:!0});this.auth=r||null,this.appCheck=o||null,a instanceof Z?this.location=a.location:this.location=""}_delete(){return Promise.resolve()}set options(n){this._options=n}get options(){return this._options}}/**
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
 */function Ze(t,{instanceIdentifier:n}){if(!n)throw new p(u.ERROR,"AIService instance identifier is undefined.");const a=We(n),e=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),i=t.getProvider("app-check-internal");return new Qe(e,a,s,i,Xe)}/**
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
 */function et(t){var a,e,s,i,o,r,l;if((e=(a=t.app)==null?void 0:a.options)!=null&&e.apiKey)if((i=(s=t.app)==null?void 0:s.options)!=null&&i.projectId){if(!((r=(o=t.app)==null?void 0:o.options)!=null&&r.appId))throw new p(u.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new p(u.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new p(u.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const n={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,location:t.location,backend:t.backend};if(Ge(t.app)&&t.app.settings.appCheckToken){const d=t.app.settings.appCheckToken;n.getAppCheckToken=()=>Promise.resolve({token:d})}else t.appCheck&&((l=t.options)!=null&&l.useLimitedUseAppCheckTokens?n.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():n.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(n.getAuthToken=()=>t.auth.getToken()),n}/**
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
 */class U{constructor(n,a){this._apiSettings=et(n),this.model=U.normalizeModelName(a,this._apiSettings.backend.backendType)}static normalizeModelName(n,a){return a===I.GOOGLE_AI?U.normalizeGoogleAIModelName(n):U.normalizeVertexAIModelName(n)}static normalizeGoogleAIModelName(n){return`models/${n}`}static normalizeVertexAIModelName(n){let a;return n.includes("/")?n.startsWith("models/")?a=`publishers/google/${n}`:a=n:a=`publishers/google/models/${n}`,a}}/**
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
 */const tt="Timeout has expired.",W="AbortError";class nt{constructor(n){this.params=n}toString(){const n=new URL(this.baseUrl);return n.pathname=this.pathname,n.search=this.queryParams.toString(),n.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var n;return((n=this.params.singleRequestOptions)==null?void 0:n.baseUrl)??`https://${He}`}get queryParams(){const n=new URLSearchParams;return this.params.stream&&n.set("alt","sse"),n}}function at(t){const n=[];return n.push(`${qe}/${ce}`),n.push(`fire/${ce}`),(t.params.apiSettings.inferenceMode===T.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===T.PREFER_IN_CLOUD)&&n.push(Ke),n.join(" ")}async function st(t){const n=new Headers;if(n.append("Content-Type","application/json"),n.append("x-goog-api-client",at(t)),n.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&n.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const a=await t.params.apiSettings.getAppCheckToken();a&&(n.append("X-Firebase-AppCheck",a.token),a.error&&A.warn(`Unable to obtain a valid App Check token: ${a.error.message}`))}if(t.params.apiSettings.getAuthToken){const a=await t.params.apiSettings.getAuthToken();a&&n.append("Authorization",`Firebase ${a.accessToken}`)}return n}async function ee(t,n){var d,y;const a=new nt(t);let e;const s=(d=t.singleRequestOptions)==null?void 0:d.signal,i=((y=t.singleRequestOptions)==null?void 0:y.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:Ye,o=new AbortController,r=setTimeout(()=>{o.abort(new DOMException(tt,W)),A.debug(`Aborting request to ${a} due to timeout (${i}ms)`)},i),l=AbortSignal.any(s?[s,o.signal]:[o.signal]);if(s&&s.aborted)throw clearTimeout(r),new DOMException(s.reason??"Aborted externally before fetch",W);try{const f={method:"POST",headers:await st(a),signal:l,body:n};if(e=await fetch(a.toString(),f),!e.ok){let E="",m;try{const b=await e.json();E=b.error.message,b.error.details&&(E+=` ${JSON.stringify(b.error.details)}`,m=b.error.details)}catch{}throw e.status===403&&m&&m.some(b=>b.reason==="SERVICE_DISABLED")&&m.some(b=>{var _,c;return(c=(_=b.links)==null?void 0:_[0])==null?void 0:c.description.includes("Google developers console API activation")})?new p(u.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${a.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:e.status,statusText:e.statusText,errorDetails:m}):new p(u.FETCH_ERROR,`Error fetching from ${a}: [${e.status} ${e.statusText}] ${E}`,{status:e.status,statusText:e.statusText,errorDetails:m})}}catch(f){let E=f;throw f.code!==u.FETCH_ERROR&&f.code!==u.API_NOT_ENABLED&&f instanceof Error&&f.name!==W&&(E=new p(u.ERROR,`Error fetching from ${a.toString()}: ${f.message}`),E.stack=f.stack),E}finally{clearTimeout(r)}return e}/**
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
 */function V(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&A.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),we(t.candidates[0]))throw new p(u.RESPONSE_ERROR,`Response error: ${x(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function K(t,n=N.IN_CLOUD){t.candidates&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0);const a=it(t);return a.inferenceSource=n,a}function it(t){return t.text=()=>{if(V(t))return de(t,n=>!n.thought);if(t.promptFeedback)throw new p(u.RESPONSE_ERROR,`Text not available. ${x(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(V(t)){const n=de(t,a=>!!a.thought);return n===""?void 0:n}else if(t.promptFeedback)throw new p(u.RESPONSE_ERROR,`Thought summary not available. ${x(t)}`,{response:t})},t.inlineDataParts=()=>{if(V(t))return ot(t);if(t.promptFeedback)throw new p(u.RESPONSE_ERROR,`Data not available. ${x(t)}`,{response:t})},t.functionCalls=()=>{if(V(t))return Ae(t);if(t.promptFeedback)throw new p(u.RESPONSE_ERROR,`Function call not available. ${x(t)}`,{response:t})},t}function de(t,n){var e,s,i,o;const a=[];if((s=(e=t.candidates)==null?void 0:e[0].content)!=null&&s.parts)for(const r of(o=(i=t.candidates)==null?void 0:i[0].content)==null?void 0:o.parts)r.text&&n(r)&&a.push(r.text);return a.length>0?a.join(""):""}function Ae(t){var a,e,s,i;if(!t)return;const n=[];if((e=(a=t.candidates)==null?void 0:a[0].content)!=null&&e.parts)for(const o of(i=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:i.parts)o.functionCall&&n.push(o.functionCall);if(n.length>0)return n}function ot(t){var a,e,s,i;const n=[];if((e=(a=t.candidates)==null?void 0:a[0].content)!=null&&e.parts)for(const o of(i=(s=t.candidates)==null?void 0:s[0].content)==null?void 0:i.parts)o.inlineData&&n.push(o);if(n.length>0)return n}const rt=[w.RECITATION,w.SAFETY,w.BLOCKLIST,w.PROHIBITED_CONTENT,w.SPII,w.MALFORMED_FUNCTION_CALL,w.IMAGE_SAFETY,w.IMAGE_PROHIBITED_CONTENT,w.IMAGE_OTHER,w.NO_IMAGE,w.IMAGE_RECITATION,w.LANGUAGE,w.UNEXPECTED_TOOL_CALL,w.TOO_MANY_TOOL_CALLS,w.MISSING_THOUGHT_SIGNATURE,w.MALFORMED_RESPONSE];function we(t){return!!t.finishReason&&rt.some(n=>n===t.finishReason)}function x(t){var a,e,s;let n="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)n+="Response was blocked",(a=t.promptFeedback)!=null&&a.blockReason&&(n+=` due to ${t.promptFeedback.blockReason}`),(e=t.promptFeedback)!=null&&e.blockReasonMessage&&(n+=`: ${t.promptFeedback.blockReasonMessage}`);else if((s=t.candidates)!=null&&s[0]){const i=t.candidates[0];we(i)&&(n+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(n+=`: ${i.finishMessage}`))}return n}/**
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
 */function Se(t){var n,a;if((n=t.safetySettings)==null||n.forEach(e=>{if(e.method)throw new p(u.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(a=t.generationConfig)!=null&&a.topK){const e=Math.round(t.generationConfig.topK);e!==t.generationConfig.topK&&(A.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=e)}return t}function te(t){return{candidates:t.candidates?lt(t.candidates):void 0,prompt:t.promptFeedback?dt(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function ct(t,n){return{generateContentRequest:{model:n,...t}}}function lt(t){const n=[];let a;return n&&t.forEach(e=>{var o,r;let s;if(e.citationMetadata&&(s={citations:e.citationMetadata.citationSources}),e.safetyRatings&&(a=e.safetyRatings.map(l=>({...l,severity:l.severity??ye.HARM_SEVERITY_UNSUPPORTED,probabilityScore:l.probabilityScore??0,severityScore:l.severityScore??0}))),(r=(o=e.content)==null?void 0:o.parts)!=null&&r.some(l=>l==null?void 0:l.videoMetadata))throw new p(u.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const i={index:e.index,content:e.content,finishReason:e.finishReason,finishMessage:e.finishMessage,safetyRatings:a,citationMetadata:s,groundingMetadata:e.groundingMetadata,urlContextMetadata:e.urlContextMetadata};n.push(i)}),n}function dt(t){const n=[];return t.safetyRatings.forEach(e=>{n.push({category:e.category,probability:e.probability,severity:e.severity??ye.HARM_SEVERITY_UNSUPPORTED,probabilityScore:e.probabilityScore??0,severityScore:e.severityScore??0,blocked:e.blocked})}),{blockReason:t.blockReason,safetyRatings:n,blockReasonMessage:t.blockReasonMessage}}/**
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
 */const ue=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function ut(t,n,a){const e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),s=mt(e),[i,o]=s.tee(),{response:r,firstValue:l}=await pt(o,n,a);return{stream:ft(i,n,a),response:r,firstValue:l}}async function pt(t,n,a){const[e,s]=t.tee(),i=e.getReader(),{value:o}=await i.read();return{firstValue:o,response:ht(s,n,a)}}async function ht(t,n,a){const e=[],s=t.getReader();for(;;){const{done:i,value:o}=await s.read();if(i){let r=gt(e);return n.backend.backendType===I.GOOGLE_AI&&(r=te(r)),K(r,a)}e.push(o)}}async function*ft(t,n,a){var s,i;const e=t.getReader();for(;;){const{value:o,done:r}=await e.read();if(r)break;let l;n.backend.backendType===I.GOOGLE_AI?l=K(te(o),a):l=K(o,a);const d=(s=l.candidates)==null?void 0:s[0];!((i=d==null?void 0:d.content)!=null&&i.parts)&&!(d!=null&&d.finishReason)&&!(d!=null&&d.citationMetadata)&&!(d!=null&&d.urlContextMetadata)||(yield l)}}function mt(t){const n=t.getReader();return new ReadableStream({start(e){let s="";return i();function i(){return n.read().then(({value:o,done:r})=>{if(r){if(s.trim()){e.error(new p(u.PARSE_FAILED,"Failed to parse stream"));return}e.close();return}s+=o;let l=s.match(ue),d;for(;l;){try{d=JSON.parse(l[1])}catch{e.error(new p(u.PARSE_FAILED,`Error parsing JSON response: "${l[1]}`));return}e.enqueue(d),s=s.substring(l[0].length),l=s.match(ue)}return i()})}}})}function gt(t){const n=t[t.length-1],a={promptFeedback:n==null?void 0:n.promptFeedback};for(const e of t)if(e.candidates)for(const s of e.candidates){const i=s.index||0;a.candidates||(a.candidates=[]),a.candidates[i]||(a.candidates[i]={index:s.index}),a.candidates[i].citationMetadata=s.citationMetadata,a.candidates[i].finishReason=s.finishReason,a.candidates[i].finishMessage=s.finishMessage,a.candidates[i].safetyRatings=s.safetyRatings,a.candidates[i].groundingMetadata=s.groundingMetadata;const o=s.urlContextMetadata;if(typeof o=="object"&&o!==null&&Object.keys(o).length>0&&(a.candidates[i].urlContextMetadata=o),s.content){if(!s.content.parts)continue;a.candidates[i].content||(a.candidates[i].content={role:s.content.role||"user",parts:[]});for(const r of s.content.parts){const l={...r};r.text!==""&&Object.keys(l).length>0&&a.candidates[i].content.parts.push(l)}}}return a}/**
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
 */const yt=[u.FETCH_ERROR,u.ERROR,u.API_NOT_ENABLED];async function ve(t,n,a,e){if(!n)return{response:await e(),inferenceSource:N.IN_CLOUD};switch(n.mode){case T.ONLY_ON_DEVICE:if(await n.isAvailable(t))return{response:await a(),inferenceSource:N.ON_DEVICE};throw new p(u.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case T.ONLY_IN_CLOUD:return{response:await e(),inferenceSource:N.IN_CLOUD};case T.PREFER_IN_CLOUD:try{return{response:await e(),inferenceSource:N.IN_CLOUD}}catch(s){if(s instanceof p&&yt.includes(s.code)&&await n.isAvailable(t))return{response:await a(),inferenceSource:N.ON_DEVICE};throw s}case T.PREFER_ON_DEVICE:return await n.isAvailable(t)?{response:await a(),inferenceSource:N.ON_DEVICE}:{response:await e(),inferenceSource:N.IN_CLOUD};default:throw new p(u.ERROR,`Unexpected infererence mode: ${n.mode}`)}}/**
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
 */async function bt(t,n,a,e){return t.backend.backendType===I.GOOGLE_AI&&(a=Se(a)),ee({task:"streamGenerateContent",model:n,apiSettings:t,stream:!0,singleRequestOptions:e},JSON.stringify(a))}async function Oe(t,n,a,e,s){const i=await ve(a,e,()=>e.generateContentStream(a),()=>bt(t,n,a,s));return ut(i.response,t,i.inferenceSource)}async function Et(t,n,a,e){return t.backend.backendType===I.GOOGLE_AI&&(a=Se(a)),ee({model:n,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:e},JSON.stringify(a))}async function Te(t,n,a,e,s){const i=await ve(a,e,()=>e.generateContent(a),()=>Et(t,n,a,s)),o=await At(i.response,t);return{response:K(o,i.inferenceSource)}}async function At(t,n){const a=await t.json();return n.backend.backendType===I.GOOGLE_AI?te(a):a}/**
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
 */function Ce(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function j(t){let n=[];if(typeof t=="string")n=[{text:t}];else for(const a of t)typeof a=="string"?n.push({text:a}):n.push(a);return wt(n)}function wt(t){const n={role:"user",parts:[]},a={role:"function",parts:[]};let e=!1,s=!1;for(const i of t)"functionResponse"in i?(a.parts.push(i),s=!0):(n.parts.push(i),e=!0);if(e&&s)throw new p(u.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!e&&!s)throw new p(u.INVALID_CONTENT,"No Content is provided for sending chat message.");return e?n:a}function X(t){let n;return t.contents?n=t:n={contents:[j(t)]},t.systemInstruction&&(n.systemInstruction=Ce(t.systemInstruction)),n}/**
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
 */const pe="SILENT_ERROR",he=10;class St{constructor(n,a,e){this.params=a,this.requestOptions=e,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=n}async getHistory(){return await this._sendPromise,this._history}async _sendMessage(n,a){let e={};await this._sendPromise;const s=[];return this._sendPromise=this._sendPromise.then(async()=>{var l,d,y;let i,o=0;const r=((l=this.requestOptions)==null?void 0:l.maxSequentialFunctionCalls)??he;do{let f;if(i){o++;const b=await this._callFunctionsAsNeeded(i);f=j(b)}else f=j(n);const E=this._formatRequest(f,[...s]);s.push(f);const m=await this._callGenerateContent(E,a);if(m)if(e=m,i=this._getCallableFunctionCalls(m.response),m.response.candidates&&m.response.candidates.length>0){const b={parts:((d=m.response.candidates)==null?void 0:d[0].content.parts)||[],role:((y=m.response.candidates)==null?void 0:y[0].content.role)||"model"};s.push(b)}else{const b=x(m.response);b&&A.warn(`sendMessage() was unsuccessful. ${b}. Inspect response object for details.`)}else i=void 0}while(i&&o<r);i&&o>=r&&A.warn(`Automatic function calling exceeded the limit of ${r} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(s),e}async _sendMessageStream(n,a){await this._sendPromise;const e=[],i=(async()=>{var y;let o,r=0;const l=((y=this.requestOptions)==null?void 0:y.maxSequentialFunctionCalls)??he;let d;do{let f;if(o){r++;const m=await this._callFunctionsAsNeeded(o);f=j(m)}else f=j(n);const E=this._formatRequest(f,[...e]);if(e.push(f),d=await this._callGenerateContentStream(E,a),o=this._getCallableFunctionCalls(d.firstValue),o&&d.firstValue&&d.firstValue.candidates&&d.firstValue.candidates.length>0){const m={...d.firstValue.candidates[0].content};m.role||(m.role="model"),e.push(m)}}while(o&&r<l);return o&&r>=l&&A.warn(`Automatic function calling exceeded the limit of ${l} function calls. Returning last model response.`),{stream:d.stream,response:d.response}})();return this._sendPromise=this._sendPromise.then(async()=>i).catch(o=>{throw new Error(pe)}).then(o=>o.response).then(o=>{if(o.candidates&&o.candidates.length>0){this._history=this._history.concat(e);const r={...o.candidates[0].content};r.role||(r.role="model"),this._history.push(r)}else{const r=x(o);r&&A.warn(`sendMessageStream() was unsuccessful. ${r}. Inspect response object for details.`)}}).catch(o=>{o.message!==pe&&o.name!=="AbortError"&&A.error(o)}),i}_getCallableFunctionCalls(n){var s,i,o;const a=(i=(s=this.params)==null?void 0:s.tools)==null?void 0:i.find(r=>r.functionDeclarations);if(!(a!=null&&a.functionDeclarations))return;const e=Ae(n);if(e){for(const r of e)if(!((o=a.functionDeclarations)==null?void 0:o.some(d=>d.name===r.name&&typeof d.functionReference=="function")))return;return e}}async _callFunctionsAsNeeded(n){var i,o;const a=[],e=[],s=(o=(i=this.params)==null?void 0:i.tools)==null?void 0:o.find(r=>r.functionDeclarations);if(s&&s.functionDeclarations){for(const l of n){const d=s.functionDeclarations.find(y=>y.name===l.name);if(d!=null&&d.functionReference){const y=Promise.resolve(d.functionReference(l.args)).catch(f=>{const E=new p(u.ERROR,`Error in user-defined function "${d.name}": ${f.message}`);throw E.stack=f.stack,E});a.push({name:l.name,id:l.id,results:y}),e.push(y)}}await Promise.all(e);const r=[];for(const{name:l,id:d,results:y}of a){const f={name:l,response:await y};d&&(f.id=d),r.push({functionResponse:f})}return r}else throw new p(u.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
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
 */const fe=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],vt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},me={user:["model"],function:["model"],model:["user","function"],system:[]};function Ot(t){let n=null;for(const a of t){const{role:e,parts:s}=a;if(!n&&e!=="user")throw new p(u.INVALID_CONTENT,`First Content should be with role 'user', got ${e}`);if(!le.includes(e))throw new p(u.INVALID_CONTENT,`Each item should include role field. Got ${e} but valid roles are: ${JSON.stringify(le)}`);if(!Array.isArray(s))throw new p(u.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(s.length===0)throw new p(u.INVALID_CONTENT,"Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,executableCode:0,codeExecutionResult:0};for(const r of s)for(const l of fe)l in r&&(i[l]+=1);const o=vt[e];for(const r of fe)if(!o.includes(r)&&i[r]>0)throw new p(u.INVALID_CONTENT,`Content with role '${e}' can't contain '${r}' part`);if(n&&!me[e].includes(n.role))throw new p(u.INVALID_CONTENT,`Content with role '${e}' can't follow '${n.role}'. Valid previous roles: ${JSON.stringify(me)}`);n=a}}/**
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
 */class Tt extends St{constructor(n,a,e,s,i){super(n,s,i),this.model=a,this.chromeAdapter=e,this.params=s,this.requestOptions=i,s!=null&&s.history&&(Ot(s.history),this._history=s.history)}_formatRequest(n,a){var e,s,i,o,r;return{safetySettings:(e=this.params)==null?void 0:e.safetySettings,generationConfig:(s=this.params)==null?void 0:s.generationConfig,tools:(i=this.params)==null?void 0:i.tools,toolConfig:(o=this.params)==null?void 0:o.toolConfig,systemInstruction:(r=this.params)==null?void 0:r.systemInstruction,contents:[...this._history,...a,n]}}_callGenerateContent(n,a){return Te(this._apiSettings,this.model,n,this.chromeAdapter,{...this.requestOptions,...a})}_callGenerateContentStream(n,a){return Oe(this._apiSettings,this.model,n,this.chromeAdapter,{...this.requestOptions,...a})}async sendMessage(n,a){return this._sendMessage(n,a)}async sendMessageStream(n,a){return this._sendMessageStream(n,a)}}/**
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
 */async function Ct(t,n,a,e){let s="";if(t.backend.backendType===I.GOOGLE_AI){const o=ct(a,n);s=JSON.stringify(o)}else s=JSON.stringify(a);return(await ee({model:n,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:e},s)).json()}async function It(t,n,a,e,s){if((e==null?void 0:e.mode)===T.ONLY_ON_DEVICE)throw new p(u.UNSUPPORTED,"countTokens() is not supported for on-device models.");return Ct(t,n,a,s)}/**
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
 */class Rt extends U{constructor(n,a,e,s){super(n,a.model),this.chromeAdapter=s,this.generationConfig=a.generationConfig||{},Nt(this.generationConfig),this.safetySettings=a.safetySettings||[],this.tools=a.tools,this.toolConfig=a.toolConfig,this.systemInstruction=Ce(a.systemInstruction),this.requestOptions=e||{}}async initializeDeviceModel(n){if(!this.chromeAdapter||this.chromeAdapter.mode===T.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(n)===C.UNAVAILABLE){const e=new p(u.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===T.ONLY_ON_DEVICE)throw e;A.debug(e.message)}await this.chromeAdapter.downloadPromise}async generateContent(n,a){const e=X(n);return Te(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...e},this.chromeAdapter,{...this.requestOptions,...a})}async generateContentStream(n,a){const e=X(n),{stream:s,response:i}=await Oe(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...e},this.chromeAdapter,{...this.requestOptions,...a});return{stream:s,response:i}}startChat(n){return new Tt(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...n},this.requestOptions)}async countTokens(n,a){const e=X(n);return It(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...a})}}function Nt(t){var n,a;if(((n=t.thinkingConfig)==null?void 0:n.thinkingBudget)!=null&&((a=t.thinkingConfig)!=null&&a.thinkingLevel))throw new p(u.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new p(u.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json")throw new p(u.UNSUPPORTED,'responseMimeType must be set to "application/json" if responseSchema or responseJsonSchema are set.')}/**
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
 */function _t(t=$e(),n){t=je(t);const a=Ue(t,D),e=(n==null?void 0:n.backend)??new Y,s={useLimitedUseAppCheckTokens:(n==null?void 0:n.useLimitedUseAppCheckTokens)??!1},i=ze(e),o=a.getImmediate({identifier:i});return o.options=s,o}const Mt=["mode","onDeviceParams","inCloudParams"];function xt(t,n,a){var r;const e=n;let s;if(e.mode){for(const l of Object.keys(n))Mt.includes(l)||A.warn(`When a hybrid inference mode is specified (mode is currently set to ${e.mode}), "${l}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);s=e.inCloudParams||{model:Je}}else s=n;if(!s.model)throw new p(u.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const i=(r=t.chromeAdapterFactory)==null?void 0:r.call(t,e.mode,typeof window>"u"?void 0:window,e.onDeviceParams),o=new Rt(t,s,a,i);return o._apiSettings.inferenceMode=e.mode,o}function Pt(){Be(new Ve(D,Ze,"PUBLIC").setMultipleInstances(!0)),ie(oe,Q),ie(oe,Q,"esm2020")}Pt();const Lt=_t(Me,{backend:new Y}),kt="gemini-3.5-flash",ne=[{label:"Admissions",path:"/admission",keywords:["admission","apply","fee","fees","payment","tc","prospectus"]},{label:"Academics",path:"/academics",keywords:["academic","class","cbse","curriculum","exam","learning"]},{label:"News",path:"/news",keywords:["news","update","announcement"]},{label:"Events",path:"/events",keywords:["event","program","celebration"]},{label:"Achievements",path:"/achievements",keywords:["achievement","award","winner"]},{label:"Mandatory Disclosure",path:"/mandatory-public-disclosure",keywords:["disclosure","document","public","mandatory"]},{label:"Ansar Times",path:"/ansar-times",keywords:["magazine","newsletter","ansar times"]},{label:"Ansar Sprouts",path:"/ansar-sprouts",keywords:["sprouts","preschool","pre-kg","prekg","kindergarten","fly high","curio"]},{label:"Life at Ansar",path:"/life-at-ansar",keywords:["spc","student police","nss","national service","club","life at ansar"]},{label:"Learning Labs",path:"/learning/advanced-labs",keywords:["lab","laboratory","atl","robotics","coding","chemistry","biology","physics","computer","maths","home science"]},{label:"Field Trips",path:"/field-trips",keywords:["field trip","fieldtrip","educational visit","excursion","learning beyond classroom"]},{label:"Contact",path:"/contact",keywords:["contact","phone","email","location","address","whatsapp"]}],Dt=["Tell me about Ansar English School","Explain the school leadership","Guide me through this website","Guide me for admission"],Ft=["History: Ansar English School was founded in 1980/1982 as the flagship educational institution of Ansari Charitable Trust in Perumpilavu. It grew from a humble initiative into a respected CBSE Senior Secondary school in Kerala.","Milestones: Ansari Charitable Trust got registered in 1979. The school got registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, sent its first Class XII batch in 1992, received NABET accreditation in 2024, and marked 2026 as the Year of Sustainability.","Trust and service: The school is shaped by Ansari Charitable Trust, whose wider service ecosystem includes education, healthcare, social welfare, an orphanage, a special school, and women's education initiatives.","Scale: The campus serves over 4,600 students with 270+ educators/staff members and has 40+ years of service in value-based education.","Affiliation and accreditation: Ansar English School is affiliated with CBSE, New Delhi, and is NABET accredited. The site presents it as the first school in Thrissur accredited by NABET.","Facilities: a safe and secure CCTV-supported campus, future-ready learning spaces with smart boards, a dedicated support team, joyful play zone, experiential learning labs, Champions Arena, safe school transport, healthy dining spaces, ATL tinkering/innovation spaces, science and computer labs, language enrichment, exam preparation support, and a library with more than 34,000 books and learning resources.","Academic pathway: Ansar Sprouts for foundational early learning, Primary School for literacy/numeracy/environmental awareness, Middle School for concept clarity and analytical thinking, and Senior Secondary for subject depth, practical work, projects, and CBSE exam preparation.","Campus life: The school supports sports, arts, innovation, entrepreneurship, environmental stewardship, community engagement, Student Police Cadet, NSS, clubs, NIOS, life skills, leadership, and co-curricular programmes.","Value Integration: the curriculum integrates respect, empathy, responsibility, and perseverance into learning while promoting ethical behaviour, spiritual awareness, cultural appreciation, integrity, resilience, personal growth, and a purposeful contribution to society.","Faculty: Ansar English School has dedicated, well-educated, professionally trained teachers who provide a nurturing learning environment and serve as academic and personal mentors. The school invests continuously in CBSE-certified courses, online and offline workshops, school empowerment programmes, and other professional development opportunities.","Ansar Media and Production: An in-house media unit for photography, videography, drone videography, podcast production, graphic designing, editing, event documentation, social media creatives, reels, institutional presentations, and communication support for school activities.","Virtual tour: A 360 degree virtual campus tour is linked from the About page at https://www.p4panorama.com/360-virtual-tour/ansar-school/."].join(`
`),jt=["Ansar Sprouts: the preschool/foundational-stage section provides joyful, play-centred learning for young children in a safe, caring, stimulating environment. It develops curiosity, confidence, values, creativity, academic readiness, social-emotional foundations, and 21st-century skills in partnership with parents.","Sprouts policy and curriculum: the programme is aligned with NEP 2020 and the National Curriculum Framework for Foundational Stage 2022. It follows the Fly High curriculum developed by Vidya Council for Education. Fly 1 is for ages 3–4, Fly 2 is for ages 4–5, and Fly 3 is for ages 5–6. Touch Curio, Feel Curio, and Create Curio are common learning stages followed across all three Fly levels and years. The curriculum includes English, Mathematics, EVS, General Knowledge, Kaliveed (Malayalam), Rawdthee (Arabic), and Moral Science through rhymes, letters, numbers, language, exploration, values, and hands-on play.","Sprouts contact: +91 81298 51737. The Contact form lets visitors choose School or Ansar Sprouts and then opens the corresponding WhatsApp conversation. The general school number remains +91 81298 08051.","Sprouts bag-free concept: Ansar Sprouts reduces the weight kindergarten children carry and provides nutritious food at school. The parent-supported programme prioritizes health and comfort. Providing the same nourishment to every child, together with a common uniform, promotes equality, unity, integration, and belonging.","Sprouts extra-curricular activities include skating and cycling in a safe, encouraging atmosphere. Skating develops balance, discipline, confidence, activity, and joy. Cycling develops energy, strength, balance, stamina, confidence, and happiness.","Sprouts Computer Lab – Little Tech Explorer: in collaboration with the Cyber Square team, young children practise technology and early coding in a secure, engaging, age-appropriate environment. Activities develop basic computer skills, eye–hand coordination, logical thinking, safe digital exploration, and curiosity.","Sprouts Safe Play Area: the Joyful Play Zone is the dedicated KG-section outdoor park with safe, age-appropriate swings, slides, and a merry-go-round. It develops movement, balance, coordination, confidence, friendship, and joy. Other school sections have separate age-appropriate play areas. Images can be added later through the Joyful Play Zone carousel in the Student-Centric Learning admin module.","Sprouts has three additional dedicated facilities. The Learning Resource Center contains books, puzzles, and educational toys for structured learning through play. Smart Classrooms use smart TVs for guided early digital exposure, visual lessons, stories, rhymes, and concepts. The Art and Craft Room supports drawing, painting, cutting, pasting, imagination, fine-motor coordination, and creative expression.","Parental Support is a highlighted part of Ansar Sprouts. The preschool builds a close partnership among parents, teachers, and children through parent-teacher conferences, open-door interactions, parent-child learning activities, teacher home visits, classroom volunteering, school events, Moms in Classrooms, and parents serving as resource persons.","The Ansar Sprouts page includes its own specialized Activity Gallery, separate from the main school gallery. Published activity articles can include a title, category, date, description, and an automatic multi-image carousel managed from the Sprouts admin tab and stored in Google Sheets.","Ansar Sprouts observes special days through themed activities, performances, crafts, games, and hands-on experiences that build cultural, environmental, health, values, and national awareness. Class-wise themed Talent Days let every child showcase songs, dance, storytelling, role play, art, creativity, and imagination while building confidence and self-expression. Buttons in both sections lead to the Sprouts Activity Gallery.","Field Trips – Learning Beyond the Classroom: educational visits connect students with communities, places, people, nature, and real-life experiences. The formal Field Trips page categorizes published trips as Ansar Sprouts, Primary, Middle, Secondary, Senior Secondary, or General and presents trip details, destination, date, and photographs.","Student Police Cadet (SPC): a flagship programme at Ansar English School that builds discipline, leadership, confidence, teamwork, empathy, integrity, civic responsibility, physical fitness, emotional resilience, patriotism, and service. Activities include Joyful Kids, anti-drug awareness, road safety, social outreach, environmental conservation, disaster preparedness, and community welfare.","National Service Scheme (NSS): Unit SFU/3 at Ansar English School follows the motto “Not Me But You.” It develops selfless service, leadership, social responsibility, national integration, and environmental consciousness through outreach, conservation, health and awareness campaigns, disaster preparedness, social service, and volunteer projects.","Life at Ansar includes dedicated Clubs, NSS, and SPC sections with programme content and image carousels managed from the admin panel."].join(`
`),Ut=["Chairman: MAMMUNNI K K","Acting Chairman: V T ABDULLAH KOYA THANGAL","Vice Chairman: MOHAMMED K V","Secretary: E A KUNJAHAMMU","Assistant Secretary: SHAJU MOHAMEDUNNI","Trust/Managing Committee members listed on the website include NAJEEB P, MOHAMMED AMEEN E M, MOOSA V, NOOR MOHAMMED KAMALUDHEEN, MUHAMMED SHEREEF E V, ABDUL HAMEED, K K SHANAVAS, MOHAMED KUTTY KAYINGIL, ISMAIL KASIM, SHOUKATH ALI KOROTH, T A MOIDEEN ALIAS MOIDUTTY, M I ABDUL AZEEZ, A USMAN, ANWAR ABDUL MAJEED, MUJEEB RAHMAN P, Dr. MOHAMED BADEEUZZAMAN, Dr. MOHAMMED ALI MAMPPILLY (KOOTTIL), and P I NOUSHAD."].join(`
`);function $t(t=""){return String(t).replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function H(t="",n=220){const a=$t(t);return a.length>n?`${a.slice(0,n).trim()}...`:a}function F(t,n){return t.filter(a=>a&&a.published!==!1).slice(0,6).map(a=>n.map(e=>a[e]).filter(Boolean).join(" - ")).filter(Boolean).join(`
`)}function k(t){var a,e;const n=Date.parse(t==null?void 0:t.date);return Number.isNaN(n)?(a=t==null?void 0:t.createdAt)!=null&&a.toMillis?t.createdAt.toMillis():(e=t==null?void 0:t.createdAt)!=null&&e.seconds?t.createdAt.seconds*1e3:Number.MIN_SAFE_INTEGER:n}function Gt({settings:t,updates:n,achievements:a,disclosures:e,ansarTimes:s,pages:i,leadership:o,learningLabs:r}){const l=n.filter(c=>c.published!==!1&&(c.category==="News"||!c.category)).sort((c,S)=>k(S)-k(c)),d=n.filter(c=>c.published!==!1&&c.category==="Events").sort((c,S)=>k(S)-k(c)),y=[...a].sort((c,S)=>k(S)-k(c)),f=i.filter(c=>(c==null?void 0:c.published)!==!1).slice(0,8).map(c=>`${c.title||c.slug}: ${H(c.bodyHtml||c.content||c.description,180)}`).join(`
`),E=o.filter(c=>(c==null?void 0:c.published)!==!1).slice(0,14).map(c=>[c.role||c.section,c.name,c.qualification||c.qualifications].filter(Boolean).join(" - ")).filter(Boolean).join(`
`),m=Array.isArray(t==null?void 0:t.juniorPrincipals)?t.juniorPrincipals.filter(c=>(c==null?void 0:c.name)||(c==null?void 0:c.section)).map(c=>[c.section||"Junior Principal",c.name,c.qualification||c.qualifications].filter(Boolean).join(" - ")).join(`
`):"",_=Le.map(c=>({...c,...r.find(S=>S.id===c.slug||S.slug===c.slug)||{}})).map(c=>`${c.title}: ${H(c.description,260)}`).join(`
`);return["School: Ansar English School, Perumpilavu, Thrissur, Kerala. CBSE-affiliated and NABET accredited.",Ft,jt,Ut,"Contact: School phone +91 81298 08051. Ansar Sprouts phone +91 81298 51737. Email hr@ansar.in. Address Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519.","Admission: Applications are open annually from Jan 01 to March 31. Above LKG requires a language proficiency and diagnostic assessment. Admission and payment portal: https://ansartrust.atcampussolutions.com/school/.",`Fee structure: ${(t==null?void 0:t.feeStructureTitle)||"Fee Structure"} - ${(t==null?void 0:t.feeStructurePdfUrl)||"available on the Admission page"}.`,`Vision: ${H(t==null?void 0:t.visionText,240)}`,`Mission: ${H(t==null?void 0:t.missionText,360)}`,`Director: ${(t==null?void 0:t.directorName)||"Dr. Najeeb Mohamad"} ${(t==null?void 0:t.directorQualifications)||""}.`,`Principal: ${(t==null?void 0:t.principalName)||"Ms. Sajidha Razak"} ${(t==null?void 0:t.principalQualifications)||""}.`,`Leadership and staff from admin/settings:
${E||m||"Director, Principal, Junior Principals, teachers, and support staff are represented on the website/admin panel."}`,`Junior Principals from settings:
${m||"Junior principal details are available on the home page when configured."}`,`News by date:
${F(l,["date","title","description"])||"No published news currently loaded."}`,`Events by date:
${F(d,["date","title","description"])||"No published events currently loaded."}`,`Achievements:
${F(y,["date","title","studentName","description"])||"No published achievements currently loaded."}`,`Public disclosure documents:
${F(e,["section","title"])||"No public disclosure documents currently loaded."}`,`Ansar Times:
${F(s,["year","month"])||"No magazine issues currently loaded."}`,`Admin-managed pages:
${f||"No extra admin pages currently loaded."}`,`Experiential Learning Labs:
${_}`,`Navigation map: ${ne.map(c=>`${c.label}=${c.path}`).join(", ")}, Ansar Media and Production=/ansar-media-production, Sports=/sports-page, ATL=/atl, Ansar Sprouts=/ansar-sprouts, Life at Ansar=/life-at-ansar.`].join(`

`)}function Ie(t){const n=t.toLowerCase();return ne.filter(a=>a.keywords.some(e=>n.includes(e))).slice(0,3)}function Bt(t){const n=t.toLowerCase();return["institution","school","ansar","about","history","leader","leadership","principal","director","trust","trustee","website","site","navigate","facilities","campus","sprouts","preschool","spc","nss","lab"].some(a=>n.includes(a))}function ge(t,n){const a=Ie(t),e=t.toLowerCase();return e.includes("sprouts")&&(e.includes("contact")||e.includes("phone")||e.includes("whatsapp")||e.includes("number"))?"You can contact Ansar Sprouts Preschool at +91 81298 51737. On the Contact page, choose “Ansar Sprouts” before submitting and the prepared enquiry will open in WhatsApp for that number.":e.includes("contact")||e.includes("phone")||e.includes("email")||e.includes("location")?"You can contact Ansar English School at +91 81298 08051, Ansar Sprouts Preschool at +91 81298 51737, or email hr@ansar.in. The campus is at Perumpilavu, Karikkad P.O, Thrissur, Kerala - 680519. The Contact form lets you choose School or Ansar Sprouts before continuing to WhatsApp.":e.includes("bag-free")||e.includes("bag free")||e.includes("sprouts")&&(e.includes("food")||e.includes("meal")||e.includes("bag"))?"Ansar Sprouts follows a parent-supported bag-free concept that reduces the weight kindergarten children carry and provides nutritious food at school. Giving every child the same nourishment, together with a common uniform, supports health, comfort, equality, unity, integration, and a shared sense of belonging.":e.includes("skating")||e.includes("cycling")?"Ansar Sprouts offers skating and cycling as joyful extra-curricular activities in a safe and encouraging atmosphere. Skating helps children develop balance, discipline, confidence, and active coordination. Cycling builds energy, strength, stamina, balance, confidence, and happiness.":e.includes("cyber square")||e.includes("sprouts")&&(e.includes("computer")||e.includes("coding")||e.includes("technology"))?"The Ansar Sprouts Computer Lab programme, Little Tech Explorer, is conducted with the Cyber Square team. Young children explore computers and early coding through secure, engaging, age-appropriate activities that develop basic digital skills, eye–hand coordination, logical thinking, safe technology habits, and curiosity.":e.includes("joyful play")||e.includes("safe play")||e.includes("sprouts")&&(e.includes("park")||e.includes("play area")||e.includes("swing")||e.includes("slide"))?"The Joyful Play Zone is the dedicated Ansar Sprouts KG-section outdoor park. It has safe, age-appropriate equipment such as swings, slides, and a merry-go-round, supporting balance, coordination, confidence, friendship, and joyful movement. Other school sections have their own age-appropriate play areas. Open the Joyful Play Zone page for details and photographs.":e.includes("resource center")||e.includes("resource centre")||e.includes("art and craft")||e.includes("art & craft")||e.includes("sprouts")&&(e.includes("smart classroom")||e.includes("facilities"))?"Ansar Sprouts has three dedicated learning facilities: a Learning Resource Center with books, puzzles, and educational toys for structured learning through play; Smart Classrooms equipped with smart TVs for age-appropriate digital learning; and an Art and Craft Room where children develop creativity through drawing, painting, cutting, and pasting.":e.includes("field trip")||e.includes("fieldtrip")||e.includes("educational visit")||e.includes("excursion")?"Ansar’s Field Trips page presents learning beyond the classroom through categorized educational visits for Ansar Sprouts, Primary, Middle, Secondary, Senior Secondary, and General groups. Each published trip can include its date, destination, description, and photo carousel. Open /field-trips to explore the journeys.":e.includes("parental support")||e.includes("moms in classroom")||e.includes("sprouts")&&e.includes("parents")?"Ansar Sprouts treats parental involvement as an essential partnership in every child's education. Families participate through parent-teacher conferences, open-door interactions, parent-child learning activities, teacher home visits, classroom and event volunteering, Moms in Classrooms, and opportunities to serve as resource persons.":e.includes("sprouts")||e.includes("preschool")||e.includes("pre-kg")||e.includes("prekg")||e.includes("fly high")||e.includes("curio")?"Ansar Sprouts is the school’s joyful preschool and foundational-stage programme. It follows an NEP 2020-aligned Fly High curriculum developed by Vidya Council for Education: Fly 1 for ages 3–4, Fly 2 for ages 4–5, and Fly 3 for ages 5–6. Touch Curio, Feel Curio, and Create Curio are common learning stages across all three levels. Learning areas include English, Mathematics, EVS, General Knowledge, Kaliveed (Malayalam), Rawdthee (Arabic), and Moral Science through exploration, creativity, values, and play. Visit the Ansar Sprouts page for the complete programme and contact +91 81298 51737 for enquiries.":e.includes("spc")||e.includes("student police")?"The Student Police Cadet programme at Ansar English School develops discipline, leadership, teamwork, empathy, integrity, civic responsibility, fitness, resilience, and service. Cadets participate in Joyful Kids, anti-drug awareness, road safety, environmental work, disaster preparedness, outreach, and community-welfare activities. Photos and details are available on the Life at Ansar page.":e.includes("nss")||e.includes("national service")?"Ansar English School’s National Service Scheme is Unit SFU/3 and follows the motto “Not Me But You.” It builds selfless service, leadership, social responsibility, national integration, and environmental awareness through outreach, conservation, health campaigns, social service, disaster preparedness, and volunteer projects. Open Life at Ansar for the complete section.":e.includes("admission")||e.includes("fee")||e.includes("payment")?"For admissions, visit the Admission page. Applications are open annually from Jan 01 to March 31, and fee details are available there. The online admission and payment portal is also linked from that page.":e.includes("history")||e.includes("founded")||e.includes("started")||e.includes("trust")?"Ansar English School is the flagship educational institution of Ansari Charitable Trust in Perumpilavu, Thrissur. The Trust was registered in 1979, the school was registered in 1982, received CBSE affiliation in 1988, became Senior Secondary in 1990, and received NABET accreditation in 2024. The institution presents itself as a value-based CBSE school with a strong focus on academics, discipline, student development, facilities, community service, and sustainable growth. You can open the About page for the full timeline, trustee details, and institutional profile.":e.includes("faculty")||e.includes("teacher training")||e.includes("professional development")||e.includes("educators")?"Ansar English School has a dedicated team of well-educated and professionally trained teachers who create a nurturing environment and serve as academic and personal mentors. The school continuously strengthens faculty expertise through CBSE-certified courses, online and offline workshops, school empowerment programmes, and other professional-development opportunities. More details are presented on the About page.":e.includes("value integration")||e.includes("core values")||e.includes("moral growth")||e.includes("ethical behaviour")?"Value Integration at Ansar connects academic learning with respect, empathy, responsibility, perseverance, ethical behaviour, spiritual awareness, and cultural appreciation. This whole-child approach helps students develop integrity, compassion, resilience, and purpose so they can navigate challenges and contribute positively to society. The complete highlight is available on the About page.":e.includes("leader")||e.includes("principal")||e.includes("director")||e.includes("staff")?"The school leadership shown on the website includes the Director, Principal, Junior Principals, trustees, teachers, and support staff. The website highlights Dr. Najeeb Mohamad as Director and Ms. Sajidha Razak as Principal when configured through settings, along with junior principal profiles and trustee information. Ansar has 270+ educators and staff members supporting over 4,600 students. For profile photos, qualifications, messages, and current leadership details, please open the Home and About pages.":e.includes("facility")||e.includes("facilities")||e.includes("lab")||e.includes("library")||e.includes("sports")||e.includes("transport")?"Ansar facilities include a safe CCTV-supported campus, smart learning spaces, a library with 34,000+ resources, Champions Arena, play zones, dining spaces, transport, and nine experiential-learning labs: ATL, Robotics, Chemistry, Biology, Home Science, Mathematics, Computer, Physics, and Coding. Each lab has a detailed section and admin-managed image carousel on the Experiential Learning Labs page.":e.includes("media")||e.includes("production")||e.includes("photography")||e.includes("videography")||e.includes("podcast")?"Ansar Media and Production is the school's in-house media unit. It supports photography, videography, drone videography, podcasts, graphic designing, editing, event documentation, reels, social media creatives, and institutional presentations. You can find it under Explore > Ansar Media and Production.":e.includes("website")||e.includes("site")||e.includes("navigate")||e.includes("page")?"This website is organized to help visitors learn about Ansar English School and quickly reach important information. The main sections include About, Academics, Admission, News, Events, Gallery, Achievements, Ansar Times, Mandatory Public Disclosure, Contact, and special pages such as Sports, ATL, Ansar Sprouts, Life at Ansar, and Ansar Media and Production. Use the navigation menu for general pages, News and Events for updates by date, Achievements for student accomplishments, and Contact for phone, email, address, map, and inquiries.":e.includes("news")||e.includes("event")||e.includes("achievement")?"The latest school updates are available in News, Events, and Achievements. I can guide you to the relevant page from the shortcuts below.":a.length?`I can guide you to ${a.map(s=>s.label).join(", ")}. Please choose one of the links below.`:"Good day. I can help with detailed information about Ansar English School, the institution history, leadership, facilities, admissions, academics, website navigation, news, events, achievements, public disclosure documents, Ansar Times, and contact information. Please ask your question in a little more detail."}function Jt(){const t=xe(),[n,a]=M.useState(!1),[e,s]=M.useState(""),[i,o]=M.useState(!1),[r,l]=M.useState([{role:"assistant",text:"Good day. Welcome to Ansar English School. I can help with admissions, academics, Ansar Sprouts, experiential learning labs, SPC, NSS, campus life, news, events, achievements, public disclosures, and contact details. How may I assist you?"}]),d=M.useRef([]),{data:y}=L("updates",null),{data:f}=L("achievements",null),{data:E}=L("publicDisclosure","order","asc",{limit:12}),{data:m}=L("ansarTimes","year","desc",{limit:8}),{data:b}=L("leadership","order","asc",{firestoreOnly:!0}),{data:_}=L("learningLabs","order","asc",{firestoreOnly:!0}),{data:c}=Pe("pages","createdAt","desc"),S=M.useMemo(()=>Gt({settings:t,updates:y,achievements:f,disclosures:E,ansarTimes:m,pages:c,leadership:b,learningLabs:_}),[t,y,f,E,m,c,b,_]),Re=M.useMemo(()=>{var P;const g=((P=[...r].reverse().find(R=>R.role==="user"))==null?void 0:P.text)||"",v=Ie(g);return v.length?v:ne.slice(0,4)},[r]),ae=async g=>{const v=g.trim();if(!v||i)return;const P={role:"user",text:v};l(R=>[...R,P]),s(""),o(!0);try{const R=Bt(v),$=xt(Lt,{model:kt,generationConfig:{maxOutputTokens:R?900:420}}),G=[...d.current,P].slice(-8),_e=["You are the formal, helpful website assistant for Ansar English School.","Answer only from the provided website/admin/sheet context. If information is missing, say so and guide the visitor to Contact.",R?"For questions about the institution, leadership, history, facilities, or website navigation, give a detailed, well-structured answer in 2 to 5 short paragraphs. Include relevant facts, names, milestones, page names, and helpful next steps from the context.":"Keep replies concise, polite, and navigation-oriented. Mention relevant page names and paths when useful.","Do not answer in one line when the visitor asks to explain the institution, leaders, or website. Use clear headings or short paragraphs when that makes the answer easier to read.","Do not invent dates, fees, phone numbers, or policies.",`Website context:
${S}`,`Conversation:
${G.map(B=>`${B.role}: ${B.text}`).join(`
`)}`,`Visitor question: ${v}`].join(`

`),se={role:"assistant",text:(await $.generateContent(_e)).response.text().trim()||ge(v,S)};d.current=[...G,se].slice(-8),l(B=>[...B,se])}catch(R){console.warn("AI assistant unavailable, using guided fallback.",R);const $={role:"assistant",text:ge(v)};d.current=[...d.current,P,$].slice(-8),l(G=>[...G,$])}finally{o(!1)}},Ne=g=>{g.preventDefault(),ae(e)};return h.jsxs("div",{className:"fixed bottom-5 left-5 z-[9998]",children:[n&&h.jsxs("section",{className:"mb-4 flex h-[min(76vh,38rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl",children:[h.jsxs("header",{className:"flex items-center justify-between bg-emerald-950 px-4 py-3 text-white",children:[h.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[h.jsx("span",{className:"flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-400 text-emerald-950",children:h.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:h.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M12 6V4m0 16v-2m6-6h2M4 12h2m9.9-5.9 1.4-1.4M6.7 17.3l1.4-1.4m9.2 1.4-1.4-1.4M6.7 6.7l1.4 1.4M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"})})}),h.jsxs("div",{className:"min-w-0",children:[h.jsx("h2",{className:"truncate text-sm font-extrabold",children:"Ansar AI Assistant"}),h.jsx("p",{className:"truncate text-xs text-emerald-100",children:"Website guidance"})]})]}),h.jsx("button",{type:"button",onClick:()=>a(!1),className:"rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white","aria-label":"Close assistant",children:h.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:h.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18 18 6M6 6l12 12"})})})]}),h.jsxs("div",{className:"flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4",children:[r.map((g,v)=>h.jsx("div",{className:`flex ${g.role==="user"?"justify-end":"justify-start"}`,children:h.jsx("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${g.role==="user"?"bg-emerald-600 text-white":"bg-white text-slate-700 border border-slate-100"}`,children:g.text})},`${g.role}-${v}`)),i&&h.jsxs("div",{className:"inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm",children:[h.jsx("span",{className:"h-2 w-2 animate-pulse rounded-full bg-emerald-500"}),"Preparing a response"]})]}),h.jsxs("div",{className:"border-t border-slate-100 bg-white p-3",children:[h.jsx("div",{className:"mb-3 flex gap-2 overflow-x-auto pb-1",children:Re.map(g=>h.jsx(ke,{to:g.path,onClick:()=>a(!1),className:"whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100",children:g.label},g.path))}),h.jsx("div",{className:"mb-3 grid grid-cols-2 gap-2",children:Dt.slice(0,4).map(g=>h.jsx("button",{type:"button",onClick:()=>ae(g),className:"rounded-lg bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200",children:g},g))}),h.jsxs("form",{onSubmit:Ne,className:"flex items-center gap-2",children:[h.jsx("input",{type:"text",value:e,onChange:g=>s(g.target.value),placeholder:"Ask about the school...",className:"min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-400 focus:bg-white"}),h.jsx("button",{type:"submit",disabled:i||!e.trim(),className:"flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50","aria-label":"Send message",children:h.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:h.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M5 12h14m-6-6 6 6-6 6"})})})]})]})]}),h.jsx("button",{type:"button",onClick:()=>a(g=>!g),className:"flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-white shadow-2xl ring-4 ring-white transition-all hover:-translate-y-1 hover:bg-emerald-800","aria-label":n?"Close Ansar AI Assistant":"Open Ansar AI Assistant",children:h.jsx("svg",{className:"h-7 w-7",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:h.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 10h.01M12 10h.01M16 10h.01M9 16H7a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3l-4 4v-4H9Z"})})})]})}export{Jt as default};

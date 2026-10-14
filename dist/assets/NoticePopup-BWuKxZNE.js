import{j as e}from"./motion-C7nFnKpT.js";import{r,u as h}from"./vendor-BdUPJGpM.js";import{q as m,y as b,l as f,p as g}from"./firebase-D8tGb21Y.js";import{r as w}from"./index-DfZODnGq.js";let c=!1;function N(){const[t,d]=r.useState(null),[a,o]=r.useState(!1),[p,l]=r.useState(!1),x=h();if(r.useEffect(()=>{const i=m(f(w,"notices"),b("active","==",!0)),u=g(i,n=>{n.empty?o(!1):(d({id:n.docs[0].id,...n.docs[0].data()}),l(!1),c||(c=!0,o(!0)))},n=>{console.warn("Notice banner could not be loaded:",n),o(!1)});return()=>u()},[]),r.useEffect(()=>{if(a){const i=setTimeout(()=>o(!1),1e4);return()=>clearTimeout(i)}},[a]),!t)return null;const s=()=>{o(!1),t.buttonUrl&&(t.buttonUrl.startsWith("http")?window.open(t.buttonUrl,"_blank","noopener,noreferrer"):x(t.buttonUrl))};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .notice-popup-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.88);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          /* Avoid backdrop-filter and 3D transforms here: both can exhaust
             the compositor on lower-memory mobile devices. */
        }
        .notice-container-fluid {
          position: relative;
          width: 90vw;
          max-width: 1000px; /* Designed to lock into widescreen landscape banner limits perfectly */
          height: auto;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          border-radius: 12px;
        }
        .notice-popup-img {
          width: 100%;
          height: auto;
          object-fit: contain; /* Keeps widescreen posters perfectly uncropped and clear */
          border-radius: 12px;
          max-height: min(62vh, 620px);
          background: #111827;
        }
        .notice-overlay-content {
          position: absolute;
          bottom: 0; left: 0; width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%);
          padding: 24px;
          border-radius: 0 0 12px 12px;
          display: flex; justify-content: space-between; align-items: center;
          box-sizing: border-box;
        }
        @media (max-width: 640px) {
          .notice-popup-overlay {
            align-items: flex-start;
            padding-top: 36vh;
          }
          .notice-container-fluid {
            width: min(92vw, 420px);
          }
          .notice-popup-img {
            border-radius: 12px 12px 0 0;
          }
          .notice-overlay-content {
            position: relative;
            background: #030712;
            padding: 16px;
            gap: 12px;
            align-items: stretch;
            flex-direction: column;
            border-radius: 0 0 12px 12px;
          }
          .notice-overlay-content h3 {
            padding-right: 0;
            font-size: 1rem;
            line-height: 1.45;
          }
          .notice-overlay-content button {
            width: 100%;
            padding: 12px 18px;
          }
        }
      `}),a&&e.jsx("div",{className:"notice-popup-overlay",role:"dialog","aria-modal":"true","aria-label":t.title||"School notice",onClick:()=>o(!1),children:e.jsxs("div",{className:"notice-container-fluid",onClick:i=>i.stopPropagation(),children:[e.jsx("button",{onClick:()=>o(!1),className:"absolute -top-12 right-0 z-50 text-white/70 hover:text-white p-2 transition-colors","aria-label":"Close Notice",children:e.jsx("svg",{className:"w-8 h-8 sm:w-10 sm:h-10",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})}),t.imageUrl&&!p?e.jsxs("div",{className:"relative w-full h-full flex flex-col rounded-xl overflow-hidden bg-black/80 ring-1 ring-white/10",children:[e.jsx("img",{src:t.imageUrl,alt:t.title||"Notice Banner",className:"notice-popup-img",decoding:"async",onError:()=>l(!0)}),e.jsxs("div",{className:"notice-overlay-content",children:[e.jsx("h3",{className:"text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-lg text-left pr-4",children:t.title}),t.buttonUrl&&e.jsx("button",{onClick:s,className:"flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)] whitespace-nowrap",children:t.buttonText||"Learn More"})]}),e.jsx("div",{className:"absolute bottom-0 left-0 h-1.5 w-full bg-amber-400 z-10"})]}):e.jsxs("div",{className:"p-8 sm:p-12 relative bg-white rounded-2xl shadow-2xl max-w-lg mx-auto w-full text-center",children:[e.jsx("p",{className:"text-sm font-black tracking-widest text-amber-500 uppercase mb-3",children:"New Update"}),e.jsx("h3",{className:"text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight",children:t.title}),t.buttonUrl&&e.jsxs("button",{onClick:s,className:"mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md hover:shadow-lg",children:[e.jsx("span",{children:t.buttonText||"Learn More"}),e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5l7 7-7 7"})})]}),e.jsx("div",{className:"absolute bottom-0 left-0 h-1.5 w-full bg-amber-400 rounded-b-2xl"})]})]})})]})}export{N as default};

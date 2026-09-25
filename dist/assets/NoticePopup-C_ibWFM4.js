import{j as e,A as u,m as n}from"./motion-BfktXgVH.js";import{r as a,u as m}from"./vendor-DSga0zUN.js";import{q as h,w as b,c as f,a as g}from"./firebase-CM_HGKg4.js";import{r as w}from"./index-BZuFEd7f.js";let c=!1;function N(){const[t,d]=a.useState(null),[r,i]=a.useState(!1),p=m();if(a.useEffect(()=>{const o=h(f(w,"notices"),b("active","==",!0)),x=g(o,s=>{s.empty?i(!1):(d({id:s.docs[0].id,...s.docs[0].data()}),c||(c=!0,i(!0)))});return()=>x()},[]),a.useEffect(()=>{if(r){const o=setTimeout(()=>i(!1),1e4);return()=>clearTimeout(o)}},[r]),!t)return null;const l=()=>{i(!1),t.buttonUrl&&(t.buttonUrl.startsWith("http")?window.open(t.buttonUrl,"_blank","noopener,noreferrer"):p(t.buttonUrl))};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .notice-popup-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.88);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(8px);
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
          image-rendering: -webkit-optimize-contrast; 
          image-rendering: crisp-edges;               
          transform: translateZ(0);                    
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
      `}),e.jsx(u,{children:r&&e.jsx(n.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"notice-popup-overlay",onClick:()=>i(!1),children:e.jsxs(n.div,{initial:{scale:.95,opacity:0,y:20},animate:{scale:1,opacity:1,y:0},exit:{scale:.95,opacity:0,y:20},transition:{type:"spring",damping:25,stiffness:300},className:"notice-container-fluid",onClick:o=>o.stopPropagation(),children:[e.jsx("button",{onClick:()=>i(!1),className:"absolute -top-12 right-0 z-50 text-white/70 hover:text-white p-2 transition-colors","aria-label":"Close Notice",children:e.jsx("svg",{className:"w-8 h-8 sm:w-10 sm:h-10",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})}),t.imageUrl?e.jsxs("div",{className:"relative w-full h-full flex flex-col rounded-xl overflow-hidden bg-black/80 ring-1 ring-white/10",children:[e.jsx("img",{src:t.imageUrl,alt:t.title||"Notice Banner",className:"notice-popup-img"}),e.jsxs("div",{className:"notice-overlay-content",children:[e.jsx("h3",{className:"text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-lg text-left pr-4",children:t.title}),t.buttonUrl&&e.jsx("button",{onClick:l,className:"flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)] whitespace-nowrap",children:t.buttonText||"Learn More"})]}),e.jsx(n.div,{initial:{width:"100%"},animate:{width:"0%"},transition:{duration:10,ease:"linear"},className:"absolute bottom-0 left-0 h-1.5 bg-amber-400 z-10"})]}):e.jsxs("div",{className:"p-8 sm:p-12 relative bg-white rounded-2xl shadow-2xl max-w-lg mx-auto w-full text-center",children:[e.jsx("p",{className:"text-sm font-black tracking-widest text-amber-500 uppercase mb-3",children:"New Update"}),e.jsx("h3",{className:"text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight",children:t.title}),t.buttonUrl&&e.jsxs("button",{onClick:l,className:"mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md hover:shadow-lg",children:[e.jsx("span",{children:t.buttonText||"Learn More"}),e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M9 5l7 7-7 7"})})]}),e.jsx(n.div,{initial:{width:"100%"},animate:{width:"0%"},transition:{duration:10,ease:"linear"},className:"absolute bottom-0 left-0 h-1.5 bg-amber-400 rounded-b-2xl"})]})]})})})]})}export{N as default};

import React, { useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "./firebase-init";

export default function AdminApplicationDeleteEnhancer({ children }) {
  useEffect(() => {
    const enhance = () =>
      document.querySelectorAll("tbody tr").forEach((row) => {
        if (row.querySelector("[data-delete-application]")) return;
        const cells = row.querySelectorAll("td");
        if (cells.length < 4 || !cells[0]?.textContent?.includes("AES-HR-"))
          return;
        const applicationId = cells[0].textContent.trim();
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.deleteApplication = "true";
        button.textContent = "Delete";
        button.className =
          "ml-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700";
        button.onclick = async () => {
          if (
            !window.confirm(
              `Delete application ${applicationId}? This will also delete the resume and photograph.`,
            )
          )
            return;
          const item = [...document.querySelectorAll("tbody tr")].find(
            (candidate) => candidate === row,
          );
          try {
            const snapshot = await getDocs(
              query(
                collection(db, "careersApplications"),
                where("applicationId", "==", applicationId),
              ),
            );
            await Promise.all(
              snapshot.docs.map(async (record) => {
                const data = record.data();
                await deleteDoc(doc(db, "careersApplications", record.id));
                if (data.resumePath)
                  await deleteObject(ref(storage, data.resumePath)).catch(
                    () => {},
                  );
                if (data.photoPath)
                  await deleteObject(ref(storage, data.photoPath)).catch(
                    () => {},
                  );
              }),
            );
            item?.remove();
          } catch (error) {
            window.alert(`Application could not be deleted: ${error.message}`);
          }
        };
        cells[cells.length - 1].append(button);
        const filesButton = document.createElement("button");
        filesButton.type = "button";
        filesButton.textContent = "View files";
        filesButton.className =
          "rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700";
        filesButton.onclick = async () => {
          const preview = window.open("", "_blank");
          if (!preview) {
            window.alert("Please allow pop-ups to view application files.");
            return;
          }
          try {
            const snapshot = await getDocs(
              query(
                collection(db, "careersApplications"),
                where("applicationId", "==", applicationId),
              ),
            );
            const data = snapshot.docs[0]?.data();
            if (!data?.resumePath || !data?.photoPath)
              throw new Error(
                "Uploaded files are not available for this application.",
              );
            const [resumeUrl, photoUrl] = await Promise.all([
              getDownloadURL(ref(storage, data.resumePath)),
              getDownloadURL(ref(storage, data.photoPath)),
            ]);
            preview.document.write(
              `<title>${applicationId} documents</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;background:#f1f5f9;color:#102a43}.shell{max-width:1120px;margin:0 auto;padding:32px 20px}.eyebrow{color:#0f766e;font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase}.head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}.head h1{font-size:28px;margin:8px 0 0}.grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,.8fr);gap:20px}.card{background:#fff;border:1px solid #dbe4ee;border-radius:18px;padding:18px;box-shadow:0 12px 30px rgba(15,23,42,.08)}.card h2{font-size:17px;margin:0 0 12px}.meta{font-size:12px;color:#64748b;margin-bottom:12px}.actions{display:flex;flex-wrap:wrap;gap:8px}.actions a{padding:10px 13px;border-radius:10px;background:#0f766e;color:#fff;text-decoration:none;font-weight:700;font-size:13px}.actions a.secondary{background:#ecfdf5;color:#047857;border:1px solid #a7f3d0}iframe{width:100%;height:650px;border:1px solid #dbe4ee;border-radius:12px;margin-top:16px;background:#f8fafc}img{display:block;width:100%;max-height:500px;object-fit:contain;border-radius:12px;background:#f8fafc;margin-top:16px}.photo{position:sticky;top:20px;height:max-content}@media(max-width:760px){.grid{grid-template-columns:1fr}.photo{position:static}.head{display:block}}</style><div class="shell"><div class="head"><div><div class="eyebrow">Application documents</div><h1>${applicationId}</h1></div><div class="meta">Secure HR preview</div></div><div class="grid"><section class="card"><h2>Resume / CV</h2><div class="meta">PDF document · available to authorised HR/Admin users</div><div class="actions"><a href="${resumeUrl}" target="_blank">View PDF</a><a class="secondary" href="${resumeUrl}" download>Download PDF</a></div><iframe src="${resumeUrl}" title="Resume PDF"></iframe></section><section class="card photo"><h2>Recent photograph</h2><div class="meta">Candidate photograph</div><div class="actions"><a href="${photoUrl}" target="_blank">View photo</a><a class="secondary" href="${photoUrl}" download>Download photo</a></div><img src="${photoUrl}" alt="Candidate photograph" onerror="this.outerHTML='<p class=meta>Photograph could not be loaded.</p>'"/></section></div></div>`,
            );
            const detailMarkup = `<section style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 20px">${[
              ['Full name', data.fullName], ['Date of birth', data.dob], ['Mobile number', data.mobile],
              ['Email address', data.email], ['Residential address', data.address], ['Highest qualification', data.qualification],
              ['Additional qualifications', data.additionalQualifications], ['Institution / university', data.institution],
              ['Year of completion', data.completionYear], ['Total work experience', data.experience],
              ['Previous employment', data.previousEmployment], ['Relevant skills', data.skills],
              ['Status', data.status], ['Additional information', data.message]
            ].map(([label, value]) => `<div style="background:#fff;border:1px solid #dbe4ee;border-radius:12px;padding:12px"><b style="display:block;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px">${label}</b><span style="display:block;white-space:pre-wrap;word-break:break-word;font-size:14px">${value || '—'}</span></div>`).join('')}</section>`;
            preview.document.querySelector('.shell')?.insertAdjacentHTML('afterbegin', detailMarkup);
            preview.document.close();
          } catch (error) {
            preview.document.body.innerHTML = `<p style="font-family:Arial;color:#b91c1c;padding:24px">Files could not be opened: ${error.message}</p>`;
          }
        };
        cells[cells.length - 1].prepend(filesButton);
      });
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return children;
}

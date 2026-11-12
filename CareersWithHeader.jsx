import React, { useEffect } from 'react';
import Navbar from './Navbar';
import CareersPage from './CareersPage';

export default function CareersWithHeader() {
  useEffect(() => {
    const updateConfirmation = () => {
      const heading = Array.from(document.querySelectorAll('h1')).find(item => item.textContent?.trim() === 'Application received');
      if (heading) {
        heading.textContent = 'Your Application Has Been Submitted!';
        const message = heading.parentElement?.querySelector('p.mt-4');
        if (message) message.textContent = 'Your application is successfully received and is currently under review. Our team will contact you shortly.';
        const reference = heading.parentElement?.querySelector('p.mt-6');
        if (reference && !heading.parentElement.querySelector('[data-submission-date]')) {
          const date = document.createElement('p');
          date.dataset.submissionDate = 'true';
          date.className = 'mt-3 text-sm text-slate-500';
          date.textContent = `Submitted on: ${new Date().toLocaleDateString('en-GB')}`;
          reference.after(date);
        }
      }
      document.querySelectorAll('input[type="file"]').forEach(input => {
        const label = input.closest('label');
        if (!label || label.querySelector('[data-upload-limit]')) return;
        const note = document.createElement('span');
        note.dataset.uploadLimit = 'true';
        note.className = 'ml-1 font-normal text-slate-500';
        note.textContent = input.accept.includes('pdf') ? '(PDF, max 5 MB)' : '(JPG/PNG, passport-size, max 2 MB)';
        label.append(note);
      });
      document.querySelectorAll('button').forEach(button => {
        if (button.textContent?.includes('Submitting')) button.textContent = 'Submitting...';
      });
    };
    updateConfirmation();
    const observer = new MutationObserver(updateConfirmation);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const handleApplyClick = event => {
    if (event.target.closest('button')?.textContent?.toLowerCase().includes('apply now')) {
      const originalScrollTo = window.scrollTo;
      window.scrollTo = () => {};
      window.setTimeout(() => { window.scrollTo = originalScrollTo; }, 0);
      window.setTimeout(() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  };
  const handleDobInput = event => {
    const input = event.target;
    if (input?.placeholder !== 'DD/MM/YYYY') return;
    input.value = input.value.replace(/[^0-9/]/g, '').replace(/\/{2,}/g, '/').slice(0, 10);
  };
  const handleFileChange = event => {
    const input = event.target;
    if (input.type !== 'file' || !input.files?.[0]) return;
    const limit = input.accept.includes('pdf') ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (input.files[0].size > limit) { input.value = ''; window.alert(input.accept.includes('pdf') ? 'Resume must be a PDF no larger than 5 MB.' : 'Passport-size photo must be JPG or PNG no larger than 2 MB.'); }
  };
  return <><Navbar /><div onClickCapture={handleApplyClick} onInputCapture={handleDobInput} onChangeCapture={handleFileChange}><CareersPage /></div></>;
}

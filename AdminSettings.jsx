import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { DEFAULT_TRUST_MEMBERS } from './trustMembers';

const DEFAULT_EVENT_COUNTDOWNS = [{ id: 'vision-2030-launch', title: 'Official Launch & Inauguration of VISION 2030!', dateTime: '2026-08-29T09:30', enabled: true }];

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    logoUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    whatsappChannelUrl: '',
    podcastUrl: 'https://www.youtube.com/channel/UCINzivjyBDxX2O8vzGpUOCg/',
    premisesImages: [''],
    kgImages: [''],
    visionText: '',
    missionText: '',
    directorName: '',
    directorQualifications: '',
    directorRole: 'Director',
    directorImageUrl: '',
    directorMessage: '',
    principalName: '',
    principalQualifications: '',
    principalRole: 'Principal',
    principalImageUrl: '',
    principalMessage: '',
    juniorPrincipals: [{ name: '', qualification: '', role: '', section: '', imageUrl: '' }],
    trustMembers: DEFAULT_TRUST_MEMBERS,
    sustainabilityTitle: '',
    sustainabilityDesc: '',
    sustainabilityLogoUrl: '',
    eventCountdowns: DEFAULT_EVENT_COUNTDOWNS,
    feeStructureTitle: 'Fee Structure 2026 - 2027',
    feeStructurePdfUrl: 'https://drive.google.com/file/d/1BlRQIlD4U4RjRGvVIq2Kah4xYxNjChoa/view?usp=drive_link'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const juniorPrincipalItems = Array.isArray(formData.juniorPrincipals)
    ? formData.juniorPrincipals
    : [{ name: '', qualification: '', role: '', section: '', imageUrl: '' }];

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (docSnap.exists()) {
        const savedSettings = docSnap.data();
        setFormData(prev => ({
          ...prev,
          ...savedSettings,
          feeStructureTitle: savedSettings.feeStructureTitle || prev.feeStructureTitle,
          feeStructurePdfUrl: savedSettings.feeStructurePdfUrl || prev.feeStructurePdfUrl,
          trustMembers: Array.isArray(savedSettings.trustMembers) && savedSettings.trustMembers.length
            ? DEFAULT_TRUST_MEMBERS.map((member, index) => ({ ...member, ...(savedSettings.trustMembers[index] || {}) }))
            : prev.trustMembers
        }));
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const appendArrayUrls = (field, urls) => {
    setFormData(prev => {
      const existing = Array.isArray(prev[field]) ? prev[field].filter(url => String(url || '').trim() !== '') : [];
      return { ...prev, [field]: [...existing, ...urls] };
    });
  };

  const handleJuniorPrincipalChange = (index, field, value) => {
    const current = Array.isArray(formData.juniorPrincipals) ? formData.juniorPrincipals : [];
    const next = [...current];
    next[index] = { ...(next[index] || {}), [field]: value };
    setFormData(prev => ({ ...prev, juniorPrincipals: next }));
  };

  const handleTrustMemberImageChange = (index, imageUrl) => {
    setFormData(prev => ({
      ...prev,
      trustMembers: prev.trustMembers.map((member, memberIndex) => (
        memberIndex === index ? { ...member, imageUrl } : member
      ))
    }));
  };

  const updateCountdown = (index, field, value) => {
    setFormData(prev => ({ ...prev, eventCountdowns: (prev.eventCountdowns || []).map((event, eventIndex) => eventIndex === index ? { ...event, [field]: value } : event) }));
  };

  const addCountdown = () => {
    const id = globalThis.crypto?.randomUUID?.() || `event-${Date.now()}`;
    setFormData(prev => ({ ...prev, eventCountdowns: [...(prev.eventCountdowns || []), { id, title: '', dateTime: '', enabled: true }] }));
  };

  const removeCountdown = (index) => {
    setFormData(prev => ({ ...prev, eventCountdowns: (prev.eventCountdowns || []).filter((_, eventIndex) => eventIndex !== index) }));
  };

  const addJuniorPrincipal = () => {
    setFormData(prev => ({
      ...prev,
      juniorPrincipals: [...(Array.isArray(prev.juniorPrincipals) ? prev.juniorPrincipals : []), { name: '', qualification: '', role: '', section: '', imageUrl: '' }]
    }));
  };

  const removeJuniorPrincipal = (index) => {
    const current = Array.isArray(formData.juniorPrincipals) ? formData.juniorPrincipals : [];
    if (current.length <= 1) return;
    setFormData(prev => ({ ...prev, juniorPrincipals: current.filter((_, i) => i !== index) }));
  };

  const moveJuniorPrincipal = (index, direction) => {
    const current = Array.isArray(formData.juniorPrincipals) ? formData.juniorPrincipals : [];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= current.length) return;

    const next = [...current];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setFormData(prev => ({ ...prev, juniorPrincipals: next }));
  };

  const normalizeJuniorPrincipals = (leaders) => {
    const current = Array.isArray(leaders) ? leaders : [];
    return current.map((leader, index) => ({
      ...leader,
      qualification: leader.qualification || leader.qualifications || '',
      order: index + 1
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };
  const removeArrayItem = (field, index) => {
    if (formData[field].length <= 1) return;
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...formData,
        eventCountdowns: (formData.eventCountdowns || []).filter(event => event.title?.trim() && event.dateTime).map(event => ({ id: event.id, title: event.title.trim(), dateTime: event.dateTime, enabled: event.enabled !== false })),
        juniorPrincipals: normalizeJuniorPrincipals(formData.juniorPrincipals),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
        <h2 className="text-xl font-bold mb-8 text-slate-800">Global Website Settings</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg font-bold text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h3 className="font-extrabold text-slate-900">Event Countdown Timers</h3><p className="mt-1 text-sm text-slate-600">Times use India Standard Time. Expired timers disappear automatically.</p></div>
              <button type="button" onClick={addCountdown} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">+ Add Countdown</button>
            </div>
            {(formData.eventCountdowns || []).length ? (formData.eventCountdowns || []).map((event, index) => (
              <div key={event.id || index} className="grid grid-cols-1 gap-4 rounded-xl border border-amber-100 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_15rem_auto] lg:items-end">
                <div><label className="mb-2 block text-sm font-bold text-slate-700">Event title</label><input value={event.title || ''} onChange={(e) => updateCountdown(index, 'title', e.target.value)} placeholder="Event name" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                <div><label className="mb-2 block text-sm font-bold text-slate-700">Date and time (IST)</label><input type="datetime-local" value={event.dateTime || ''} onChange={(e) => updateCountdown(index, 'dateTime', e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                <div className="flex flex-wrap items-center gap-3 lg:pb-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={event.enabled !== false} onChange={(e) => updateCountdown(index, 'enabled', e.target.checked)} className="h-5 w-5 accent-emerald-600" /> Visible</label>
                  <button type="button" onClick={() => removeCountdown(index)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button>
                </div>
              </div>
            )) : <p className="rounded-lg bg-white p-4 text-sm text-slate-500">No countdown timers configured.</p>}
          </div>
          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Core Branding</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hero Headline Text</label>
              <input name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Main School Logo (Image URL)</label>
              <input name="logoUrl" type="text" value={formData.logoUrl} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              <div className="mt-2">
                <ImgBbUrlImporter onExtracted={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))} />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Homepage Layout Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Our Vision Text</label>
                <textarea name="visionText" value={formData.visionText} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Our Mission Text</label>
                <textarea name="missionText" value={formData.missionText} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">School Premises Vertical Carousel</label>
                  {(formData.premisesImages || ['']).map((url, index) => (
                    <div key={`prem-${index}`} className="flex items-center gap-2 mb-2">
                      <input type="text" value={url} onChange={(e) => handleArrayChange('premisesImages', index, e.target.value)} placeholder="Image URL..." className="w-full p-2 border border-slate-200 rounded-lg outline-none" />
                      <button type="button" onClick={() => removeArrayItem('premisesImages', index)} disabled={formData.premisesImages.length <= 1} className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('premisesImages')} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-1 px-3 mt-1 rounded-lg">+ Add Image</button>
                  <div className="mt-2">
                    <ImgBbUrlImporter multiple label="Extract ImgBB URLs" onExtracted={(urls) => appendArrayUrls('premisesImages', urls)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">KG Section Vertical Carousel</label>
                  {(formData.kgImages || ['']).map((url, index) => (
                    <div key={`kg-${index}`} className="flex items-center gap-2 mb-2">
                      <input type="text" value={url} onChange={(e) => handleArrayChange('kgImages', index, e.target.value)} placeholder="Image URL..." className="w-full p-2 border border-slate-200 rounded-lg outline-none" />
                      <button type="button" onClick={() => removeArrayItem('kgImages', index)} disabled={formData.kgImages.length <= 1} className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('kgImages')} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-1 px-3 mt-1 rounded-lg">+ Add Image</button>
                  <div className="mt-2">
                    <ImgBbUrlImporter multiple label="Extract ImgBB URLs" onExtracted={(urls) => appendArrayUrls('kgImages', urls)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900">Homepage Leadership</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-white bg-white p-4 shadow-sm">
                <h4 className="font-bold text-emerald-800">Director Box</h4>
                <input name="directorName" value={formData.directorName} onChange={handleChange} placeholder="Director name" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="directorQualifications" value={formData.directorQualifications} onChange={handleChange} placeholder="Qualifications" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="directorRole" value={formData.directorRole} onChange={handleChange} placeholder="Role" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="directorImageUrl" type="text" value={formData.directorImageUrl} onChange={handleChange} placeholder="Director image URL" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <ImgBbUrlImporter onExtracted={(url) => setFormData(prev => ({ ...prev, directorImageUrl: url }))} />
                <textarea name="directorMessage" value={formData.directorMessage} onChange={handleChange} placeholder="Director message" className="h-28 w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="space-y-3 rounded-xl border border-white bg-white p-4 shadow-sm">
                <h4 className="font-bold text-emerald-800">Principal Box</h4>
                <input name="principalName" value={formData.principalName} onChange={handleChange} placeholder="Principal name" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="principalQualifications" value={formData.principalQualifications} onChange={handleChange} placeholder="Qualifications" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="principalRole" value={formData.principalRole} onChange={handleChange} placeholder="Role" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="principalImageUrl" type="text" value={formData.principalImageUrl} onChange={handleChange} placeholder="Principal image URL" className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                <ImgBbUrlImporter onExtracted={(url) => setFormData(prev => ({ ...prev, principalImageUrl: url }))} />
                <textarea name="principalMessage" value={formData.principalMessage} onChange={handleChange} placeholder="Principal message" className="h-28 w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-white bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="font-bold text-emerald-800">Junior Principals</h4>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Use Up / Down to set website order</p>
              </div>
              {juniorPrincipalItems.map((leader, index) => (
                <div key={`junior-${index}`} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="inline-flex h-9 w-fit items-center rounded-lg bg-slate-100 px-3 text-sm font-black text-slate-600">
                      #{index + 1}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => moveJuniorPrincipal(index, -1)} disabled={index === 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Up</button>
                      <button type="button" onClick={() => moveJuniorPrincipal(index, 1)} disabled={index === juniorPrincipalItems.length - 1} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Down</button>
                      <button type="button" onClick={() => removeJuniorPrincipal(index)} disabled={juniorPrincipalItems.length <= 1} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">Remove</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-5">
                    <input value={leader.name || ''} onChange={(e) => handleJuniorPrincipalChange(index, 'name', e.target.value)} placeholder="Name" className="min-w-0 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={leader.qualification || leader.qualifications || ''} onChange={(e) => handleJuniorPrincipalChange(index, 'qualification', e.target.value)} placeholder="Qualifications" className="min-w-0 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={leader.role || ''} onChange={(e) => handleJuniorPrincipalChange(index, 'role', e.target.value)} placeholder="Role (optional)" className="min-w-0 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={leader.section || ''} onChange={(e) => handleJuniorPrincipalChange(index, 'section', e.target.value)} placeholder="Section" className="min-w-0 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={leader.imageUrl || ''} onChange={(e) => handleJuniorPrincipalChange(index, 'imageUrl', e.target.value)} placeholder="Image URL" className="min-w-0 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <ImgBbUrlImporter onExtracted={(url) => handleJuniorPrincipalChange(index, 'imageUrl', url)} />
                </div>
              ))}
              <button type="button" onClick={addJuniorPrincipal} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-2 px-3 rounded-lg">+ Add Junior Principal</button>
            </div>
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <h3 className="font-extrabold text-slate-900">Trust Member Photos</h3>
              <p className="mt-1 text-sm text-slate-500">Update the photo shown for each trustee on the About page.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {formData.trustMembers.map((member, index) => (
                <div key={`${member.name}-${index}`} className="flex flex-col gap-4 rounded-xl border border-white bg-white p-4 shadow-sm sm:flex-row">
                  <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs font-bold text-slate-400">No photo</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="font-extrabold text-slate-800">{member.name}</p>
                      <p className="text-xs font-bold text-emerald-600">{member.role}</p>
                    </div>
                    <input type="text" value={member.imageUrl || ''} onChange={(e) => handleTrustMemberImageChange(index, e.target.value)} placeholder="Trust member image URL" className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                    <ImgBbUrlImporter onExtracted={(url) => handleTrustMemberImageChange(index, url)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Admission Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fee Structure Button Title</label>
                <input name="feeStructureTitle" value={formData.feeStructureTitle || ''} onChange={handleChange} placeholder="Fee Structure 2026 - 2027" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fee Structure PDF / Drive URL</label>
                <input name="feeStructurePdfUrl" type="text" value={formData.feeStructurePdfUrl || ''} onChange={handleChange} placeholder="https://drive.google.com/file/d/..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            {formData.feeStructurePdfUrl && (
              <a href={formData.feeStructurePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
                Preview current fee structure
              </a>
            )}
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Sustainability Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Section Title</label>
                <input name="sustainabilityTitle" value={formData.sustainabilityTitle} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Logo PNG URL</label>
                <input name="sustainabilityLogoUrl" type="text" value={formData.sustainabilityLogoUrl} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                <div className="mt-2">
                  <ImgBbUrlImporter onExtracted={(url) => setFormData(prev => ({ ...prev, sustainabilityLogoUrl: url }))} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Sustainability Description</label>
                <textarea name="sustainabilityDesc" value={formData.sustainabilityDesc} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Social Media Handles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['facebookUrl', 'instagramUrl', 'youtubeUrl', 'twitterUrl', 'whatsappChannelUrl', 'podcastUrl'].map(network => (
                <div key={network}>
                  <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{network.replace('Url', '')}</label>
                  <input name={network} type="text" value={formData[network]} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-lg shadow-md">
            {isSubmitting ? 'Saving Configurations...' : 'Deploy Global Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

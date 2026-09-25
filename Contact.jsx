import React, { useState } from 'react';
import Layout from './Layout';
import SupportWidget from './SupportWidget';
import { saveSheetRecord } from './googleSheetsAdminApi';

export default function Contact() {
  const schoolEmail = 'hr@ansar.in';
  const schoolPhone = '8129808051';
  const sproutsPhone = '8129851737';
  const customerCarePhone = '8129808051';
  const customerCareEmail = 'principal@ansar.in';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: 'School',
    category: 'Admission Query',
    message: ''
  });

  const isCustomerCareCategory = formData.category === 'Complaint' || formData.category === 'Suggestion';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getIndiaDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const getIndiaTimestamp = () => new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Structure the text payload. Complaints and suggestions are always
    // routed to the Customer Care desk; other inquiries go to the chosen team.
    const isCustomerCare = formData.category === 'Complaint' || formData.category === 'Suggestion';
    const isSproutsInquiry = !isCustomerCare && formData.destination === 'Ansar Sprouts';
    const recipientName = isCustomerCare ? 'Customer Care' : (isSproutsInquiry ? 'Ansar Sprouts Preschool' : 'Ansar English School');
    const recipientPhone = isCustomerCare ? customerCarePhone : (isSproutsInquiry ? sproutsPhone : schoolPhone);
    const payload = `Hello ${recipientName}, I have an inquiry:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email}
- For: ${formData.destination}
- Category: ${formData.category}

Message:
${formData.message}`;

    // 2. Encode for URL safety
    const encodedPayload = encodeURIComponent(payload);

    try {
      await saveSheetRecord('contactSubmissions', {
        id: `contact-${Date.now()}`,
        date: getIndiaDate(),
        submittedAt: getIndiaTimestamp(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        destination: formData.destination,
        category: formData.category,
        message: formData.message.trim()
      });
    } catch (error) {
      console.error('Unable to save contact inquiry to Google Sheets:', error);
    }
    
    // 3. Redirect to the selected team's WhatsApp conversation.
    const whatsappUrl = `https://wa.me/91${recipientPhone}?text=${encodedPayload}`;
    window.location.assign(whatsappUrl);
  };

  return (
    <Layout>
      <SupportWidget />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Get in Touch</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Contact Us</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">We are here to answer any questions you may have. Reach out to us and we'll respond as soon as we can.</p>
        </div>

        <section className="mb-10 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Customer Care</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Complaints & Suggestions</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Your feedback helps us improve. Reach the Customer Care desk directly for complaints, suggestions, or concerns — we respond as quickly as possible.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:flex-1 lg:min-w-0">
              <a href={`tel:+91${customerCarePhone}`} className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Call Us</span>
                <span className="text-sm font-extrabold leading-5 text-slate-900">Tap to Call Us</span>
              </a>
              <a
                href={`https://wa.me/91${customerCarePhone}?text=${encodeURIComponent('Hello Customer Care, I would like to share a complaint/suggestion regarding the school.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">WhatsApp</span>
                <span className="whitespace-nowrap text-sm font-extrabold leading-5 tracking-tight text-slate-900">Chat with Customer Care</span>
              </a>
              <a href={`mailto:${customerCareEmail}`} className="group flex h-full flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Email</span>
                <span className="text-sm font-extrabold leading-5 text-slate-900">Email Customer Care</span>
              </a>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* Left Side: Contact Information */}
          <div className="bg-slate-900 text-white p-10 lg:p-14 lg:w-5/12 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500 opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Campus Address</h4>
                    <p className="mt-1 text-slate-300 leading-relaxed">Ansar English School<br />Perumpilavu, Karikkad P.O<br />Thrissur, Kerala - 680519</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Email Us</h4>
                    <div className="mt-2 space-y-2 text-slate-300">
                      <a href={`mailto:${schoolEmail}`} className="block break-all transition-colors hover:text-emerald-300"><span className="font-semibold text-white">HR:</span> {schoolEmail}</a>
                      <a href={`mailto:${customerCareEmail}`} className="block break-all transition-colors hover:text-emerald-300"><span className="font-semibold text-white">Principal:</span> {customerCareEmail}</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Call Us</h4>
                    <div className="mt-2 space-y-2 text-slate-300">
                      <a href={`tel:+91${schoolPhone}`} className="block transition-colors hover:text-emerald-300"><span className="font-semibold text-white">School:</span> +91 81298 08051</a>
                      <a href={`tel:+91${sproutsPhone}`} className="block transition-colors hover:text-orange-300"><span className="font-semibold text-white">Ansar Sprouts:</span> +91 81298 51737</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="p-10 lg:p-14 lg:w-7/12">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.category !== 'Complaint' && formData.category !== 'Suggestion' && (
              <fieldset>
                <legend className="block text-sm font-bold text-slate-700 mb-2">Who would you like to contact? *</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {['School', 'Ansar Sprouts'].map(destination => (
                    <label key={destination} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-bold transition-colors ${formData.destination === destination ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-200'}`}>
                      <input type="radio" name="destination" value={destination} checked={formData.destination === destination} onChange={handleChange} className="h-4 w-4 text-emerald-600" />
                      <span>{destination}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              )}
              {isCustomerCareCategory && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <svg className="h-5 w-5 flex-none text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                  <p className="text-sm font-semibold text-emerald-800">Your message will go directly to the Customer Care desk.</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Inquiry Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors appearance-none">
                    <option value="Admission Query">Admission Query</option>
                    <option value="General Information">General Information</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Other Queries">Other Queries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg group">
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Interactive Satellite Map Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center lg:text-left">Find Us on the Map</h3>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
            <iframe
              title="Ansar English School Satellite Map"
              src="https://maps.google.com/maps?q=Ansar%20English%20School,%20Perumpilavu&t=k&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}

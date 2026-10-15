import React, { useMemo, useState } from 'react';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';
import { DEFAULT_TRANSPORT_STAFF, mergeTransportStaff } from './transportStaffData';

const blankStaff = () => ({ id: '', busNumber: '', driverName: '', driverPhone: '', conductorName: '', conductorPhone: '', published: true });

export default function AdminTransportStaff() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankStaff);
  const [saving, setSaving] = useState(false);
  const { data: savedRows, loading } = useContentCollection('transportStaff', 'order', 'asc', { sheetsOnly: true, refreshKey });
  const staff = useMemo(() => mergeTransportStaff(savedRows), [savedRows]);

  const startEdit = (record) => { setEditing(record); setForm({ ...record }); };
  const startAdd = () => { setEditing(null); setForm(blankStaff()); };
  const change = (event) => setForm(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    const busNumber = String(form.busNumber || '').trim();
    if (!busNumber) return alert('Enter a bus number.');
    setSaving(true);
    try {
      const id = form.id || `bus-${busNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      await saveSheetRecord('transportStaff', {
        ...form,
        id,
        busNumber,
        driverName: String(form.driverName || '').trim(),
        driverPhone: String(form.driverPhone || '').replace(/\D/g, ''),
        conductorName: String(form.conductorName || '').trim(),
        conductorPhone: String(form.conductorPhone || '').replace(/\D/g, ''),
        order: Number(form.order) || staff.length + 1,
        published: !!form.published
      });
      clearGoogleSheetsCache(); setRefreshKey(key => key + 1); startAdd();
    } catch (error) { alert(`Save failed: ${error.message}`); } finally { setSaving(false); }
  };

  const remove = async (record) => {
    if (!window.confirm(`Hide Bus ${record.busNumber} from the public directory? It can be added again later.`)) return;
    try {
      const isInitialRecord = DEFAULT_TRANSPORT_STAFF.some(item => item.id === record.id);
      // The spreadsheet holds overrides for the initial workbook import. Hiding an
      // imported record must therefore be stored as an unpublished override rather
      // than deleted, otherwise the source default would appear again.
      if (isInitialRecord) await saveSheetRecord('transportStaff', { ...record, published: false });
      else await deleteSheetRecord('transportStaff', record.id, record);
      clearGoogleSheetsCache(); setRefreshKey(key => key + 1);
    } catch (error) { alert(`Delete failed: ${error.message}`); }
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Safe School Transport</p>
      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Bus staff directory</h2>
      <p className="mt-2 text-sm font-medium text-slate-600">Manage the driver and attendant displayed for each vehicle on the public transport page.</p>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1fr_25rem]">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4"><strong className="text-slate-800">{staff.length} buses</strong><button type="button" onClick={startAdd} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">Add bus</button></div>
        {loading ? <p className="p-6 text-sm font-semibold text-slate-500">Loading saved staff details…</p> : <div className="divide-y divide-slate-100">
          {staff.map(record => <div key={record.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="min-w-16 rounded-lg bg-emerald-100 px-3 py-2 text-center text-sm font-black text-emerald-900">{record.busNumber}</span>
            <div className="min-w-40 flex-1"><p className="text-sm font-extrabold text-slate-800">{record.driverName || 'Driver not set'}</p><p className="text-xs font-semibold text-slate-500">Driver · {record.driverPhone || 'No phone'}</p></div>
            <div className="min-w-40 flex-1"><p className="text-sm font-extrabold text-slate-800">{record.conductorName || 'Attendant not set'}</p><p className="text-xs font-semibold text-slate-500">Attendant · {record.conductorPhone || 'No phone'}</p></div>
            <button type="button" onClick={() => startEdit(record)} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">Edit</button>
            <button type="button" onClick={() => remove(record)} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button>
          </div>)}
        </div>}
      </div>

      <form onSubmit={save} className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900">{editing ? `Edit Bus ${editing.busNumber}` : 'Add bus staff'}</h3>
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-bold text-slate-700">Bus number<input required name="busNumber" value={form.busNumber} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" placeholder="e.g. 30 or AWC 30" /></label>
          <label className="block text-sm font-bold text-slate-700">Driver name<input name="driverName" value={form.driverName} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="block text-sm font-bold text-slate-700">Driver phone<input name="driverPhone" inputMode="tel" value={form.driverPhone} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="block text-sm font-bold text-slate-700">Attendant name<input name="conductorName" value={form.conductorName} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="block text-sm font-bold text-slate-700">Attendant phone<input name="conductorPhone" inputMode="tel" value={form.conductorPhone} onChange={change} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="published" checked={form.published} onChange={change} /> Show on public page</label>
        </div>
        <div className="mt-6 flex gap-3"><button disabled={saving} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save staff details'}</button><button type="button" onClick={startAdd} className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button></div>
      </form>
    </div>
  </div>;
}

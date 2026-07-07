import { useState } from 'react'
import { api } from '../api.js'

const empty = { name: '', brand: '', expiryDate: '', quantity: '', price: '', notes: '' }

export default function AddMedicineModal({ onClose, onAdded, showToast }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const save = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.expiryDate) {
      showToast('Name, brand and expiry date are required', 'error')
      return
    }
    try {
      setSaving(true)
      const created = await api.addMedicine({
        name: form.name,
        brand: form.brand,
        expiryDate: form.expiryDate,
        quantity: Number(form.quantity) || 0,
        price: Number(form.price) || 0,
        notes: form.notes
      })
      onAdded(created)
    } catch (err) {
      showToast(err.message, 'error')
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add medicine</h2>

        <label>Full name
          <input value={form.name} onChange={set('name')} placeholder="e.g. Paracetamol 500mg" />
        </label>
        <label>Brand
          <input value={form.brand} onChange={set('brand')} placeholder="e.g. Calpol" />
        </label>
        <div className="row">
          <label>Expiry date
            <input type="date" value={form.expiryDate} onChange={set('expiryDate')} />
          </label>
          <label>Quantity
            <input type="number" min="0" value={form.quantity} onChange={set('quantity')} placeholder="0" />
          </label>
          <label>Price (₹)
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" />
          </label>
        </div>
        <label>Notes
          <textarea rows="2" value={form.notes} onChange={set('notes')} placeholder="Internal notes (not shown in the grid)" />
        </label>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save medicine'}
          </button>
        </div>
      </div>
    </div>
  )
}

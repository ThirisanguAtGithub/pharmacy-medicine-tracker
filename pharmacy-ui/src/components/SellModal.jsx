import { useState } from 'react'
import { api } from '../api.js'

export default function SellModal({ medicine, onClose, onSold, showToast }) {
  const [quantity, setQuantity] = useState(1)
  const [saving, setSaving] = useState(false)

  const qty = Number(quantity) || 0
  const valid = qty >= 1 && qty <= medicine.quantity
  const total = (qty * medicine.price).toFixed(2)

  const sell = async () => {
    try {
      setSaving(true)
      const sale = await api.recordSale({ medicineId: medicine.id, quantitySold: qty })
      onSold(sale)
    } catch (err) {
      showToast(err.message, 'error')
      setSaving(false)
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Sell {medicine.name}</h2>
        <p className="muted">
          {medicine.brand} · {medicine.quantity} in stock · ₹{medicine.price.toFixed(2)} each
        </p>

        <label>Quantity to sell
          <input
            type="number"
            min="1"
            max={medicine.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            autoFocus
          />
        </label>
        {!valid && qty > 0 && (
          <p className="error-text">Only {medicine.quantity} unit(s) available.</p>
        )}

        <p className="total">Total: <strong>₹{total}</strong></p>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={sell} disabled={!valid || saving}>
            {saving ? 'Recording…' : 'Record sale'}
          </button>
        </div>
      </div>
    </div>
  )
}

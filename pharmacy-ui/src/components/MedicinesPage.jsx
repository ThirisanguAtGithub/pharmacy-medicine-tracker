import { useEffect, useState } from 'react'
import { api } from '../api.js'
import MedicineTable from './MedicineTable.jsx'
import AddMedicineModal from './AddMedicineModal.jsx'
import SellModal from './SellModal.jsx'

export default function MedicinesPage({ showToast }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | expiring | lowstock
  const [showAdd, setShowAdd] = useState(false)
  const [selling, setSelling] = useState(null) // medicine being sold

  const load = async (term = search) => {
    try {
      setLoading(true)
      setMedicines(await api.getMedicines(term))
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Search as the user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => load(search), 300)
    return () => clearTimeout(timer)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const expiringCount = medicines.filter((m) => m.isExpiringSoon).length
  const lowStockCount = medicines.filter((m) => m.isLowStock).length

  const visible = medicines.filter((m) =>
    filter === 'expiring' ? m.isExpiringSoon :
    filter === 'lowstock' ? m.isLowStock : true
  )

  const handleAdded = (medicine) => {
    setShowAdd(false)
    showToast(`${medicine.name} added to stock`)
    load()
  }

  const handleSold = (sale) => {
    setSelling(null)
    showToast(`Sold ${sale.quantitySold} × ${sale.medicineName} — ₹${sale.totalAmount.toFixed(2)}`)
    load()
  }

  return (
    <section>
      {/* Stock health: live counts that also filter the grid */}
      <div className="chips">
        <button
          className={filter === 'all' ? 'chip active' : 'chip'}
          onClick={() => setFilter('all')}
        >
          All medicines <strong>{medicines.length}</strong>
        </button>
        <button
          className={filter === 'expiring' ? 'chip chip-red active' : 'chip chip-red'}
          onClick={() => setFilter(filter === 'expiring' ? 'all' : 'expiring')}
        >
          Expiring within 30 days <strong>{expiringCount}</strong>
        </button>
        <button
          className={filter === 'lowstock' ? 'chip chip-amber active' : 'chip chip-amber'}
          onClick={() => setFilter(filter === 'lowstock' ? 'all' : 'lowstock')}
        >
          Low stock (&lt; 10) <strong>{lowStockCount}</strong>
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by medicine name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn primary" onClick={() => setShowAdd(true)}>
          + Add medicine
        </button>
      </div>

      {loading
        ? <p className="empty">Loading medicines…</p>
        : <MedicineTable medicines={visible} onSell={setSelling} />}

      {showAdd && (
        <AddMedicineModal
          onClose={() => setShowAdd(false)}
          onAdded={handleAdded}
          showToast={showToast}
        />
      )}
      {selling && (
        <SellModal
          medicine={selling}
          onClose={() => setSelling(null)}
          onSold={handleSold}
          showToast={showToast}
        />
      )}
    </section>
  )
}

import { useState } from 'react'
import MedicinesPage from './components/MedicinesPage.jsx'
import SalesPage from './components/SalesPage.jsx'

export default function App() {
  const [page, setPage] = useState('medicines')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-cross" aria-hidden="true">+</span>
          <div>
            <h1>ABC Pharmacy</h1>
            <p>Medicine stock &amp; sales</p>
          </div>
        </div>
        <nav className="tabs">
          <button
            className={page === 'medicines' ? 'tab active' : 'tab'}
            onClick={() => setPage('medicines')}
          >
            Medicines
          </button>
          <button
            className={page === 'sales' ? 'tab active' : 'tab'}
            onClick={() => setPage('sales')}
          >
            Sales
          </button>
        </nav>
      </header>

      <main>
        {page === 'medicines'
          ? <MedicinesPage showToast={showToast} />
          : <SalesPage />}
      </main>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  )
}

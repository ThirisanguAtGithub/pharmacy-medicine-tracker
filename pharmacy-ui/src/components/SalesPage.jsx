import { useEffect, useState } from 'react'
import { api } from '../api.js'

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

export default function SalesPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getSales()
      .then(setSales)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="empty">Loading sales…</p>
  if (error) return <p className="empty">Could not load sales: {error}</p>

  const revenue = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const units = sales.reduce((sum, s) => sum + s.quantitySold, 0)

  return (
    <section>
      <div className="chips">
        <span className="chip static">Sales recorded <strong>{sales.length}</strong></span>
        <span className="chip static">Units sold <strong>{units}</strong></span>
        <span className="chip static">Revenue <strong>₹{revenue.toFixed(2)}</strong></span>
      </div>

      {sales.length === 0 ? (
        <p className="empty">
          No sales recorded yet. Use the <em>Sell</em> button on the Medicines page.
        </p>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Medicine</th>
                <th className="num">Qty</th>
                <th className="num">Price/unit (₹)</th>
                <th className="num">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{formatDateTime(s.saleDate)}</td>
                  <td className="name">{s.medicineName}</td>
                  <td className="num">{s.quantitySold}</td>
                  <td className="num">{s.pricePerUnit.toFixed(2)}</td>
                  <td className="num">{s.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

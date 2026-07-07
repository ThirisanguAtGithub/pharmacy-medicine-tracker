const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// Row color per business rules; red (expiry) takes precedence over yellow
const rowClass = (m) =>
  m.isExpiringSoon ? 'row-red' : m.isLowStock ? 'row-amber' : ''

export default function MedicineTable({ medicines, onSell }) {
  if (medicines.length === 0) {
    return <p className="empty">No medicines found. Add one to get started.</p>
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Brand</th>
            <th>Expiry date</th>
            <th className="num">Quantity</th>
            <th className="num">Price (₹)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m.id} className={rowClass(m)}>
              <td className="name">{m.name}</td>
              <td>{m.brand}</td>
              <td>
                {formatDate(m.expiryDate)}
                {m.isExpiringSoon && <span className="tag red">Expiring soon</span>}
              </td>
              <td className="num">
                {m.quantity}
                {m.isLowStock && <span className="tag amber">Low</span>}
              </td>
              <td className="num">{m.price.toFixed(2)}</td>
              <td className="actions">
                <button
                  className="btn small"
                  disabled={m.quantity === 0}
                  onClick={() => onSell(m)}
                >
                  Sell
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

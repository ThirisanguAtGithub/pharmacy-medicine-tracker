// All backend calls in one place. Paths are relative because the Vite
// dev server proxies /api to the .NET API (see vite.config.js).

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

export const api = {
  getMedicines: (search) =>
    request(`/api/medicines${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  addMedicine: (medicine) => request('/api/medicines', json('POST', medicine)),
  getSales: () => request('/api/sales'),
  recordSale: (sale) => request('/api/sales', json('POST', sale))
}

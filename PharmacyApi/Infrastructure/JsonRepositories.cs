using PharmacyApi.Application;
using PharmacyApi.Domain;

namespace PharmacyApi.Infrastructure;

public class JsonMedicineRepository : IMedicineRepository
{
    private readonly JsonFileStore<Medicine> _store;

    public JsonMedicineRepository()
    {
        _store = new JsonFileStore<Medicine>("medicines.json");
    }

    public List<Medicine> GetAll() => _store.ReadAll();

    public Medicine? GetById(int id) =>
        _store.ReadAll().FirstOrDefault(m => m.Id == id);

    public Medicine Add(Medicine medicine)
    {
        var medicines = _store.ReadAll();
        medicine.Id = medicines.Count == 0 ? 1 : medicines.Max(m => m.Id) + 1;
        medicines.Add(medicine);
        _store.WriteAll(medicines);
        return medicine;
    }

    public void Update(Medicine medicine)
    {
        var medicines = _store.ReadAll();
        var index = medicines.FindIndex(m => m.Id == medicine.Id);
        if (index == -1) return;
        medicines[index] = medicine;
        _store.WriteAll(medicines);
    }

    public bool Delete(int id)
    {
        var medicines = _store.ReadAll();
        var removed = medicines.RemoveAll(m => m.Id == id) > 0;
        if (removed) _store.WriteAll(medicines);
        return removed;
    }
}

public class JsonSaleRepository : ISaleRepository
{
    private readonly JsonFileStore<Sale> _store;

    public JsonSaleRepository()
    {
        _store = new JsonFileStore<Sale>("sales.json");
    }

    public List<Sale> GetAll() => _store.ReadAll();

    public Sale Add(Sale sale)
    {
        var sales = _store.ReadAll();
        sale.Id = sales.Count == 0 ? 1 : sales.Max(s => s.Id) + 1;
        sales.Add(sale);
        _store.WriteAll(sales);
        return sale;
    }
}

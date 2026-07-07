using PharmacyApi.Domain;

namespace PharmacyApi.Application;

// Storage abstraction: the JSON file implementation can be swapped
// for a database (e.g. EF Core) without changing services/controllers.
public interface IMedicineRepository
{
    List<Medicine> GetAll();
    Medicine? GetById(int id);
    Medicine Add(Medicine medicine);
    void Update(Medicine medicine);
    bool Delete(int id);
}

public interface ISaleRepository
{
    List<Sale> GetAll();
    Sale Add(Sale sale);
}

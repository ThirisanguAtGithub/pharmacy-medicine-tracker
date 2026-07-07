using PharmacyApi.Domain;

namespace PharmacyApi.Application;

public class MedicineService
{
    private readonly IMedicineRepository _repository;

    public MedicineService(IMedicineRepository repository)
    {
        _repository = repository;
    }

    public List<MedicineDto> GetAll(string? search = null)
    {
        var medicines = _repository.GetAll();

        // Search capability: filter by medicine name
        if (!string.IsNullOrWhiteSpace(search))
        {
            medicines = medicines
                .Where(m => m.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        return medicines.Select(ToDto).ToList();
    }

    public MedicineDto? GetById(int id)
    {
        var medicine = _repository.GetById(id);
        return medicine is null ? null : ToDto(medicine);
    }

    public MedicineDto Add(CreateMedicineRequest request)
    {
        var medicine = new Medicine
        {
            Name = request.Name.Trim(),
            Notes = request.Notes?.Trim() ?? string.Empty,
            ExpiryDate = request.ExpiryDate.Date,
            Quantity = request.Quantity,
            Price = decimal.Round(request.Price, 2),
            Brand = request.Brand.Trim()
        };

        return ToDto(_repository.Add(medicine));
    }

    public MedicineDto? Update(int id, CreateMedicineRequest request)
    {
        var medicine = _repository.GetById(id);
        if (medicine is null) return null;

        medicine.Name = request.Name.Trim();
        medicine.Notes = request.Notes?.Trim() ?? string.Empty;
        medicine.ExpiryDate = request.ExpiryDate.Date;
        medicine.Quantity = request.Quantity;
        medicine.Price = decimal.Round(request.Price, 2);
        medicine.Brand = request.Brand.Trim();

        _repository.Update(medicine);
        return ToDto(medicine);
    }

    public bool Delete(int id) => _repository.Delete(id);

    private static MedicineDto ToDto(Medicine m) => new(
        m.Id, m.Name, m.Notes, m.ExpiryDate, m.Quantity, m.Price, m.Brand,
        m.IsExpiringSoon(), m.IsLowStock());
}

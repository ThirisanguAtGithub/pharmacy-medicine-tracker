using PharmacyApi.Domain;

namespace PharmacyApi.Application;

public class SaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMedicineRepository _medicineRepository;

    public SaleService(ISaleRepository saleRepository, IMedicineRepository medicineRepository)
    {
        _saleRepository = saleRepository;
        _medicineRepository = medicineRepository;
    }

    public List<Sale> GetAll() =>
        _saleRepository.GetAll().OrderByDescending(s => s.SaleDate).ToList();

    public Sale RecordSale(CreateSaleRequest request)
    {
        var medicine = _medicineRepository.GetById(request.MedicineId)
            ?? throw new KeyNotFoundException($"Medicine with id {request.MedicineId} not found.");

        // Domain rule: validates quantity and prevents overselling
        medicine.ReduceStock(request.QuantitySold);
        _medicineRepository.Update(medicine);

        var sale = new Sale
        {
            MedicineId = medicine.Id,
            MedicineName = medicine.Name,
            QuantitySold = request.QuantitySold,
            PricePerUnit = medicine.Price,
            TotalAmount = decimal.Round(medicine.Price * request.QuantitySold, 2),
            SaleDate = DateTime.Now
        };

        return _saleRepository.Add(sale);
    }
}

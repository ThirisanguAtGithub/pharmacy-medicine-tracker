namespace PharmacyApi.Domain;

public class Medicine
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string Brand { get; set; } = string.Empty;

    // Business rule: expiring within the next 30 days (includes already expired)
    public bool IsExpiringSoon() => ExpiryDate.Date <= DateTime.Today.AddDays(30);

    // Business rule: low stock when quantity is less than 10
    public bool IsLowStock() => Quantity < 10;

    public void ReduceStock(int quantitySold)
    {
        if (quantitySold <= 0)
            throw new InvalidOperationException("Quantity sold must be greater than zero.");
        if (quantitySold > Quantity)
            throw new InvalidOperationException($"Insufficient stock. Only {Quantity} unit(s) available.");

        Quantity -= quantitySold;
    }
}

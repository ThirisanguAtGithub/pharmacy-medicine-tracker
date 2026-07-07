using System.ComponentModel.DataAnnotations;

namespace PharmacyApi.Application;

// Returned to the UI. Includes computed flags so the grid coloring rules
// are testable on the server and the client just applies CSS.
public record MedicineDto(
    int Id,
    string Name,
    string Notes,
    DateTime ExpiryDate,
    int Quantity,
    decimal Price,
    string Brand,
    bool IsExpiringSoon,
    bool IsLowStock);

public class CreateMedicineRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiryDate { get; set; }

    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(0, 999999.99)]
    public decimal Price { get; set; }

    [Required, MaxLength(200)]
    public string Brand { get; set; } = string.Empty;
}

public class CreateSaleRequest
{
    [Required]
    public int MedicineId { get; set; }

    [Range(1, int.MaxValue)]
    public int QuantitySold { get; set; }
}

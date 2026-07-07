using Microsoft.AspNetCore.Mvc;
using PharmacyApi.Application;
using PharmacyApi.Domain;

namespace PharmacyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly SaleService _service;

    public SalesController(SaleService service)
    {
        _service = service;
    }

    [HttpGet]
    public ActionResult<List<Sale>> GetAll() => Ok(_service.GetAll());

    /// <summary>Records a sale and reduces the medicine's stock.</summary>
    [HttpPost]
    public ActionResult<Sale> Create(CreateSaleRequest request)
    {
        try
        {
            return Ok(_service.RecordSale(request));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // e.g. insufficient stock
            return BadRequest(new { message = ex.Message });
        }
    }
}

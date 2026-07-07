using Microsoft.AspNetCore.Mvc;
using PharmacyApi.Application;

namespace PharmacyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly MedicineService _service;

    public MedicinesController(MedicineService service)
    {
        _service = service;
    }

    /// <summary>List all medicines. Optional search by name: /api/medicines?search=para</summary>
    [HttpGet]
    public ActionResult<List<MedicineDto>> GetAll([FromQuery] string? search) =>
        Ok(_service.GetAll(search));

    [HttpGet("{id:int}")]
    public ActionResult<MedicineDto> GetById(int id)
    {
        var medicine = _service.GetById(id);
        return medicine is null ? NotFound() : Ok(medicine);
    }

    [HttpPost]
    public ActionResult<MedicineDto> Create(CreateMedicineRequest request)
    {
        var created = _service.Add(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public ActionResult<MedicineDto> Update(int id, CreateMedicineRequest request)
    {
        var updated = _service.Update(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id) =>
        _service.Delete(id) ? NoContent() : NotFound();
}

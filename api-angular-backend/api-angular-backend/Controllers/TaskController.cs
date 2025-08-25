using ApiAngularBackend.DTOs;
using ApiAngularBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiAngularBackend.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _service;

    public TaskController(ITaskService service)
    {
        _service = service;
    }

    // GET /api/tasks
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    // POST /api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return Created($"/api/tasks/{created.Id}", created);
    }
}

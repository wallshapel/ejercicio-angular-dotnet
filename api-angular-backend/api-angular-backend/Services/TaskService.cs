using ApiAngularBackend.Common.Mapping;
using ApiAngularBackend.DTOs;
using ApiAngularBackend.Interfaces;
using ApiAngularBackend.Models;

namespace ApiAngularBackend.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;
    private readonly IObjectMapper _mapper;

    public TaskService(ITaskRepository repo, IObjectMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<TaskDto>> GetAllAsync()
    {
        // Map domain entities to DTOs
        var items = await _repo.GetAllAsync();
        return items.Select(e => _mapper.Map<TaskItem, TaskDto>(e)).ToList();
    }

    public async Task<TaskDto> CreateAsync(CreateTaskDto dto)
    {
        // Server-controlled fields
        var entity = new TaskItem
        {
            Title = (dto.Title ?? string.Empty).Trim(),
            IsDone = false,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repo.AddAsync(entity);
        return _mapper.Map<TaskItem, TaskDto>(created);
    }
}

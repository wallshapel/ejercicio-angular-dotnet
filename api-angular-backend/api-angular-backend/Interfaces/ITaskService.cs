using ApiAngularBackend.DTOs;

namespace ApiAngularBackend.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetAllAsync();
    Task<TaskDto> CreateAsync(CreateTaskDto dto);
}

using ApiAngularBackend.Models;

namespace ApiAngularBackend.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync();
    Task<TaskItem> AddAsync(TaskItem item);
}

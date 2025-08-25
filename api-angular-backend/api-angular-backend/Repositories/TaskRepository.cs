using ApiAngularBackend.Data;
using ApiAngularBackend.Interfaces;
using ApiAngularBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiAngularBackend.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _db;

    public TaskRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TaskItem>> GetAllAsync()
    {
        // Return tasks ordered by creation date (newest first)
        return await _db.Tasks
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<TaskItem> AddAsync(TaskItem item)
    {
        // Persist new task and return the entity with its generated Id
        _db.Tasks.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }
}

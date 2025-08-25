using System.ComponentModel.DataAnnotations;

namespace ApiAngularBackend.DTOs;

public class CreateTaskDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
}

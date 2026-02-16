namespace CollectGames.Backend.Services
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile file);
        Task DeleteImageAsync(string imagePath);
    }

    public class LocalImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;

        public LocalImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty or null");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Invalid file extension. Only jpg, jpeg, png, and webp are allowed.");
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/images/{fileName}";
        }

        public Task DeleteImageAsync(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return Task.CompletedTask;

            var relativePath = imagePath.TrimStart('/');
            var fullPath = Path.Combine(_environment.WebRootPath, relativePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }
    }
}

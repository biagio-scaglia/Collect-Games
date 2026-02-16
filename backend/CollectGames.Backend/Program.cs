using CollectGames.Backend.Data;
using CollectGames.Backend.Services;
using CollectGames.Backend.Hubs;
using CollectGames.Backend.Jobs;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Scalar.AspNetCore;
using FluentValidation;
using FluentValidation.AspNetCore;
using CollectGames.Backend.Validators;
using Hangfire;
using Hangfire.SqlServer;
using MediatR;


var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IImageService, LocalImageService>();
builder.Services.AddScoped<ICollectionReportService, CollectionReportService>();

// Configure MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Configure Hangfire
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();
builder.Services.AddScoped<CacheWarmupJob>();
builder.Services.AddScoped<ImageCleanupJob>();

// Configure SignalR
builder.Services.AddSignalR();

// Configure Redis Caching
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR
    });
});



builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<UserCollectionCreateValidator>();
builder.Services.AddOpenApi(); // Required for Scalar

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Better than Swagger!
}

app.UseCors();
app.UseStaticFiles();
app.UseAuthorization();

// Configure Hangfire Dashboard
app.UseHangfireDashboard("/hangfire");

// Schedule recurring jobs
RecurringJob.AddOrUpdate<CacheWarmupJob>(
    "cache-warmup",
    job => job.Execute(),
    Cron.Hourly);

RecurringJob.AddOrUpdate<ImageCleanupJob>(
    "image-cleanup",
    job => job.Execute(),
    Cron.Daily);

app.MapControllers();
app.MapHub<CollectionHub>("/hubs/collection");

try
{
    Log.Information("Starting web host");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

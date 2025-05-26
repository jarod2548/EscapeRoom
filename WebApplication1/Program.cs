using Microsoft.AspNetCore.ResponseCompression;
using WebApplication1;
using WebApplication1.services;
using Microsoft.AspNetCore.Mvc;
using System.Data.SQLite; 
using System.Collections.Concurrent; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSingleton<GameManager>();
builder.Services.AddSignalR();

builder.Logging.ClearProviders(); // Clears existing logging providers
builder.Logging.AddConsole(); // Add Console logging
builder.Logging.AddDebug(); // Add Debug logging

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // HTTP
    options.ListenAnyIP(7000, listenOptions => listenOptions.UseHttps()); // Optional HTTPS
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGameClients",
        policy =>
        {
            policy.WithOrigins("https://localhost:7000", "https://localhost:7000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = builder.Build();

ConcurrentDictionary<string, string> registeredDevices = new ConcurrentDictionary<string, string>();
    
app.MapPost("/api/device/register", ([FromBody] DeviceRegistration registration, HttpContext context) =>
{
    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "onbekend";
    registeredDevices[registration.DeviceId] = ip;

    Console.WriteLine($"Raspberry Pi geregistreerd: {registration.DeviceId} vanaf IP {ip}");

    return Results.Ok(new
    {
        status = "ok",
        message = "Device geregistreerd"
    });
});

app.MapGet("/api/device/devices", () => Results.Ok(registeredDevices));

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors("AllowGameClients");

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// -- Hier voeg je WebSockets middleware toe --
app.UseWebSockets();


app.MapHub<GameHub>("/gamehub");
app.MapRazorPages();


Console.WriteLine($"hello");

app.Run();

record DeviceRegistration(string DeviceId);
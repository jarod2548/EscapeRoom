using Microsoft.AspNetCore.ResponseCompression;
using WebApplication1;
using WebApplication1.services;


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
    //options.ListenAnyIP(5000); // HTTP
    options.ListenAnyIP(7000, listenOptions => listenOptions.UseHttps()); // Optional HTTPS
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowGameClients",
        policy =>
        {
            //Toevoegen van de website domain
            policy.WithOrigins("https://localhost:7000", "https://localhost:7000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapHub<GameHub>("/gamehub");
app.UseCors("AllowGameClients");

app.UseHttpsRedirection();
Console.WriteLine($"hello");  // Log the file path
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();

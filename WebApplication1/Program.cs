using Microsoft.AspNetCore.ResponseCompression;
using WebApplication1;
using WebApplication1.services;
using System.Data.SQLite; //deze wordt niet gebruikt, maar is later nodig voor de Database

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

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws" && context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        Console.WriteLine("WebSocket verbonden");

        var buffer = new byte[1024 * 4];

        while (webSocket.State == System.Net.WebSockets.WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == System.Net.WebSockets.WebSocketMessageType.Text)
            {
                var message = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine("Ontvangen: " + message);

                var response = $"Server ontving: {message}";
                var responseBytes = System.Text.Encoding.UTF8.GetBytes(response);
                await webSocket.SendAsync(new ArraySegment<byte>(responseBytes), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
            }

            if (result.MessageType == System.Net.WebSockets.WebSocketMessageType.Close)
            {
                Console.WriteLine("WebSocket gesloten");
                await webSocket.CloseAsync(System.Net.WebSockets.WebSocketCloseStatus.NormalClosure, "Gesloten", CancellationToken.None);
            }
        }
    }
    else
    {
        await next();
    }
});

app.MapHub<GameHub>("/gamehub");
app.MapRazorPages();

app.MapFallbackToFile("index.html"); // Blazor/Razor fallback

Console.WriteLine($"hello");

app.Run();

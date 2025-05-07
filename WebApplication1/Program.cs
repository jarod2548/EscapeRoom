using Microsoft.AspNetCore.ResponseCompression;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddRazorPages();

builder.Logging.ClearProviders(); // Clears existing logging providers
builder.Logging.AddConsole(); // Add Console logging
builder.Logging.AddDebug(); // Add Debug logging

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts(); // Enforces HTTPS
}

// Add security headers to prevent malicious attacks
app.Use(async (context, next) =>
{
    // Adding HTTP headers for security
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains"); // Enforces HTTPS
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff"); // Prevents content type sniffing
    context.Response.Headers.Add("X-Frame-Options", "DENY"); // Prevents clickjacking by disallowing embedding in frames
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self';"); // Restricts where content can be loaded from (adjust this based on your needs)

    await next();
});

app.UseHttpsRedirection();
Console.WriteLine($"hello");  // Log the file path
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();

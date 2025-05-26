// WebApplication1/services/WebSocketHandler.cs
using System.Net.WebSockets;
using System.Text;

public class WebSocketHandler
{
    public async Task HandleAsync(HttpContext context)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var buffer = new byte[1024 * 4];

        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

            Console.WriteLine($"Ontvangen: {message}");

            var response = Encoding.UTF8.GetBytes("Echo: " + message);
            await webSocket.SendAsync(new ArraySegment<byte>(response), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}

# C# Integration Guide (examples)

This document provides lightweight examples and guidance for integrating a C# (ASP.NET Core) backend with the PayPlate frontend. We do NOT add a full server project here — the code below is a snippet you can copy into your preferred ASP.NET project.

## Minimal API example (ASP.NET Core)

```csharp
// Program.cs (ASP.NET Core 6+ minimal API)
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/restaurants", () => new[] {
    new { id = "greenhouse-deli", name = "Greenhouse Deli", cuisine = "Bowls · Smoothies" }
});

app.MapGet("/api/menu", () => new[] {
    new { id = "harvest-bowl", restaurantId = "greenhouse-deli", name = "Harvest Bowl", priceCents = 8600 }
});

app.Run();
```

## Calling from the frontend

Use fetch or your preferred HTTP client to call the API.

```ts
const restaurants = await fetch('/api/restaurants').then(r => r.json());
```

## Notes
- If you want a full sample server in this repository, I can add an isolated `/api` folder with an ASP.NET Core template, but that requires the .NET SDK in CI and additional maintenance.
- This snippet is intentionally minimal so you can copy it into any backend project.

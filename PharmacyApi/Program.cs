using PharmacyApi.Application;
using PharmacyApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Dependency injection: JSON-file repositories behind interfaces
builder.Services.AddSingleton<IMedicineRepository, JsonMedicineRepository>();
builder.Services.AddSingleton<ISaleRepository, JsonSaleRepository>();
builder.Services.AddSingleton<MedicineService>();
builder.Services.AddSingleton<SaleService>();

// CORS: allow the React dev server to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(); // available at /swagger

app.UseCors("AllowReactApp");
app.MapControllers();

app.Run();

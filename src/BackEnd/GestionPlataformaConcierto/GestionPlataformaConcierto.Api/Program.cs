using GestionPlataformaConcierto.BW.CU;
using GestionPlataformaConcierto.BW.Interfaces.BW;
using GestionPlataformaConcierto.BW.Interfaces.DA;
using GestionPlataformaConcierto.DA.Acciones;
using GestionPlataformaConcierto.DA.Config;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GestionDePlataformaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));  

builder.Services.AddScoped<IGestionarConciertoDA, GestionarConciertoDA>();
builder.Services.AddScoped<IGestionarConciertoBW, GestionarConciertoBW>();
builder.Services.AddScoped<IGestionarUsuarioDA, GestionarUsuarioDA>();
builder.Services.AddScoped<IGestionarUsuarioBW, GestionarUsuarioBW>();
builder.Services.AddScoped<IGestionarReservaDA, GestionarReservaDA>();
builder.Services.AddScoped<IGestionarReservaBW, GestionarReservaBW>();

var app = builder.Build();

// Habilitar CORS antes de los controladores
app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

/*
================================================================================
    SCRIPT DEFINITIVO PARA REINICIAR LA BASE DE DATOS PLATAFORMACONCIERTOSDB
================================================================================
    Instrucciones: Ejecutar este script completo.
    1. Borrará todas las tablas existentes en el orden correcto.
    2. Creará la estructura de tablas final y correcta.
    3. Insertará los datos de prueba necesarios para testear los reportes.
*/

-- Usar la base de datos correcta
USE PlataformaConciertosDB;
GO

-- ==================================================
--  PASO 1: BORRADO SEGURO DE TODAS LAS TABLAS
-- ==================================================
-- Se borran en orden inverso a las dependencias para evitar errores.
-- Se usa IF OBJECT_ID para que no falle si una tabla ya fue borrada.

IF OBJECT_ID('dbo.AsientoReserva', 'U') IS NOT NULL DROP TABLE dbo.AsientoReserva;
IF OBJECT_ID('dbo.Compra', 'U') IS NOT NULL DROP TABLE dbo.Compra;
IF OBJECT_ID('dbo.Reserva', 'U') IS NOT NULL DROP TABLE dbo.Reserva;
IF OBJECT_ID('dbo.Promocion', 'U') IS NOT NULL DROP TABLE dbo.Promocion;
IF OBJECT_ID('dbo.Venta', 'U') IS NOT NULL DROP TABLE dbo.Venta;
IF OBJECT_ID('dbo.ArchivoMultimedia', 'U') IS NOT NULL DROP TABLE dbo.ArchivoMultimedia;
IF OBJECT_ID('dbo.CategoriaAsiento', 'U') IS NOT NULL DROP TABLE dbo.CategoriaAsiento;
IF OBJECT_ID('dbo.Concierto', 'U') IS NOT NULL DROP TABLE dbo.Concierto;
IF OBJECT_ID('dbo.Usuario', 'U') IS NOT NULL DROP TABLE dbo.Usuario;
GO

-- ==================================================
--  PASO 2: CREACIÓN DE LA ESTRUCTURA DE TABLAS FINAL
-- ==================================================

-- Tablas base
CREATE TABLE Usuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(255) NOT NULL,
    CorreoElectronico NVARCHAR(255) NOT NULL,
    Contrasena NVARCHAR(MAX) NOT NULL,
    Rol NVARCHAR(255) NOT NULL
);

CREATE TABLE Concierto (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Descripcion NVARCHAR(MAX) NOT NULL,
    Fecha DATETIME NOT NULL,
    Lugar NVARCHAR(255) NOT NULL,
    Capacidad INT NOT NULL,
    UsuarioID INT NOT NULL
);

CREATE TABLE CategoriaAsiento (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    CantidadAsientos INT NOT NULL,
    ConciertoId INT NOT NULL,
    FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id)
);

-- Tablas de la lógica de compra
CREATE TABLE Reserva (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    ConciertoId INT NOT NULL,
    FechaHoraReserva DATETIME NOT NULL,
    FechaHoraExpiracion DATETIME NOT NULL,
    Estado NVARCHAR(20) NOT NULL,
    CONSTRAINT FK_Reserva_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id),
    CONSTRAINT FK_Reserva_Concierto FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id)
);

CREATE TABLE Compra (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReservaId INT NOT NULL,
    MetodoPago NVARCHAR(50) NOT NULL,
    PrecioTotal DECIMAL(18,2) NOT NULL,
    DescuentoAplicado DECIMAL(18,2) NOT NULL,
    FechaHoraCompra DATETIME NULL,
    PromocionAplicada NVARCHAR(100) NULL,
    CodigoQR NVARCHAR(255) NULL,
    Notificado BIT NOT NULL DEFAULT 0,
    Estado NVARCHAR(20) NOT NULL,
    CONSTRAINT FK_Compra_Reserva FOREIGN KEY (ReservaId)
        REFERENCES Reserva(Id)
        ON DELETE CASCADE
);

CREATE TABLE AsientoReserva (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReservaId INT NOT NULL,
    CompraId INT NULL,
    CategoriaAsientoId INT NOT NULL,
    NumeroAsiento INT NOT NULL,
    Precio DECIMAL(18,2) NOT NULL,
    Estado INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_AsientoReserva_Reserva FOREIGN KEY (ReservaId)
        REFERENCES Reserva(Id)
        ON DELETE CASCADE,
    CONSTRAINT FK_AsientoReserva_Compra FOREIGN KEY (CompraId)
        REFERENCES Compra(Id)
        ON DELETE NO ACTION,
    CONSTRAINT FK_AsientoReserva_CategoriaAsiento FOREIGN KEY (CategoriaAsientoId)
        REFERENCES CategoriaAsiento(Id)
);
GO

-- ==================================================
--  PASO 3: INSERCIÓN DE DATOS DE PRUEBA
-- ==================================================

-- Insertar Usuarios
INSERT INTO Usuario (NombreCompleto, CorreoElectronico, Contrasena, Rol)
VALUES
('Admin Promotor', 'admin@test.com', 'hash_fuerte_123', 'administrador'),
('Carlos Comprador', 'carlos@test.com', 'hash_fuerte_456', 'usuario');

-- Insertar Conciertos
INSERT INTO Concierto (Nombre, Descripcion, Fecha, Lugar, Capacidad, UsuarioID)
VALUES
('Concierto de Rock Sinfónico', 'Una noche épica.', '2025-10-25 20:00:00', 'Estadio Nacional', 10000, 1),
('Festival de Jazz Acústico', 'Noche de jazz.', '2025-11-15 18:00:00', 'Teatro Melico Salazar', 1000, 1);

-- Insertar Categorías de Asiento (Para Concierto 1)
INSERT INTO CategoriaAsiento (Nombre, Precio, CantidadAsientos, ConciertoId)
VALUES
('VIP', 75.50, 100, 1),
('General', 30.00, 900, 1);

-- Crear el flujo de compra completo para el Concierto 1
-- a. Se crea la Reserva
INSERT INTO Reserva (UsuarioId, ConciertoId, FechaHoraReserva, FechaHoraExpiracion, Estado)
VALUES
(2, 1, GETDATE(), DATEADD(minute, 15, GETDATE()), 'Comprado');

-- b. Se crea la Compra asociada a esa Reserva
DECLARE @ReservaId INT = SCOPE_IDENTITY();
INSERT INTO Compra (ReservaId, MetodoPago, FechaHoraCompra, PrecioTotal, DescuentoAplicado, Estado, Notificado)
VALUES
(@ReservaId, 'Tarjeta de Crédito', GETDATE(), 105.50, 0.00, 'Comprado', 1);

-- c. Se insertan los Asientos de esa Compra
DECLARE @CompraId INT = SCOPE_IDENTITY();
INSERT INTO AsientoReserva (CompraId, ReservaId, CategoriaAsientoId, NumeroAsiento, Precio)
VALUES
(@CompraId, @ReservaId, 1, 5, 75.50),
(@CompraId, @ReservaId, 2, 101, 30.00);

-- Verificación Final
SELECT '¡Base de datos recreada y poblada con éxito!' AS Estado;
GO

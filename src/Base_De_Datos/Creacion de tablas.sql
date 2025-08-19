
--SCRIPT BASE DE DATOS PLATAFORMACONCIERTOSDB


-- Crear la base de datos
CREATE DATABASE PlataformaConciertosDB;
GO

-- Usar la base de datos correcta
USE PlataformaConciertosDB;
GO

--  PASO 1: BORRADO DE TODAS LAS TABLAS

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

--  PASO 2: CREAR TABLASA

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

CREATE TABLE ArchivoMultimedia (
    Id INT PRIMARY KEY IDENTITY(1,1),
    NombreArchivo NVARCHAR(255) NOT NULL,
    Contenido VARBINARY(MAX) NOT NULL,
    Tipo NVARCHAR(50) NOT NULL,
    ConciertoId INT NOT NULL,
    FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id)
);
CREATE TABLE Venta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ConciertoId INT NOT NULL,
    FechaFin DATETIME NOT NULL,
    Estado INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Venta_Concierto FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id)
);

CREATE TABLE Promocion
(
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descuento INT NOT NULL,  
    Activa BIT NOT NULL,
	FechaFin DATETIME NOT NULL,
    ConciertoId INT NOT NULL, 
    FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id) ON DELETE CASCADE
);

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


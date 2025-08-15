-- Crear la base de datos
CREATE DATABASE PlataformaConciertosDB;
GO

-- Usar la base de datos creada
USE PlataformaConciertosDB;
GO

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

CREATE TABLE Usuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(255) NOT NULL,
    CorreoElectronico NVARCHAR(255) NOT NULL,
    Contrasena NVARCHAR(MAX) NOT NULL,
    Rol NVARCHAR(255) NOT NULL
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
    FechaHoraCompra DATETIME NULL,
    PrecioTotal DECIMAL(18,2) NOT NULL,
    DescuentoAplicado DECIMAL(18,2) NOT NULL,
    PromocionAplicada NVARCHAR(100) NULL,
    CodigoQR NVARCHAR(200) NULL,
    Notificado BIT NOT NULL,
    Estado NVARCHAR(50) NOT NULL

    CONSTRAINT [FK_Compra_Reserva] FOREIGN KEY ([ReservaId])
        REFERENCES [dbo].[Reserva] ([Id])
        ON DELETE CASCADE
);


CREATE TABLE AsientoReserva (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompraId INT NULL,
    ReservaId INT NOT NULL,
    CategoriaAsientoId INT NOT NULL,
    NumeroAsiento INT NOT NULL,
    Precio DECIMAL(18,2) NOT NULL,
    
    CONSTRAINT FK_AsientoReserva_Compra FOREIGN KEY (CompraId)
        REFERENCES Compra(Id)
        ON DELETE SET NULL,
    
    CONSTRAINT FK_AsientoReserva_Reserva FOREIGN KEY (ReservaId)
        REFERENCES Reserva(Id),
    
    CONSTRAINT FK_AsientoReserva_CategoriaAsiento FOREIGN KEY (CategoriaAsientoId)
        REFERENCES CategoriaAsiento(Id)
);


CREATE TABLE Venta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ConciertoId INT NOT NULL,
    FechaFin DATETIME NOT NULL,
    Estado INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Venta_Concierto FOREIGN KEY (ConciertoId) REFERENCES Concierto(Id)
);



DROP TABLE dbo.Compra;


Select *
From Compra



Select *
From dbo.AsientoReserva

SELECT * FROM CategoriaAsiento;

Select * 
From dbo.Usuario

Select * 
From dbo.Concierto
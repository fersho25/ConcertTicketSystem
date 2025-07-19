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




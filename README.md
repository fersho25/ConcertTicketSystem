# Sistema de Reserva de Tiquetes para Conciertos

Este proyecto es una plataforma integral diseñada para simplificar y optimizar la experiencia de los usuarios al comprar tiquetes para eventos musicales. Construido con una arquitectura limpia, separa claramente la lógica de negocio de la infraestructura y la presentación.

---

## Características Principales

- **Gestión de Conciertos:** Permite a administradores y promotores registrar, editar y listar eventos.
- **Gestión de Usuarios y Roles:** Control de acceso robusto con tres roles definidos: Administrador, Promotor y Cliente.
- **Reserva y Compra Segura:** Mapa interactivo de asientos con disponibilidad en tiempo real, reserva temporal y pasarelas de pago (Stripe/PayPal).
- **Historial de Actividades:** Los usuarios pueden consultar sus reservas, compras y reimprimir tiquetes.
- **Reportes y Analíticas:** Generación de reportes de ventas dinámicos, exportables a PDF y Excel.
- **Notificaciones:** Alertas y recordatorios por correo electrónico para mantener informados a los usuarios.
- **Soporte Multimoneda:** Conversión automática de precios según la localización del usuario.

---

## Tecnologías Utilizadas

- **Backend:** .NET Core (C#)
- **Frontend:** Ionic Framework (Multiplataforma iOS/Android)
- **Base de Datos:** SQL Server
- **ORM:** Entity Framework Core
- **API:** RESTful API para la comunicación entre backend y frontend.

---

## Arquitectura

El proyecto sigue los principios de **Arquitectura Limpia (Clean Architecture)**, dividiendo el backend en las siguientes capas:

- **`Domain`**: Contiene las entidades y reglas de negocio principales. No tiene dependencias externas.
- **`Application`**: Orquesta los casos de uso y la lógica de la aplicación. Define interfaces que la infraestructura debe implementar.
- **`Infrastructure`**: Contiene las implementaciones de las interfaces, como el acceso a la base de datos (Persistence) y servicios de terceros.
- **`Presentation`**: La capa de API (`ConcertTicketSystem.Api`) que expone los endpoints para ser consumidos por el cliente.

---

## Cómo Empezar

### **Prerrequisitos**
- [.NET SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)
- [Node.js y npm](https://nodejs.org/en/)
- [Ionic CLI](https://ionicframework.com/docs/cli) (`npm install -g @ionic/cli`)

### **Configuración del Backend**
1. Clona el repositorio: `git clone <URL_DEL_REPOSITORIO>`
2. Abre el archivo `ConcertTicketSystem.sln` con Visual Studio.
3. Configura la cadena de conexión a tu base de datos en el archivo `appsettings.json` dentro del proyecto `ConcertTicketSystem.Api`.
4. Abre la consola del administrador de paquetes (`Tools > NuGet Package Manager > Package Manager Console`) y ejecuta `Update-Database` para crear las tablas.
5. Inicia el proyecto `ConcertTicketSystem.Api` (presionando F5 o el botón de play).

### **Configuración del Frontend**
1. Navega a la carpeta del frontend: `cd src/Frontend/ionic-app`
2. Instala las dependencias: `npm install`
3. Inicia la aplicación de Ionic: `ionic serve`

La aplicación móvil se abrirá en tu navegador y se conectará al backend que ya está corriendo.
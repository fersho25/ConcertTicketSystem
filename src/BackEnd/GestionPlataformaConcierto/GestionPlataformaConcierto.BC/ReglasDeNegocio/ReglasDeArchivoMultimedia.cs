using GestionPlataformaConcierto.BC.Modelos;

namespace GestionPlataformaConcierto.BC.ReglasDeNegocio
{
    public class ReglasDeArchivoMultimedia  
        
    {

        // Tamaño máximo permitido (10 MB)
        private const int TamanioMaximoEnBytes = 10 * 1024 * 1024;

        // Lista de tipos permitidos
        private static readonly List<string> TiposPermitidos = new List<string>
        {
            "image/jpeg", // JPG
            "image/png",  // PNG
            "video/mp4"   // MP4
        };

        public static bool ElArchivoEsValido(ArchivoMultimedia archivoMultimedia)
        {
            return ElTipoEsValido(archivoMultimedia) 
                   && ElTamanioEsValido(archivoMultimedia);
        }

        public static bool ElTipoEsValido(ArchivoMultimedia archivoMultimedia)
        {
            return !string.IsNullOrEmpty(archivoMultimedia.Tipo) && TiposPermitidos.Contains(archivoMultimedia.Tipo.ToLower());
        }

        public static bool ElTamanioEsValido(ArchivoMultimedia archivoMultimedia)
        {
            return archivoMultimedia.Contenido != null && archivoMultimedia.Contenido.Length <= TamanioMaximoEnBytes;
        }

        public static bool elIdEsValido(int id)
        {
            return id > 0;

        }
    }
}
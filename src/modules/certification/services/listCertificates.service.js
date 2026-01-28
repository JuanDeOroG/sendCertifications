const fs = require('fs');
const path = require('path');

// Ruta absoluta a la carpeta de certificados
const CERTIFICATES_DIR = path.resolve(__dirname, '../../../../storage/certificates');
console.log('Ruta absoluta CERTIFICATES_DIR:', CERTIFICATES_DIR);

function listCertificateFolders(userId) {
  if (!fs.existsSync(CERTIFICATES_DIR)) return [];
  const folders = fs.readdirSync(CERTIFICATES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const folderPath = path.join(CERTIFICATES_DIR, dirent.name);
      const stats = fs.statSync(folderPath);

      // Listar subcarpetas
      const correos = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(subdirent => subdirent.isDirectory())
        .map(subdirent => {
          const correoPath = path.join(folderPath, subdirent.name);
          // Buscar archivos PDF dentro de la carpeta del correo
          const archivos = fs.readdirSync(correoPath)
            .filter(file => file.endsWith('.pdf'))
            .map(file => ({
              nombre: file,
              path: `/certificates/${dirent.name}/${subdirent.name}/${file}`
            }));
          return {
            correo: subdirent.name,
            path: `/certificates/${dirent.name}/${subdirent.name}`,
            certificados: archivos
          };
        });

      return {
        nombre: dirent.name,
        path: `/certificates/${dirent.name}`,
        fechaCreacion: stats.birthtime,
        descargadoPor: userId,
        estudiantes: correos
      };
    });
  return folders;
}

module.exports = { listCertificateFolders };
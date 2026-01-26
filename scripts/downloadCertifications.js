const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function login(page, usuario, contrasena) {
  // navega a la página principal
  await page.goto('https://appbaq.barranquilla.gov.co:8989/centros/');

  // haz clic en el enlace "Ingresar"
  await page.click('a:has-text("Ingresar")');

  // espera que aparezcan los inputs
  await page.waitForSelector('input[placeholder="Ingrese su número de identificación"]');
  await page.waitForSelector('input[placeholder="Ingrese su contraseña"]');

  // llena el campo de identificación
  await page.fill('input[placeholder="Ingrese su número de identificación"]', usuario);

  // llena el campo de contraseña
  await page.fill('input[placeholder="Ingrese su contraseña"]', contrasena);

  // haz clic en el botón de login
  await page.click('button:has-text("Ingresar")');

  // pausa la ejecución para inspeccionar el navegador
  // await page.pause();

  console.log('Credenciales ingresadas');
}

async function downloadCertificates(page, sedeSalon) {
  // espera que la tabla de usuarios esté cargada
  await page.waitForSelector('table.user-tables');

  // obtiene todas las filas de la tabla
  const filas = await page.$$('table.user-tables tr');

  // Obtener la fecha y hora actual en formato YYYY-MM-DD_HH-mm-ss
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10);
  const hora = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  const fechaHoraActual = `${fecha}_${hora}`;

  for (const fila of filas) {
    // busca el botón "Descargar Certificado" en la fila
    const botonDescargar = await fila.$('button:has-text("Descargar Certificado")');
    if (botonDescargar) {
      // obtiene el correo electrónico de la fila (tercera columna)
      const correoTd = await fila.$('td:nth-child(3)');
      const correo = await correoTd.innerText();

      // crea la carpeta con sede-salon, fecha y hora, y correo en storage/certificates
      const carpetaDestino = path.join(__dirname, '..', 'storage', 'certificates', `${sedeSalon}_${fechaHoraActual}`, correo);
      if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true });
      }

      // espera el evento de descarga y guarda el archivo en la carpeta
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        botonDescargar.click()
      ]);
      const nombreArchivo = await download.suggestedFilename();
      let rutaFinal = path.join(carpetaDestino, nombreArchivo);

      // si el archivo ya existe, agrega un número incremental al nombre
      if (fs.existsSync(rutaFinal)) {
        const ext = path.extname(nombreArchivo);
        const base = path.basename(nombreArchivo, ext);
        let contador = 2;
        do {
          rutaFinal = path.join(carpetaDestino, `${base}_${contador}${ext}`);
          contador++;
        } while (fs.existsSync(rutaFinal));
      }

      await download.saveAs(rutaFinal);
    }
  }
  console.log('Descarga de certificados finalizada');
}


async function execute(user, password, classroom) {
  const browser = await chromium.launch({
    executablePath: path.join(__dirname, 'ms-playwright', 'chromium-1181', 'chrome.exe'),
    headless: true // visible -> false --- No visible -> true
  });
  const page = await browser.newPage();

  await login(page, user, password);

  await page.waitForSelector('table.user-tables');

  // obtiene todas las filas activas
  const filasActivas = await page.$$('tr:has(td.active)');

  if (!filasActivas || filasActivas.length === 0) {
    console.log('No se encontraron aulas activas.');
    await browser.close();
    return { valid: false, message: 'No se encontraron aulas activas.' };
  }

  let found = false;
  for (let i = 0; i < filasActivas.length; i++) {
    await page.waitForSelector('table.user-tables');
    const filasActivasActualizadas = await page.$$('tr:has(td.active)');
    const filaActual = filasActivasActualizadas[i];
    const sedeSalonTd = await filaActual.$('td:nth-child(5)');
    const sedeSalon = await sedeSalonTd.innerText();
    if (sedeSalon === classroom) {
      const botonAsistencia = await filaActual.$('button:has-text("Asistencia")');
      if (botonAsistencia) {
        await botonAsistencia.click();
        await downloadCertificates(page, sedeSalon);
        found = true;
        break;
      }
    }
  }

  await browser.close();
  if (found) {
    return { valid: true, message: 'Certificados descargados correctamente.' };
  } else {
    return { valid: false, message: 'No se encontró el aula especificada.' };
  }
}

module.exports = { execute };
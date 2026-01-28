const downloadCertificationService = require("./services/downloadCertification.service")



async function downloadCertifications(req, res){

    try {

        const result = await downloadCertificationService.download(req.validatedData);

        if(!result.valid){
            return res.status(400).json({message:result.message})
        }

        return res.status(200).json({message:"Certificados Descargados Correctamente.", data: result})

        
    } catch (error) {
        return res.status(500).json({message: "No se pudo realizar la descarga de Certificados Correctamente. Intentelo de nuevo o comuniquese con soporte."})
    }
}


const ListCertificationService = require("./services/listCertificates.service");

function index(req, res) {
    try {
        // Pasar el id del usuario autenticado a la función de servicio
        const userId = req.user && req.user.userId ? req.user.userId : null;
        const folders = ListCertificationService.listCertificateFolders(userId);
        return res.status(200).json(folders);
    } catch (error) {
        return res.status(500).json({ message: 'Error al listar carpetas', error: error.message });
    }
}

module.exports = {downloadCertifications, index}
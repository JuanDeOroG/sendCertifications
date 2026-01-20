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

module.exports = {downloadCertifications}
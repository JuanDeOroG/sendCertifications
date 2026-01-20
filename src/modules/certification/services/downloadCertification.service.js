const downloadCertificationsScript = require("../../../../scripts/downloadCertifications")


async function download(data){

        const user = data.user
        const password = data.password
        const classroom = data.classroom
        return downloadCertificationsScript.execute('1044638320',"1044638320", "CATIN Inocencio Chinca - Capacitación")
        
}




module.exports = {download}
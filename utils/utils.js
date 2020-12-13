const fs = require('fs');
const path = require('path');

function reqBodyParsing(req){
    return new Promise((resolve,reject) => {
        try{
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();;
            });
            req.on('end', () => {
                resolve(body);
            });
        }catch(error){
            reject(error)
        }
    });
}

function writeDataToFile(filename,content){
    fs.writeFileSync(path.resolve(filename),JSON.stringify(content),'utf8',(err)=>{
        if(err){
            console.log('write stream', err)
        }
    })
}

function typeCheck(value,type){
    return (typeof(value) === type)
}


module.exports = {
    reqBodyParsing,
    writeDataToFile,
    typeCheck
}
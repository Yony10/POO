
const mongoose = require('mongoose')
require('dotenv').config()

class DataBase{
    constructor(){
        this.connect()
    }


    connect(){
        mongoose.connect(process.env.MONGODB_URI,{

        })
        .then(() => console.log("Conexion exitosa a bd"))
         .catch((err) =>console.log('fallo al conectar',err));
    }

    static obtenerConexion(){
        if(!DataBase.instancia){
            DataBase.instancia=new DataBase()
        }

        return DataBase.instancia;
    }
}

 module.exports=DataBase.obtenerConexion();





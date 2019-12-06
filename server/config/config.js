// ================================
//              Puerto
//=================================

process.env.PORT = process.env.PORT || 3000;
//=====================
//Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//Vencimiento del Token
//=====================
//60 segundos
//60 minutos
//24 horas
//30días
process.env.CADUCIDAD_TOKEN = '48h';


//=====================
//SEED de autenticación
//=====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=====================
//Base de datos
//=====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//=====================
//Google Client ID
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '394567862681-in3pfu5o8ffis4p2hbnosuho3m6555m0.apps.googleusercontent.com';
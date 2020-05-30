var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    username: { type: String, unique: true, required: [true, 'El nombre de usuario es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    email: { type: String },
    telf: { type: String },
    pais: { type: String },
    provincia: { type: String },
    ciudad: { type: String },
    direccion: { type: String },
})

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);
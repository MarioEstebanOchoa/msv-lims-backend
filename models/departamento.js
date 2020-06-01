var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var departamentoSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String },
    responsable: { type: Schema.Types.ObjectId, ref: 'Usuario' }
})

departamentoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model('Departamento', departamentoSchema);
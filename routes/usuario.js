var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Usuario = require('../models/usuario');

//================================
//Obtener Usuarios
//================================

app.get('/', (req, res) => {


    Usuario.find({}, 'nombre username email role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    })
                }


                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios,
                        total: conteo
                    })

                })

            }
        )
});

//================================
//Obtener un usuario
//================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { mensaje: 'No existe un usuario con ese ID' }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuario
        })

    })

})

//================================
//Crea un nuevo usuario
//================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        username: body.username,
        password: bcrypt.hashSync(body.password, 10),
        email: body.email,
        telf: body.telf,
        pais: body.pais,
        provincia: body.provincia,
        ciudad: body.ciudad,
        direccion: body.direccion,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        })
    })
});

//================================
//Actualizar usuario
//================================


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { mensaje: 'No existe un usuario con ese ID' }
            })
        }

        console.log(body.password);

        if (body.password) {
            usuario.password = bcrypt.hashSync(body.password, 10)
        }

        usuario.nombre = body.nombre;
        usuario.username = body.username;
        usuario.role = body.role;
        usuario.email = body.email;
        usuario.telf = body.telf;
        usuario.pais = body.pais;
        usuario.provincia = body.provincia;
        usuario.ciudad = body.ciudad;
        usuario.direccion = body.direccion;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }

            usuarioGuardado.password = ':)'

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })
})

//================================
//  Borrar un usuario por el ID
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            })
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})



module.exports = app;
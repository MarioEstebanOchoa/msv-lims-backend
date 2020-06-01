var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Departamento = require('../models/departamento');


//================================
// Obtener departamento by ID
//================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Departamento.findById(id)
        .exec((err, departamento) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar departamento',
                    errors: err
                });
            }

            if (!departamento) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El departamento con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un departamento con ese ID '
                    }
                });
            }

            res.status(200).json({
                ok: true,
                departamento: departamento
            });

        })
})

//================================
//Obtener Departamentos
//================================

app.get('/', (req, res) => {

    Departamento.find({})
        .populate('responsable', 'nombre email')
        .exec(
            (err, departamentos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando departamentos',
                        errors: err
                    })
                }

                Departamento.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        departamentos,
                        total: conteo
                    })

                })
            }
        )
});

//================================
//Crea un nuevo departamento
//================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    console.log(body);
    var departamento = new Departamento({
        nombre: body.nombre,
        descripcion: body.descripcion,
        responsable: body.responsable
    });

    departamento.save((err, departamentoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear departamento',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            departamento: departamentoGuardado,
        })
    })
});

//================================
//Actualizar departamento
//================================


app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Departamento.findById(id, (err, departamento) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar departamento',
                errors: err
            })
        }

        if (!departamento) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El departamento con el id: ' + id + ' no existe',
                errors: { mensaje: 'No existe un departamento con ese ID' }
            })
        }


        departamento.nombre = body.nombre;
        departamento.descripcion = body.descripcion;
        departamento.responsable = body.responsable;

        departamento.save((err, departamentoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar departamento',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                departamento: departamentoGuardado
            })
        })
    })
})

//================================
//  Borrar un departamento por el ID
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Departamento.findByIdAndRemove(id, (err, departamentoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar departamento',
                errors: err
            })
        }

        if (!departamentoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un departamento con ese ID',
                errors: { message: 'No existe un departamento con ese ID' }
            })
        }

        res.status(200).json({
            ok: true,
            departamento: departamentoBorrado
        })
    })
})



module.exports = app;
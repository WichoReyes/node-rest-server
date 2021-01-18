const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
//Nomenclatura para los objetos empezar con mayúscula 
const Usuario = require('../models/usuario');
const { findById } = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    //hacemos el string a un número
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // .find y exec nos permite buscar en la base de datos, desplegando todos los usuarios o desplegando ciertos usuarios
    // de acuerdo a alguna condicion   
    // Se agrega un string con los campos que se requieren regresar
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    //objeto de tipo usuario con todos los parametros que le llegan
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //pick es un metodo de underscore.js que sirve para regresar una copia del objeto
    //filtrando solo los valores que nosotros deseamos 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);

    //Sirve para encontrar a un usuario por medio de su id y actualizar la informacion que se necesita
    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //Cambia su estado del usuario a false, que es similar a borrarlo
    Usuario.findOneAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


    //Borra usuarios directamente de la base de datos

    /*
     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
               ok: false,
               err
            });
        }

    if (!usuarioBorrado) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario no encontrado'
            }
        });
    }
    res.json({
        ok: true,
        usuario: usuarioBorrado
    });
    */
});
module.exports = app;
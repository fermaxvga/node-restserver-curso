const exprees = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = exprees();
let Producto = require('../models/producto');


//============
//Obtener productos
//===========


app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

//===========================
// Obtener un producto por ID
//===========================

app.get('/productos/:id', (req, res) => {
    //traer 1 producto
    //populate usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Id no existe"
                    }
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoDB
            })
        });
});


//=================
// Buscar Productos
//=================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })

})

app.post('/productos', verificaToken, (req, res) => {
    //grabar usauri
    //una una categria del dlistado
    let body = req.body;
    //  let categoria = req.categoria;
    // let usuario = req.usuario;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });

});


//act un producto
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //graba una categoria del listado
    let id = req.params.id;
    let body = req.body;

    /*  let descProducto = {
          nombre: body.nombre,
          precioUni: body.precioUni,
          descripcion: body.descripcion,
          disponible: body.disponible,
      }*/
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });


});



app.delete('/productos/:id', (req, res) => {
    //cambiar el estado disponible
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id no existe"
                }
            });
        }
        productoDB.disponible = false,
            productoDB.save((err, productoBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err

                    });
                }
                res.status(200).json({
                    ok: true,
                    producto: productoBorrado,
                    mensaje: 'Se borró el producto'
                });
            });
    });
});

module.exports = app;
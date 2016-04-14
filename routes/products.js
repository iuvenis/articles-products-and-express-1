'use strict';
const express = require('express'),
      router = express.Router(),
      productDB = require('../db/products');

router.route('/')
  .get ((req, res) => {
    res.render('index', {
      products: productDB.products,
    });
  })
  .post((req, res) => {
    let newProduct = ({
      'name': req.body.name,
      'price': req.body.price,
      'inventory': req.body.inventory
    });

    Object.defineProperty(newProduct,'id',{
      value: productDB.products.length,
      enumerable: true,
      writable: false,
      configurable: false
    });

    productDB.products.push(newProduct);
    res.json({ success: true });
  });

router.route('/:id/edit')
  .get( (req,res) => {
    let id = req.params.id;
    res.render('edit', {
      product : productDB.products[id]
    });
  });

router.route('/new')
  .get( (req,res) => {
    res.render('new');
  });

router.route('/:id')
  .put((req, res) => {
    let id = req.params.id;
    if (productDB.products.length === 0) {
      return res.status(400).send('Bad Request: There are no products');
    }
    else {
      let product = productDB.products[id];
        for (let prop in req.body) {
          try {
            if (product.hasOwnProperty(prop)){
              product[prop] = req.body[prop];
            }
          }
          catch(err){
            return res.send('Invalid Request: Field Cannot Be Changed');
          }
        }
        res.send(productDB);
    }
  })
  .delete((req,res) => {
    let id = req.params.id;

    if (productDB.products.length === 0) {
      return res.status(400).send('Bad Request: There are no products');
    }
    else{
      let product = productDB.products[id];
      for (var prop in product){
        let d = Object.getOwnPropertyDescriptor(product, prop);
        if(d.writable === true){
          product[prop] = null;
        }
      }
    }

    res.json({success: true});

  });


module.exports = router;
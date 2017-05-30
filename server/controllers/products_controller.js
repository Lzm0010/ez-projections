//my 3rd party modules
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//products model
const {Company} = require('./../models/company');
const {Product} = require('./../models/product');

module.exports = {
  //create
  create(req, res) {
    let compId = req.params.id;
    let product = new Product({
      name: req.body.name,
      _company: compId
    });

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('products')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        product.save().then((product) => {
          comp.products.push(product);
          comp.save()
          .then(comp => {
            res.send(comp);
          }), (err) => {
            if (err) {
              res.status(400).send(err);
            }
          }
        }, (err) => {
          if (err) {
            res.status(400).send(err);
          }
        });
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //get all
  index(req, res) {
    let compId = req.params.id;

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('products')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        res.send(comp.products);
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //get specific
  findIt(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('products')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Product.findOne({_id: proId, _company: compId}).then((product) => {
          if(!product){
            return res.status(404).send();
          }

          res.send({product})
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //update
  update(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;
    let body = _.pick(req.body, ['name']);

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(proId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('products')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Product.findOneAndUpdate({_id: proId, _company: compId}, {$set: body}, {new: true}).then((product) => {
          if(!product){
            return res.status(404).send();
          }

          res.send({product});
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //delete
  delete(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(proId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('products')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Product.findOne({_id: proId, _company: compId}).then((product) => {
          if(!product) {
            return res.status(404).send();
          }

          product.remove().then(() => {
            res.status(200).send();
          }).catch((err) => res.status(400).send(err));
        }).catch((err) => res.status(400).send(err));
      }).catch((err) => res.status(400).send(err));
  }
};

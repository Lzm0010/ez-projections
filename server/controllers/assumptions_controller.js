//my 3rd party modules
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//assumptions model
const {Assumption} = require('./../models/assumption');

module.exports = {
  //create
  create(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;
    let assumption = new Assumption({
      _category: req.body._category,
      _product: proId,
      name: req.body.name,
      valueType: req.body.valueType,
      value: req.body.value
    });

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Product.findOne(
      {
        _id: proId,
        _company: compId
      })
      .populate('assumptions')
      .then((product) => {
        if(!product) {
          return res.status(404).send();
        }

        assumption.save().then((assumption) => {
          product.assumptions.push(assumption);
          product.save()
          .then(product => {
            res.send(product);
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
    let proId = req.params.proId;

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Product.findOne(
      {
        _id: proId,
        _company: compId
      })
      .populate('assumptions')
      .then((product) => {
        if(!product) {
          return res.status(404).send();
        }

        res.send(product.assumptions);
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //update
  update(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;
    let assId = req.params.assId;
    let body = _.pick(req.body, ['name', '_category', 'valueType', 'value']);

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(proId) || !ObjectID.isValid(assId)){
      return res.status(404).send();
    }

    Product.findOne(
      {
        _id: proId,
        _company: compId
      })
      .populate('assumptions')
      .then((product) => {
        if(!product) {
          return res.status(404).send();
        }

        Assumption.findOneAndUpdate({_id: assId, _product: proId}, {$set: body}, {new: true}).then((assumption) => {
          if(!assumption){
            return res.status(404).send();
          }

          res.send({assumption});
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //delete
  delete(req, res) {
    let compId = req.params.id;
    let proId = req.params.proId;
    let assId = req.params.assId;

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(proId) || !ObjectID.isValid(assId)){
      return res.status(404).send();
    }

    Product.findOne(
      {
        _id: proId,
        _company: compId
      })
      .populate('assumptions')
      .then((product) => {
        if(!product) {
          return res.status(404).send();
        }

        Assumption.findOne({_id: assId, _product: proId}).then((assumption) => {
          if(!assumption){
            return res.status(404).send();
          }

          assumption.remove().then(() => {
            res.status(200).send();
          }).catch((err) => res.status(400).send(err));
        }).catch((err) => res.status(400).send(err));
      }).catch((err) => res.status(400).send(err));
  }
};

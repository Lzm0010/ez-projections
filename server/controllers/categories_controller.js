//CATEGORIES CONTROLLER
//my 3rd party modules
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//relevant models
const {Company} = require('./../models/company');
const {Category} = require('./../models/category');

module.exports = {
  // create category for a company
  create(req, res) {
    let compId = req.params.id;
    let category = new Category({
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
      .populate('categories')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        category.save().then((category) => {
          comp.categories.push(category);
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
  //get all categories for company
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
      .populate('categories')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        res.send(comp.categories);
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //update category
  update(req, res) {
    let compId = req.params.id;
    let catId = req.params.catId;
    let body = _.pick(req.body, ['name']);

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(catId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('categories')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Category.findOneAndUpdate({_id: catId, _company: compId}, {$set: body}, {new: true}).then((cat) => {
          if(!cat){
            return res.status(404).send();
          }

          res.send({cat});
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //delete category
  delete(req, res) {
    let compId = req.params.id;
    let catId = req.params.catId;

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(catId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('categories')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        // comp.removeCategory(catId).then()

        Category.findOneAndRemove({_id: catId, _company: compId}).then((cat) => {
          if(!cat) {
            return res.status(404).send();
          }
          res.send({cat});
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => res.status(400).send(err));
  }
};

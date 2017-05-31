//COMPANIES CONTROLLER
//my 3rd party modules
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//company model
const {Company} = require('./../models/company');

module.exports = {
  //create a company
  create(req, res) {
    let company = new Company ({
      name: req.body.name,
      _creator: req.user._id
    });

    company.save().then((comp) => {
      res.send(comp);
    }, (err) => {
      if (err) {
        res.status(400).send(err);
      }
    });
  },
  //get all companies associated w/ user
  index(req, res) {
    Company.find({_creator: req.user._id})
    .populate('_creator')
    .populate('categories')
    .populate({
      path:'rules',
      populate: {
        path:'_category',
        model: 'Category'
      }
    })
    .populate({
      path:'products',
      populate: {
        path: 'assumptions',
        model: 'Assumption',
        populate: {
          path: '_category',
          model: 'Category'
        }
      }
    })
    .then((companies) => {
      res.send({companies});
    }, (err) => {
      return res.status(400).send(err);
    });
  },
  //get specific company
  findIt(req, res) {
    let id = req.params.id;

    if (!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: id,
        _creator: req.user._id
      })
      .populate('_creator')
      .populate('categories')
      .populate({
        path:'rules',
        populate: {
          path:'_category',
          model: 'Category'
        }
      })
      .populate({
        path:'products',
        populate: {
          path: 'assumptions',
          model: 'Assumption',
          populate: {
            path: '_category',
            model: 'Category'
          }
        }
      })
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        res.send({comp});
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //update company
  update(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name']);

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Company.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
    .populate('categories')
    .then((comp) => {
      if (!comp) {
        return res.status(404).send();
      }

      res.send({comp});
    }).catch((err) => res.status(400).send(err));
  },
  //delete a company
  delete(req, res) {
    let id = req.params.id;

    if (!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    Company.findOne({_id: id, _creator: req.user._id}).then((comp) => {
      if(!comp) {
        return res.status(404).send();
      }
      comp.remove().then(() => {
        res.status(200).send();
      }).catch((err) => res.status(400).send(err));
    }).catch((err) => res.status(400).send(err));
  }
};

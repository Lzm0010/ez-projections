//my 3rd party modules
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//rules model
const {Company} = require('./../models/company');
const {Rule} = require('./../models/rule');

module.exports = {
  //create
  create(req, res) {
    let compId = req.params.id;
    let rule = new Rule({
      name: req.body.name,
      _category: req.body._category,
      _company: compId,
      rule: req.body.rule
    });

    if (!ObjectID.isValid(compId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('rules')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        rule.save().then((rule) => {
          comp.rules.push(rule);
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
      .populate('rules')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        res.send(comp.rules);
      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //update
  update(req, res) {
    let compId = req.params.id;
    let rulId = req.params.rulId;
    let body = _.pick(req.body, ['name', '_category', 'rule']);

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(rulId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('rules')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Rule.findOneAndUpdate({_id: rulId, _company: compId}, {$set: body}, {new: true}).then((rule) => {
          if(!rule){
            return res.status(404).send();
          }

          res.send({rule});
        }).catch((err) => res.status(400).send(err));

      }).catch((err) => {
        res.status(400).send(err);
      });
  },
  //delete
  delete(req, res) {
    let compId = req.params.id;
    let rulId = req.params.rulId;

    if (!ObjectID.isValid(compId) || !ObjectID.isValid(rulId)){
      return res.status(404).send();
    }

    Company.findOne(
      {
        _id: compId,
        _creator: req.user._id
      })
      .populate('rules')
      .then((comp) => {
        if(!comp) {
          return res.status(404).send();
        }

        Rule.findOne({_id: rulId, _company: compId}).then((rule) => {
          if(!rule) {
            return res.status(404).send();
          }

          rule.remove().then(() => {
            res.status(200).send();
          }).catch((err) => res.status(400).send(err));
        }).catch((err) => res.status(400).send(err));
      }).catch((err) => res.status(400).send(err));
  }
};

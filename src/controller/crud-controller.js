module.exports = function (_, Model) {

    var controller = {};
    controller.editableProperties = [];
    controller.serialize = function(document) {
      return document;
    };
    controller.hydrate = function(document, data) {
      controller.editableProperties.forEach(function(property) {
        document[property] = data[property];
      });
    };
    controller.getForcedFilters = function(req) {
      return {};
    };

    controller.findAllAction = function(req, res) {
      var query = _.extend({}, req.query, controller.getForcedFilters(req));
      Model.find(query, function (err, data) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        return res.send({ status: 'success', data: data.map(controller.serialize) });
      });
    };

    controller.findOneAction = function (req, res) {
      var query = _.extend({ _id: req.params.id}, controller.getForcedFilters(req));
      Model.findOne(query, function (err, document) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        if (!document) {
          return res.status(404).send({ status: 'error', message: 'document not found' });
        }
        return res.send({ status: 'success', data: controller.serialize(document) });
      });
    };

    controller.createAction = function(req, res) {
      var document = new Model(req.body);
      document.save(function(err) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        return res.send({ status: 'success', data: controller.serialize(document) });
      });
    };

    controller.updateAction = function(req, res) {
      var query = _.extend({ _id: req.params.id}, controller.getForcedFilters(req));
      Model.findOne(query, function (err, document) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        if (!document) {
          return res.status(404).send({ status: 'error', message: 'document not found' });
        }
        controller.hydrate(document, req.body);
        document.save(function(err) {
          if (err) {
            return res.status(500).send({ status: 'error', message : 'mongoose error' });
          }
          return res.send({ status: 'success', data: controller.serialize(document) });
        });
      });
    };

    controller.removeAction = function(req, res) {
      var query = _.extend({ _id: req.params.id}, controller.getForcedFilters(req));
      Model.findOne(query, function (err, document) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        if (!document) {
          return res.status(404).send({ status: 'error', message: 'document not found' });
        }
        document.remove(function(err) {
          if (err) {
            return res.status(500).send({ status: 'error', message : 'mongoose error' });
          }
          return res.send({ status: 'success', data: controller.serialize(document) });
        });
      });
    };

    return controller;
};

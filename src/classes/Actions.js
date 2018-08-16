import HttpStatusCodes from 'http-status-codes';
import _ from 'lodash';

export default class Actions {
  constructor(controller) {
    // Saves us having to bind each function manually using something like `this.findById = this.findById.bind(this);`
    _.bindAll(this, [
      'create',
      'createMany',
      'find',
      'findOne',
      'findById',
      'update',
      'updateOrCreate',
      'delete',
    ]);
    this.controller = controller;
  }

  async create(req, res, next) {
    try {
      let response = req.params.id
        ? await this.controller.createWithId(req.params.id, req.body)
        : await this.controller.create(req.body);
      res.status(HttpStatusCodes.OK).send(response);
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async createMany(req, res, next) {
    try {
      const response = await this.controller.createMany(req.body);
      res.status(HttpStatusCodes.OK).send(response);
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async find(req, res, next) {
    try {
      const docs = await this.controller.find(req.query);
      res.status(HttpStatusCodes.OK).send(docs);
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const doc = await this.controller.findOne(req.query);
      doc
        ? res.status(HttpStatusCodes.OK).send(doc)
        : res.status(HttpStatusCodes.NOT_FOUND).send();
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async findById(req, res, next) {
    try {
      const doc = await this.controller.findById(req.params.id);
      doc
        ? res.status(HttpStatusCodes.OK).send(doc)
        : res.status(HttpStatusCodes.NOT_FOUND).send();
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async update(req, res, next) {
    try {
      const doc = await this.controller.update(req.params.id, req.body);
      doc
        ? res.status(HttpStatusCodes.OK).send(doc)
        : res.status(HttpStatusCodes.NOT_FOUND).send();
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async updateOrCreate(req, res, next) {
    try {
      const doc = await this.controller.updateOrCreate(
        req.body.query,
        req.body.data
      );
      doc
        ? res.status(HttpStatusCodes.OK).send(doc)
        : res.status(HttpStatusCodes.NOT_FOUND).send();
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }

  async delete(req, res, next) {
    try {
      const response = await this.controller.delete(req.params.id);
      response
        ? res.status(HttpStatusCodes.OK).send(response)
        : res.status(HttpStatusCodes.NOT_FOUND).send();
    } catch (error) {
      res.status(HttpStatusCodes.OK).send(error);
    }
  }
}

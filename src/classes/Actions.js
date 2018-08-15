// const _ = require('underscore');

export default class Actions {
  constructor(controller) {
    this.controller = controller;
    this.findById = this.findById.bind(this);
    // _.bindAll(this, 'findById');
  }

  async findById(req, res, next) {
    const item = await this.controller.findById(req.params.id);
    res.send(item);
  }
}

// const _ = require('underscore');

export default class Controller {
  constructor(respository) {
    this.respository = respository;
    this.findById = this.findById.bind(this);
    // _.bindAll(this, 'findById');
  }

  async findById(id) {
    const item = await this.respository.findById(id);
    return item;
  }
}

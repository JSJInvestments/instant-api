// const _ = require('underscore');

export default class FirebaseRepository {
  constructor() {
    this.findById = this.findById.bind(this);
    // _.bindAll(this, 'findById');
  }

  async findById(id) {
    // const item = await this.respository.findById(id);
    return 'item';
  }
}

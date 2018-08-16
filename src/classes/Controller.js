import _ from 'lodash';

export default class Controller {
  constructor(repository) {
    // Saves us having to bind each function manually using something like `this.findById = this.findById.bind(this);`
    _.bindAll(this, [
      'create',
      'createWithId',
      'createMany',
      'find',
      'findOne',
      'findById',
      'update',
      'updateOrCreate',
      'delete',
    ]);
    this.repository = repository;
  }

  async create(attributes) {
    try {
      return await this.repository.create(attributes);
    } catch (error) {
      throw error;
    }
  }

  async createWithId(id, attributes) {
    try {
      console.log('Controller.createWithId', !!this.repository);
      return await this.repository.createWithId(id, attributes);
    } catch (error) {
      throw error;
    }
  }

  async createMany(arr) {
    try {
      return await this.repository.createMany(arr);
    } catch (error) {
      throw error;
    }
  }

  async find(query) {
    try {
      return await this.repository.find(query);
    } catch (error) {
      throw error;
    }
  }

  async findOne(query) {
    try {
      return await this.repository.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id, attributes) {
    try {
      return await this.repository.update(id, attributes);
    } catch (error) {
      throw error;
    }
  }

  async updateOrCreate(query, attributes) {
    try {
      return await this.repository.updateOrCreate(query, attributes);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

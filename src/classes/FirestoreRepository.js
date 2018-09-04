import _ from 'lodash';
import { serializeDocument, serializeSnapshot } from 'instant-firestore-utils';
import { asyncForEach, asyncMap } from '../utils';

export default class FirestoreRepository {
  constructor(db, collection) {
    // Saves us having to bind each function manually using something like `this.findById = this.findById.bind(this);`
    _.bindAll(this, [
      'deserializeReferences',
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
    this.db = db;
    this.collection = collection;
  }

  /**
   * Convert string references to document references, e.g `businesses/dV7H6xpJRrRwXluMOWHr`
   * @param {object} attributes Document attributes
   */
  deserializeReferences(attributes) {
    try {
      Object.keys(attributes).map((key, index) => {
        attributes[key] =
          typeof attributes[key] === 'string' &&
          attributes[key].indexOf('/') !== -1
            ? this.db.doc(attributes[key])
            : attributes[key];
      });
      return attributes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a document (firestore.add)
   * @param {Object} attributes Document attributes
   */
  async create(attributes) {
    try {
      attributes = this.deserializeReferences(attributes);
      const ref = await this.db.collection(this.collection).add(attributes);
      if (ref.id) {
        return await this.findById(ref.id);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a document with an id (firestore.set)
   * @param {String} id Document id
   * @param {Object} attributes Document attributes
   */
  async createWithId(id, attributes) {
    try {
      attributes = this.deserializeReferences(attributes);
      const ref = await this.db
        .collection(this.collection)
        .doc(id)
        .set(attributes);
      return await this.findById(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create many documents
   * @param {Array} arr Array of Document attributes
   */
  async createMany(arr) {
    try {
      let items = [];
      const batch = this.db.batch();
      await asyncForEach(arr, async attributes => {
        attributes = this.deserializeReferences(attributes);
        let item = await this.create(attributes);
        items.push(item);
      });
      batch.commit();
      return items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find documents
   * @param {Object} query Search query
   */
  async find(query = {}, options = {}) {
    try {
      // Convert the query into an array of queries for Firestore
      const queries = Object.keys(query).map(k => [k, '==', query[k]]);
      // Baseline items
      let items = [];
      // Get the collection reference
      const colRef = this.db.collection(this.collection);
      // Baseline query reference
      let queryRef = colRef;
      // Add the queries to the query reference
      queries.forEach(query => {
        queryRef = colRef.where(query[0], query[1], query[2]);
      });
      // Order if necessary
      if (options.orderBy) {
        queryRef = queryRef.orderBy(options.orderBy);
      }
      // Apply a limit if necessary
      if (options.limit) {
        queryRef = queryRef.limit(options.limit);
      }
      // Perform the get request
      const snapshot = await queryRef.get();
      items = serializeSnapshot(
        snapshot,
        options,
        this.db.collection(this.collection)
      );
      return items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document
   * @param {Object} query Search query
   */
  async findOne(query, options = {}) {
    try {
      const item = await this.find(query, { limit: 1 });
      return item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document by id
   * @param {String} id
   */
  async findById(id, options = {}) {
    try {
      const doc = await this.db
        .collection(this.collection)
        .doc(id)
        .get();
      return await serializeDocument(
        doc,
        options,
        this.db.collection(this.collection)
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document by id and update
   * @param {String} id Document id
   * @param {Object} attributes Document attributes
   */
  async update(id, attributes) {
    console.log(id, attributes);
    try {
      attributes = this.deserializeReferences(attributes);
      const ref = await this.db
        .collection(this.collection)
        .doc(id)
        .update(attributes);
      return await this.findById(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document and update
   * @param {Object} query Search query
   * @param {Object} attributes Document attributes
   */
  async updateOrCreate(query, attributes) {
    const item = await this.findOne(query);
    attributes = this.deserializeReferences(attributes);
    return item ? this.update(item.id, attributes) : this.create(attributes);
  }

  /**
   * Delete a document
   * @param {String} id
   */
  async delete(id) {
    try {
      const ref = await this.db
        .collection(this.collection)
        .doc(id)
        .delete();
      return { deleted: !!ref };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

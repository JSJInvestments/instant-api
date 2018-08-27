import _ from 'lodash';
import { asyncForEach, asyncMap } from '../utils';

export default class FirestoreRepository {
  constructor(db, collection) {
    // Saves us having to bind each function manually using something like `this.findById = this.findById.bind(this);`
    _.bindAll(this, [
      'deserializeReferences',
      'serializeReference',
      'serializeReferences',
      'serialize',
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
   * Populate specific document reference
   * @param {object} data Document attributes
   */
  async serializeReference(data) {
    try {
      if (typeof data === 'object' && typeof data.get === 'function') {
        const doc = await data.get();
        data = await this.serialize(doc);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Serialize document references
   * @param {object} data Document attributes
   * @param {object} options Options
   */
  async serializeReferences(data, options) {
    try {
      await asyncForEach(Object.keys(data), async key => {
        data[key] = await this.serializeReference(data[key]);
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Serialize a Firebase document
   * @param {object} doc Firebase document
   * @param {object} options Options
   */
  async serialize(doc, options = {}) {
    try {
      if (doc && doc.exists) {
        // Serialize the data
        let data = doc.data();

        // Assign an id (prevents overriding the `id` field in the data if one exists)
        if (data.id) {
          data._id = doc.id;
        } else {
          data.id = doc.id;
        }

        // Serialize references
        data = this.serializeReferences(data, options);

        // Populate references
        // data = this.populateReference(data, options.populate);

        return data;
      }
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
  async find(query, options) {
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
      // Perform the get request
      const snapshot = await queryRef.get();
      if (!snapshot.empty) {
        // Convert the snapshot to an array of objects
        items = await asyncMap(snapshot.docs, async doc =>
          this.serialize(doc, options)
        );
      }
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
  async findOne(query) {
    try {
      const items = await this.find(query);
      if (items) {
        return items[0];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document by id
   * @param {String} id
   */
  async findById(id, options) {
    try {
      const doc = await this.db
        .collection(this.collection)
        .doc(id)
        .get();
      return await this.serialize(doc, options);
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

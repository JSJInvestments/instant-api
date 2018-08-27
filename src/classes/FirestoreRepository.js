import _ from 'lodash';
import { asyncForEach, asyncMap } from '../utils';

export default class FirestoreRepository {
  constructor(db, collection) {
    // Saves us having to bind each function manually using something like `this.findById = this.findById.bind(this);`
    _.bindAll(this, [
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

  async serialize(doc, options = {}) {
    try {
      if (doc && doc.exists) {
        let data = doc.data();
        // Assign an id (prevents overriding the `id` field in the data if one exists)
        if (data.id) {
          data._id = doc.id;
        } else {
          data.id = doc.id;
        }
        // Populate any references
        if (options.populate && data[options.populate]) {
          const popDoc = await data[options.populate].get();
          data[options.populate] = await this.serialize(popDoc);
        }
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
    console.log('updateOrCreate', query, attributes);
    const item = await this.findOne(query);
    console.log('updateOrCreate', item);
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

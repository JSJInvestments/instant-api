import _ from 'lodash';

const serialize = doc => {
  if (doc && doc.exists) {
    const data = doc.data();
    if (data.id) {
      data._id = doc.id;
    } else {
      data.id = doc.id;
    }
    return data;
  }
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export default class FirestoreRepository {
  constructor(db, collection) {
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
    this.db = db;
    this.collection = collection;
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
      throw error;
    }
  }

  /**
   * Find documents
   * @param {Object} query Search query
   */
  async find(query) {
    try {
      // Convert the query into an array of queries for Firestore
      const queries = Object.keys(query).map(k => [k, '==', query[k]]);
      // Baseline items
      let items = [];
      // Get the collection reference
      const colRef = this.db.collection(this.collection);
      // Baseline query reference
      let queryRef;
      // Add the queries to the query reference
      queries.forEach(query => {
        queryRef = colRef.where(query[0], query[1], query[2]);
      });
      // Perform the get request
      const snapshot = await queryRef.get();
      if (!snapshot.empty) {
        // Convert the snapshot to an array of objects
        items = snapshot.docs.map(serialize);
      }
      return items;
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * Find one document by id
   * @param {String} id
   */
  async findById(id) {
    try {
      const doc = await this.db
        .collection(this.collection)
        .doc(id)
        .get();
      return serialize(doc);
    } catch (error) {
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
      throw error;
    }
  }
}

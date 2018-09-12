import Default from './Default';
import { FirestoreCollection, FirestoreDocument } from 'instant-firestore';

export default class FirestoreRepository extends Default {
  constructor(db, colRef) {
    super();
    Default.bind(this, [
      // Collection operations
      'create',
      'createMany',
      'find',
      'findOne',
      // Document operations
      'createWithId',
      'findById',
      'update',
      'delete',
      // Collection or Document operations
      'updateOrCreate',
    ]);
    this.db = db;
    this.colRef = colRef;
    this.collection = new FirestoreCollection(db, colRef);
  }

  // ================================================================
  //
  // Collection Operations
  //
  // ================================================================

  /**
   * Create a Firestore Document
   * @param {object} attributes Document attributes
   * @param {object} options Options
   */
  async create(attributes, options = {}) {
    try {
      return await this.collection.create(attributes, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create many Firestore Documents
   * @param {object} attributes Document attributes
   * @param {object} options Options
   */
  async createMany(arr, options = {}) {
    try {
      return await this.collection.createMany(arr, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find documents
   * @param {object} query Search query
   * @param {object} options Options
   */
  async find(query = {}, options = {}) {
    try {
      return await this.collection.find(query, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find one document
   * @param {object} query Search query
   * @param {object} options Options
   */
  async findOne(query, options = {}) {
    try {
      return await this.collection.findOne(query, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // ================================================================
  //
  // Document Operations
  //
  // ================================================================

  /**
   * Create a Firestore Document with an id
   * @param {object} attributes Document attributes
   * @param {string} id Document id
   * @param {object} options Options
   */
  async createWithId(attributes, id, options = {}) {
    try {
      const doc = new FirestoreDocument(this.db, this.colRef.doc(id));
      return await doc.create(attributes, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find document by id
   * @param {string} id Document id
   * @param {object} options Options
   */
  async findById(id, options = {}) {
    try {
      const doc = new FirestoreDocument(this.db, this.colRef.doc(id));
      return await doc.find(options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Firestore Document
   * @param {string} id Document id
   * @param {object} attributes Document attributes
   * @param {object} options Options
   */
  async update(id, attributes, options = {}) {
    try {
      const doc = new FirestoreDocument(this.db, this.colRef.doc(id));
      return await doc.update(attributes, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete Firestore Document
   * @param {string} id Document id
   */
  async delete(id) {
    try {
      const doc = new FirestoreDocument(this.db, this.colRef.doc(id));
      return await doc.delete();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // ================================================================
  //
  // Collection or Document Operations
  //
  // ================================================================

  /**
   * Update or create a Firestore Document
   * @param {object} query Search query
   * @param {object} attributes Document attributes
   * @param {object} options Options
   */
  async updateOrCreate(query, attributes, options) {
    try {
      const item = await this.findOne(query, options);
      return item
        ? await this.update(item.id, attributes, options)
        : await this.create(attributes, options);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

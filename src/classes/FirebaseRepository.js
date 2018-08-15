import _ from 'lodash';

const serialize = doc => {
  if (doc && doc.exists) {
    return {
      id: doc.id,
      ...doc.data(),
    };
  }
};

export default class FirebaseRepository {
  constructor(db, collection) {
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
    this.db = db;
    this.collection = collection;
  }

  /**
   * Create a document (firestore.add)
   * @param {Object} attributes Document attributes
   */
  async create(attributes) {
    const doc = await this.db.collection(this.collection).add(attributes);
    return serialize(doc);
  }

  /**
   * Create many documents
   * @param {Array} arr Array of Document attributes
   */
  async createMany(arr) {
    const batch = this.db.batch();
    arr.forEach(attributes => create);
    return batch.commit();
  }

  /**
   * Find documents
   * @param {Array} queries Array of queries, e.g. [['name', '==', 'Craig], ['facebook.id', '==', id]]
   */
  async find(queries = []) {
    let items = [];
    const colRef = await this.db.collection(this.collection);
    let queryRef;
    queries.forEach(query => {
      queryRef = colRef.where(query[0], query[1], query[2]);
    });
    const snapshot = queryRef.get();
    if (!snapshot.empty) {
      items = snapshot.docs.map(serialize);
    }
    return items;
  }

  /**
   * Find one document
   * @param {Array} query
   */
  async findOne(query) {
    const items = await this.find([query]);
    if (items) {
      return items[0];
    }
  }

  /**
   * Find one document by id
   * @param {String} id
   */
  async findById(id) {
    const doc = await this.db
      .collection(this.collection)
      .doc(id)
      .get();
    return serialize(doc);
  }

  /**
   * Find one document by id and update
   * @param {String} id Document id
   * @param {Object} attributes Document attributes
   */
  async update(id, attributes) {
    const doc = await this.db
      .collection(this.collection)
      .doc(id)
      .set(data, { merge: true });
    return serialize(doc);
  }

  async updateOrCreate(query, data) {
    // const doc = await findByFacebookId(data.facebook.id);
    // if (account) {
    //   return update(account.id, data);
    // } else {
    //   return create(data);
    // }
  }

  // @todo
  async delete(id) {}
}

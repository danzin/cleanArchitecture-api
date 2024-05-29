const mongoose = require('mongoose');
const initiateTransaction = require('./transactionHelper');

class MongooseRepository {

    /**
   * @description Create an instance of the MongooseRepository class
   * @param Model {mongoose.model} Mongoose Model to use for the instance
   */
  constructor(Model){
    this.model = Model;
  }

  /**
   * @description Create a new document on the Model
   * @param pipeline {array} Aggregate pipeline to execute
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns the results of the query
  */
  aggregate(pipeline, session = null) {
    const query = this.model.aggregate(pipeline);
    if (session) {
      query.session(session);
    }
    return query.exec();
  }

  /**
   * @description Create a new document on the Model
   * @param {object} body Body object to create the new document with
   * @param {object} session 
   * @returns {Promise} Returns the results of the query
   */
  create(body, session = null) {
    if (session) {
      return this.model.create([body], { session }).then(docs => docs[0]);;
    }
    return this.model.create(body);
  }

  /**
   * Deletes a document from the Model based on the provided ID.
   * @param {string} id - The ID of the document to delete.
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves when the document is deleted.
   */
  delete(id, session = null) {
    return this.model.findByIdAndDelete(id).session(session).exec();
  }

  /**
   * Finds a single document in the Model based on the provided query.
   * @param {object} query - The query to match documents.
   * @param {object} [projection] - Optional projection (default excludes '__v' field).
   * @param {object} [options] - Additional query options.
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves to the found document.
   */
  findOne(query, projection = { __v: 0 }, options = {}, session = null) {
    const queryObj = this.model.findOne(query, projection, options).select({ __v: 0 });
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  /**
   * Finds multiple documents in the Model based on the provided query.
   * @param {object} query - The query to match documents.
   * @param {object} sort - Sorting criteria.
   * @param {object} [projection] - Optional projection (default excludes '__v' and 'password' fields).
   * @param {object} [options] - Additional query options.
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves to an array of matching documents.
   */
  find(query, sort, projection = { __v: 0 }, options = {}, session = null) {
    const queryObj = this.model.find(query, projection, options).sort(sort).select({ __v: 0, "password": 0 });
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  /**
   * Finds a document in the Model by its ID.
   * @param {string} id - The ID of the document to find.
   * @param {object} [projection] - Optional projection (default excludes '__v' field).
   * @param {object} [options] - Additional query options.
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves to the found document.
   */
  findById(id, projection = { __v: 0 }, options = {}, session = null) {
    const queryObj = this.model.findById(id, projection, options);
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  /**
   * Updates a document in the Model based on the provided ID.
   * @param {string} id - The ID of the document to update.
   * @param {object} body - The data to update the document with.
   * @param {object} [options] - Additional update options (default returns the updated document).
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves to the updated document.
   */
  update(id, body, options = { new: true }, session = null) {
    return this.model.findOne({ _id: id }).session(session).exec()
      .then(user => {
        Object.keys(body).forEach(field => {
          user[field] = body[field];
        });
        return user.save({ ...options, session });
      });
  }

  /**
   * Adds a photo ID to the 'photos' array of a user document.
   * @param {string} userId - The ID of the user to add the photo to.
   * @param {string} photoId - The ID of the photo to add.
   * @param {object} [options] - Additional options.
   * @param {object} session - Optional MongoDB session.
   * @returns {Promise} Returns a Promise that resolves to the updated user document.
   */
  addPhoto(userId, photoId, options = {}, session = null) {
    return this.model.findOne({ _id: userId }).session(session).exec()
      .then(user => {
        user.photos.push(photoId);
        return user.save({ ...options, session });
      });
  }

/**
 * Static method to execute a function within a MongoDB transaction.
 * @param {function} fn - The function to execute within the transaction. This function receives the session as its argument.
 * @returns {Promise} Returns a Promise that resolves to the result of the executed function if the transaction commits successfully.
 * @throws {Error} Throws an error if the transaction fails and is aborted.
 */
  static async initiateTransaction(fn) {
    return initiateTransaction(fn);
  }
}

module.exports = MongooseRepository;

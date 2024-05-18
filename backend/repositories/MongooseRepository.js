const mongoose = require('mongoose');
const initiateTransaction = require('./transactionHelper');

class MongooseRepository {

  constructor(Model){
    this.model = Model;
  }

  aggregate(pipeline, session = null) {
    const query = this.model.aggregate(pipeline);
    if (session) {
      query.session(session);
    }
    return query.exec();
  }

  create(body, session = null) {
    if (session) {
      return this.model.create([body], { session });
    }
    return this.model.create(body);
  }

  delete(id, session = null) {
    return this.model.findByIdAndDelete(id).session(session).exec();
  }

  findOne(query, projection = { __v: 0 }, options = {}, session = null) {
    const queryObj = this.model.findOne(query, projection, options).select({ __v: 0 });
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  find(query, projection = { __v: 0 }, sort = { id: 1 }, options = {}, session = null) {
    const queryObj = this.model.find(query, projection, options).sort(sort).select({ __v: 0, "password": 0 });
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  findById(id, projection = { __v: 0 }, options = {}, session = null) {
    const queryObj = this.model.findById(id, projection, options);
    if (session) {
      queryObj.session(session);
    }
    return queryObj.exec();
  }

  update(id, body, options = { new: true }, session = null) {
    return this.model.findOne({ _id: id }).session(session).exec()
      .then(user => {
        Object.keys(body).forEach(field => {
          user[field] = body[field];
        });
        return user.save({ ...options, session });
      });
  }

  addPhoto(userId, photo, options = {}, session = null) {
    return this.model.findOne({ _id: userId }).session(session).exec()
      .then(user => {
        user.photos.push(photo);
        return user.save({ ...options, session });
      });
  }

  static async initiateTransaction(fn) {
    return initiateTransaction(fn);
  }
}

module.exports = MongooseRepository;

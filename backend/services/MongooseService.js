class MongooseService {

  constructor(Model){
    this.model = Model;
  }


  aggregate(pipeline){
    return this.model.aggregate(pipeline).exec();
  }

  create(body){
    return this.model.create(body);
  }

  delete(id){
    return this.model.findByIdAndDelete(id).exec();
  }

  // not using the lean option here because returning an instance of Mongoose Document class instead of POJO
  // allows directly using userSchema methods later on and the performance hit is insignificant in this case
  findOne (query, projection = { __v: 0 }, options = {}) {
    return this.model
      .findOne( query, projection, options )
      .select( { __v: 0 } )
      .exec();
  }

  
  find (query, projection = { __v: 0 }, sort = { id: 1 }, options ={}) {
    return this.model
      .find( query, projection, options )
      .sort( sort )
      .select( { __v: 0, "password": 0 } )
      .exec();
  }

  findById (id, projection = { __v: 0 }, options = { lean: true }) {
    return this.model
      .findById( id, projection, options )
      .exec();
  }

  update(id, body, options = { new: true }) {
    return this.model.findOne({ _id: id }).exec()
      .then(user => {
        // Update fields
        Object.keys(body).forEach(field => {
          user[field] = body[field];
        });
        // Save the document to trigger 'save' middleware
        return user.save(options);
      });
  }

  async addPhotoToUser(userId, photoUrl,) {

    return this.model.findOne({_id: userId}).exec()
    .then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      user.photos.push(photoUrl);
      return user.save();
    });
  }



}

module.exports = MongooseService;

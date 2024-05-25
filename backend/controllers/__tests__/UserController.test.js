const request = require('supertest');
const ExpressLoader = require('../../loaders/Express');
const ImageService = require('../../services/images/ImageService');
const UserModel = require('../../models/UserModel');
const ImageModel = require('../../models/ImageModel');
const mongoose = require('mongoose');
const route = require('../../routes')
// Mock the ImageService
jest.mock('../../services/images/ImageService');

let app;
let testUser;
let userId;
beforeAll(async () => {

  const loader = new ExpressLoader();
  app = loader.Server;
  console.log( `Test Database connection successful; connected to: mongodb://localhost:27017/testdb`);
    // Create express instance to setup API
    await mongoose.connect('mongodb://localhost:27017/testdb')

    testUser = await UserModel.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: '123',  // Ensure password is hashed if applicable
      isAdmin: true
    });
    console.log(testUser)
});

afterAll(async () => {
  // Close the server and database connection after all tests are done
  await UserModel.deleteOne({_id: testUser._id})

  await mongoose.disconnect();

  app.close();
});

describe('UserController', () => {
  let userServiceMock;

  beforeEach(() => {
    userServiceMock = new UserService();
    userServiceMock.mockImplementation(() => userServiceMock);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if(userId){
      await UserModel.findByIdAndDelete(userId);
      userId = null;
    }
  });

  test('should get user by id successfully', async () => {

    const response = await request(app).get(`/user/${testUser._id}`)

    expect(response.status).toBe(200);
  });

  test('should register a user successfully', async () => {

    const response = await request(app).post(`/user/signup`).send({
      "username":"testUser",
      "email":"test1@mail.com",
      "password":"123"
    })

    expect(response.status).toBe(201);
    userId = response._body.body._id;
  });


});

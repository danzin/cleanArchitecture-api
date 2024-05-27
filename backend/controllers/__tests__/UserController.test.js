const request = require('supertest');
const ExpressLoader = require('../../loaders/Express');
const UserService = require('../../services/user/UserService'); // adjust the path as needed

jest.mock('../../services/user/UserService');

let app;

beforeAll(() => {
  const expressLoader = new ExpressLoader();
  app = expressLoader.App;
});

describe('UserController', () => {
  describe('GET /user/:id', () => {
    it('should return a user when given a valid ID', async () => {
      const fakeResult = { success: true, body:{ id: 1, name: 'John Doe'} };
      UserService.prototype.getUser.mockResolvedValue(fakeResult);
      
      const res = await request(app).get('/user/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeResult.body);
      expect(UserService.prototype.getUser).toHaveBeenCalled();
      expect(UserService.prototype.getUser).toBeCalledWith('1');
    });

    it('should return 404 if no user is found', async () => {
      const fakeResult = { success: false, body: { message: 'User not found' }  };

      UserService.prototype.getUser.mockResolvedValue(fakeResult);

      const res = await request(app).get('/user/2');

      expect(res.status).toBe(404);
      console.log(res.body)
      expect(res.body).toEqual(fakeResult.body);

    });
  });
});

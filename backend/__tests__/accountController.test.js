const User = require('../models/User.model');
const { getUser, updateName, deleteUser } = require('../controllers/accountController');

jest.mock('../models/User.model');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { uid: '123' },
            body: { name: 'John Doe' }
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    });

    it('should get a user by uid', async () => {
        const mockUser = { uid: '123', name: 'John Doe' };
        User.findOne.mockResolvedValue(mockUser);

        await getUser(req, res);

        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should update a user name', async () => {
        const mockUser = { uid: '123', name: 'Jane Doe' };
        User.findOneAndUpdate.mockResolvedValue(mockUser);

        await updateName(req, res);

        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should delete a user', async () => {
        User.findOneAndDelete.mockResolvedValue(true);

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});

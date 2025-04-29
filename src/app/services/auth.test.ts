import { getCurrentUser, login, register, logout } from './auth';
import { account, ID } from '../appwrite';

jest.mock('../appwrite', () => ({
  account: {
    get: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    create: jest.fn(),
    deleteSession: jest.fn(),
  },
  ID: {
    unique: jest.fn(() => 'unique-id'),
  },
}));

describe('Auth Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get the current user', async () => {
    (account.get as jest.Mock).mockResolvedValue({ $id: 'user-id', name: 'Test User' });

    const result = await getCurrentUser();

    expect(account.get).toHaveBeenCalled();
    expect(result).toEqual({ $id: 'user-id', name: 'Test User' });
  });

  it('should return null if no user is logged in', async () => {
    (account.get as jest.Mock).mockRejectedValue(new Error('Not logged in'));

    const result = await getCurrentUser();

    expect(account.get).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should log in a user', async () => {
    (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});
    (account.get as jest.Mock).mockResolvedValue({ $id: 'user-id', name: 'Test User' });

    const result = await login('test@example.com', 'password123');

    expect(account.createEmailPasswordSession).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(account.get).toHaveBeenCalled();
    expect(result).toEqual({ $id: 'user-id', name: 'Test User' });
  });

  it('should throw an error if login fails', async () => {
    (account.createEmailPasswordSession as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');

    expect(account.createEmailPasswordSession).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
  });

  it('should register a new user', async () => {
    (account.create as jest.Mock).mockResolvedValue({ $id: 'new-user-id', name: 'New User' });
    (account.createEmailPasswordSession as jest.Mock).mockResolvedValue({});
    (account.get as jest.Mock).mockResolvedValue({ $id: 'new-user-id', name: 'New User' });

    const result = await register('New User', 'new@example.com', 'password123');

    expect(account.create).toHaveBeenCalledWith('unique-id', 'new@example.com', 'password123', 'New User');
    expect(account.createEmailPasswordSession).toHaveBeenCalledWith('new@example.com', 'password123');
    expect(account.get).toHaveBeenCalled();
    expect(result).toEqual({ $id: 'new-user-id', name: 'New User' });
  });

  it('should log out a user', async () => {
    (account.deleteSession as jest.Mock).mockResolvedValue({});

    await logout();

    expect(account.deleteSession).toHaveBeenCalledWith('current');
  });

  it('should throw an error if logout fails', async () => {
    (account.deleteSession as jest.Mock).mockRejectedValue(new Error('Logout failed'));

    await expect(logout()).rejects.toThrow('Logout failed');

    expect(account.deleteSession).toHaveBeenCalledWith('current');
  });
});
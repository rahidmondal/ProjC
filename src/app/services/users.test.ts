import { createUser, getUser, getUserSkills, updateUser, deleteUser } from './users';
import { databases, ID } from '../appwrite';
import { Query } from 'appwrite';

jest.mock('../appwrite', () => ({
  databases: {
    createDocument: jest.fn(),
    listDocuments: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
  },
  ID: {
    unique: jest.fn(() => 'unique-id'),
  },
}));

describe('User Services', () => {
  const mockUserData = {
    userId: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    skills: ['JavaScript', 'React'],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    (databases.createDocument as jest.Mock).mockResolvedValue({ $id: 'new-user-id' });

    const result = await createUser(mockUserData);

    expect(databases.createDocument).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      'unique-id',
      mockUserData
    );
    expect(result).toEqual({ $id: 'new-user-id' });
  });

  it('should get a user by ID', async () => {
    (databases.listDocuments as jest.Mock).mockResolvedValue({ documents: [mockUserData] });

    const result = await getUser('user-id');

    expect(databases.listDocuments).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      [Query.equal('userId', 'user-id')]
    );
    expect(result).toEqual(mockUserData);
  });

  it('should return null if user is not found', async () => {
    (databases.listDocuments as jest.Mock).mockResolvedValue({ documents: [] });

    const result = await getUser('non-existent-id');

    expect(result).toBeNull();
  });

  it('should get user skills', async () => {
    (databases.listDocuments as jest.Mock).mockResolvedValue({ documents: [mockUserData] });

    const result = await getUserSkills('user-id');

    expect(result).toEqual(['JavaScript', 'React']);
  });

  it('should update a user', async () => {
    (databases.updateDocument as jest.Mock).mockResolvedValue({ $id: 'updated-user-id' });

    const result = await updateUser('user-id', mockUserData);

    expect(databases.updateDocument).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      'user-id',
      mockUserData
    );
    expect(result).toEqual({ $id: 'updated-user-id' });
  });

  it('should delete a user', async () => {
    (databases.deleteDocument as jest.Mock).mockResolvedValue({});

    const result = await deleteUser('user-id');

    expect(databases.deleteDocument).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      'user-id'
    );
    expect(result).toEqual({});
  });
});
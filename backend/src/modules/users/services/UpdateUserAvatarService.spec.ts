import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpadteUserAvatar', () => {
  it('should be able to create a new user', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeRepository = new FakeRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeRepository,
      fakeStorageProvider,
    );

    const user = await fakeRepository.create({
      email: 'jonhdoe@gmail.com',
      name: 'jonh doe',
      password: '123',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeRepository = new FakeRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete avatar when update to a new one', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeRepository = new FakeRepository();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeRepository.create({
      email: 'jonhdoe@gmail.com',
      name: 'jonh doe',
      password: '123',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
});

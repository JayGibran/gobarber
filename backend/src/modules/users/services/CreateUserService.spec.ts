import AppError from '@shared/errors/AppError';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeRepository = new FakeRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );
    const user = await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with a duplicated email', async () => {
    const fakeRepository = new FakeRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonh@gmail.com',
      password: '123',
    });
    expect(
      createUserService.execute({
        name: 'Jonh Doe',
        email: 'jonh@gmail.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

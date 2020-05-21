import AppError from '@shared/errors/AppError';
import FakeRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeRepository = new FakeRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123',
    });
    const response = await authenticateUserService.execute({
      email: 'jonhdoe@gmail.com',
      password: '123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toBe(user);
  });

  it('should be able to authenticate with non existing user', async () => {
    const fakeRepository = new FakeRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUserService.execute({
        email: 'jonhdoe@gmail.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    const fakeRepository = new FakeRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123',
    });

    expect(
      authenticateUserService.execute({
        email: 'jonhdoe@gmail.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/errors/AppError';
import FakeRepository from '../repositories/Fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeRepository = new FakeRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeRepository,
    );
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123',
    });
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointment in the same time', async () => {
    const fakeRepository = new FakeRepository();
    const appointmentDate = new Date(2020, 5, 10, 11);
    const createAppointmentService = new CreateAppointmentService(
      fakeRepository,
    );
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123',
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

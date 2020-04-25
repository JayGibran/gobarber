import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentRepository.all();
  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;
  const parsedDate = parseISO(date);

  const createAppointmentService = new CreateAppointmentService(
    appointmentRepository,
  );
  try {
    const appointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;

import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmnetDTO from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmnetDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}

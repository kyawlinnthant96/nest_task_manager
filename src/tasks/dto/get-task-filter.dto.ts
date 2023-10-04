import { TaskStatus } from '../tasks.modal';

export class GetTaskFilterDto {
  status: TaskStatus;
  search: string;
}

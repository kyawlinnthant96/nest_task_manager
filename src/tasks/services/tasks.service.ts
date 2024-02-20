import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskStatus } from '../types/task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRespository } from '../repositories/task.respository';
import { Task } from '../entities/task.entity';
import { GetTaskFilterDto } from '../dtos/get-task-filter.dto';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository)
    private readonly taskRepository: TaskRespository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException(`Task Id with "${id}" not found.`);
    }
    return task;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}

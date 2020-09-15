import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository
  ){}
 

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
    return await this.taskRepository.getTasks(filterDto);
  }
  async getTaskById(id:number): Promise<Task>{
    const found = await this.taskRepository.findOne(id);

    if(!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }
  // getTaskById(id:string):Task {
  //   return this.tasks.find(task=>
  //     task.id === id
  //   );
  // }

  async deleteTaskById(id:number):Promise<void> {
    const result = await this.taskRepository.delete(id);
    if( result.affected === 0 ) {
      throw new NotFoundException(`task with ID ${id} was not found`)
    }
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user:User
    ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id:number, status: TaskStatus): Promise<Task> {
   const task = await this.getTaskById(id);
   task.status = status;
   await task.save();
   return task;
  }
}

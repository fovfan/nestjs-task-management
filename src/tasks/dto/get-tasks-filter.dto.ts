import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatusValidationPipe } from "../pipes/task-status-validation.pipe";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([
    TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN
  ])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
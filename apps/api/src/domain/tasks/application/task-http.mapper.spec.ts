import { CreateTaskDto } from '../dto/create-task.dto';
import { FindTasksQueryDto } from '../dto/find-tasks-query.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import {
  toCreateTaskCommand,
  toFindTasksQueryCommand,
  toUpdateTaskCommand,
} from './task-http.mapper';

describe('task-http.mapper', () => {
  it('maps validated create DTO to application command (transport → use case boundary)', () => {
    const dto = {
      title: 'API task',
      projectId: '550e8400-e29b-41d4-a716-446655440001',
    } as CreateTaskDto;

    expect(toCreateTaskCommand(dto)).toEqual({
      title: 'API task',
      projectId: '550e8400-e29b-41d4-a716-446655440001',
    });
  });

  it('maps list and update DTOs for the same boundary', () => {
    const list = {
      projectId: '550e8400-e29b-41d4-a716-446655440001',
      page: 1,
      limit: 10,
    } as FindTasksQueryDto;

    const patch = { title: 'Renamed' } as UpdateTaskDto;

    expect(toFindTasksQueryCommand(list)).toMatchObject(list);
    expect(toUpdateTaskCommand(patch)).toEqual({ title: 'Renamed' });
  });
});

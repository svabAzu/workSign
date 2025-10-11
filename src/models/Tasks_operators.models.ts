import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  DataType,
  BelongsTo
} from 'sequelize-typescript';
import User from './Users.models';
import Task from './Task.models';
import OperatorTaskState from './Operator_task_states.models';

@Table({
  tableName: 'tasks_operators',
  timestamps: false
})
class TasksOperators extends Model {
  @PrimaryKey
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
  })
  ID_task!: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  ID_user!: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  assignment_date!: Date;

  @Column({
    type: DataType.TEXT,
  })
  observations!: string;

  @ForeignKey(() => OperatorTaskState)
  @Column({
    type: DataType.INTEGER,
  })
  ID_operator_task_states!: number;

  @BelongsTo(() => Task)
  task!: Task;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => OperatorTaskState)
  state!: OperatorTaskState;
}

export default TasksOperators;

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';
import TasksOperators from './Tasks_operators.models';

@Table({
  tableName: 'operator_task_states',
  timestamps: false
})
class OperatorTaskState extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_operator_task_states!: number;

  @Column({
    type: DataType.STRING(50),
  })
  name!: string;

  @HasMany(() => TasksOperators)
  tasksOperators!: TasksOperators[];
}

export default OperatorTaskState;

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import GeneralTask from './General_tasks.models';
import TasksOperators from './Tasks_operators.models';
import MaterialsTasks from './Materials_tasks.models';

@Table({
  tableName: 'task',
  timestamps: false
})
class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_task!: number;

  @Column({
    type: DataType.STRING(100),
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @Column({
    type: DataType.DATE,
  })
  assignment_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  estimated_delivery_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  end_date!: Date;

  @Column({
    type: DataType.STRING(255),
  })
  sketch_url!: string;

  @ForeignKey(() => GeneralTask)
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_tasks!: number;

  @BelongsTo(() => GeneralTask)
  generalTask!: GeneralTask;

  @HasMany(() => TasksOperators)
  taskOperators!: TasksOperators[];

  @HasMany(() => MaterialsTasks)
  materialsTasks!: MaterialsTasks[];
}

export default Task;

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  HasMany,
  BelongsTo
} from 'sequelize-typescript';
import Job from './Jobs.models';
import Client from './Client.models';
import GeneralTaskState from './General_task_states.models';
import Task from './Task.models';

@Table({
  tableName: 'general_tasks',
  timestamps: false
})
class GeneralTask extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_tasks!: number;

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
  creation_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  estimated_delivery_date!: Date;

  @ForeignKey(() => Job)
  @Column({
    type: DataType.INTEGER,
  })
  ID_jobs!: number;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.INTEGER,
  })
  ID_client!: number;

  @ForeignKey(() => GeneralTaskState)
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_task_states!: number;

  @BelongsTo(() => Job)
  job!: Job;

  @BelongsTo(() => Client)
  client!: Client;

  @BelongsTo(() => GeneralTaskState)
  generalTaskState!: GeneralTaskState;

  @HasMany(() => Task)
  tasks!: Task[];
}

export default GeneralTask;

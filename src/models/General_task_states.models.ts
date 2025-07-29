import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';

import GeneralTask from './General_tasks.models';

@Table({
  tableName: 'general_task_states',
  timestamps: false
})
class GeneralTaskState extends Model<GeneralTaskState> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_task_states!: number;

  @Column({
    type: DataType.STRING(50),
  })
  name!: string;

  @Column({
    type: DataType.STRING(7),
  })
  color_code!: string;

  @HasMany(() => GeneralTask)
  generalTasks!: GeneralTask[];
}

export default GeneralTaskState;

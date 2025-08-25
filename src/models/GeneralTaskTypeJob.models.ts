import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType
} from 'sequelize-typescript';
import GeneralTask from './General_tasks.models';
import TypeJob from './Type_job.models';

@Table({
  tableName: 'GeneralTaskTypeJob',
  timestamps: false
})
class GeneralTaskTypeJob extends Model {
  @ForeignKey(() => GeneralTask)
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_tasks!: number;

  @ForeignKey(() => TypeJob)
  @Column({
    type: DataType.INTEGER,
  })
  ID_type_job!: number;
}

export default GeneralTaskTypeJob;

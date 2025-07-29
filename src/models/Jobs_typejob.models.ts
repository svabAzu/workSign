import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType
} from 'sequelize-typescript';
import Job from './Jobs.models';
import TypeJob from './Type_job.models';

@Table({
  tableName: 'Jobs_typeJob',
  timestamps: false
})
class JobsTypeJob extends Model {
  @ForeignKey(() => Job)
  @Column({
    type: DataType.INTEGER,
  })
  ID_jobs!: number;

  @ForeignKey(() => TypeJob)
  @Column({
    type: DataType.INTEGER,
  })
  ID_type_job!: number;
}

export default JobsTypeJob;

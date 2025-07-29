import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import GeneralTask from './General_tasks.models';
import TypeJob from './Type_job.models';
import JobsTypeJob from './Jobs_typejob.models';

@Table({
  tableName: 'jobs',
  timestamps: false
})
class Job extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_jobs!: number;

  @Column({
    type: DataType.STRING(100),
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @HasMany(() => GeneralTask)
  generalTasks!: GeneralTask[];

  @BelongsToMany(() => TypeJob, () => JobsTypeJob)
  typeJobs!: TypeJob[];
}

export default Job;

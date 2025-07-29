import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsToMany
} from 'sequelize-typescript';
import Job from './Jobs.models';
import JobsTypeJob from './Jobs_typejob.models';

@Table({
  tableName: 'type_job',
  timestamps: false
})
class TypeJob extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_type_job!: number;

  @Column({
    type: DataType.STRING(100),
  })
  name!: string;

  @Column({
    type: DataType.DATE,
  })
  estimated_delivery_date!: Date;

  @BelongsToMany(() => Job, () => JobsTypeJob)
  jobs!: Job[];
}

export default TypeJob;

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

  // ¡CAMBIO CLAVE AQUÍ!
  // Aseguramos que Sequelize mapee correctamente la propiedad
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  estimated_duration!: string;

  @BelongsToMany(() => Job, () => JobsTypeJob)
  jobs!: Job[];
}

export default TypeJob;
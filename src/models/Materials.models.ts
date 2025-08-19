import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
  BelongsToMany // Importa BelongsToMany
} from 'sequelize-typescript';
import MaterialsTasks from './Materials_tasks.models';
import Task from './Task.models'; // Importa el modelo Task

@Table({
  tableName: 'materials',
  timestamps: false
})
class Material extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_materials!: number;

  @Column({
    type: DataType.STRING(100),
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
  })
  type!: string;

  @HasMany(() => MaterialsTasks)
  materialsTasks!: MaterialsTasks[];

  // Relación Muchos a Muchos con Task a través de MaterialsTasks
  @BelongsToMany(() => Task, () => MaterialsTasks)
  tasks!: Task[];
}

export default Material;

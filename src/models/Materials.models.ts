import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';
import MaterialsTasks from './Materials_tasks.models';

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
}

export default Material;

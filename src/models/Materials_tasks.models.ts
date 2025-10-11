import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  DataType,
  BelongsTo
} from 'sequelize-typescript';
import Task from './Task.models';
import Material from './Materials.models';

@Table({
  tableName: 'materials_tasks',
  timestamps: false
})
class MaterialsTasks extends Model {
  @PrimaryKey
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
  })
  ID_task!: number;

  @PrimaryKey
  @ForeignKey(() => Material)
  @Column({
    type: DataType.INTEGER,
  })
  ID_materials!: number;


  @Column({
    type: DataType.TEXT,
  })
  observations!: string;

  @BelongsTo(() => Task)
  task!: Task;

  @BelongsTo(() => Material)
  material!: Material;
}

export default MaterialsTasks;

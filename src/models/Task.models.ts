import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany,
  BelongsToMany // Importa BelongsToMany
} from 'sequelize-typescript';
import GeneralTask from './General_tasks.models';
import TasksOperators from './Tasks_operators.models';
import MaterialsTasks from './Materials_tasks.models';
import User from './Users.models'; // Importa el modelo User
import Material from './Materials.models'; // Importa el modelo Material

@Table({
  tableName: 'task',
  timestamps: false
})
class Task extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_task!: number;

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
    defaultValue: DataType.NOW
  })
  assignment_date!: Date;



 

  @ForeignKey(() => GeneralTask)
  @Column({
    type: DataType.INTEGER,
  })
  ID_general_tasks!: number;

  @BelongsTo(() => GeneralTask, 'ID_general_tasks')
  generalTask!: GeneralTask;

  // Relación Muchos a Muchos con User a través de TasksOperators
  @BelongsToMany(() => User, () => TasksOperators)
  users!: User[];

  // Relación Muchos a Muchos con Material a través de MaterialsTasks
  @BelongsToMany(() => Material, () => MaterialsTasks)
  materials!: Material[];

  // Relaciones HasMany a las tablas intermedias
  @HasMany(() => TasksOperators)
  taskOperators!: TasksOperators[];

  @HasMany(() => MaterialsTasks)
  materialsTasks!: MaterialsTasks[];
}

export default Task;
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Unique,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany // Importa BelongsToMany
} from 'sequelize-typescript';

import Task from './Task.models'; // ¡Importa el modelo Task!
import Specialty from './Specialty.models';
import TypeUser from './Type_user.models';
import TasksOperators from './Tasks_operators.models';
import UsersSpecialty from './Users_specialty.models'; // Importa el modelo intermedio

@Table({
  tableName: 'users',
  timestamps: true
})
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_users!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  state!: boolean;

  // Relaciones

  @ForeignKey(() => TypeUser)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ID_type_user!: number;

  @BelongsTo(() => TypeUser)
  typeUser!: TypeUser;

  // Esta línea es la que faltaba para la relación Muchos a Muchos con Task
  @BelongsToMany(() => Task, () => TasksOperators)
  tasks!: Task[];

  @HasMany(() => TasksOperators)
  tasksOperators!: TasksOperators[];

  // Relación de muchos a muchos con Specialty a través de UsersSpecialty
  @BelongsToMany(() => Specialty, () => UsersSpecialty)
  specialties!: Specialty[];
}

export default User;

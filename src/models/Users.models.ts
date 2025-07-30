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
  HasMany
} from 'sequelize-typescript';

import Specialty from './Specialty.models';
import TypeUser from './Type_user.models';
import TasksOperators from './Tasks_operators.models';

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

  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ID_specialty!: number;

  @BelongsTo(() => Specialty)
  specialty!: Specialty;

  @ForeignKey(() => TypeUser)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ID_type_user!: number;

  @BelongsTo(() => TypeUser)
  typeUser!: TypeUser;

  @HasMany(() => TasksOperators)
  tasksOperators!: TasksOperators[];
}

export default User;

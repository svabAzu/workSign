import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasOne
} from 'sequelize-typescript';
import User from './Users.models';

@Table({
  tableName: 'type_user',
  timestamps: false
})
class TypeUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_type_user!: number;

  @Column({
    type: DataType.STRING(50),
  })
  name!: string;

  @HasOne(() => User)
  user!: User;
}

export default TypeUser;

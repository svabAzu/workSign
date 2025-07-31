import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import User from './Users.models';
import Specialty from './Specialty.models';

@Table({
  tableName: 'users_specialty',
  timestamps: false, 
})
class UsersSpecialty extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  ID_user!: number;

  @PrimaryKey
  @ForeignKey(() => Specialty)
  @Column({
    type: DataType.INTEGER,
  })
  ID_specialty!: number;
}

export default UsersSpecialty;
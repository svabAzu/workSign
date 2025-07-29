import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';
import User from './Users.models';

@Table({
  tableName: 'specialty',
  timestamps: false
})
class Specialty extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_specialty!: number;

  @Column({
    type: DataType.STRING(50),
  })
  name!: string;

  @HasMany(() => User)
  users!: User[];
}

export default Specialty;

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsToMany // Importa BelongsToMany
} from 'sequelize-typescript';
import User from './Users.models';
import UsersSpecialty from './Users_specialty.models'; // Importa el modelo intermedio

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

  // Relación de muchos a muchos con User a través de UsersSpecialty
  @BelongsToMany(() => User, () => UsersSpecialty)
  users!: User[];
}

export default Specialty;
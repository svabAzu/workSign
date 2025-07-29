import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany
} from 'sequelize-typescript';

import GeneralTask from './General_tasks.models';

@Table({
  tableName: 'Client',
  timestamps: false
})
class Client extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  ID_Client!: number;

  @Column({
    type: DataType.STRING(100),
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
  })
  company!: string;

  @Column({
    type: DataType.STRING(100),
  })
  phone!: string;

  @HasMany(() => GeneralTask)
  generalTasks!: GeneralTask[];
}

export default Client;

import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User ID',
    uniqueItems: true,
    example: 'af8fb48c-2c8d-4a9a-905f-1c09c416c2a3',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email',
    uniqueItems: true,
    example: 'admin123@gmail.com',
    nullable: false,
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    nullable: false,
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'User fullname',
    nullable: false,
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    description: 'User isActive',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['admin', 'user'],
    description: 'User roles',
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

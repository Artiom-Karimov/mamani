import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OperationType } from '../../operations/entities/operation-type';
import { DomainEntity } from '../../../shared/models/domain.entity';
import { User } from '../../users/entities/user.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Entity()
export class Category extends DomainEntity {
  @Column({ type: 'enum', enum: OperationType, nullable: false })
  type: OperationType;

  @Column({
    type: 'character varying',
    length: 50,
    nullable: false,
    collation: 'C',
  })
  name: string;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: true,
    collation: 'C',
  })
  description?: string;

  @Column({
    type: 'character varying',
    length: 20,
    nullable: true,
    collation: 'C',
  })
  color?: string;

  /** User is not necessary because categories can be common */
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  /** User is not necessary because categories can be common */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => Category, (p) => p.children)
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children?: Category[];

  constructor(data?: CreateCategoryDto, user?: User, parent?: Category) {
    super();
    if (!data) return;

    this.type = data.type;
    this.name = data.name;
    this.description = data.description;
    this.color = data.color;

    if (user) {
      this.user = user;
      this.userId = user.id;
    }
    if (parent) {
      if (parent.type !== this.type) this.type = parent.type;
      this.parent = parent;
      this.parentId = parent.id;
    }
  }

  update(data: UpdateCategoryDto): void {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.color) this.color = data.color;
  }

  get hasChildren(): boolean {
    return this.children != null && this.children.length > 0;
  }
}

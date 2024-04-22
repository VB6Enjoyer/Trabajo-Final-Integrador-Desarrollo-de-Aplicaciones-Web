import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    priority: 'Alta' | 'Media' | 'Baja';

    @Column()
    responsibleUser: string;
}
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./player";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Player)
    @JoinColumn()
    author: Player;

    @Column("varchar", {length: 300})
    text: string;

    @Column()
    name: string;

    @Column()
    discriminator: number;

    @Column()
    avatar: string;

    @CreateDateColumn()
    createdAt: Date;
}
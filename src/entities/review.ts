import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Player } from "./player";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Player, player => player.review)
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

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
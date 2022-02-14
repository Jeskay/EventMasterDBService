import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Player } from "./player";

@Entity()
export class Commend {
    @PrimaryColumn()
    authorId: string;

    @PrimaryColumn()
    subjectId: string;

    @PrimaryColumn()
    host: boolean;

    @PrimaryColumn()
    cheer: boolean;

    @Column()
    duplicates: number;

    @ManyToOne(() => Player, player => player.commendsBy, {primary: true})
    @JoinColumn({name: "authorId"})
    author: Player;

    @ManyToOne(() => Player, player => player.commendsAbout, {primary: true})
    @JoinColumn({name: "subjectId"})
    subject: Player;

    @CreateDateColumn()
    firstCommend: Date;

    @UpdateDateColumn()
    lastCommend: Date;
}
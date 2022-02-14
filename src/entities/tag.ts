import { Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Player } from "./player";

@Entity()
export class Tag {
    @PrimaryColumn()
    title: string;

    @ManyToMany(() => Player,player => player.subscriptions)
    @JoinTable()
    subscribers: Promise<Player[]>;
}
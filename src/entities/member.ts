import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Player } from "./player";
import { Server } from "./server";

@Entity()
export class GuildMember{
    @PrimaryColumn('uuid')
    id: string;

    @PrimaryColumn('uuid')
    guildId: string;

    @ManyToOne(() => Player, player => player.membership, {cascade: true})
    @JoinColumn({name: 'id'})
    player: Player;

    @ManyToOne(() => Server, server => server.members, {cascade: true})
    @JoinColumn({name: "guildId"})
    guild: Server;

    @Column()
    banned?: boolean = false;

    @Column()
    eventsPlayed: number = 0;

    @Column()
    eventsHosted: number = 0;

    @Column()
    tournamentsPlayed: number = 0;

    @Column()
    tournamentsHosted: number = 0;

    @Column({nullable: true})
    minutesPlayed: number = 0;

    @Column({type: 'timestamptz'})
    scoreTime: Date = new Date;

    @Index()
    @Column({nullable: true})
    score: number;

    @CreateDateColumn()
    joinedAt: Date;

}

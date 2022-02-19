import { Column, CreateDateColumn, Entity, Index, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Commend } from "./commend";
import { GuildMember } from "./member";
import { Review } from "./review";
import { Tag } from "./tag";

@Entity()
export class Player{
    @PrimaryColumn()
    id!: string;

    @Column()
    eventsPlayed: number = 0;

    @Column()
    eventsHosted: number = 0;

    @Column()
    tournamentsPlayed: number = 0;

    @Column()
    tournamentsHosted: number = 0;

    @Column()
    banned: number = 0;

    @OneToOne(() => Review, review => review.author, {eager: true})
    review: Review;

    @ManyToMany(() => Tag, tag => tag.subscribers)
    subscriptions: Promise<Tag[]>;

    @OneToMany(() => Commend, commend => commend.author, {eager: true})
    commendsBy: Commend[];

    @OneToMany(() => Commend, commend => commend.subject, {eager: true})
    commendsAbout: Commend[];

    @OneToMany(() => GuildMember, member => member.player, {eager: true})
    membership: GuildMember[];

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

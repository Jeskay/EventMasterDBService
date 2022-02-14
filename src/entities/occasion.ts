import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import {Server} from "./server";
import {OccasionState} from "../Controllers";

@Entity()
export class Occasion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Server, server => server.events, {cascade: true})
    server: Server;

    @Column('int')
    state: OccasionState;
    
    @Column()
    announced: boolean;

    @Column()
    voiceChannel: string;

    @Column()
    textChannel: string;

    @Column()
    initiator!: string;

    @Column({nullable: true})
    host: string;

    @Column({type: 'timestamptz', nullable: true})  
    startedAt: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    Title: string;
}
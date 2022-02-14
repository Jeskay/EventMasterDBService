import {Entity, Column, CreateDateColumn, OneToMany, PrimaryColumn} from "typeorm"
import { GuildMember } from "./member";
import { Occasion } from "./occasion";
import { Settings } from "./settings";

@Entity()
export class Server {
    @PrimaryColumn()
    guild!: string;

    @OneToMany(() => Occasion, occasion => occasion.server)
    events: Occasion[];
    
    @OneToMany(() => GuildMember, guildmember => guildmember.guild)
    members: GuildMember[];
    
    @Column(() => Settings)
    settings!: Settings;

    @Column({nullable: true})
    eventChannel: string;

    @Column({nullable: true})
    eventCategory: string;

    @CreateDateColumn()
    joinedAt: Date;

    @Column()
    description: string;
}

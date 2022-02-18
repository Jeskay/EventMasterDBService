import { Connection } from 'typeorm'
import { GuildMember } from '../entities/member';
import { Player } from '../entities/player';
import { Server } from '../entities/server';

export class MemberInterface {
    private connection: Connection;
    
    /** Creates GuildMember instance */
    public create(playerId: string, guildId: string, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number): GuildMember;

    public create(player: Player, guildId: string, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number): GuildMember;
    
    public create(playerId: string, server: Server, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number): GuildMember;

    public create(player: Player, server: Server, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number): GuildMember; 

    public create(player: string | Player, server: string | Server, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number, banned?: boolean): GuildMember{
        return this.connection.manager.create(GuildMember, {
            id: player instanceof Player ? player.id : player,
            guildId: server instanceof Server ? server.guild : server,
            eventsPlayed: eventsPlayed,
            eventsHosted: eventsHosted,
            minutesPlayed: minutesPlayed,
            banned: banned,
        });
    }
    /**
     * @param server id of guild which contains user
     * @param user id of user to find
     * @returns membership of user from a specific guild 
     */
    public async get(server: string, user: string): Promise<GuildMember>;
    /**
     * @param server guild which contains user
     * @param user id of user to find
     * @returns membership of user from a specific guild 
     */
    public async get(server: Server, user: string): Promise<GuildMember>;
    /**
     * @param server id of guild which contains user
     * @param user user to find
     * @returns membership of user from a specific guild 
     */
    public async get(server: string, user: Player): Promise<GuildMember>;
    /**
     * @param server guild which contains user
     * @param user user to find
     * @returns membership of user from a specific guild 
     */
    public async get(server: Server, user: Player): Promise<GuildMember>;

    public async get(server: string | Server, user: string | Player): Promise<GuildMember> {
        let member: GuildMember | undefined;
        if(server instanceof Server) {
            member = server.members.find((member) => user instanceof Player ? member.player == user : member.id == user);    
        }
        else if(user instanceof Player) {
            member = user.membership.find((member) => member.guildId == server);
        }
        else {
            member = await this.connection.manager.findOne(GuildMember, {id: user, guildId: server});
        }
        if(!member) throw new Error("User is not a member of guild.");
        return member;
    }

    /**
     * Adds member to the database
     * @param member GuildMember instance
     * @returns posted object
     */
    public post = async (member: GuildMember): Promise<GuildMember> => await this.connection.manager.save(member);

     /**
     * Removes member from database
     * @param member GuildMember instance
     * @returns removed instance
     */
    public remove = async (member: GuildMember): Promise<GuildMember> => await this.connection.manager.remove(member);

    /**
     * Updates member properties
     * @param member GuildMember instance
     * @param props object with fields and values which need to be updated
     */
    public async update(member: GuildMember, props: object): Promise<GuildMember>;

    public async update(member: GuildMember, props: object) {
        Object.keys(member).forEach(key => member[key] = key in props ? props[key] : member[key]);
        return this.connection.manager.save(member);
    }
    
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
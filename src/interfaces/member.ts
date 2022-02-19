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
    public async get(serverId: string, userId: string): Promise<GuildMember | undefined> {
        return await this.connection.manager.getRepository(GuildMember)
        .createQueryBuilder("guild_member")
        .leftJoinAndSelect("guild_member.player", "player")
        .leftJoinAndSelect("guild_member.guild", "guild")
        .where(`guild_member.id = :id and guild_member."guildId" = :server`, {id: userId, server: serverId})
        .getOne();
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
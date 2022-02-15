import { Connection } from 'typeorm'
import { GuildMember } from '../entities/member';
import { Player } from '../entities/player';
import { Server } from '../entities/server';
import { Settings } from '../entities/settings';


export class ServerInterface {
    private connection: Connection;
    
    /** Creates Server instance */
    public create(id: string, settings: ConstructorParameters<typeof Settings>): Server;
    public create(id: string, settings: ConstructorParameters<typeof Settings>, channelId?: string, categoryId?: string): Server;
    public create(id: string, settings: ConstructorParameters<typeof Settings>, channelId?: string, categoryId?: string, description?: string): Server;
    
    public create(id: string, settings: ConstructorParameters<typeof Settings>, channelId?: string, categoryId?: string, description?: string) {
        return this.connection.manager.create(Server, {
            guild: id,
            settings: new Settings(...settings),
            description: description || "empty"
        });
    }
    /** @returns server by guild id */
    public async get(id: string, loadRelations: boolean = false) {
        if(!loadRelations) 
            return this.connection.manager.findOne(Server, {guild: id});
        return await this.connection.getRepository(Server)
                .createQueryBuilder("server")
                .leftJoinAndSelect("server.events", "occasion")
                .leftJoinAndSelect("server.members", "guild_member")
                .where("server.guild = :guild", {guild: id})
                .getOne();
    }

    /**
     * Adds server to the database
     * @param server Server instance
     * @returns posted object
     */
    public post = async (server: Server): Promise<Server> => await this.connection.manager.save(server);

     /**
     * Removes server from database
     * @param server Server instance
     * @returns removed instance
     */
    public async remove(server: Server): Promise<Server>;
    /**
     * Removes server from database
     * @param id server id
     * @returns removed instance
     */
    public async remove(id: string): Promise<Server | undefined>;
    
    public async remove(server: Server | string) {
        if(server instanceof Server)
            return this.connection.manager.remove(server);
        const instance = await this.get(server);
        if(!server) throw new Error("Server does not exists.");
        return this.connection.manager.remove(instance);
    }
    /**
     * Updates server properties
     * @param server Server instance
     * @param params object with fields and values which need to be updated
     */
    public async update(server: Server, props: object): Promise<Server>;
    /**
     * Updates server settings
     * @param server Server instance
     * @param settings object with settings which need to be updated
     */
    public async update(server: Server, settings: object): Promise<Server>;
    /**
     * Updates server properties
     * @param id server id
     * @param params object with fields and values which need to be updated
     */
    public async update(id: string, props: object): Promise<Server>;
    /**
     * Updates server settings
     * @param id server id
     * @param settings object with settings which need to be updated
     */
    public async update(id: string, settings: object): Promise<Server>;

    public async update(server: Server | string, props?: object, settings?: object) {
        const instance = server instanceof Server ? server : await this.get(server);
        if(!instance) throw new Error("Server does not exists.");
        if(props)  
            Object.keys(instance).forEach(key => instance[key] = key in props ? props[key] : instance[key]);
        if(settings) 
            Object.keys(instance.settings).forEach(key => instance.settings[key] = key in settings ? settings[key] : instance.settings[key]);
        return this.connection.manager.save(instance);
    }
    /** 
     * @returns global players rating
     */
    public async rating(): Promise<Player[]>;
    /**
     * @param id server id
     * @returns guild players rating
     */
    public async rating(id: string): Promise<GuildMember[]>;
    /**
     * @param server Server instance 
     * @returns guild players rating
     */
    public async rating(server: Server): Promise<GuildMember[]>;

    public async rating(server?: Server | string){
        if(server) {
            const guildId = server instanceof Server ? server.guild : server;
            return await this.connection.manager.getRepository(GuildMember)
            .createQueryBuilder("guild_member")
            .where("guild_member.guildId = :guildId", {guildId: guildId})
            .getMany();
        }
        else return await this.connection.manager.getRepository(Player)
            .createQueryBuilder("player")
            .leftJoinAndSelect("player.commendsBy", "commend", "commend.author = id")
            .leftJoinAndSelect("player.commendsAbout",  "commend2", "commend2.subject = id")
            .getMany();
    }
    
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
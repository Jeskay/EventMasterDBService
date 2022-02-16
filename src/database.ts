import { Connection, getConnection } from "typeorm";
import { Server } from "./entities/server";
import { Occasion } from "./entities/occasion";
import { Player } from "./entities/player";
import { Commend } from "./entities/commend";
import { Tag } from "./entities/tag";
import { GuildMember } from "./entities/member";

export class DataBaseManager{
    private connection: Connection;

    public connect = async () => await this.connection.connect();
    /** @returns server by guild id */
    
    /** Creates Occasion instance */
    public occasion = (event: object) => this.connection.manager.create(Occasion, event);
    /** Creates Player instance */
    public player = (player: object) => this.connection.manager.create(Player, player);
    /** Creates Commend instance */
    public commend = (commend: object) => this.connection.manager.create(Commend, commend);
    /** Creates Server instance */
    public server = (server: object) => this.connection.manager.create(Server, server);
    /**Creates Tag instance */
    public tag = (tag: object) => this.connection.manager.create(Tag, tag);

    /** @returns server by guild id */
    public getServer = async(id: string) => await this.connection.manager.findOne(Server, {guild: id});
    /** @returns player by user id */
    public getPlayer = async (id: string) => await this.connection.manager.findOne(Player, {id: id});
    /**
     * @param server guild which contains user
     * @param user user to find
     * @returns membership of user from a specific guild 
     */
    public async getMember(server: string | Server, user: string | Player) {
        let member: GuildMember | undefined;
        if(server instanceof Server) {
            member = server.members.find((member) => user instanceof Player ? member.player == user : member.id == user);    
        }
        else if(user instanceof Player) {
            member = user.membership.find((member) => member.guildId == server);
        }
        else {
            const player = await this.getPlayerRelation(user);
            member = player.membership.find(member => member.guildId == server);
        }
        if(!member) throw new Error("User is not a member of guild.");
        return member;
    }
    /**
     * @returns guild players ranking
     */
    public getRanking(guildId: string): Promise<GuildMember[]>;
    /**
     * @returns global players ranking
     */
    public getRanking(): Promise<Player[]>;

    public async getRanking(guildId?: string) {
        if(guildId) return await this.connection.manager.getRepository(GuildMember)
            .createQueryBuilder("guild_member")
            .where("guild_member.guildId = :guildId", {guildId: guildId})
            .getMany();
        else return await this.connection.manager.getRepository(Player)
            .createQueryBuilder("player")
            .leftJoinAndSelect("player.commendsBy", "commend", "commend.author = id")
            .leftJoinAndSelect("player.commendsAbout",  "commend2", "commend2.subject = id")
            .getMany();
    }

    /**
     * @param authorId commend's author
     * @param subjectId subject of commend
     * @param hosting is commend about host
     * @returns Commend
     */
    public getCommend = async (authorId: string, subjectId: string, hosting: boolean, cheer: boolean) => await this.connection.manager.findOne(Commend, {authorId: authorId, subjectId: subjectId, host: hosting, cheer: cheer});
    /**@returns tag by its name */
    public getTag = async(id: string) => await this.connection.manager.findOne(Tag, {title: id});

    /**
     * @param params object with Commend fields, describing search parameters
     * @returns Commends matched parameters
     */
    public getCommends = async (params: object) => await this.connection.manager.find(Commend, params);
    /**
     * @param serverID 
     * @returns server instance with occasions
     */
    public async getServerRelations(serverID: string) {
            const server = await this.connection.getRepository(Server)
            .createQueryBuilder("server")
            .leftJoinAndSelect("server.events", "occasion")
            .leftJoinAndSelect("server.members", "guild_member")
            .where("server.guild = :guild", {guild: serverID})
            .getOne();
            if(!server) throw new Error("Guild with followed id is not registered.");
            return server;
    }
    /**
     * @param userId 
     * @returns player instance with subscriptions
     */
    public async getPlayerRelation(userId: string) {
        const user = await this.connection.getRepository(Player)
        .createQueryBuilder("player")
        .leftJoinAndSelect("player.subscriptions", "tag")
        .where("player.id = :id", {id: userId})
        .leftJoinAndSelect("player.membership", "guild_member")
        .getOne();
        if(!user) throw new Error("Player with followed id is not registered.");
        return user;
    }

    /**
     * Adds server to the database
     * @param server object with fields and values of Server
     * @returns Promise
     */
    public async addServer(server: object){
        const post = this.connection.manager.create(Server, server);
        await this.connection.manager.save(post);
    }
    /**
     * Adds player instance to the database
     * @param player object with fields and values which needs to be added
     */
    public async addPlayer(player: object) {
        const post = this.player(player);
        await this.connection.manager.save(post);
        return post;
    }
    public async addMember(member: object) {
        const post = this.connection.manager.create(GuildMember, member);
        post.score = 0;
        await this.connection.manager.save(post);
    }
    /**
     * Adds occasion instance to the server
     * @param guildID guild id
     * @param occasion object with fields and values which needs to be added
     * @returns Promise
     */
    public async addOccasion(guildID: string, occasion: object){
        const post = this.occasion(occasion);
        const server = await this.getServer(guildID);
        if(!server) throw new Error("Guild with followed id is not registered.");
        else if(server.events && server.events.includes(post)) throw new Error("There is an occasion's duplicate.");
        await this.connection.manager.save(post);
    }
    /**
     * Adds commend instance to the database
     * @param commend object with fields and values which needs to be added
     */
    public async addCommend(commend: object) {
       const post = this.commend(commend);
        await this.connection.manager.save(post);
    }
    /**
     * Adds tag instance to the database
     * @param tag object with fields and values which needs to be added
     */
    public async addTag(tag: object) {
        const post = this.tag(tag);
        await this.connection.manager.save(post);
    }

    /**
     * Removes server instance
     * @param serverID guild id
     * @returns Promise
     */
    public async removeServer(serverID: string){
        const server = await this.getServer(serverID);
        if(server == undefined) throw new Error("Server does not exist");
        this.connection.manager.remove(server);
    }
    /**
     * Removes occasion
     * @param guildID guild id
     * @param voiceChannel voice channel id
     * @returns Promise
     */
    public async removeOccasion(guildID: string, voiceChannel: string){
        const server = await this.getServerRelations(guildID);
        if(!server) throw new Error("Guild with followed id is not registered.");
        const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
        if(!occasion) throw new Error("Cannot find occasion with following voice channel");
        await this.connection.manager.remove(occasion);
        return {voice: occasion.voiceChannel, text: occasion.textChannel};
    }
    /**
     * Removes player
     * @param userID user id
     */
    public async removePlayer(userID: string) {
        const player = await this.getPlayer(userID);
        if(!player) throw new Error("Cannot find player");
        await this.connection.manager.remove(player);
    }
    public async removeMember(serverId: string, userId: string) {
        const member = await this.getMember(serverId, userId);
        if(!member) throw new Error("Cannot find player");
        await this.connection.manager.remove(member);
    }
    /**
     * Removes tag
     * @param tagId tag id
     */
    public async removeTag(tagId: string) {
        const tag = await this.getTag(tagId);
        if(!tag) throw new Error("Tag does not exist.");
        await this.connection.manager.remove(tag);
    }

    /**
     * Updates server instance
     * @param guildID guild id
     * @param params object with fields and values which need to be updated
     * @returns Promise
     */
    public async updateServer(guildID: string, params: object){
        const current = await this.getServer(guildID);
        if(!current) throw new Error("Cannot find server.");
        else Object.keys(current).forEach(key => current[key] = key in params ? params[key] : current[key]);
        await this.connection.manager.save(current);
    }
    /**
     * Updates server settings
     * @param guildID guild id
     * @param params object with settings which need to be updated
     */
    public async updateSettings(guildID: string, params: object){
        const server = await this.getServer(guildID);
        if(!server) throw new Error("Cannot find server.");
        Object.keys(server.settings).forEach(key => server.settings[key] = key in params ? params[key] : server.settings[key]);
        await this.connection.manager.save(server);
    }
    /**
     * Updates occasion instance
     * @param guildID guild id
     * @param voiceChannel voice channel id
     * @param params object with fields and values which need to be updated
     */
    public async updateOccasion(guildID: string, voiceChannel: string, params: object) {
        const server = await this.getServerRelations(guildID);
        if(!server) throw new Error("Guild with followed id is not registered.");
        const occasion = server.events.find(event => event.voiceChannel == voiceChannel);
        if(!occasion) throw new Error("Cannot find occasion with following voice channel.");
        Object.keys(occasion).forEach(key => occasion[key] = key in params ? params[key] : occasion[key]);
        await this.connection.manager.save(occasion);
    }
    /**
     * Updates player instance
     * @param instance player instance to update
     */
    public async updatePlayer(instance: Player): Promise<void>;
    /**
     * Updates player instance
     * @param instance object with fields and values which need to be updated
     */
    public async updatePlayer(instance: object): Promise<void>;

    public async updatePlayer(instance: object) {
        let player: Player;
        if(instance instanceof Player) {
            player = instance;
        } 
        else {
            if(!Object.keys(instance).includes('id')) throw new Error("Player id must be provided.");
            const result = await this.getPlayer(instance['id']);
            if(!result) throw new Error("Cannot find the player.");
            Object.keys(result).forEach(key => result[key] = key in instance ? instance[key] : result[key]);
            player = result;
        }
        await this.connection.manager.save(player);
    }
    /**
     * Updates member instance
     * @param instance member instance to update
     */
    public async updateMember(instance: GuildMember): Promise<void>;
    /**
     * Updates member instance
     * @param instance object with fields and values which need to be updated
     */
    public async updateMember(instance: object): Promise<void>;
    public async updateMember(instance: object){
        const member = (instance instanceof GuildMember) ? instance : this.connection.manager.create(GuildMember, instance);
        await this.connection.manager.save(member);
    }
    /**
     * Updates commend instance
     * @param commend instance to update
     * @param params object with fields and values which need to be updated
     */
    public async updateCommend(commend: Commend, params: object){
        await this.connection.getRepository(Commend).update({
            authorId: commend.authorId, 
            subjectId: commend.subjectId, 
            host: commend.host, 
            cheer: commend.cheer
        }, params);
    }
    
    constructor (){
        this.connection = getConnection();
    }
}
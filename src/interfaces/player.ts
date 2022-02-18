import { Connection } from 'typeorm'
import { Player } from '../entities/player';

export class PlayerInterface {
    private connection: Connection;
    
    /** Creates Player instance */
    public create(id: string): Player;
    public create(id: string, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number, score?: number): Player;

    public create(id: string, eventsPlayed?: number, eventsHosted?: number, minutesPlayed?: number, score?: number): Player{
        return this.connection.manager.create(Player, {
            id: id,
            eventsPlayed: eventsPlayed,
            eventsHosted: eventsHosted,
            minutesPlayed: minutesPlayed,
            score: score
        });
    }
    /** @returns player by user id */
    public async get(id: string, loadRelations: boolean = false) {
        if(!loadRelations) 
            return this.connection.manager.findOne(Player, {id: id});
        else return await this.connection.getRepository(Player)
        .createQueryBuilder("player")
        .leftJoinAndSelect("player.subscriptions", "tag")
        .where("player.id = :id", {id: id})
        .leftJoinAndSelect("player.membership", "guild_member")
        .getOne();
    }

    /**
     * Adds player to the database
     * @param player Player instance
     * @returns posted object
     */
    public post = async (player: Player): Promise<Player> => await this.connection.manager.save(player);

     /**
     * Removes player from database
     * @param player player instance
     * @returns removed instance
     */
    public async remove(player: Player): Promise<Player>;
    /**
     * Removes player from database
     * @param id player id
     * @returns removed instance
     */
    public async remove(id: string): Promise<Player | undefined>;
    
    public async remove(player: Player | string) {
        if(player instanceof Player)
            return this.connection.manager.remove(player);
        const instance = await this.get(player);
        if(!player) throw new Error("player does not exists.");
        return this.connection.manager.remove(instance);
    }

    /**
     * Updates player properties
     * @param player player instance
     * @param params object with fields and values which need to be updated
     */
    public async update(player: Player, props: object): Promise<Player>;
    /**
     * Updates player properties
     * @param id player id
     * @param params object with fields and values which need to be updated
     */
    public async update(id: string, props: object): Promise<Player>;

    public async update(player: Player | string, props: object) {
        const instance = player instanceof Player ? player : await this.get(player);
        if(!instance) throw new Error("player does not exists.");
        Object.keys(instance).forEach(key => instance[key] = key in props ? props[key] : instance[key]);
        return this.connection.manager.save(instance);
    }
    
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
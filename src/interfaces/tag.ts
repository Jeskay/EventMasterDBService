import { Connection } from 'typeorm'
import { Player } from '../entities/player';
import { Tag } from '../entities/tag';


export class TagInterface {
    private connection: Connection;
    
    /** Creates Tag instance */
    public create(title: string): Tag{
        return this.connection.manager.create(Tag, {
            title: title
        });
    }

    /**
     * Adds tag to the database
     * @param tag Tag instance
     * @returns posted object
     */
    public async post(tag: Tag): Promise<Tag> {
        const instance = await this.connection.manager.findOne(Tag, {title: tag.title});
        if(instance) throw new Error("This tag is already registered");
        return await this.connection.manager.save(tag);
    }

    /**
     * Removes tag from the database
     * @returns removed object */
    public async get(title: string, loadRelations: boolean = false) {
        if(!loadRelations) 
            return await this.connection.manager.findOne(Tag, {title: title});
        else return await this.connection.getRepository(Tag)
        .createQueryBuilder("tag")
        .where("tag.title = :title", {title: title})
        .leftJoinAndSelect("tag.subscribers", "player")
        .getOne();
    } 
    /**
     * Add tag to player's subscriptions
     * @param player Player instance
     * @param tag Tag instance
    */
    public async subscribe(tag: Tag, player: Player) {
        if(!tag.subscribers) tag.subscribers = [];
        tag.subscribers.push(player);
        return await this.connection.manager.save(tag);
    }
    
    /**
     * Remove tag from player's subscriptions
     * @param player Player instance
     * @param tag Tag instance
    */
    public async unsubscribe(tag: Tag, player: Player): Promise<Tag>;
    /**
     * Remove tag from player's subscriptions
     * @param userId id for user to remove
     * @param tag Tag instance
    */
    public async unsubscribe(tag: Tag, userId: string): Promise<Tag>;

    public async unsubscribe(tag: Tag, player: Player | string): Promise<Tag> {
        if(!tag.subscribers) tag.subscribers = [];
        tag.subscribers = tag.subscribers.filter(element => element.id != (player instanceof Player ? player.id :player));
        return await this.connection.manager.save(tag);
    }
    
    /**
     * Removes tag
     * @param tag tag instance
     */
    public async remove(tag: Tag): Promise<Tag>;
    /**
     * Removes tag
     * @param title title of tag
     */
    public async remove(title: string): Promise<Tag>;

    public async remove(tag: string | Tag) {
        if(tag instanceof Tag)
            return await this.connection.manager.remove(tag);
        const instance = await this.get(tag);
        if(!instance) throw new Error("Tag does not exist.");
        return await this.connection.manager.remove(instance);
    }
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
import { Connection } from 'typeorm'
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
    public get = async(title: string) => await this.connection.manager.findOne(Tag, {title: title});
    
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
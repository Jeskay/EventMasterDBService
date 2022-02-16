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
        if(!instance) throw new Error("Tag with followed id is not registered.");
        return await this.connection.manager.save(tag);
    }

    /**
     * Removes tag from the database
     * @returns removed object */
    public get = async(title: string) => await this.connection.manager.findOne(Tag, {title: title});
    
    /**
     * Removes tag
     * @param title tag id
     */
    public async remove(title: string) {
        const tag = await this.get(title);
        if(!tag) throw new Error("Tag does not exist.");
        return await this.connection.manager.remove(tag);
    }
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
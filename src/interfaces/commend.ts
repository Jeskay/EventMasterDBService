import { Connection } from 'typeorm'
import { Commend } from '../entities/commend';
import { Tag } from '../entities/tag';


export class CommendInterface {
    private connection: Connection;
    
    /** Creates Commend instance */
    public create(authorId: string, subjectId: string, cheer: boolean): Commend;
    public create(authorId: string, subjectId: string, cheer: boolean, host: boolean): Commend;

    public create(authorId: string, subjectId: string, cheer: boolean = true, host: boolean = false) {
        return this.connection.manager.create(Commend, {
            authorId: authorId,
            subjectId: subjectId,
            host: host,
            cheer: cheer,
        });
    } 

    /**
     * Gets Commend instance from database
     * @param authorId commend's author
     * @param subjectId subject of commend
     * @param hosting is commend about host
     * @param cheer is commend positive or not
     * @returns Commend
     */
    public async get(authorId: string, subjectId: string, hosting: boolean, cheer: boolean) {
        return await this.connection.manager.findOne(Commend, {
            authorId: authorId, 
            subjectId: subjectId, 
            host: hosting, 
            cheer: cheer
        });
    }

    /**
    * Adds Commend to the database
    * @param commend Commend instance
    */
    public async post(commend: Commend) {
        await this.connection.manager.save(commend);
    }

    /**
    * Removes tag
    * @param title tag id
    */
    public async removeTag(commend: Commend) {
        return await this.connection.manager.remove(commend);
    }

    /**
     * Get all matching commends
     * @param params object with Commend fields, describing search parameters
     * @returns Commends matched parameters
     */
    public async search( params: object) {
        await this.connection.manager.find(Commend, params);
    }

    constructor(connection: Connection) {
        this.connection = connection;
    }
}
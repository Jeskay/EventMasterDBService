import { Connection } from 'typeorm'
import { Commend } from '../entities/commend';
import { Review } from '../entities/review';

export class ReviewInterface {
    private connection: Connection;
    
    /** Creates Commend instance */
    public create(text: string, name: string, discriminator: number, avatar: string) {
        return this.connection.manager.create(Review, {
            name: name,
            text: text,
            discriminator: discriminator,
            avatar: avatar
        });
    } 

    /**
     * Gets Review instance from database
     * @param id id of the review
     */
    public async get(id: number) {
        return await this.connection.manager.findOne(Review, { id: id });
    }

    /**
    * Adds Review to the database
    * @param review Review instance
    */
    public async post(review: Review) {
        return await this.connection.manager.save(review);
    }

    /**
     * Updates review properties
     * @param review Review instance
     * @param props properties to update
     */
    public async update(review: Review, props: object): Promise<Review>;
    /**
     * Updates review properties
     * @param reviewId review id
     * @param props properties to update
     */
    public async update(reviewId: number, props: object): Promise<Review>;

    public async update(review: Review | number, props: object) {
        const instance = review instanceof Review ? review : await this.get(review);
        if(!instance) throw new Error("Review does not exists.");
        Object.keys(instance).forEach(key => instance[key] = key in props ? props[key] : instance[key]);
        return this.connection.manager.save(instance);
    }
    /**
    * Removes review
    * @param review Review instance
    */
    public async remove(review: Review) {
        return await this.connection.manager.remove(review);
    }

    constructor(connection: Connection) {
        this.connection = connection;
    }
}
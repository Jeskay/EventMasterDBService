import { Connection } from 'typeorm'
import { GuildMember } from '../entities/member';
import { Occasion, OccasionState } from '../entities/occasion';
import { Player } from '../entities/player';
import { Server } from '../entities/server';
import { Settings } from '../entities/settings';


export class OccasionInterface {
    private connection: Connection;
    
    /** Creates Occasion instance */
    public create(server: Server, state: OccasionState, announced: boolean, voiceId: string, textId: string, initiatorId: string): Occasion;
    public create(server: Server, state: OccasionState, announced: boolean, voiceId: string, textId: string, initiatorId: string, title?: string, description?: string, host?: string): Occasion;

    public create(server: Server, state: OccasionState, announced: boolean = false, voiceId: string, textId: string, initiatorId: string, title?: string, description?: string, host?: string): Occasion{
        return this.connection.manager.create(Occasion, {
            state: state,
            announced: announced,
            voiceChannel: voiceId,
            textChannel: textId,
            host: host,
            initiator: initiatorId,
            Title: title,
            description: description,
            server: server
        })
    }
    /**
     * Adds occasion to the database
     * @param occasion Occasion instance
     * @returns posted object
     */
    public async post(occasion: Occasion): Promise<Occasion>;

    public async post(occasion: Occasion): Promise<Occasion> {
        return await this.connection.manager.save(occasion);
    }

    /**
     * Gets Occasion instance
     * @param id occasion id
     */
    public async get(id: number): Promise<Occasion | undefined> {
        return await this.connection.getRepository(Occasion)
        .createQueryBuilder("occasion")
        .leftJoinAndSelect("occasion.server", "server")
        .where("occasion.id = :id", {id: id})
        .getOne();
    }

    /**
    * Updates Occasion instance
    * @param occasion Occasion instance
    * @param params object with fields and values which need to be updated
    */
    public async update(occasion: Occasion, params: object) {
        Object.keys(occasion).forEach(key => occasion[key] = key in params ? params[key] : occasion[key]);
        return await this.connection.manager.save(occasion);
    }
    
    constructor(connection: Connection) {
        this.connection = connection;
    }
}
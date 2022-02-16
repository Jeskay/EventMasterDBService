import { Connection } from 'typeorm'
import { GuildMember } from '../entities/member';
import { Occasion, OccasionState } from '../entities/occasion';
import { Player } from '../entities/player';
import { Server } from '../entities/server';
import { Settings } from '../entities/settings';


export class OccasionInterface {
    private connection: Connection;
    
    /** Creates Occasion instance */
    public create(state: OccasionState, announced: boolean, voiceId: string, textId: string, initiatorId: string): Occasion;
    public create(state: OccasionState, announced: boolean, voiceId: string, textId: string, initiatorId: string, title?: string, description?: string, host?: string): Occasion;

    public create(state: OccasionState, announced: boolean = false, voiceId: string, textId: string, initiatorId: string, title?: string, description?: string, host?: string): Occasion{
        return this.connection.manager.create(Occasion, {
            state: state,
            announced: announced,
            voiceChannel: voiceId,
            textChannel: textId,
            host: host,
            initiator: initiatorId,
            Title: title,
            description: description,
        })
    }

    /**
     * Adds occasion to the database
     * @param occasion Server instance
     * @param guildId guild id
     * @returns posted object
     */
    public async post(occasion: Occasion, guildId: string): Promise<Occasion> {
        const server = await this.connection.manager.findOne(Server, {guild: guildId});
        if(!server) throw new Error("Guild with followed id is not registered.");
        return await this.connection.manager.save(occasion);
    }

    /**
    * Updates occasion instance
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
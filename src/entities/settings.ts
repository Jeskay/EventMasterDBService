import {Column} from "typeorm";

export class Settings {

    @Column("bigint", {nullable: false, array: true})
    owners: string[];
    
    @Column()
    limit: number;

    @Column({nullable: true})
    occasion_limit?: number;

    @Column({type: "text", nullable: true})
    notification_channel?: string;

    @Column({type: "text", nullable: true})
    logging_channel?: string;

    @Column({type: "text", nullable: true})
    event_role?: string;

    @Column({type: "text", array: true})
    black_list: string[];

    constructor(owner: string, limit: number, black_list: string[]){
        this.limit = limit;
        this.black_list = black_list;
        this.owners = [owner];
    }
}
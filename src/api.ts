import {Connection} from 'typeorm';
import { CommendInterface, MemberInterface, OccasionInterface, PlayerInterface, ReviewInterface, ServerInterface, TagInterface } from './interfaces';

export class DataBaseAPI {

    public Server: ServerInterface;

    public Player: PlayerInterface;

    public Member: MemberInterface;

    public Occasion: OccasionInterface;

    public Tag: TagInterface;

    public Commend: CommendInterface;

    public Review: ReviewInterface;

    constructor(connection: Connection) {
        this.Server     = new ServerInterface(connection);
        this.Player     = new PlayerInterface(connection);
        this.Member     = new MemberInterface(connection);
        this.Occasion   = new OccasionInterface(connection);
        this.Tag        = new TagInterface(connection);
        this.Commend    = new CommendInterface(connection);
        this.Review     = new ReviewInterface(connection);
    }
}
import {Connection} from 'typeorm';
import { ServerInterface } from './interfaces/server';

export class DataBaseAPI {

    public Server: ServerInterface;

    constructor(connection: Connection) {
        this.Server = new ServerInterface(connection);
    }
}
import { getConnection } from 'typeorm';
import { DataBaseAPI } from '../../api';
import { DataBaseManager } from '../../database';
import { Settings } from '../../entities/settings';
import connection from '../connection';

beforeAll(async () => {
    await connection.create();
});

afterAll(async () =>{
    await connection.close();
});

beforeEach(async () => {
    await connection.clear();
});

test(' server create instance', async () => {
    const api = new DataBaseAPI(getConnection());
    const server = api.Server.create("1", ["2231122", 5, []]);
    const posted = await api.Server.post(server);
    const result = await api.Server.get(server.guild);
    expect(result).toEqual(posted);
});
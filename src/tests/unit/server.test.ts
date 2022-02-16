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

test('server instances can be created and deleted', async () => {
    const api = new DataBaseAPI(getConnection());
    const server = api.Server.create("1", ["2231122", 5, []]);
    const posted = await api.Server.post(server);
    const result = await api.Server.get(server.guild);
    expect(result).toEqual(posted);
    await api.Server.remove(server.guild);
    expect(await api.Server.get(server.guild)).toBe(undefined);
});

test('server properties can be updated', async () => {
    const api = new DataBaseAPI( getConnection() );
    const posted = await api.Server.post(api.Server.create("2", ["2231122", 5, []]));
    await api.Server.update(posted.guild, {eventChannel: "4325", eventCategory: "12345", extraOption: 34});
    const result = await api.Server.get(posted.guild);
    expect(result?.eventCategory).toBe("12345");
    expect(result?.eventChannel).toBe("4325");
});
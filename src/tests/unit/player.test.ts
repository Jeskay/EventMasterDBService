import { getConnection } from "typeorm";
import { DataBaseAPI } from "../../api";
import connection from "../connection";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () =>{
    await connection.close();
});

beforeEach(async () => {
    await connection.clear();
});

test('player instances can be created and deleted', async () => {
    const api = new DataBaseAPI(getConnection());
    const player = api.Player.create("123");
    const posted = await api.Player.post(player);
    const result = await api.Player.get(posted.id);
    expect(result?.id).toEqual(posted.id);
    const removed = await api.Player.remove(posted);
    expect(removed.id).toEqual(posted.id);
    expect(await api.Player.get(posted.id)).toBe(undefined);
});

test('player properties can be updated', async () => {
    const api = new DataBaseAPI( getConnection() );
    const posted = await api.Player.post(api.Player.create("2"));
    await api.Player.update(posted, {eventsPlayed: 10, random: "abc", minutesPlayed: 100});
    const result = await api.Player.get(posted.id);
    expect(result?.eventsPlayed).toBe(10);
    expect(result?.minutesPlayed).toBe(100);
});
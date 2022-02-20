import { getConnection } from "typeorm";
import { DataBaseAPI } from "../../api";
import { Tag } from "../../entities/tag";
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

test('subscribe to event', async () => {
    const api = new DataBaseAPI(getConnection());
    const player = await api.Player.post(api.Player.create("111"));
    const tag = await api.Tag.post(api.Tag.create("new tag"));
    const result = await api.Player.subscribe(player, tag);
    expect(result.subscriptions.find(elem => elem.title === tag.title)).not.toBe(undefined);
});

test('unsubscribe from event', async () => {
    const api = new DataBaseAPI(getConnection());
    const player = await api.Player.post(api.Player.create("222"));
    const tag = await api.Tag.post(api.Tag.create('new tag'));
    await api.Player.subscribe(player, tag);
    await api.Player.unsubscribe(player, tag);
    const result = await api.Player.get(player.id, true);
    expect(result?.subscriptions.find(el => el.title == 'new tag')).toBe(undefined);
});
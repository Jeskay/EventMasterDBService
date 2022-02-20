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

test('subscribe to existing events', async () => {
    const api = new DataBaseAPI(getConnection());
    const player = await api.Player.post(api.Player.create("111"));
    const tags: Tag[] = [];
    for(let i = 1; i <= 10; i++) {
        const tag = await api.Tag.post(api.Tag.create(`tagNo${i}`));
        await player.subscribe(tag);
        tags.push(tag);
    }
    expect((await player.subscriptions).every((tag, index) => tag.title == tags[index].title)).toBeTruthy();
});

test('subscribe to new events', async () => {
    const api = new DataBaseAPI(getConnection());
    const title = "another title";
    const player = await api.Player.post(api.Player.create("111"));
    await api.Player.subscribe(title);
    const result = await player.subscriptions;
    expect(result.find(tag => tag.title == title)).not.toBe(undefined);
});

test('unsubscribe from event', async () => {

});
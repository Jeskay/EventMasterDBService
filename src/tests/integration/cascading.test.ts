import { getConnection } from "typeorm";
import { DataBaseAPI } from "../../api";
import { OccasionState } from "../../entities/occasion";
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

test('server delete removes all related members', async () => {
    const api = new DataBaseAPI(getConnection());
    const server = await api.Server.post(api.Server.create("111", ["22233", 4, []]));
    const player = await api.Player.post(api.Player.create("111"));
    const member = await api.Member.post(api.Member.create(player.id, server.guild));
    await api.Server.remove(server);
    expect(await api.Member.get(member.guildId, member.id)).toBe(undefined);
});

test('server delete removes all related occasions', async () => {
    const api = new DataBaseAPI(getConnection());
    const server = await api.Server.post(api.Server.create("111", ["22233", 4, []]));
    const occasion = await api.Occasion.post(api.Occasion.create(server, OccasionState.waiting, false, "11", "22", "2233"));
    await api.Server.remove(server);
    expect(await api.Occasion.get(occasion.id)).toBe(undefined);
});

test('player delete removes all related members', async () => {
    const api = new DataBaseAPI(getConnection());
    const server = await api.Server.post(api.Server.create("111", ["22233", 4, []]));
    const player = await api.Player.post(api.Player.create("111"));
    const member = await api.Member.post(api.Member.create(player.id, server.guild));
    await api.Player.remove(player);
    expect(await api.Member.get(member.guildId, member.id)).toBe(undefined);
});

test('player delete removes all related commends', async () => {
    const api = new DataBaseAPI(getConnection());
    const player1 = await api.Player.post(api.Player.create("111"));
    const player2 = await api.Player.post(api.Player.create("222"));
    const commend = await api.Commend.post(api.Commend.create(player1.id, player2.id, true));
    await api.Player.remove(player1);
    expect(await api.Commend.get(player1.id, player2.id, false, true)).toBe(undefined);
});

test('player delete removes the review', async () => {
    const api = new DataBaseAPI(getConnection());
    const player = await api.Player.post(api.Player.create("111"));
    const review = await api.Review.post(api.Review.create(player, "new review", "User", 2221, "example.jpg"));
    await api.Player.remove(player);
    expect(await api.Review.get(review.id)).toBe(undefined);
});

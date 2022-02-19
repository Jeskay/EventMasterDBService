import { getConnection } from "typeorm";
import { isDeepStrictEqual } from "util";
import { DataBaseAPI } from "../../api";
import { GuildMember } from "../../entities/member";
import connection from "../connection";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () =>{
    await connection.close();
});

describe('player / memeber relations', () => {

    beforeEach(async () => {
        await connection.clear();
    });

    test('player changes does not affect member instances', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('193321'));

        const membersCreated: GuildMember[] = [];
        for ( var i = 0; i < 10; i++ ) {
            const server = api.Server.create(`ServerGG${i}`, ["12345", 4, []]);    
            const member = api.Member.create(player, server);
            await api.Server.post(server);
            const postedMember = await api.Member.post(member);
            membersCreated.push(postedMember);
        }
        await api.Player.update(player, {eventsPlayed: 100});
        await Promise.all(membersCreated.map( async member => {
            const result = await api.Member.get(member.guildId, member.id);
            expect(result?.eventsPlayed).not.toBe(100);
        }));
    });

    test('members changes does not affect player instance', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('123'));

        const membersCreated: GuildMember[] = [];
        for ( var i = 0; i < 10; i++ ) {
            const server = api.Server.create(`server${i}`, ["12345", 4, []]);    
            const member = api.Member.create(player, server);
            await api.Server.post(server);
            const postedMember = await api.Member.post(member);
            membersCreated.push(postedMember);
        }
        await Promise.all(membersCreated.map( async member => {
            await api.Member.update(member, {minutesPlayed: 10});
        }));
        const result = await api.Player.get(player.id);
        expect(result?.minutesPlayed).toBe(0);
    });

    test('member instance can be received from player', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('123321'));
        const server = await api.Server.post(api.Server.create("111", ["3321", 4, []]));
        const member = await api.Member.post(api.Member.create(player.id, server.guild, 10, 1, 100));
        const nplayer = await api.Player.get(player.id, true);
        const founded = nplayer?.membership.find(element => element.id == member.id && element.guildId == member.guildId);
        expect(isDeepStrictEqual(founded, member)).toBeTruthy();
    });

    test('player instance can be received from member', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('223321'));
        const server = await api.Server.post(api.Server.create("112", ["3321", 4, []]));
        const member = await api.Member.post(api.Member.create(player.id, server.guild, 10, 1, 100));
        const nmember = await api.Member.get(member.guildId, member.id);
        expect(nmember?.player.id).toBe(player.id);
    });
});

describe('server / member relationship', () => {

    beforeEach(async () => {
        await connection.clear();
    });

    test('member instance can be received from server', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('124321'));
        const server = await api.Server.post(api.Server.create("11411", ["3321", 4, []]));
        const member = await api.Member.post(api.Member.create(player.id, server.guild, 10, 1, 100));
        const nserver = await api.Server.get(server.guild, true);
        const founded = nserver?.members.find(element => element.id == member.id && element.guildId == member.guildId);
        expect(isDeepStrictEqual(founded, member)).toBeTruthy();
    });

    test('server instance can be received from member', async () => {
        const api = new DataBaseAPI(getConnection());
        const player = await api.Player.post(api.Player.create('233321'));
        const server = await api.Server.post(api.Server.create("113", ["3321", 4, []]));
        const member = await api.Member.post(api.Member.create(player.id, server.guild, 10, 1, 100));
        const nmember = await api.Member.get(member.guildId, member.id);
        expect(nmember?.guild.guild).toBe(server.guild);
    });
});
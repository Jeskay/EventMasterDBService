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

describe('occasion / server relations', () => {
    
    beforeEach(async () => {
        await connection.clear();
    });

    test('occasion can be created on the server', async () => {
        const api = new DataBaseAPI(getConnection());
        const server = await api.Server.post(api.Server.create("11", ["2231122", 5, []]));
        const occasion = await api.Occasion.post( api.Occasion.create(server, OccasionState.waiting, false, "111", "222", "333"));
        const result = await api.Occasion.get(occasion.id);
        expect(result).not.toBe(undefined);
    });

    test('occasion can be received from server', async () => {
        const api = new DataBaseAPI(getConnection());
        const server = await api.Server.post(api.Server.create("22", ["2231122", 5, []]));
        const occasion = await api.Occasion.post( api.Occasion.create(server, OccasionState.waiting, false, "111", "222", "333"));
        const nserver = await api.Server.get(server.guild, true);
        expect(nserver?.events.find(event => event.id == occasion.id)).not.toBe(undefined);
    });

    test('server can be received from occasion', async () => {
        const api = new DataBaseAPI(getConnection());
        const server = await api.Server.post(api.Server.create("33", ["2231122", 5, []]));
        const occasion = await api.Occasion.post(api.Occasion.create(server, OccasionState.waiting, false, "111", "222", "333"));
        const result = await api.Occasion.get(occasion.id);
        expect(result?.server.guild).toEqual(server.guild);
    });
});
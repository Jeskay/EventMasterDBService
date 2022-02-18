import { getConnection } from "typeorm";
import { DataBaseAPI } from "../../api";
import connection from "../connection";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () =>{
    await connection.close();
});

describe('', () =>{
    const id1 = "commend111";
    const id2 = "commend222";

    beforeEach(async () => {
        await connection.clear();
    });
    
    test('like another user', async () => {
        const api = new DataBaseAPI(getConnection());
        const subject = api.Player.create(id1);
        const author = api.Player.create(id2);
        await api.Player.post(subject);
        await api.Player.post(author);
        const commend = api.Commend.create(id2, id1, true);
        const posted = await api.Commend.post(commend);
        const results = await api.Commend.search({cheer: true});
        expect(results.find(commend => commend.authorId == author.id && commend.subjectId)).not.toBe(undefined);
        const player2  = await api.Player.get(id2);
        const player1  = await api.Player.get(id1);
        expect(player2?.commendsBy.find(commend => commend.authorId == author.id && commend.subjectId == subject.id)).not.toBe(undefined);
        expect(player1?.commendsAbout.find(commend => commend.authorId == author.id && commend.subjectId == subject.id )).not.toBe(undefined);
    });
});
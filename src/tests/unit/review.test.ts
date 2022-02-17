import { getConnection } from 'typeorm';
import { DataBaseAPI } from '../../api';
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

test('review instances can be created and deleted by title', async () => {
    const api = new DataBaseAPI(getConnection());
    const review = api.Review.create("text of review", "user", 2333, "http://example");
    const posted = await api.Review.post(review);
    const result = await api.Review.get(review.id);
    expect(result).toEqual(posted);
    await api.Review.remove(review);
    expect(await api.Review.get(review.id)).toBe(undefined);
});

test('review can be updated', async () => {
    const api = new DataBaseAPI( getConnection() );
    const review = api.Review.create("text of review", "user", 2333, "http://example");
    const posted = await api.Review.post(review);
    await api.Review.update(posted, {text: "new text", avatar: "new avatar", extraOption: 34});
    const result = await api.Review.get(posted.id);
    expect(result?.text).toBe("new text");
    expect(result?.avatar).toBe("new avatar");
});

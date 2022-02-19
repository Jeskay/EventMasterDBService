import { getConnection } from 'typeorm';
import { isDeepStrictEqual } from 'util';
import { DataBaseAPI } from '../../api';
import { Review } from '../../entities/review';
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
    const player = await api.Player.post(api.Player.create("123321"));
    const review = api.Review.create(player, "text of review", "user", 2333, "http://example");
    const posted = await api.Review.post(review);
    const result = await api.Review.get(posted.id);
    expect(result?.id).toEqual(posted.id);
    await api.Review.remove(review);
    expect(await api.Review.get(review.id)).toBe(undefined);
});

test('review can be updated', async () => {
    const api = new DataBaseAPI( getConnection() );
    const player = await api.Player.post(api.Player.create("123322"));
    const review = api.Review.create(player, "text of review", "user", 2333, "http://example");
    const posted = await api.Review.post(review);
    await api.Review.update(posted, {text: "new text", avatar: "new avatar", extraOption: 34});
    const result = await api.Review.get(posted.id);
    expect(result?.text).toBe("new text");
    expect(result?.avatar).toBe("new avatar");
});

describe('player / review relations', () => {

    beforeEach(async () => {
        await connection.clear();
    });    

    test('review can be received from player instance', async () => {
        const api = new DataBaseAPI( getConnection());
        const player = await api.Player.post(api.Player.create("3213122"));
        const review = await api.Review.post(api.Review.create(player, "new review", "user", 2333, "http://example"));
        const receivedPlayer = await api.Player.get(player.id);
        const recievedReview = await api.Review.get(review.id);
        expect(isDeepStrictEqual(receivedPlayer?.review, recievedReview)).toBeTruthy();
    });

    test('player can\'t be received from review', async () => {
        const api = new DataBaseAPI( getConnection());
        const player = await api.Player.post(api.Player.create("3213123"));
        const review = await api.Review.post(api.Review.create(player, "new review", "user", 2333, "http://example"));
        const nreview = await api.Review.get(review.id);
        expect(nreview?.author).toBe(undefined);
    });
});
describe('filtering reviews', () => {
    
    beforeEach(async () => {
        await connection.clear();
    });    

    test('reviews is sorted be last updated date', async () => {
        const api = new DataBaseAPI( getConnection());
        const reviews: Review[] = [];
        for(let i = 0; i < 10; i++) {
            const player = await api.Player.post(api.Player.create(`PlayerR${i}`));
            const review = await api.Review.post(api.Review.create(player, `review No${i}`, `user${i}`, 1111, "exmaple.png"));
            reviews.push(review);
        }
        const shuffled = Array.from(reviews).sort( () => Math.random() - 0.5);
        await Promise.all(shuffled.map(async elem => await api.Review.update(elem, {discriminator: 2222})))
        
        const results = await api.Review.filtered();
        expect(results.length).toEqual(shuffled.length);
        for(let i = 1; i < results.length;i++){
            expect(results[i - 1].updatedDate.getMilliseconds()).toBeGreaterThanOrEqual(results[i].updatedDate.getMilliseconds());
        }
    });
});

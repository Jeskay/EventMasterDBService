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

test('tag instances can be created and deleted by title', async () => {
    const api = new DataBaseAPI(getConnection());
    const tag = api.Tag.create("title")
    const posted = await api.Tag.post(tag);
    const result = await api.Tag.get(tag.title);
    expect(result).toEqual(posted);
    await api.Tag.remove(tag.title);
    expect(await api.Tag.get(tag.title)).toBe(undefined);
});

test('tag instances can be deleted directly', async () => {
    const api = new DataBaseAPI(getConnection());
    const tag = api.Tag.create("title")
    const posted = await api.Tag.post(tag);
    const result = await api.Tag.get(tag.title);
    expect(result).toEqual(posted);
    await api.Tag.remove(tag);
    expect(await api.Tag.get(tag.title)).toBe(undefined);
});

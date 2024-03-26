import Post, {getUnseenPosts} from './post';

test('getUnseenPosts filters properly', () => {

    const seenPosts = [
        {
            id: 341,
        } as Post,
        {
            id: 4652,
        } as Post,
        {
            id: 234,
        } as Post,
        {
            id: 56,
        } as Post,
    ];

    const availablePosts = [
        {
            id: 43,
        } as Post,
        {
            id: 234,
        } as Post,
        {
            id: 235,
        } as Post,
    ]

    const result = getUnseenPosts(seenPosts, availablePosts);

    expect(result.length).toBe(2);
    expect(result[0].id).toBe(43);
    expect(result[1].id).toBe(235);
})

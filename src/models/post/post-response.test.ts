import PostResponse, {isResponseOfType} from './post-response';

test('isResponseOfType filters properly', () => {

    const responses = [
        {
            id: 123,
            liked: true,
            saved: true,
            clicked: false,
        } as PostResponse,
        {
            id: 234,
            liked: false,
            saved: false,
            clicked: true,
        } as PostResponse,
        {
            id: 345,
            liked: true,
            saved: false,
            clicked: false,
        } as PostResponse,
        {
            id: 456,
            liked: true,
            saved: false,
            clicked: true,
        } as PostResponse,
    ];

    const resultsLikes = responses.filter( response => isResponseOfType(response, 'Likes'))

    expect(resultsLikes.length).toBe(3);
    expect(resultsLikes[0].id).toBe(123);
    expect(resultsLikes[1].id).toBe(345);
    expect(resultsLikes[2].id).toBe(456);


    const resultsSaves = responses.filter( response => isResponseOfType(response, 'Saves'))

    expect(resultsSaves.length).toBe(1);
    expect(resultsSaves[0].id).toBe(123);

    const resultsClicks = responses.filter( response => isResponseOfType(response, 'Clicks'))

    expect(resultsClicks.length).toBe(2);
    expect(resultsClicks[0].id).toBe(234);
    expect(resultsClicks[1].id).toBe(456);

    const resultsViews = responses.filter( response => isResponseOfType(response, 'Views'))

    expect(resultsViews.length).toBe(4);

    const resultsViewed = responses.filter( response => isResponseOfType(response, 'Viewed'))

    expect(resultsViewed.length).toBe(4);
})

test('isResponseOfType rejects all and logs warning when fed incorrect string', () => {

    const responses = [
        {
            id: 123,
            liked: true,
            saved: true,
            clicked: false,
        } as PostResponse,
        {
            id: 234,
            liked: false,
            saved: false,
            clicked: true,
        } as PostResponse,
        {
            id: 345,
            liked: true,
            saved: false,
            clicked: false,
        } as PostResponse,
        {
            id: 456,
            liked: true,
            saved: false,
            clicked: true,
        } as PostResponse,
    ];

    const result = responses.filter( response => isResponseOfType(response, 'Turduckin'))

    expect(result.length).toBe(0);
})

import React, {ReactElement} from 'react';
import PostPage from './Post';
import {Route} from 'react-router';

interface SubRoute {
    routePath: string,
    page: ReactElement,
}
const SubRoutes: SubRoute[] = [
    {
        routePath: '/post/:postId',
        page: <PostPage/>,
    },
]


export const buildSubRoutes = (baseUrl: string): JSX.Element[] => {
    return SubRoutes.map(i =>
        <Route
            key={`${baseUrl}${i.routePath}`}
            path={`${baseUrl}${i.routePath}`}
            exact
            render={() => i.page}
        />
    )
}

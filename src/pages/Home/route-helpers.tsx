import React, { ReactElement } from 'react';
import { Route } from 'react-router-dom';

interface SubRoute {
    routePath: string,
    page: ReactElement,
}

const SubRoutes: SubRoute[] = [
    {
        routePath: '/',
        page: <div>Home</div>,
    },
    // ... other routes ...
];

export const buildSubRoutes = (baseUrl: string): JSX.Element[] => {
    return SubRoutes.map(i =>
        <Route
            key={`${baseUrl}${i.routePath}`}
            path={`${baseUrl}${i.routePath}`}
            render={() => i.page}
        />
    );
};

import React from 'react';
import { render, screen } from '@testing-library/react';
import PostPage from './index';
import { renderWithProviders } from '../../../test-utils';
import { PostContext, PostContextProvider } from '../../../contexts/PostContext';
import { MeContext } from '../../../contexts/MeContext';
import { useParams, useLocation } from 'react-router-dom';
import Post, { postPlaceholder } from '../../../models/post/post';
import { placeholderUser } from '../../../models/user/user';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useLocation: jest.fn()
}));

// Mock the hooks
(useParams as jest.Mock).mockReturnValue({ postId: '123' });
(useLocation as jest.Mock).mockReturnValue({ pathname: '/post/123' });

// Mock PostContextProvider
jest.mock('../../../contexts/PostContext', () => ({
    ...jest.requireActual('../../../contexts/PostContext'),
    PostContextProvider: ({ children }: { children: React.ReactNode }) => children
}));

describe('PostPage', () => {
    const mockPost = postPlaceholder(['news']);
    mockPost.id = 123;
    mockPost.title = 'Test Post';
    mockPost.article_content = 'Test Content';

    const mockMeContext = {
        me: placeholderUser(),
        isLoggedIn: true,
        isLoading: false,
        networkError: false,
        setMe: jest.fn()
    };

    const mockPostContext = {
        hasLoaded: true,
        notFound: false,
        post: mockPost,
        setPost: jest.fn()
    };

    it('renders post details without crashing', () => {
        renderWithProviders(
            <MeContext.Provider value={mockMeContext}>
                <PostContext.Provider value={mockPostContext}>
                    <PostPage />
                </PostContext.Provider>
            </MeContext.Provider>
        );

        expect(screen.getByTestId('post-details-content')).toBeInTheDocument();
    });
});

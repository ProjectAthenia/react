import React, {PropsWithChildren, useEffect, useState} from 'react';
import Post, {postPlaceholder} from '../models/post/post';
import UserPostRequests from '../services/requests/UserPostRequests';
import LoadingScreen from '../components/LoadingScreen';

let cachedPosts = [] as Post[];

/**
 * The structure of the consumer
 */
export interface PostContextConsumerState {
    hasLoaded: boolean,
    notFound: boolean,
    post: Post,
    setPost: (post: Post) => void,
}

let defaultContext: PostContextConsumerState = {
    hasLoaded: false,
    notFound: false,
    post: postPlaceholder(['news']),
    setPost: (post: Post) => {}
};

export const PostContext = React.createContext<PostContextConsumerState>(defaultContext);

export interface PostContextProviderProps {
    postId: number,
    skipCache?: boolean,
}

export const PostContextProvider: React.FC<PropsWithChildren<PostContextProviderProps>> = ({postId, skipCache, children}) => {
    const [postState, setPostState] = useState(defaultContext);

    const setPost = (post: Post): void => {
        cachedPosts[post.id!] = {...post};
        setPostState({
            ...postState,
            post: post,
        })
    }

    useEffect(() => {
        if (!skipCache && cachedPosts[postId]) {
            setPostState({
                hasLoaded: true,
                notFound: false,
                post: cachedPosts[postId],
                setPost: setPost,
            });
        } else {
            setPostState({
                ...postState,
                hasLoaded: false,
            });
            UserPostRequests.getPost(postId).then(post => {
                cachedPosts[postId] = post;
                setPostState({
                    hasLoaded: true,
                    notFound: false,
                    post: post,
                    setPost,
                });
            }).catch(() => {
                setPostState({
                    ...postState,
                    hasLoaded: true,
                    notFound: true,
                });
            })
        }
    }, [postId, window.location.pathname]);

    return (
        <PostContext.Provider value={{...postState, setPost}}>
            <PostContext.Consumer>
                {context => (context.hasLoaded ?
                    (!context.notFound ? children :
                        <div className={'post-not-found'}>
                            <h2>This post has been deleted</h2>
                        </div>
                    ) : <LoadingScreen/>
                )}
            </PostContext.Consumer>
        </PostContext.Provider>
    )
}

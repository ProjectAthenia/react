import React, {useEffect, useState} from 'react'
import './index.scss';
import MeContextProvider, {MeContext, MeContextStateConsumer} from '../../../contexts/MeContext';
import {PostContext, PostContextConsumerState, PostContextProvider} from '../../../contexts/PostContext';
import Post from '../../../models/post/post';
import Location from '../../../models/location/location';
import User from "../../../models/user/user";
import PostResponse from "../../../models/post/post-response";
import {useHistory} from 'react-router-dom';
import {useLocation, useParams} from 'react-router';

interface PostPageContentProps {
	post: Post,
	me: User,
	url: string
	setPost: (post: Post) => void,
	inFocus: boolean,
}

const PostPageContent: React.FC<PostPageContentProps> = ({post, setPost, me, url, inFocus}) => {

	const navigate = useHistory();

	return (
		<section className={'post-details-content-wrapper ion-no-padding'} data-testid="post-details-content">
			{/*TODO Post Output*/}
		</section>
	)
}

interface SeenPostsReadyProps extends PostLoadedProps {
	meContext: MeContextStateConsumer,
}

const SeenPostsReady: React.FC<SeenPostsReadyProps> = ({meContext, postContext, inFocus}) => {

	const location = useLocation()


	const setPost = (post: Post) => {
		postContext.setPost(post);
	}

	return (
		<PostPageContent
			key={postContext.post.id}
			post={postContext.post}
			setPost={setPost}
			me={meContext.me}
			url={location.pathname}
			inFocus={inFocus}
		/>
	)
}

interface PostLoadedProps {
	inFocus: boolean,
	postContext: PostContextConsumerState,
}

const PostLoaded: React.FC<PostLoadedProps> = (props) => {


	return (
		<MeContextProvider>
			<MeContext.Consumer>
				{meContext =>
					<SeenPostsReady
						meContext={meContext}
						{...props}
					/>
				}
			</MeContext.Consumer>
		</MeContextProvider>
	)
}

type RouteParams = {
	postId: string,
}

const PostPage: React.FC = () => {
	const { postId } = useParams<{ postId: string }>();

	return (
		<PostContextProvider postId={parseInt(postId!)}>
			<PostContext.Consumer>
				{(postContext: PostContextConsumerState) => (
					<MeContextProvider>
						<MeContext.Consumer>
							{(meContext: MeContextStateConsumer) => (
								<SeenPostsReady
									postContext={postContext}
									meContext={meContext}
									inFocus={true}
								/>
							)}
						</MeContext.Consumer>
					</MeContextProvider>
				)}
			</PostContext.Consumer>
		</PostContextProvider>
	)
}

export default PostPage

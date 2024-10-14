import React from 'react'
import './index.scss';
import Page from "../../components/Template/Page";
import SignInForm from "../../components/Forms/SignInForm";

const SignIn: React.FC = ({}) => {

    return (
        <Page id={'sign-in-page'}>
            <div>
                <h1>Sign In</h1>
            </div>
            <SignInForm defaultRedirect={'/home'}/>
        </Page>
    );
}

export default SignIn;

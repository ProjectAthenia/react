import React from 'react';
import './index.scss';
import Page from "../../components/Template/Page";
import SignInForm from "../../components/Forms/SignInForm";

const SignIn: React.FC = () => {
    return (
        <Page>
            <section id={'sign-in-page'}>
                <div>
                    <h1>Sign In</h1>
                </div>
                <SignInForm />
            </section>
        </Page>
    );
}

export default SignIn;

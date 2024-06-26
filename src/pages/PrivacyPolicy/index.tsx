import React from 'react';
import PrivacyPolicyText from '../../components/PrivacyPolicyText';
import './index.scss';

const PrivacyPolicy: React.FC = () => {

    return (
        <section className={'privacy-page'}>
            <header>
                Privacy Policy
            </header>
            <PrivacyPolicyText
                contactUsUrl={'/welcome/contact-us'}
            />
        </section>
    );
}

export default PrivacyPolicy;

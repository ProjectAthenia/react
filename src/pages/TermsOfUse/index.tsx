import React from 'react';
import TermsOfUseText from '../../components/TermsOfUseText';
import './index.scss';

const TermsOfUse: React.FC = () => {

    return (
        <section className={'terms-page'}>
            <header>
                Terms of Use
            </header>
            <TermsOfUseText/>
        </section>
    );
}

export default TermsOfUse;

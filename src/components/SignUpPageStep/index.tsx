
import AuthRequests from '../../services/requests/AuthRequests';
import {RequestError} from '../../models/request-error';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import ServerAlert from '../ServerAlert';
import SignUpContextProvider, {
    SignUpContext,
    SignUpContextStateConsumer,
    SignUpData
} from '../../contexts/signin/SignUpContext';
import {ObjectSchema} from 'yup';
import {useFormik} from 'formik';
import './index.scss';
import {useHistory} from 'react-router-dom';

export interface FormInformation {
    setForm: (form: any) => void,
    validationSchema: ObjectSchema<any>,
    onValidate: (submission: any) => string|undefined,
}

export interface SignUpPageStepSharedProps {
    header?: string,
    formInformation?: FormInformation,
    onNextStep?: () => void,
    className?: string,
    bypassSubmit?: boolean,
    inputs?: HTMLInputElement[]
}

export interface SignUpPageStepContentProps extends SignUpPageStepSharedProps {
    form?: any
    signUpContext: SignUpContextStateConsumer,
    onSubmit: (formData: SignUpData) => void,
    disclaimer?: string,
}

const SignUpPageStepContent: React.FC<PropsWithChildren<SignUpPageStepContentProps>> = ({className, onSubmit, form, bypassSubmit, disclaimer, header, signUpContext, children}) => {

    return (
        <div className={className}>
            <div className={"flex-wrapper"}>
                <div className={'content-wrapper'}>
                    {header && <h3>{header}</h3>}
                    {children}
                    {!bypassSubmit &&
                        <div
                            onClick={form ? () => form.handleSubmit() : () => onSubmit(signUpContext.data)}
                            className={form && form.isValid ? 'valid' : ''}
                        >
                            Next
                        </div>
                    }
                </div>
                {disclaimer &&
                    <div className={'sign-up-disclaimer-wrapper'}>

                        <div className={'sign-up-disclaimer'}>
                            <p>{disclaimer}</p>
                        </div>
                        <p className={'age-notice'}>
                            Must be 17 years or older to participate
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}

interface SignUpPageStepContentWithFormProps extends SignUpPageStepContentProps {
    formInformation: FormInformation,
    setValidationError: (error: string) => void,
}

const SignUpPageStepContentWithForm : React.FC<SignUpPageStepContentWithFormProps> = ({onSubmit, formInformation, setValidationError, inputs, signUpContext, ...rest}) => {

    const form: any = useFormik({
        initialValues: signUpContext.data,
        initialErrors: {first_name: signUpContext.data.first_name},
        validationSchema: formInformation.validationSchema,
        onSubmit: onSubmit,
    });

    useEffect(() => {
        if (!form.isValid) {

            const currentError = formInformation.onValidate(form);

            setValidationError(currentError ? currentError : '');
        }
    }, [form.isSubmitting, form.isValid])

    useEffect( () => formInformation.setForm(form), [form.values]);

    const enterPressed = (event: any) => {
        if (event.keyCode === 13 && !form.isSubmitting) {
            form.handleSubmit();
        }
    }

    useEffect(() => {
        if (inputs) {
            inputs.forEach(i => {
                i.removeEventListener('keydown', enterPressed);
                i.addEventListener('keydown', enterPressed)
            })
        }
    }, [inputs])

    return (
        <SignUpPageStepContent
            onSubmit={onSubmit}
            signUpContext={signUpContext}
            form={form}
            {...rest}
        />
    )
}

export interface SignUpPageStepProps extends SignUpPageStepSharedProps {
    cancelOnBack: boolean,
    arrowColor?: string,
    disclaimer?: string,
    showArrow?: boolean,
}

const SignUpPageStep : React.FC<PropsWithChildren<SignUpPageStepProps>> = ({ arrowColor, showArrow, formInformation, onNextStep, cancelOnBack, ...rest}) => {

    const [validationError, setValidationError] = useState('')
    const [requestError, setRequestError] = useState<RequestError|undefined>(undefined);
    const history = useHistory();
    if (arrowColor) {
        document.documentElement.style.setProperty("--arrow-color", arrowColor);
    }
    else {
        document.documentElement.style.setProperty("--arrow-color", "var(--ion-color-light)");
    }

    const onSubmit = (formData: SignUpData, setData: (data: SignUpData) => void) => {
        setData(formData);
        if ( formData.phone && !formData.email ) {
            duplicatePhoneCheck(formData.phone)
        } else if ( formData.email ) {
            duplicateEmailCheck(formData.email).then(() => {
                setValidationError('');
                processSignUp(formData);
            })
        }
    }

    const cancel = () => {
        if (cancelOnBack) {
            window.location.replace('/welcome/splash')
        } else {
            history.goBack();
        }
    }

    const duplicatePhoneCheck = async (phone: string) => {
        try {
            await AuthRequests.signUp({phone: phone} as SignUpData)
        } catch (error: any) {
            if ( error.data.errors.phone ) {
                setValidationError('Phone number is already in use')
            }
            else if ( onNextStep ){
                onNextStep()
            }
        }
    }

    const duplicateEmailCheck = async (email: string) => {
        try {
            await AuthRequests.signUp({email: email} as SignUpData)
        } catch (error: any) {
            if (error.data.errors.email) {
                setValidationError('Email number is already in use')
                return Promise.reject();
            }
            return Promise.resolve();
        }

    }

    const processSignUp = async (signUpData: SignUpData) => {

        try {
            await AuthRequests.signUp(signUpData)
            const redirectUrl = localStorage.getItem('login_redirect');
            localStorage.removeItem('login_redirect');
            if (redirectUrl) {
                history.push(redirectUrl);
            } else {
                history.push('/home')
            }
        } catch (error) {
            setRequestError(error as RequestError)
        }
    }

    return (
        <section className={'sign-up-page'}>
            <header onClick={() => cancel()}>Cancel</header>
            <SignUpContextProvider>
                <SignUpContext.Consumer>
                    {signUpContext => (
                        <React.Fragment>
                            {formInformation ?
                                <SignUpPageStepContentWithForm
                                    formInformation={formInformation}
                                    setValidationError={setValidationError}
                                    signUpContext={signUpContext}
                                    onSubmit={data => onSubmit(data, signUpContext.setData)}
                                    {...rest}
                                /> :
                                <SignUpPageStepContent
                                    signUpContext={signUpContext}
                                    onSubmit={data => onSubmit(data, signUpContext.setData)}
                                    {...rest}
                                />
                            }
                            {requestError &&
                                <ServerAlert
                                    requestError={requestError}
                                    onCloseAlert={() => setRequestError(undefined)}
                                />
                            }
                        </React.Fragment>
                    )}
                </SignUpContext.Consumer>
            </SignUpContextProvider>
        </section>
    )}

export default SignUpPageStep;

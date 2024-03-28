import React, {useEffect, useRef, useState} from 'react'
import * as Yup from 'yup'
import './index.scss'
import {useHistory} from 'react-router-dom';
import SignUpContextProvider, {
    SignUpContext,
    SignUpContextStateConsumer,
    SignUpData
} from "../../contexts/signin/SignUpContext";
import ServerAlert from "../../components/ServerAlert";
import {RequestError} from "../../models/request-error";
import AuthRequests from "../../services/requests/AuthRequests";
import {useFormik} from "formik";


interface SignUpContentProps {
    setValidationError: (error: string) => void,
    signUpContext: SignUpContextStateConsumer,
    onSubmit: (formData: SignUpData) => void,
}

const SignUpContent: React.FC<SignUpContentProps> = ({signUpContext, onSubmit, setValidationError}) => {
    const emailInputRef = useRef<HTMLInputElement>(null)
    const firstNameInputRef = useRef<HTMLInputElement>(null)
    const lastNameInputRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)
    const SignUpSchema = Yup.object().shape({
        first_name: Yup.string().trim().required('First Name is required'),
        last_name: Yup.string().trim().required('Last Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().trim().required('Password is required'),
    })

    const inputs = [
        firstNameInputRef?.current,
        lastNameInputRef?.current,
        emailInputRef?.current,
        passwordInputRef?.current,
    ].filter(i => i)as HTMLInputElement[]

    const validateForm = (submission: any) : string|undefined =>  {
        if (submission.errors.email && submission.touched.email) {
            return submission.errors.email
        }
        else if (submission.errors.first_name && submission.touched.first_name) {
            return submission.errors.first_name;
        }
        else if (submission.errors.last_name && submission.touched.last_name) {
            return submission.errors.last_name;
        }
        else if (submission.errors.password && submission.touched.password) {
            return submission.errors.password;
        }
        return undefined
    }

    const form: any = useFormik({
        initialValues: signUpContext.data,
        initialErrors: {first_name: signUpContext.data.first_name},
        validationSchema: SignUpSchema,
        onSubmit: onSubmit,
    });

    useEffect(() => {
        if (!form.isValid) {

            const currentError = validateForm(form);

            setValidationError(currentError ? currentError : '');
        }
    }, [form.isSubmitting, form.isValid])

    const enterPressed = (event: any) => {
        if (event.keyCode === 13 && !form.isSubmitting) {
            form.handleSubmit();
        }
    }

    useEffect(() => {
        if (inputs) {
            inputs.forEach((i: any) => {
                i.removeEventListener('keydown', enterPressed);
                i.addEventListener('keydown', enterPressed)
            })
        }
    }, [inputs])

    return (
        <div className={"flex-wrapper"}>
            <div className={'content-wrapper'}>
                <div>
                    <label>
                        <input
                            autoCapitalize={'word'}
                            name='first_name'
                            placeholder={'First Name'}
                            type='text'
                            onChange={form.handleChange}
                            ref={firstNameInputRef}
                        />
                    </label>
                    <label>
                        <input
                            autoCapitalize={'word'}
                            name='last_name'
                            placeholder={'Last Name'}
                            type='text'
                            onChange={form.handleChange}
                            ref={lastNameInputRef}
                        />
                    </label>
                </div>
                <label className={'email-box'}>
                    <input
                        name='email'
                        placeholder={'email@example.com'}
                        type='email'
                        onChange={form.handleChange}
                        ref={emailInputRef}
                    />
                </label>
                <label className={'password-box'}>
                    <input
                        name='password'
                        placeholder={'password'}
                        type='email'
                        onChange={form.handleChange}
                        ref={passwordInputRef}
                    />
                </label>
                <div
                    onClick={form ? () => form.handleSubmit() : () => onSubmit(signUpContext.data)}
                    className={form && form.isValid ? 'valid' : ''}
                >
                    Submit
                </div>
            </div>
        </div>
    )
}

const SignUp: React.FC = () => {

    const [validationError, setValidationError] = useState('')
    const [requestError, setRequestError] = useState<RequestError|undefined>(undefined);
    const history = useHistory();

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

    const duplicatePhoneCheck = async (phone: string) => {
        try {
            await AuthRequests.signUp({phone: phone} as SignUpData)
        } catch (error: any) {
            if ( error.data.errors.phone ) {
                setValidationError('Phone number is already in use')
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

    const cancel = () => {
        history.goBack();
    }

    return (
        <section className={'sign-up-page'}>
            <header onClick={() => cancel()}>Cancel</header>
            <SignUpContextProvider>
                <SignUpContext.Consumer>
                    {signUpContext => (
                        <React.Fragment>
                            <SignUpContent
                                setValidationError={setValidationError}
                                signUpContext={signUpContext}
                                onSubmit={(data: any) => onSubmit(data, signUpContext.setData)}
                            />
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
    )
}

export default SignUp;

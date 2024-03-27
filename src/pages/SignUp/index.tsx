import React, {useRef, useState} from 'react'
import * as Yup from 'yup'
import './index.scss'
import SignUpPageStep, {FormInformation} from "../../components/SignUpPageStep";
import {useHistory} from 'react-router-dom';
import PhoneNumberInput from "../../components/PhoneNumberInput";


const SignUp: React.FC = () => {
    const [form, setForm] = useState<any>(undefined);
    const history = useHistory();
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
        return undefined
    }

    const formInformation: FormInformation = {
        onValidate: validateForm,
        validationSchema: SignUpSchema,
        setForm,
    }

    const onNextStep = () => {
        history.push('/welcome/sign-up/date-of-birth');
    }

    return (
        <SignUpPageStep
            cancelOnBack
            header={'Create your account'}
            formInformation={formInformation}
            onNextStep={onNextStep}
            className={'name-phone-signup'}
            disclaimer={'Geddit Local will never share your personal contact information with third parties. It is used exclusively for security and account identification purposes.'}
            inputs={[
                firstNameInputRef?.current,
                lastNameInputRef?.current,
                emailInputRef?.current,
            ].filter(i => i)as HTMLInputElement[]}
        >
            {form &&
                <div>
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
                </div>
            }
        </SignUpPageStep>
    )
}

export default SignUp;

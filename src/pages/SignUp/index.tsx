import React, { useState } from 'react';
import * as Yup from 'yup';
import './index.scss';
import { useFormik } from "formik";
import AuthRequests, { SignUpData } from "../../services/requests/AuthRequests";
import { useHistory } from "react-router-dom";
import { Button, Form, FormControl, FormLabel } from "react-bootstrap";
import Page from "../../components/Template/Page";

const SignUp: React.FC = ({}) => {
    const history = useHistory();
    const [error, setError] = useState<string | null>(null);

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .max(120, 'Email must be less than 120 characters')
            .required('Email is required'),
        first_name: Yup.string()
            .max(120, 'First name must be less than 120 characters')
            .required('First name is required'),
        last_name: Yup.string()
            .max(120, 'Last name must be less than 120 characters'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(256, 'Password must be less than 256 characters')
            .required('Password is required')
    });

    const submit = async (values: SignUpData) => {
        setError(null);
        try {
            const result = await AuthRequests.signUp(values);
            if (result) {
                history.push('/browse');
            } else {
                setError('Unknown Error');
            }
        } catch (error: any) {
            if (error.status && error.status === 409) {
                setError('Email already exists.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
    };

    const form = useFormik({
        initialValues: {
            email: '',
            password: '',
            first_name: '',
            last_name: ''
        },
        validationSchema: SignupSchema,
        onSubmit: submit
    });

    return (
        <Page>
            <section id={'sign-up-page'}>
                <div>
                    <h1>Create Account</h1>
                </div>
                <Form onSubmit={form.handleSubmit} role="form">
                    <Form.Group>
                        <FormLabel htmlFor="first_name">
                            {(form.submitCount > 0 && form.errors.first_name) ? 
                                <p className={'error'}>{form.errors.first_name}</p> : 'First Name'}
                        </FormLabel>
                        <FormControl
                            id="first_name"
                            value={form.values.first_name}
                            onChange={name => form.setFieldValue('first_name', name.currentTarget.value)}
                            type={'text'}
                            isInvalid={form.submitCount > 0 && !!form.errors.first_name}
                        />
                    </Form.Group>

                    <Form.Group>
                        <FormLabel htmlFor="last_name">
                            {(form.submitCount > 0 && form.errors.last_name) ? 
                                <p className={'error'}>{form.errors.last_name}</p> : 'Last Name'}
                        </FormLabel>
                        <FormControl
                            id="last_name"
                            value={form.values.last_name}
                            onChange={name => form.setFieldValue('last_name', name.currentTarget.value)}
                            type={'text'}
                            isInvalid={form.submitCount > 0 && !!form.errors.last_name}
                        />
                    </Form.Group>

                    <Form.Group>
                        <FormLabel htmlFor="email">
                            {(form.submitCount > 0 && form.errors.email) ? 
                                <p className={'error'}>{form.errors.email}</p> : 'Email'}
                        </FormLabel>
                        <FormControl
                            id="email"
                            value={form.values.email}
                            onChange={email => form.setFieldValue('email', email.currentTarget.value)}
                            type={'email'}
                            isInvalid={form.submitCount > 0 && !!form.errors.email}
                        />
                    </Form.Group>

                    <Form.Group>
                        <FormLabel htmlFor="password">
                            {(form.submitCount > 0 && form.errors.password) ? 
                                <p className={'error'}>{form.errors.password}</p> : 'Password'}
                        </FormLabel>
                        <FormControl
                            id="password"
                            value={form.values.password}
                            onChange={password => form.setFieldValue('password', password.currentTarget.value)}
                            type={'password'}
                            isInvalid={form.submitCount > 0 && !!form.errors.password}
                        />
                    </Form.Group>

                    {error && <p className={'error'}>{error}</p>}
                    
                    <Button type={"submit"}>Create Account</Button>
                </Form>
            </section>
        </Page>
    );
};

export default SignUp; 
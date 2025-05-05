import React, {useState} from 'react'
import * as Yup from 'yup';

import './index.scss';
import {useFormik} from "formik";
import AuthRequests, {LoginReq} from "../../services/requests/AuthRequests";
import {useHistory} from "react-router-dom";
import {Button, Form, FormControl, FormLabel} from "react-bootstrap";
import Page from "../../components/Template/Page";

const SignIn: React.FC = ({}) => {
    const history = useHistory();
    const [error, setError] = useState<string|null>(null);

    const SignupSchema = Yup.object().shape({
        email: Yup.string().required('Email required'),
        password: Yup.string().required('Password is required')
    })

    const submit = async (userReq: LoginReq) => {
        setError(null);
        try {
            if (await AuthRequests.signIn(userReq)) {
                const redirectUrl = localStorage.getItem('login_redirect');
                history.push(redirectUrl ?? '/');
            } else {
                setError('Unknown Error')
            }
        } catch (error: any)  {
            if (error.status && error.status == 401) {
                setError('Invalid Login Credentials.');
            }
        }
    }

    const form = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: SignupSchema,
        onSubmit: (values) => submit(values)
    })

    return (
        <Page>
            <section id={'sign-in-page'}>
                <div>
                    <h1>Sign In</h1>
                </div>
                <Form onSubmit={(event) => form.handleSubmit(event)} role="form">
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
                    <Button type={"submit"}>Sign In</Button>
                    {error && <p className={'error'}>{error}</p>}
                </Form>
            </section>
        </Page>
    );
}

export default SignIn;

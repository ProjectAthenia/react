import React, {useState} from 'react'
import * as Yup from 'yup';

import './index.scss';
import {useFormik} from "formik";
import AuthRequests, {LoginReq} from "../../services/requests/AuthRequests";
import {useHistory} from "react-router-dom";
import {Button, Form, FormControl, FormLabel} from "react-bootstrap";

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
        <section id={'sign-in-page'}>
            <div>
            </div>
            <Form onSubmit={(event) => form.handleSubmit(event)}>
                <FormLabel>
                    {(form.submitCount > 0 && form.errors.email) ? <p className={'error'}>{form.errors.email}</p> : 'Email'}

                </FormLabel>
                <FormControl
                    value={form.values.email}
                    onInput={email => form.setFieldValue('email', email.currentTarget.value)}
                    type={'email'}
                />
                <Button type={"submit"}>Submit</Button>
                <p className={'error'}></p>
            </Form>
        </section>
    );
}

export default SignIn;

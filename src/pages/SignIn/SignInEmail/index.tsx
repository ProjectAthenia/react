import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AuthRequests, { LoginReq } from '../../../services/requests/AuthRequests';
import InputWrapper from '../../../components/InputWrapper';
import './index.scss';
import {Link, useHistory} from 'react-router-dom';

interface SignInEmailProps { }

const SignInEmail: React.FC<SignInEmailProps> = ({}) => {
	const [credentialError, setCredentialError] = useState(false);
	const history = useHistory();

	const SignupSchema = Yup.object().shape({
		emailOrPhone: Yup.string().required('Email or Phone is required'),
		password: Yup.string().required('Password is required')
	})

	const form = useFormik({
		initialValues: {
			emailOrPhone: '',
			password: ''
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => submit(values)
	})

	const submit = (values: { emailOrPhone: string; password: string }) => {
		const { emailOrPhone, password } = values
		let userReq: LoginReq = { password }
		const isPhoneNumber = /^\d+$/.test(emailOrPhone)
		if (isPhoneNumber) {
			userReq.phone = emailOrPhone
		} else {
			userReq.email = emailOrPhone
		}

		AuthRequests.signIn(userReq).then(async () => {
			const redirectUrl = localStorage.getItem('login_redirect');
			localStorage.removeItem('login_redirect');

			if (redirectUrl) {
				history.push(redirectUrl);
			}
			else {
				history.push('/')
			}
		}).catch(error => {
			if (error.status && error.status == 401) {
				setCredentialError(true);
			}
		})
	}

	const locationOptions: PositionOptions = {
		maximumAge: 5 * 60 * 60 * 1000,
		enableHighAccuracy: false
	}

	return (
		<section className={'sign-up-page'}>
			<header>Cancel</header>
			<div className={'section'}>
				<h1>Sign In</h1>
				{credentialError &&
					<p className={'error'}>Invalid Email or Password</p>
				}
				<InputWrapper
					label='Email'
					error={form.errors.emailOrPhone && form.touched.emailOrPhone ? form.errors.emailOrPhone : undefined}
					>
					<input
						type='text'
						name='emailOrPhone'
						onChange={form.handleChange}
						value={form.values.emailOrPhone}
						/>
				</InputWrapper>
				<InputWrapper
					label='Password'
					error={form.errors.password && form.touched.password ? form.errors.password : undefined}
					>
					<input
						type='password'
						name='password'
						onChange={form.handleChange}
						value={form.values.password}
						/>
				</InputWrapper>
				<Link to='/forgot-password'>
					forgot password?
				</Link>
				<button onClick={() => form.handleSubmit()}>
					Sign In
				</button>
			</div>
		</section>
	)
}

export default SignInEmail

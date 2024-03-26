import User from '../../models/user/user';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {phoneRegExp} from '../../util/regex';
import {useFormik} from 'formik';
import {useHistory} from 'react-router';
import ContactUsRequests from '../../services/requests/ContactUsRequests';
import BorderedInput from '../GeneralUIElements/BorderedInput';
import PhoneNumberInput from '../PhoneNumberInput';
import './index.scss';

interface ContactUsData {
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    message: string,
}

const initialContactUsData = (user?: User): ContactUsData => ({
    first_name: user ? user.first_name : '',
    last_name: user ? user.last_name : '',
    email: user ? user.email : '',
    phone: user && user.phone ? user.phone : '',
    message: '',
})

interface ContactUsFormProps {
    loggedInUser?: User,
}

const ContactUsForm: React.FC<ContactUsFormProps> = ({loggedInUser}) => {

    const [successAlertShowing, setSuccessAlertShowing] = useState(false);

    const ContactUsSchema = Yup.object().shape({
        first_name: Yup.string().trim().required('First Name is required'),
        last_name: Yup.string().trim().required('Last Name is required'),
        email: Yup.string().when("phone", {
            is: (email: string) => !email || email.length === 0,
            then: Yup.string().email('Invalid Email').required('Email is required'),
            otherwise: Yup.string(),
        } as any),
        phone: Yup.string().when("email", {
            is: (phone: string) => !phone || phone.length === 0,
            then: Yup.string().required('Phone is required').matches(phoneRegExp, 'Invalid Phone'),
            otherwise: Yup.string(),
        } as any),
        message: Yup.string().required('Message is required'),
    }, [['email', 'phone']])

    const form = useFormik({
        initialValues: initialContactUsData(loggedInUser),
        validationSchema: ContactUsSchema,
        onSubmit: (values) => submit(values)
    })

    /**
     * Gets the current error if there is one
     */
    function getCurrentError(): string {
        if (form.errors.first_name && form.touched.first_name) {
            return form.errors.first_name
        } else if (form.errors.last_name && form.touched.last_name) {
            return form.errors.last_name
        } else if (form.errors.email && form.touched.email) {
            return form.errors.email
        } else if (form.errors.phone && form.touched.phone) {
            return form.errors.phone
        } else if (form.errors.message && form.touched.message) {
            return form.errors.message
        }

        return ''
    }

    const history = useHistory();

    const submit = async (contactUsData: ContactUsData) => {
        ContactUsRequests.submitGeneralContact(contactUsData).then(() => setSuccessAlertShowing(true));
    }

    return (
        <div>
            <p className={'error'}>{getCurrentError()}</p>
            <BorderedInput>
                <input
                    autoCapitalize={'word'}
                    name='first_name'
                    placeholder={'First Name'}
                    value={form.values.first_name}
                    type='text'
                    onChange={form.handleChange}
                />
            </BorderedInput>
            <BorderedInput>
                <input
                    autoCapitalize={'word'}
                    name='last_name'
                    placeholder={'Last Name'}
                    value={form.values.last_name}
                    type='text'
                    onChange={form.handleChange}
                />
            </BorderedInput>
            <BorderedInput>
                <input
                    name='email'
                    placeholder={'Email Address'}
                    value={form.values.email}
                    type='email'
                    onChange={form.handleChange}
                />
            </BorderedInput>
            <BorderedInput>
                <PhoneNumberInput
                    name='phone'
                    placeholder='Phone'
                    value={form.values.phone ?? ''}
                    onPhoneNumberChange={phoneNumber => form.setFieldValue('phone', phoneNumber)}
                />
            </BorderedInput>
            <BorderedInput>
                <textarea
                    name={'message'}
                    placeholder={'Your Message'}
                    onChange={form.handleChange}
                    rows={6}
                />
            </BorderedInput>
            <button onClick={() => form.handleSubmit()}>
                Submit
            </button>
            {/*<IonAlert*/}
            {/*    isOpen={successAlertShowing}*/}
            {/*    onDidDismiss={() => history.goBack()}*/}
            {/*    header={'Thanks!'}*/}
            {/*    message={'A Geddit local representative will review your message and be in touch with you shortly.'}*/}
            {/*    buttons={['Okay']}*/}
            {/*/>*/}
        </div>
    )
}

export default ContactUsForm;

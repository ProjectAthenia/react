import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PlatformGroup from '../../../models/platform/platform-group';
import './index.scss';

interface FormData {
    name: string;
}

interface PlatformGroupFormProps {
    initialValues?: FormData;
    onSubmit: (values: FormData) => Promise<void>;
    isSubmitting: boolean;
    submitError: string | null;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

const PlatformGroupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
});

const PlatformGroupForm: React.FC<PlatformGroupFormProps> = ({
    initialValues = { name: '' },
    onSubmit,
    isSubmitting,
    submitError,
    onCancel,
    mode
}) => {
    const form = useFormik({
        initialValues,
        validationSchema: PlatformGroupSchema,
        onSubmit
    });

    return (
        <form className="platform-group-form" onSubmit={form.handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.values.name}
                    onChange={form.handleChange}
                    className={form.touched.name && form.errors.name ? 'error' : ''}
                    disabled={isSubmitting}
                />
                {form.touched.name && form.errors.name && (
                    <span className="error-message">{form.errors.name}</span>
                )}
            </div>

            {submitError && (
                <div className="error-message" style={{ marginBottom: '1rem' }}>
                    {submitError}
                </div>
            )}

            <div className="form-actions">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update' : 'Create')} Platform Group
                </button>
            </div>
        </form>
    );
};

export default PlatformGroupForm; 
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PlatformGroup from '../../../models/platform/platform-group';
import { PlatformGroupsContextProvider, PlatformGroupsContext } from '../../../contexts/GamingComponents/PlatformGroupsContext';
import './index.scss';
import Platform from "../../../models/platform/platform";

interface FormData {
    name: string;
    platform_group_id?: number | null;
}

interface PlatformFormProps {
    platform?: Platform;
    onSubmit: (values: FormData) => Promise<void>;
    isSubmitting: boolean;
    submitError: string | null;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

const PlatformForm: React.FC<PlatformFormProps> = ({
    platform,
    onSubmit,
    isSubmitting,
    submitError,
    onCancel,
    mode
}) => {
    const [values, setValues] = React.useState<FormData>({
        name: platform?.name || '',
        platform_group_id: platform?.platform_group?.id
    });

    // Update form values when platform changes
    React.useEffect(() => {
        setValues({
            name: platform?.name || '',
            platform_group_id: platform?.platform_group_id
        });
    }, [platform?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit({
                name: values.name,
                platform_group_id: values.platform_group_id || null
            });
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : undefined
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="platform-form" role="form">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleInputChange}
                    required
                    className={submitError ? 'error' : ''}
                    disabled={isSubmitting}
                />
                {submitError && (
                    <div className="error-message">
                        {submitError}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="platform_group_id">Platform Group</label>
                    <Form.Select
                        id="platform_group_id"
                        name="platform_group_id"
                        value={values.platform_group_id || ''}
                        onChange={handleSelectChange}
                        disabled={isSubmitting}
                    >
                        <PlatformGroupsContextProvider>
                            <PlatformGroupsContext.Consumer>
                                {platformGroupsContext => (platformGroupsContext.initialLoadComplete &&
                                <>
                                    <option value="">None</option>
                                    {platformGroupsContext.loadedData.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </PlatformGroupsContext.Consumer>
                    </PlatformGroupsContextProvider>
                </Form.Select>
            </div>

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
                    {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default PlatformForm; 
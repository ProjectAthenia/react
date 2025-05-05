import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Page from "../../../components/Template/Page";
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import PlatformGroup from '../../../models/platform/platform-group';
import PlatformGroupForm from '../../../components/Forms/PlatformGroupForm';
import { PlatformGroupsContext, PlatformGroupsContextProvider } from '../../../contexts/GamingComponents/PlatformGroupsContext';
import './index.scss';

interface FormData {
    name: string;
}

const PlatformGroupEditorContent: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [platformGroup, setPlatformGroup] = useState<PlatformGroup | null>(null);
    const context = useContext(PlatformGroupsContext);

    const handleSubmit = async (values: FormData) => {
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            if (id && platformGroup) {
                const updatedGroup = await PlatformManagementRequests.updatePlatformGroup(platformGroup, values);
                // Update the context with the updated group
                if (context) {
                    const index = context.loadedData.findIndex((g: PlatformGroup) => g.id === updatedGroup.id);
                    if (index !== -1) {
                        context.loadedData[index] = updatedGroup;
                    }
                }
            } else {
                const newGroup = await PlatformManagementRequests.createPlatformGroup(values);
                // Add the new group to the context
                if (context) {
                    context.loadedData.push(newGroup);
                }
                // Redirect to the edit page for the new group
                history.push(`/browse/platform-groups/${newGroup.id}/edit`);
            }
        } catch (error) {
            setSubmitError(`Failed to ${id ? 'update' : 'create'} platform group. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const loadPlatformGroup = async () => {
            if (!id) return;

            try {
                const data = await PlatformManagementRequests.getPlatformGroup(parseInt(id));
                setPlatformGroup(data);
            } catch (error) {
                setSubmitError('Failed to load platform group. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPlatformGroup();
    }, [id]);

    if (isLoading) {
        return (
            <div className="platform-group-editor">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="platform-group-editor">
            <h1>{id ? 'Edit' : 'Create'} Platform Group</h1>
            <PlatformGroupForm
                initialValues={platformGroup ? { name: platformGroup.name } : undefined}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onCancel={() => history.push('/browse/platform-groups')}
                mode={id ? 'edit' : 'create'}
            />
        </div>
    );
};

export { PlatformGroupEditorContent };

const PlatformGroupEditor: React.FC = () => {
    return (
        <PlatformGroupsContextProvider>
            <Page>
                <PlatformGroupEditorContent />
            </Page>
        </PlatformGroupsContextProvider>
    );
};

export default PlatformGroupEditor; 
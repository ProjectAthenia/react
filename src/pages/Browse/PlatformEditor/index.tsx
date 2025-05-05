import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PlatformsContext, PlatformsContextState, PlatformsContextProvider } from '../../../contexts/GamingComponents/PlatformsContext';
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import PlatformForm from '../../../components/Forms/PlatformForm';
import Page from '../../../components/Template/Page';
import './index.scss';

interface PlatformEditorContentProps {
    platformsContext: PlatformsContextState;
}

export const PlatformEditorContent: React.FC<PlatformEditorContentProps> = ({
    platformsContext,
}) => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [platform, setPlatform] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        const loadPlatform = async () => {
            if (id) {
                try {
                    const data = await PlatformManagementRequests.getPlatform(parseInt(id));
                    setPlatform(data);
                } catch (err) {
                    setError('Failed to load platform. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        loadPlatform();
    }, [id]);

    const handleSubmit = async (values: any) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (id) {
                const updatedPlatform = await PlatformManagementRequests.updatePlatform(platform, values);
                // Update the platform in the context
                const index = platformsContext.loadedData.findIndex((p: any) => p.id === platform.id);
                if (index !== -1) {
                    platformsContext.loadedData[index] = updatedPlatform;
                }
            } else {
                const newPlatform = await PlatformManagementRequests.createPlatform(values);
                // Add the new platform to the context
                platformsContext.loadedData.push(newPlatform);
                history.push(`/browse/platforms/${newPlatform.id}/edit`);
            }
        } catch (err) {
            setError('Failed to save platform. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Page>
                <div className="loading" data-testid="loading">Loading...</div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="platform-editor">
                <h1>{id ? 'Edit Platform' : 'Create Platform'}</h1>
                <PlatformForm
                    platform={platform}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitError={error}
                    onCancel={() => history.push('/browse/platforms')}
                    mode={id ? 'edit' : 'create'}
                />
            </div>
        </Page>
    );
};

const PlatformEditor: React.FC = () => {
    return (
        <PlatformsContextProvider>
            <PlatformsContext.Consumer>
                {platformsContext => (
                    <PlatformEditorContent
                        platformsContext={platformsContext}
                    />
                )}
            </PlatformsContext.Consumer>
        </PlatformsContextProvider>
    );
};

export default PlatformEditor; 
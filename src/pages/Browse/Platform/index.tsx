import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.scss';
import Page from "../../../components/Template/Page";
import Platform from "../../../models/platform/platform";
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import ReleaseBrowser from "../../../components/Browse/ReleaseBrowser";
import MeContextProvider, { MeContext } from '../../../contexts/MeContext';

interface PlatformContentProps {
    platform: Platform;
}

export const PlatformContent: React.FC<PlatformContentProps> = ({ platform }) => {
    return (
        <div className="platform-page">
            <div className="platform-header">
                <h1>{platform.name}</h1>
                <p className="total-games">{platform.total_games} games.</p>
            </div>

            {platform.platform_group && (
                <div className="platform-group">
                    <h2>Part of {platform.platform_group.name}</h2>
                    <p>{platform.platform_group.total_games} total games across all {platform.platform_group.name} platforms</p>
                </div>
            )}

            <div className="platform-releases">
                <h2>Releases</h2>
                <MeContextProvider optional>
                    <MeContext.Consumer>
                        {({ me, isLoggedIn }) => (
                            <ReleaseBrowser platform={platform} userId={isLoggedIn ? me.id : undefined} />
                        )}
                    </MeContext.Consumer>
                </MeContextProvider>
            </div>
        </div>
    );
};

const PlatformPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlatform = async () => {
            try {
                setLoading(true);
                setError(null);
                const platformId = parseInt(id || '');
                if (isNaN(platformId)) {
                    throw new Error('Invalid platform ID');
                }
                const fetchedPlatform = await PlatformManagementRequests.getPlatform(platformId);
                setPlatform(fetchedPlatform);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load platform');
            } finally {
                setLoading(false);
            }
        };

        fetchPlatform();
    }, [id]);

    if (loading) {
        return (
            <Page>
                <div className="platform-page">
                    <div className="loading">Loading...</div>
                </div>
            </Page>
        );
    }

    if (error || !platform) {
        return (
            <Page>
                <div className="platform-page">
                    <div className="error">{error || 'Platform not found'}</div>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <PlatformContent platform={platform} />
        </Page>
    );
};

export default PlatformPage; 
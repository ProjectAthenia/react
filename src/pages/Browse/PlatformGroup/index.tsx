import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.scss';
import Page from "../../../components/Template/Page";
import { PlatformGroupsContext, PlatformGroupsContextProvider } from "../../../contexts/GamingComponents/PlatformGroupsContext";
import PlatformGroup from "../../../models/platform/platform-group";
import PlatformManagementRequests from '../../../services/requests/PlatformManagementRequests';
import ReleaseBrowser from "../../../components/Browse/ReleaseBrowser";
import MeContextProvider, { MeContext } from '../../../contexts/MeContext';

interface PlatformGroupContentProps {
    group: PlatformGroup;
}

export const PlatformGroupContent: React.FC<PlatformGroupContentProps> = ({ group }) => {
    return (
        <div className="platform-group-page">
            <div className="platform-group-header">
                <h1>{group.name}</h1>
                <p className="total-games">{group.total_games} total games</p>
            </div>

            <div className="platforms-section">
                <h2>Platforms in this group</h2>
                <div className="platforms-grid">
                    {group.platforms?.map(platform => (
                        <Link key={platform.id} to={`/browse/platforms/${platform.id}`} className="platform-card">
                            <div className="card-content">
                                <h3>{platform.name}</h3>
                                <p>{platform.total_games} games</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="platform-group-releases">
                <h2>Releases</h2>
                <MeContextProvider optional>
                    <MeContext.Consumer>
                        {({ me, isLoggedIn }) => (
                            <ReleaseBrowser platformGroup={group} userId={isLoggedIn ? me.id : undefined} />
                        )}
                    </MeContext.Consumer>
                </MeContextProvider>
            </div>
        </div>
    );
};

const PlatformGroupPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<PlatformGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getGroup = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const groupId = parseInt(id || '0', 10);
            if (isNaN(groupId)) {
                setError('Invalid group ID');
                return;
            }
            const fetchedGroup = await PlatformManagementRequests.getPlatformGroup(groupId);
            setGroup(fetchedGroup);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || 'Failed to load platform group';
            setError(errorMessage);
            console.error('Error loading platform group:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getGroup();
    }, [id]);

    if (isLoading) {
        return (
            <Page>
                <div className="platform-group-page">
                    <div className="loading">Loading platform group...</div>
                </div>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <div className="platform-group-page">
                    <div className="error">{error}</div>
                </div>
            </Page>
        );
    }

    if (!group) {
        return (
            <Page>
                <div className="platform-group-page">
                    <div className="error">Platform group not found</div>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <PlatformGroupContent group={group} />
        </Page>
    );
};

export default PlatformGroupPage; 
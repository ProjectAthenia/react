import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';
import { PlatformGroupsContextState } from "../../../../contexts/GamingComponents/PlatformGroupsContext";
import { createColumnHelper } from '@tanstack/react-table';
import { Text, Center, Loader, ActionIcon, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { sortPlatforms } from "../../../../util/gaming-utils";
import Platform from '../../../../models/platform/platform';
import PlatformGroup from '../../../../models/platform/platform-group';
import PlatformManagementRequests from '../../../../services/requests/PlatformManagementRequests';
import { PlatformsContextState } from "../../../../contexts/GamingComponents/PlatformsContext";
import DataList from '../../../GeneralUIElements/DataList';

interface PlatformsListProps {
    platformsContextState: PlatformsContextState;
    platformGroupsContextState: PlatformGroupsContextState;
}

type PlatformItem = Platform | PlatformGroup;

const columnHelper = createColumnHelper<PlatformItem>();

const PlatformsList: React.FC<PlatformsListProps> = ({ platformsContextState, platformGroupsContextState }) => {
    const history = useHistory();

    const handleDelete = async (item: PlatformItem) => {
        const isPlatformGroup = 'platforms' in item;
        const confirmMessage = isPlatformGroup 
            ? 'Are you sure you want to delete this platform group?' 
            : 'Are you sure you want to delete this platform?';

        if (window.confirm(confirmMessage)) {
            try {
                if (isPlatformGroup) {
                    await PlatformManagementRequests.deletePlatformGroup(item);
                    platformGroupsContextState.removeModel(item);
                } else {
                    await PlatformManagementRequests.deletePlatform(item);
                    platformsContextState.removeModel(item);
                }
            } catch (error) {
                alert(`Failed to delete ${isPlatformGroup ? 'platform group' : 'platform'}. Please try again.`);
            }
        }
    };

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
            filterFn: 'includesString',
            sortingFn: 'alphanumeric',
        }),
        columnHelper.accessor('total_games', {
            header: 'Total Games',
            cell: info => info.getValue(),
            filterFn: 'includesString',
            sortingFn: 'alphanumeric',
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const item = row.original;
                const isPlatformGroup = 'platforms' in item;
                return (
                    <Group gap="xs" onClick={(e) => e.stopPropagation()} >
                        <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                                history.push(`/browse/${isPlatformGroup ? 'platform-groups' : 'platforms'}/${item.id}/edit`);
                            }}
                            title="Edit"
                        >
                            <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                handleDelete(item);
                            }}
                            title="Delete"
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                );
            },
        }),
    ];

    const handleRowClick = (item: PlatformItem) => {
        const isPlatformGroup = 'platforms' in item;
        history.push(`/browse/platform${isPlatformGroup ? '-group' : ''}s/${item.id}`);
    };

    if (!platformsContextState.initialLoadComplete && platformsContextState.refreshing) {
        return (
            <Center py="xl">
                <Loader size="sm" color="blue" data-testid="loading-indicator" />
            </Center>
        );
    }

    if (platformsContextState.initialLoadComplete && platformsContextState.loadedData.length === 0) {
        return (
            <Center py="xl">
                <Text size="sm" c="dimmed">No platforms found</Text>
            </Center>
        );
    }
    
    const sortedData = sortPlatforms(platformsContextState.loadedData);

    return (
        <DataList
            context={platformsContextState}
            columns={columns}
            onRowClick={handleRowClick}
            onArrangeData={sortPlatforms}
            rowIdField="id"
        />
    );
};

export default PlatformsList;




import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';
import { PlatformGroupsContextState } from '../../../../contexts/GamingComponents/PlatformGroupsContext';
import { createColumnHelper } from '@tanstack/react-table';
import { Text, Center, Loader, ActionIcon, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import PlatformGroup from '../../../../models/platform/platform-group';
import Platform from '../../../../models/platform/platform';
import PlatformManagementRequests from '../../../../services/requests/PlatformManagementRequests';
import DataList from '../../../GeneralUIElements/DataList';

interface Props {
    contextState: PlatformGroupsContextState;
}

const columnHelper = createColumnHelper<PlatformGroup>();

const PlatformGroupsList: React.FC<Props> = ({ contextState }) => {
    const history = useHistory();

    const handleDelete = async (item: PlatformGroup) => {
        if (window.confirm('Are you sure you want to delete this platform group?')) {
            try {
                await PlatformManagementRequests.deletePlatformGroup(item);
                contextState.removeModel(item);
            } catch (error) {
                alert('Failed to delete platform group. Please try again.');
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
        columnHelper.accessor('platforms', {
            header: 'Platforms',
            cell: info => info.getValue()?.map((p: Platform) => p.name).join(', ') || '',
            filterFn: 'includesString',
            sortingFn: 'alphanumeric',
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <Group gap="xs" onClick={(e) => e.stopPropagation()}>
                        <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                                history.push(`/browse/platform-groups/${item.id}/edit`);
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

    const handleRowClick = (item: PlatformGroup) => {
        history.push(`/browse/platform-groups/${item.id}`);
    };

    if (!contextState.initialLoadComplete && contextState.refreshing) {
        return (
            <Center py="xl">
                <Loader data-testid="loading-spinner" size="sm" color="blue" />
            </Center>
        );
    }

    if (contextState.initialLoadComplete && contextState.loadedData.length === 0) {
        return (
            <Center py="xl">
                <Text size="sm" c="dimmed">No platform groups found</Text>
            </Center>
        );
    }

    return (
        <DataList
            context={contextState}
            columns={columns}
            onRowClick={handleRowClick}
            rowIdField="id"
        />
    );
};

export default PlatformGroupsList; 
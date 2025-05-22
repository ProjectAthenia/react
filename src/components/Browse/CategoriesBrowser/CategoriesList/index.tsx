import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';
import { CategoriesContextState } from '../../../../contexts/CategoriesContext';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Category from '../../../../models/category';
import CategoryRequests from '../../../../services/requests/CategoryRequests';
import DataList from '../../../GeneralUIElements/DataList';

interface Props {
    contextState: CategoriesContextState;
}

const columnHelper = createColumnHelper<Category>();

const CategoriesList: React.FC<Props> = ({ contextState }) => {
    const history = useHistory();

    const handleDelete = async (item: Category) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await CategoryRequests.deleteCategory(item.id!);
                contextState.removeModel(item);
            } catch (error) {
                alert('Failed to delete category. Please try again.');
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
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() || '',
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
                                history.push(`/browse/categories/${item.id}/edit`);
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

    const handleRowClick = (item: Category) => {
        history.push(`/browse/categories/${item.id}`);
    };

    return (
        <DataList
            context={contextState}
            columns={columns}
            onRowClick={handleRowClick}
            rowIdField="id"
        />
    );
};

export default CategoriesList; 
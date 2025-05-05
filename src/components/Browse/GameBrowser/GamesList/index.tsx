import React from 'react';
import './index.scss';
import { GamesContextState } from '../../../../contexts/GamingComponents/GamesContext';
import { createColumnHelper } from '@tanstack/react-table';
import { useHistory } from 'react-router-dom';
import DataList from '../../../GeneralUIElements/DataList';
import Game from '../../../../models/game/game';

interface GamesListProps {
    context: GamesContextState
}

const columnHelper = createColumnHelper<Game>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Game',
        cell: info => info.getValue(),
        filterFn: 'includesString',
        sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('releases', {
        header: 'Release Date',
        cell: info => {
            const releases = info.getValue();
            if (!releases || releases.length === 0) return '';
            const earliestRelease = releases.reduce((earliest, current) => {
                if (!current.release_date) return earliest;
                if (!earliest) return current;
                const currentDate = new Date(current.release_date);
                const earliestDate = new Date(earliest.release_date!);
                return currentDate < earliestDate ? current : earliest;
            });
            return earliestRelease?.release_date ? new Date(earliestRelease.release_date).toLocaleDateString() : '';
        },
        filterFn: 'includesString',
        sortingFn: 'datetime',
        meta: {
            filterType: 'year',
        },
    }),
    columnHelper.accessor('critic_rating', {
        header: 'Critic Score',
        cell: info => {
            const value = info.getValue();
            return value ? value.toFixed(1) : '';
        },
        filterFn: 'includesString',
        sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('user_rating', {
        header: 'User Score',
        cell: info => {
            const value = info.getValue();
            return value ? value.toFixed(1) : '';
        },
        filterFn: 'includesString',
        sortingFn: 'alphanumeric',
    }),
];

const GamesList: React.FC<GamesListProps> = ({ context }) => {
    const history = useHistory();

    const handleRowClick = (row: Game) => {
        history.push(`/browse/games/${row.id}`);
    };

    return (
        <DataList
            context={context}
            columns={columns}
            onRowClick={handleRowClick}
            rowIdField="id"
            dataTestId="games-list"
        />
    );
};

export default GamesList; 
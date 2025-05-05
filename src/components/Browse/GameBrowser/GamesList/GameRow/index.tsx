import React from 'react';
import { Table } from '@mantine/core';
import Game from '../../../../../models/game/game';

interface GameRowProps {
    game: Game;
}

const GameRow: React.FC<GameRowProps> = ({ game }) => {
    const release = game.releases?.[0];
    return (
        <Table.Tr>
            <Table.Td>{game.name}</Table.Td>
            <Table.Td>{release?.platform?.name}</Table.Td>
            <Table.Td>{release?.release_date ? new Date(release.release_date).toLocaleDateString() : 'Unknown'}</Table.Td>
            <Table.Td>{game.critic_rating || game.user_rating || 'N/A'}</Table.Td>
        </Table.Tr>
    );
};

export default GameRow; 
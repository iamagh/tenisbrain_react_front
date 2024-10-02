

export interface Player {
    id: string;
    first_name: string;
    last_name: string;
}

export interface EventPlayersProps {
    maxPlayerCount: number;
    currentPlayers: Player[];
    memberPlayers: Player[];
    onChangeMembers: any;
}






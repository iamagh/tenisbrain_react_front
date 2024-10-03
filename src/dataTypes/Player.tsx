

export interface _Player {
    id: string;
    first_name: string;
    last_name: string;
}

export interface _EventPlayersProps {
    maxPlayerCount: number;
    currentPlayers: _Player[];
    memberPlayers: _Player[];
    onChangeMembers: any;
}

export interface _Coach {
    id: number;
    first_name: string;
    last_name: string;
    gender?: string;
    club_name?: string;
    club_address?: string;
    qualification?: string;
    profile_image?: string;
    email?: string;
    phone_no?: string;
    bio?: string;
}






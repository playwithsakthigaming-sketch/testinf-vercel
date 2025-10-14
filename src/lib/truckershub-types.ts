
export type VtcStats = {
    id: number;
    name: string;
    logo: string;
    live_drivers: number;
    total_drivers: number;
    total_distance: number;
    total_jobs: number;
    total_fuel: number;
};

export type LeaderboardUser = {
    username: string;
    value: number;
};

export type Job = {
    id: number;
    driver: {
        id: number;
        username: string;
        avatar: string;
    };
    start_city: string;
    start_company: string;
    destination_city: string;
    destination_company: string;
    cargo: string;
    cargo_mass: number;
    distance: number;
    fuel_used: number;
    money_made: number;
    status: 'finished' | 'ongoing' | 'cancelled';
    xp: number;
    max_speed: number;
    average_speed: number;
    damage: number;
};

export type Driver = {
    id: number;
    username: string;
    role: {
        id: number;
        name: string;
    };
    avatar: string;
    total_km: number;
    total_jobs: number;
};

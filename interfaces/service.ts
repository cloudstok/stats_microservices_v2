export interface IServiceArgs {
    category: string;
    app: string;
    user_id: string;
    operator_id: string;
    path: string
}

export interface IBetHistoryArgs extends IServiceArgs {
    limit: number;
}

export interface IBetDetailArgs extends IServiceArgs {
    lobby_id: string;
}
export interface IServiceArgs {
    category: string;
    app: string;
    user_id: string;
    operator_id: string;
    path: string
    limit?: number;
    lobby_id?: string;
    freq?: string;
    unit?: string;
}

export interface IFetchDataArgs {
    user_id: string;
    operator_id: string;
    lobby_id?: string;
    limit?: number;
}
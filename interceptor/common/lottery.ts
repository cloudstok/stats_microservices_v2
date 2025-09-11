import { ARespMapper } from "../abstractMapper";

export class LotteryMapper extends ARespMapper {
    colorMap: { [key: number]: string } = {
        0: 'rd-vl',
        1: 'gr',
        2: 'rd',
        3: 'gr',
        4: 'rd',
        5: 'gr-vl',
        6: 'rd',
        7: 'gr',
        8: 'rd',
        9: 'gr'
    };

    numChips = {
        13: [5, 6, 7, 8, 9],
        14: [0, 1, 2, 3, 4]
    }
    constructor() {
        super();
    };

    formatter(path: string, resp: any[]) {
        let formattedResp
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            case "lobby-details": formattedResp = this.lobbyDetails(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    };

    getDetailsFromWinningNumber(num: number) {
        const resultData: { [key: string]: string | number } = {
            color: this.colorMap[num],
            winningNumber: num,
        };
        resultData['category'] = this.numChips['13'].includes(num) ? 'BIG' : 'SMALL'
        switch (resultData['color']) {
            case 'gr':
                resultData['color'] = 'Green'
                break;
            case 'rd':
                resultData['color'] = 'Red'
                break;
            case 'rd-vl':
                resultData['color'] = 'Red-Violet'
                break;
            case 'gr-vl':
                resultData['color'] = 'Green-Violet'
                break;
            default:
                resultData['color'] = ''
        };
        return resultData;
    };

    getChipValueFromChip(chip: string) {
        if (Object.keys(this.colorMap).includes(`${chip}`)) return `${chip}`;
        if (chip == '13') return 'BIG';
        if (chip == '14') return 'SMALL';
        if (chip == '10') return 'GREEN';
        if (chip == '11') return 'VIOLET';
        if (chip == '12') return 'RED';
    };

    lobbyDetails(resp: any[]) {
        if (resp.length < 0) return [];
        const result = resp.map(round => {
            const roundObj = {
                lobby_id: round.lobby_id,
                result: this.getDetailsFromWinningNumber(round.result)
            };
            return roundObj;
        });
        return result;
    }

    history(resp: any[]) {
        if (resp.length <= 0) return []
        const result: any[] = [];
        for (const row of resp) {
            try {
                const finalObj = {
                    result: this.getDetailsFromWinningNumber(row.winning_number),
                    status: row.win_amount > 0 ? 'WIN' : 'LOSS',
                    bet_amount: row.bet_amount,
                    chip: this.getChipValueFromChip(row.chip),
                    multiplier: row.max_mult,
                    room_id: row.room_id,
                    lobby_id: row.lobby_id,
                    time: row.created_at,
                    win_amount: row.win_amount
                };
                result.push(finalObj);
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        }
        return result;
    };

    details(resp: any) {
        if (!resp || !Array.isArray(resp) || resp.length == 0) return {};
        const finalData: any = {};
        resp.map((e, index) => {
            const finalObj = {
                ...this.getDetailsFromWinningNumber(e.winning_number),
                status: e.win_amount > 0 ? 'WIN' : 'LOSS',
                bet_amount: e.bet_amount,
                chip: this.getChipValueFromChip(e.chip),
                multiplier: e.max_mult,
                room_id: e.room_id,
                lobby_id: e.lobby_id,
                created_at: e.created_at,
                win_amount: e.win_amount
            };
            finalData[`bet_${index + 1}`] = finalObj;
        });
        return finalData;
    }
}
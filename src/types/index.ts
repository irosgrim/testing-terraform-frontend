export type Hero = {
  id: number;
  name: string;
  year: number;
  sold: number;
}

export type ShoppingListItem = {
  id: number;
  title: string;
  done: boolean;
}

export type Options = {
    text: string | number;
    votes?: number;
}

export type Questions = {
    description: string;
    options: Options[];
}

export enum WS_MESSAGE_TYPE {
    CREATE = "create",
    JOIN = "join",
    LEAVE = "leave",
    MESSAGE = "message",
    VOTE = "vote",
    NEW_VOTE = "new-vote",
    SHOW_RESULTS = "show-results",
    RESULTS = "results",
    ERROR = "error",
    CLIENTS = "clients",
    SERVER_CLOSED = "server-closed",
    NEW_QUESTION = "new-question",
    SET_NEW_QUESTION = "set-new-question",
    INCORRECT_API_KEY = "incorrect-api-key",
}

export type Result = {
    text: string;
    votes: string[];
}

export type WSMessage = {
    type: WS_MESSAGE_TYPE;
    params: {
        roomId: string;
        username: string | number | null;
        message: string | number | null;
        data?: {
            description: string;
            options: Options[];
        }
    }
}

export type ClientList = {
    type: "clients";
    params: {
        clients: string[];
    }
}


export type VoteMessage = {
    type: "vote";
    params: {
        choice: number;
    }
}
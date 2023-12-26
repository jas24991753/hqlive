export type ButtonStatus = { enabled: boolean, visible: boolean, interactive: boolean };

// state : button : status
export type ButtonStateTable = { [key: string]: { [key: string]: ButtonStatus } };
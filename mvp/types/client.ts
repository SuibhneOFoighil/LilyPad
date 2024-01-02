export interface Item {
    id: string;
    title: string;
    subtitle: string;
}

export interface SelectedItemsLookup {
    [key: string]: boolean;
}

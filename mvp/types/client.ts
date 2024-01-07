export interface Item {
    id: number; // assign a unique id
    fileName: string; // from file
    numberPages: number; // from file
    author: string; // from source directory
    sourceUrl: string; // from source directory
    courseName: string; // from source directory
    contentName: string; // generated from file
    contentSummary: string; // generated from file
    contentSections: JSON // generated from file
    contentBody: string; // generated from file
}

export interface SelectedItemsLookup {
    [key: string]: boolean;
}

export interface CitedItem extends Item {
    citationNumber: number,
    documentContent: string,
    pageNumber: number
}

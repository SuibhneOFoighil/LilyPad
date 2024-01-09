interface ContentSection {
    title: string,
    summary: string,
}

export interface Item {
    id: number; // assign a unique id
    file_name: string; // from file
    number_pages: number; // from file
    author: string; // from source directory
    source_url: string; // from source directory
    course_name: string; // from source directory
    content_name: string; // generated from file
    content_summary: string; // generated from file
    content_sections: ContentSection[] // generated from file
    content_body: string; // generated from file
}

export interface SelectedItemsLookup {
    [key: string]: boolean;
}

export interface CitedItem extends Item {
    citation_number: number,
    document_content: string,
    page_number: number
}

export interface ItemCitation {
    item_id: number,
    citation_number: number,
    page_number: number
}

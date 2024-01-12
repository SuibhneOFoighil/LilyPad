interface ContentSection {
    title: string,
    summary: string,
}

export interface Item {
    discriminator: "item";
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

export interface Course {
    discriminator: "course";
    id: number;
    name: string;
    description: string;
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

export enum DatabaseLayoutType {
    Grid,
    List,
}

export enum DatabaseDataType {
    Files = "files",
    Courses = "courses",
}

export class SelectedItemsLookup {
    private lookup: Set<number>;
    
    constructor(items: Item[], courses: Course[]) {
        this.lookup = new Set<number>();
        // add disriminators
        items.forEach((item) => item.discriminator = "item");
        courses.forEach((course) => course.discriminator = "course");
        this.add(items);
        this.add(courses);
    }

    private add_item(item: Item) {
        this.lookup.add(item.id);
    }

    private add_course(course: Course) {
        this.lookup.add(course.id);
    }

    private delete_item(item: Item) {
        this.lookup.delete(item.id);
    }

    private delete_course(course: Course) {
        this.lookup.delete(course.id);
    }

    private add_single(input: Item | Course) {
        switch (input.discriminator) {
            case "item":
                //console.log("adding item");
                this.add_item(input);
                break;
            case "course":
                //console.log("adding course");
                this.add_course(input);
                break;
            default:
                //console.log("unknown type");
                break;
        }
    }

    public add(input: Item | Course | Item[] | Course[]) {
        //console.log(input);
        //console.log(this.lookup)
        if (Array.isArray(input)) {
            input.forEach((item) => this.add_single(item));
        }
        else {
            this.add_single(input);
        }
        //console.log(this.lookup)
    }

    private delete_single(item: Item | Course) {
        switch (item.discriminator) {
            case "item":
                this.delete_item(item);
                break;
            case "course":
                this.delete_course(item);
                break;
        }
    }

    public delete(input: Item | Course | Item[] | Course[]) {
        if (Array.isArray(input)) {
            input.forEach((item) => this.delete_single(item));
        }
        else {
            this.delete_single(input);
        }
    }

    public toggle(item: Item | Course) {
        if (this.isSelected(item)) {
            this.delete(item);
        }
        else {
            this.add(item);
        }
    }

    public isSelected(item: Item | Course): boolean {
        switch (item.discriminator) {
            case "item":
                return item.id in this.lookup;
            case "course":
                return item.id in this.lookup;
        }
    }

    public getItemIds(): number[] {
        return Array.from(this.lookup);
    }

    public toJson(): string {
        return JSON.stringify(this.getItemIds());
    }
}
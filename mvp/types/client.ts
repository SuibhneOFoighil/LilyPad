export interface Item {
    name: string;
    description: string;
}

interface ContentSection {
    title: string,
    summary: string,
}

export interface File extends Item {
    discriminator: DatabaseDataType.Files;
    id: number; // assign a unique id
    course_id: number; // from source directory
    file_name: string; // from file
    number_pages: number; // from file
    author: string; // from source directory
    source_url: string; // from source directory
    sections: ContentSection[] // generated from file
    similar_file_ids: number[] // generated from file;
}

export interface Course extends Item {
    discriminator: DatabaseDataType.Courses;
    id: number;
}

export interface FileCitation {
    file_id: number,
    number: number,
    page_number: number
    doc_content: string
}

export interface CitedFile extends File {
    citation: FileCitation;
}

export enum DatabaseLayoutType {
    Grid,
    List,
}

export enum DatabaseDataType {
    Files = "files",
    Courses = "courses",
}


export class ItemsDatabase {
    private files: File[];
    private courses: Course[];
    private uniqueFileIds: Set<number>;
    private uniqueCourseIds: Set<number>;
    private selectedCourseIds: Set<number>;
    private selectedFileIds: Set<number>;

    constructor(files: File[], courses: Course[]) {
        // add discriminator to each item
        files.forEach((file) => file.discriminator = DatabaseDataType.Files);
        courses.forEach((course) => course.discriminator = DatabaseDataType.Courses);
        this.files = files;
        this.courses = courses;
        this.uniqueFileIds = new Set<number>(files.map((file) => file.id));
        this.uniqueCourseIds = new Set<number>(courses.map((course) => course.id));        
        this.selectedCourseIds = new Set<number>();
        this.selectedFileIds = new Set<number>();
    }

    public get(type: string, ids: number[] | null = null): Item[] {
        switch (type) {
            case DatabaseDataType.Files:
                return this.getFiles(ids);
            case DatabaseDataType.Courses:
                return this.getCourses(ids);
            default:
                return [];
        }
    }

    // adds new items to database but don't add items that already exist
    public update(type: string, items: Item[]) {
        switch (type) {
            case DatabaseDataType.Files:
                this.updateFiles(items as File[]);
                break;
            case DatabaseDataType.Courses:
                this.updateCourses(items as Course[]);
                break;
        }
    }

    private updateFiles(files: File[]) {
        files.forEach((file) => {
            if (!this.uniqueFileIds.has(file.id)) {
                this.files.push(file);
                this.uniqueFileIds.add(file.id);
            }
        });
    }

    private updateCourses(courses: Course[]) {
        courses.forEach((course) => {
            if (!this.uniqueCourseIds.has(course.id)) {
                this.courses.push(course);
                this.uniqueCourseIds.add(course.id);
            }
        });
    }

    // get all or subset of files
    private getFiles(ids: number[] | null): File[] {
        if (ids && ids.length > 0) {
            return this.files.filter((file) => ids.includes(file.id));
        }
        else {
            return this.files;
        }
    }
    // get all or subset of courses
    private getCourses(ids: number[] | null): Course[] {
        if (ids && ids.length > 0) {
            return this.courses.filter((course) => ids.includes(course.id));
        }
        else {
            return this.courses;
        }
    }
    // get all selected file ids as array
    public getSelectedFileIds(): number[] {
        return Array.from(this.selectedFileIds);
    }

    // get all selected course ids as array
    public getSelectedCourseIds(): number[] {
        return Array.from(this.selectedCourseIds);
    }

    // get file by id
    public getFileById(id: number): File | undefined {
        return this.files.find((file) => file.id === id);
    }
    // get course by id
    public getCourseById(id: number): Course | undefined {
        return this.courses.find((course) => course.id === id);
    }

    // toggle course / file selection
    private toggleCourse(course: Course) {
        if (this.selectedCourseIds.has(course.id)) {
            this.selectedCourseIds.delete(course.id);
        }
        else {
            this.selectedCourseIds.add(course.id);
        }
    }
    private toggleFile(file: File) {
        if (this.selectedFileIds.has(file.id)) {
            this.selectedFileIds.delete(file.id);
        }
        else {
            this.selectedFileIds.add(file.id);
        }
    }
    public toggle(item: Course | File) {
        switch (item.discriminator) {
            case DatabaseDataType.Courses:
                this.toggleCourse(item as Course);
                break;
            case DatabaseDataType.Files:
                this.toggleFile(item as File);
                break;
        }
    }
    public isSelected(item: Course | File): boolean {
        switch (item.discriminator) {
            case DatabaseDataType.Courses:
                return this.selectedCourseIds.has(item.id);
            case DatabaseDataType.Files:
                return this.selectedFileIds.has(item.id);
            default:
                return false;
        }
    }
    public similar_items(source: File | Course | null): File[] | Course[] {
        switch (source?.discriminator) {
            case DatabaseDataType.Courses:
                return this.similar_courses(source as Course);
            case DatabaseDataType.Files:
                return this.similar_files(source as File);
            default:
                return [];
        }
    }
    private similar_courses(source: Course): Course[] {
        // TODO: implement
        return [];
    }
    private similar_files(source: File): File[] {
        const similar_file_ids: number[]  = source.similar_file_ids;
        const similar_files = this.getFiles(similar_file_ids);
        return similar_files;
    }
}
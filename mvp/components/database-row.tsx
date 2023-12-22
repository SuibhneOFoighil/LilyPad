import { DatabaseItem } from "./database-item";

export default function DatabaseRow() {
    //each row has two columns with a 1:1 ratio
    //both columns are flex columns
    //each column is a database item
    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-1/2">
                <DatabaseItem />
            </div>
            <div className="flex flex-col w-1/2">
                <DatabaseItem />
            </div>
        </div>
    )
}
import { DatabaseSearchBar } from './database-search-bar'
import { SelectedDataToggle } from './selected-data-toggle'

export default function DatabaseHeader() {
    return (
            //database header is a search bar and a toggle
            //it fills the width of the database view
            //the search bar and toggle are in a flex row
            //the search bar is on the left
            //the toggle is on the right
            //the search bar is 3/4 the width of the row
            //the toggle is 1/4 the width of the row
            
            <div className="flex flex-row">
                <div className="flex flex-col w-3/4">
                    <DatabaseSearchBar />
                </div>
                <div className="flex flex-col w-1/4">
                    <SelectedDataToggle />
                </div>
            </div>
    )
}
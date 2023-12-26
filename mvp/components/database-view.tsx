import { Database } from "@/types";
import DatabaseItem from "./DatabaseItem";
import { database } from "@/test/database";
import { SearchIcon } from "@/public/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ViewToggle from "./DatabaseToggle";

export default function DatabaseView() {
    return (
        // background container
        <div className="bg-container p-4">

            {/* header */}
            <div>
                <span className="flex">
                    <form className="flex">
                        <div key="1" className="flex rounded-lg bg-white p-4 mx-4 shadow hover:bg-gray-100 outline outline-1 outline-gray-200">
                            <SearchIcon className="text-gray-400 w-5 h-5" />
                            <input
                                aria-label="Search"
                                className="ml-3 w-full border-none bg-transparent outline-none placeholder-gray-400"
                                placeholder="Search"
                                type="search"
                            />
                        </div>
                    </form>
                    <ViewToggle />
                    <Tooltip title="Add all" className="mx-2">
                        <IconButton>
                            <FontAwesomeIcon icon={faPlusCircle} className='text-gray-500 hover:text-gray-800' />
                        </IconButton>
                    </Tooltip>
                </span>
            </div>
                
            {/* database body */}
            <div className="mt-5 border-t-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">  
                    {database.map((d: Database, index) => (<DatabaseItem key={index} title={d.title} course={d.course} id={d.id} />))}
                </div>
            </div>
        </div>
    )
}
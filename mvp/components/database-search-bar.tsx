var dummies:any[] = []

// for (let i = 0; i < 10; i++) {
//   dummies.push({
//     id: i,
//     title: "Search Result " + i,
//     description: "Description..."
//   })
// }


export function DatabaseSearchBar() {
  return (
    <div className="relative w-full max-w-xl">
      <div key="1" className="flex items-center w-full max-w-xl rounded-lg bg-white p-4 shadow">
        <SearchIcon className="text-gray-400 w-5 h-5" />
        <input
          aria-label="Search"
          className="ml-3 w-full border-none bg-transparent outline-none placeholder-gray-400"
          placeholder="Search"
          type="search"
        />
      </div>
      <SearchResults results={dummies} />
    </div>
  )
}


function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function SearchResult({title, description} : {title: string, description: string}) {
  return (
    <div className="p-3 border-b border-gray-200">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
  </div>
  )
}

function SearchResults({results} : {results: any[]}) {
  return (
    <div className="absolute w-full mt-1 bg-white shadow rounded-lg overflow-hidden">
      {results.map((result) => (
        <SearchResult key={result.id} title={result.title} description={result.description}/>
      ))}
    </div>
  )
}

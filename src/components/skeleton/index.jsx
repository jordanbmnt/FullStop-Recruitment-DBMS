export const Skeleton = ({ type, searchQuery }) => {
  switch (type) {
    case 'searchResult':
      let indices = [0, 1, 2];

      return (
        <div role="status" className="space-y-2.5 animate-pulse max-w-full">
          <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-1 duration-400 delay-200 ease-out">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Found users matching "{searchQuery}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {indices.map((_, index) => (
              <div key={`loading-search-result-skeleton-${index}-group`} className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 ease-out" style={{
                animationDelay: `${300 + index * 100}ms`,
                animationFillMode: 'both'
              }}>
                <div className="bg-white rounded-lg border border-gray-200 p-2 px-3 shadow-sm transition-all duration-300 transform-gpu">
                  <div className="flex items-center justify-between pt-4 mb-4">
                    <div>
                      <div className="h-2.5 bg-gray-300 rounded dark:bg-gray-700 w-24 mb-2.5"></div>
                      <div className="w-32 h-2.5 bg-gray-200 rounded dark:bg-gray-600"></div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded dark:bg-gray-700 w-12"></div>
                  </div>

                  {
                    indices.map((val, ind) => (
                      <div className="flex items-center w-full mt-4" key={`loading-search-result-skeleton-${ind}`}>
                        <div className="h-2.5 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
                        <div className="h-2.5 ms-2 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                      </div>
                    ))
                  }

                  <div className="h-8 bg-gray-300 rounded dark:bg-gray-600 w-full px-3 py-2 mb-2.5 mt-4"></div>



                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ))}
          </div>


          <div
            className="pt-6 border-t border-gray-200 animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
            style={{
              animationDelay: `${400 + indices.length * 100}ms`,
              animationFillMode: 'both'
            }}
          ></div>

          <div className="mx-auto h-8 bg-gray-300 rounded dark:bg-gray-600 w-[160px] px-3 py-2 mb-2.5"></div>
        </div>
      );

    default:
      break;
  }
} 
export const SearchResult = ({ searchResult, setSearchResult }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not available':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 transform-gpu">
      {/* Header Section - Compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">
            {searchResult.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {searchResult.email}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border flex-shrink-0 transition-all duration-200 ${getStatusColor(searchResult.status)}`}>
          {searchResult.status}
        </span>
      </div>

      {/* Details Grid - Compact Layout */}
      <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Field</span>
          <span className="text-gray-900 font-medium text-right truncate ml-2">{searchResult.field}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Experience</span>
          <span className="text-gray-900 text-right">{searchResult.yearsOfXp} years</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Updated</span>
          <span className="text-gray-600 text-right text-xs">{searchResult.lastUpdated}</span>
        </div>
      </div>

      {/* Action Button - Compact */}
      <button
        onClick={() => setSearchResult()}
        className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform-gpu"
      >
        View Details
      </button>
    </div>
  );
};
import { STYLES } from "../../../constants/styles";
import { dateFormat } from "../../../helpers/dateFormat";

export const SearchResult = ({ searchResult, setSearchResult }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const SEARCH_RESULT_HEAD_STYLE = `${STYLES.dark.text.tertiary} text-xs`;

  return (
    <div className={`${STYLES.dark.background.secondary} rounded-lg border ${STYLES.dark.border.medium} p-4 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-red-200 transition-all duration-300 transform-gpu`}>
      {/* Header Section - Compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className={`text-base font-semibold ${STYLES.dark.text.tertiary} truncate leading-tight`}>
            {searchResult.name}
          </h3>
          <p className={`text-xs ${STYLES.dark.text.paragraph} truncate mt-0.5`}>
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
          <span className={SEARCH_RESULT_HEAD_STYLE}>Field</span>
          <span className={`${STYLES.dark.text.paragraph} font-medium text-right truncate ml-2`}>{searchResult.field}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={SEARCH_RESULT_HEAD_STYLE}>Experience</span>
          <span className={`${STYLES.dark.text.paragraph} text-right`}>{searchResult.yearsOfXp} years</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={SEARCH_RESULT_HEAD_STYLE}>Updated</span>
          <span className={`${STYLES.dark.text.paragraph} text-right text-xs`}>{dateFormat(searchResult.lastUpdated, 'dd m yyyy')}</span>
        </div>
      </div>

      {/* Action Button - Compact */}
      <button
        onClick={() => setSearchResult()}
        className={`w-full px-3 py-2 text-xs font-medium ${STYLES.dark.text.primary} bg-[${STYLES.dark.accent.color}] hover:bg-[${STYLES.dark.accent.color}] hover:shadow-md hover:-translate-y-0.5 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:ring-offset-1 transform-gpu`}
      >
        View Details
      </button>
    </div>
  );
};
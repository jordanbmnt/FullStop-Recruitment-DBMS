export const ChartHeader = ({ title, description, badge }) => (
  <div className="mb-8">
    {
      badge ?
        (<div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {title}
            </h3>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border flex-shrink-0 bg-gray-50 text-gray-800 border-gray-200 hover:shadow-md transition-all duration-300`}>
            {badge}
          </span>
        </div>) :
        (<h3 className="text-lg font-semibold text-gray-800 mb-1">
          {title}
        </h3>)
    }

    <p className="text-sm text-gray-600">
      {description}
    </p>
  </div>
)
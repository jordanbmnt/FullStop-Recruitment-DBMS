export const ChartHeader = ({ title, description }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">
      {title}
    </h3>
    <p className="text-sm text-gray-600">
      {description}
    </p>
  </div>
)
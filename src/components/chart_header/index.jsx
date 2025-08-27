import { STYLES } from "../../constants/styles";

export const ChartHeader = ({ title, description, badge }) => {
  const HEADING_STYLE = `text-lg font-semibold ${STYLES.dark.text.secondary} mb-1`;

  return (
    <div className="mb-8">
      {
        badge ?
          (<div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className={HEADING_STYLE}>
                {title}
              </h3>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border flex-shrink-0 ${STYLES.dark.background.darkest} ${STYLES.dark.text.secondary} ${STYLES.dark.border.medium} hover:shadow-md transition-all duration-300`}>
              {badge}
            </span>
          </div>) :
          (<h3 className={HEADING_STYLE}>
            {title}
          </h3>)
      }

      <p className={`text-sm ${STYLES.dark.text.tertiary}`}>
        {description}
      </p>
    </div>
  )
}
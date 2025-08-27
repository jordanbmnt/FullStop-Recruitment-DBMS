import { STYLES } from "../../constants/styles";

export const Skeleton = ({ type, searchQuery }) => {
  switch (type) {
    case 'searchResult':
      let indices = [0, 1, 2];

      return (
        <div role="status" className="space-y-2.5 animate-pulse max-w-full">
          <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-1 duration-400 delay-200 ease-out">
            <div>
              <h2 className={`text-lg font-semibold ${STYLES.dark.text.secondary}`}>
                Search Results
              </h2>
              <p className={`text-sm ${STYLES.dark.text.paragraph} mt-1`}>
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
                <div className={`${STYLES.dark.background.secondary} rounded-lg border ${STYLES.dark.border.medium} p-2 px-3 shadow-sm transition-all duration-300 transform-gpu`}>
                  <div className="flex items-center justify-between pt-4 mb-4">
                    <div>
                      <div className={`h-2.5 ${STYLES.dark.background.tertiary} rounded w-24 mb-2.5`}></div>
                      <div className={`w-32 h-2.5 ${STYLES.dark.border.light} rounded`}></div>
                    </div>
                    <div className={`h-5 ${STYLES.dark.background.tertiary} rounded w-12`}></div>
                  </div>

                  {
                    indices.map((val, ind) => (
                      <div className="flex items-center w-full mt-4" key={`loading-search-result-skeleton-${ind}`}>
                        <div className={`h-2.5 ${STYLES.dark.border.light} rounded w-32`}></div>
                        <div className={`h-2.5 ms-2 ${STYLES.dark.background.tertiary} rounded w-24`}></div>
                      </div>
                    ))
                  }

                  <div className={`h-8 ${STYLES.dark.background.tertiary} rounded w-full px-3 py-2 mb-2.5 mt-4`}></div>



                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ))}
          </div>


          <div
            className={`pt-6 border-t ${STYLES.dark.border.light} animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out`}
            style={{
              animationDelay: `${400 + indices.length * 100}ms`,
              animationFillMode: 'both'
            }}
          ></div>

          <div className={`mx-auto h-8 ${STYLES.dark.background.tertiary} rounded w-[160px] px-3 py-2 mb-2.5`}></div>
        </div>
      );

    default:
      break;
  }
} 
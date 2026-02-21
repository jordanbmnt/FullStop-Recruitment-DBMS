import { STYLES } from "../../../constants/styles";

export const TabNavigation = ({
  setActiveTab,
  candidate,
  getData,
  activeTab,
}) => {
  return (
    <div
      className={`flex space-x-1 mb-4 sm:mb-6 ${STYLES.dark.background.secondary} p-1 rounded-lg`}
    >
      <button
        onClick={() => setActiveTab("overview")}
        className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
          activeTab === "overview"
            ? `${STYLES.dark.background.tertiary} text-[${STYLES.dark.accent.color}] shadow-sm hover:${STYLES.dark.background.primary}`
            : STYLES.dark.text.primary
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => {
          setActiveTab("details");
          //TODO: Fix the bug where it calls the DB again even if it is the same user. It should check if we already have the user data and use that if we do.
          //show CV loading and display after this fetch
          if (candidate.fileInfo) {
            getData(candidate.fileInfo.gridFsId);
          }
        }}
        className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
          activeTab === "details"
            ? `${STYLES.dark.background.tertiary} text-[${STYLES.dark.accent.color}] shadow-sm hover:${STYLES.dark.background.primary}`
            : STYLES.dark.text.primary
        }`}
      >
        Details
      </button>
    </div>
  );
};

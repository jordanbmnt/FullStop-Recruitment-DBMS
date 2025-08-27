import { Briefcase, Calendar, Phone } from "lucide-react";
import { dateFormat } from "../../../helpers/dateFormat";
import { STYLES } from "../../../constants/styles";

export const OverViewTab = ({ candidate }) => {
  const ICON_STYLE = `w-4 h-4 sm:w-5 sm:h-5 ${STYLES.dark.text.tertiary} mt-0.5 sm:mt-0 flex-shrink-0`;
  const HEADING_STYLE = `text-xs sm:text-sm ${STYLES.dark.text.secondary}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Professional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center space-x-3">
            <Briefcase className={ICON_STYLE} />
            <div className="min-w-0">
              <p className={HEADING_STYLE}>Field of Expertise</p>
              <p className={`font-medium ${STYLES.dark.text.paragraph} text-sm sm:text-base break-words`}>{candidate.field}</p>
            </div>
          </div>
          <div className="flex items-start sm:items-center space-x-3">
            <Calendar className={ICON_STYLE} />
            <div>
              <p className={HEADING_STYLE}>Years of Experience</p>
              <p className={`font-medium ${STYLES.dark.text.paragraph} text-sm sm:text-base`}>{candidate.yearsOfXp} years</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {candidate.phone && (
            <div className="flex items-start sm:items-center space-x-3">
              <Phone className={ICON_STYLE} />
              <div className="min-w-0">
                <p className={HEADING_STYLE}>Phone</p>
                <p className={`font-medium ${STYLES.dark.text.paragraph} text-sm sm:text-base break-all`}>{candidate.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-start sm:items-center space-x-3">
            <Calendar className={ICON_STYLE} />
            <div>
              <p className={HEADING_STYLE}>Last Updated</p>
              <p className={`font-medium ${STYLES.dark.text.paragraph} text-sm sm:text-base`}>{dateFormat(candidate.lastUpdated, 'dd m yyyy')}</p>
            </div>
          </div>
        </div>
      </div>

      {candidate.summary && (
        <div>
          <h3 className={`text-base sm:text-lg font-semibold ${STYLES.dark.text.secondary} mb-2 sm:mb-3`}>Professional Summary</h3>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{candidate.summary}</p>
        </div>
      )}

      {candidate.skills && (
        <div>
          <h3 className={`text-base sm:text-lg font-semibold ${STYLES.dark.text.secondary} mb-2 sm:mb-3`}>Key Skills</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-2 sm:px-3 py-1 bg-red-50 text-[${STYLES.dark.accent.color}] rounded-full text-xs sm:text-sm font-medium`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
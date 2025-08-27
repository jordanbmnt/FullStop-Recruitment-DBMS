import { AlertCircle, CheckCircle } from "lucide-react";
import { STYLES } from "../../../constants/styles";

export const FormSummary = ({ formData, submitStatus, submitMessage }) => {
  const SECONDARY_HEADING_STYLE = `text-lg font-semibold mb-4 ${STYLES.dark.text.secondary}`;
  const TERTIARY_HEADING_STYLE = `font-medium ${STYLES.dark.text.tertiary} mb-1`
  const PARAGRAPH_STYLE = `${STYLES.dark.text.paragraph} capitalize`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 mx-auto text-purple-600 mb-4" />
        <h2 className={`text-2xl font-bold ${STYLES.dark.text.primary} mb-2`}>
          Review & Submit
        </h2>
        <p className={STYLES.dark.text.paragraph}>
          Please review your information before submitting
        </p>
      </div>

      <div className={`${STYLES.dark.background.secondary} rounded-lg p-6 space-y-6`}>
        {/* CV Information */}
        <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
          <h3 className={SECONDARY_HEADING_STYLE}>CV Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>CV Type:</h4>
              <p className={PARAGRAPH_STYLE}>{formData.cvType}</p>
            </div>
            {formData.cvFile && (
              <div>
                <h4 className={TERTIARY_HEADING_STYLE}>File:</h4>
                <p className={STYLES.dark.text.paragraph}>
                  {formData.cvFileName} ({formData.cvFileSize} KB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
          <h3 className={SECONDARY_HEADING_STYLE}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Name:</h4>
              <p className={STYLES.dark.text.paragraph}>{formData.name || 'Not provided'}</p>
            </div>
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Email:</h4>
              <p className={STYLES.dark.text.paragraph}>{formData.email || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
          <h3 className={SECONDARY_HEADING_STYLE}>Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Job Title:</h4>
              <p className={STYLES.dark.text.paragraph}>{formData.jobTitle || 'Not provided'}</p>
            </div>
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Field:</h4>
              <p className={STYLES.dark.text.paragraph}>{formData.field || 'Not provided'}</p>
            </div>
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Years of Experience:</h4>
              <p className={STYLES.dark.text.paragraph}>{formData.yearsOfXp || 'Not provided'}</p>
            </div>
            <div>
              <h4 className={TERTIARY_HEADING_STYLE}>Status:</h4>
              <p className={PARAGRAPH_STYLE}>{formData.status}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {formData.skills && formData.skills.length > 0 && (
          <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
            <h3 className={SECONDARY_HEADING_STYLE}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {formData.coverLetter && (
          <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
            <h3 className={SECONDARY_HEADING_STYLE}>Cover Letter</h3>
            <p className={`text-gray-500 ${STYLES.dark.background.tertiary} p-3 rounded border ${STYLES.dark.border.medium}`}>
              {formData.coverLetter}
            </p>
          </div>
        )}

        {/* Summary */}
        {formData.summary && (
          <div className={`border-b ${STYLES.dark.border.medium} pb-4`}>
            <h3 className={SECONDARY_HEADING_STYLE}>Professional Summary</h3>
            <p className={`text-gray-500 ${STYLES.dark.background.tertiary} p-3 rounded border ${STYLES.dark.border.medium}`}>
              {formData.summary}
            </p>
          </div>
        )}

        {/* Previous Job Reasons */}
        <div>
          <h3 className={SECONDARY_HEADING_STYLE}>Previous Job Reasons</h3>
          <p className={`${STYLES.dark.text.paragraph} ${STYLES.dark.background.tertiary} p-3 rounded border ${STYLES.dark.border.medium}`}>
            {formData.previousJobReasons}
          </p>
        </div>
      </div>

      {submitStatus && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${submitStatus === 'success'
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-900'
          }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{submitMessage}</p>
        </div>
      )}
    </div>
  );
}
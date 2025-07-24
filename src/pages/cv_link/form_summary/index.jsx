import { AlertCircle, CheckCircle } from "lucide-react";

export const FormSummary = ({ formData, submitStatus, submitMessage }) => {

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 mx-auto text-purple-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600">
          Please review your information before submitting
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* CV Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">CV Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">CV Type:</h4>
              <p className="text-gray-600 capitalize">{formData.cvType}</p>
            </div>
            {formData.cvFile && (
              <div>
                <h4 className="font-medium text-gray-700 mb-1">File:</h4>
                <p className="text-gray-600">
                  {formData.cvFileName} ({formData.cvFileSize} KB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Name:</h4>
              <p className="text-gray-600">{formData.name || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Email:</h4>
              <p className="text-gray-600">{formData.email || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Job Title:</h4>
              <p className="text-gray-600">{formData.jobTitle || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Field:</h4>
              <p className="text-gray-600">{formData.field || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Years of Experience:</h4>
              <p className="text-gray-600">{formData.yearsOfXp || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Status:</h4>
              <p className="text-gray-600 capitalize">{formData.status}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {formData.skills && formData.skills.length > 0 && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {formData.coverLetter && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Cover Letter</h3>
            <p className="text-gray-600 bg-white p-3 rounded border">
              {formData.coverLetter}
            </p>
          </div>
        )}

        {/* Summary */}
        {formData.summary && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Summary</h3>
            <p className="text-gray-600 bg-white p-3 rounded border">
              {formData.summary}
            </p>
          </div>
        )}

        {/* Previous Job Reasons */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Previous Job Reasons</h3>
          <p className="text-gray-600 bg-white p-3 rounded border">
            {formData.previousJobReasons}
          </p>
        </div>
      </div>

      {submitStatus && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${submitStatus === 'success'
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
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
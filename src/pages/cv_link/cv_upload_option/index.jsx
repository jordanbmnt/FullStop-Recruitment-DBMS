import { FileText, RefreshCw, Upload } from "lucide-react"
import { STYLES } from '../../../constants/styles';

export const CvUploadOption = ({ formData, handleInputChange, handleFileUpload }) => {

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 mx-auto text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-200 mb-2">
          CV Management
        </h2>
        <p className="text-gray-500">
          Choose how you'd like to proceed with your CV
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${formData.cvType === "new"
            ? `border-[${STYLES.dark.accent.color}] ${STYLES.dark.background.tertiary} shadow-md`
            : STYLES.dark.border.medium
            }`}
          onClick={() => handleInputChange("cvType", "new")}
        >
          <Upload className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Upload New CV
          </h3>
          <p className="text-gray-500 text-sm">
            Start fresh with a completely new CV document
          </p>

          {formData.cvType === "new" && (
            <div className="mt-4 pt-4 border-t border-gray-400">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Choose your CV file:
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              {formData.cvFile && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    ✓ {formData.cvFileName} ({formData.cvFileSize} KB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${formData.cvType === "update"
            ? `border-yellow-600 ${STYLES.dark.background.tertiary} shadow-md`
            : STYLES.dark.border.medium
            }`}
          onClick={() => handleInputChange("cvType", "update")}
        >
          <RefreshCw className="w-8 h-8 text-yellow-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Update Existing CV
          </h3>
          <p className="text-gray-500 text-sm">
            Upload an updated version of your CV document
          </p>

          {formData.cvType === "update" && (
            <div className="mt-4 pt-4 border-t border-gray-400">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Choose your updated CV file:
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {formData.cvFile && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ✓ {formData.cvFileName} ({formData.cvFileSize} KB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
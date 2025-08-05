import { Annoyed, Download, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export const DetailsTab = ({ candidate, isFetching,
  searchResult }) => {
  const [isCvVisible, setIsCvVisible] = useState(null);

  const handleDownload = (type) => {
    //TODO: Create loading animation and that sort of shandies
    if (searchResult) {
      const { downloadElement } = searchResult;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
    }
  };

  const handleView = (e) => {
    // Simulated view functionality
    if (searchResult) {
      const { pdfElement } = searchResult;
      const viewCV = document.getElementById('view-cv-section');

      if (isCvVisible) {
        viewCV.classList.remove("flex")
        viewCV.classList.add("hidden")
        viewCV.removeChild(pdfElement);
        setIsCvVisible(false)
      } else {
        viewCV.classList.remove("hidden")
        viewCV.classList.add("flex")
        setIsCvVisible(true)
        viewCV.appendChild(pdfElement);
      }
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Available Documents</h3>

      {/* CV Section */}
      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${candidate.fileInfo ? "bg-red-100" : "bg-gray-100"} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className={`${candidate.fileInfo ? "text-red-600" : "text-gray-600"} font-semibold text-xs sm:text-sm`}>CV</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Curriculum Vitae</h4>
              <p className="text-xs sm:text-sm text-gray-500">PDF Document</p>
            </div>
          </div>

          {
            candidate.fileInfo ? (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  disabled={isFetching}
                  onClick={(e) => handleView(e)}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium ${isCvVisible ?
                    "text-red-600 bg-red-50 hover:bg-red-100" :
                    isFetching ?
                      "text-gray-700 bg-gray-100" :
                      "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    } rounded-md transition-colors`}
                >
                  {
                    isCvVisible ?
                      (
                        <div className='w-max flex flex-row items-center justify-center'>
                          <EyeClosed className="w-3 h-3 mx-2 sm:w-4 sm:h-4" />
                          <span>Close View</span>
                        </div>
                      ) :
                      (
                        <div className='w-max flex flex-row items-center justify-center'>
                          <Eye className="w-3 h-3 mx-2 sm:w-4 sm:h-4" />
                          <span>View CV</span>
                        </div>
                      )
                  }
                </button>
                <button
                  disabled={isFetching}
                  onClick={() => handleDownload('cv')}
                  className={`flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium ${isFetching ?
                    "text-gray-700 bg-gray-100" :
                    "text-gray-600 bg-gray-50 hover:bg-gray-100"
                    } rounded-md transition-colors`}
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Download</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => { window.location = `mailto:${candidate.email}?subject=Missing+CV+in+our+database` }}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-blue-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Annoyed className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>NOT UPLOADED</span>
                </button>
              </div>
            )
          }
        </div>

        <div
          id='view-cv-section'
          className='border border-gray-200 rounded-lg p-10 m-5 hidden'
        />
      </div>

      {/* Cover Letter Section */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Cover Letter</h3>
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              {candidate.coverLetter && (
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{candidate.coverLetter}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reasons for leaving Section */}
      {candidate.previousJobReasons && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Reason for leaving last position</h3>
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{candidate.previousJobReasons}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
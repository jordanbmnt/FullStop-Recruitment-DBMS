import { useState } from 'react';
import { X, Download, Eye, User, Mail, Calendar, Briefcase, Phone } from 'lucide-react';
import { dateFormat } from '../../helpers/dateFormat';

const CandidateDetailsModal = ({ candidate, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !candidate) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleDownload = (type) => {
    // Simulated download functionality
    const fileName = type === 'cv' ? `${candidate.name}_CV.pdf` : `${candidate.name}_CoverLetter.pdf`;
    console.log(`Downloading ${fileName}`);
    // In a real application, this would trigger an actual download
  };

  const handleView = (type) => {
    // Simulated view functionality
    console.log(`Viewing ${type} for ${candidate.name}`);
    // In a real application, this would open the document in a viewer or new tab
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-2 sm:px-4 pt-4 pb-4 sm:pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-3 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-t-xl sm:rounded-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{candidate.name}</h2>
                <p className="text-gray-600 flex items-center mt-1 text-sm sm:text-base">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors self-start sm:self-auto"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${activeTab === 'documents'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Documents
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Professional Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start sm:items-center space-x-3">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Field of Expertise</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{candidate.field}</p>
                    </div>
                  </div>
                  <div className="flex items-start sm:items-center space-x-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Years of Experience</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{candidate.yearsOfXp} years</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {candidate.phone && (
                    <div className="flex items-start sm:items-center space-x-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{candidate.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start sm:items-center space-x-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{dateFormat(candidate.lastUpdated, 'dd m yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {candidate.summary && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{candidate.summary}</p>
                </div>
              )}

              {candidate.skills && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Key Skills</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Available Documents</h3>

              {/* CV Section */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-semibold text-xs sm:text-sm">CV</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Curriculum Vitae</h4>
                      <p className="text-xs sm:text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleView('cv')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View CV</span>
                    </button>
                    <button
                      onClick={() => handleDownload('cv')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Letter Section */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-xs sm:text-sm">CL</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Cover Letter</h4>
                      <p className="text-xs sm:text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleView('coverLetter')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View Cover Letter</span>
                    </button>
                    <button
                      onClick={() => handleDownload('coverLetter')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => console.log('Contact candidate:', candidate.name)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Contact Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
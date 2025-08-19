import { useState } from 'react';
import { X, User, ExternalLink } from 'lucide-react';
import { OverViewTab } from './overview_tab';
import { DetailsTab } from './details_tab';
import { TabNavigation } from './tab_navigation';
import { STYLES } from '../../constants/styles';

const CandidateDetailsModal = ({ candidate, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFetching, setIsFetching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  if (!isOpen || !candidate) return null;

  const transformCVData = ([{ meta, binary }]) => {
    let result = {};
    if (meta) {
      const { filename, uploadDate } = meta[0];
      result = { ...result, filename, uploadDate };
    }

    if (binary) {
      const { data } = binary[0];

      // For display purposes
      const pdfElement = document.createElement('object');
      pdfElement.style.width = '100%';
      pdfElement.style.height = '842pt';
      pdfElement.style.className = 'rounded-md';
      pdfElement.type = 'application/pdf';
      pdfElement.data = 'data:application/pdf;base64,' + data;

      // use the click attribute and then remove it from the document
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      const downloadElement = document.createElement('a');
      downloadElement.innerHTML = 'Download PDF file';
      downloadElement.download = result.filename; // Change this to be more based on the info that is available 
      downloadElement.href = 'data:application/octet-stream;base64,' + data;
      result = { ...result, pdfElement, downloadElement };
    }

    return result
  }

  const getData = ({ user_id }) => {
    try {
      const ROOT_PARAM = `/.netlify/functions/get_users_cv_data`;
      let url = `${ROOT_PARAM}?user_id=${user_id}`;

      setIsFetching(true);

      fetch(url).then(res => res.json()).then(value => {
        if (value && value.body.length > 0) {
          setSearchResult((transformCVData(value.body)));
        }
        setIsFetching(false);
      });
      return;
    } catch (e) {
      setSearchResult(null);
      setIsFetching(false);
      console.warn("Error:", e)
      return;
    }

  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'employed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'seeking':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'open':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'casual':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleClose = () => {
    setActiveTab("overview");
    onClose();
  }

  const handleContact = () => {
    if (candidate && candidate.email) window.location = `mailto:${candidate.email}`
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-2 sm:px-4 pt-4 pb-4 sm:pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className={`fixed inset-0 transition-opacity ${STYLES.dark.background.tertiary} bg-opacity-75`}
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className={`inline-block w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-3 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform ${STYLES.dark.background.darkest} shadow-xl rounded-t-xl sm:rounded-lg`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className={`w-6 h-6 sm:w-8 sm:h-8 text-[${STYLES.dark.accent.color}]`} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100 truncate">{candidate.name}</h2>
                <a href={`mailto:${candidate.email}`} className={`text-[${STYLES.dark.accent.color}] flex items-center mt-1 text-sm sm:text-base gap-1`}>
                  <span className="truncate">{candidate.email}</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                </a>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors self-start sm:self-auto"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <TabNavigation
            setActiveTab={setActiveTab}
            candidate={candidate}
            getData={getData}
            activeTab={activeTab} />

          {/* Tab Content */}
          {activeTab === 'overview' && <OverViewTab candidate={candidate} />}

          {activeTab === 'details' && <DetailsTab candidate={candidate} isFetching={isFetching} searchResult={searchResult} />}

          {/* Footer Actions */}
          <div className={`flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t ${STYLES.dark.border.light}`}>
            <button
              onClick={handleClose}
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-100 ${STYLES.dark.background.secondary} border ${STYLES.dark.border.medium} rounded-md hover:${STYLES.dark.background.tertiary}transition-colors`}
            >
              Close
            </button>
            <button
              onClick={handleContact}
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[${STYLES.dark.accent.color}] hover:bg-red-700 rounded-md transition-colors`}
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
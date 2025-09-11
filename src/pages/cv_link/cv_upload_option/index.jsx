import { DeleteIcon, FileText, RefreshCw, Upload } from "lucide-react";
import { STYLES } from "../../../constants/styles";
import { useState } from "react";

const CVOptionCard = ({
  type,
  icon,
  title,
  description,
  color,
  isSelected,
  onSelect,
  onFileUpload,
  formData,
}) => {
  const [updateVale, setUpdateVale] = useState("");

  const PdfPreview = ({ formData, color }) => {
    return (
      <div
        className={`mt-2 p-2 bg-${color}-50 rounded-lg flex items-center justify-between space-x-4 border border-${color}-200`}
      >
        <p className={`text-sm text-${color}-700`}>
          {formData.cvFileName} ({formData.cvFileSize} KB)
        </p>
        <DeleteIcon
          className={`w-5 text-${color}-700`}
          onClick={() => {
            onSelect("cvType", type);
            onFileUpload({ target: { files: [] } });
          }}
        />
      </div>
    );
  };

  const colorClasses = {
    red: {
      border: "border-red-600",
      text: "text-red-600",
      file: "file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
    },
    yellow: {
      border: "border-yellow-600",
      text: "text-yellow-600",
      file: "file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100",
    },
  };

  const selectedBorder =
    color === "red"
      ? `border-[${STYLES.dark.accent.color}]`
      : colorClasses[color].border;

  return (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer ${
        isSelected
          ? `${selectedBorder} ${STYLES.dark.background.tertiary} shadow-md`
          : STYLES.dark.border.medium
      }`}
      onClick={onSelect}
    >
      {icon === "upload" ? (
        <Upload className={`w-8 h-8 ${colorClasses[color].text} mb-3`} />
      ) : (
        <RefreshCw className={`w-8 h-8 ${colorClasses[color].text} mb-3`} />
      )}
      <h3
        className={`text-lg font-semibold ${STYLES.dark.text.secondary} mb-2`}
      >
        {title}
      </h3>
      <p className={`${STYLES.dark.text.paragraph} text-sm`}>{description}</p>

      {isSelected && (
        <div className={`mt-4 pt-4 border-t ${STYLES.dark.border.medium}`}>
          {type === "new" ? (
            <div>
              <label
                className={`block text-sm font-medium ${STYLES.dark.text.tertiary} mb-2`}
              >
                Choose your {type === "update" ? "updated " : ""} CV file:
              </label>
              <input
                type='file'
                accept='.pdf'
                onChange={onFileUpload}
                className={`block w-full text-sm text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${colorClasses[color].file}`}
              />
            </div>
          ) : (
            <div className='flex space-x-4'>
              <input
                value={updateVale}
                onChange={(e) => setUpdateVale(e.target.value)}
                type='text'
                placeholder='e.g test@gmail.com'
                className={`flex-1 p-3 border ${STYLES.dark.border.medium} rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent ${STYLES.dark.background.tertiary} ${STYLES.dark.text.paragraph} placeholder:text-gray-600 w-70`}
              />
              <button
                className={`px-6 py-3 rounded-lg ${STYLES.dark.text.paragraph} font-medium transition-all duration-300 flex items-center space-x-2 justify-center w-20 hover:shadow-md hover:scale-105 transition-all duration-300 shadow-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
              >
                Submit
              </button>
            </div>
          )}
          {formData.cvFile && formData.cvType === type && (
            <PdfPreview formData={formData} color={color} />
          )}
        </div>
      )}
    </div>
  );
};

export const CvUploadOption = ({
  formData,
  handleInputChange,
  handleFileUpload,
}) => {
  const cvOptions = [
    {
      type: "new",
      icon: "upload",
      title: "Upload New CV",
      description: "Start fresh with a completely new CV document",
      color: "red",
    },
    {
      type: "update",
      icon: "update",
      title: "Update Existing CV",
      description: "Upload an updated version of your CV document",
      color: "yellow",
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='text-center mb-8'>
        <FileText className='w-16 h-16 mx-auto text-red-600 mb-4' />
        <h2 className={`text-2xl font-bold ${STYLES.dark.text.secondary} mb-2`}>
          CV Management
        </h2>
        <p className={STYLES.dark.text.paragraph}>
          Choose how you'd like to proceed with your CV
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {cvOptions.map((option) => (
          <CVOptionCard
            key={option.type}
            type={option.type}
            icon={option.icon}
            title={option.title}
            description={option.description}
            color={option.color}
            isSelected={formData.cvType === option.type}
            onSelect={() => {
              if (!formData.cvType || formData.cvType === option.type) {
                handleInputChange("cvType", option.type);
              } else {
                handleInputChange("cvType", option.type);
                handleFileUpload({ target: { files: [] } });
              }
            }}
            onFileUpload={handleFileUpload}
            formData={formData}
          />
        ))}
      </div>
    </div>
  );
};

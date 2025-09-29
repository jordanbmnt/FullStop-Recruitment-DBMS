import { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Clock,
  FileText,
  Brain,
  DeleteIcon,
  FileEdit,
} from "lucide-react";
import { FIELDS, STATUSES } from "../../../helpers/constants";
import { TextAreaSection } from "./text_area_section";
import { STYLES } from "../../../constants/styles";

const ResponsiveAsterisk = () => {
  return <span class='text-red-500'>*</span>;
};

const PdfPreview = ({ formData, color, onFileUpload }) => {
  return (
    <div
      className={`w-full p-1 px-2 bg-${color}-50 rounded-lg flex items-center justify-between space-x-4 border border-${color}-200`}
    >
      <p className={`text-sm text-${color}-700`}>
        {`${formData.cvFileName.slice(0, 13)}...`} ({formData.cvFileSize} KB)
      </p>
      <DeleteIcon
        className={`w-5 text-${color}-700`}
        onClick={() => {
          onFileUpload({ target: { files: [] } });
        }}
      />
    </div>
  );
};

export const UserForm = ({ formData, onFormDataChange, onFileUpload }) => {
  const [currentSkill, setCurrentSkill] = useState("");
  const textAreaSections = [
    {
      field: "coverLetter",
      heading: "Cover Letter",
      placeholder:
        "Share your motivation for applying, highlight relevant skills, and explain how your experience aligns with this role...",
      isRequired: true,
    },
    {
      field: "summary",
      heading: "Brief professional summary",
      placeholder:
        "Describe your professional background, key achievements, and what you bring to the table...",
      isRequired: true,
    },
    {
      field: "previousJobReasons",
      heading: "Reasons for leaving previous positions",
      placeholder:
        "e.g., Seeking new challenges, career advancement, better work-life balance, company restructuring, etc.",
      isRequired: true,
    },
  ];

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      const updatedSkills = [...formData.skills, currentSkill.trim()];
      onFormDataChange("skills", updatedSkills);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(
      (skill) => skill !== skillToRemove
    );
    onFormDataChange("skills", updatedSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const HEADING_STYLE = `text-lg font-semibold ${STYLES.dark.text.primary} mb-4 flex items-center`;
  const LABEL_STYLE = `block text-sm font-medium ${STYLES.dark.text.secondary} mb-2`;
  const INPUT_STYLE = `w-full p-3 border ${STYLES.dark.border.medium} rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:border-transparent ${STYLES.dark.background.tertiary} ${STYLES.dark.text.paragraph} placeholder:text-gray-600`;
  const SELECT_STYLE = `w-full p-3 border ${STYLES.dark.border.medium} rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:border-transparent ${STYLES.dark.background.tertiary} ${STYLES.dark.text.paragraph} placeholder:text-gray-600`;

  return (
    <div className='space-y-8'>
      <div className='text-center mb-8'>
        <User className='w-16 h-16 mx-auto text-green-600 mb-4' />
        <h2 className={`text-2xl font-bold ${STYLES.dark.text.primary} mb-2`}>
          Complete Job Profile
        </h2>
        <p className={STYLES.dark.text.paragraph}>
          Tell us about yourself and your career journey
        </p>
      </div>

      {/* Personal Information */}
      <div className={`${STYLES.dark.background.secondary} p-6 rounded-lg`}>
        <h3 className={HEADING_STYLE}>
          <User className={`w-5 h-5 mr-2 text-[${STYLES.dark.accent.color}]`} />
          Personal Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className={LABEL_STYLE}>
              Full Name <ResponsiveAsterisk />
            </label>
            <input
              type='text'
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder='Enter your full name'
              className={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_STYLE}>
              <Mail className='w-4 h-4 inline mr-1' />
              Email Address <ResponsiveAsterisk />
            </label>
            <input
              type='email'
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder='your.email@example.com'
              className={INPUT_STYLE}
            />
          </div>
        </div>
      </div>

      {/* Resume / CV Upload */}
      <div
        className={`${STYLES.dark.background.secondary} p-6 rounded-lg w-full`}
      >
        <h3 className={HEADING_STYLE}>
          <FileEdit
            className={`w-5 h-5 mr-2 text-[${STYLES.dark.accent.color}]`}
          />
          Resume / CV Upload
        </h3>
        {formData.cvType === "update" ? (
          <div className='w-full flex justify-between align-center'>
            <label
              className={`block text-sm font-medium ${STYLES.dark.text.tertiary} self-center`}
            >
              Choose your updated CV file:
            </label>
            <div className='flex w-fit space-x-4'>
              {formData.cvFile && formData.cvType === "update" && (
                <PdfPreview
                  formData={formData}
                  color={"red"}
                  onFileUpload={onFileUpload}
                />
              )}
              <input
                type='file'
                accept='.pdf'
                onChange={onFileUpload}
                className={`flex max-w-min text-sm text-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 self-center w-[105px] cursor-pointer`}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Professional Information */}
      <div className={`${STYLES.dark.background.secondary} p-6 rounded-lg`}>
        <h3 className={HEADING_STYLE}>
          <Briefcase
            className={`w-5 h-5 mr-2 text-[${STYLES.dark.accent.color}]`}
          />
          Professional Details
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <label className={LABEL_STYLE}>
              Current Job Title <ResponsiveAsterisk />
            </label>
            <input
              type='text'
              value={formData.jobTitle || ""}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder='e.g., Frontend Developer'
              className={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_STYLE}>
              Field/Industry <ResponsiveAsterisk />
            </label>
            <select
              value={formData.field || ""}
              onChange={(e) => handleInputChange("field", e.target.value)}
              className={SELECT_STYLE}
            >
              <option value='' className={STYLES.dark.text.paragraph}>
                Select an Industry
              </option>
              {FIELDS.map((f, i) => (
                <option
                  key={`${f.toLowerCase()}-${i}`}
                  value={`${f.toLowerCase()}`}
                >
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className={LABEL_STYLE}>
              <Clock className='w-4 h-4 inline mr-1' />
              Years of Experience
            </label>
            <input
              type='number'
              value={formData.yearsOfXp || ""}
              onChange={(e) =>
                handleInputChange("yearsOfXp", parseInt(e.target.value) || "")
              }
              placeholder='5'
              min='0'
              max='50'
              className={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_STYLE}>
              Status <ResponsiveAsterisk />
            </label>
            <select
              value={formData.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className={SELECT_STYLE}
            >
              <option value='' className={STYLES.dark.text.paragraph}>
                Select a Status
              </option>
              {STATUSES.map((f, i) => (
                <option key={`${f.value}-${i}`} value={`${f.value}`}>
                  {f.display}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className={`${STYLES.dark.background.secondary} p-6 rounded-lg`}>
        <h3 className={HEADING_STYLE}>
          <Brain
            className={`w-5 h-5 mr-2 text-[${STYLES.dark.accent.color}]`}
          />
          Skills
        </h3>
        <div className='mb-4'>
          <label className={LABEL_STYLE}>
            Add your skills (press Enter to add each skill){" "}
            <ResponsiveAsterisk />
          </label>
          <div className='flex gap-2'>
            <input
              type='text'
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder='e.g., Problem Solving, Project Management, JavaScript'
              className={`flex-1 p-3 border ${STYLES.dark.border.medium} rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:border-transparent ${STYLES.dark.background.tertiary} ${STYLES.dark.text.paragraph} placeholder:text-gray-600`}
            />
            <button
              type='button'
              onClick={addSkill}
              className={`px-4 py-3 bg-red-600 ${STYLES.dark.text.primary} rounded-lg hover:bg-red-700 transition-colors`}
            >
              Add
            </button>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {(formData.skills || []).map((skill, index) => (
            <span
              key={index}
              className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800'
            >
              {skill}
              <button
                type='button'
                onClick={() => removeSkill(skill)}
                className='ml-2 text-red-600 hover:text-red-800'
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Professional Summary */}
      <div className={`${STYLES.dark.background.secondary} p-6 rounded-lg`}>
        <h3 className={HEADING_STYLE}>
          <FileText
            className={`w-5 h-5 mr-2 text-[${STYLES.dark.accent.color}]`}
          />
          Professional Summary
        </h3>

        <div className='space-y-4'>
          {textAreaSections.map((section) => (
            <TextAreaSection
              key={section.field}
              formData={formData[section.field]}
              inputHandler={handleInputChange}
              field={section.field}
              heading={section.heading}
              placeholder={section.placeholder}
              isRequired={section.isRequired}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

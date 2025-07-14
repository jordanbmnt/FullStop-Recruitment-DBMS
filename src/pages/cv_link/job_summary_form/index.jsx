import { useState } from 'react';
import { User, Mail, Briefcase, Clock, Code, FileText } from 'lucide-react';
import { FIELDS, STATUSES } from '../../../helpers/constants';
import { TextAreaSection } from './text_area_section';

export const JobSummaryForm = ({ formData, onFormDataChange }) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const textAreaSections = [
    {
      field: "coverLetter",
      heading: "Cover Letter",
      placeholder: "Share your motivation for applying, highlight relevant skills, and explain how your experience aligns with this role...",
    },
    {
      field: "summary",
      heading: "Brief professional summary",
      placeholder: "Describe your professional background, key achievements, and what you bring to the table...",
    },
    {
      field: "previousJobReasons",
      heading: "Reasons for leaving previous positions",
      placeholder: "e.g., Seeking new challenges, career advancement, better work-life balance, company restructuring, etc.",
    },
  ];

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      const updatedSkills = [...formData.skills, currentSkill.trim()];
      onFormDataChange('skills', updatedSkills);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    onFormDataChange('skills', updatedSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <User className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Job Profile
        </h2>
        <p className="text-gray-600">
          Tell us about yourself and your career journey
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
          Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle || ''}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field/Industry
            </label>
            <select
              value={formData.field || ''}
              onChange={(e) => handleInputChange('field', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an Industry</option>
              {
                FIELDS.map(f => (<option value={`${f.toLowerCase()}`}>{f}</option>))
              }
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Years of Experience
            </label>
            <input
              type="number"
              value={formData.yearsOfXp || ''}
              onChange={(e) => handleInputChange('yearsOfXp', parseInt(e.target.value) || '')}
              placeholder="5"
              min="0"
              max="50"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a Status</option>
              {
                STATUSES.map(f => (<option value={`${f.value}`}>{f.display}</option>))
              }
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-blue-600" />
          Skills
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add your skills (press Enter to add each skill)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., React, JavaScript, Python"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.skills || []).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Professional Summary
        </h3>

        <div className="space-y-4">
          {textAreaSections.map((section) => (
            <TextAreaSection
              key={section.field}
              formData={formData[section.field]}
              inputHandler={handleInputChange}
              field={section.field}
              heading={section.heading}
              placeholder={section.placeholder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
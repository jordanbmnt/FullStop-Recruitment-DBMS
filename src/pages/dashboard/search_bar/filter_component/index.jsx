import { X } from "lucide-react"
import { FIELDS, STATUSES } from "../../../../helpers/constants"
import { STYLES } from "../../../../constants/styles"

export const FilterComponent = ({ hasActiveFilters, clearFilters, fieldInput, setFieldInput, selectedStatus, setSelectedStatus, skillsInput, setSkillsInput, minExperience, setMinExperience, maxExperience, setMaxExperience }) => {
  const INPUT_STYLE = `w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:border-[${STYLES.dark.accent.color}] accent-pink-500` 

  return (
    <div className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Advanced Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Field</label>
          <select
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            className={INPUT_STYLE}
          >
            <option value="">Select a Field</option>
            {
              FIELDS.map(f => (<option value={`${f.toLowerCase()}`}>{f}</option>))
            }
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={INPUT_STYLE}
          >
            <option value="">Select a Status</option>
            {
              STATUSES.map(f => (<option value={`${f.value}`}>{f.display}</option>))
            }
          </select>
        </div>

        {/* Skills Filter */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2">Skills</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g., React, JavaScript, Python (comma-separated)"
            className={INPUT_STYLE}
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        {/* Experience Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2">Years of Experience</label>
          <div className="flex space-x-4 items-center">
            <div className="flex-1">
              <input
                type="number"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                placeholder="Min years"
                min="0"
                className={INPUT_STYLE}
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex-1">
              <input
                type="number"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value)}
                placeholder="Max years"
                min="0"
                className={INPUT_STYLE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
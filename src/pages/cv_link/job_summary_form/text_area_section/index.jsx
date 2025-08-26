import { STYLES } from "../../../../constants/styles";

export const TextAreaSection = ({ formData, inputHandler, field, heading, placeholder, isRequired }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {heading} {isRequired && <span class='text-red-500'>*</span >}
      </label>
      <textarea
        value={formData || ''}
        onChange={(e) => inputHandler(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 border ${STYLES.dark.border.medium} rounded-lg focus:ring-2 focus:ring-[${STYLES.dark.accent.color}] focus:border-transparent resize-none ${STYLES.dark.background.tertiary}`}
        rows={4}
      />
    </div>
  );
}
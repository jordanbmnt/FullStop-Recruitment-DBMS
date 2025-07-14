export const TextAreaSection = ({ formData, inputHandler, field, heading, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {heading}
      </label>
      <textarea
        value={formData || ''}
        onChange={(e) => inputHandler(field, e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={4}
      />
    </div>
  );
}
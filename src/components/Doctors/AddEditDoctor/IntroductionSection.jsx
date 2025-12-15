const IntroductionSection = ({ formData, handleInputChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Introduction *
      </label>
      <textarea
        name="introduction"
        value={formData.introduction}
        onChange={handleInputChange}
        rows="4"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
};

export default IntroductionSection; 
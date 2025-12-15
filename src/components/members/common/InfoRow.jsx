const InfoRow = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default InfoRow; 
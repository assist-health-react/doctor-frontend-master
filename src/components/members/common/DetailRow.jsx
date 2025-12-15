const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    {icon && <span className="text-gray-400">{icon}</span>}
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || 'N/A'}</span>
  </div>
);

export default DetailRow; 
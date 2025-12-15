import { FaInfoCircle } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaInfoCircle,
  title = 'No Data Available',
  message = 'There are no items to display at this time.',
  action = null
}) => {
  return (
    <div className="text-center py-8">
      <Icon className="mx-auto text-gray-400 text-5xl mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 
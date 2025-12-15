import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  section, 
  bgColor, 
  textColor, 
  borderColor,
  isExpanded,
  onToggle 
}) => (
  <div 
    className={`flex items-center justify-between p-3 ${bgColor} ${borderColor} rounded-t-lg cursor-pointer`}
    onClick={() => onToggle(section)}
  >
    <div className="flex items-center space-x-2">
      <Icon className={`${textColor}`} />
      <h3 className={`font-semibold ${textColor}`}>{title}</h3>
    </div>
    {isExpanded ? (
      <FaChevronDown className={textColor} />
    ) : (
      <FaChevronRight className={textColor} />
    )}
  </div>
);

export default SectionHeader; 
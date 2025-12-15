import { FaUserCircle, FaEnvelope, FaPhone } from 'react-icons/fa'

const WelcomeCard = ({ navigator }) => {
  if (!navigator) {
    return null
  }

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative backdrop-blur-sm border border-white/20 rounded-2xl p-8">
        <div className="flex items-center gap-8">
          <div className="shrink-0 bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
            {navigator.profilePic ? (
              <img 
                src={navigator.profilePic} 
                alt={navigator.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-white/90" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
                Welcome, {navigator.name || 'Navigator'}
              </h1>
              <div className="space-y-4">
                {navigator.email && (
                <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                  <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium tracking-wide">{navigator.email}</span>
                </div>
                )}
                {navigator.phone && (
                <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                  <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                    <FaPhone className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium tracking-wide">{navigator.phone}</span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeCard 

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { login } from '../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault() // Ensure this line is executed
  //   if (isLoading) return // Prevent multiple submissions

  //   setIsLoading(true)
  //   setError('')

  //   try {
  //     const response = await login(formData)
  //     if (response.status === 'success') {
  //       if (response.data.user.passwordResetRequired) {
  //         // Navigate to reset password page
  //         navigate('/forgot-password', { state: { fromLogin: true } })
  //       } else {
  //         // Navigate to dashboard
  //         navigate('/')
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     setError(err.message || 'Invalid email or password')
  //     setIsLoading(false)
  //   }
  // }
const handleSubmit = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const email = formData.email;
  const password = formData.password;

  if (isLoading || !email || !password) return;

  setError('');
  setIsLoading(true);

  try {
    // Your login() previously accepted an object → keep same format
    const response = await login({ email, password });

    if (response.status === 'success') {
      const { user, tokens } = response.data;

      // If password reset required → navigate
      if (user.passwordResetRequired) {
        localStorage.setItem('temp_token', tokens.accessToken);
        navigate('/forgot-password', { state: { fromLogin: true } });
        return;
      }

      // Normal login flow
      localStorage.setItem('token', tokens.accessToken);
      
      // Decode expiry
      // const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      // localStorage.setItem('tokenExpiry', payload.exp * 1000);

      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));

      // Fetch profile info
      try {
        const profileResponse = await profileService.getProfile();
        if (profileResponse.status === 'success') {
          localStorage.setItem('userProfile', JSON.stringify(profileResponse.data));
        }
      } catch (profileError) {
        console.error('Profile load error:', profileError);
      }

      if (typeof onLogin === 'function') {
        onLogin();
      }

      navigate('/');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Login error:', err);

    setError(err.message || err.error || 'Invalid email or password. Please try again.');

    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('temp_token');
    localStorage.removeItem('userProfile');
  } finally {
    setIsLoading(false);
  }
};

//  
return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">

      {/* LEFT SIDE - GIF */}
      <div className="w-full md:w-1/2 p-4 flex items-center justify-center">
        <img
          src="/assets/login_img.gif"
          alt="Medical Care"
          className="w-full h-auto object-contain max-h-[320px] md:max-h-[450px]"
        />
      </div>

      {/* DIVIDER - Only for desktop/tablet */}
      <div className="hidden md:block w-px bg-gray-200"></div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full md:w-1/2 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/logo_new.png"
              alt="AssistHealth"
              className="object-contain"
              style={{ width: 220 }}
            />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mt-2">Doctor Login</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
)
}

export default Login 
import { useState } from 'react'
import { FaTimes, FaUpload } from 'react-icons/fa'
import MDEditor from '@uiw/react-md-editor'
import blogsService from '../../services/blogsService'

const AddBlogModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    imageUrl: '',
    content: '',
    readTime: '',
    tags: [],
    category: '',
    status: 'draft',
    author: {
      type: 'doctor', // default type, can be changed
      name: ''
    }
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // First upload the image if it exists
      let imageUrl = formData.imageUrl
      if (formData.image && !imageUrl) {
        setUploadProgress(true)
        const uploadResponse = await blogsService.uploadImage(formData.image)
        if (uploadResponse.success) {
          imageUrl = uploadResponse.imageUrl
          setFormData(prev => ({ ...prev, imageUrl }))
        }
        setUploadProgress(false)
      }

      // Prepare the request body
      const blogData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        author: formData.author,
        tags: formData.tags,
        featuredImage: imageUrl,
        readTimeMins: parseInt(formData.readTime)
      }

      const response = await blogsService.createBlog(blogData)
      if (response.status === 'success') {
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('author.')) {
      const authorField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setError(null)
        setUploadProgress(true)
        
        // Upload the image immediately when selected
        const response = await blogsService.uploadImage(file)
        if (response.success) {
          setFormData(prev => ({ 
            ...prev, 
            image: file,
            imageUrl: response.imageUrl 
          }))
        }
      } catch (err) {
        setError('Failed to upload image: ' + (err.message || 'Unknown error'))
      } finally {
        setUploadProgress(false)
      }
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagAdd()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Add New Blog</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Title"
            required
          >
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Category"
              required
            >
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </FormField>

            <FormField
              label="Status"
            >
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Author Type"
              required
            >
              <select
                name="author.type"
                value={formData.author.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="navigator">Navigator</option>
              </select>
            </FormField>

            <FormField
              label="Author Name"
              required
            >
              <input
                type="text"
                name="author.name"
                value={formData.author.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </FormField>
          </div>

          <FormField
            label="Featured Image"
            required
          >
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {formData.imageUrl ? (
                  <div className="relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null, imageUrl: '' }))}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                ) : uploadProgress ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
                  </div>
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="image"
                          onChange={handleImageChange}
                          className="sr-only"
                          accept="image/*"
                          required={!formData.imageUrl}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </FormField>

          <FormField
            label="Read Time (in minutes)"
            required
          >
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </FormField>

          <FormField
            label="Tags"
            required
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </FormField>

          <FormField
            label="Content"
            required
          >
            <div data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                height={400}
                preview="edit"
              />
            </div>
          </FormField>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                px-4 py-2 bg-blue-500 text-white rounded-lg 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} 
                transition-colors
              `}
            >
              {loading ? 'Creating...' : 'Add Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper component for form fields
const FormField = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && '*'}
    </label>
    {children}
  </div>
)

export default AddBlogModal 
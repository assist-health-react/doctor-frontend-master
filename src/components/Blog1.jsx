import { useState } from 'react'
import { FaSearch, FaPlus, FaTimes, FaUpload } from 'react-icons/fa'
import MDEditor from '@uiw/react-md-editor'

const BlogDetailModal = ({ blog, onClose, onEdit, onDelete, onPublish }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDraftConfirm, setShowDraftConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(blog.id)
    onClose()
  }

  const handlePublish = () => {
    onPublish(blog.id, 'published')
    setShowPublishConfirm(false)
    onClose()
  }

  const handleDraft = () => {
    onPublish(blog.id, 'draft')
    setShowDraftConfirm(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{blog.title}</h3>
          <div className="flex items-center gap-2">
            {blog.status !== 'published' && (
              <>
                <button 
                  onClick={() => onEdit(blog)}
                  className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                  title="Edit blog"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                  title="Delete blog"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <img 
            src={typeof blog.image === 'string' ? blog.image : URL.createObjectURL(blog.image)}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{blog.readTime} min read</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </span>
            <div className="flex flex-wrap gap-2">
              {blog.tags && blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            <div data-color-mode="light">
              <MDEditor.Markdown source={blog.content} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {blog.status === 'published' ? (
              <button
                onClick={() => setShowDraftConfirm(true)}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Back to Draft
              </button>
            ) : (
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Blog
              </button>
            )}
          </div>
        </div>

        {/* Publish Confirmation Modal */}
        {showPublishConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Publish Blog</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to publish "{blog.title}"? This will make it visible to all users.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Delete Blog</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{blog.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Draft Confirmation Modal */}
        {showDraftConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Move to Draft</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to move "{blog.title}" back to drafts? It will no longer be visible to users.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDraftConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDraft}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Move to Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AddBlogModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    content: '',
    readTime: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Blog form submitted:', formData)
    onClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
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
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Read Time (in minutes) *
            </label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags *
            </label>
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
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div data-color-mode="light">
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                height={400}
                preview="edit"
              />
            </div>
          </div>

          {/* Submit Buttons */}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [activeTab, setActiveTab] = useState('my-blogs')
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Future of Healthcare Technology",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# The Future of Healthcare Technology\n\nHealthcare technology is rapidly evolving, bringing new innovations in patient care and medical procedures. Here are some key developments:\n\n## Artificial Intelligence in Healthcare\n- Diagnostic assistance\n- Treatment planning\n- Patient monitoring\n\n## Telemedicine\n- Remote consultations\n- Digital health records\n- Mobile health apps",
      readTime: 5,
      tags: ["Healthcare", "Technology", "AI", "Telemedicine"],
      status: 'published'
    },
    {
      id: 2,
      title: "Understanding Mental Health in Modern Times",
      image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# Mental Health Awareness\n\nMental health awareness has become increasingly important in our fast-paced modern society. Let's explore some key aspects:\n\n## Common Challenges\n- Stress management\n- Anxiety\n- Depression\n\n## Coping Strategies\n- Mindfulness\n- Professional help\n- Support systems",
      readTime: 7,
      tags: ["Mental Health", "Wellness", "Self Care"],
      status: 'draft'
    },
    {
      id: 3,
      title: "Nutrition Tips for a Healthy Lifestyle",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# Healthy Nutrition Guide\n\nMaintaining a balanced diet is crucial for overall health and well-being. Here's what you need to know:\n\n## Key Nutrients\n- Proteins\n- Carbohydrates\n- Healthy fats\n\n## Meal Planning\n- Portion control\n- Balanced meals\n- Healthy snacks",
      readTime: 4,
      tags: ["Nutrition", "Health", "Diet", "Wellness"],
      status: 'published'
    },
    {
      id: 4,
      title: "Exercise Fundamentals for Beginners",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# Exercise Fundamentals\n\nStarting your fitness journey can be overwhelming. Here's a comprehensive guide for beginners:\n\n## Basic Principles\n- Warm-up importance\n- Proper form\n- Progressive overload\n\n## Workout Types\n- Cardio training\n- Strength training\n- Flexibility work",
      readTime: 6,
      tags: ["Fitness", "Exercise", "Wellness", "Beginners"],
      status: 'draft'
    },
    {
      id: 5,
      title: "Sleep Science: Understanding Rest",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# Sleep Science\n\nQuality sleep is fundamental to health. Learn about sleep cycles and improving rest quality:\n\n## Sleep Cycles\n- REM sleep\n- Deep sleep\n- Sleep stages\n\n## Better Sleep Tips\n- Sleep hygiene\n- Optimal environment\n- Bedtime routines",
      readTime: 8,
      tags: ["Sleep", "Health", "Wellness", "Science"],
      status: 'published'
    },
    {
      id: 6,
      title: "Stress Management Techniques",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      content: "# Stress Management\n\nEffective stress management is crucial for mental and physical health:\n\n## Understanding Stress\n- Types of stress\n- Physical effects\n- Mental impact\n\n## Management Strategies\n- Meditation\n- Exercise\n- Time management",
      readTime: 5,
      tags: ["Stress", "Mental Health", "Wellness", "Self Care"],
      status: 'draft'
    }
  ])

  const handleEdit = (blog) => {
    setShowAddForm(true)
    setSelectedBlog(null)
    // You would typically populate the form with the blog data here
  }

  const handleDelete = (blogId) => {
    setBlogs(blogs.filter(blog => blog.id !== blogId))
  }

  const handlePublish = (blogId, newStatus) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId 
        ? { ...blog, status: newStatus }
        : blog
    ))
  }

  // Filter blogs based on search term and active tab
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeTab) {
      case 'pending':
        return matchesSearch && blog.status === 'draft'
      case 'published':
        return matchesSearch && blog.status === 'published'
      default: // my-blogs
        return matchesSearch
    }
  })

  const tabs = [
    { id: 'my-blogs', name: 'My Blogs' },
    { id: 'pending', name: 'Pending' },
    { id: 'published', name: 'Published' }
  ]

  return (
    <div className="p-4">
      {/* Header with search and add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Blog</h2>
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Add Blog Button */}
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Add Blog
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.id === 'pending' 
                    ? blogs.filter(b => b.status === 'draft').length
                    : tab.id === 'published'
                      ? blogs.filter(b => b.status === 'published').length
                      : blogs.length
                  }
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map(blog => (
          <div 
            key={blog.id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedBlog(blog)}
          >
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{blog.readTime} min read</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  blog.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddBlogModal onClose={() => setShowAddForm(false)} />
      )}

      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      )}
    </div>
  )
}

export default Blog 
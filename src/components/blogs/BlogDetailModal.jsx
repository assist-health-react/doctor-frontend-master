import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import MDEditor from '@uiw/react-md-editor'
import blogsService from '../../services/blogsService'

const BlogDetailModal = ({ blog: initialBlog, onClose, onEdit, onDelete, onPublish }) => {
  const [blog, setBlog] = useState(initialBlog)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDraftConfirm, setShowDraftConfirm] = useState(false)

  useEffect(() => {
    fetchBlogDetails()
  }, [initialBlog._id])

  const fetchBlogDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await blogsService.getBlogById(initialBlog._id)
      if (response.status === 'success') {
        setBlog({
          ...response.data,
          id: response.data._id,
          readTime: response.data.readTimeMins,
          image: response.data.featuredImage,
          date: response.data.publishDate
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch blog details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await blogsService.deleteBlog(blog._id)
      onDelete?.(blog._id)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to delete blog')
    }
  }

  const handlePublish = async () => {
    try {
      await blogsService.updateBlog(blog._id, { status: 'published' })
      onPublish?.(blog._id, 'published')
      setShowPublishConfirm(false)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to publish blog')
    }
  }

  const handleDraft = async () => {
    try {
      await blogsService.updateBlog(blog._id, { status: 'draft' })
      onPublish?.(blog._id, 'draft')
      setShowDraftConfirm(false)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to move blog to draft')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg 
                className="mx-auto h-12 w-12"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={fetchBlogDetails}
                className="px-4 py-2 text-blue-500 hover:text-blue-600"
              >
                Try again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">{blog.title}</h3>
          <div className="flex items-center gap-2">
            {blog.status !== 'published' && (
              <button 
                onClick={() => onEdit(blog)}
                className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                title="Edit blog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
              title="Delete blog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
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
          {blog.image && (
            <img 
              src={blog.image}
              alt={blog.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{blog.author?.name}</span>
              <span className="text-gray-400">•</span>
              <span>{blog.readTime} min read</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </span>
            {blog.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                {blog.category}
              </span>
            )}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

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
                Publish Blog
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modals */}
        {showPublishConfirm && (
          <ConfirmationModal
            title="Publish Blog"
            message={`Are you sure you want to publish "${blog.title}"? This will make it visible to all users.`}
            confirmText="Publish"
            confirmButtonClass="bg-green-500 hover:bg-green-600"
            onConfirm={handlePublish}
            onCancel={() => setShowPublishConfirm(false)}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmationModal
            title="Delete Blog"
            message={`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`}
            confirmText="Delete"
            confirmButtonClass="bg-red-500 hover:bg-red-600"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}

        {showDraftConfirm && (
          <ConfirmationModal
            title="Move to Draft"
            message={`Are you sure you want to move "${blog.title}" back to drafts? It will no longer be visible to users.`}
            confirmText="Move to Draft"
            confirmButtonClass="bg-yellow-500 hover:bg-yellow-600"
            onConfirm={handleDraft}
            onCancel={() => setShowDraftConfirm(false)}
          />
        )}
      </div>
    </div>
  )
}

// Helper component for confirmation modals
const ConfirmationModal = ({ 
  title, 
  message, 
  confirmText, 
  confirmButtonClass, 
  onConfirm, 
  onCancel 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmButtonClass}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
)

export default BlogDetailModal 
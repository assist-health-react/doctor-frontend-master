import { useState, useEffect } from 'react'
import BlogCard from './BlogCard'
import blogsService from '../../services/blogsService'

const BlogList = ({ onBlogClick, activeTab, searchTerm }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setPage(1)
    setBlogs([])
  }, [activeTab, searchTerm])

  useEffect(() => {
    fetchBlogs()
  }, [page, activeTab, searchTerm])

  const getStatusFromTab = (tab) => {
    switch (tab) {
      case 'published':
        return 'published'
      case 'drafts':
        return 'draft'
      default:
        return ''
    }
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const status = getStatusFromTab(activeTab)
      const response = await blogsService.getAllBlogs(page, 10, status, searchTerm)
      
      if (response.status === 'success') {
        const { data, pagination } = response
        setBlogs(prevBlogs => page === 1 ? data : [...prevBlogs, ...data])
        setHasMore(pagination.page < pagination.pages)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading blogs</h3>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={fetchBlogs}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Try again
        </button>
      </div>
    )
  }

  if (blogs.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <BlogCard 
            key={blog._id} 
            blog={{
              ...blog,
              id: blog._id,
              readTime: blog.readTimeMins,
              image: blog.featuredImage,
              date: blog.publishDate
            }} 
            onClick={onBlogClick}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className={`
              px-6 py-2 rounded-lg border border-blue-500 text-blue-500
              hover:bg-blue-50 transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
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
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs found</h3>
    <p className="text-gray-500">Get started by creating a new blog post.</p>
  </div>
)

export default BlogList 
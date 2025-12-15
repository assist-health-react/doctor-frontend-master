import { useState } from 'react'
import { FaSearch, FaPlus } from 'react-icons/fa'
import BlogDetailModal from './BlogDetailModal'
import AddBlogModal from './AddBlogModal'
import BlogList from './BlogList'

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [activeTab, setActiveTab] = useState('published')

  const tabs = [
    { id: 'my-blogs', name: 'My Blogs' },
    { id: 'drafts', name: 'Drafts' },
    { id: 'published', name: 'Published' }
  ]

  return (
    <div className="p-4">
      {/* Header with search and add button */}
      <div className="flex justify-end items-center mb-6">
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
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Blog List */}
      <BlogList 
        onBlogClick={setSelectedBlog}
        activeTab={activeTab}
        searchTerm={searchTerm}
      />

      {/* Modals */}
      {showAddForm && (
        <AddBlogModal onClose={() => setShowAddForm(false)} />
      )}

      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </div>
  )
}

export default BlogsPage 
const BlogCard = ({ blog, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(blog)}
    >
      <img 
        src={typeof blog.image === 'string' ? blog.image : URL.createObjectURL(blog.image)} 
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>{blog.readTime} min read</span>
          <StatusBadge status={blog.status} />
          <TagsList tags={blog.tags} />
        </div>
      </div>
    </div>
  )
}

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    status === 'published' 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  }`}>
    {status === 'published' ? 'Published' : 'Draft'}
  </span>
)

const TagsList = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags && tags.map((tag, index) => (
      <span
        key={index}
        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
      >
        {tag}
      </span>
    ))}
  </div>
)

export default BlogCard 
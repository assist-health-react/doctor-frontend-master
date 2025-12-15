import { useState } from 'react'
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa'

const NoteActions = ({ note, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState(note)

  const handleEdit = () => {
    onEdit(editedNote)
    setIsEditing(false)
  }

  return (
    <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Note</h4>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <p className="text-gray-600 mb-3">{note}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-2 py-1 text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Edit Note</h4>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <textarea
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            rows="3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Confirm Delete</h4>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteActions 
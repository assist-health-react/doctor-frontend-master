import { useState } from 'react';
import { FaPlus, FaEdit, FaTimes, FaTrash, FaSave } from 'react-icons/fa';
import { membersService } from '../../services/membersService';

const Notes = ({ member, showCount = false }) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notes function
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await membersService.getMemberNotes(member.id || member._id);
      if (response.status === 'success') {
        setNotes(response.data);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for opening notes modal
  const handleOpenNotes = async (e) => {
    e.stopPropagation();
    setShowNotesModal(true);
    await fetchNotes();
  };

  // Handler for adding a new note
  const handleAddNote = () => {
    setEditingNoteId('new');
    setEditText('');
  };

  // Handler for starting to edit a note
  const handleEditStart = (note) => {
    setEditingNoteId(note._id);
    setEditText(note.note);
  };

  // Handler for saving a note
  const handleSaveNote = async (noteId) => {
    if (!editText.trim()) {
      if (noteId !== 'new') {
        await handleDeleteNote(noteId);
      }
      setEditingNoteId(null);
      return;
    }

    try {
      setError(null);
      if (noteId === 'new') {
        await membersService.createMemberNote(member.id || member._id, editText.trim());
      } else {
        await membersService.updateMemberNote(member.id || member._id, noteId, editText.trim());
      }
      setEditingNoteId(null);
      await fetchNotes();
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message || 'Failed to save note');
    }
  };

  // Handler for deleting a note
  const handleDeleteNote = async (noteId) => {
    try {
      setError(null);
      await membersService.deleteMemberNote(member.id || member._id, noteId);
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message || 'Failed to delete note');
    }
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditText('');
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setShowNotesModal(false);
    setEditingNoteId(null);
    setEditText('');
    setError(null);
  };

  return (
    <>
      {/* Notes Display in Table */}
      <div className="flex items-center gap-2 justify-center">
        <button 
          onClick={handleOpenNotes}
          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
          disabled={isLoading}
        >
          <FaEdit className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </button>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800">Notes</h3>
                <span className="text-sm text-gray-500">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                  title="Add Note"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center">
                <span className="flex-1">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Notes Content */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notes.length === 0 && !editingNoteId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No notes yet</p>
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add your first note
                  </button>
                </div>
              ) : (
                <>
                  {/* New Note Form */}
                  {editingNoteId === 'new' && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows="3"
                        autoFocus
                        placeholder="Type your note here..."
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote('new')}
                          className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <FaSave className="w-3.5 h-3.5" />
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Notes */}
                  {notes.map(note => (
                    <div 
                      key={note._id} 
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      {editingNoteId === note._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            rows="3"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(note._id)}
                              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FaSave className="w-3.5 h-3.5" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.note}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              {new Date(note.createdAt).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditStart(note)}
                                className="p-1.5 text-gray-400 hover:text-blue-500 rounded transition-colors"
                                title="Edit Note"
                              >
                                <FaEdit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                                title="Delete Note"
                              >
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes; 
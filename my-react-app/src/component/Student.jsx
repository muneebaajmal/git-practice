
import { useState, useEffect } from 'react';
import API from './api';

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET: Fetch students
  const getStudents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.log('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // POST: Add student
  const addStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/students', formData);
      setStudents([...students, response.data]);
      resetForm();
    } catch (error) {
      console.log('Error adding student:', error);
    }
  };

  // Load student data into form
  const editStudent = (student) => {
    setEditingId(student.id);

    setFormData({
      name: student.name || '',
      email: student.email || '',
      course: student.course || ''
    });
  };

  // PUT: Update student
  const updateStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await API.put(
        `/students/${editingId}`,
        formData
      );

      setStudents(
        students.map((student) =>
          student.id === editingId ? response.data : student
        )
      );

      resetForm();
    } catch (error) {
      console.log('Error updating student:', error);
    }
  };

  // DELETE: Delete student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);

      setStudents(
        students.filter((student) => student.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.log('Error deleting student:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      course: ''
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Management
            </h1>
            <p className="mt-2 text-slate-500">
              Manage your students in one place.
            </p>
          </div>

          <div className="rounded-xl bg-indigo-600 px-6 py-3 text-white shadow">
            <p className="text-sm">Total Students</p>
            <p className="text-2xl font-bold">{students.length}</p>
          </div>
        </div>

        {/* Form */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>

          <form
            onSubmit={editingId ? updateStudent : addStudent}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="flex flex-wrap gap-3 md:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                {editingId ? 'Save Changes' : 'Add Student'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Students Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800">
              All Students
            </h2>
          </div>

          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading students...
            </p>
          ) : students.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No students found. Add your first student!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {student.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {student.email}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {student.course}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editStudent(student)}
                            className="rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Students;

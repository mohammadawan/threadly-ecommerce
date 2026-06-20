import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../api/userApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    setLoading(true);
    getUsers({ page, limit: 15 })
      .then((res) => { setUsers(res.data.users); setPages(res.data.pages); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      {loading ? <Loader /> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                <th className="text-left p-4 font-semibold text-gray-600">Joined</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(u._id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-black text-white border-black' : 'border-gray-300'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPage;

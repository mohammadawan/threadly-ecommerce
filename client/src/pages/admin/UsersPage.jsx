import { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUserRole } from '../../api/userApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('customer');

  const load = () => {
    setLoading(true);
    getUsers({ limit: 100 })
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

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

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Make this user a ${newRole}?`)) return;
    try {
      await updateUserRole(id, newRole);
      toast.success(`User is now ${newRole}`);
      load();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const customers = users.filter((u) => u.role === 'customer');
  const admins = users.filter((u) => u.role === 'admin');
  const filtered = tab === 'customer' ? customers : admins;

  const UserTable = ({ list }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">Name</th>
            <th className="text-left p-4 font-semibold text-gray-600">Email</th>
            <th className="text-left p-4 font-semibold text-gray-600">Role</th>
            <th className="text-left p-4 font-semibold text-gray-600">Joined</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {list.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="p-4 font-medium">{u.name}</td>
              <td className="p-4 text-gray-600">{u.email}</td>
              <td className="p-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {u.role}
                </span>
              </td>
              <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    className={`text-xs px-3 py-1 border rounded-lg ${u.role === 'admin' ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                  >
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && (
        <p className="text-center text-gray-400 py-10">No {tab === 'customer' ? 'customers' : 'admins'} yet</p>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab('customer')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'customer' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Customers
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{customers.length}</span>
        </button>
        <button
          onClick={() => setTab('admin')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'admin' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Admins
          <span className="ml-2 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{admins.length}</span>
        </button>
      </div>

      {loading ? <Loader /> : <UserTable list={filtered} />}
    </div>
  );
};

export default UsersPage;

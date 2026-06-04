import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', companyName: '', status: 'New', notes: ''
  });

  // 1. READ (Get all leads)
  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. CREATE (Add a new lead)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leads', formData);
      setFormData({ name: '', email: '', phone: '', companyName: '', status: 'New', notes: '' });
      fetchLeads(); // Refresh table
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead.");
    }
  };

  // 3. UPDATE (Change lead status)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { status: newStatus });
      fetchLeads(); // Refresh table to reflect change
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. DELETE (Remove a lead)
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      fetchLeads(); // Refresh table
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold text-gray-800">Lead Management CRM</h1>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="border p-2 rounded focus:outline-blue-500" />
            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="border p-2 rounded focus:outline-blue-500" />
            <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="border p-2 rounded focus:outline-blue-500" />
            <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="border p-2 rounded focus:outline-blue-500" />
            <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded focus:outline-blue-500">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
            <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notes (Optional)" className="border p-2 rounded focus:outline-blue-500" />
            <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
              Save Lead
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500">Loading leads...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No leads found. Add one above!</td></tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Interactive Status Dropdown */}
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead._id, e.target.value)}
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full cursor-pointer focus:outline-none appearance-none text-center
                              ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                              ${lead.status === 'Converted' ? 'bg-green-100 text-green-800' : ''}
                              ${lead.status === 'Lost' ? 'bg-red-100 text-red-800' : ''}
                              ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' : ''}
                            `}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => deleteLead(lead._id)} className="text-red-500 hover:text-red-700 font-semibold">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
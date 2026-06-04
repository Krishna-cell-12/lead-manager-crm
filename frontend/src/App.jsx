import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New States for Day 3 Features
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', companyName: '', status: 'New', notes: ''
  });

  // 1. READ & SEARCH
  const fetchLeads = async (query = '') => {
    try {
      // If there's a search query, append it to the URL (hits the backend search logic built on Day 1)
      const url = query 
        ? `https://lead-manager-crm-3pdt.onrender.com/api/leads?search=${query}` 
        : 'https://lead-manager-crm-3pdt.onrender.com/api/leads';
        
      const response = await axios.get(url);
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

  // Handle Search Input (Pressing Enter or clicking Search)
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(searchQuery);
  };

  // Form Input Handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Setup the form for Editing
  const handleEditClick = (lead) => {
    setEditingId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.companyName,
      status: lead.status,
      notes: lead.notes
    });
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', companyName: '', status: 'New', notes: '' });
  };

  // 2. CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // If editingId exists, we UPDATE
        await axios.put(`https://lead-manager-crm-3pdt.onrender.com/api/leads/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Otherwise, we CREATE
        await axios.post('https://lead-manager-crm-3pdt.onrender.com/api/leads', formData);
      }
      
      // Clear form and refresh table
      setFormData({ name: '', email: '', phone: '', companyName: '', status: 'New', notes: '' });
      fetchLeads(searchQuery); 
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to save lead.");
    }
  };

  // 3. UPDATE STATUS ONLY (From Table)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://lead-manager-crm-3pdt.onrender.com/api/leads/${id}`, { status: newStatus });
      fetchLeads(searchQuery); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. DELETE
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`https://lead-manager-crm-3pdt.onrender.com/api/leads/${id}`);
      fetchLeads(searchQuery);
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // Derived Statistics (Calculated instantly on the frontend)
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  const activeLeads = totalLeads - convertedLeads - lostLeads;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <h1 className="text-3xl font-bold text-gray-800">Lead Management CRM</h1>

        {/* 🚀 NEW: Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold">Total Leads</h3>
            <p className="text-2xl font-bold text-gray-800">{totalLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold">Active Pipeline</h3>
            <p className="text-2xl font-bold text-gray-800">{activeLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold">Converted</h3>
            <p className="text-2xl font-bold text-gray-800">{convertedLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-semibold">Lost</h3>
            <p className="text-2xl font-bold text-gray-800">{lostLeads}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? '✏️ Edit Lead Details' : '➕ Add New Lead'}
          </h2>
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
            
            <div className="col-span-1 md:col-span-2 flex gap-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                {editingId ? 'Update Lead' : 'Save Lead'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Table & Search Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          
          {/* 🚀 NEW: Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or company..." 
                className="flex-1 border p-2 rounded focus:outline-blue-500"
              />
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
                Search
              </button>
              <button type="button" onClick={() => { setSearchQuery(''); fetchLeads(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
                Clear
              </button>
            </form>
          </div>

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
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No leads found.</td></tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          {/* 🚀 NEW: Edit Button */}
                          <button onClick={() => handleEditClick(lead)} className="text-blue-500 hover:text-blue-700 font-semibold">
                            Edit
                          </button>
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
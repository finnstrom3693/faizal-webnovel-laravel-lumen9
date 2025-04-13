import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const baseURL = process.env.REACT_APP_BASE_URL;

const InviteCodesPage = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCode, setNewCode] = useState(null);
  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [useCodeInput, setUseCodeInput] = useState('');
  const [useCodeResult, setUseCodeResult] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { state: { from: '/admin/invites-code' } });
    }
  }, [navigate]);

  // Fetch all invite codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/invite-codes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCodes(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invite codes:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch invite codes. Please check your connection and try again.'
      );
      setCodes([]); // Ensure codes is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Generate new invite code
  const generateCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/invite-codes`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewCode(response.data.code);
      fetchCodes(); // Refresh the list
      setError(null);
    } catch (err) {
      console.error("Error generating invite code:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to generate invite code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Validate a code
  const validateCode = async () => {
    if (!validationCode.trim()) {
      setValidationResult('Please enter a code to validate');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/invite-codes/validate/${validationCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setValidationResult(response.data.message);
      setError(null);
    } catch (err) {
      console.error("Error validating code:", err);
      setValidationResult(
        err.response?.data?.message || 
        err.message || 
        'Validation failed. Please check the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Use a code
  const useCode = async () => {
    if (!useCodeInput.trim()) {
      setUseCodeResult('Please enter a code to use');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/invite-codes/use/${useCodeInput}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUseCodeResult(response.data.message);
      fetchCodes(); // Refresh the list
      setError(null);
    } catch (err) {
      console.error("Error using code:", err);
      setUseCodeResult(
        err.response?.data?.message || 
        err.message || 
        'Failed to use code. Please check the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load codes on component mount
  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="invites-code" />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">Invite Codes Management</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
              <button
                onClick={fetchCodes}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Generate New Code Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Generate New Invite Code</h2>
            <button
              onClick={generateCode}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>
            
            {newCode && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">New Code Generated:</p>
                <p className="font-mono text-lg">{newCode}</p>
              </div>
            )}
          </div>
          
          {/* Validate Code Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Validate Invite Code</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                placeholder="Enter code to validate"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={validateCode}
                disabled={loading || !validationCode.trim()}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? 'Validating...' : 'Validate'}
              </button>
            </div>
            
            {validationResult && (
              <div className={`mt-4 p-3 rounded ${
                validationResult.includes('valid') 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              }`}>
                {validationResult}
              </div>
            )}
          </div>
          
          {/* Use Code Section */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Use Invite Code</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={useCodeInput}
                onChange={(e) => setUseCodeInput(e.target.value)}
                placeholder="Enter code to mark as used"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={useCode}
                disabled={loading || !useCodeInput.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Use Code'}
              </button>
            </div>
            
            {useCodeResult && (
              <div className={`mt-4 p-3 rounded ${
                useCodeResult.includes('success') 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              }`}>
                {useCodeResult}
              </div>
            )}
          </div>
          
          {/* List of All Codes */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">All Invite Codes</h2>
            
            {loading && codes.length === 0 ? (
              <div className="text-center py-4 text-gray-600">Loading invite codes...</div>
            ) : codes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Code</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Used At</th>
                      <th className="py-2 px-4 border-b">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codes.map((code) => (
                      <tr key={code.id} className={code.is_used ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border-b font-mono">{code.code}</td>
                        <td className="py-2 px-4 border-b">
                          {code.is_used ? (
                            <span className="text-red-600">Used</span>
                          ) : (
                            <span className="text-green-600">Available</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {code.used_at ? new Date(code.used_at).toLocaleString() : '-'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(code.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-600">No invite codes found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteCodesPage;
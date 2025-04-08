import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InviteCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCode, setNewCode] = useState(null);
  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [useCodeInput, setUseCodeInput] = useState('');
  const [useCodeResult, setUseCodeResult] = useState(null);

  // Fetch all invite codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/invite-codes');
      setCodes(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch invite codes');
    } finally {
      setLoading(false);
    }
  };

  // Generate new invite code
  const generateCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/invite-codes');
      setNewCode(response.data.code);
      fetchCodes(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invite code');
    } finally {
      setLoading(false);
    }
  };

  // Validate a code
  const validateCode = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/invite-codes/validate/${validationCode}`);
      setValidationResult(response.data.message);
      setError(null);
    } catch (err) {
      setValidationResult(err.response?.data?.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  // Use a code
  const useCode = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/invite-codes/use/${useCodeInput}`);
      setUseCodeResult(response.data.message);
      fetchCodes(); // Refresh the list
      setError(null);
    } catch (err) {
      setUseCodeResult(err.response?.data?.message || 'Failed to use code');
    } finally {
      setLoading(false);
    }
  };

  // Load codes on component mount
  useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Invite Codes Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Generate New Code Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Generate New Invite Code</h2>
        <button
          onClick={generateCode}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
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
            disabled={loading || !validationCode}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
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
            disabled={loading || !useCodeInput}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">All Invite Codes</h2>
        
        {loading && codes.length === 0 ? (
          <p>Loading codes...</p>
        ) : (
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
                  <tr key={code.id} className={code.is_used ? 'bg-gray-100' : ''}>
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
        )}
      </div>
    </div>
  );
};

export default InviteCodesPage;
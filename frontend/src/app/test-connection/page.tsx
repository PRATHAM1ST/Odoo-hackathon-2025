'use client';

import { useEffect, useState } from 'react';
import { checkApiHealth, fetchUsers } from '@/lib/api';

export default function TestConnectionPage() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'failed'>('loading');
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test API health
      const isHealthy = await checkApiHealth();
      
      if (isHealthy) {
        setApiStatus('connected');
        
        // Try to fetch users
        const usersResponse = await fetchUsers({ limit: 5 });
        
        if ('data' in usersResponse) {
          setUsers(usersResponse.data);
        } else {
          setError(usersResponse.message);
        }
      } else {
        setApiStatus('failed');
        setError('Backend API is not responding');
      }
    } catch (err) {
      setApiStatus('failed');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>
        
        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <div className="flex items-center gap-3">
            <div 
              className={`w-4 h-4 rounded-full ${
                apiStatus === 'loading' ? 'bg-yellow-500' :
                apiStatus === 'connected' ? 'bg-green-500' :
                'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {apiStatus === 'loading' ? 'Testing connection...' :
               apiStatus === 'connected' ? 'Connected to backend' :
               'Failed to connect to backend'}
            </span>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">API Base URL:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}
              </code>
            </div>
            <div>
              <span className="font-medium">Environment:</span> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                {process.env.NEXT_PUBLIC_APP_ENV || 'development'}
              </code>
            </div>
          </div>
        </div>

        {/* Users Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Users Data</h2>
          
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {user.name || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {user.email || 'No email'}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {user.location || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Rating:</span> {user.rating || 0}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Skills Offered:</span> {user.skillsOffered?.map((skill: any) => skill.name).join(', ') || 'None'}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Skills Seeking:</span> {user.skillsSeeking?.map((skill: any) => skill.name).join(', ') || 'None'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {apiStatus === 'connected' ? 'No users found in database' : 'Connect to backend to see users'}
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="mt-6 flex gap-4">
          <button 
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
          
          <a 
            href="http://localhost:8000/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Open API Docs
          </a>
        </div>
      </div>
    </div>
  );
}

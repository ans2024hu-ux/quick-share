'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Select a file first!');
    setStatus('Uploading safely to cloud...');
    
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    
    if (data.code) {
      setGeneratedCode(data.code);
      setStatus('');
    } else {
      setStatus('Upload failed.');
    }
  };

  const handleDownload = async () => {
    if (!code) return alert('Enter a code!');
    setStatus('Looking up file...');

    const res = await fetch(`/api/download?code=${code}`);
    const data = await res.json();

    if (data.error) {
      setStatus(data.error);
    } else {
      setStatus('File found! Downloading...');
      window.location.href = data.url; // Triggers the file download directly
    }
  };

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#0070f3' }}>Anonymous File Drop</h1>
        <p style={{ color: '#888' }}>No logins. No tracking. Just instant sharing.</p>
        
        {status && <p style={{ padding: '10px', background: '#222', borderRadius: '5px' }}>{status}</p>}

        {/* UPLOAD CONTAINER */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #333' }}>
          <h3>Upload a File</h3>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ margin: '1rem 0', display: 'block', width: '100%' }} />
          <button onClick={handleUpload} style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Get Share Code</button>
          
          {generatedCode && (
            <div style={{ marginTop: '1.5rem', background: '#002040', padding: '10px', borderRadius: '5px' }}>
              <p style={{ margin: 0 }}>Your Download Code:</p>
              <h2 style={{ fontSize: '2.5rem', margin: '5px 0', letterSpacing: '2px', color: '#38bdf8' }}>{generatedCode}</h2>
            </div>
          )}
        </div>

        {/* DOWNLOAD CONTAINER */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Download a File</h3>
          <input type="text" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '10px', borderRadius: '5px', width: '95%', textAlign: 'center', fontSize: '1.2rem', margin: '1rem 0' }} />
          <button onClick={handleDownload} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Download</button>
        </div>
      </div>
    </main>
  );
}

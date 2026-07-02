import React, { useState, useEffect, useContext } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';

const Repository = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [tagQuery, setTagQuery] = useState('');

    // Upload Form States (Students)
    const [uploadData, setUploadData] = useState({
        title: '',
        courseCode: '',
        department: 'Computer Science'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (deptFilter !== 'All') params.department = deptFilter;
            // Let search param cover general matches on client query search
            const res = await api.get('/resources', { params });
            setResources(res.data);
        } catch (error) {
            console.error('Failed to sync repository files:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [deptFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchResources();
    };

    const handleUploadInputChange = (e) => {
        setUploadData({ ...uploadData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const formData = new FormData();
            formData.append('title', uploadData.title);
            formData.append('courseCode', uploadData.courseCode);
            formData.append('department', uploadData.department);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await api.post('/resources', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // If the upload passed through but was flagged and marked rejected by the Verification Bot:
            if (res.data.resource && res.data.resource.approvalStatus === 'rejected') {
                setUploadError(res.data.message || 'File verification rejected by Bot Scanner');
            } else {
                setUploadSuccess('File uploaded and programmatically approved by bot scanner successfully.');
                setResources([res.data, ...resources]); // Insert new resource record

                // Reset Upload fields
                setUploadData({
                    title: '',
                    courseCode: '',
                    department: user?.department || 'Computer Science'
                });
                setSelectedFile(null);
                const fileInput = document.getElementById('repository-file-input');
                if (fileInput) fileInput.value = '';
            }

        } catch (error) {
            setUploadError(error.response?.data?.message || 'File upload pipeline disrupted');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Confirm catalog record deletion?')) return;
        try {
            await api.delete(`/resources/${resourceId}`);
            setResources(resources.filter((res) => res._id !== resourceId));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to remove resource');
        }
    };

    const canUpload = !!user; // Any authenticated student is allowed to upload lecture notes or past papers

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Academic Repository</h2>
                <p style={{ margin: 0, color: '#64748b' }}>Index of student lecture notes, past exams, and academic study aids.</p>
            </div>

            {/* Query Search Panel */}
            <form onSubmit={handleSearchSubmit} style={{
                display: 'flex',
                gap: '12px',
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: 2, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Search term</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resource titles or course codes..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: '500' }}>Department Filter</label>
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', height: '37px' }}
                    >
                        <option value="All">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="General">General</option>
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: '#1e293b',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        height: '37px'
                    }}
                >
                    Search
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: canUpload ? '3fr 2fr' : '1fr', gap: '30px', alignItems: 'start' }}>
                {/* Left: Resources catalogs */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '16px' }}>Approved Study Materials</h3>
                    {loading ? (
                        <div style={{ fontSize: '14px', color: '#64748b' }}>Searching folders...</div>
                    ) : resources.length === 0 ? (
                        <div style={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                            No approved resource documents found.
                        </div>
                    ) : (
                        resources.map((res) => (
                            <ResourceCard
                                key={res._id}
                                resource={res}
                                onDelete={res.uploadedBy?._id === user?._id || res.uploadedBy === user?._id ? handleDeleteResource : null}
                            />
                        ))
                    )}
                </div>

                {/* Right: Upload Form */}
                {canUpload && (
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b', fontWeight: '600' }}>Contribute Study Material</h3>

                        {uploadError && (
                            <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                                {uploadError}
                            </div>
                        )}

                        {uploadSuccess && (
                            <div style={{ padding: '10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                                {uploadSuccess}
                            </div>
                        )}

                        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>Resource Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={uploadData.title}
                                    onChange={handleUploadInputChange}
                                    placeholder="e.g. Past Questions Pack"
                                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>Course Code</label>
                                <input
                                    type="text"
                                    name="courseCode"
                                    required
                                    placeholder="e.g. CSC401"
                                    value={uploadData.courseCode}
                                    onChange={handleUploadInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>Target Academic Department</label>
                                <select
                                    name="department"
                                    value={uploadData.department}
                                    onChange={handleUploadInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                >
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Business Administration">Business Administration</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>Upload file (PDF, DOC, DOCX only)</label>
                                <input
                                    type="file"
                                    id="repository-file-input"
                                    onChange={handleFileChange}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUploading}
                                style={{
                                    backgroundColor: '#2563eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    marginTop: '8px',
                                    opacity: isUploading ? 0.7 : 1
                                }}
                            >
                                {isUploading ? 'Scanning & Uploading...' : 'Upload & Verify'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Repository;

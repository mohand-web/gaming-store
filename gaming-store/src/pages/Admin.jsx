import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Admin({ isDarkMode }) {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '', stock: 10 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [dbCategories, setDbCategories] = useState([]);
    const [newCatName, setNewCatName] = useState("");
    const [editingCatId, setEditingCatId] = useState(null);
    const [editingCatName, setEditingCatName] = useState("");

    const API_URL = "http://localhost:5000";

    const fetchData = async () => {
        try {
            const prodRes = await fetch(`${API_URL}/api/products`);
            const prodData = await prodRes.json();
            setProducts(prodData);

            const userRes = await fetch(`${API_URL}/api/users`);
            const userData = await userRes.json();
            setUsers(userData);

            const catRes = await fetch(`${API_URL}/api/categories`);
            const catData = await catRes.json();
            setDbCategories(catData);

            if (catData.length > 0 && !newProduct.category) {
                setNewProduct(prev => ({ ...prev, category: catData[0].name }));
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName })
            });
            if (res.ok) {
                setNewCatName("");
                fetchData();
                Swal.fire('Success', 'Category Added! ✅', 'success');
            }
        } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
    };

    const handleUpdateCategory = async (id) => {
        if (!editingCatName.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingCatName })
            });
            if (res.ok) {
                setEditingCatId(null);
                setEditingCatName("");
                fetchData();
                Swal.fire('Updated!', 'Category renamed successfully', 'success');
            }
        } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
    };

    const handleDeleteCategory = async (id, name) => {
        const result = await Swal.fire({
            title: `Delete ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/api/categories/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchData();
                    Swal.fire('Deleted!', 'Category removed.', 'success');
                }
            } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
        }
    };

    const handleRoleChange = async (targetUserId, newRole) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/update-role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminEmail: currentUser.email,
                    targetUserId: targetUserId,
                    newRole: newRole
                })
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire('Success', data.message, 'success');
                setUsers(users.map(u => u.id === targetUserId ? { ...u, role: newRole } : u));
            }
        } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
    };

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
        if (selectedFile) formData.append('image', selectedFile);

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/api/products/${editId}` : `${API_URL}/api/products`;

        try {
            const res = await fetch(url, { method, body: formData });
            if (res.ok) {
                Swal.fire('Done', isEditing ? 'Updated' : 'Added', 'success');
                resetForm();
                fetchData();
            }
        } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewProduct({ name: '', price: '', description: '', category: dbCategories[0]?.name || '', stock: 10 });
        setPreview(null);
        setSelectedFile(null);
    };

    const handleEdit = (p) => {
        setIsEditing(true);
        setEditId(p.id);
        setNewProduct({ name: p.name, price: p.price, description: p.description, category: p.category, stock: p.stock });
        setPreview(`${API_URL}${p.image_url}`);
        window.scrollTo(0, 0);
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Delete product?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire('Deleted!', 'Product removed.', 'success');
                    fetchData();
                }
            } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
        }
    };

    const handleDeleteUser = (userId, userEmail) => {
        if (userEmail.toLowerCase() === 'mohand00055k@gmail.com') {
            Swal.fire('Error', 'You cannot delete yourself!', 'error');
            return;
        }
        Swal.fire({
            title: 'Delete user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_URL}/api/users/${userId}?adminEmail=${currentUser.email}`, { method: 'DELETE' });
                    if (res.ok) {
                        fetchData();
                        Swal.fire('Deleted!', 'User removed.', 'success');
                    }
                } catch (err) { Swal.fire('Error', 'Connection failed', 'error'); }
            }
        });
    };

    const themeClass = isDarkMode ? 'bg-dark text-white' : 'bg-white text-dark';
    const inputClass = isDarkMode ? 'bg-secondary text-white border-0' : 'bg-white text-dark';

    return (
        <div className={`container-fluid py-5 mt-5 ${isDarkMode ? 'bg-dark min-vh-100' : ''}`}>
            <div className="container">
                <h2 className={`fw-bold mb-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}>👑 Commander Dashboard</h2>

                <div className={`card shadow-lg p-4 mb-5 border-0 rounded-4 ${themeClass}`}>
                    <h4 className="mb-4 border-bottom pb-2">Inventory Management</h4>
                    <form onSubmit={handleSave}>
                        <div className="row g-4">
                            <div className="col-lg-7">
                                <input type="text" className={`form-control mb-3 ${inputClass}`} placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                <div className="row g-2 mb-3">
                                    <div className="col-6"><input type="number" className={`form-control ${inputClass}`} placeholder="Price $" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required /></div>
                                    <div className="col-6"><input type="number" className={`form-control ${inputClass}`} placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required /></div>
                                </div>
                                <select className={`form-select mb-3 ${inputClass}`} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    {dbCategories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                <textarea className={`form-control ${inputClass}`} placeholder="Description..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} rows="3"></textarea>
                            </div>
                            <div className="col-lg-5">
                                <div className={`drop-zone rounded-4 d-flex align-items-center justify-content-center text-center p-3 ${isDragging ? 'bg-primary text-white' : isDarkMode ? 'bg-secondary' : 'bg-light border'}`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                    onClick={() => document.getElementById('fileIn').click()}
                                    style={{ height: '220px', cursor: 'pointer', border: isDarkMode ? '2px dashed #444' : '2px dashed #ccc' }}
                                >
                                    <input type="file" id="fileIn" hidden onChange={e => handleFile(e.target.files[0])} />
                                    {preview ? <img src={preview} className="h-100 rounded shadow-sm" alt="preview" /> : <div><i className="bi bi-upload fs-1"></i><p>Drag Image Here</p></div>}
                                </div>
                            </div>
                            <div className="col-12 d-flex gap-2">
                                <button type="submit" className={`btn btn-lg flex-grow-1 fw-bold ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                                    {isEditing ? 'UPDATE PRODUCT 🔄' : 'DEPLOY PRODUCT 🚀'}
                                </button>
                                {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`card shadow-lg p-4 mb-5 border-0 rounded-4 ${themeClass}`}>
                    <h4 className="mb-4 border-bottom pb-2">📂 Categories Management</h4>
                    <div className="input-group mb-4 shadow-sm">
                        <input type="text" className={`form-control ${inputClass}`} placeholder="Add new category..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                        <button className="btn btn-primary px-4 fw-bold" onClick={handleAddCategory}>Add ➕</button>
                    </div>
                    <div className="table-responsive">
                        <table className={`table align-middle ${isDarkMode ? 'table-dark' : ''}`}>
                            <thead>
                                <tr><th style={{ width: '70%' }}>Category Name</th><th className="text-center">Actions</th></tr>
                            </thead>
                            <tbody>
                                {dbCategories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>
                                            {editingCatId === cat.id ? (
                                                <input type="text" className={`form-control form-control-sm ${inputClass}`} value={editingCatName} onChange={(e) => setEditingCatName(e.target.value)} autoFocus />
                                            ) : (
                                                <span className={`badge ${isDarkMode ? 'bg-primary' : 'bg-info text-dark'} fs-6 px-3 py-2 rounded-pill shadow-sm`}>{cat.name}</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {editingCatId === cat.id ? (
                                                <div className="d-flex justify-content-center gap-1">
                                                    <button className="btn btn-sm btn-success" onClick={() => handleUpdateCategory(cat.id)}>Save</button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingCatId(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                                    >
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`card shadow-lg p-4 mb-5 border-0 rounded-4 ${themeClass}`}>
                    <h4 className="mb-4 border-bottom pb-2">User Permissions</h4>
                    <div className="table-responsive">
                        <table className={`table align-middle ${isDarkMode ? 'table-dark' : ''}`}>
                            <thead>
                                <tr><th>Username</th><th>Email</th><th>Role</th><th className="text-center">Action</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{u.role.toUpperCase()}</span></td>
                                        <td className="text-center">
                                            {currentUser?.email?.toLowerCase() === 'mohand00055k@gmail.com' ? (
                                                <div className="d-flex justify-content-center gap-2">
                                                    {u.role === 'customer' ?
                                                        <button className="btn btn-sm btn-success fw-bold" onClick={() => handleRoleChange(u.id, 'admin')}>Admin 👑</button> :
                                                        <button className="btn btn-sm btn-outline-secondary fw-bold" onClick={() => handleRoleChange(u.id, 'customer')}>Customer 👤</button>
                                                    }
                                                    <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleDeleteUser(u.id, u.email)}>🗑️</button>
                                                </div>
                                            ) : <span className="text-muted small">View Only</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`card shadow-lg p-0 border-0 rounded-4 overflow-hidden ${themeClass}`}>
                    <div className={`p-3 border-bottom ${isDarkMode ? 'bg-secondary' : 'bg-primary text-white'}`}>
                        <h4 className="mb-0">Current Inventory</h4>
                    </div>
                    <div className="table-responsive">
                        <table className={`table align-middle mb-0 ${isDarkMode ? 'table-dark' : ''}`}>
                            <thead className="text-center">
                                <tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="text-center">
                                        <td className="p-3" style={{ width: '100px' }}>
                                            <img src={`${API_URL}${p.image_url}`} alt={p.name} className="rounded-3 shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                                        </td>
                                        <td className="text-start fw-bold">{p.name}</td>
                                        <td className="text-success fw-bold">${parseFloat(p.price).toFixed(2)}</td>
                                        <td><span className={`badge rounded-pill ${isDarkMode ? 'bg-primary' : 'bg-info text-dark'} px-3 py-2 fw-bold`}>{p.stock || 0}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-warning rounded-pill px-3 me-2 fw-bold" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
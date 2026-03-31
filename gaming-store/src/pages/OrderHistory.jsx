import React from 'react';

function OrderHistory({ isDarkMode }) {
  const orders = [
    { id: '#1025', date: '2026-03-20', total: 529.98, status: 'Done' },
    { id: '#1028', date: '2026-03-25', total: 29.99, status: 'Pending' }
  ];

  const textClass = isDarkMode ? 'text-white' : 'text-dark';

  return (
    <div className="container py-5 mt-5">
      <h2 className={`fw-bold mb-4 ${textClass}`}>My Order History 🧾</h2>
      
      <div className={`card shadow-lg border-0 ${isDarkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className={`table mb-0 ${isDarkMode ? 'table-dark' : 'table-light'} align-middle`}>
              <thead className="table-primary text-uppercase">
                <tr>
                  <th className="ps-4 py-3">Order ID</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">{order.id}</td>
                    <td>{order.date}</td>
                    <td className="fw-medium">${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${order.status === 'Done' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="pe-4">
                      <button className="btn btn-outline-info btn-sm">View Details</button>
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

export default OrderHistory;
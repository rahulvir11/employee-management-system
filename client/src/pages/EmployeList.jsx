import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeTable = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employee data from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/employee');
        if (response.status === 200 && response.data.success) {
            console.log(response.data.data);
          setEmployees(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    emp.ename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.mobile.includes(searchTerm)
  );

  // Placeholder functions for edit and delete actions
  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
    navigate(`/employeeList/${id}`);
    // Navigate to edit page or open a modal
  };

  const handleDelete = async (id) => {
    try {
      const updatedEmployees = employees.filter((emp) => emp.eid !== id);
      setEmployees(updatedEmployees);
      // console.log(`Delete employee with ID: ${id}`);
      const response = await axios.delete(`http://localhost:4000/api/employee/${id}`);
      console.log(response);
      if (response.status === 201 && response.data.success) {
        toast.success(response.data.message || 'Employee deleted successfully');
      
      }
    } catch (error) {
      console.log(error);
      console.error('Error submitting data:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Server error');
    }
   
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className='flex'>
      {/* Search Input */}

      <input
        type="text"
        placeholder="Enter Search Keyword ( Name , Id , Email, MobileNo.)"
        className="border p-2 mb-4 flex-1 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <NavLink
        to="/create"
        className="bg-blue-500 hover:bg-blue-600 text-white h-fit py-2 px-5 ml-5 font-semibold rounded transition"
      >
        create emplopy
      </NavLink>
      </div>
     
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">Unique ID</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Mobile No</th>
              <th className="p-4 text-left">Designation</th>
              <th className="p-4 text-left">Gender</th>
              <th className="p-4 text-left">Course</th>
              <th className="p-4 text-left">Create Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={emp.eid} className="border-b hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  {emp.imageUrl ? (
                    <img src={`http://localhost:4000/${emp.imageUrl}`} alt={emp.ename} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="p-4">{emp.ename}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.mobile}</td>
                <td className="p-4">{emp.designation}</td>
                <td className="p-4">{emp.gender}</td>
                <td className="p-4">{emp.course}</td>
                <td className="p-4">{emp.createdate ? new Date(emp.createdate).toLocaleDateString() : '-'}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleEdit(emp.eid)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.eid)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;

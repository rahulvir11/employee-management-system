import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const EmployeeForm = ({ initialData = null, id=null }) => {
  // Initial state for the form fields
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: '',
    image: null,
  });
  const [img,setimg]=useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  // Fill the form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.ename,
        email: initialData.email,
        mobileNo: initialData.mobile,
        designation: initialData.designation,
        gender: initialData.gender,
        course: initialData.course,
        image: null, // Reset the image field when editing
      });
      setimg(initialData.imageUrl);
      setPreviewImage(initialData.image);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
   

    // Preview the uploaded image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setimg(null)
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newformData = new FormData();
      newformData.append("file", formData.image); // Get the first file from the input
      newformData.append("name", formData.name);
      newformData.append("mobileNo", formData.mobileNo);
      newformData.append("designation", formData.designation);
      newformData.append("gender", formData.gender);
      newformData.append("email", formData.email);
      newformData.append("course", formData.course);

      // Make a POST request to the backend
      let response ;
      if (id) {
        response= await axios.put(`http://localhost:4000/api/employee/${id}`, newformData);
      }else{
        response= await axios.post('http://localhost:4000/api/employee', newformData);
      }

      // Check if the request was successful
      if (response.status === 201 && response.data.success) {
        toast.success(response.data.message || 'Employee added successfully');
        navigate('/employeeList'); 
      }
    } catch (error) {
      console.log(error);
      console.error('Error submitting data:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };


  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Employee' : 'Add New Employee'}</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Mobile No</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Profile Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {img ? (
            <img src={`http://localhost:4000/${img} `} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />
            
          ):(previewImage && <img src={previewImage} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded" />)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {initialData ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

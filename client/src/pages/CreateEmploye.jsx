import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EmployeeForm from '../components/EmployeeForm';

const CreateEmploye = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employee data if an ID is present
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:4000/api/employee/${id}`)
        .then((response) => {
          if (response.data.success) {
            setInitialData(response.data.data);
          }
        })
        .catch((err) => console.error('Error fetching employee data:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <EmployeeForm initialData={initialData} id={id}/>
      )}
    </div>
  );
};

export default CreateEmploye;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getUser } from '../services/transaction';


export default function Account() {
  const navigate = useNavigate(); // Initialize navigate
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDOB] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [navigate])

  useEffect(() => {
    getUser()
      .then((res) => {
        console.log('Fetched User Data:', res); // Debugging

        // Directly use the response
        const fetchedUser = res ?? {}; // Ensure it's an object even if undefined or null

        // Update individual fields
        setFirstName(fetchedUser.first_name ?? 'Unavailable');
        setLastName(fetchedUser.last_name ?? 'Unavailable');
        setEmail(fetchedUser.email ?? 'Unavailable');
        setPassword(fetchedUser.password ?? 'Unavailable');
        setAddress(fetchedUser.address ?? 'Unavailable');
        setPhone(fetchedUser.phone ?? 'Unavailable');
        setDOB(fetchedUser.dob ?? 'Unavailable');
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data.');
      });
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleEdit = () => {
    if (isEditing) {
      if (validateForm()) {
        handleSave();
        setIsEditing(false);
      }
    }
    else {
      setIsEditing(!isEditing);
    }
  };
  function validateForm() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    let valid = true;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      valid = false;
    }
    else if (phone && !phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      valid = false;
    }
    else if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      valid = false;
    }
    else {
      setError("");
    }
    return valid;
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }
    const editData = { email, password, firstName, lastName, address, phone, dob };

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/user`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEditing(!isEditing);
      } else {
        // Handle login error (e.g., incorrect password)
        setError(data.message || 'Edit failed, please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong, please try again later.');
    }
  }

  const handleCancel = () => {
    getUser()
      .then((res) => {
        console.log('Fetched User Data:', res); // Debugging

        // Directly use the response
        const fetchedUser = res ?? {}; // Ensure it's an object even if undefined or null

        // Update individual fields
        setFirstName(fetchedUser.first_name ?? 'Unavailable');
        setLastName(fetchedUser.last_name ?? 'Unavailable');
        setEmail(fetchedUser.email ?? 'Unavailable');
        setPassword(fetchedUser.password ?? 'Unavailable');
        setAddress(fetchedUser.address ?? 'Unavailable');
        setPhone(fetchedUser.phone ?? 'Unavailable');
        setDOB(fetchedUser.dob ?? 'Unavailable');
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data.');
      });

    setIsEditing(!isEditing);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    console.log("typeof(dateVal)", typeof (dateVal))
    console.log("dateVal", dateVal);
    setDOB(dateVal);

  }
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mt-8 text-black">Account Information</h2>
      </div>
      <div className="flex flex-col items-left h-full w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-gray-100">
        <div className="flex w-full justify-end">
          <button onClick={handleEdit} className="px-2 py-1 shadow bg-gray-300 text-black rounded-md">{isEditing ? "Save" : "Edit"}</button>
        </div>
        {!isEditing ?
          <div className="mb-4">
            <div className='font-semibold text-xl'>First Name: {firstName}</div>
            <br></br>
            <div className='font-semibold text-xl'>Last Name: {lastName}</div>
            <br></br>
            <div className='font-semibold text-xl'>Email: {email}</div>
            <br></br>
            <div className='font-semibold text-xl'>Address: {address}</div>
            <br></br>
            <div className='font-semibold text-xl'>Phone Number: {phone}</div>
            <br></br>
            <div className='font-semibold text-xl'>Date of Birth: {dob}</div>
            <br></br>
            <div className="flex justify-center mt-4">
              <button onClick={handleLogOut} className="px-4 py-2 shadow bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Log Out
              </button>
            </div>
          </div>
          :
          <div className="mb-4">
            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={email}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter your new password"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={firstName}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={lastName}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={address}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={phone}
                pattern="^\d{10}$"
                title="Please Enter a valid phone number"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="DOB" className="block text-sm font-semibold text-gray-700">Date of Birth</label>
              <input
                id="DOB"
                type="date"
                value={dob}
                onChange={(e) => handleDateChange(e)}
                className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder={dob}
              />
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={handleCancel} className="px-4 py-2 shadow bg-gray-300 text-black rounded-md ">
                Cancel
              </button>
            </div>
          </div>
        }
      </div>

    </div>
  )
}
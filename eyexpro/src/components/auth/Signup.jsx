import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '../../routes/apiService';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../store/homeSlice';
import { useDispatch } from 'react-redux';

function Signup() {
  const [selectedPicture, setSelectedPicture] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handlePictureChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    setSelectedPicture(file);
    setFieldValue('profileImage', file);
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Entered Name is Invalid').required('Name is required'),
    email: Yup.string().email('Entered Email is Invalid').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    profileImage: Yup.mixed().required('Profile Image is required'),
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
    profileImage: null,
  };

  const handleSubmit = async (values) => {
    const { name, email, password, profileImage } = values;
    const res = await signupUser({ email, password, profileImg: profileImage, name });

    if (res.success) {
      if (localStorage.getItem('token')) {
         dispatch(setToken(localStorage.getItem('token')));
      } 
      console.log('User created successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--black)] bg-white dark:bg-gray-900 px-6 py-8">
      <div className="w-full max-w-md bg-slate-100 rounded-lg shadow-md dark:border dark:border-gray-700">
        <div className="p-6 md:p-8 space-y-4 md:space-y-6">
          <h1 className="text-xl text-center font-sans leading-tight tracking-tight text-black md:text-2xl dark:text-white">
            Get In Touch
          </h1>
          <h1 className="text-sm text-center font-sans leading-tight tracking-tight text-black dark:text-white">
            Sign up to your account
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={selectedPicture ? URL.createObjectURL(selectedPicture) : 'https://via.placeholder.com/150/000000/FFFFFF/?text=User'}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(event) => handlePictureChange(event, setFieldValue)}
                    />
                  </div>
                </div>
                <ErrorMessage name="profileImage" component="div" className="text-red-700 text-sm text-center" />

                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-sans text-black dark:text-white">
                    Your name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Muhammad"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-700 text-sm" />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-sans text-black dark:text-white">
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-700 text-sm" />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-sans text-black dark:text-white">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-700 text-sm" />
                </div>

                <button type="submit" className="w-full text-black bg-lime-400 hover:bg-lime-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
          <p className="text-sm font-sans text-black dark:text-gray-400">
            Have an account?{' '}
            <a onClick={() => navigate('/auth/login')} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

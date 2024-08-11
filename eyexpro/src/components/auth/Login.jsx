import React,{useState} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigation ,useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../routes/apiService';
import { setToken } from '../../store/homeSlice';
import { useSelector } from 'react-redux';
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.home.token);     
  
  const [error,setError]= useState('')
  const [errorhid,setErrorHid]= useState(false)
//   const signin = (email, password) => {
//     const credentials = { email, password };
//     loginUser(credentials).then((response) => {
//         setErrorHid(true);
//         console.log(response);
//         if(localStorage.getItem('token')){
//           dispatch(setToken(localStorage.getItem('token')));
//           navigate('/');
//         }
//     }).catch((err) => {
//         console.log(err.message);
//         setError("Invalid User Credentials");
//         setErrorHid(true);
//     });
// };
const signin = async (email, password) => {
  const credentials = { email, password };
  try {
      const response = await loginUser(credentials);
      setErrorHid(true);
      console.log(response);
      
      const token = localStorage.getItem('token');
      if (token) {
          dispatch(setToken(token));
          navigate('/');
      } else {
          // If the token is not immediately available, you might want to add a slight delay and check again.
          setTimeout(() => {
              const delayedToken = localStorage.getItem('token');
              if (delayedToken) {
                  dispatch(setToken(delayedToken));
                  }
                  if(user)
                  navigate('/');
          }, 50); // Adjust the delay as necessary
      }
  } catch (err) {
      console.log(err.message);
      setError("Invalid User Credentials");
      setErrorHid(true);
  }
};

  return (
    <div class="min-h-screen flex bg-[var(--black)] items-center justify-center bg-white dark:bg-gray-900 px-6 py-8">
    <div class="w-full max-w-md bg-slate-100 rounded-lg shadow-md dark:border dark:border-gray-700">
      <div class="p-6 md:p-8 space-y-4 md:space-y-6">
        <h1 class="text-xl text-center font-sans leading-tight tracking-tight text-black md:text-2xl dark:text-white">
          Welcome back!
        </h1>
        <h2 class="text-sm text-center font-sans leading-tight tracking-tight text-black dark:text-white">
          We're excited to see you again!
        </h2>
  
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
          })}
          onSubmit={(values) => {
            console.log({
              email: values.email,
              password: values.password,
            });
            signin(values.email, values.password);
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
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
                {errors.email && touched.email && (
                  <div className="block mb-2 text-sm font-sans text-red-700 dark:text-white">
                    {errors.email}
                  </div>
                )}
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.password && touched.password && (
                  <div className="block mb-2 text-sm font-sans text-red-700 dark:text-white">
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Field
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <label htmlFor="remember" className="ml-3 text-sm text-black dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <h1 className={`text-red-600 ${errorhid?"":"hidden"} text-center font-bold`}>{error}</h1>
              <button type="submit" className="w-full text-black hover:bg-lime-300 bg-lime-400 hover:bg-primary-700 focus:ring-4 focus:outline-none outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Sign in
              </button>
            </Form>
          )}
        </Formik>
  
        <p class="text-sm font-light text-black dark:text-gray-400">
          Don’t have an account yet? <a onClick={()=>navigate('/auth/Signup')}  class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
        </p>
  
      </div>
    </div>
  </div>
  
  )
}

export default Login

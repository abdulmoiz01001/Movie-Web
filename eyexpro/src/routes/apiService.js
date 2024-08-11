import axios from 'axios';
const api = axios.create({
    baseURL: 'https://movie-web-api-pink.vercel.app',
    withCredentials: true // Adjust the base URL if needed

});

// Frontend API function to handle user signup and set cookie
export async function signupUser(userData) {
    
  try {
      // Assuming userData is an object containing name, password, age, email, isActive, address, and profileImg
      const formData = new FormData();
      formData.append('profileImg', userData.profileImg);
      formData.append('name', userData.name);
      formData.append('password', userData.password);
      formData.append('email', userData.email);
     
    //   const response = await fetch('/signup', {
    //     method: 'POST',
    //     body: formData
    //   });
      const response = await api.post('/auth/register', formData);
      console.log(response.data);
      localStorage.setItem('token', JSON.stringify(response.data.token));
      
      if (response.statusText=="Created") {
        // Set cookie for logged-in user
         return { success: true, message: response.message };
      } else {
        return { success: false, error: response.data };
      }
    } catch (error) {
      console.error('Error signing up:', error.response.data);
      return { success: false, error: 'Failed to signup. Please try again later.' };
    }
  }
  

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        console.log("user login data ", response.data)
        localStorage.setItem('token', JSON.stringify(response.data.token));
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
export const logoutUser = async () => {
    try {
      
        console.log("working");
        localStorage.removeItem('token');
     
        const response = await api.post('/auth/logout');
        console.log(response.data);
         
    } catch (error) {
        console.error(error);
        throw error;
    }
};
// Add more API methods as needed

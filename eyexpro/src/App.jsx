// Neccessary Hooks
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from "./utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';

// All pages and components Import  for Routing system
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from './pages/home/Home';
import Details from "./pages/details/Details";
import SearchResult from './pages/searchResult/searchResult';
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/pageNotFound";

// All Routing Materials for Routing

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Logout from './components/auth/Logout';
function App() {

  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home)
  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, [])
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      // console.log(res);
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
     };
      dispatch(getApiConfiguration(url));
    });
  };

   const genresCall = async () =>{
    let promises = [];
    let endPoints = ["tv","movie"];
    let allGenres = {}

    endPoints.forEach((url)=>{
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })
    
    const data = await Promise.all(promises);
    data.map(({genres})=>{
      return genres.map((item)=>{allGenres[item.id] = item})
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/Signup' element={<Signup />} />
        <Route path='/auth/Logout' element={<Logout />} />
        <Route path='/' element={<Home />} />
        <Route path='/movie/:mediaType/:id' element={<Details />} />
        {/* <Route path='/movie/:id' element={<Details />} /> */}
        <Route path='/search/:query' element={<SearchResult />} />
        <Route path='/explore/:mediaType' element={<Explore />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )

}

export default App

import React from 'react'
import "./details.scss"
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom'
import DetailsBanner from './detailsBanner/DetailsBanner'
import Cast from './cast/Cast'
import VideosSection from './videoSection/VideoSection'
import Similar from './carousels/Similar'
import Recommendation from './carousels/Recommendation'
import { useNavigate } from 'react-router-dom'


const Details = () => {
  const navigate = useNavigate();
  const { mediaType, id} = useParams();
  const {data, loading} = useFetch(`/${mediaType}/${id}/videos`)
  const {data: credits, loading: creditsLoading} = useFetch(`/${mediaType}/${id}/credits`)
  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, navigate to the home, login, or signup route
        navigate('/auth/login'); // or '/signup' or '/'
    }
}, []); 
  return (
    <div>
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data} loading={loading} />
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  )
}

export default Details
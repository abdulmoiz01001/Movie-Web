
import React ,{useState,useEffect} from 'react'

import "./searchResult.scss"
import { useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchDataFromApi } from '../../utils/api'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import Moviecard from "../../components/movieCard/MovieCard"
import Spinner from "../../components/spinner/Spinner"
import noResults from "../../assets/no-results.png"
import { useNavigate } from 'react-router-dom'

const searchResult = () => {
  const [ data, setData ] = useState(null);
  const [ pageNum, setPageNum ] = useState(1);
  const [ loading , setLoading] = useState(false);
  const { query } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, navigate to the home, login, or signup route
        navigate('/auth/login'); // or '/signup' or '/'
    }
}, []); 

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res)=>{
      setData(res);
      setPageNum((prev)=> prev + 1);
      setLoading(false);
    })
  }

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then((res)=>{
      if(data?.results ){
        console.log(data);
        setData({...data,results: [...data?.results,...res.results]})
      }
      else{
        setData(res);
      }
      setPageNum((prev)=> prev + 1);
    })
  }

  useEffect(()=>{
   setPageNum(1);
   fetchInitialData();
  },[query])
  return (
    <div className='searchResultsPage'>{
      loading && <Spinner initial={true} />
    }
    {!loading && (
      <ContentWrapper>
        {
          data?.results?.length > 0 ? (
            <>
            <div className="pageTitle">
              {`Search ${data?.total_results > 1 ? "results " : "result"} of  '${query}'`}
            </div>
            <InfiniteScroll
            className='content'
            dataLength={data?.results?.length || []}
            next={fetchNextPageData}
            hasMore={pageNum <= data?.total_results}
            loader={<Spinner/>}
            >
              {data?.results?.map((item, index)=>{
               if(item.media_type === "person") return;
               return (
                <Moviecard key={index} data={item} fromSearch={true} />
               )
              })}
            </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">
            Sorry, Result not found !
            </span>
            )
        }
      </ContentWrapper>
    )}
    </div>
  )
}

export default searchResult 
import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '../../routes/apiService';
import { useSelector , useDispatch } from "react-redux";
import { clearToken } from "../../store/homeSlice";
import "./header.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/another logo.png";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const [token, setToken] = useState(null);
    const user = useSelector((state) => state.home.token);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    // Check for token in localStorage when the component mounts
    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));
        if (storedToken) {
            setToken(storedToken);
        }
    }, []); // Empty dependency array ensures this runs only once when the component mounts
    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));
        if (storedToken) {
            setToken(storedToken);
        }
    }, [user , token]); // Empty dependency array ensures this runs only once when the component mounts

    // Scroll to top on location change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // Update token when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedToken = JSON.parse(localStorage.getItem('token')) ?? null;
            setToken(updatedToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Handle search query submission
    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    // Open search bar
    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    // Open mobile menu
    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    // Handle navigation for movie and TV show links
    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else {
            navigate("/explore/tv");
        }
        setMobileMenu(false);
    };

    // Control navbar visibility based on scroll
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    // Handle logout action
    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token'); // Optionally remove the token from localStorage
        setToken(null);
        dispatch(clearToken());
        // if(user){
        //     dispatch(clearToken());
        //     console.log("clear")
        // }
        // navigate("/auth/login");
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView " : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="logo" />
                </div>
                <ul className="menuItems">
                    {token != null && user != null ? (
                        <button onClick={()=>handleLogout()} className="p-4 outline-none rounded bg-pink-600 text-white font-sans">Logout</button>
                    ) : (
                        <>
                            <li className="menuItem" onClick={() => navigate("/auth/login")}>Login</li>
                            <li className="p-4 select-none cursor-pointer rounded bg-pink-600 text-white font-sans" onClick={() => navigate("/auth/signup")}>Signup</li>
                        </>
                    )}
                    <li className="menuItem" onClick={() => navigationHandler("movie")}>Movies</li>
                    <li className="menuItem" onClick={() => navigationHandler("tv")}>TV Shows</li>
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? <VscChromeClose onClick={() => setMobileMenu(false)} /> : <SlMenu onClick={openMobileMenu} />}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Search for a movie or TV show..."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose onClick={() => setShowSearch(false)} />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;

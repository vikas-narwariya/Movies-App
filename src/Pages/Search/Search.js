import { Button, createMuiTheme, Tab, Tabs, TextField, ThemeProvider } from "@material-ui/core";
import { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const Search = () => {
    const [type, setType] = useState(0);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [content, setContent] = useState();
    const [numOfPages, setNumOfPages] = useState();

    const darkTheme = createMuiTheme({
        palette: {
            type:"dark",
            primary:{
            main: "#fff",
            },
        },
    });

    const fetchSearch = async () => {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
                process.env.REACT_APP_API_KEY
            }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
        );
        setContent(data.results);
        setNumOfPages(data.total_pages);
    };

    useEffect(() => {
        window.scroll(0, 0);
        fetchSearch();

        
    }, [type, page]);
    
    return (
        <div>
            
            <ThemeProvider theme={darkTheme}>
            <div style={{ display: "flex", margin: "15px 0"}}>
            <TextField
                style={{ flex: 1}}
                className="searchBox"
                label="Search"
                variant="filled"
                onChange={(e) => setSearchText(e.target.value)}
                />
                <Button variant="contained" style={{ marginLeft: 10}} onClick={fetchSearch}>
                    <SearchIcon />
                </Button>

            </div>  

            <Tabs value={type}  indicatorColor="primary" textColor="primary" onChange={(event, newValue) => {
                setType(newValue);
                setPage(1);
            }} 
                style={{ paddingBottom: 5}}
            >
                <Tab style={{ width: "50%"}} label="Search Movies" />
                <Tab style={{ width: "50%"}} label="Search TV Series" />
            </Tabs>
            </ThemeProvider>

            <div className="trending">
                {
                    content && content.map((c) => (
                        <SingleContent key={c.id} id={c.id} poster={c.poster_path} title={c.title || c.name} date={c.first_air_date || c.release_date} media_type={type ? "tv" : "movie"} vote_average={c.vote_average}/>
                    ))
                }

                {searchText && 
                ! content && 
                ( type ? <h2>No Series Found</h2> : <h2>No Movies Found</h2>)}
            </div>

            {numOfPages > 1 && (
            <CustomPagination setPage={setPage} numOfPages={numOfPages}  />
            )}
        </div>
    );
};

export default Search;

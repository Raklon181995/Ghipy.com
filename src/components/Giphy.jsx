import axios from 'axios';
// import { even } from 'check-types';
import React, {useEffect, useState} from 'react';
import Loader from "./Loader";
import NextPage from "./NextPage";

const Giphy = () => {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const[currentPage, setCurrentPage] = useState(1)
    const[itemsParPage, setItemsPerPage] = useState(10)
    const indexLitem = currentPage * itemsParPage
    const indexFitem = indexLitem - itemsParPage
    const currentItems = data.slice(indexFitem, indexLitem)

    useEffect(()=>{
        const fetchData = async () => {
            setIsError(false)
            setIsLoading(true);

            try{

                const results = await axios("https://api.giphy.com/v1/gifs/trending",{ 
                //this is asysnc call so we are using await.
                params: {
                    api_key: "l1r5eC8G0GVd8V2413t8fpKtUIRbP1ij",
                    limit: 50
                }
            });
            console.log(results);
            setData(results.data.data);

            }catch(err){
                
                setIsError(true);
                setTimeout(()=> setIsError(false), 5000);
                //this  logic to display error on display it re-render the UI and call the function...
                //Here Using setTimeout 

            }
          
         

            setIsLoading(false)
        };

        fetchData();
    }, []);

    const renderGifs = () => {
        if(isLoading){
            return <Loader />
        }

        return currentItems.map(el => {

            return (
                <div key={el.id} className="gif">
                  <img src={el.images.fixed_height.url} />
                </div>
              );
    });
       
    };

    const renderError = () => {
        if (isError) {
          return (
            <div
              className="alert alert-danger alert-dismissible fade show" role="alert">
              Unable to get Gifs, please try again after some time...
            </div>
          );
        }
      };
      const handleSearchChange = event => {
          setSearch(event.target.value);
      };
      const handleSubmit = async event => {
          event.preventDefault();
          setIsError(false);
          setIsLoading(true);

          try{
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
                params:{
                    api_key: "l1r5eC8G0GVd8V2413t8fpKtUIRbP1ij",
                    limit:10,
                    q: search
                }
            });
            setData(results.data.data);

          }catch(err){
            setIsError(true);
            setTimeout(()=> setIsError(false), 5000);
          }
          
              setIsLoading(false);
          };
          const pageSelected = pageNumber => {
            setCurrentPage(pageNumber);
          };
      

    return (
        <div className="m-2">
             {renderError()}
             <h3 className="header"> TraindingGifs.com</h3>
             <form className="form-inline justify-content-center m-3">
                 
                <input  value={search} onChange={handleSearchChange} type="text" placeholder="Search Trainding Gifs..." className="form-control" />
                <button onClick={handleSubmit} type="submit" className="btn btn-primary mx-2" >
                   Click Me
                </button>
            </form>
            
            <div className="container gifs">
                {renderGifs()}
            </div>
            <NextPage 
               pageSelected={pageSelected}
               currentPage={currentPage}
               itemsPerPage={itemsParPage}
               totalItems={data.length}
            />
        </div>

    ) 
    
};

export default Giphy;

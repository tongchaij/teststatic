import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { Gallery } from "react-grid-gallery";
import './Home.css';
import { Button } from "primereact/button"
import { InView } from "react-intersection-observer";

const Home = () => {
    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState('%20');
    const [loadAll, setLoadAll] = useState(false);

    const bdivRef = useRef(null)

    const onClickTag = (v) => {
      console.log(`onClickTag(${v})`);
      setTag(v);
      setPage(1);
      setItems([]);
      setLoadAll(false);
    }

    const clearTag = () => {
      console.log(`onClearTag()`);
      setTag("%20");
      setPage(1);
      setItems([]);
      setLoadAll(false);
    }

    const fetchMoreData = (page,tag) => {
      console.log(`fetchMoreData(${page},${tag})`);

/*      
      axios
        .get(`http://localhost:8080/pics/${page}/${tag}`)
*/
      axios
        .get(`https://testapitestapi.azurewebsites.net/pics/${page}/${tag}`)
        
        .then((response) => {
            const newData = response.data.docs.map((image) => ({
              ...image,
              customOverlay: (
                <div className="custom-overlay__caption">
                  {image.tags &&
                    image.tags.map((t, index) => (
                      <Button label={t.title} key={index} className="custom-overlay__tag" onClick={() => onClickTag(t.value)}/>
                    ))}
                </div>
              )
            }));

            setPage(page < response.data.totalPages ? page + 1 : response.data.totalPages);
            setLoadAll(page >= response.data.totalPages);
            setItems([...items, ...newData]);

            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    };
  
    const loadMore = () => {
        if (!loading && !loadAll) {
          setLoading(true);
          fetchMoreData(page, tag);
        }
//      setItems([...items, ...newData]);
//      setPage(page + 1);
    };

    useEffect(() => {
        console.log(`useEffect(${page},${tag})`);
        setLoading(true);
        fetchMoreData(page, tag);
//        setItems([...items, ...newData]);
    },[]);

    useEffect(() => {
      console.log(`useEffect(${page},${tag},${loadAll})`);
      if (!loadAll) {
        setLoading(true);
        fetchMoreData(page, tag);
      }
//        setItems([...items, ...newData]);
    },[loadAll]);

    const scrollbarVisible = () => {
      let element = bdivRef.current;
      return element ? element.scrollHeight > element.clientHeight : false;
    }

    return (
        <>
          <div className="p-4 flex justify-center w-full flex-wrap md:flex-nowrap">
              <span className="text-3xl mx-4 my-8 w-full text-nowrap min-w-xs max-w-sm md:max-w-xs md:text-wrap">Picture List : {tag=="%20" ? "" : (
                <span className="text-bold text-4xl text-blue-500">{tag} <Button label="Clear" className="h-10 px-2 text-md" onClick={clearTag} /></span>
              )}</span>
              <div className="flex-grow">
                  <Gallery images={items} enableImageSelection={false}>
                  </Gallery>
              </div>
          </div>
          <div className={scrollbarVisible() ? "h-96" : "h-[48rem]"} ref={bdivRef}/>
          <InView as="div" 
              onChange={(inView, entry) => {
                          console.log("Inview:", inView);
                          if (inView) {
                            loadMore();
                          }
                        }}>
            <h2>{loadAll ? "No More" : "Load New Images."}</h2>
          </InView>
        </>
    )
}

export default Home
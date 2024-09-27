import React, { useEffect, useState } from 'react'
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
        .get(`http://localhost:5555/pics/${page}/${tag}`)
      https://testapitestapi.azurewebsites.net/pics
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

    return (
        <>
          <div className='p-4'>
              <h1 className='text-3xl my-8'>Picture List : {tag=="%20" ? "" : (
                <span>{tag} <Button label="Clear" className="h-10 px-2 text-md" onClick={clearTag} /></span>
              )}</h1>

              <div className='size-3/12'>
                  <Gallery images={items} enableImageSelection={false}>
                  </Gallery>
              </div>
          </div>
          <div className='h-96'/>
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
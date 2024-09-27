import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'
import { Gallery, ThumbnailImageProps } from "react-grid-gallery";
import './Home.css';
import { Button } from "primereact/button"
import { images } from "../images"

const Home = () => {
    const [pics, setPics] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/pics')
            .then((response) => {
                setPics(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    },[]);

    const IMAGES = images.map((image) => ({
        ...image,
        customOverlay: (
          <div className="custom-overlay__caption">
            {image.tags &&
              image.tags.map((t, index) => (
                <Button label={t.title} key={index} className="custom-overlay__tag" onClick={() => alert(t.title)}/>
              ))}
          </div>
        )
    }));
     
    return (
        <div className='p-4'>
            <div className='flex justify-between items-center'>
            <h1 className='text-3xl my-8'>Picture List</h1>
            <Link to='/pic/create'>
                <MdOutlineAddBox className='text-sky-800 text-4xl'/>
            </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className='border border-slate-600 rounded-md'>No.</th>
                            <th className='border border-slate-600 rounded-md'>Url</th>
                            <th className='border border-slate-600 rounded-md'>Hash Tag</th>
                            <th className='border border-slate-600 rounded-md'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>

                        {pics.map((pic, index) => (
                            <tr key={pic._id} className='h-8'>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    {index + 1}
                                </td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    {pic.url}
                                </td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    {pic.hashtag}
                                </td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/pics/details/`}>
                                            <BsInfoCircle className='text-2xl text-green-800'/>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            )}

            <div className='size-3/12'>
                <Gallery images={IMAGES} enableImageSelection={false}/>
            </div>
        </div>
    )
}

export default Home
'use client';
import { useState,useEffect,useRef} from 'react';
import Image from 'next/image'
import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import LoadingPage from '../loading';

function MemeCard() {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true); // Keep track of when the memes are being fetched
    const [error, setError] = useState(null);
    const [after, setAfter] = useState(null); // Keep track of the 'after' attribute for pagination
    const isMounted = useRef(true);

    const fetchMemes = async () => {
        try {
            const response = await fetch(`https://www.reddit.com/r/memes.json?limit=100${after ? `&after=${after}` : ''}`,{cache: "force-cache"});
            const json = await response.json();
            setMemes((prevMemes) => [...prevMemes, ...json.data.children]);
            setAfter(json.data.after);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch memes. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
         if (isMounted.current) {
           fetchMemes();                   // fetch memes only once when the component is mounted
          isMounted.current = false;
         }
    }, []);

    const handleScroll = () => {         // infinite scrolling for every batch of memes
        if (
            window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight &&
            !loading
        ) {
            fetchMemes();
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    if (error) return <div className='error'>{error}</div>;   // error handling

  return (
      <>
      {loading?(
          <LoadingPage/>
      ):
      <Gallery>
          <div className='items'>
          {memes.map((meme)=>(
               <Item
                 original={meme.data.is_video?meme.data.secure_media.reddit_video.fallback_url:meme.data.url}
                 thumbnail={meme.data.thumbnail==="nsfw"?meme.data.url:meme.data.thumbnail}
                 width={meme.data.preview.images[0].source.width}
                 height={meme.data.preview.images[0].source.height}
              >
               {({ ref, open }) => (
                  <div className='elements'>
                      {meme.data.is_video?(
                          <video ref={ref} onClick={open} controls
                           priority={true}
                          >
                           <source src={meme.data.secure_media.reddit_video.fallback_url} type="video/mp4" />
                           Your browser does not support the video tag.
                         </video>
                       ):(meme.data.url.endsWith('.gif')?(
                          <img 
                            ref={ref} 
                            onClick={open} 
                            src={meme.data.url} 
                            alt={"Gif Memes"} 
                            loading='lazy'
                          />
                       ):(
                          <Image
                            ref={ref} 
                            onClick={open}
                            src={meme.data.url.endsWith('viewform')?meme.data.thumbnail:meme.data.url}
                            alt={meme.data.title}
                            fill
                            loading='eager'
                      />
                      ))}
                  </div>
               )}
              </Item>
          ))}
          </div>
          {after && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                Loading more memes🚀...
            </div>
          )}
     </Gallery>
      }
    </>
)}


export default MemeCard;
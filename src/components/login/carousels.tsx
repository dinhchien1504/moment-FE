'use client'
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const Caurousels = () => {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <Carousel activeIndex={index} onSelect={handleSelect} className='carousel-custom'>
                <Carousel.Item>
                    <img src="/images/second-slide.jpg" alt="First slide" style={{ width: "100%" }} className='img-carousel'/>
     
                </Carousel.Item>
                <Carousel.Item>
                    <img src="/images/second-slide.jpg" alt="First slide" style={{ width: "100%" }}  className='img-carousel'/>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="/images/second-slide.jpg" alt="First slide" style={{ width: "100%" }}  className='img-carousel'/>

                </Carousel.Item>
            </Carousel>
        </>
    )
}
export default Caurousels
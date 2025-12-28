import gsap from 'gsap';
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react';

const FONT_WEIGHTS = {
    subtitle:{ min: 100, max: 400, default: 100 },
    title:{ min: 400, max: 900, default: 400 }
}

const renderText = (text,className,baseWeight = 400) => {
    return [...text].map( (char, index) => (
        <span key={index} className={className} style={{fontVariationSettings: `'wght' ${baseWeight}`}}>
            {char == ' ' ? '\u00A0' : char}
        </span>
    ));
};

const setupTextHover = (container,type) => {
    if(!container) return () => {};
    const letters = container.querySelectorAll('span');
    const { min, max, default:base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, 
            {
                duration, 
                ease: 'power3.out',
                fontVariationSettings: `'wght' ${weight}`
            });
    };

    const handleMouseMove = (event) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = event.clientX - left;

        letters.forEach( (letter) => {
            const {left : l, width : w} = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2)/2000);

            animateLetter(letter, min + (max-min)*intensity);
        });
    };

    const handleMouseLeave = () => {
        letters.forEach( (letter) => {
            animateLetter(letter, base,0.3);
        });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
    };
}

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup =setupTextHover(titleRef.current, 'title');
        const subtitleCleanup =setupTextHover(subtitleRef.current, 'subtitle');
        return ()=>{
            titleCleanup();
            subtitleCleanup();
        };
    }, []);
  return (
    <section id='welcome'>
        <p ref={subtitleRef}>
            {renderText(
                "Hey, I'm Raunak!! Welcome to my", 
                "text-3xl font-georama",
                100
            )}</p>
        <h1 className='mt-7' ref={titleRef}>
            {renderText("portfolio", "text-9xl font-georama")}
        </h1>

        <div className='small-screen'>
            <p>Best viewed on a larger screen.</p>
        </div>
    </section>
  );
}

export default Welcome
import React from 'react'
import HomepageHeroGuest from '../components/HomepageHero'
import LatestArticles from '../components/LatestArticles'
import MeditationForX from '../components/Meditation'


const Home = () => {
    return (
        <div className='dark:bg-black'>
            <HomepageHeroGuest />
            <LatestArticles />
            <MeditationForX />
        </div>
    )
}

export default Home

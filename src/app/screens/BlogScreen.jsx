"use client"

import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import BlogHero from '../Components/blog/BlogHero'
import FeaturedSection from '../Components/blog/FeaturedSection'
import DiscoverSection from '../Components/blog/DiscoverSection'

const BlogScreen = () => {
    return (
        <div>
            <Navbar />
            <BlogHero/>
            <DiscoverSection/>
            <FeaturedSection/>
            <Footer />
        </div>
    )
}

export default BlogScreen
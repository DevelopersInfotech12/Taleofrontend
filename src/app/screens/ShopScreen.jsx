import React from 'react'
import ShopPage from '../Components/shop/ShopPage'
import Navbar from '../Components/Navbar'
import OtherHero from '../Components/OtherHero'
import Footer from '../Components/Footer'


const ShopScreen = () => {
    return (
        <div>
            <Navbar />
            <OtherHero
                title="Our Collections"
                subtitle="Timeless pieces for every moment"
                breadcrumb={[{ label: "Home", href: "/" }, { label: "Collections" }]}
                heroKey="shop"
            />
            <ShopPage />
            <Footer />

        </div>
    )
}

export default ShopScreen
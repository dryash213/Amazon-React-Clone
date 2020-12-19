import React from 'react'
import './Home.css'
import Product from './Product'
function Home() {
    return (
        <div className ="home">
           <div className="home__container">
               <img
                className ="home__image"
                src="https://images-eu.ssl-images-amazon.com/images/G/31/img20/Wireless/vivo/December/GW/Y30/D19383832_WL_Vivo_BAU_Dec2020_DesktopTallHero_1500x600_2._CB413165164_.jpg" 
                />
            {/* <p>I am the Home Component</p> */}

            <div className="home__row">
                {/* product */}
                <Product
                id={101}
                 title='The Chocolates' price={29.99} 
                image="https://images-eu.ssl-images-amazon.com/images/G/31/img20/Grocery/GW/Chocolates_PC_CC_379x304_V2._SY304_CB404777310_.jpg"
                rating={5}
                />
                <Product
                id={102}
                 title='The Chocolates Combo' price={292.99} 
                 image="https://images-eu.ssl-images-amazon.com/images/G/31/IN-hq/2020/img/Home_Improvement/XCM_Manual_1221849_1156007_IN_in_gw_pc_3075970_379x304_null_en_IN._SY304_CB432655439_.jpg"
                rating={3}
                />
                {/* product */}

            </div>

            
            <div className="home__row">
                {/* product */}
                <Product
                id={201}
                 title='The Chocolates' price={29.99} 
                 image="https://m.media-amazon.com/images/G/31/img19/AMS/Houseads/Laptops-Sept2019._CB436595915_.jpg"
                rating={5}
                /> 
                <Product
                id={202}
                 title='The Chocolates' price={29.99} 
                 image="https://m.media-amazon.com/images/I/41p0PLiCyeL.__AC_SY200_.jpg"
                rating={5}
                />
                 <Product
                id={203}
                 title='The Chocolates' price={29.99} 
                 image="https://images-eu.ssl-images-amazon.com/images/G/31/IMG19/Furniture/MSO/WFH_379x304._SY304_CB430182042_.jpg"

                 rating={5}
                />
                {/* product */}
                {/* product */}
            </div>
            
            <div className="home__row">
                {/* product */} 
                <Product
                id={301}
                 title='The Ayurveda' price={29.99} 
                image="https://images-eu.ssl-images-amazon.com/images/G/31/img19/Beauty/GW/desktop/Luxury-Category-card-1x._SY304_CB448731790_.jpg"
                 rating={5}
                />
            </div>
           </div>
        </div>
    );
}

export default Home

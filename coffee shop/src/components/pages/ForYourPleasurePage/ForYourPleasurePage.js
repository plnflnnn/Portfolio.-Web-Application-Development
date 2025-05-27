import { Helmet } from 'react-helmet';
import Navigator from '../commonComponents/navigator/Navigator';
import Divider from '../commonComponents/divider/Divider';
import Goods from '../commonComponents/Goods/Goods';
import Footer from '../commonComponents/footer/Footer';

import './forYourPleasure.sass';

import coffee from './img/coffee.png';

const ForYourPleasurePage = () => {

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Page with list of our coffee goods"
                    />
                <title>For your pleasure</title>
            </Helmet>
            <div className="for_your_pleasure__header">
                <div className="container">
                    <Navigator></Navigator>
                    <h1 className="for_your_pleasure__header_title">For your pleasure</h1>
                </div>
            </div>

            <div className="about_our_goods">
                <div className="container">
                    <div className="about_our_goods__wrapper">
                        <div className="about_our_goods__img">
                            <img src={coffee} alt="coffee"/>
                        </div>

                        <div className="about_our_goods__wrapper-right">

                            <div className="about_our_goods__title">
                                About our goods
                            </div>

                            <Divider></Divider>
                    
                            <div className="about_our_goods__description">
                                <div className="about_our_goods__description-text">
                                    Extremity sweetness difficult behaviour he of. On disposal of as landlord horrible. <br /> <br />
                                    Afraid at highly months do things on at. Situation recommend objection do intention
                                    so questions. 
                                    As greatly removed calling pleased improve an. Last ask him cold feel
                                    met spot shy want. Children me laughing we prospect answered followed. At it went
                                    is song that held help face.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="big_divider"></div>
                </div>
            </div>

            <Goods></Goods>
            <Footer></Footer>
        </>
    )
};

export default ForYourPleasurePage;
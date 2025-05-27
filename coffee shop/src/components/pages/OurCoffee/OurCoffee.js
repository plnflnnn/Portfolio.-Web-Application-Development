import { Helmet } from 'react-helmet';
import Navigator from '../commonComponents/navigator/Navigator';
import Footer from '../commonComponents/footer/Footer';
import Divider from '../commonComponents/divider/Divider';
import Filter from '../../filter/Filter';

import './ourCoffee.sass';

import beans from './img/our_beans.png';

const OurCoffee = () => {
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Page with list of our coffee goods"
                    />
                <title>Our coffee</title>
            </Helmet>
            <section className="our_coffee__header">
                <div className="container">
                    <Navigator></Navigator>
                    <h1 className="our_coffee__header_title">Our Coffee</h1>
                </div>
            </section>

            <div className="about_our_beans">
                <div className="container">
                    <div className="about_our_beans__wrapper">
                        <div className="about_our_beans__img">
                            <img src={beans} alt="about__beans"/>
                        </div>

                        <div className="about_our_beans__wrapper-right">
                            <div className="about_our_beans__title">
                                About our beans
                            </div>
                            
                            <Divider></Divider>
                    
                            <div className="about_our_beans__description">
                                <div className="about_our_beans__description-text">
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

            <Filter></Filter>
            <Footer></Footer>
        </>
    )
};

export default OurCoffee;

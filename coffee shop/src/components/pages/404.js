import Navigator from './commonComponents/navigator/Navigator';
import Footer from './commonComponents/footer/Footer';
import { Link } from 'react-router-dom';

const Page404 = () => {
    return(
        <>
            <div  style={{minHeight: '400px'}} className="for_your_pleasure__header">
                <div className="container">
                    <Navigator></Navigator>
                    <h1 style={{marginTop: '120px'}} className="for_your_pleasure__header_title">This page does not exist</h1>
                    <Link to='/' className="main_more" style={{width: '160px'}}>Back to main page</Link>  
                </div>
            </div>

            <Footer></Footer>
        </>
    )
};

export default Page404;
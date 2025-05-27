import Header from "../components/Header";
import slide from '../resources/grocery4.jpeg';
import Footer from "../components/Footer";

import '../output.css';

function MainPage() {
    return (
        <>
            <Header/>
            <section className="main mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="main__title">
                    Always fresh grocery for you!
                </h1>
                <img
                    className="d-block w-100"
                    src={slide}
                    alt="First slide"
                    />
            </section>
            <Footer/>
        </>
    )
}


export default MainPage;

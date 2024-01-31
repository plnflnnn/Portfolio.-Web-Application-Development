import Header from "../components/Header";
import Footer from "../components/Footer";
import '../output.css'

export default function Cancel() {
    return (
        <>
            <Header/>
                <div className="h-96 text-center pt-10 mt-0 mr-auto ml-auto pb-10">
                    <h1 className="mt-10 pt-10"> Something went wrong! </h1>
                    <p className="mt-10 pt-10"> Please, try again</p>
                </div>
            <Footer/>
        </>
    )
}
import Header from "../components/Header"
import Footer from "../components/Footer"
import '../output.css'

export default function NotFoundItems() {
    return (
        <>
        <Header/>
            <div className="h-96 text-center pt-10 mt-0 mr-auto ml-auto pb-10">
                <h1 className="mt-10 pt-10"> Items are not found </h1>
            </div>
        <Footer/>
        </>
    )
}
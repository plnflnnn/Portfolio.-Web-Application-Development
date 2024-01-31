import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCart } from "../slices/cartSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../output.css'

export default function SuccessfulPayment() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCart());

        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header/>
                <div className="h-96 text-center pt-10 mt-0 mr-auto ml-auto pb-10">
                    <h1 className="mt-10 pt-10"> Thanks for your order! </h1>
                </div>
            <Footer/>
        </>
    )
}
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoods } from '../commonComponents/Goods/goodsSlice'; 
import { useParams, Link } from 'react-router-dom';
import {selectAll, coffeeIdChanged} from '../commonComponents/Goods/goodsSlice';
import store from '../../../store';

import Loading from '../commonComponents/loading/loading';
import Navigator from '../commonComponents/navigator/Navigator';
import Divider from '../commonComponents/divider/Divider';
import Footer from '../commonComponents/footer/Footer';

import './coffeePage.sass';

import goodsImgs from '../commonComponents/Goods/goodsImgs';

const CoffeePage = () => {

    const {coffeeId} = useParams();

    const all = selectAll(store.getState());

    const coffee = all.filter(item => item.id === coffeeId);

    const coffeeLoadingStatus = useSelector(
        (state) => state.goods.goodsLoadingStatus
    );

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(coffeeIdChanged(coffeeId))
        // eslint-disable-next-line
    }, [coffeeId]);

    useEffect(() => {
        dispatch(fetchGoods());
        // eslint-disable-next-line
    }, [coffeeId]);

    if (coffeeLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (coffeeLoadingStatus === 'error') {
        return <div className='container'> <h5 style={{margin: '0 auto', paddingTop: '100px'}}> Loading error</h5> </div>
    }

    if (all.every(item => item.id !== coffeeId)) {
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
    }

    const renderPage = (arr) => {
            return arr.map(({id, src, name, country, description, price}) => {
                const img = goodsImgs(src);

                return <div key={id} className="about_it__wrapper">
                <div className="about_it__img">
                    <img src={img} alt={img}/>
                </div>

                <div className="about_it__wrapper-right">
                    <div className="about_it__title">About it</div>

                    <Divider></Divider>
        
                    <div className="about_it__description">
                        <div className="about_it__description-text">
                            <span>{name}</span>
                        </div>
                        <div className="about_it__country"><span>Country:</span> {country} </div>
                        <div className="about_it__description-text">
                            <span>Description:</span> {description}
                        </div>
                        <div className="about_it__price">Price: <span>{price}</span></div>
                    </div>
                </div>

            </div>

        });
    };

    const elements = renderPage(coffee);
    
    const name = coffee.map(({name}) => {
        return name;
    });

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`${name}`}
                    />
                <title>{`${name}`}</title>
            </Helmet>
            <section className="our_coffee__header">
                <div className="container">
                    <Navigator></Navigator>
                    <h1 className="our_coffee__header_title">Our Coffee</h1>
                </div>
            </section>

            <div className="about_it">
                <div className="container">
                    {elements}
                </div>
            </div>

            <Footer></Footer>
        </>
    )
};

export default CoffeePage;
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { fetchGoods, filteredGoodsSelector } from './goodsSlice';

import Loading from '../loading/loading';

import './goods.sass';

import goodsImgs from './goodsImgs';

const FilterGoods = () => {

    const filteredGoods = useSelector(filteredGoodsSelector);
    const goodsLoadingStatus = useSelector(
        (state) => state.goods.goodsLoadingStatus
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGoods());
        // eslint-disable-next-line
    }, []);

    if (goodsLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (goodsLoadingStatus === 'error') {
        return <div className='container'> <h5 style={{margin: '0 auto'}}> Loading error</h5> </div>
    }

    const renderGoodsList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={0} classNames='coffeeGoods'>
                    <div className='container'>
                        <h5 style={{margin: '0 auto'}}>Goods are not found</h5>
                    </div>
                </CSSTransition>
            );
        }

        return arr.map(({id, src, name, country, price}) => {
            const img = goodsImgs(src);
            return (
                <CSSTransition key={id} timeout={300} classNames='coffeeGoods'>
                    <Link to={`/${id}`} className="goods-item">
                        <div className="goods-item_wrapper"></div>
                        <div className="goods-item_img">
                            <img src={img} alt={img}/>
                        </div>
                        <div className="goods-item_title">{name}</div>
                        <div className="goods-item_country">{country}</div>
                        <div className="goods-item_price">{price}</div>
                    </Link>
                </CSSTransition>
            )
        })
    }
    

    const elements = renderGoodsList(filteredGoods);


    return (
                <TransitionGroup component='div' className="goods">
                    {elements}
                </TransitionGroup>
    )
};

export  default FilterGoods;
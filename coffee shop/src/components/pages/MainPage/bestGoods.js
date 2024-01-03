import { Link } from "react-router-dom";
import { selectAll, fetchBestGoods } from "./bestGoodsSlice";
import store from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";


import Loading from "../commonComponents/loading/loading";
import goodsImgs from "../commonComponents/Goods/goodsImgs";

const BestGoods = () => {

    const bestGoods = selectAll(store.getState());

    const {bestGoodsLoadingStatus} = useSelector(state => state.bestGoods);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBestGoods());
        // eslint-disable-next-line
    }, []);

    if (bestGoodsLoadingStatus === 'loading') {
        return <Loading></Loading>;
    } else if (bestGoodsLoadingStatus === 'error') {
        return <div className='container'> <h5 style={{margin: '0 auto'}}> Loading error</h5> </div>
    }

    const renderBestGoods = (arr) => {
        if (arr.length === 0) {
            return  <div className='container'> <h5 style={{margin: '0 auto'}}>Information is not found</h5> </div>
        }
        // eslint-disable-next-line
        return arr.map(({id, src, name, price})=> {

            const img = goodsImgs(src);

            return (
                <Link to={`/${id}`} key={id} className="best_goods-item">
                    <div className="best_goods-item_img">
                        <img src={img} alt={img}/>
                    </div>
                    <div className="best_goods-item_title">{name}</div>
                    <div className="best_goods-item_price">{price}</div>
                </Link>
            )
        });
    }

    const elements = renderBestGoods(bestGoods);

    return (
        <div className="best_goods">
            {elements}
        </div>
    )
};

export default BestGoods;
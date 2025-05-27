import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import store from '../../store';

import { filtersChanged, fetchFilters, selectAll } from './filterSlice';
import Loading from '../pages/commonComponents/loading/loading';

import FilterGoods from '../pages/commonComponents/Goods/FilterGoods';

import './filters.sass';

const Filter = () => {

    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Loading></Loading>
    } else if (filtersLoadingStatus === 'error') {
        return <div className='container'> <h5 style={{margin: '0 auto'}}> Loading error</h5> </div>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return  <div className='container'> <h5 style={{margin: '0 auto'}}>Filters are not found</h5> </div>
        }

        return arr.map(({id, name}) => {
            const btnClass = classNames('filter_button', {
                'filter_button active': name === activeFilter
            })

            return  <button 
                        className={btnClass}
                        id={id}
                        key={name}
                        onClick={() => dispatch(filtersChanged(name))}
                        >{name}</button>
        });


    }

    const elements = renderFilters(filters);

    return (
        <>
            <div className="filter">
                <div className="container">
                    <div className="seach_and_filter">
                        <div className="search_section">
                            <div className="looking_for">Looking for</div>
                            <input type="text"
                                className="search" 
                                onChange={(event) => dispatch(filtersChanged(event.target.value.toLowerCase()))}
                                placeholder="start typing here..."/>
                        </div>
            
                        <div className="filter_section">
                            <div className="or_filter">Or filter</div>
                            <div className="filter_buttons">
                                {elements}
                            </div>
                        </div>
                    </div>

                    <FilterGoods></FilterGoods>
                </div>
            </div>
        </>
    )
};

export default Filter;
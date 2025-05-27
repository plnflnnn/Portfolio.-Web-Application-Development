import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import useMarvelService from '../../services/MarvelService';
import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar()
        // eslint-disable-next-line
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const sceleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spiner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;


    return (
        <div className="char__info">
            {sceleton}
            {errorMessage}
            {spiner}
            {content}
        </div>
    )

}

const View = ({char}) => {
    const {id, name, description, thumbnail, comics} = char;

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail.indexOf('image_not_available')) {
        imgStyle = {'objectFit' : 'contain'};
    }

    return(
        <>
        <Link to={`/characters/${id}`} className="char__basics">
            <img  src={thumbnail} alt={name} style={imgStyle}/>
            <div>
                <div className="char__info-name">{name}</div>
            </div>
        </Link>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There are no comics with this character'}
                {
                    comics.map((item, i) => {
                        const comicId = item.resourceURI.match(/(\d{3,5})/gi).join('');
                        // eslint-disable-next-line
                        if(i > 9) return;
                        return (
                            <Link to={`/comics/${comicId}`} key={i} className="char__comics-item">
                                {item.name}
                            </Link>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
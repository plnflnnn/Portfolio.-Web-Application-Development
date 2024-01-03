import aromisticoJpg from '../../../../assets/aromistico.jpg';
import aromistico from '../../../../assets/aromistico.png';
import presto from '../../../../assets/presto.png';
import solimo from '../../../../assets/solimo.png';

const goodsImgs = (src) => {
    switch (src) {
        case 'solimo.png': 
            return solimo;
        case 'aromistico.png':
            return aromistico;
        case 'aromistico.jpg':
            return aromisticoJpg;
        case 'presto.png':
            return presto;
        default:
            return aromistico;
    }
};

export default goodsImgs;
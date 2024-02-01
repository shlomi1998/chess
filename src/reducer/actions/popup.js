import actionTypes from '../actionTypes';
//קידום חייל
export const openPromotion = ({rank,file,x,y}) => {
    return {
        type: actionTypes.PROMOTION_OPEN,
        payload: {rank,file,x,y}
    }
}
// סגירת חלון הפופ-אפ
export const closePopup = () => {
    return {
        type: actionTypes.PROMOTION_CLOSE,
    }
}

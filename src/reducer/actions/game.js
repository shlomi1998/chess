import actionTypes from '../actionTypes';
import { initGameState } from '../../constants';
//הצרחה 
export const updateCastling = (direction) => {
    return {
        type: actionTypes.CAN_CASTLE,
        payload: direction,//כיון לביצוע הצרחה
    }
}
//פט
export const detectStalemate = () => {
    return {
        type: actionTypes.STALEMATE,//זיהוי פט
    }
}
//תיקו
export const detectInsufficientMaterial = () => {
    return {
        type: actionTypes.INSUFFICIENT_MATERIAL,
    }
}
//זיהוי שחמט הכרזת מנצח
export const detectCheckmate = winner => {
    return {
        type: actionTypes.WIN,
        payload : winner
    }
}
//הגדרת משחק חדש
export const setupNewGame = () => {
    return {
        type: actionTypes.NEW_GAME,
        payload : initGameState
    }
}
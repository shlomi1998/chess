import { Status } from "../constants";
import actionTypes from "./actionTypes";
export const reducer = (state, action) => {

    switch (action.type) {
        case actionTypes.NEW_MOVE : {
            //עדכון מערך המיקום והתור קבלה שלו מהסטייט
            let {position,turn} = state 
            position = [
                ...position,
                action.payload.newPosition
            ]
            
            turn = turn === 'w' ? 'b' : 'w'

            return {
                ...state,
                position,
                turn,
            }
        }
        
        //רשימת מהלכים אפשריים
        case actionTypes.GENERATE_CANDIDATE_MOVES : {
            const {candidateMoves} = action.payload
            return {
                ...state,
                candidateMoves
            }
        } 
        //ניקוי רשימת המהלכים
        case actionTypes.CLEAR_CANDIDATE_MOVES : {
            return {
                ...state,
                candidateMoves : []
            }
        }
        //חייל זוכה לקידום
        case actionTypes.PROMOTION_OPEN : {
            return {
                ...state,
                status : Status.promoting,
                promotionSquare : {...action.payload},
            }
        }
        //סוגר קידום
        case actionTypes.PROMOTION_CLOSE : {
            return {
                ...state,//שמירת מצב כרגיל
                status : Status.ongoing,
                promotionSquare : null,//מכבה את הקידום
            }
        }
        //הצרחה
        case actionTypes.CAN_CASTLE : {
            let {turn,castleDirection} = state //תור וכיווני ההצרחה
        
            castleDirection[turn] = action.payload//עדכון הצרחה לפי הפעולה
            
            return {
                ...state,
                castleDirection,//עדכון
            }
        }

        //טיפול במצב של פט
        case actionTypes.STALEMATE : {
            return {
                ...state,
                status : Status.stalemate
            }
        }
        //מצב תיקו 
        case actionTypes.INSUFFICIENT_MATERIAL : {
            return {
                ...state,
                status : Status.insufficient
            }
        }
        // מצב נצחון לשחור או ללבן
        case actionTypes.WIN : {
            return {
                ...state,
                status : action.payload === 'w' ? Status.white : Status.black
            }
        }
         
        case actionTypes.NEW_GAME : {
            return {
                ...action.payload,//מצב התחלתי ברירת המחדל
            }
        }
        default ://מצב נוכחי ללא שינוי 
            return state
    }
};

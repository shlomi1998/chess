import { createPosition } from './helper'

//reducer-רשימת הסטטוסים לפונקצית ה
export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material',
}

// אוביקט אתחול מצב התחלתי של המשחק
export const initGameState = {
    position : [createPosition()],//עמדת פתיחה
    turn : 'w',//תור התחלתי
    candidateMoves : [],//מהלך ריק
    promotionSquare : null,//קידום ריק
    status : Status.ongoing,//סטטוס משחק מתנהל
    castleDirection : {//הצרחה ראשונית (castling) 
        w : 'both',
        b : 'both'
    }, 
}
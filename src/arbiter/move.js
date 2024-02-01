import { copyPosition } from "../helper"
//מיקום השחקן
export const movePiece = ({position,piece,rank,file,x,y}) => {

    const newPosition = copyPosition(position)
     
    // הצרחה ארוכה וקצרה בדיקה עם התזוזה גדולה מ1 והמלך רוצה להצריח
    if(piece.endsWith('k') && Math.abs(y - file) > 1){ // Castles
        if (y === 2){ // קצרה
            newPosition[rank][0] = ''
            newPosition[rank][3] = piece.startsWith('w') ? 'wr' : 'br'
        }
        if (y === 6){ // ארוכה
            newPosition[rank][7] = ''
            newPosition[rank][5] = piece.startsWith('w') ? 'wr' : 'br'
        }
    }
    //הזזה למקום החדש
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}
//זיהוי האכילה עם חייל
export const movePawn = ({position,piece,rank,file,x,y}) => {
    const newPosition = copyPosition(position)

    //זיהוי השחקן שצריך להסיר והיכן
    if (!newPosition[x][y] && x !== rank && y !== file) 
        newPosition[rank][y] = ''//מחיקת שחקן אויב
    //הסרה מהמקום הרגיל והוספה למקום החדש
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}
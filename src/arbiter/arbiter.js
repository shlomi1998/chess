import { areSameColorTiles, findPieceCoords } from '../helper';
import { getKnightMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves, getPawnMoves, getPawnCaptures, getCastlingMoves, getPieces, getKingPosition } from './getMoves'
import { movePiece,movePawn } from './move';

const arbiter = {
     //מהלכים רגילים
    getRegularMoves : function ({position,piece,rank,file}) {
        if (piece.endsWith('n'))//פרש
            return getKnightMoves({position,rank,file});
        if (piece.endsWith('b'))//רץ
            return getBishopMoves({position,piece,rank,file});
        if (piece.endsWith('r'))//טורה
            return getRookMoves({position,piece,rank,file});
        if (piece.endsWith('q'))//מלכה
            return getQueenMoves({position,piece,rank,file});
        if (piece.endsWith('k'))//מלך
            return getKingMoves({position,piece,rank,file});
        if (piece.endsWith('p'))//חייל
            return getPawnMoves({position,piece,rank,file})
    },
   //מהלכי התקפה שלא יגרמו לשח
    getValidMoves : function ({position,castleDirection,prevPosition,piece,rank,file}) {
        //מהלך רגיל
        let moves = this.getRegularMoves({position,piece,rank,file})
        //מהלכים רק שלא יגרמו לשח
        const notInCheckMoves = []
        //הארכה לרגלי
        if (piece.endsWith('p')){
            moves = [
                ...moves,
                ...getPawnCaptures({position,prevPosition,piece,rank,file})
            ]
        }//הארכה לחייל
        if (piece.endsWith('k'))
            moves = [
                ...moves , 
                ...getCastlingMoves({position,castleDirection,piece,rank,file})
            ]

        moves.forEach(([x,y]) => {
            const positionAfterMove = 
                this.performMove({position,piece,rank,file,x,y})

            if (!this.isPlayerInCheck({positionAfterMove, position, player : piece[0]})){
                notInCheckMoves.push([x,y])
            }
        })
        return notInCheckMoves
    },
     //בדיקת שח אם כלי המשחק חישוב כל המהלכים 
    isPlayerInCheck : function ({positionAfterMove, position, player}) {
        const enemy = player.startsWith('w') ? 'b' : 'w'
        let kingPos = getKingPosition(positionAfterMove,player)
        const enemyPieces = getPieces(positionAfterMove,enemy)

        const enemyMoves = enemyPieces.reduce((acc,p) => acc = [
            ...acc,
            ...(p.piece.endsWith('p')
            ?   getPawnCaptures({
                    position: positionAfterMove, 
                    prevPosition:  position,
                    ...p
                })
            :   this.getRegularMoves({
                    position: positionAfterMove, 
                    ...p
                })
            )
        ], [])
    
        if (enemyMoves.some (([x,y]) => kingPos[0] === x && kingPos[1] === y))
        return true

        else
        return false
    },
    //בדיקת רגלי לצעד אחד או 2
    performMove : function ({position,piece,rank,file,x,y}) {
        if (piece.endsWith('p'))
            return movePawn({position,piece,rank,file,x,y})
        else 
            return movePiece({position,piece,rank,file,x,y})
    },
    //בדיקת פט אם אין מצב שח וכל התנועות חוקיות
    isStalemate : function(position,player,castleDirection) {
        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})

        if (isInCheck)
            return false
            
        const pieces = getPieces(position,player)
        const moves = pieces.reduce((acc,p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection, 
                    ...p
                })
            )
        ], [])

        return (!isInCheck && moves.length === 0)
    },

    insufficientMaterial : function(position) {
        //מערך כל הכלים בלוח
        const pieces = 
            position.reduce((acc,rank) => 
                acc = [
                    ...acc,
                    ...rank.filter(spot => spot)
                ],[])

        // מלך מול מלך
        if (pieces.length === 2)
            return true

        //מלך ורץ או מלך ופרש נגד מלך
        if (pieces.length === 3 && pieces.some(p => p.endsWith('b') || p.endsWith('n')))
            return true

        //במצב של מלך ורץ מול מלך ורץ כששני הרצים נמצאים על משבצות מאותו הצבע
        if (pieces.length === 4 && 
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position,'wb')[0],//בדיקת קאורדינטות לרץ לבן
                findPieceCoords(position,'bb')[0]//לשחור
            )
        )
            return true

        return false
    },
     //בדיקה אם הסתיים במט
    isCheckMate : function(position,player,castleDirection) {
        //בדיקה אם שח
        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})
        //אם אין שח 
        if (!isInCheck)
            return false
            
        const pieces = getPieces(position,player)
        //חישוב כל התזוזות ע"י כל החיילים
        const moves = pieces.reduce((acc,p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection, 
                    ...p
                })
            )
        ], [])
        //השחקן המט בלי תזוזת נחזיר אמת משחק מסתיים
        return (isInCheck && moves.length === 0)
    },

   

}


export default arbiter
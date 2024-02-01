import arbiter from "./arbiter"

//מהלך טורה קבלת שורה עמודה
export const getRookMoves = ({position,piece,rank,file}) => {
    const moves = []
    //צד הכלי ומי היריב
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'
    //בדיקת כיווני בדיקה
    const direction = [
        [-1,0],//למעלה
        [1,0],//למטה
        [0,-1],//שמאלה
        [0,1],//ימינה
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 8; i++) {
            //חישוב האורדינטות
            const x = rank+(i*dir[0])
            const y = file+(i*dir[1])
            //יצאנו מהלוח סיום
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(enemy)){//כלי אויב הוספת המהלך וסיום
                moves.push ([x,y])
                break;
            }
            if(position[x][y].startsWith(us)){//כלי שלנו סיון
                break
            }//אחרת הוסף מהלך רגיל
            moves.push ([x,y])
        }
    })

    return moves
}
//פרש
export const getKnightMoves = ({position,rank,file}) => {
    const moves = []
    //צבע אויב
    const enemy = position[rank][file].startsWith('w') ? 'b' : 'w'
    //מהלכים אפשריים
    const candidates = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1],
    ]
    candidates.forEach(c => {
        const cell = position?.[rank+c[0]]?.[file+c[1]]//בדיקת תקפות מהלך
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')){//במידה ותקף הוספה למערך
            moves.push ([rank+c[0],file+c[1]])
        }
    })
    return moves//החזרת מערך המהלכים
}
//רץ
export const getBishopMoves = ({position,piece,rank,file}) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1,-1],//אלכסון שמאלה למעלה
        [-1,1],//אלכסון שמאלה למטה
        [1,-1],//אלכסון ימינה למעלה
        [1,1],//אלכסון ימינה למטה
    ]

    direction.forEach(dir => {
        for (let i = 1; i <= 8; i++) {
            const x = rank+(i*dir[0])
            const y = file+(i*dir[1])
            if(position?.[x]?.[y] === undefined)
                break
            if(position[x][y].startsWith(enemy)){
                moves.push ([x,y])
                break;
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push ([x,y])
        }
    })
    return moves
}
//מלכה
export const getQueenMoves = ({position,piece,rank,file}) => {
    const moves = [
        ...getBishopMoves({position,piece,rank,file}),
        ...getRookMoves({position,piece,rank,file})
    ]
    
    return moves
}
//מלך
export const getKingMoves = ({position,piece,rank,file}) => {
    let moves = []
    const us = piece[0]
    //כיווני תנועה
    const direction = [
        [1,-1], [1,0],  [1,1],
        [0,-1],         [0,1],
        [-1,-1],[-1,0], [-1,1],
    ]

    direction.forEach(dir => {
        const x = rank+dir[0]
        const y = file+dir[1]
        //אם תא קיים וריק או עם כלי אויב
        if(position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
        moves.push ([x,y])
    })
    return moves
}
//חייל
export const getPawnMoves = ({position,piece,rank,file}) => {

    const moves = []
    const dir = piece==='wp' ? 1 : -1// כיוון תנועה של הרגלי

    // מהלך כפול בתנועה ראשונה
    if (rank % 5 === 1){
        if (position?.[rank+dir]?.[file] === '' && position?.[rank+dir+dir]?.[file] === ''){
            moves.push ([rank+dir+dir,file])
        }
    }

    // מהלך רגיל בתא אחד 
    if (!position?.[rank+dir]?.[file]){
        moves.push ([rank+dir,file])
    }

    return moves
}
//חישוב מהלכי החייל
export const getPawnCaptures =  ({position,prevPosition,piece,rank,file}) => {
    // קביעת כיוון ואויב 
    const moves = []
    const dir = piece==='wp' ? 1 : -1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    //תפיסה לשמאל
    if (position?.[rank+dir]?.[file-1] && position[rank+dir][file-1].startsWith(enemy) ){
        moves.push ([rank+dir,file-1])
    }

    // תפיסה לימין
    if (position?.[rank+dir]?.[file+1] && position[rank+dir][file+1].startsWith(enemy) ){
        moves.push ([rank+dir,file+1])
    }
    
    // EnPassant
    // בדיקה אם אויב זז פעמיים בסיבוב קודם
    const enemyPawn = dir === 1 ? 'bp' : 'wp'
    const adjacentFiles = [file-1,file+1]
    if(prevPosition){
        if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)){
            adjacentFiles.forEach(f => {
                if (position?.[rank]?.[f] === enemyPawn && 
                    position?.[rank+dir+dir]?.[f] === '' &&
                    prevPosition?.[rank]?.[f] === '' && 
                    prevPosition?.[rank+dir+dir]?.[f] === enemyPawn){
                        moves.push ([rank+dir,f])
                    }
            })
        }
    }


    return moves
}
//הצרחה תנאים
export const getCastlingMoves = ({position,castleDirection,piece,rank,file}) => {
    const moves = []
    //האם המלך לא במיקום הנכון 
    if (file !== 4 || rank % 7 !== 0 || castleDirection === 'none'){
        return moves
    }
    if (piece.startsWith('w') ){
       //בדיקה אם הטא בשח
        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'w'
        }))
            return moves
        //בדיקה לצד שמאל
        if (['left','both'].includes(castleDirection) && 
            !position[0][3] && 
            !position[0][2] && 
            !position[0][1] &&
            position[0][0] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:3}),
                player : 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:2}),
                player : 'w'
            })){//אם הכל טוב הוספה למערך
            moves.push ([0,2])
        }//בדיקה לצד ימין
        if (['right','both'].includes(castleDirection) && 
            !position[0][5] && 
            !position[0][6] &&
            position[0][7] === 'wr' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:5}),
                player : 'w'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:0,y:6}),
                player : 'w'
            }))
            {
            moves.push ([0,6])//הכל טוב נוסיף למערך
        }
    }
    else {//בדיקת שחור אם בשח
        if (arbiter.isPlayerInCheck({
            positionAfterMove : position,
            player : 'b'
        }))
            return moves//כן נחזיר מערך ריק
        //צד שמאל בדיקה מי לשמאלי ואם המלך לא במצב שח
        if (['left','both'].includes(castleDirection) && 
            !position[7][3] && 
            !position[7][2] && 
            !position[7][1] &&
            position[7][0] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:7,y:3}),
                position : position,
                player : 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:7,y:2}),
                position : position,
                player : 'b'
            })){
            moves.push ([7,2])
        }//צד ימין בדיקה מי לימיני איזה טורה ואם המלך לא במצב שח
        if (['right','both'].includes(castleDirection) && 
            !position[7][5] && 
            !position[7][6] &&
            position[7][7] === 'br' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:7,y:5}),
                position : position,
                player : 'b'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove : arbiter.performMove({position,piece,rank,file,x:7,y:6}),
                position : position,
                player : 'b'
            })){
            moves.push ([7,6])
        }
    }

    return moves

}
//כיון ההצרחה אם ניתן לבצע על פי הכללים
export const getCastlingDirections = ({castleDirection,piece,file,rank}) => {
    file = Number(file)
    rank = Number(rank)
    const direction = castleDirection[piece[0]]
    if (piece.endsWith('k'))
        return 'none'

    if (file === 0 && rank === 0 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (file === 7 && rank === 0 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
    if (file === 0 && rank === 7 ){ 
        if (direction === 'both')
            return 'right'
        if (direction === 'left')
            return 'none'
    } 
    if (file === 7 && rank === 7 ){ 
        if (direction === 'both')
            return 'left'
        if (direction === 'right')
            return 'none'
    } 
}
//בדיקת אויב
export const getPieces = (position, enemy) => {
    const enemyPieces = []
    position.forEach((rank,x) => {
        rank.forEach((file, y) => {
            if(position[x][y].startsWith(enemy))
                enemyPieces.push({
                    piece : position[x][y],
                    rank : x,
                    file : y,
                })
        })
    })
    return enemyPieces
}
//קבלת מיקום המלך הנתון
export const getKingPosition = (position, player) => {
    let kingPos 
    position.forEach((rank,x) => {
        rank.forEach((file, y) => {
            if(position[x][y].startsWith(player) && position[x][y].endsWith('k'))
                kingPos=[x,y]
        })
    })
    return kingPos
}
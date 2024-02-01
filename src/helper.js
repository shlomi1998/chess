export const getCharacter = file => String.fromCharCode(file + 96)
export const createPosition = () => {

    const position = new Array(8).fill('').map(x => new Array(8).fill(''))

    for (let i = 0; i < 8; i++) {
      position[6][i] = 'bp'
       position[1][i] = 'wp'
    }
    
    position[0][0] = 'wr'
    position[0][1] = 'wn'
    position[0][2] = 'wb'
    position[0][3] = 'wq'
    position[0][4] = 'wk'
    position[0][5] = 'wb'
    position[0][6] = 'wn'
    position[0][7] = 'wr'
    
    position[7][0] = 'br'
    position[7][1] = 'bn'
    position[7][2] = 'bb'
    position[7][3] = 'bq'
    position[7][4] = 'bk'
    position[7][5] = 'bb'
    position[7][6] = 'bn'
    position[7][7] = 'br'

    

    return position
}

export const copyPosition = position => {
    // מערך 8*8
    const newPosition = 
        new Array(8).fill('').map(x => new Array(8).fill(''))
// מעבר על שורות עמודות
    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[0].length; file++) {
            // מעתיק את הערך מעמדה מקורית לעמדה חדשה
            newPosition[rank][file] = position[rank][file]
        }
    }
// מחזיר את העמדה החדשה
    return newPosition 
}

// מחזיר אמת אם אותו צבע, שקר אם צבעים שונים
export const areSameColorTiles = (coords1,coords2) => 
    (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y)

//החזרת הקוארדינטות ע"י type
export const findPieceCoords = (position,type) => {
    let results = []
    position.forEach((rank,i) => {
        rank.forEach((pos,j) => {
            if (pos === type)
                results.push({x: i, y: j})
        })
    });
    return results
}
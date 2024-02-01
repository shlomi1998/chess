import { useAppContext }from '../../../contexts/Context'
import { copyPosition,  } from '../../../helper';
import { makeNewMove , clearCandidates } from '../../../reducer/actions/move';
import './PromotionBox.css'

const PromotionBox = ({onClosePopup}) => {

    const { appState , dispatch } = useAppContext();
    //שליפת המשבצת בה מתבצעת הקידום
    const {promotionSquare} = appState;
    // אם אין משבצת קידום, הקומפוננטה לא תוצג
    if (!promotionSquare)
        return null
    //צבע של השחקנים לקבלה
    const color = promotionSquare.x === 7 ? 'w' : 'b'
    //אפשריות לקבלה 
    const options = ['q','r','b','n']
    //קביעת מיקום לפי האינדקס המדובר
    const getPromotionBoxPosition = () => {
        let style = {}

        if (promotionSquare.x === 7) {
            style.top = '-12.5%'
        }
        else{
            style.top = '97.5%'
        }

        if (promotionSquare.y <= 1){
            style.left = '0%'
        }
        else if (promotionSquare.y >= 5){
            style.right = '0%'
        }
        else {
            style.left = `${12.5*promotionSquare.y - 20}%`
        }

        return style
    }
    
    //שךןחצים על בחירת השחקן נשלח את המצב החדש לאחר שדרוג
    const onClick = option => {
        onClosePopup()
        const newPosition = copyPosition (appState.position[appState.position.length - 1])
        
        newPosition[promotionSquare.rank][promotionSquare.file] = ''//מרוקנים
        newPosition[promotionSquare.x][promotionSquare.y] = color+option//משדרגים...
        
        dispatch(clearCandidates())

        dispatch(makeNewMove({newPosition}))//שליחת מהלך
    }

    return <div className="popup--inner promotion-choices" style={getPromotionBoxPosition()}>
        {options.map (option => 
            <div key={option}
                onClick = {() => onClick(option)} 
                className={`piece ${color}${option}`}//w b 
            />
        )}
    </div>

}

export default PromotionBox
import React from 'react';
import { Status } from '../../constants';
import { useAppContext }from '../../contexts/Context'
import { closePopup } from '../../reducer/actions/popup';
import PromotionBox from './PromotionBox/PromotionBox'
import './Popup.css'

const Popup = ({children}) => {
    
    //לקחת status + dispatch
    const { appState : {status}, dispatch } = useAppContext();

    //סגירת פופ-אפ
    const onClosePopup = () => {
        dispatch(closePopup())
    }
    //לא מוצג פןפ-אפ שזה סטטוס ממשיך
    if (status === Status.ongoing)
        return null

        //נעביר לילדים שיוכלו לסגור
    return <div className="popup">
        {React.Children
            .toArray(children)
            .map (child => React.cloneElement(child, { onClosePopup }))}
    </div>
}

export default Popup
import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import './Infobox.css'

const InfoBox = ({title, cases, isRed, isBlack, active, total, ...props}) => {
    return (
       <Card 
       onClick={props.onClick}
       className={`infoBox ${active && 'infoBox--selected'}
        ${isRed && 'infoBox--red'}
        ${isBlack && 'infoBox--black'}
       `}>
           <CardContent>
               <Typography color='textSecondary'  className='infoBox__title'>{title}</Typography>
               <h2 className={`infoBox__cases ${!isRed && !isBlack && 'infoBox__cases--green'}`}>{cases}</h2>
               <Typography color='textSecondary' className='infoBox__total'>{total} Total</Typography>
           </CardContent>
       </Card>
    )
}

export default InfoBox

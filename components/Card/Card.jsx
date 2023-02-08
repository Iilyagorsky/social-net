import React from 'react';
import style from './Card.module.scss'

function Card({children, noPadding}) {
  return (
    <div className={noPadding ? style.cardNoPadding : style.card}>
      {children}
    </div>
  );
}

export default Card;

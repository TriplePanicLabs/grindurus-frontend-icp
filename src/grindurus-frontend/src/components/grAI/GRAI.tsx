import React from 'react';

import MintGRAI from "./mint/MintGRAI"
import BridgeGRAI from "./bridge/BridgeGRAI"
import styles from './GRAI.module.scss';

function GRAI() {
  return (
    <div className={styles['grai-container']}>
      <MintGRAI/>
      <BridgeGRAI/>
    </div>
  );
};

export default GRAI
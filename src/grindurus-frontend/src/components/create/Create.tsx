import { useEffect, useState } from 'react'

import CreatePool from '@/components/create/pool/CreatePool'
import CreateAgent from './agent/CreateAgent'

import styles from './Create.module.scss'

function Create() {
    return (
      <>
        <div className={`${styles['container']}`}>
            <div className={`${styles['content']}`}>
                <div className={`${styles['item']}`}>
                    <CreatePool />
                </div>
                <div className={`${styles['item']}`}>
                    <CreateAgent />
                </div>
            </div>
        </div>
      </>
    );
};

export default Create
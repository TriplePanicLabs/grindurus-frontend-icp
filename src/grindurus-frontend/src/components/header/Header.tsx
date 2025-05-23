import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import closeIcon from '@/assets/icons/close.svg'
import menuIcon from '@/assets/icons/menu.svg'
import logo from '@/assets/logo.svg'
import ConnectButton from '@/components/connect/ConnectButton'

import styles from './Header.module.scss'

function Header() {
  const { open } = useAppKit()
  const { caipNetwork } = useAppKitNetwork()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  return (
    <header className={styles['header']}>
      <div className={`${styles['container']} container`}>
        <Link to="/" className={styles['logo']}>
          <img src={logo} alt="GrindURUS Logo" />
          <div className={styles['text']}>GrindURUS</div>
        </Link>
        <nav className={`${styles['navigation']} ${isMenuOpen ? styles['active'] : ''}`}>
          <ul className={styles['menu']}>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles['menu-item']}>
              <Link to="grind" className={styles['menu-link']}>
                Grind
              </Link>
            </li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles['menu-item']}>
              <Link to="/explore" className={styles['menu-link']}>
                Explore
              </Link>
            </li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles['menu-item']}>
              <Link to="create" className={styles['menu-link']}>
                Create
              </Link>
            </li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles['menu-item']}>
              <Link to="grai" className={styles['menu-link']}>
                grAI
              </Link>
            </li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles['menu-item']}>
              <Link to="/greth" className={styles['menu-link']}>
                grETH
              </Link>
            </li>
          </ul>
          <div className={styles['navigation-buttons']}>
            <button
              className={`${styles['button']} ${styles['network-button']} button`}
              onClick={() => open({ view: 'Networks' })}
            >
              <div className={styles['button-image']}>
                <img src={caipNetwork?.assets?.imageUrl} alt="Chain Icon" />
              </div>
              {caipNetwork?.name}
            </button>
            <ConnectButton className={styles['connect-button']} />
          </div>
        </nav>
        <div className={styles['buttons']}>
          <button
            className={`${styles['button']} ${styles['network-button']} button`}
            onClick={() => open({ view: 'Networks' })}
          >
            <div className={styles['button-image']}>
              <img src={caipNetwork?.assets?.imageUrl} alt="Chain Icon" />
            </div>
            {caipNetwork?.name}
          </button>
          <ConnectButton />
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`${styles['menu-button']} ${isMenuOpen ? styles['active'] : ''}`}
        >
          <div className={styles['open']}>
            <img src={menuIcon} alt="Menu Icon" />
          </div>
          <div className={styles['close']}>
            <img src={closeIcon} alt="Close Icon" />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header

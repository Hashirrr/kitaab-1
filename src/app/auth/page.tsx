'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './auth.module.css';
import logoNormal from '@/assets/logo.png';
import LoginForm from '@/form/login/LoginForm';
import logoNormalDark from '@/assets/logo-dark.png';
import FlipCard from '@/components/composite/flipcard/FlipCard';
import FlipButton from '@/components/primitive/flipbutton/FlipButton';

const Logo = () => (
  <div className={styles.logo__section}>
    <div className={styles.logo__light}>
      <Image
        priority
        alt='Kitaab Logo'
        width={70}
        src={logoNormal}
      />
    </div>

    <div className={styles.logo__dark}>
      <Image
        priority
        alt='Kitaab Logo'
        width={70}
        src={logoNormalDark}
      />
    </div>
  </div>
);

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggle = () => setIsFlipped((prev) => !prev);

  const handleGuestLogin = () => {
  };

  return (
    <FlipCard isFlipped={isFlipped}>
      <FlipCard.Front>
        <Logo />

        <LoginForm onGuestLogin={handleGuestLogin} />

        <div className={styles.bottom__section}>
          <div className={styles.separator}>
            <span className={styles.separator__line} />
            <span className={styles.separator__text}>OR</span>
            <span className={styles.separator__line} />
          </div>
          <div className={styles.prompt}>
            <span>Dont have an account ?</span>
            <FlipButton onClick={toggle}>Signup</FlipButton>
          </div>
        </div>
      </FlipCard.Front>

      <FlipCard.Back>
        <Logo />

        <div className={styles.bottom__section}>
          <div className={styles.separator}>
            <span className={styles.separator__line} />
            <span className={styles.separator__text}>OR</span>
            <span className={styles.separator__line} />
          </div>
          <div className={styles.prompt}>
            <span>Already have an account ?</span>
            <FlipButton onClick={toggle}>Login</FlipButton>
          </div>
        </div>
      </FlipCard.Back>
    </FlipCard>
  );
}

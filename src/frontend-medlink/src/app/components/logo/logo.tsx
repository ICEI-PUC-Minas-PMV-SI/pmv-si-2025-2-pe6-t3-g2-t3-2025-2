'use client';

import Image from 'next/image';
import logo from '../../assets/logo.svg';
import styles from './logo.module.css';
import { ComponentProps } from 'react';

interface LogoProps extends ComponentProps<'div'> {
  /**
   * Size in pixels for the logo image (width & height).
   * Defaults to 32.
   */
  size?: number;
  /**
   * If true, renders the logo inside a link to `/`.
   */
  asLink?: boolean;
}

export function Logo({ size = 32, className = '', asLink = false, ...rest }: LogoProps) {
  const content = (
    <div className={`${styles.logo} ${className}`} {...rest}>
      <Image src={logo} alt="Medlink" priority />
    </div>
  );

  if (asLink) {
    // dynamic import of Link is small; keep this client-safe by rendering a client component wrapper
    // NOTE: if you prefer the Logo itself to be an <a>, we can change this to accept an href prop.
    const Link = require('next/link').default;
    return <Link href="/">{content}</Link>;
  }

  return content;
}
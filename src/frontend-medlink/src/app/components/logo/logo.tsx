'use client';

import Image from 'next/image';
import logo from '../../assets/logo.svg';
import styles from './logo.module.css';
import { ComponentProps } from 'react';

interface LogoProps extends ComponentProps<'div'> {

  size?: number;

  asLink?: boolean;
}

export function Logo({ size = 32, className = '', asLink = false, ...rest }: LogoProps) {
  const content = (
    <div className={`${styles.logo} ${className}`} {...rest}>
      <Image src={logo} alt="Medlink" priority />
    </div>
  );

  if (asLink) {
    
    const Link = require('next/link').default;
    return <Link href="/">{content}</Link>;
  }

  return content;
}
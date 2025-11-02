'use client';

import { ArrowLeft } from 'lucide-react';
import styles from './arrow-home.module.css';

export function ArrowHome() {
  return (
    <span className={styles.back} role="presentation" aria-hidden="false">
      <ArrowLeft size={20} aria-hidden="true" />
      <span className={styles['back__text']}>Voltar</span>
    </span>
  );
}
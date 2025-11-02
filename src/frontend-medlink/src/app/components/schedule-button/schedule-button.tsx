'use client';

import { forwardRef, type ComponentProps } from 'react';
import { ArrowRight } from 'lucide-react';
import cn from 'clsx';
import styles from './schedule-button.module.css';

export interface ScheduleButtonProps extends ComponentProps<'button'> {
  /**
   * If true, shows a loading state (subtle) and disables the button.
   */
  loading?: boolean;
}

export const ScheduleButton = forwardRef<HTMLButtonElement, ScheduleButtonProps>(
  ({ className, children = 'Agende sua consulta', loading = false, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        className={cn(styles.button, className, { [styles.loading as string]: loading })}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        {...props}
      >
        <span className={styles['button__label']}>{children}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
    );
  },
);

ScheduleButton.displayName = 'ScheduleButton';
"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import logo from "../../assets/logo.svg";
import styles from "./logo.module.css";

interface LogoProps extends ComponentProps<"div"> {
  size?: number;

  asLink?: boolean;
}

export function Logo({
  size = 32,
  className = "",
  asLink = false,
  ...rest
}: LogoProps) {
  const content = (
    <div className={`${styles.logo} ${className}`} {...rest}>
      <Image src={logo} alt="Medlink" priority />
    </div>
  );

  if (asLink) {
    const Link = require("next/link").default;
    return <Link href="/">{content}</Link>;
  }

  return content;
}

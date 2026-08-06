"use client";

import React from "react";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";

type LocaleFontProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export default function LocaleFont<T extends React.ElementType = "span">({
  as,
  className,
  children,
  ...rest
}: LocaleFontProps<T>) {
  const Component = (as ?? "span") as React.ElementType;
  const fontClass = useLocaleFontClass();
  const mergedClassName = className
    ? `${fontClass} ${className}`
    : fontClass;

  return (
    <Component className={mergedClassName} {...rest}>
      {children}
    </Component>
  );
}

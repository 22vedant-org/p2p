'use client';
import React, { ComponentProps } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
const ThemeProvider = ({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) => {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;

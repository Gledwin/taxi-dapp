/* theme.ts */
import {  extendTheme } from "@chakra-ui/react";

const config = extendTheme({
  initialColorMode: 'light',
  fonts: {
    heading: 'var(--font-dmSans)',
    body: 'var(--font-dmSans)',
  },
});

const Theme = extendTheme({ config })

export default Theme
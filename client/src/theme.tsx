import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark', // Set the initial color mode
    useSystemColorMode: false, // Disable system color mode detection
};

const theme = extendTheme({
    config
});

export default theme;
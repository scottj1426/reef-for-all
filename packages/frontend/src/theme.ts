import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    ocean: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF', // Primary ocean blue
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    teal: {
      50: '#E6FFFB',
      100: '#B5F5EC',
      200: '#87E8DE',
      300: '#5CDBD3',
      400: '#36CFC9',
      500: '#13C2C2', // Primary teal
      600: '#08979C',
      700: '#006D75',
      800: '#00474F',
      900: '#002329',
    },
    coral: {
      50: '#FFF0F0',
      100: '#FFD6D6',
      200: '#FFB3B3',
      300: '#FF8F8F',
      400: '#FF6B6B',
      500: '#FF4747', // Coral accent
      600: '#E63636',
      700: '#CC2626',
      800: '#B31717',
      900: '#990909',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'ocean.500',
          color: 'white',
          _hover: {
            bg: 'ocean.600',
          },
        },
        ocean: {
          bg: 'ocean.500',
          color: 'white',
          _hover: {
            bg: 'ocean.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
        teal: {
          bg: 'teal.500',
          color: 'white',
          _hover: {
            bg: 'teal.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
        coral: {
          bg: 'coral.500',
          color: 'white',
          _hover: {
            bg: 'coral.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'md',
          overflow: 'hidden',
        },
      },
    },
    Badge: {
      variants: {
        ocean: {
          bg: 'ocean.100',
          color: 'ocean.800',
        },
        teal: {
          bg: 'teal.100',
          color: 'teal.800',
        },
        coral: {
          bg: 'coral.100',
          color: 'coral.800',
        },
      },
    },
  },
});

export default theme;

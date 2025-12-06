import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@chakra-ui/react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      onClick={() => loginWithRedirect({
        appState: { returnTo: '/dashboard' }
      })}
      size="lg"
      colorScheme="whiteAlpha"
      bg="white"
      color="ocean.600"
      px={8}
      py={6}
      fontSize="lg"
      fontWeight="bold"
      _hover={{
        bg: 'gray.100',
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
      }}
      _active={{
        bg: 'gray.200',
      }}
      shadow="lg"
      transition="all 0.2s"
    >
      Sign In with Auth0
    </Button>
  );
};

export default LoginButton;

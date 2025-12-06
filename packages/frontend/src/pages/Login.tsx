import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaTint } from 'react-icons/fa';
import LoginButton from '../LoginButton';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth0();

  const bgGradient = 'linear(to-br, ocean.400, teal.500, ocean.600)';

  if (isLoading) {
    return (
      <Box minH="100vh" bgGradient={bgGradient}>
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="white" thickness="4px" speed="0.65s" />
            <Text color="white" fontSize="lg">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient} display="flex" alignItems="center">
      <Container maxW="lg">
        <VStack spacing={8} textAlign="center" color="white">
          {/* Logo/Icon */}
          <Icon as={FaTint} boxSize={20} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />

          {/* Title */}
          <VStack spacing={2}>
            <Heading size="2xl" textShadow="0 2px 4px rgba(0,0,0,0.3)">
              Reef For All
            </Heading>
            <Text fontSize="xl" opacity={0.9}>
              The community platform for reef aquarium enthusiasts
            </Text>
          </VStack>

          {/* Description */}
          <Text fontSize="md" maxW="md" opacity={0.85}>
            Join thousands of reef keepers sharing their passion for marine aquariums.
            Track your tanks, showcase your corals, and connect with the community.
          </Text>

          {/* Login Button */}
          <Box pt={4}>
            <LoginButton />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

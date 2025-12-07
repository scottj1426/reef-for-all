import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Avatar,
  Badge,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  VStack,
  HStack,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { FaTint, FaFish, FaStore } from 'react-icons/fa';
import { userApi, type User } from '../api/user.api';
import AddTankModal from '../components/AddTankModal';
import { tankApi, type Tank } from '../api/tank.api';

export default function Dashboard() {
  const { user: auth0User, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [token, setToken] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const syncAndFetchUser = async () => {
      if (!isAuthenticated || !auth0User) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔐 Starting user sync...', {
          auth0User,
          isAuthenticated,
        });

        // Get Auth0 access token
        console.log('🎫 Getting access token...');
        const accessToken = await getAccessTokenSilently();
        console.log('✅ Got access token:', accessToken.substring(0, 20) + '...');
        setToken(accessToken);

        // Sync user to database
        console.log('💾 Syncing user to database...', {
          email: auth0User.email,
          firstName: auth0User.given_name,
          lastName: auth0User.family_name,
        });
        await userApi.syncUser({
          email: auth0User.email!,
          firstName: auth0User.given_name,
          lastName: auth0User.family_name,
          picture: auth0User.picture,
          email_verified: auth0User.email_verified,
        }, accessToken);
        console.log('✅ User synced successfully');

        // Fetch user from database
        console.log('👤 Fetching user from database...');
        const dbUser = await userApi.getMe(accessToken);
        console.log('✅ User fetched:', dbUser);
        setUser(dbUser);

        // Fetch user's tanks
        console.log('🐠 Fetching user tanks...');
        const userTanks = await tankApi.getTanksByUserId(dbUser.id);
        console.log('✅ Tanks fetched:', userTanks);
        setTanks(userTanks);

        setError(null);
      } catch (err: any) {
        console.error('❌ ERROR in user sync:', {
          error: err,
          message: err.message,
          response: err.response,
          responseData: err.response?.data,
          status: err.response?.status,
          config: err.config,
          isAxiosError: err.isAxiosError,
          stack: err.stack,
        });
        setError(err.response?.data?.error || err.message || 'Failed to sync user');
      } finally {
        setLoading(false);
      }
    };

    syncAndFetchUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  const handleTankAdded = async () => {
    // Refresh tanks list after adding a new tank
    if (user) {
      try {
        const userTanks = await tankApi.getTanksByUserId(user.id);
        setTanks(userTanks);
      } catch (error) {
        console.error('Error fetching tanks:', error);
      }
    }
  };

  const bgGradient = 'linear(to-br, ocean.50, teal.50)';

  if (loading) {
    return (
      <Box minH="100vh" bg={bgGradient}>
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="ocean.500" thickness="4px" speed="0.65s" />
            <Text color="gray.600" fontSize="lg">Loading your dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgGradient}>
        <Center h="100vh">
          <Card maxW="md" w="full">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Error Loading Dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Box>
                </Alert>
                <Button colorScheme="ocean" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl" py={3}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Icon as={FaTint} boxSize={6} color="teal.500" />
              <Heading size="md" color="gray.800" fontWeight="semibold">Reef For All</Heading>
            </HStack>
            <HStack spacing={3}>
              <Text fontSize="sm" color="gray.600" display={{ base: 'none', md: 'block' }}>
                {user?.email}
              </Text>
              <Avatar size="sm" name={user?.firstName || user?.email} src={user?.avatarUrl || undefined} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Logout
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Heading size="lg" color="gray.800" mb={1} fontWeight="bold">
              Welcome back, {user?.firstName || user?.email?.split('@')[0]}
            </Heading>
            <Text color="gray.600" fontSize="md">
              Manage your reef aquarium and connect with the community
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <HStack spacing={4}>
                  <Box bg="blue.50" p={3} borderRadius="lg">
                    <Icon as={FaTint} boxSize={6} color="blue.500" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Tanks</Text>
                    <Heading size="lg" color="gray.800">{tanks.length}</Heading>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>

            <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <HStack spacing={4}>
                  <Box bg="teal.50" p={3} borderRadius="lg">
                    <Icon as={FaFish} boxSize={6} color="teal.500" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Corals</Text>
                    <Heading size="lg" color="gray.800">0</Heading>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>

            <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <HStack spacing={4}>
                  <Box bg="purple.50" p={3} borderRadius="lg">
                    <Icon as={FaStore} boxSize={6} color="purple.500" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Listings</Text>
                    <Heading size="lg" color="gray.800">0</Heading>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
            {/* Profile Card */}
            <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200">
              <CardBody p={6}>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={3}>
                    <Avatar
                      size="lg"
                      name={user?.firstName || user?.email}
                      src={user?.avatarUrl || undefined}
                      bg="teal.500"
                    />
                    <VStack align="start" spacing={0}>
                      <Heading size="sm" color="gray.800">
                        {user?.firstName} {user?.lastName}
                      </Heading>
                      <Text fontSize="xs" color="gray.500">
                        {user?.email}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack align="stretch" spacing={2} pt={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Status</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="teal" fontSize="xs" px={2} py={0.5} borderRadius="md">
                          {user?.subscriptionTier}
                        </Badge>
                        {user?.emailVerified && (
                          <Badge colorScheme="green" fontSize="xs" px={2} py={0.5} borderRadius="md">
                            Verified
                          </Badge>
                        )}
                      </HStack>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Joined</Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {user?.createdAt && new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.200" gridColumn={{ base: '1', lg: 'span 2' }}>
              <CardBody p={6}>
                <Heading size="sm" mb={4} color="gray.800">Quick Actions</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                  <Button
                    size="md"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<Icon as={FaTint} />}
                    justifyContent="flex-start"
                    onClick={onOpen}
                  >
                    Add Tank
                  </Button>
                  <Button
                    size="md"
                    colorScheme="teal"
                    variant="outline"
                    justifyContent="flex-start"
                  >
                    Add Coral
                  </Button>
                  <Button
                    size="md"
                    colorScheme="purple"
                    variant="outline"
                    leftIcon={<Icon as={FaStore} />}
                    isDisabled
                    justifyContent="flex-start"
                  >
                    Marketplace
                  </Button>
                </SimpleGrid>
                <Text color="gray.500" fontSize="xs" mt={4}>
                  More features coming soon
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Add Tank Modal */}
      {user && (
        <AddTankModal
          isOpen={isOpen}
          onClose={onClose}
          userId={user.id}
          token={token}
          onTankAdded={handleTankAdded}
        />
      )}
    </Box>
  );
}

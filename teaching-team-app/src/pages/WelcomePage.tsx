import { useEffect } from 'react';
import { Box, Heading, Text, Button, Flex, Stack, useToast } from '@chakra-ui/react';
import { useAuth } from '@/components/Auth';
import { useRouter } from 'next/router';

export default function UsersPage() {
  const { isAuthenticated, role, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      toast({
        title: 'Unauthorized',
        description: 'You are not logged in.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [isAuthenticated, router]);

  const handleDashboard = () => {
    if(role === 'lecturer')
    {
        router.push('/lecturer');
    }
    else if(role === 'candidate'){
        router.push('/candidate');
    }
    

  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.100" px={4}>
      <Box
        maxW="md"
        w="full"
        bg="white"
        boxShadow="lg"
        rounded="xl"
        p={8}
        textAlign="center"
      >
        <Stack spacing={4}>
          <Heading fontSize="3xl" color="teal.500">
            Welcome!
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Click the button below to access your dashboard and get started.
          </Text>
          <Stack direction="row" spacing={3} justify="center">
            <Button colorScheme="teal" onClick={handleDashboard}>
              Dashboard
            </Button>
            <Button colorScheme="red" variant="outline" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
}

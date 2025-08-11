import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../components/Auth";
import {
  Alert,
  FormLabel,
  FormControl,
  AlertIcon,
  Button,
  Center,
  Box,
  Input,
  Text,
  useToast,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: "Login successful",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push("/redirecting");
    } catch (err: any) {
      setError("Invalid Login");
      toast({
        title: 'Error',
        description: "Invalid credentials",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/redirecting");
    }
  }, [isAuthenticated, router]);

  const bgGradient = useColorModeValue(
    "linear(to-tl, red.200, red.500)",
    "linear(to-tl, red.600, red.800)"
  );

  return (
    <Center w="100vw" h="100vh" bgGradient={bgGradient}>
      <Box
        w={{ base: '90%', md: '500px' }}
        h="auto"
        bg={useColorModeValue('white', 'gray.700')}
        rounded="lg"
        p={{ base: 4, md: 8 }}
        boxShadow="xl"
      >
        <VStack spacing={6} align="stretch">
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mt={4}>
            Login
          </Text>

          <FormControl isInvalid={!!error}>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isInvalid={!!error}>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            colorScheme="red"
            isLoading={submitting}
            onClick={(e) => handleSubmit(e as any)}
            size="lg"
          >
            Log In
          </Button>

          {error && (
            <Alert status='error' rounded='md'>
              <AlertIcon /> {error}
            </Alert>
          )}
        </VStack>
      </Box>
    </Center>
  );
}

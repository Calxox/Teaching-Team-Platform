import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../components/Auth";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { userApi } from '../services/api';

export default function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  // helper to validate password strength
  const isStrongPassword = (pw: string) => {
    // at least 8 chars, one uppercase, one lowercase, one digit, one special char
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+])[A-Za-z\d@$!%*?&=+]{8,}$/;
    return pattern.test(pw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // basic required fields
    if (!fullName || !email || !password || !confirm || !role) {
      setError('Please fill in all fields');
      toast({ title: 'ERROR', description: 'Please fill in all fields', status: 'error', duration: 3000, isClosable: true });
      return;
    }

    // password strength
    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, a number and a special character.');
      toast({
        title: 'Weak password',
        description: 'Use ≥8 chars, upper & lower case, number, and special character',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
      return;
    }

    // confirm match
    if (password !== confirm) {
      setError('Passwords do not match');
      toast({ title: 'ERROR', description: 'Passwords do not match', status: 'error', duration: 3000, isClosable: true });
      return;
    }

    setSubmitting(true);
    try {
      await userApi.createUser({ fullName, email, password, role });
      toast({ title: 'Success', description: 'Account created. Please log in.', status: 'success', duration: 3000, isClosable: true });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      toast({ title: 'Error', description: err.message || 'Sign up failed', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  const bgGradient = useColorModeValue('linear(to-tl, red.200, red.500)', 'linear(to-tl, red.600, red.800)');

  return (
    <Center w="100vw" h="100vh" bgGradient={bgGradient} pt={16}>
      <Box
        w={{ base: '90%', md: '500px' }}
        bg={useColorModeValue('white', 'gray.700')}
        rounded="lg"
        p={6}
        boxShadow="xl"
      >
        <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
          Sign Up
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!error}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" placeholder="confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </FormControl>
            <Text fontSize="sm" color="gray.500" mt={1}>
                At least 8 characters, including uppercase, lowercase, number & special character.
              </Text>
            <FormControl isInvalid={!!error}>
              <FormLabel>Role</FormLabel>
              <Select placeholder="Select role" value={role} onChange={e => setRole(e.target.value)}>
                <option value="lecturer">Lecturer</option>
                <option value="candidate">Candidate</option>
              </Select>
            </FormControl>
            <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
              Sign Up
            </Button>
            {error && (
              <Alert status="error" rounded="md">
                <AlertIcon /> {error}
              </Alert>
            )}
          </Stack>
        </form>
      </Box>
    </Center>
  );
}

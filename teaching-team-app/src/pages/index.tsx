// src/pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Center,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "@/components/Auth";

export default function IndexPage() {
  const { isAuthenticated, role, logout } = useAuth();
  const router = useRouter();

  

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Gradient Background
  const bannerGradient = useColorModeValue(
    "linear(to-r, purple.300, pink.300)",
    "linear(to-r, purple.600, pink.600)"
  );

  return (
    <Center
      w="100vw"
      h="100vh"
      bgGradient={bannerGradient}
      flexDirection="column"
      color="white"
      textAlign="center"
      px={4}
    >
      <Heading fontSize={["3xl", "4xl", "5xl"]} mb={4}>
        {greeting}, {isAuthenticated ? `${role}!` : "visitor!"}
      </Heading>
      <Text fontSize={["lg", "2xl"]} mb={6}>
        Welcome to TeachTeam!
      </Text>
      <Button
        size="lg"
        colorScheme="pink"
        onClick={() => (isAuthenticated ? logout() : router.push("/login"))}
      >
        {isAuthenticated ? "Log out" : "Log in"}
      </Button>
    </Center>
  );
}

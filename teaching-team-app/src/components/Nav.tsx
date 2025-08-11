import  React  from 'react';
import { useAuth } from './Auth';
import {
            Box,
            Flex,
            Button,
            Text,
            Spacer
        } from '@chakra-ui/react';



const NavBar = () => {
    const {logout, role} = useAuth();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        logout();
    };
    

    return(
        <Flex direction={'column'}
            bg='gray.300'
            w='300px'
            h='100vh'
            pos='fixed'
            left='0'
            top='50px'
            boxShadow='md'>
            <Box textAlign='center'> 
                <Text fontSize='2em' p={4}>Dashboard</Text>
                <Flex direction='column' gap={2} px={4}>
                <Button fontSize='lg'>
                    Home
                </Button>
                <Spacer/>
                <hr color='black'/>
                <Spacer/>
                    <Button fontSize='lg' colorScheme='red' onClick={handleLogout}>
                        Logout
                    </Button>
                </Flex>
            </Box>
        </Flex>
        
    )
};

export default NavBar;
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/Auth';
import { Center,
  Spinner,
} from "@chakra-ui/react";
/*
  All this page is to redirect the user to the correct page based on the role.
  
  Majority of the code explains its self, if role = tutor go tutor page if role = lecturer
  go to lecturer page

 */
export default function Redirecting() {
  const { role } = useAuth();
  const router = useRouter();
    useEffect(() => {
        if (role === 'candidate') 
        {
            router.push('/WelcomePage');
        }
        if (role === 'lecturer') 
        {
            router.push('/WelcomePage');
        }
    });
  
  return (
    <div>
      <Center pt={'15%'}>
        <Spinner/>
      </Center>
    </div>
  );
}

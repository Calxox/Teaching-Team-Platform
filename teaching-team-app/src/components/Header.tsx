import  React  from 'react';
import Link from "next/link";
import{useAuth} from './Auth';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';


const Header = () => {
    const { isAuthenticated } = useAuth(); // used to check if to display login
    const  router  = useRouter();
    const location = usePathname(); // used to check page of user (so tutor/lecturer can go back to dashboard)

    const hide = ['login','/'];

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        router.push('/redirecting')
    }

    if(isAuthenticated && !hide.includes(location)){
        return(
        <nav className='fixed top-0 w-full z-50 bg-gray-800 text-white p-5'>
            <div className='container mx-auto flex justify-between items-center'>
                <h1><Link href="/">Teaching Team</Link></h1>
            </div>
        </nav>
        )
    }else if(isAuthenticated){
        return(
            <nav className='fixed top-0 w-full z-50 bg-gray-800 text-white p-5'>
                <div className='container mx-auto flex justify-between items-center'>
                    <h1 className='padding-7'><Link href="/">Teaching Team</Link></h1>
                    <Button onClick={handleSubmit}>Dashboard</Button>
                </div>
            </nav>
        )
    }else{
    return (
        <nav className='fixed top-0 w-full z-50 bg-gray-800 text-white p-5'>
            <div className='container mx-auto flex justify-between items-center'>
            <h1 className='padding-7'><Link href="/">Teaching Team</Link></h1>
                <div className='flex space-x-4'>
                    <div className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
                        <Link href="/login">Login</Link>
                    </div>
                    <div className='bg-green-500 px-4 py-2 rounded hover:bg-green-600'>
                        <Link href="/signup">Signup</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
};

export default Header;
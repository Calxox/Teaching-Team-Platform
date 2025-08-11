import { useAuth } from '@/components/Auth';
import {useRouter} from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/Nav';
import { Box, 
        Select,
        VStack,
        FormControl,
        FormLabel,
        Input,
        Button,
        useToast,
} from '@chakra-ui/react';
import {User, Course, Application } from '../context/users';
import { courseApi } from '../services/api';
import { applicationApi } from '../services/api';
import { userApi } from "../services/api";

const parseSkills = (input: string): string[] => {
    // Split the string by comma, then trim each skill and filter out empty strings.
    return input
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
};

export default function candidate(){
    const { isAuthenticated, role, ID } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [Courses, setCourses] = useState<Course[]>([]);

    const [courseCode, setCourseCode] = useState<string>('');
    const [previousRole, setPreviousRole] = useState<string>('');
    const [rolesApplied, setRolesApplied] = useState<string>('');
    const [skillsInput, setSkillsInput] = useState<string>(''); 
    const [skills, setSkills] = useState<string[]>([]);
    const [academics, setAcademics] = useState<string>('');
    const [availability, setAvailability] = useState<string>('');


    useEffect(() => {
        courseApi.getAllCourses().then((value: unknown) => {
                const courses = value as Course[];
                setCourses(courses);
            }).catch(console.error);
    }, [])
    // confirms that user isnt a lecturer or not logged in and be pushed out of the page
    useEffect(() => {
        if(!isAuthenticated){
            router.push('/login');
        }else if(role === 'lecturer'){
            router.push('/lecturer')
        }
    }, [isAuthenticated,role, router]);

    const validateForm = () => {
        if (!courseCode) {
            toast({ title: 'Please select a course.', status: 'error', duration: 3000 });
            return false;
        }
        if (!rolesApplied) {
            toast({ title: 'Please select at least one role (Tutor or Lab Assistant).', status: 'error', duration: 3000 });
            return false;
        }
        if (!availability) {
            toast({ title: 'Please select your availability.', status: 'error', duration: 3000 });
            return false;
        }
        if(!academics){
            toast({ title: 'Please enter your academics.', status: 'error', duration: 3000 });
            return false;
        }
        if(!skills){
            toast({ title: 'Please enter your skills.', status: 'error', duration: 3000 });
            return false;
        }
        return true;
    };
    
    const handleExistingApplicant = async (candidateId: number, courseCode: string, role: string): Promise<boolean> => {
    try {
        // Suppose getApplicationbyUserID returns a list of matching applications.
        console.log(candidateId, courseCode, role);
        const resp : Application = await applicationApi.getApplicationbyUser(candidateId, role, courseCode);

        // If resp.data is an array, check its length:
        console.log(resp);
        

        if (resp !== null) {
            return true;   // already have an existing application
        }
            return false;    // no application found
        } catch (err) {
        
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            let candidateN :string;
             try{
                const user = await userApi.getUserById(ID);
                candidateN = user.fullName;
                // ...

                const applicantName = candidateN;
                
                if (await handleExistingApplicant(ID, courseCode, rolesApplied)) {
                    toast({ title: 'Application already submitted.', status: 'error', duration: 3000 });
                    return;
                }

                const parsedSkills = parseSkills(skillsInput);
                setSkills(parsedSkills);
                const candidate = ID;
                const name = applicantName;
                const role = rolesApplied;
                const newapp : Application = await applicationApi.createApplication({
                    candidate,
                    courseCode,
                    name,
                    previousRole,
                    role,
                    skills,
                    academics,
                    availability
                }) as Application;


                toast({title: "Application submitted successfully", status: 'success', duration: 3000});
            }catch(error){
                toast({ title: 'Error submitting application.', status: 'error', duration: 3000 });
                console.log(error);
            }

        }
    };



    return(
    <div>
        <NavBar/>
        <Box pl='350px' pr='50px' pt='100px'>
            <form onSubmit={handleSubmit}>
                <VStack spacing={5} align={'stretch'}>
                    <FormControl>
                    <FormLabel>Select a course</FormLabel>
                    <Select placeholder='Select course' onChange={(e) => setCourseCode(e.target.value)} >
                        {Courses.map((course: Course) => (
                            <option key={course.courseCode} value={course.courseCode}>
                                {course.courseName}
                            </option>
                        ))}
                    </Select>
                    </FormControl>

                    <FormControl>
                    <FormLabel>Select a Apply for Roles</FormLabel>
                        <Select placeholder='Select a role' onChange={(e) => setRolesApplied(e.target.value)}>
                            <option value='Tutor'>Tutor</option>
                            <option value='Lab Assistant'>Lab Assistant</option>
                        </Select>
                    </FormControl>


                    <FormControl>
                        <FormLabel>Enter Previous Roles</FormLabel>
                        <Input placeholder="Enter Previous Roles" value={previousRole} onChange={(e) => setPreviousRole(e.target.value)}/>
                    </FormControl>
                    
                    <FormControl>
                    <FormLabel>Enter your Avalibility</FormLabel>
                        <Select placeholder='Select Availability' onChange={(e) => setAvailability(e.target.value)}>
                            <option value='Full Time'>Full Time</option>
                            <option value='Part Time'>Part Time</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Skills</FormLabel>
                        <Input placeholder="List your skills (seperated by commas)" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)}/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Academics</FormLabel>
                        <Input placeholder="Enter Academics" value={academics} onChange={(e) => setAcademics(e.target.value)}/>
                    </FormControl>

                    <Button type="submit" colorScheme='blue'> Submit</Button>
                </VStack>
            </form>
        </Box>
    </div>
    );
}
import { useAuth } from '@/components/Auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/Nav';
import {
  Box,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Checkbox,
  SimpleGrid,
} from '@chakra-ui/react';
import { Course, Application } from '@/context/users';
import { courseApi, applicationApi } from '@/services/api';

export default function LecturerPage() {
  const { isAuthenticated, role, ID } = useAuth();
  const router = useRouter();

  // state
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);

  // filters
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterSkills, setFilterSkills] = useState('');

  // protect route
  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (role !== 'lecturer') router.push('/');
  }, [isAuthenticated, role]);

  // fetch courses
  useEffect(() => {
    setLoadingCourses(true);
    courseApi.getAllCourses()
      .then(all => setCourses(all.filter(c => c.lecturerId === ID)))
      .finally(() => setLoadingCourses(false));
  }, [ID]);

  // fetch applications when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingApps(true);
    applicationApi.getApplicationByCourse(selectedCourse)
      .then(data => {
        setApplications(data);
        setFilterName(''); setFilterRole(''); setFilterAvailability(''); setFilterSkills('');
      })
      .finally(() => setLoadingApps(false));
  }, [selectedCourse]);

  // toggle chosen and ranking
  const toggleChosen = async (appId: number) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    const newChosen = !app.chosen;
    const newRanking = newChosen ? (app.ranking ?? 1) : -1;
    const updated = await applicationApi.editRankAndCommentAndChosen(appId, newRanking, app.comment ?? '', newChosen) as Application;
    setApplications(prev => prev.map(a => a.id === appId ? updated : a));
  };

  // save ranking/comment
  const handleSaveRanking = async (appId: number) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    const updated = await applicationApi.editRankAndCommentAndChosen(appId, app.ranking ?? 1, app.comment ?? '', true) as Application;
    setApplications(prev => prev.map(a => a.id === appId ? updated : a));
  };

    // compute visual metrics
  const selectedApps = applications.filter(a => a.chosen);
  const mostChosenApp = selectedApps.length
    ? selectedApps.reduce((p, c) => (c.ranking! > p.ranking! ? c : p))
    : null;
  const mostChosen = mostChosenApp
    ? `${mostChosenApp.name} (${mostChosenApp.role})`
    : 'None';
  const leastChosenApp = selectedApps.length
    ? selectedApps.reduce((p, c) => (c.ranking! < p.ranking! ? c : p))
    : null;
  const leastChosen = leastChosenApp
    ? `${leastChosenApp.name} (${leastChosenApp.role})`
    : 'None';
  const vacant = applications
    .filter(a => !a.chosen)
    .map(a => `${a.name} (${a.role})`);

  // filtered list
  const filteredApps = applications.filter(app => {
    if (filterName && !app.name.toLowerCase().includes(filterName.toLowerCase())) return false;
    if (filterRole && app.role !== filterRole) return false;
    if (filterAvailability && app.availability !== filterAvailability) return false;
    if (filterSkills) {
      const skillsList = filterSkills.split(',').map(s => s.trim().toLowerCase());
      if (!skillsList.every(skill => app.skills.map(s => s.toLowerCase()).includes(skill))) return false;
    }
    return true;
  });

  return (
    <Box pl='350px' pr='50px' pt='100px'>
      <NavBar />
      <Box maxW='4xl' mx='auto' mt={8}>
        <Heading mb={4}>My Courses</Heading>
        {loadingCourses ? <Spinner /> : (
          <Select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value=''>Select A Course</option>
            {courses.map(c => <option key={c.id} value={c.courseCode}>{c.courseName}</option>)}
          </Select>
        )}

        {selectedCourse && (
          <Box mt={6}>
            <Heading size='md' mb={3}>Filters</Heading>
            <Stack spacing={3} direction={['column', 'row']}>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={filterName} onChange={e => setFilterName(e.target.value)} />
            </FormControl>

            <FormControl>
                <FormLabel>Role</FormLabel>
                <Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                    <option value=''>All</option>
                    <option value='Tutor'>Tutor</option>
                    <option value='Lab Assistant'>Lab Assistant</option>
                </Select>
            </FormControl>

            <FormControl>
                <FormLabel>Availability</FormLabel>
                <Select value={filterAvailability} onChange={e => setFilterAvailability(e.target.value)}>
                    <option value=''>Any</option>
                    <option value='Full Time'>Full-Time</option>
                    <option value='Part Time'>Part-Time</option>
                    </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Skills</FormLabel>
                <Input value={filterSkills} onChange={e => setFilterSkills(e.target.value)} />
            </FormControl>
            </Stack>

            {/* Visual Representation */}
            <Heading size='md' mt={6} mb={2}>Summary</Heading>
            <SimpleGrid columns={3} spacing={4} mb={6}>
              <Box p={4} borderWidth={1} borderRadius='md'><Text>Most Chosen:</Text><Text fontWeight='bold'>{mostChosen}</Text></Box>
              <Box p={4} borderWidth={1} borderRadius='md'><Text>Least Chosen:</Text><Text fontWeight='bold'>{leastChosen}</Text></Box>
              <Box p={4} borderWidth={1} borderRadius='md'><Text>Vacant Applicants:</Text>{vacant.length>0 ? vacant.map((n,i)=><Text key={i}>{n}</Text>) : <Text>None</Text>}</Box>
            </SimpleGrid>
          </Box>
        )}

        <VStack spacing={4} mt={6} align='stretch'>
          {loadingApps && <Spinner />}
          {!loadingApps && filteredApps.map(app => (
            <Box key={app.id} p={4} bg='gray.50' borderRadius='md'>
              <HStack justify='space-between'>
                <Text fontWeight='bold'>{app.name}</Text>
                <Checkbox isChecked={app.chosen} onChange={() => toggleChosen(app.id)}>Chosen</Checkbox>
              </HStack>
              <Text>Role: {app.role}</Text>
              <Text>Availability: {app.availability}</Text>
              <Text>Academics: {app.academics}</Text>
              <Text>Skills: {app.skills.join(', ')}</Text>
              {app.chosen && (
                <HStack mt={3} spacing={3}>
                  <FormControl w='120px'>
                    <FormLabel>Rank</FormLabel>
                    <NumberInput min={1} value={app.ranking ?? 1} onChange={(_, val) => setApplications(prev => prev.map(a => a.id===app.id?{...a,ranking:val}:a))}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper /><NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Comment</FormLabel>
                    <Input value={app.comment||''} onChange={e=>setApplications(prev=>prev.map(a=>a.id===app.id?{...a,comment:e.target.value}:a))} />
                  </FormControl>
                  <Button colorScheme='blue' onClick={()=>handleSaveRanking(app.id)}>Save</Button>
                </HStack>
              )}
            </Box>
          ))}
          {!loadingApps && filteredApps.length===0 && <Text>No applicants found.</Text>}
        </VStack>
      </Box>
    </Box>
  );
}

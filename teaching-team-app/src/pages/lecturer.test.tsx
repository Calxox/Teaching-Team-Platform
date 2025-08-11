import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Lecturer from '@/pages/lecturer';
import { useAuth } from '@/components/Auth';
import { useRouter } from 'next/router';

import '@testing-library/jest-dom';


jest.mock('@/components/Auth', () => ({
    useAuth: jest.fn(),
}))

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

jest.mock('@/components/Nav', () => () => <div>NavBar</div>);

const test =[
    {
        ID: 1,
        name: 'John Anderson',
        previousRole: 'Tutor',
        roleApplied: 'Tutor',
        CourseCode: 'COSC2758',
        Skills: ['React', 'TypeScript'],
        availability: 'Full Time',
        Academics: 'Bachelor of Software Engineering',
    },
    {
        ID: 3,
        name: 'Jack Coolmen',
        previousRole: 'Tutor',
        roleApplied: 'Tutor',
        CourseCode: 'COSC2758',
        Skills: ['React', 'Next'],
        availability: 'Full Time',
        Academics: 'Bachelor of Information Technology',
    },
];

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('candidates', JSON.stringify(test));
    localStorage.setItem('users', JSON.stringify([{ email: 'k.nguyen@rmit.edu.au', password: '1', role: 'lecturer' }]));
    localStorage.setItem('user', JSON.stringify({ name: 'Kevin Nguyen', role: 'lecturer' }));
  
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      role: 'lecturer',
    });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

describe('Lecturer Page', () => {
    
    it('filtering for name', () => {
        render(<Lecturer/>);
        fireEvent.change(screen.getByPlaceholderText('Search by Tutor Name'), {
            target: { value: 'John Anderson' },
        });
        expect(screen.getByText('John Anderson')).toBeInTheDocument();
        expect(screen.queryByText('Jack Coolman')).not.toBeInTheDocument();
    });

    it('displaying most and least and vacant candidates', () => {
        localStorage.setItem(
            'rankings',
            JSON.stringify({
              'COSC2758-1': { candidateID: 1, rank: 1, comment: 'Great!' },
            })
          );
          render(<Lecturer />);
          expect(screen.getByText('Most Chosen Applicant:')).toBeInTheDocument();
          expect(screen.getAllByText('John Anderson')[0]).toBeInTheDocument();
          expect(screen.getByText('Least Chosen Applicant:')).toBeInTheDocument();
          expect(screen.getByText('Applicants Vacant')).toBeInTheDocument();
          expect(screen.getAllByText('Jack Coolmen')[0]).toBeInTheDocument();
    })
});


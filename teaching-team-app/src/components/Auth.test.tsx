import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './Auth';
import '@testing-library/jest-dom';
import { Button } from '@chakra-ui/react';

const test = {
  ID: 1,
  name: 'John Anderson',
  email: 'j.anderson@rmit.edu.au',
  password: 'password',
  role: 'lecturer',
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('login with valid user', () => {
    localStorage.setItem('users', JSON.stringify([test]));

    const TestingComponent = () => {
      const { login, isAuthenticated, role } = useAuth();
      return (
        <div>
          <Button onClick={() => login(test.email, test.password)}>Login</Button>
          <span data-testid="testAuth">{isAuthenticated ? 'loggedin' : 'logout'}</span>
          <span data-testid="testRole">Role: {role}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('testAuth')).toHaveTextContent('logout');
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('testAuth')).toHaveTextContent('loggedin');
    expect(screen.getByTestId('testRole')).toHaveTextContent('Role: lecturer');
  });

  it('logout', () => {
    localStorage.setItem('users', JSON.stringify([test]));
    localStorage.setItem('user', JSON.stringify(test));

    const TestingComponent = () => {
      const { isAuthenticated, logout } = useAuth();
      return (
        <div>
          <button onClick={logout}>logout</button>
          <span data-testid="testAuth">{isAuthenticated ? 'loggedin' : 'logout'}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('testAuth')).toHaveTextContent('loggedin');
    fireEvent.click(screen.getByText('logout'));
    expect(screen.getByTestId('testAuth')).toHaveTextContent('logout');
  });

  it('login with invalid user', () => {
    localStorage.setItem('users', JSON.stringify([test]));

    const TestingComponent = () => {
      const { login, isAuthenticated, role } = useAuth();
      return (
        <div>
          <Button onClick={() => login('adakdwmk@gmail.com', 'password')}>Login</Button>
          <span data-testid="testAuth">{isAuthenticated ? 'loggedin' : 'logout'}</span>
          <span data-testid="testRole">Role: {role}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestingComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('testAuth')).toHaveTextContent('logout');
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('testAuth')).toHaveTextContent('logout');
    expect(screen.getByTestId('testRole')).toHaveTextContent('Role:');
  });
});

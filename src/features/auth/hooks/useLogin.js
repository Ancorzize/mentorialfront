import { useState } from 'react';
import authService from '../../../api/authService'; 


const useLogin = (onLoginSuccess) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    const result = await authService.login(email, password);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleLogin,
  };
};


export default useLogin;
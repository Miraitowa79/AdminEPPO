import { jwtDecode }  from 'jwt-decode'
export const getAuthUser = () => {
  const authUser = localStorage.getItem('authUser');
  if (!authUser) {
    return '';
  }
  const auth = JSON.parse(authUser);
  if(auth?.token){
    const data = jwtDecode(auth?.token)
    return {
      ...auth,
      ...data
    }
  }
  return auth
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};
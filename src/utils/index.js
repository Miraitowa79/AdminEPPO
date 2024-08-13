export const getAuthUser = () => {
  const authUser = localStorage.getItem('authUser');
  if (!authUser) {
    return '';
  }
  return JSON.parse(authUser);
};
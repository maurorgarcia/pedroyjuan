import { useAuth } from '../contexts/AuthContext';

export function useIsAdmin() {
  const { user, profile, loading } = useAuth();
  const waitingProfile = !!user && profile === null && !loading;
  return {
    isAdmin: profile?.is_admin === true,
    loading: loading || waitingProfile,
  };
}

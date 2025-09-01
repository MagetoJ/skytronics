import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the auth context as a hook for consistency
export function useAuth() {
  return useAuthContext();
}

// This file exists for consistency with the directory structure
// The actual implementation is in @/contexts/AuthContext

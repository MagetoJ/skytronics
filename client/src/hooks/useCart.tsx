import { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartContext } from '@/contexts/CartContext';

// Re-export the cart context as a hook for consistency
export function useCart() {
  return useCartContext();
}

// This file exists for consistency with the directory structure
// The actual implementation is in @/contexts/CartContext

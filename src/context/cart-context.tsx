'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import type { Product, ProductColor } from '@/lib/products';
import { useToast } from "@/hooks/use-toast"

export type CartItem = {
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  id: string; // combination of product.id and color.hex
};

type CartState = {
  cart: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; color: ProductColor; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SET_STATE'; payload: CartState };

const initialState: CartState = {
  cart: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, color: ProductColor, quantity: number) => void;
} | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, quantity } = action.payload;
      const cartItemId = `${product.id}-${color.hex}`;
      const existingItem = state.cart.find(item => item.id === cartItemId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product, selectedColor: color, quantity, id: cartItemId }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('glamifyCart');
      if (storedCart) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glamifyCart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, color: ProductColor, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, color, quantity } });
    toast({
      title: "Added to Cart",
      description: `${product.name} (${color.name}) has been added to your cart.`,
    });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return { ...context.state, dispatch: context.dispatch, addToCart: context.addToCart };
}

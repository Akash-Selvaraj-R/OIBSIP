import { createContext, useContext, useState } from 'react';

const PizzaContext = createContext(null);

export const PizzaProvider = ({ children }) => {
  const [builder, setBuilder] = useState({
    step: 1,
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
    price: 0
  });

  const updateBuilder = (updates) => {
    setBuilder(prev => ({ ...prev, ...updates }));
  };

  const toggleVegetable = (veg) => {
    setBuilder(prev => {
      const vegetables = prev.vegetables.includes(veg)
        ? prev.vegetables.filter(v => v !== veg)
        : [...prev.vegetables, veg];
      return { ...prev, vegetables };
    });
  };

  const resetBuilder = () => {
    setBuilder({
      step: 1,
      base: null,
      sauce: null,
      cheese: null,
      vegetables: [],
      price: 0
    });
  };

  const calculatePrice = (basePrice, saucePrice, cheesePrice, vegPrices) => {
    const total = (basePrice || 0) + (saucePrice || 0) + (cheesePrice || 0) +
      (vegPrices || []).reduce((sum, p) => sum + p, 0);
    updateBuilder({ price: total });
    return total;
  };

  return (
    <PizzaContext.Provider value={{ builder, updateBuilder, toggleVegetable, resetBuilder, calculatePrice }}>
      {children}
    </PizzaContext.Provider>
  );
};

export const usePizza = () => {
  const context = useContext(PizzaContext);
  if (!context) throw new Error('usePizza must be used within PizzaProvider');
  return context;
};

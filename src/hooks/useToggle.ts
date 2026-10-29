import { useState } from 'react';

export default function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((prev) => !prev);
  };

  return [value, toggle];
}
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const Search = styled.input`
  height: 20px;
  background-color: #131313;
  color: white;
  font-family: miles;
  border: 1px solid black;
  border-radius: 10px;
  padding-left: 10px;
`;

interface SearchInputProps {
  onSearch: (value: string) => void
}
function SearchInput({ onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');
  const [nextValue, setNextValue] = useState('');

  React.useEffect(() => {
    if (nextValue.length <= 0 || value === nextValue) {
      return;
    }
    const timeout = setTimeout(() => {
      onSearch(nextValue);
      setValue(nextValue);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, nextValue, onSearch]);

  const onChange = useCallback((e) => {
    setNextValue(e.target.value);
  }, []);

  return (
    <Search type="text" placeholder="Search..." onChange={onChange} value={nextValue} />
  );
}

export default SearchInput;

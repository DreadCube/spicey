import React from 'react';
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
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (value.length <= 0) {
      return;
    }
    const timeout = setTimeout(() => {
      onSearch(value);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, onSearch]);

  const onChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <Search type="text" placeholder="Search..." onChange={onChange} value={value} />
  );
}

export default SearchInput;

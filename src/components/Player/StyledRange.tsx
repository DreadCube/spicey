import styled from 'styled-components';

const StyledRange = styled.input`
  width: 100%;
  height: 24px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background: inherit;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #00FFFF;
    background: #000000;
    border-radius: 50px;
    border: 0px solid #00FFFF;
  }


  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
  }


  &:focus::-webkit-slider-runnable-track {
    background: #000000;
  }

  &::-moz-range-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #00FFFF;
    background: #000000;
    border-radius: 50px;
    border: 0px solid #00FFFF;
  }

  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
  }

  &::-ms-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-ms-fill-lower {
    background: #000000;
    border: 0px solid #00FFFF;
    border-radius: 100px;
    box-shadow: 0px 0px 0px #00FFFF;
  }

  &::-ms-fill-upper {
    background: #000000;
    border: 0px solid #00FFFF;
    border-radius: 100px;
    box-shadow: 0px 0px 0px #00FFFF;
  }

  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
  }

  &:focus::-ms-fill-lower {
    background: #000000;
  }

  &:focus::-ms-fill-upper {
    background: #000000;
  }
`;

export default StyledRange;

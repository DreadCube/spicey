import React from 'react'

import { Navigate, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const Title = styled.span`
  font-family: corma;
  color: #00ffff;
  font-size: 80px;
  line-height: 1;
`

const SubTitle = styled.span`
  font-family: miles;
  text-transform: uppercase;
  color: white;
  font-size: 15px;
  line-height: 1;
  font-weight: bold;
`

const Frame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const FrameAlt = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`

const Logo: React.FC = () => {
  return (
    <Frame>
      <Title>Spicey</Title>
      <SubTitle>Audius Player</SubTitle>
    </Frame>
  )
}

const LogoAlt = () => {
  const navigate = useNavigate()

  const handleClick = React.useCallback(() => {
    navigate('/')
  }, [navigate])
  
  return (
    <FrameAlt onClick={handleClick}>
      <Title>Spicey</Title>
      <SubTitle>Audius Player</SubTitle>
    </FrameAlt>
  )
}

export default Logo
export {
    LogoAlt
}
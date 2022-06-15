import styled from 'styled-components';

interface TextProps {
    type?: 'primary' | 'secondary'
}
const Text = styled.span<TextProps>`
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        cursor: pointer;
    }

    ${({ type = 'default' }) => {
    switch (type) {
      case 'primary':
        return `
            font-family: corma;
            color: #00ffff;
        `;

      case 'secondary':
        return `
            color: rgb(255, 0, 169);
            font-family: corma;
        `;

      default:
        return `
            font-family: miles;
            text-transform: uppercase;
            color: white;
            font-size: 12px;
        `;
    }
  }}
`;

export default Text;

import styled from 'styled-components'
import { layout, space, flexbox, LayoutProps, SpaceProps, FlexboxProps } from 'styled-system'

type Props = LayoutProps & SpaceProps & FlexboxProps;

export const Base = styled.input<Props>`
  border: 0.125rem solid ${(props) => props.theme.colors.gray};
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(props) =>
      props.theme.colors[props.color ? props.color : 'black']};
  background: ${(props) => props.theme.colors.white};
  transform-origin: left;
  transition: all 0.25s ease-in-out;

  &:hover, &:active, &:focus {
      color: ${(props) => props.theme.colors.black};
      background: ${(props) =>
          props.theme.colors[props.color ? props.color : 'white']};
      border: 0.125rem solid ${(props) => props.theme.colors.black};
      outline: none;
  }
  ${layout}
  ${space}
  ${flexbox}
`

import styled from 'styled-components'
import { layout, space, flexbox, color, LayoutProps, SpaceProps, FlexboxProps, ColorProps } from 'styled-system'

type Props = LayoutProps & SpaceProps & FlexboxProps & ColorProps;

export const Base = styled.button<Props>`
  all: unset;
  cursor: pointer;
  padding: .5rem 1rem;
  background: ${(props) => props.theme.colors.lightgray};
  color: ${(props) => props.theme.colors.gray};
  &:hover {
      color: ${(props) =>
          props.theme.colors[props.color ? props.color : 'black']};
  }
  ${layout}
  ${space}
  ${flexbox}
  ${color}
`

export const Link = styled.button<Props>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${layout}
  ${space}
  ${flexbox}
  ${color}
`
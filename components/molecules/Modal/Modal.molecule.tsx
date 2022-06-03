import { Button } from 'components/atoms';
import React, {useMemo} from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import theme from 'theme';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: flex-end;
`

type Props = React.ComponentProps<'div'> & {
  isOpen: boolean;
  onRequestModalClose(): void;
  onCancel(): void;
  onSubmit(): void;
  submitText?: string;
  cancelText?: string;
};

export const Base: React.FC<Props> = ({
  isOpen,
  onCancel,
  onRequestModalClose,
  onSubmit,
  submitText = 'OK',
  cancelText = 'Cancel',
  ...props
}) => {
  const modalStyle: ReactModal.Styles = useMemo(
    () => ({
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        zIndex: 99,
        overflow: 'auto',
      },
      content: {
        top: '25%',
        margin: 'auto',
        left: '50%',
        width: 800,
        right: 'auto',
        bottom: 'auto',
        marginLeft: -400,
        overflow: 'hidden',
        backgroundColor: '#DCDCDC'
      },
    }),
    [],
  );

  return (
    <ReactModal
      style={modalStyle}
      isOpen={isOpen}
      onRequestClose={onRequestModalClose}
      ariaHideApp={false}>
      <Wrapper>
        <ContentWrapper>
          {props.children}
        </ContentWrapper>
        <ButtonWrapper>
          <Button.Base backgroundColor={theme.colors.lightgray} color={theme.colors.gray} m={1} onClick={onCancel}>
            {cancelText}
          </Button.Base>
          <Button.Base backgroundColor={theme.colors.blue} color={theme.colors.white} m={1} onClick={onSubmit}>
            {submitText}
          </Button.Base>
        </ButtonWrapper>
      </Wrapper>
    </ReactModal>
  );
};

//#endregion

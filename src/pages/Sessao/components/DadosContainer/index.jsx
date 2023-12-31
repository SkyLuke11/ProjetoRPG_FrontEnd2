import { Body, Container, HeaderContainer } from './styles';
import { Dado } from './components/dado';
import { useState } from 'react';
import { ModalAddDado } from './components/ModalAddDado';
import { Modal } from '../../../../components/Modals/Modal';
import { ButtonAdd } from '../../../../components/ButtonAdd';

export function DadosContainer({ data }) {

  const [dados, setDados] = useState(data)
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false)

  return (
    <Container>

      <Modal isOpen={modalAddIsOpen} setClose={() => setModalAddIsOpen(false)}>
        <ModalAddDado atualizar={setDados} setModalClose={() => setModalAddIsOpen(false)} />
      </Modal>

      <HeaderContainer>
        <h1>Dados</h1>
        <ButtonAdd className='edit' onClick={() => setModalAddIsOpen(true)} />
      </HeaderContainer>

      <hr />

      <Body nulo={dados.length == 0}>
        {dados.map(dado => <Dado key={dado.id} data={dado} atualizar={setDados} dados={dados} />)}
      </Body>

    </Container>
  );
}
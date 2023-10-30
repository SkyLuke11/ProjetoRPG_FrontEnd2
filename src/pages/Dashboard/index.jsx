import { io } from 'socket.io-client';
import * as S from './styles'
import React, { useState, useEffect } from "react";
import { Modal } from "../../components/Modals/Modal";
import { api } from "../../services/api";
import {useAuth} from '../../hooks/useAuth'
import {useTitle} from '../../hooks/useTitle'
import { toast } from 'react-toastify';
import { AddSessao } from './AddSessao';
import { AddFicha } from './AddFicha';
import { ModalAddSessao } from '../../components/Modals/ModalAddSessao';
import { Sessao } from './Sessao';
import { Ficha } from './Ficha';
import { Convite } from './Convite';

const socket = io(api.defaults.baseURL);

export default function Dashboard() {

  const { setTitle } = useTitle()
  const {user} = useAuth()

  const [modalCriarSessaoIsOpen, setModalCriarSessaoIsOpen] = useState(false);

  const [sessoes, setSessoes] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [convites, setConvites] = useState([])

  useEffect(() => {

    async function fetchData() {

      try {

        setTitle('Carregando...')

        const response = await api.get(`/usuarios/dashboard/${user.id}`)

        setSessoes(response.data.sessao)
        setFichas(response.data.ficha)
        setConvites(response.data.convites)

      } catch (error) { console.log(error) }
      finally {
        setTitle('Painel')
        document.title = `Registro Paranormal - Painel`
      }
    }
    fetchData();

    async function atualizarConvites({email}) {

      const responseConvite = await api.get(`/sessoes/convite/${email}`)
      setConvites(responseConvite)
      toast('Você recebeu um convite!')
  
    }
    socket.on(`enviado.convite?${user.email}`, atualizarConvites)

  }, []);

  return (
    <S.Container>

      <Modal isOpen={modalCriarSessaoIsOpen} setClose={() => setModalCriarSessaoIsOpen(false)}>
        <ModalAddSessao setModalClose={() => setModalCriarSessaoIsOpen(false)} setSessoes={setSessoes}/>
      </Modal>

      <S.ContainerDiv>
        <h1>Sessões</h1>
        <hr />
        <S.DivFlex>
          <AddSessao setModalOpen={() => setModalCriarSessaoIsOpen(true)}/>
          {convites.map(convite => <Convite data={convite} convites={convites} setConvites={setConvites}/>)}
          {sessoes.map(sessao => <Sessao key={sessao.id} data={sessao} sessoes={sessoes} setSessoes={setSessoes}/>)}
        </S.DivFlex>
      </S.ContainerDiv>

      <S.ContainerDiv>
        <h1>Fichas</h1>
        <hr />
        <S.DivFlex>
          <AddFicha/>
          {fichas.map(ficha => <Ficha key={ficha.id} data={ficha} fichas={fichas} setFichas={setFichas}/>)}
        </S.DivFlex>
      </S.ContainerDiv>

    </S.Container>
  );
}
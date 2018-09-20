import firebase from 'firebase';
import b64 from 'base-64';
import _ from 'lodash';

import {
    MODIFICA_ADICIONA_CONTATO_EMAIL,
    ADICIONA_CONTATO_ERRO,
    ADICIONA_CONTATO_SUCESSO,
    LISTA_CONTATO_USUARIO,
    MODIFICA_MENSAGEM,
    LISTA_CONVERSA_USUARIO,
    LIMPAR_MENSAGEM,
    ENVIA_MENSAGEM_SUCESSO
} from './types';

export const modificaAdicionaContatoEmail = texto => {
    return {
        type: MODIFICA_ADICIONA_CONTATO_EMAIL,
        payload: texto
    }
}

export const adicionaContato = email => {

    return dispatch => {
        let emailB64 = b64.encode(email);

        firebase.database().ref(`/contatos/${emailB64}`)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    //email do contato que queremos adicionar
                    const dadosUsuario = _.first(_.values(snapshot.val()));
                    console.log(dadosUsuario);

                    //email do usuário autenticado
                    const { currentUser } = firebase.auth();
                    let emailUsuarioB64 = b64.encode(currentUser.email);

                    firebase.database().ref(`/usuario_contatos/${emailUsuarioB64}`)
                        .push({ email, nome: dadosUsuario.nome })
                        .then(() => adicionaContatoSucesso(dispatch))
                        .catch(erro => adicionaContatoErro(erro.message, dispatch))

                } else {
                    dispatch(
                        {
                            type: ADICIONA_CONTATO_ERRO,
                            payload: 'E-mail informado não corresponde a um usuário válido!'
                        }
                    )
                }
            })
    }
}

const adicionaContatoErro = (erro, dispatch) => (
    dispatch(
        {
            type: ADICIONA_CONTATO_ERRO,
            payload: erro
        }
    )
)

const adicionaContatoSucesso = dispatch => (
    dispatch(
        {
            type: ADICIONA_CONTATO_SUCESSO,
            payload: true
        }
    )
)

export const habilitaInclusaoContato = () => (
    {
        type: ADICIONA_CONTATO_SUCESSO,
        payload: false
    }
)

export const contatosUsuarioFetch = () => {
    // Captura o usuário atual e associa a uma constante
    const { currentUser } = firebase.auth();

    /** Dispatch controla o fluxo da aplicação, fazendo que ela espere pelo retorno da fnção **/
    return (dispatch) => {
        /** codifica o email do usuário atual para a base 64, a fim de que o firebase entenda **/
        let emailUsuarioB64 = b64.encode(currentUser.email);
        /** acessa o firebase e cria um novo path 'usuario_contatos/email' **/
        firebase.database().ref(`/usuario_contatos/${emailUsuarioB64}`)
            /** .on fica ouvindo alterações no firebase, sempre que houver, a função dentro dele é executada.
             *  .on recebe qual será o evento "value", e uma função de callback que retorna uma foto(snapshot) 
             *  da base sempre que o evento for disparado */
            .on("value", snapshot => {
                dispatch({ type: LISTA_CONTATO_USUARIO, payload: snapshot.val() })
            })
    }
}

export const modifcaMensagem = texto => {
    return ({
        type: MODIFICA_MENSAGEM,
        payload: texto
    })
}


export const enviarMensagem = (mensagem, contatoNome, contatoEmail) => {

    // dados do usuário autenticado (email)
    const { currentUser } = firebase.auth();
    usuarioEmail = currentUser.email;

    return dispatch => {
        // dados do contato (contatoNome e contatoEmail)       

        // Conversão para a base
        const usuarioEmailB64 = b64.encode(usuarioEmail);
        const contatoEmailB64 = b64.encode(contatoEmail);

        firebase.database().ref(`/mensagens/${usuarioEmailB64}/${contatoEmailB64}`)
            .push({ mensagem, tipo: 'e' })
            .then(() => {
                firebase.database().ref(`/mensagens/${contatoEmailB64}/${usuarioEmailB64}`)
                    .push({ mensagem, tipo: 'r' })
                    .then(() => dispatch({ type: ENVIA_MENSAGEM_SUCESSO }))
            })
            .then(() => { // armazenar o cabeçalho da conversa do usuário autenticado
                firebase.database().ref(`/usuario_conversas/${usuarioEmailB64}/${contatoEmailB64}`)
                    .set({ nome: contatoNome, email: contatoEmail })
            })
            .then(() => { // armazenar o cabeçalho da conversa do contato

                // Acesso o path contatos para capturar a propriedade nome do usuário
                firebase.database().ref(`contatos/${usuarioEmailB64}`)
                    .once("value")
                    .then(snapshot => {
                        // transforma o snapshot num array para acessar suas propriedades
                        const dadosUsuario = _.first(_.values(snapshot.val()))

                        // armazena o cabeçalho da conversa para o contato
                        firebase.database().ref(`/usuario_conversas/${contatoEmailB64}/${usuarioEmailB64}`)
                            .set({ nome: dadosUsuario.nome, email: usuarioEmail })
                    })
            });
    }
}

export const conversaUsuarioFetch = contatoEmail => {
    // Dados do usuário logado
    const { currentUser } = firebase.auth();

    // Composição dos nós na base 64
    let usuarioEmailB64 = b64.encode(currentUser.email);
    let contatoEmailB64 = b64.encode(contatoEmail);

    return (dispatch) => {
        firebase.database().ref(`mensagens/${usuarioEmailB64}/${contatoEmailB64}`)
            .on("value", snapshot => {
                dispatch({ type: LISTA_CONVERSA_USUARIO, payload: snapshot.val() })
            })
    }
}
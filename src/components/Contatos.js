import React, { Component } from 'react';
import { View, Text, ListView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { contatosUsuarioFetch } from '../actions/AppActions';
import { Actions } from 'react-native-router-flux';


class Contatos extends Component {

    componentWillMount() {
        this.props.contatosUsuarioFetch();
        this.criaFonteDeDados(this.props.contatos)
    }

    /**
     * Este método é executado automáticamente sempre que há alterações nas props do component
     * @param {*} nextProps - Este é o objeto que o método recebe, nele estão as props atualizadas.
     */
    componentWillReceiveProps(nextProps) {
        // Esta é a forma de enviar o conteúdo atualizado das props para um método. Neste caso, o método vai preencher o datasource.
        this.criaFonteDeDados(nextProps.contatos);
    }

    /**
     * Método para criar e popular o dataSource 
     * @param {*} contatos - É a props recebida no mapStateToProps
     */
    criaFonteDeDados(contatos) {
        /** Criar uma instância de ListView, chamando o método que cria a fonte de dados.
         *  este método recebe uma função de callBack que contém uma chave que verifica 
         *  se houve mudança. Através da chave o datasource verifica se o regsitro é ou não uma linha nova **/
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        /**
         * Está é a função reponsável por passar os dados para a fonte de dados.
         * Os dados da fonte não são mutáveis, por isto é necessário usar o método
         * cloneWithRows que recebe um array e calcula as diferenças entre os dados imutáveis do DS com os novos dados.
         * **/
        // this.fonteDeDados - cria uma variável acessivel em toda classe
        this.fonteDeDados = ds.cloneWithRows(contatos)

    }

    renderRow(contato) {
        return (
            <TouchableHighlight
                onPress={() => Actions.conversa({ title: contato.nome, contatoNome: contato.nome, contatoEmail: contato.email })}
            >
                <View style={{ flex: 1, padding: 20, borderBottomWidth: 1, borderColor: '#CCC' }} >
                    <Text style={{ fontSize: 20 }}>{contato.nome}</Text>
                    <Text style={{ fontSize: 18 }}>{contato.email}</Text>
                </View>
            </TouchableHighlight>

        )
    }



    render() {
        return (
            <ListView
                // Remove os alertas da tela quando se renderiza arrays vazios e os submetemos ao dataSource. 
                enableEmptySections
                // diz quais os dados a inserir no datasource
                dataSource={this.fonteDeDados}
                /** Diz como cada um dos registros devem ser disposto no ListView 
                 *  renderRow que contém uma função de callback recebendo como parâmetro o registro em questão
                 *  e o que acontece com cada registro **/
                renderRow={this.renderRow}
            />
        )
    }
}

mapStateToProps = state => {
    /** Função que recebe o state do reducer e transforma em array, visto que o reducer manda um objeto.
     *  Lembrando que temos que importar o lodash.
     * A função map recebe um Objeto e uma função de callback que recupera os valores dos objeto e sua identificação **/
    const contatos = _.map(state.ListaContatosReducer, (val, uid) => {
        return { ...val, uid }
    })
    return { contatos }
}

export default connect(mapStateToProps, { contatosUsuarioFetch })(Contatos);

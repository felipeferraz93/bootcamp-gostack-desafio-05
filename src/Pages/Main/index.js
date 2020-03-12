import React, { Component } from 'react';

import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List, ErrorMessage} from './styles';



export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error:null,
    errormsg: '',
  };

  componentDidMount(){
    const repositories = localStorage.getItem('respositories');

    if(repositories){
      this.setState({ repositories: JSON.parse(repositories)});
    }
  }

  componentDidUpdate(_,prevState){

    const { repositories } = this.state;

    if (prevState.repositories !== this.state.repositories){
      localStorage.setItem('respositories',JSON.stringify(repositories))
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };



  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error:false });

    try{

    /**
     * verificação se o input esta vazio
     */

    const { newRepo, repositories} = this.state;

    if (newRepo ==='') throw new SyntaxError('Digite algum respositório!')

    /**
     * verificação se já existe o repositorio ja salvo
     */
    const hasRepo = repositories.find(r => r.name === newRepo);

    if (hasRepo) throw new SyntaxError ('Repositório duplicado');


    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

      this.setState({
        repositories: [...repositories, data ],
        newRepo: '',
        loading: false,

      })

    }catch (error){
      this.setState({ error: true,errormsg: error.message});

    }
    finally{
      this.setState({ loading: false });
    }


  };

  render() {
    const { newRepo, repositories, loading, error,errormsg} = this.state;

    return (
      <Container>
        <h1>
          <FaGithub />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar respositório"
            value={newRepo}
            onChange={this.handleInputChange}

          />

          <SubmitButton loading={loading}>

            {loading ? (
            <FaSpinner color="#Fff" size={14}/>)
            :
            ( <FaPlus color="#fff" size={14} />)}

          </SubmitButton>



        </Form>

        {error &&
        <ErrorMessage error={errormsg}>
            <p>{errormsg}</p>
        </ErrorMessage>
        }


        <List>
              {repositories.map(repository =>(
                <li key={repository.name}>
                  <span>{repository.name}</span>
                  <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>

                </li>
              ))}
        </List>

      </Container>
    );
  }
}

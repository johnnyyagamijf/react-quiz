import React, { Component } from 'react';
import axios from 'axios';

import Api from './Services/Api'
import pokemonsModel from './Pokemon';
import './Quiz.css'
import { tsImportEqualsDeclaration } from '@babel/types';

export default class Quiz extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listPokemons: [],
            indexPokemon: 1,
            indexFinal: 5,
            index: 20,
            url: '',
            inputValue: '',
            acertos: 0,
            erros: 0,
            options: [],
            numPokemon: '',
            correta: '',
            pokemonsQuest: []
        }
    }

    componentDidMount() {
        this.loadPokemons();
    }


    loadPokemons = async() => {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=1&limit=${20}`);
        const ttt = response.data.results.map(resp => resp.name);
        console.log('pokemons list ',ttt);

        var maximo = 964;

        var i, numbers = [];
        for (i = 0; i < maximo; i++) {
            numbers[i] = i + 1;
        }

        var p, n, tmp;
        for (p = ttt.length; p;) {
            n = Math.random() * p-- | 0;
            tmp = ttt[n];
            ttt[n] = ttt[p];
            ttt[p] = tmp;
        }

        var teste = ttt.slice(1, 30);

        var r = [];
        for (var y = 0; y < teste.length; y++) {
            for (var j = 0; j < response.data.results.length; j++) {
                if (teste[y] === response.data.results[j].name) {
                    r.push(response.data.results[j])
                }
            }
        }

        await this.setState({ listPokemons: r });
        console.log(this.state.listPokemons)

        const ops = this.state.listPokemons.filter((pokemon, index) => {
            console.log(index);
            return index >= 1 && index < 3
        });

        console.log('array load pokemons', this.state.indexPokemon);
        console.log(ops);
        this.setState({ listPokemons: r, numPokemon: ops[this.state.indexPokemon].url.split('/')[6] });
        ops.push(r[0]);

        this.setState({ options: ops, correta: ops[this.state.indexPokemon].name });
        alert('a resposta correta é ' + this.state.correta);

    }

    shuffle = (array) => {
        var currentIndex = array.lenght,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    letterUpperCase = (word) => {
        return word.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    }

    showAlert = async(event) => {
        const value = event.currentTarget.textContent.toLowerCase();
        alert(value);

        await this.setState({ indexFinal: parseInt(this.state.indexFinal) + 1 });
        await this.setState({ indexPokemon: parseInt(this.state.indexPokemon) + 1 });


        if (value === this.state.correta) {
            const a = parseInt(this.state.acertos) + 1;
            this.setState({ acertos: a });
            alert('Quantidade de acertos ' + this.state.acertos);
        } else {
            this.setState({ erros: parseInt(this.state.erros) + 1 })

            alert('Quantidade de erros ' + this.state.erros);
        }

        const ops = this.state.listPokemons.filter((pokemon, index) => {
            return index >= this.state.indexPokemon && index < this.state.indexFinal
        });

        alert('meu index é ' + this.state.indexPokemon)
        alert(ops[this.state.indexPokemon].url);
        const valueUrl = ops[this.state.indexPokemon].url.split('/')[6];

        this.setState({ numPokemon: valueUrl, correta: ops[this.state.indexPokemon].url.split('/')[5] })
        this.setState({ options: ops, correta: ops[this.state.indexPokemon].name })

        console.log('o valor da resposta é ', this.state.correta);
    }

    render() {

        const urlImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.state.numPokemon}.png`;

        return (

            <div className = "container" >
            <div className = "sub-container" >
            <h2> Quem é esse pokemon ? </h2> 
            <article >
            <img src = { urlImg } alt = "" />
            </article> 
            <div className = "quest" > {
                this.state.options.map(option => ( 
                    <div key = { option.name } > < p onClick = { this.showAlert } > { this.letterUpperCase(option.name) }
                    </p></div>
                ))
            } </div> 
            </div> 
            </div>
        );
    }
}
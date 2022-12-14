const express = require ('express')
const app = express()
const axios = require('axios');
//erro comum: esquecer de chamar a função
//json 
//não faça isso: app.use(express.json)
app.use(express.json())

const {v4 : uuidv4} = require('uuid');

const observacoesPorLembreteId = {};

//localhost:5000/lembretes/123456/observacoes
app.post('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const { texto } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const observacoesDoLembrete = 
        observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({id: idObs, texto});
    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;
    await axios.post('http://localhost:10000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id
        }
    })
    res.status(201).send(observacoesDoLembrete);
})

//localhost:5000/lembretes/abcd/observacoes
app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
})

app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({msg: 'ok'});
  })
  
app.listen(5000, () => console.log('Observações. Porta 5000.'))
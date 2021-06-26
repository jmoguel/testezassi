const express = require('express');
const { RepositoryUtils } = require('./repository-utils');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/entity', async (req, res) => {
    const connection = await RepositoryUtils.createConnection();
    try {
        const entities = await RepositoryUtils.getEntities(connection);
        connection.end();
        res.json(entities);
    } catch(err){
        await connection.end();
        rres.status(400).send({"err":error})
    }
});

app.post('/entity', async (req, res)=> {
    const connection = await RepositoryUtils.createConnection();
    try {
        const entity = {
            id: 0,
            name: req.body.name,
            description: req.body.description,
            created_on: new Date()
        }
        const result = await RepositoryUtils.createEntity(connection, entity);
        entity.id = result.insertId;
        connection.end();
        res.send(entity);
    } catch(err){
        await connection.end();
        res.status(400).send({"err":error})
    }
    
});
  
app.put('/entity/:id', async (req, res)=> {
    const connection = await RepositoryUtils.createConnection();
    try {
        const entity = await RepositoryUtils.getEntityById(connection,req.params.id);
        if(!entity)
            throw new Error(`The entity id: ${req.params.id} doesn't exist`);
        if(req.body.name)
            entity.name = req.body.name;
        if(req.body.description)
            entity.description = req.body.description;
        await RepositoryUtils.updateEntity(connection, entity);
        connection.end();
        res.send(entity);
    } catch(err){
        await connection.end();
        res.status(400).send({"error":err.message})
    } 
});

app.delete('/entity/:id', async (req, res)=> {
    const connection = await RepositoryUtils.createConnection();
    try {
        const result = await RepositoryUtils.deleteEntity(connection,req.params.id);
        if(result.affectedRows == 0)
            throw new Error(`The entity id: ${req.params.id} doesn't exist`);
        connection.end();
        res.send({});
    } catch(err){
        await connection.end();
        res.status(400).send({"error":err.message})
    } 
});
  
app.listen(port, () => {
    console.log(`Test crud evaluation for Ezassi at http://localhost:${port}`)
});
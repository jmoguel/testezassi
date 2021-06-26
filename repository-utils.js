var DB_CONFIG = require("./config.js").DB_CONFIG;

var mysql = require('promise-mysql');

var RepositoryUtils = {};

var parseSqlResult = function (resultSet) {
    return JSON.parse(JSON.stringify(resultSet));
}

RepositoryUtils.createConnection = async function(){
  return await mysql.createConnection(DB_CONFIG);
}

RepositoryUtils.getEntities = async function(connection){
    let rowsSql = await connection.query("select * from entities order by id asc");
    return parseSqlResult(rowsSql);
}

RepositoryUtils.createEntity = async function(connection, entity){
    let result = await connection.query("insert into entities values(0,?,?,?)",[entity.name,entity.description,entity.created_on]);
    return parseSqlResult(result);
}

RepositoryUtils.getEntityById = async function(connection, id){
    let rowsSql = await connection.query("select * from entities where id = ?",[id]);
    let rows = parseSqlResult(rowsSql);
    return (rows && rows.length>0) ? rows[0] : null;
}

RepositoryUtils.updateEntity = async function(connection, entity){
   let result = await connection.query("update entities set name=?,description=? where id=?",[entity.name,entity.description,entity.id]);
   return parseSqlResult(result);
}

RepositoryUtils.deleteEntity = async function(connection, id){
    let result = await connection.query("delete from entities where id=?",[id]);
   return parseSqlResult(result);
}
exports.RepositoryUtils = RepositoryUtils;
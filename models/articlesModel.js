'use strict';
/*jshint multistr: true */

const db = require('../psql/connection.js');

function articleModelFunctions(){

  function getAll(){
    return new Promise(function(resolve,reject){
      db.query('SELECT * FROM articles')
      .then(resolve)
      .catch(function(error){
        reject(error);
      });
    });
  }


  function resetArticles(){
    return new Promise(function(resolve, reject){
      db.query('TRUNCATE TABLE articles')
      .then(resolve)
      .catch(function(error){
        reject(error);
      });
    });
  }


  function addArticle(newArticle, callback){

    db.query('INSERT INTO articles (\
              title, body, author)\
              VALUES ($1, $2, $3);',
              [
              newArticle.title,
              newArticle.body,
              newArticle.author
              ])
    .then(function(){
      callback(null);
    })
    .catch(function(error){
      callback(error);
    });

  }

  function getTitle(id, callback){
    db.query('SELECT * FROM articles\
              WHERE id = $1', id)
    .then(function(article){
      callback(article);
    })
    .catch(function(error){
      callback(error);
    });
  }

  function changeArticle(id, changes, callback){
    db.query('UPDATE articles\
              SET title = $1, body = $2, author = $3\
              WHERE id = $4',
              [
              changes.title,
              changes.body,
              changes.author,
              id
              ])
    .then(function(){
      callback(null);
    })
    .catch(function(error){
      callback(error);
    });
  }

  function deleteArticle(id, callback){
    db.query('DELETE FROM articles\
              WHERE id = $1',
              id)
    .then(function(){
      callback(null);
    })
    .catch(function(error){
      callback(error);
    });  }

  return {
    resetArticles : resetArticles,
    getAll : getAll,
    addArticle : addArticle,
    getTitle : getTitle,
    changeArticle : changeArticle,
    deleteArticle : deleteArticle
  };
}

module.exports = articleModelFunctions();
import { Request, Response } from 'express';
import db from '../config/lib/db';

export const createSequence = function (req: Request, res: Response) {

  var time = Date.now();
  var file_name = req.body.project_name + '_' + time + '.json';
  var old_file_name = 'old_' + time + '.json';
  var file_path = '/tmp/';

  const raw_data = {
    project_json: req.body.project_json,
  };

  db.query(
    'INSERT INTO raw_table SET ?',
    raw_data,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        throw err;
      }

      // redirect to index page
      res.redirect('/');
    }
  );

  // select_ old json
  var old_json = '';
  db.query(
    'SELECT project_json FROM raw_table ORDER BY raw_idx DESC limit 1;',
    function(err, result, fields){
      old_json = result[0].project_json;
      console.log('-----------------------------------------------------------------');
      console.log('SELECT project_json FROM raw_table ORDER BY raw_idx DESC limit 1;');

      var f = require('fs');

      old_json = JSON.stringify(old_json);

      f.writeFileSync(file_path + old_file_name, old_json, err => {
        if (err){
          console.log(err)
        }

        f.close(old_file_name, () => {
          console.log("f close finished")
        });
      });

      // console.log(old_json);
    }
  );

  // insert_ new json
  db.query(
    'INSERT INTO raw_table SET ?',
    raw_data,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        throw err;
      }

      // redirect to index page
      //res.redirect('/');
    }
  );


  //dir call
  const fs = require('fs');
  const path = require("path");

  const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
  };

  const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
      .filter((file) => fs.lstateSync(path.join(dir, file)).isFile())
      .map((file) => ({file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };


  fs.exists(file_name, function(exists){

    if(exists){
      file_name = req.body.project_name + '_' + time + '_1.json';
    }
  });

  console.log('################################ WRITE START ################################');

  fs.writeFileSync(file_path + old_file_name, old_json, err => {
    if (err){
      console.log(err)
    }
    fs.close(old_file_name, () => {
      console.log("fs old file close finished")
    });
  });

  fs.writeFileSync(file_path + file_name, req.body.project_json, err => {
    if (err){
      console.log(err)
      throw err;
    }
    fs.close(file_name, () => {
      console.log("fs close finished")
    });
  });

  var old_json_file_name = file_name;

  const { exec } = require("child_process");

  var command = "python3 /home/ubuntu/projects/slatool-server/src/controllers/pyparser.py ";
  command += file_path + old_json_file_name + " ";
  command += file_path + file_name + " ";

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    const readline = require('readline');

    var dict = {};
    dict['block_added'] = 0;
    dict['block_copied'] = 0;
    dict['block_removed'] = 0;
    dict['block_order_changed'] = 0;
    dict['block_position_changed'] = 0;
    dict['block_input_changed'] = 0;
    dict['block_not_changed'] = 0;
    dict['other_changed'] = 0;

    var arr = stdout.split('\n');
    for (var item of arr) {
      if(item === '') {
        continue;
      }
      dict[item]++;
    }
//    console.log(dict);

    const section_data = {
      project_name:             req.body.project_name,
      user_idx:                 req.body.user_idx,
      block_added:              dict['block_added'],
      block_copied:             dict['block_copied'],
      block_removed:            dict['block_removed'],
      block_order_changed:      dict['block_order_changed'],
      block_position_changed:   dict['block_position_changed'],
      block_input_changed:      dict['block_input_changed'],
      block_not_changed:        dict['block_not_changed'],
      other_changed:            dict['other_changed'],
      help:                     req.body.help,
      submit:                   req.body.submit
    };

    db.query('INSERT INTO section_table SET ?', section_data, function (err, rows, fields) {
        if (err) {
          console.log(err);
          throw err;
        }
      });
    });

  //res.redirect('/');

};

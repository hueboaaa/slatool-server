import mysql from 'mysql2';

import config from '../config';

const db = mysql.createConnection(config.aws.rds);

export default db;

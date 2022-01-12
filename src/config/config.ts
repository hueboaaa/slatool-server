/**
 * Default configuration
 */
const defaultConfig = {
  app: {
    title: 'Scratch Server',
    description: 'Scartch3 for JOE'
  },
  host: process.env.HOST || '0.0.0.0',
  domain: process.env.DOMAIN || 'slatool.com',
  port: parseInt(process.env.PORT, 10) || 3000,
  templateEngine: 'ejs',

  sessionCookie: {
    maxAge: 24 * (60 * 60 * 1000),
    httpOnly: true,
    secure: false
  },

  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET
    },
    rds: {
      host:
        process.env.RDS_HOSTNAME ||
        'database-4.csbtdowhufrq.ap-northeast-2.rds.amazonaws.com',
      user: process.env.RDS_USERNAME || 'admin',
      database: process.env.RDS_USERNAME || 'scratch',
      password: process.env.RDS_PASSWORD || 'whwhwh123',
      port: parseInt(process.env.RDS_PORT, 10) || 3306
    }
  },

  uploads: {
    dest: './public/uploads/',
    limits: {
      fileSize: 20 * 1024 * 1024
    }
  }
};

export default defaultConfig;

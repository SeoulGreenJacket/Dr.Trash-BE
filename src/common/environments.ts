export const database = {
  config: {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
  },
  tables: {
    user: `"${process.env.DATABASE_SCHEMA}"."user"`,
    token: `"${process.env.DATABASE_SCHEMA}"."token"`,
    trash: `"${process.env.DATABASE_SCHEMA}"."trash"`,
    trashcan: `"${process.env.DATABASE_SCHEMA}"."trashcan"`,
    achievement: `"${process.env.DATABASE_SCHEMA}"."achievement"`,
    achiever: `"${process.env.DATABASE_SCHEMA}"."achiever"`,
    trashcanUsage: `"${process.env.DATABASE_SCHEMA}"."trashcanUsage"`,
    trashcanCode: `"${process.env.DATABASE_SCHEMA}"."trashcanCode"`,
    article: `"${process.env.DATABASE_SCHEMA}"."article"`,
  },
};

export const jwt = {
  accessConfig: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
  },
  refreshConfig: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  },
};

export const kakao = {
  config: {
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_CALLBACK_URL,
  },
};

export const redis = {
  config: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  },
  keys: {
    userPoint: 'user-point',
    userTrash: 'user-trash',
    achievementNotification: 'achievement-notification',
  },
};

export const kafka = {
  host: process.env.KAFKA_HOST,
  port: parseInt(process.env.KAFKA_PORT),
  topic: {
    tracker: process.env.KAFKA_TOPIC_TRACKER,
  },
};

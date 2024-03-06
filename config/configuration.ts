export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  google: {
    app_password: process.env.GOOGLE_APP_PASSWORD,
    app_email: process.env.ORIGIN_EMAIL,
  },
  auth: {
    secret: process.env.JWT_SECRET,
  },
});

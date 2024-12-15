import dotenv from 'dotenv';


dotenv.config()

const URL = process.env.DATABASE_URL!
console.log(URL)
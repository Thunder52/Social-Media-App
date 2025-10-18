const Sequelize=require('sequelize');
const dotenv =require('dotenv')

dotenv.config();

const sequilize=new Sequelize(process.env.NAME,process.env.USER,process.env.PASS,{
    host:process.env.HOST,
    dialect:'mysql',
    logging:false,
    pool:{max:5,min:1,idle:1000}
});

(async()=>{
    try {
        await sequilize.authenticate()
        console.log('Database is connected');
    } catch (error) {
        console.log(error);
    }
})()
 
module.exports=sequilize;
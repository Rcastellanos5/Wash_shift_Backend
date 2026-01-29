import { exit } from "node:process";
import { db } from "../config/db";

const clearData = async () => {
    try{
        await db.sync({ force: true });
        console.log("Data cleared successfully.");
        // Exit the process after clearing data
        exit(0);


    }catch(error){
        // Log the error and exit with a failure code
        exit(1);
    }
    
}
if (process.argv[2] === '--clear') {
    clearData();
}

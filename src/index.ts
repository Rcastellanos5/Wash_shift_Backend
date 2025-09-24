import colors from 'colors'
import server from './server'
//Se le aisna un puerto 
const port = process.env.PORT || 4000
//Se arranca el servidor 
server.listen(port, () => {
    console.log( colors.cyan.bold( `REST API en el puerto ${port}`))
})
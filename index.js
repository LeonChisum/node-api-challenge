const express = require("express")

const actionsRouter = require('./routers/actionsRouter')
const projectsRouter = require('./routers/projectsRouter')

const server = express()
const port = process.env.PORT || 4000

server.use(express.json())


server.use("/api/actions", actionsRouter)
server.use("/api/projects", projectsRouter)

server.use((req, res) => {
    res.status(400).json({ message: "no route found" })
})

server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import aeronaveRoutes from './routes/aeronaves'
import funcionarioRoutes from './routes/funcionarios'
import etapaRoutes from './routes/etapas'
import pecaRoutes from './routes/pecas'
import testeRoutes from './routes/testes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/aeronaves', aeronaveRoutes)
app.use('/funcionarios', funcionarioRoutes)
app.use('/aeronaves', etapaRoutes)
app.use('/aeronaves', pecaRoutes)
app.use('/aeronaves', testeRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`AeroCode API rodando em http://localhost:${PORT}`)
})

// server.js
const express = require('express');
const { performWebSearch, formatResultsForModel } = require('./lib/webSearch');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint de health check (obrigatório para o Koyeb)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint de busca
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const maxResults = parseInt(req.query.max) || 5;
    
    const resultados = await performWebSearch(query, { maxResults });
    const formatado = formatResultsForModel(query, resultados);
    
    res.json(formatado);
  } catch (error) {
    console.error('[server] Erro no endpoint /search:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

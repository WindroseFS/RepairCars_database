const express = require('express');
const News = require('../models/News');
const router = express.Router();

// GET /api/news - Listar todas as notícias com paginação e filtros
router.get('/', async (req, res) => {
  try {
    const { 
      categoria, 
      destaque, 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'dataPublicacao',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtro
    const filter = {};
    if (categoria && categoria !== 'Todas') filter.categoria = categoria;
    if (destaque) filter.destaque = destaque === 'true';
    if (search) {
      filter.$text = { $search: search };
    }

    // Opções de paginação e ordenação
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    };

    // Executar query com paginação
    const news = await News.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    // Contar total para paginação
    const total = await News.countDocuments(filter);

    res.json({
      news,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/news/destaques - Notícias em destaque
router.get('/destaques', async (req, res) => {
  try {
    const destaques = await News.find({ destaque: true })
      .sort({ dataPublicacao: -1 })
      .limit(5);

    res.json(destaques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/news/categorias - Listar categorias disponíveis
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await News.distinct('categoria');
    res.json(['Todas', ...categorias]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/news/:id - Buscar notícia por ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    // Incrementar visualizações
    news.visualizacoes += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/news - Criar nova notícia
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      conteudo,
      data,
      imageUrl,
      categoria,
      autor,
      tags,
      destaque
    } = req.body;

    // Validar campos obrigatórios
    if (!titulo || !descricao || !conteudo || !data) {
      return res.status(400).json({ error: 'Título, descrição, conteúdo e data são obrigatórios' });
    }

    const news = new News({
      titulo,
      descricao,
      conteudo,
      data,
      imageUrl: imageUrl || null,
      categoria: categoria || 'Geral',
      autor: autor || 'RepairCars Oficina',
      tags: tags || [],
      destaque: destaque || false
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/news/:id - Atualizar notícia
router.put('/:id', async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      conteudo,
      data,
      imageUrl,
      categoria,
      autor,
      tags,
      destaque
    } = req.body;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descricao,
        conteudo,
        data,
        imageUrl,
        categoria,
        autor,
        tags,
        destaque
      },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    res.json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/news/:id - Deletar notícia
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    res.json({ message: 'Notícia deletada com sucesso', deletedNews: news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/news/search/:query - Buscar notícias por texto
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const news = await News.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await News.countDocuments({ $text: { $search: query } });

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      query
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
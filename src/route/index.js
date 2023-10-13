// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Purchase {}
// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      img: 'https://picsum.photos/250/300',
      title: 'MI xciomi',
      description: 'Intel Core i7 / SSD 1TB / RAM 48 GB',
      category: [
        { id: 1, text: 'Ready to delivery' },
        { id: 2, text: 'TOP' },
      ],
      pric: 32000,
    },
  })
})
module.exports = router

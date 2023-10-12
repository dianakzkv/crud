// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
const productList = [
  {
    id: 27634,
    name: 'Стильна сукня',
    description:
      'Елегантна сукня з натуральної тканини для особливих випадків.',
    price: 1550,
  },
  {
    id: 38561,
    name: 'Спортивны кросівки',
    description:
      'Зручні та стильні кросівки для активного способу життя.',
    price: 1200,
  },
  //  інші товари
]

class Product {
  id = Math.floor(10000 + Math.random() * 90000)
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description

    this.date = new Date().toISOString()
  }

  static getList = () => this.#list

  static add(product) {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  ///=================================
  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (product, data) => {
    if (data) {
      product.data = data
    }
  }
}

// router.get Створює нам один ентпоїнт
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// ↑↑ сюди вводимо JSON дані

// ================================================================

router.get('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  //   console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Product created',
    href: '/product-list',
    openPage: 'List of products',
    status: 'Successful ✅',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  res.render('product-list', {
    style: 'product-list',
    productList,
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      //   product: product, // Передати об'єкт товару в шаблон
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
      href: '/product-list',
      openPage: 'List of products',
      status: 'Unsuccessful ❌',
    })
  }
})

// router.post('/user-update', function (req, res) {
// 	const { email, password, id } = req.body
// 	const user = User.getById(Number(id))
// 	let result = false
// 	if (user.verifyPassword(password)) {
// 	  User.update(user, { email })
// 	  result = true
// 	}

// 	res.render('success-info', {
// 	  style: 'success-info',
// 	  info: result ? 'Email updated' : 'Error...',
// 	})
//   })

// Підключаємо роутер до бек-енду
module.exports = router

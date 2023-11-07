// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}
// ================================================================
Product.add(
  './img/comp-icon.png',
  'APPLE MacBook Pro 14',
  'M1 MAX 64/8TB Custom New (Z15G000DW) Space Gray',
  [
    { id: 1, text: 'Ready to delivery' },
    { id: 2, text: 'TOP' },
  ],
  40000,
  12,
)
Product.add(
  './img/comp-icon.png',
  'Ноутбук LENOVO',
  'ThinkPad P16 G1 T (21D6001JRA) RAM 16 GB',
  [{ id: 1, text: 'Ready to delivery' }],
  34000,
  5,
)
Product.add(
  './img/comp-icon.png',
  'ACER Predator Triton',
  '17X PTX17-71 (NH.QK3EU.001) HDD 1TB',
  [{ id: 1, text: 'Ready to delivery' }],
  25000,
  10,
)
Product.add(
  './img/comp-icon.png',
  'APPLE MacBook Pro 14',
  'M1 MAX 64/8TB Custom New (Z15G000DW) Space Gray',
  [
    { id: 1, text: 'Ready to delivery' },
    { id: 2, text: 'TOP' },
  ],
  22000,
  55,
)
Product.add(
  './img/comp-icon.png',
  'APPLE MacBook Pro 14"',
  'M1 MAX 64/8TB Custom New (Z15J000DU) Silver',
  [
    { id: 1, text: 'Ready to delivery' },
    { id: 2, text: 'TOP' },
  ],
  55000,
  32,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.2

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()
  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }
  static getList = () => {
    // return Purchase.#list
    //   .map((item) => {
    //     const {
    //       id,
    //       product: { title },
    //       totalPrice,
    //       bonus,
    //     } = item
    //     return { id, title, totalPrice, bonus }
    //   })
    //   .reverse()
    return Purchase.#list.reverse().map((purchase) => ({
      id: purchase.id,
      product: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: Purchase.calcBonusAmount(purchase.totalPrice),
    }))
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('Summer2021', 0.9)
Promocode.add('disc50', 0.5)
Promocode.add('sale25', 0.25)

//=============================================
router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})
//=============================================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
//=============================================
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Unsuccess',
        info: 'Incorrect amount',
        href: `/purchase-product?id=${id}`,
        openPage: 'product page',
      },
    })
  }

  console.log(id, amount)

  const product = Product.getById(id)

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Unsuccess',
        info: 'This amount of item is currently out of stock',
        href: `/purchase-product?id=${id}`,
        openPage: 'product page',
      },
    })
  }

  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} pcs)`,
          price: productPrice,
        },
        {
          text: 'Delivery',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
//=============================================
router.post('/purchase-submit', function (req, res) {
  console.log(req.body)
  console.log(req.query)

  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,

    comment,
    bonus,
    promocode,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Unsuccess',
        info: 'Products not found',
        href: `/purchase-list`,
        openPage: 'Purchase list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Unsuccess',
        info: 'Haven`t the required amount.',
        href: `/purchase-list`,
        openPage: 'Purchase list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Unsuccess',
        info: 'Incorrect data',
        href: `/purchase-list`,
        openPage: 'Purchase list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        status: 'Complete the required fields',
        info: 'Incorrect data',
        href: `/purchase-list`,
        openPage: 'Purchase list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      bonus,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      status: 'Success',
      info: 'Order created',
      href: `/purchase-list`,
      openPage: 'Purchase list',
    },
  })
})
//=============================================
router.get('/purchase-list', function (req, res) {
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: Purchase.getList(),
    },
  })

  console.log(Purchase.getList())
})
//=============================================
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  console.log(Purchase.getById(id))
  const bonus = Purchase.calcBonusAmount(
    purchase.totalPrice,
  )

  res.render('purchase-info', {
    style: 'purchase-info',
    // purchase: Purchase.getById(id),
    purchase: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      delivery: purchase.delivery,

      product: purchase.product.title,
      comment: purchase.product.comment,

      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
    },
  })
})
//=============================================
router.get('/purchase-info-edit', function (req, res) {
  const id = Number(req.query.id)

  //   console.log(id)
  //   console.log(Purchase.getById(id))
  // .render('purchase-info-edit', {
  //     style: 'purchase-info-edit',
  //     purchase: Purchase.getById(id),
  //   })
  //   res

  const purchase = Purchase.getById(id)

  if (purchase) {
    res.render('purchase-info-edit', {
      style: 'purchase-info-edit',
      purchase: purchase,
    })
  }
})

router.post('/purchase-info-edit', function (req, res) {
  const id = Number(req.query.id)
  let { firstname, lastname, phone, email, delivery } =
    req.body
  const purchase = Purchase.getById(id)
  console.log(purchase)

  const newPurchase = Purchase.updateById(id, {
    firstname,
    lastname,
    phone,
    email,
    delivery,
  })
  console.log(newPurchase)

  if (newPurchase) {
    res.render('purchase-info', {
      style: 'purchase-info',
      purchase: newPurchase,
    })
  }
})

// router.post('/purchase-info', function (req, res) {
//   const id = Number(req.query.id)
//   let { lastName, firstName, email, phone } = req.body
//   const purchase = Purchase.getById(id)
//   lastName = Number(lastName)
//   firstName = Number(firstName)
//   email = Number(email)
//   phone = Number(phone)

//   Purchase.updateById(id, {
//     lastName,
//     firstName,
//     email,
//     phone,
//   })

//   res.render('purchase-info', {
//     style: 'purchase-info',
//     purchase: purchase,
//   })
// })
//=============================================
//=============================================

module.exports = router

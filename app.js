const dotenv = require('dotenv');
const store = require('store')
let express = require('express');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token') 
const formidable = require('formidable');
const passport = require('passport'); 
const initPass = require('./passpost-config');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
let app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
const nodemailer = require('nodemailer');
app.set('view engine', 'pug');
let mysql = require('mysql');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lusypevensy',
  database: 'products'
});
app.listen(3000, function () {
  console.log('node express work on 3000');
});
app.get('/', function (req, res) {
  let cat = new Promise(function (resolve, reject) {
    con.query(
      "select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 4",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM category",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  Promise.all([cat, catDescription]).then(function (value) {
    console.log(value[0]);
    res.render('index', {
      goods: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1])),
    });
  });
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/decode', function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const data = await jwt.decode(fields.token);
    res.json(data);
    });;
});
app.get('/register', function (req, res) {
  res.render('register');
});
app.post('/register', async function (req, res) {
  try{
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const hashedPass = await bcrypt.hash(fields.password,10)
      con.query(`INSERT INTO products.users (email,name,password,role) VALUES('${fields.email}', '${fields.name}', '${hashedPass}','user')`, function (error, result, fields) {
        if (error) throw error;
        console.log(result)
        res.json(result);
      });
  })
  }catch{
    // res.redirect('register');
  }
});
app.post('/login', async function (req,res){
  let form = new formidable.IncomingForm();
  form.parse(req, async  function (err, fields, files) {
    con.query(`SELECT * FROM users WHERE email = '${fields.email}'`, async (error, result) => {
      if (error) {
        res.status(400).send(error)
      }
      const user = result[0];
      console.log(user);
      if(!user){
        res.json({message: "There is no user with such email"})
      }
      try {
        console.log("try");
        if(await  bcrypt.compare(fields.password, user.password)) {
          const {SECRET_KEY} = dotenv.config().parsed;
          console.log(SECRET_KEY);
          let token = await jwt.sign({ name: user.name, id: user.id, role: user.role }, SECRET_KEY ,{ expiresIn: '24h' });
          let refreshToken = await randtoken.uid(256);
          store.set('user', { token:token,refreshToken:refreshToken })
          res.status(200).json({
            token,
            refreshToken,
            success: true,
            name: user.name, 
            role: user.role,
            id: user.id
          })
        } else {
          res.json({
            message: 'Not allowed'
          })
        }
      } catch {
        res.status(500).json()
      }
    })
  })
})

app.get('/category', function (req, res) {
  console.log(req.query.id);
  let catId = req.query.id;
  let sortRequest = "";
  if(req.query.page === 0){
    window.location.replace(`${window.location.origin}/category?id=${req.query.id}&sort=${req.query.sort}&page=1`)
  }
  if(req.query.sort && req.query.sort === "asc" || req.query.sort === "desc"){
    let sortParam = req.query.sort;
    sortRequest += ` ORDER BY cost ${sortParam}` 
  }

  let cat = new Promise(function (resolve, reject) {
    con.query(
      'SELECT * FROM category WHERE id=' + catId ,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  let count = new Promise(function (resolve, reject) {
    con.query(
      'SELECT COUNT(*) FROM goods WHERE category=' + catId ,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  const pages = Math.ceil(count/4);
  console.log("params",req.params)
  let goods = new Promise(function (resolve, reject) {
    con.query(
      'SELECT * FROM goods WHERE category= ' + catId + sortRequest + ` LIMIT ${(req.query.page - 1) * 4}, 4`,
      function (error, result) {
        if (error) reject(error);
        resolve(result);
      });
  });
  console.log("goods",goods)

  Promise.all([cat, goods,count]).then(function (value) {
    console.log(value[0]);
    res.render('category', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1])),
      count: value[2][0]['COUNT(*)'],
      pages: pages,
      currentPage: req.query.page,
      sort: req.query.sort
      
    });
  })
  
});

app.get('/count', function (req, res) {
  console.log(req.query.id);
  con.query('SELECT COUNT(*) FROM goods WHERE category=' + req.query.id, function (error, result, fields) {
    res.json(Math.ceil(result[0]["COUNT(*)"]/4));
  });
});
app.get('/goods', function (req, res) {
  console.log(req.query.id);
  con.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fields) {
    if (error) throw error;
    res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
  });
});
app.get('/update',verifyToken, function (req, res) {
  const {SECRET_KEY} = dotenv.config().parsed;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      console.log(req.query.id);
      con.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fields) {
        if (error) throw error;
        res.render('update', { goods: JSON.parse(JSON.stringify(result)) });
        console.log(result);
      });
    }
  });
  
});
app.post('/update', verifyToken, function (req, res) {
  const {SECRET_KEY} = dotenv.config().parsed;
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      let form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        con.query(`UPDATE goods SET name = '${fields.name}', description = '${fields.description}', cost = ${parseFloat(fields.price)}, image = '${fields.image}', category = ${parseInt(fields.category)} WHERE id = ${parseInt(fields.id)}`, function (error, result, fields) {
          if (error) throw error;
          console.log(result)
          res.json(result);
        });
      })
    }
  });
 
});
app.get('/search', function (req, res) {
  console.log(req.query.id);

  con.query('SELECT * FROM goods WHERE name LIKE "%' + req.query.name + '%"', function (error, result, fields) {
    if (error) throw error;
    res.render('search', { goods: JSON.parse(JSON.stringify(result)), name : req.query.name });
  });
});

app.get('/order', function (req, res) {
    res.render('order');
});
app.get('/create', function (req, res) {
  res.render('create');
});
app.post('/create', function (req, res) {
  let form = new formidable.IncomingForm();
  let image;
  form.parse(req, function (err, fields, files) {
    con.query(`INSERT INTO products.goods (name,description,cost,category,image) VALUES('${fields.name}', '${fields.description}', ${parseFloat(fields.price)},${parseInt(fields.category)}, '${fields.image}')`, function (error, result, fields) {
      if (error) throw error;
      console.log(result)
      res.json(result);
    });
  })
});
app.delete('/delete', function (req, res) {
  con.query(`DELETE FROM goods WHERE id=${req.body.id}`, function (error, result, fields) {
    if (error) throw error;
    console.log(result)
    res.json(result);
  });
});
app.post('/get-category-list', function (req, res) {
  // console.log(req.body);
  con.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    console.log(result)
    res.json(result);
  });
});

app.post('/add-to-cart', function (req, res) {
//   console.log(req.body.key);
  if (req.body.key.length != 0) {
    con.query('SELECT id,name,cost FROM goods WHERE id IN (' + req.body.key.join(',') + ')', function (error, result, fields) {
      if (error) throw error;
      console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }
      res.json(goods);
    });
  }
  else {
    res.send('0');
  }
});


app.post('/finish-order', function (req, res) {
    console.log(req.body);
    if (req.body.key.length != 0) {
      let key = Object.keys(req.body.key);
      con.query(
        'SELECT id,name,cost FROM goods WHERE id IN (' + key.join(',') + ')',
        function (error, result, fields) {
          if (error) throw error;
          console.log(result);
          sendMail(req.body, result);
          res.send('1');
        });
    }
    else {
      res.send('0');
    }
  });
  
async function sendMail(data, result) {
  let res = `<h2>Order in DS shop </h2>`;
  let total = 0;
  for (let i =0; i < result.length; i++){
    res+= `<p>${result[i][`name`]} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} uah </p>`;
    total += result[i]['cost'] * data.key[result[i]['id']];
  }
  res += `<hr>`;
  res += `Total: ${total} uah`;
  res += `<hr>`;
  res += `Phone: ${data.phone}  `;
  res += `User: ${data.username}  `;
  res += `Address: ${data.address}  `;
  res += `Email: ${data.email}  `;
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });


  let info = await transporter.sendMail({
    from: data.email, // sender address
    to: "danielsadovskiy@gmail.com," + data.email , // list of receivers
    subject: "Order from DS SHOP", // Subject line
    text: "Your order", // plain text body
    html: res // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

}

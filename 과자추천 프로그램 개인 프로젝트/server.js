const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();



// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'infodb.ansan.ac.kr',
    user: 'i2351010',
    password: 'qqzxcvops12%',
    database: 'db2351010'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database');
});

// 미들웨어 설정
app.set('view engine', 'ejs');
app.use(express.static('public')); // 정적 파일(css 등)
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
app.get('/', (req, res) => {
    res.render('login'); // 기본 로그인 페이지 렌더링
});

app.get('/main', (req, res) => {
    const sql = 'SELECT * FROM snacks'; // `products` 테이블에서 모든 제품 가져오기
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching snackss:', err);
            res.status(500).send('Error fetching snacks');
        } else {
            res.render('shop', { snacks: results }); // `snacks` 데이터를 shop.ejs로 전달
        }
    });
});


app.get('/register', (req, res) => {
    res.render('register'); // 회원가입 페이지 렌더링
});

// 회원가입 처리
app.post('/register', (req, res) => {
    const { id, password } = req.body;
    const sql = 'INSERT INTO users (id, password) VALUES (?, ?)';
    db.query(sql, [id, password], (err) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        } else {
            res.redirect('/'); // 회원가입 성공 시 로그인 페이지로 이동
        }
    });
});

// 로그인 처리
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const sql = 'SELECT * FROM users WHERE id = ? AND password = ?';
    db.query(sql, [id, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Error logging in');
        } else if (results.length > 0) {
            res.redirect('/main'); // 로그인 성공 시 메인 페이지로 리다이렉트
        } else {
            res.status(401).send('Invalid ID or password'); // 로그인 실패
        }
    });
});



// 서버 실행
app.use(express.static('public'));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const express = require('express'); // Express 프레임워크 모듈을 불러옵니다.
const bodyParser = require('body-parser'); // 요청 바디를 파싱하기 위한 body-parser 모듈을 불러옵니다.
const mysql = require('mysql2'); // MySQL 연결을 위한 mysql2 모듈을 불러옵니다.
const session = require('express-session'); // 세션 사용을 위한 express-session 모듈을 불러옵니다.
const MySQLStore = require('express-mysql-session')(session); // MySQL을 이용한 세션 스토어를 설정하기 위한 express-mysql-session 모듈을 불러옵니다.
const cors = require('cors'); // Cross-Origin Resource Sharing(CORS) 처리를 위한 cors 모듈을 불러옵니다.

const app = express(); // Express 애플리케이션을 생성합니다.
app.use(cors()); // CORS 미들웨어를 적용합니다.

app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 요청 바디를 파싱합니다.
app.use(bodyParser.json()); // JSON 형식의 요청 바디를 파싱합니다.

// 세션 설정
const sessionStore = new MySQLStore({
  host: 'database-1.czzyww2dw0mt.ap-northeast-2.rds.amazonaws.com', // MySQL 호스트 주소를 설정합니다.
  user: 'root', // MySQL 사용자 이름을 설정합니다.
  password: 'qwer1234', // MySQL 비밀번호를 설정합니다.
  database: 'Record', // 사용할 데이터베이스 이름을 설정합니다.
  clearExpired: true, // 만료된 세션 데이터를 자동으로 삭제할지 여부를 설정합니다.
  checkExpirationInterval: 10 * 60 * 1000 // 만료된 세션을 확인하는 주기를 설정합니다. (10분)
});
app.use(session({
  secret: 'secret-key', // 세션을 암호화하기 위한 비밀 키를 설정합니다.
  resave: false, // 세션 데이터를 항상 저장할지 여부를 설정합니다.
  saveUninitialized: true, // 초기화되지 않은 세션 데이터도 저장할지 여부를 설정합니다.
  store: sessionStore, // 세션 스토어를 설정합니다.
  cookie: {
    maxAge: 60 * 60 * 1000 // 쿠키의 유효 기간을 설정합니다. (60분)
  }
})
);

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'database-1.czzyww2dw0mt.ap-northeast-2.rds.amazonaws.com', // MySQL 호스트 주소를 설정합니다.
  user: 'root', // MySQL 사용자 이름을 설정합니다.
  password: 'qwer1234', // MySQL 비밀번호를 설정합니다.
  database: 'Record', // 사용할 데이터베이스 이름을 설정합니다.
});
db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 중 오류 발생:', err.stack);
    return;
  }
  console.log('데이터베이스에 연결되었습니다');
});


//회원가입
app.post('/register', async (req, res) => {
  const { id, username, password, confirmPassword } = req.body;

  if (!id || !username || !password || !confirmPassword) {
    return res.status(400).send('아이디, 사용자 이름, 비밀번호, 비밀번호 재확인을 입력해주세요');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }

  const checkIdQuery = 'SELECT * FROM users WHERE id = ?';
  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';

  try {
    const [idResults, usernameResults] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(checkIdQuery, [id], (error, results) => {
          if (error) reject('기존 아이디 확인 중 오류 발생');
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(checkUsernameQuery, [username], (error, results) => {
          if (error) reject('기존 사용자 이름 확인 중 오류 발생');
          resolve(results);
        });
      }),
    ]);

    if (idResults.length > 0 && usernameResults.length > 0) {
      return res.status(400).send('이미 사용 중인 아이디와 사용자 이름입니다');
    } else if (idResults.length > 0) {
      return res.status(400).send('이미 사용 중인 아이디입니다');
    } else if (usernameResults.length > 0) {
      return res.status(400).send('이미 사용 중인 사용자 이름입니다');
    }

    const registerQuery = 'INSERT INTO users (id, username, password) VALUES (?, ?, md5(?))';
    db.query(registerQuery, [id, username, password], (error) => {
      if (error) {
        console.log('사용자 등록 중 오류 발생:', error);
        return res.status(500).send('사용자 등록 중 오류 발생');
      }

      res.status(200).send('회원가입이 성공적으로 완료되었습니다');
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});




//로그인
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).send('아이디와 비밀번호를 입력해주세요');
  }

  const checkUserQuery = 'SELECT * FROM users WHERE id = ? AND password = MD5(?)';
  db.query(checkUserQuery, [id, password], (error, results) => {
    if (error || results.length === 0) {
      return res.status(400).send('잘못된 아이디 또는 비밀번호입니다');
    }

    const user = results[0];
    req.session.userId = user.id;
    res.status(200).send(`${user.username}님 환영합니다`);
  });
});


//로그아웃
app.get('/logout', (req, res) => {
  if (req.session.userId) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send('로그아웃 중 오류가 발생하였습니다');
      }
      res.status(200).send('로그아웃에 성공하였습니다');
    });
  } else {
    res.status(400).send('로그인 상태가 아닙니다');
  }
});




// 사용자 정보 조회
app.get('/userdata', (req, res) => {
  if (req.session.userId) {
    const query = 'SELECT id, username FROM users WHERE id = ?';
    db.query(query, [req.session.userId], (error, results) => {
      if (error) {
        return res.status(500).send('사용자 정보 조회 중 오류 발생');
      }
      if (results.length > 0) {
        const user = results[0];
        res.status(200).json({ id: user.id, username: user.username });
      } else {
        res.status(404).send('사용자 정보를 찾을 수 없습니다');
      }
    });
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
});


// app.put('/userupdate', (req, res) => {
//   const { id, username, password } = req.body;
//   const userId = req.session.userId; // 현재 로그인된 사용자의 ID

//   if (!userId || !id || !username || !password) {
//     return res.status(400).send('모든 항목을 입력해야 합니다');
//   }

//   if (userId !== id) {
//     return res.status(403).send('권한이 없습니다');
//   }

//   const updateQuery = 'UPDATE users SET username = ?, password = MD5(?) WHERE id = ?';
//   db.query(updateQuery, [username, password, id], (error, results) => {
//     if (error) {
//       return res.status(500).send('사용자 정보 수정 중 오류 발생');
//     }
//     if (results.affectedRows === 0) {
//       return res.status(404).send('해당 사용자가 존재하지 않습니다');
//     }
//     res.status(200).send('사용자 정보가 성공적으로 수정되었습니다');
//   });
// });


//유저 정보 수정
app.put('/userupdate', (req, res) => {
  const { newId, username, password } = req.body;
  const currentUserId = req.session.userId; // 현재 로그인된 사용자의 ID

  if (!newId || !username || !password) {
    return res.status(400).send('모든 항목을 입력해야 합니다');
  }

  // 새로운 ID와 username이 이미 사용 중인지 확인
  const checkExistingQuery = 'SELECT * FROM users WHERE id = ? OR username = ?';
  db.query(checkExistingQuery, [newId, username], (checkError, checkResults) => {
    if (checkError) {
      return res.status(500).send('사용자 정보 확인 중 오류 발생');
    }

    // 사용 중인 ID 또는 username이 있는지 확인
    if (checkResults.length > 0) {
      if (checkResults.some(user => user.id === newId)) {
        return res.status(400).send('이미 사용 중인 아이디입니다');
      }
      if (checkResults.some(user => user.username === username)) {
        return res.status(400).send('이미 사용 중인 사용자 이름입니다');
      }
    }

    // 사용자 정보 업데이트
    const updateQuery = 'UPDATE users SET id = ?, username = ?, password = MD5(?) WHERE id = ?';
    db.query(updateQuery, [newId, username, password, currentUserId], (updateError, updateResults) => {
      if (updateError) {
        return res.status(500).send('사용자 정보 수정 중 오류 발생');
      }
      if (updateResults.affectedRows === 0) {
        return res.status(404).send('해당 사용자가 존재하지 않습니다');
      }
      // 세션 ID 업데이트
      req.session.userId = newId;
      res.status(200).send('사용자 정보가 성공적으로 수정되었습니다');
    });
  });
});




//텍스트 변환 기록 저장
app.post('/uploadTranscription', (req, res) => {

  
  const userId = req.session.userId;
  const { audioFileName, transcriptionText } = req.body;

  if (!userId) {
    return res.status(401).send('로그인이 필요합니다');
}


  if (!audioFileName || !transcriptionText) {
      return res.status(400).send('파일 이름과 변환된 텍스트를 모두 제공해야 합니다');
  }

  const insertQuery = 'INSERT INTO transcriptions (user_id, audio_file_name, transcription_text) VALUES (?, ?, ?)';
  db.query(insertQuery, [userId, audioFileName, transcriptionText], (error, results) => {
      if (error) {
          console.error('데이터 삽입 중 오류 발생:', error);
          return res.status(500).send('데이터 삽입 중 오류 발생');
      }
      res.status(200).send('음성 파일 업로드 및 변환 텍스트 저장 성공');
  });
});



//텍스트 변환 기록 가져오기
app.get('/allUserTranscriptions', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
      return res.status(401).send('로그인이 필요합니다');
  }

  const query = 'SELECT * FROM transcriptions WHERE user_id = ?';
  db.query(query, [userId], (error, results) => {
      if (error) {
          console.error('변환 기록 조회 중 오류 발생:', error);
          return res.status(500).send('변환 기록 조회 중 오류 발생');
      }
      res.status(200).json(results);
  });
});





app.listen(4000, () => {
    console.log('서버가 4000 포트에서 실행중입니다.');
});





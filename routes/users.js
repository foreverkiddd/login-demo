// express 모듈 셋팅
const express = require('express')
const router = express.Router()

let db = new Map()
var id = 1  // 하나의 객체를 유니크하게 구별하기 위함

router.use(express.json())   // http 외 모듈 'json' 미들웨어 생성

// 로그인
router.post('/login', (req, res) => {
    console.log(req.body)   // userId, pwd

    // userId가 DB에 저장된 회원인지 확인
    const {userId, pwd} = req.body
    var loginUser = search(userId)

    if (isExist(loginUser)) { // length === 1 일 것임
        // console.log(`같은 거 찾았다!`)
        // pwd도 맞는지 비교 (자료형도 같아야 함)
        if (loginUser.pwd === pwd) {
            // console.log(`패스워드 같습니다!`)
            res.status(200).json({
                message : `${loginUser.name}님 로그인 되었습니다.`
            })
        } else {
            res.status(400).json({
                message : `비밀번호가 틀렸습니다.`
            })
        }
    } else {
        res.status(404).json({
            message : `회원 정보가 없습니다.`
        })
    }
})

// db.forEach문 따로 추출
function search(searchId) {
    let foundUser = {}

    db.forEach(function(user, id) {
        // forEach문 통해서 db에서 받은 user.userId와
        // 내가 지금 body에서 받은 userId가 같으면?
        if (user.userId === searchId) {
            foundUser = user
        }
    })
    return foundUser
}

function isExist(obj) {
    if (Object.keys(obj).length) {
        return true
    } else {
        return false
    }
}

// 회원 가입
router.post('/join', (req, res) => {
    console.log(req.body)

    if (req.body == {}) {
        res.status(400).json({
            message : `입력 값을 다시 확인해주세요.`
        })
    } else {
        const {userId} = req.body
                // 이제 userId로 키값을 받음
        db.set(userId, req.body)

        // 상태코드는 201(등록 성공)
        res.status(201).json({
            // id값이 ++되었으므로 -1 해주기
            message : `${db.get(userId).name}님 회원 가입해주셔서 감사합니다!`
        })
    }
})

router
    .route('/users')
    
    // 회원 개별 조회
    .get((req, res) => {
        let {userId} = req.body
        // id = parseInt(id) // userId 문자열로 받으니 이제 필요 없음

        // console.log(id)

        const user = db.get(userId)
        if (user) {
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        } else {
            res.status(404).json({
                message : `회원 정보가 없습니다.`
            })
        }
    })

    // 회원 개별 탈퇴
    .delete((req, res) => {
        let {userId} = req.body

        const user = db.get(userId)
        if (user) {
            db.delete(userId)
    
            res.status(200).json({
                message : `${user.name}님 탈퇴가 완료되었습니다.`
            })
        } else {
            res.status(404).json({
                message : `회원 정보가 없습니다.`
            })
        }
    })

module.exports = router
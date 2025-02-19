// express 모듈 셋팅
const express = require('express')
const app = express()
app.listen(7777)

let db = new Map()
var id = 1  // 하나의 객체를 유니크하게 구별하기 위함

app.use(express.json())   // http 외 모듈 'json'

// 로그인
app.post('/login', (req, res) => {

})

// 회원 가입
app.post('/join', (req, res) => {
    console.log(req.body)

    if (req.body == {}) {
        res.status(400).json({
            message : `입력 값을 다시 확인해주세요.`
        })
    } else {
        db.set(id++, req.body)

        // 상태코드는 201(등록 성공)
        res.status(201).json({
            // id값이 ++되었으므로 -1 해주기
            message : `${db.get(id-1).name}님 회원 가입해주셔서 감사합니다!`
        })
    }
})

app
    .route('/users/:id')
    
    // 회원 개별 조회
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        // console.log(id)

        const user = db.get(id)
        if (user == undefined) {
            res.status(404).json({
                message : `회원 정보가 없습니다.`
            })
        } else {
            res.status(200).json({
                userId : user.userId,
                name : user.name
            })
        }
    })

    // 회원 개별 탈퇴
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if (user == undefined) {
            res.status(404).json({
                message : `회원 정보가 없습니다.`
            })
        } else {
            db.delete(id)
    
            res.status(200).json({
                message : `${user.name}님 탈퇴가 완료되었습니다.`
            })
        }
    })
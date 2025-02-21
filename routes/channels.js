// express 모듈 셋팅
const express = require('express')
const router = express.Router()

router.use(express.json())   // http 외 모듈 'json'

let db = new Map()
var id = 1  // 하나의 객체를 유니크하게 구별하기 위함

// 채널 개별 생성
router
    .route('/')
    // 채널 전체 조회
    .get((req, res) => {
        var {userId} = req.body
        var channels = []   // 대괄호로 변경

        // 예외 처리 2가지
        // 1) userId가 body에 없으면
        if (db.size && userId) { // db가 비어있지 않고 userId가 있을 때
                db.forEach((value, key) => {
                    if (value.userId == userId) {
                        channels.push(value)
                    }
                })
    
                // 2) userId가 가진 채널이 없으면
                if (channels.length) {  // channels의 값이 있으면
                    res.status(200).json(channels)
                } else {
                    notFoundChannel()
                }
        } else {
            notFoundChannel()
        }

        // console.log(channels[0])
        // console.log(channels[1])
        // console.log(channels[2])
    })
    // 채널 개별 생성
    .post((req, res) => {
        // const {channelTitle} = req.body // db에 저장하는 것이므로 굳이 꺼낼 필요 없음

        // channelTitle 값이 있으면
        if(req.body.channelTitle) {
            let channel = req.body
            db.set(id++, channel)

            res.status(201).json({
                message : `${db.get(id-1).channelTitle} 채널을 응원합니다!`
            })
        } else {
            res.status(400).json({
                message : `요청 값을 제대로 보내주세요.`
            })
        }
    })

router
    .route('/:id')
    // 채널 개별 조회
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {
            res.status(200).json(channel)
        } else {
            notFoundChannel()
        }
    })
    // 채널 개별 수정
    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle
        if (channel) {
            var newTitle = req.body.channelTitle

            channel.channelTitle = newTitle
            db.set(id, channel)

            res.json({
                message : `채널명이 정상적으로 수정되었습니다. 기존 : ${oldTitle} -> 수정 : ${newTitle}`
            })
        } else {
            notFoundChannel()
        }
    })
    // 채널 개별 삭제
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        if (channel) {
            db.delete(id)
            res.status(200).json({
                message : `${channel.channelTitle} 채널이 정상적으로 삭제되었습니다.`
            })
        } else {
            notFoundChannel()
        }
    })

function notFoundChannel() {
    res.status(404).json({
        message : `채널 정보를 찾을 수 없습니다.`
    })
}

module.exports = router
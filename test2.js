
const url = $request.url;
const body = $request.body;

if (url.includes('/purchase/buynowui/buynow')) {
  // 处理表单 POST 请求
  if (body) {
    const modifiedBody = body.replace(/products=[^&]*/, 'products=%5B%7B%22productId%22%3A%22C02D8ZHZC9SR%22%2C%22skuId%22%3A%220X3J%22%2C%22availabilityId%22%3A%22B3CFCZ9HQ8TL%22%7D%5D');
    // 将修改后的请求体重新赋值
    $done({ body: modifiedBody });
  } else {
    $done({});
  }
} else if (url.includes('/orders')) {
  // 处理 JSON POST 请求
  if (body) {
    let jsonBody = JSON.parse(body);
    jsonBody.items[0].availabilityId='B3CFCZ9HQ8TL'
    jsonBody.items[0].productId='C02D8ZHZC9SR'
    jsonBody.items[0].skuId='0X3J'
    // 将修改后的 JSON 字符串重新赋值给请求体
    $done({ body: JSON.stringify(jsonBody) });
  } else {
    $done({});
  }
} else {
  // 不处理其他请求
  $done({});
}

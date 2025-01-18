
const url = $request.url;
const body = $request.body;

if (url.includes('/purchase/buynowui/buynow')) {
  // 处理表单 POST 请求
  if (body) {
    const modifiedBody = body.replace(/products=[^&]*/, 'products=%5B%7B%22productId%22%3A%229NDWN4CBXPX7%22%2C%22skuId%22%3A%220010%22%2C%22availabilityId%22%3A%22B388XL464MZP%22%7D%5D');
    // 将修改后的请求体重新赋值
    $done({ body: modifiedBody });
  } else {
    $done({});
  }
} else if (url.includes('/orders')) {
  // 处理 JSON POST 请求
  if (body) {
    let jsonBody = JSON.parse(body);
    jsonBody.items[0].availabilityId='B388XL464MZP'
    jsonBody.items[0].productId='9NDWN4CBXPX7'
    jsonBody.items[0].skuId='0010'
    // 将修改后的 JSON 字符串重新赋值给请求体
    $done({ body: JSON.stringify(jsonBody) });
  } else {
    $done({});
  }
} else {
  // 不处理其他请求
  $done({});
}

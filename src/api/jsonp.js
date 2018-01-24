import originJsonp from 'jsonp';

function buildUrl (url, data){
  let params = [];
  for(let i in data){
    params.push(`${i}=${data[i]}`);
  }
  let param = params.join("&");
  if(url.indexOf('?') === -1){
    url += '?' + param;
  } else {
    url += "&" + param;
  }
  return url;
}

let jsonp = (url, data, option) => {
  return new Promise((resolve, reject) => {
    originJsonp(buildUrl(url, data), option, (err, data) => {
      if(!err){
        resolve(data);
      } else {
        reject(err)
      }
    })
  })
};

export default jsonp;
export default function log(msg: string) {

  //calling new date gets current time
  const dt = new Date();
  //interpolate hours, mins, secs
  const now = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}:${dt.getMilliseconds()}`;
  //return the formatted error
  console.log(`⚡[${now}][Server]: ${msg}`);
}
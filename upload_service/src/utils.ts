export function generate() {
  let id = "";
  const subString = "1234567890qwertyuiopasdfghjklzxcvbnm";
  const len = 5;
  for (let i = 0; i < len; i++) {
    id += subString[Math.floor(Math.random() * subString.length)];
  }
  return id;
}

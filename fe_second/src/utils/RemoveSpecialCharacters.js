export default function RemoveSpecialCharacters(str) {
  return str
    .replace(/[^a-zA-Z ]/g, " ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    .split(" ")
    .join("");
}

// 冒泡排序
const arr: (number | string)[] = [1, 3, 8, 9, 4, 2, 5, 7, 6];
function mySort(element: (number | string)[]): (number | string)[] {
  for (let i = 0; i < element.length - 1; i++) {
    for (let j = 0; j < element.length - 1 - i; j++) {
      if (element[j] > element[j + 1]) {
        let temp = element[j];
        element[j] = element[j + 1];
        element[j + 1] = temp;
      }
    }
  }
  return element;
}
const sortArr = mySort(arr);
console.log(sortArr);
// 数组去重
const arr2 = [1, 2, 3, 3, 3, 4, 5, 5, 6, 6, 7, 8, 9, 9];
function mySet(element: number[] | string[]): (number | string)[] {
  let newArr = [];
  for (let i = 0; i < element.length; i++) {
    if (element[i] != element[i + 1]) {
      newArr.push(element[i]);
    }
  }
  return newArr;
}
const setArr = mySet(arr2);
console.log(setArr);
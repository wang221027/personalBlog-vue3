// 冒泡排序
const arr = [1, 3, 8, 9, 4, 2, 5, 7, 6];
function mySort(element) {
  for (let i = 0; i < element.length - 1; i++) {
    for (let j = 0; j < element.length; j++) {
      if (element[j] < element[j + 1]) {
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
function mySet(element) {
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
// 手写call()方法
let person = {
  name: "张三",
  getName() {
    console.log(this.name);
  },
};
let man = {
  name: "你好",
};
Function.prototype._call = function (context) {
  if (typeof this !== "function") {
    throw new Error("this is not a function");
  } // 形参不一定会传
  context = context || window; // 取参数
  const args = [...arguments].slice(1);
  context.fn = this;
  const res = context.fn(args);
  delete context.fn;
  return res;
};
person.getName._call(man);
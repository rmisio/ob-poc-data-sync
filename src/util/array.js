// https://stackoverflow.com/a/7180095
export function move(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}

// https://stackoverflow.com/a/3955096
export function remove(arr = []) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

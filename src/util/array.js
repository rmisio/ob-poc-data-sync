// https://stackoverflow.com/a/7180095
export function move(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
}
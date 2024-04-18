export function GetUID() {
  return (
    JSON.parse(sessionStorage.getItem('user'))?.uid ||
    JSON.parse(localStorage.getItem('user'))?.uid
  );
}

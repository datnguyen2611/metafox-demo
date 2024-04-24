export default function comparePathName(pathA: string, pathB: string) {
  let result = false;

  if (pathA && pathB) {
    result = pathA.replace(/\/$/, '') === pathB.replace(/\/$/, '');
  }

  return result;
}

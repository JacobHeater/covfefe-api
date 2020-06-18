export const serverPort = 5555;
export function serverResource(url = ''): string {
  if (!url) {
    url = '';
  }

  return `http://localhost:${serverPort}/${url}`;
}

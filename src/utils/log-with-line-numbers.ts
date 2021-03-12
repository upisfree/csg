function logWithLineNumbers(str) {
  let i = 1;
  const numbered = str.replace(/^/gm, () => `${ i++ }. `);
  
  console.log(numbered);
}

export { logWithLineNumbers };
export function getArgumentName(func: CallableFunction) {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/function\s.*?\(([^)]*)\)/);

  // Check wether the function has arguments or not.
  if (args == null) {
    return [];
  }

  // Split the arguments string into an array comma delimited.
  return args[1].split(',').map((arg: string) => {
    // Ensure no inline comments are parsed and trim the whitespace.

    return arg.replace(/\/\*.*\*\//, '').trim();
  }).filter((arg) => {
    // Ensure no undefined values are added.

    return arg;
  });
}
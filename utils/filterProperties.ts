export default function filterProperties(
  model: Record<string, any>,
  filter: Array<string>,
  override: Record<string, any>,
): Record<string, any> {
  const filteredModel: Record<string, any> = {};
  filter.forEach((prop: string) => {
    filteredModel[prop] = override[prop] ?? model[prop];
  });
  return filteredModel;
}

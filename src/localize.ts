import en from "./translations/en.json";

const dict = en as Record<string, unknown>;

export function localize(key: string): string {
  const node = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof node === "string" ? node : key;
}

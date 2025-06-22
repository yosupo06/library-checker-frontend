import { parse } from "@ltd/j-toml";

export type ProblemInfoToml = {
  title?: string;
  timeLimit?: number;
  forum?: string;

  tests: {
    name: string;
    number: number;
  }[];
  params: { [key: string]: bigint };
};

export const parseProblemInfoToml = (toml: string): ProblemInfoToml => {
  const infoJsonMap = parse(toml, { bigint: true }) as Record<string, unknown>;

  const tests = (() => {
    const data = readField(infoJsonMap, "tests");
    if (!data) return [];
    if (!Array.isArray(data)) return [];
    const tests: {
      name: string;
      number: number;
    }[] = [];
    data.map((e) => {
      {
        if (
          typeof e === "object" &&
          e !== null &&
          !(e instanceof Array) &&
          !(e instanceof Date)
        ) {
          const name = readString(e as Record<string, unknown>, "name");
          const number = readNumber(e as Record<string, unknown>, "number");

          if (name && number) {
            tests.push({ name: name, number: number });
          }
        }
      }
    });
    return tests;
  })();

  const params = (() => {
    const data = readField(infoJsonMap, "params");
    if (!data) return {};
    const params: { [key: string]: bigint } = {};
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === "number") {
        params[key] = BigInt(value);
      }
      if (typeof value === "bigint") {
        params[key] = value;
      }
      if (typeof value === "string") {
        // Handle case where BigInt is serialized as string
        try {
          params[key] = BigInt(value);
        } catch {
          // If it's not a valid BigInt string, skip it
        }
      }
    });
    return params;
  })();

  return {
    title: readString(infoJsonMap, "title"),
    timeLimit: readNumber(infoJsonMap, "timelimit"),
    forum: readString(infoJsonMap, "forum"),
    tests: tests,
    params: params,
  };
};

const readField = (data: Record<string, unknown>, key: string): unknown => {
  if (!(key in data)) return undefined;
  return data[key];
};

const readString = (data: Record<string, unknown>, key: string): string | undefined => {
  const v = readField(data, key);
  if (typeof v !== "string") {
    return undefined;
  }
  return v;
};

const readNumber = (data: Record<string, unknown>, key: string): number | undefined => {
  const v = readField(data, key);
  if (typeof v === "number") {
    return v;
  }
  if (typeof v === "bigint") {
    return Number(v);
  }
  return undefined;
};

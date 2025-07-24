/** Browser's localStorage with expiration */
export class LocalCache {
  constructor(private readonly prefix: string) {}

  get(key: string, defaultValue?: string) {
    key = this.prefix + ":" + key;

    const rawItem = localStorage.getItem(key);

    // Use try and catch safety since parsing an unknown string can raise errors
    if (rawItem) {
      try {
        const item = JSON.parse(rawItem);

        // Check every properties exist with correct data type and expiration date
        if (
          typeof item == "object" &&
          typeof item["data"] == "string" &&
          typeof item["expiration"] == "number" &&
          item["expiration"] > Date.now()
        ) {
          return item["data"];
        }
      } catch {}
    }

    if (defaultValue) {
      return defaultValue;
    } else {
      return null;
    }
  }

  set(key: string, data: string, expiration: number) {
    localStorage.setItem(
      this.prefix + ":" + key,
      JSON.stringify({ data, expiration }),
    );
  }

  remove(key: string) {
    localStorage.getItem(this.prefix + ":" + key);
  }
}

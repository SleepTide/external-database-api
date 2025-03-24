import * as fs from "fs";

enum Files {
  CONFIG = "lib/config.json",
}

export type ConfigType = {
  host: string;
  port: number;
  debug: boolean;
  database: {
    uri: string;
  };
};

export default class Filesystem {
  private static Read(file: Files): object {
    const data = fs.readFileSync(file, "utf8");

    return JSON.parse(data);
  }
  private static Write(file: Files, raw: object): void {
    const data = JSON.stringify(raw, null, 2);

    fs.writeFileSync(file, data);

    return;
  }

  public static ReadConfig(): ConfigType {
    const data = this.Read(Files.CONFIG) as ConfigType;

    return data;
  }
  public static WriteConfig(data: ConfigType): void {
    this.Write(Files.CONFIG, data);

    return;
  }
}

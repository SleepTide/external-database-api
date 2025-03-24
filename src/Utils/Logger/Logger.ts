import "colors";
import Filesystem from "../Filesystem/Filesystem";

export default class Logger {
  public static Info(...message: unknown[]): void {
    const data = this.HandleMessage(message);

    console.log(
      "[".gray + "INFO".cyan + "] ".gray + `(${this.GetTime()}) `.green + data
    );
    return;
  }
  public static Warn(...message: unknown[]): void {
    const data = this.HandleMessage(message);

    console.log(
      "[".gray + "WARN".yellow + "] ".gray + `(${this.GetTime()}) `.green + data
    );
    return;
  }
  public static Error(...message: unknown[]): void {
    const data = this.HandleMessage(message);

    console.log(
      "[".gray + "ERROR".red + "] ".gray + `(${this.GetTime()}) `.green + data
    );
    return;
  }
  public static Debug(...message: unknown[]): void {
    const config = Filesystem.ReadConfig();
    const data = this.HandleMessage(message);

    if (!config.debug) {
      return;
    }

    console.log(
      "[".gray + "DEBUG".blue + "] ".gray + `(${this.GetTime()}) `.green + data
    );
    return;
  }

  private static HandleMessage(message: unknown[]): string {
    const data = message.map((value) => {
      if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
      }

      return value;
    });

    return data.join(" ");
  }
  private static GetTime(time?: number): string {
    const date = new Date(time ?? Date.now());

    return date.toLocaleString();
  }
}

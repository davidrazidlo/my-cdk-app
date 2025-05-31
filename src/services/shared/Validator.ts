import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Missing required field: ${missingField}`);
    this.name = "MissingFieldError";
  }
}

export function validateAsSpaceEntry(arg: any) {
  if (arg as SpaceEntry) {
    if (!arg.id) {
      throw new MissingFieldError("id");
    }
    if (!arg.location) {
      throw new MissingFieldError("location");
    }
    if (!arg.name) {
      throw new MissingFieldError("name");
    }
    // photoUrl is optional, so we don't check it
  }
}

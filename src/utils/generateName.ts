import { uniqueNamesGenerator, starWars } from 'unique-names-generator';

export function generateName(): string {
  return uniqueNamesGenerator({ dictionaries: [starWars] });
}

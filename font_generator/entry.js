import { readdirSync } from 'fs';
import { join } from 'path';
const normalizedPath = join(__dirname, "config");

readdirSync(normalizedPath).forEach(function(file) {
  require("./config/" + file);
});

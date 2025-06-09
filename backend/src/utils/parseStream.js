const readline = require('readline');

async function parseNDJSONStream(stream) {
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  const results = [];
  for await (const line of rl) {
    if (line.trim()) {
      try {
        results.push(JSON.parse(line));
      } catch (err) {
        console.error('❌ Linha inválida:', line);
      }
    }
  }

  return results;
}

module.exports = parseNDJSONStream;

/**
 * prints asci hello world to the console
 * and additionally a cat fact if one is provided
 **/
export async function helloWorld(catFact?: string) {
  const text = `
    ▗▖ ▗▖▗▄▄▄▖▗▖   ▗▖    ▗▄▖     ▗▖ ▗▖ ▗▄▖ ▗▄▄▖ ▗▖   ▗▄▄▄ 
    ▐▌ ▐▌▐▌   ▐▌   ▐▌   ▐▌ ▐▌    ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌  █
    ▐▛▀▜▌▐▛▀▀▘▐▌   ▐▌   ▐▌ ▐▌    ▐▌ ▐▌▐▌ ▐▌▐▛▀▚▖▐▌   ▐▌  █
    ▐▌ ▐▌▐▙▄▄▖▐▙▄▄▖▐▙▄▄▖▝▚▄▞▘    ▐▙█▟▌▝▚▄▞▘▐▌ ▐▌▐▙▄▄▖▐▙▄▄▀
  `
  console.log(text)

  if (catFact) {
    console.log('\n😺 did you know?', '\n', catFact, '\n')
  }
}

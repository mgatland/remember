'use strict'
const input = document.querySelector('input')
const addItemButton = document.querySelector('.packButton')
const packedButton = document.querySelector('.packedButton')
const progress = document.querySelector('.progress')
const itemList = document.querySelector('.items')
const phase1 = document.querySelector('.phase1')
const prompt = document.querySelector('.prompt')
const choosePrompt = document.querySelector('.choosePrompt')
const okButton = document.querySelector('.ok')

const flavours = {
  'everything': '(The dev really did think of everything)',
}

const events = [
  `Oh no! Traffic is really bad, you might miss your flight.`,
  `Fortunately, your ### helps you find a shortcut to the airport!`,
  `At the airport, you realize you forgot to clean your teeth. No problem:`,
  `You sneak into the bathroom and freshen up with your ###.`,
  `You have just enough time for a snack.`,
  `You buy a potato gratin and eat it with ### keeping you company.`,
  `You get into the security line. The couple in front of you are stressed, their toddler ran off somewhere and they can't see them.`,
  `Ah ha! No child can resist ###. You lure the toddler back to the grateful couple.`,
  `Front of the line! The security officer looks suspiciously at one of your items.`,
  `'Oh, it's just a ###?' she says. It looked like something else. You laugh at the harmless mistake.`,
  `While repacking your bags, you accidentally drop something.`,
  `Your ### falls through a grate in the floor. Oh well! No one item's loss can ruin a whole trip, surely?`,
  `It's time to go to the gate, but you can't remember which gate your flight is departing from.`,
  `You wave your ### around like an aeroplane to jog your memory. Ah ha! You remember. It's gate 8.`,
  `At the gate, all the seats are taken (except ones next to people - and you would never sit next to someone.)`,
  `Using your ### as a privacy screen, you feel comfortable enough to sit next to someone.`,
  `Uh oh. The flight attendent has asked you to come to the desk for some reason.`,
  `He asks to see your ###. He looks concerned and exchanges a few words with his supervisor. It's probably nothing. He says you can sit back down.`,
  `Rows 1-16 are now boarding, along with Star Alliance Gold members and premium economy.`,
  `For a moment you panic, thinking you forgot your ###. But you check your bags and it's still there.`,
  `Rows 17-32 are now boarding. You are in row 33.`,
  `You regret packing a ###. You can't imagine ever needing it.`,
  `Everyone else is boarding. Maybe just go up?`,
  `Apparently they forgot your row. You board and sit at the very back of the plane. You unpack your ### for the journey.`,
  `It's a smooth flight, but the passenger next to you has COVID-19 coronavirus.`,
  `You give her a ###, the only known cure for COVID-19. She is very grateful and promises to promptly move out of the way if you ever need to get up during the flight!`,
  `It's now night time on the plane but you're having trouble sleeping.`,
  `Using your ### for entertainment, you keep yourself engaged through the sleepless night.`,
  `The plane arrives at your destination. You disembark but it is freezing cold!`,
  `Your ### helps you keep your energy levels up as you head to the train station.`,
  `The signs here are in an unfamilar language. How will you get to your new home?`,
  `Starting with your ###, you trade for a slightly higher value item over and over again until you finally trade a signed Path of Exile world map for an old car. Time to hit the road!`,
  `You park outside your new home. But how will you get inside?`,
  `That's right - in this country, houses are unlocked using a ###. That's why you brought one!`,
  `Finally, your journey is over. You're too tired to unpack, but you might take out one item to put on the shelf:`,
  `You place the ### on the shelf. Success! Your score is 200 out of 200. You chose the right items for a safe and comfortable journey! Congratulations and enjoy your new life.`
]

const addItem = () => {
  const itemName = input.value
  if (itemName === '') return
  const flavour = flavours[itemName.toLowerCase().trim()] || null
  const flavourHtml = flavour ? `<div class='flavour'>${flavour}</div>` : ''
  const node = htmlToElement(`<div class='item'>${itemName} <button class='remove'>remove</button>${flavourHtml}</div>`)
  itemList.append(node)
  input.value = ''
  updateItemCount()
}

packedButton.addEventListener('click', function (e) {
  if (itemList.querySelectorAll('.item').length === 0) return
  phase1.classList.add('hidden')
  // remove remove buttons (not a typo)
  itemList.querySelectorAll('button').forEach(el => el.parentNode.removeChild(el))
  

  let choice = false
  let n = 0

  itemList.classList.add('usable')

  const advanceStory = (itemName = '') => {
    choice = !choice
    prompt.innerHTML += '<div class="story">' + events[n].replace('###', itemName.trim()) + '</div>'
    okButton.classList.toggle('hidden', choice)
    choosePrompt.classList.toggle('hidden', !choice)
    itemList.classList.toggle('active', choice)
    if (n === events.length - 1) {
      // end
      okButton.classList.add('hidden')
      choosePrompt.classList.add('hidden')
    }
    n++
  }

  okButton.addEventListener('click', (e) => advanceStory())
  itemList.addEventListener('click',(e) => {
    let item = e.target
    while (!item.classList.contains('item') && item.parentNode) item = item.parentNode
    if (!item.classList.contains('item')) return
    if (!choice) return
    item.parentNode.removeChild(item)
    advanceStory(item.innerHTML)
  })

  advanceStory()
})

addItemButton.addEventListener('click', addItem)
input.addEventListener('keydown', function (e) {
  if (e.code === 'Enter' || e.key === 'Enter') {
    addItem()
  }
})

itemList.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    itemList.removeChild(e.target.parentNode)
    updateItemCount()
  }
})

function updateItemCount() {
  const count = itemList.querySelectorAll('.item').length
  const required = events.length / 2
  packedButton.classList.toggle('hidden', count < required)
  if (count < required) {
    progress.innerHTML = `You need at least ${required - count} more`
  } else {
    progress.innerHTML = ''
  }
}
updateItemCount()

//from SO
function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Mya Leroux
**Startup name:** Easy Eats
**Live site link:** https://myaleroux.github.io/Easy-Eats/

---

## Work sessions

Copy this block for each session.

### Session — November 17 — driver: Mya

- **Goal for this session:** Get all my general ideas out, see what the app looks like and fix any issues later.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Build a complete, working website called MyaFoodApp: an AI-style recipe book for students on a budget.

  2. Show 9 sample recipes as cards (photo placeholder using an emoji, name, cook time, cost per serving in CAD, calories per serving, and tags like vegan, high-protein, halal).
- **What worked:** Prompt made initial version of the app well and followed every prompt correctly
- **What broke, and how we fixed it:** "MyaFoodApp" was a placeholder name, and I forgot to remove it from the outline I gave Copilot. Changed November 19
- **Committed?** Yes, c2a64d7 — “Initial commit”

### Session — November 19 — driver: Mya

- **Goal for this session:** Fix general issues from the initial commit
- **Key prompts we gave Copilot** (paste the important ones):
  1. Change name from "MyaFoodApp" to "Easy Eats" and add my pantry in te tabs section and allow users to type in their own options as well as providing them with options.

  2. Add Real Atlantic Superstore and Costco to the store lists, maybe even add a map feature so users can see what grocery stores are nearby.

  3. I also dont want it to be solely target to only students; Easy Eats, Easy Saving instead of Smart Meals for student life
- **What worked:** Costco and Real Atlantic Superstore now appear in the dropdown menu. Map option works: Users select a store name and it opens an external Google Maps link showing where the store is according to their location.
- **What broke, and how we fixed it:** No issues logged in this section.
- **Committed?** Yes, 2132e8f — “Agent host session d6c3ab6c-efc2-4af6-8fa1-aaa7b0c668b4 - turn 2”

### Session — November 20 — driver: Mya

- **Goal for this session:** Go through the whole app and find inconsistencies as well as missing features.
- **Key prompts we gave Copilot** (paste the important ones):
  1. In the recipe cards, rewrite every step with the pot or pan, heat level, and time
  2. Add a saved recipes tab, a common tools section, A "What's in my kitchen" setting, and recipes adjust accordingly, A refresh button that swaps a meal for a different one, a reset chat button that clears swaps so recipes show their original ingredients, and a switch between metric (grams, ML)  and imperial (cups, oz), defaulting to user's location.
  3. Add a feature where users can pick from breakfast recipes, lunch recipes, dinner recipes for the week. Once they find and select recipes they like, they're all added together in their grocery list for the week.
- **What worked:** Recipes are now much more concise and easier to follow for beginners. Saved recipes, common tools, and my kitchen tab are now available. Meals are now individually swappable and swappable per week. Switch between metric and imperial is now available and changes accordingly to each recipe
- **What broke, and how we fixed it:** When adding "Plan your week" only a "clear week" button was there, and you have to click it for the drop down to appear, which can be misleading and confusing to users. Fixed it with lots of trial and error, eventually I had to remove any previous commits related to that prompt and redo it.
- **Committed?** Yes, 756de99 — “Add recipe planning and kitchen features”

### Session — November 21 — driver: Mya

- **Goal for this session:** Add community features that show network effects
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add sample community data to show network effects. On every recipe card, show a community rating next to the user's own rating, like “4.6 ★ from 312 cooks”
  2. In the Swap Chat, add a line under each answer like “87% of cooks who tried this swap liked it.”
  3. In the Grocery Planner, add a “Report a price” button next to each deal that opens a small form (item, price, store) and shows “Thanks! Your report helps 1,240 shoppers in Antigonish.”
- **What worked:** Features were added.
- **What broke, and how we fixed it:** All the  weekly recipe cards disappeared yet all other features remained the same. After lots of "add the recipe cards back" I eventually had to as Copilot to revert the app back to how it was before the sample community data prompt. Afterwards, I gave Copilot a step by step, ensuring each individual feature was working before giving a new one. Ensured to note the importance not to delete any existing code and to just add.
- **Committed?** Yes, d251f74 — “Add community data and refresh project documentation”

### Session — November 24 — driver: Mya

- **Goal for this session:** Fix up grocery planner
- **Key prompts we gave Copilot** (paste the important ones):
  1. in grocery planner, allow users to type in their own budget as they are only limited to options $100 and below. Ensure no code is deleted and only added.
- **What worked:** Features were added.
- **What broke, and how we fixed it:** No issues for this session
- **Committed?** No, the custom budget changes are still uncommitted.
---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| November 17 | The app used my placeholder name, "MyaFoodApp"| Asked Copilot to change it from "MyaFoodApp" to "Easy Eats" | Worked on Nov 19 |
| November 20 | Adding "Plan your week" only prompted a "Clear Week" button to appear, making it so you had to click that for the dropdown to appear. | Asked Copilot to keep the clear week button but add a button to open that dropdown menu, making it easier to understand. | Asked Copilot to remove any commits related to plan out your week and redo it. |
| November 21 | Tried adding a price reporting feature to aid network effects and weekly recipes all disappeared. | Prompted: Weekly recipes are still gone from the tab. Add the list of weekly recipes to add to the weekly planner back into the tab | Asked Copilot to revert the app back to how it was before the sample community data promppt and followed with each prompt individually ensuring each worked before moving on to the next. Insisted that all previous code remains the same to only add not delete/change anything |
## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Cloud backend | The prototype is hosted on GitHub Pages, but user data is only saved in browser local storage. A real service needs a shared backend for accounts, synced data, and community features | Medium: a managed backend and hosted database |
| Real Logins | Each user's pantry and saved recipes must be private and follow them across devices | Medium: a login service |
| Shared database | Community features need everyone's data in one place | Medium: a hosted database plus a developer |
| Real AI Swap Chat | The original prompt asked for a fixed swap list; however, a real version must be able to answer any question | Medium: pay for an AI service |
| Payments | The $2.99/month premium plan needs real billing | Medium: payment software that charges fees |
| Live store prices | Current prices and deals are sample data | Hard: needs store agreements or constant updating |
| Moderation | Fake price reports or reviews would mislead users | Medium: automatic checks plus staff time |
| Recipe and allergy safety review | Bad swaps, steps, or unsensical recipes could cause allergic reactions or undercooked food | Medium: a part-time nutrition or food-safety reviewer/staff member |
| Customer support | Users need help with accounts, billing, and bugs | Low to medium: support tools plus staff |
| Premium accounts | In order to make a profit, users who want to access premium meals will need a premium account. For the sake of the prototype, all recipes are available regardless of premium indication | Low: Once billing software is installed, code needs to be tweaked to account for premium accounts being launched |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?

What suprised me most was how well it understood and carried out what I asked. All it took was a mess of ideas, and it organized them and developed them into an app. The vision I had was in front of me almost immediately. But just as one prompt could build practically my whole site, another could delete a lot of my work. When I was adding community features, it decided to delete sections of code I never asked it to touch.

2. Which parts were easy, and which were hard? Why do you think that is?

I had expectations on both ends of the spectrum. At first, I thought it was gonna be easy and for the most part it was. I knew my explanations had to be concise in order for it to work properly and thought I was in the clear when it came to my code being exactly as I wanted. Once I started adding more features, things got a little more complicated. One prompt I made completely changed my whole app, deleted things I was worried I wouldn't get back and I was unsure how to fix it. The easy part is being able to gather ideas and have AI build it for you, the hard part is fixing it and tweaking it. I think that is because we internally know what needs to be fixed but when relaying it to a non-human entity, it's never gonna understand to the full extent. It's scary having to tell an AI chat "delete everything you just did" as there's always a chance you lose something and can't get it back to the way it was. What finally worked was asking Copilot to disregard any changes related to "x" and give it the steps again. Which is odd, considering I didn't say anything really differently, it just worked that time around. I figured I would be able to get the app how I wanted fairly quickly, however that was not at all the case.

3. If a competitor had the same AI tool, how long would it take them to copy your site?

A competitor could probably copy my site in a few days. It took me about two weeks, but most of that time was brainstorming the idea. Anybody can build this with AI and take my ideas, but the network is what makes it harder to copy. If the majority of a town was using the app, people could see deals at their store, share recipes with each other, and plan their grocery lists without being stretched across five different websites or apps. Once there is a large majority of people on the app, a competitor emerging would likely not be able to catch up, primarily because people are already using one app and don't have a need for a new one. The competing app would have to spend the same amount of time establishing their network while mine keeps growing.
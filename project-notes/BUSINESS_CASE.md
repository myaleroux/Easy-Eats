# Business case

Easy Eats is an AI based recipe app that helps plan your meals around respective budgets, what's in your pantry, what appliances you have access to, dietary restrictions, and provides users with deals at their local grocery stores and compares it to others. Users pick a budget (ex: $20 or under $100), and the app builds a weekly meal plan and grocery list including breakfast lunch and dinner. An AI chat answers "what can I use instead?" questions, and short tutorials teach beginners basic skills for cooking.
The website is easy to copy, but every rating, swap review, and price report from users makes it smarter and tailored to that specific person.

## 1. The idea

- **Customer:** Easy Eats is for anyone who wants to eat well for less: students, young adults, budget conscious families, and people learning to cook.
- **Problem:** Finding recipes is not easy. They can be hard to follow, don't cater to your budget and they don't help you cook with what you already own. Planning a cheap week of meals means researching store deals, and multiple recipes which takes time and effort. Easy Eats does that for you.
- **Solution:** Easy Eats puts recipes, budgets, deals, and cooking lessons in one place. A typical week set up looks like this:
    1. The user adjusts their profile according to how many they need to cook for, dietary needs, favourite stores, and what's in their pantry for that week.
    2. They pick a budget, and the app builds a one week meal plan and grocery list that fits it. If the meal plan is over budget, it will tell you, and provide you with a cross comparison list between grocery stores available to you.
    3. While cooking, they ask the AI chat for swaps ("no sugar? Use honey") and can refer to the tutorials throughout.
    5. They rate each meal, and the next plan adjusts accordingly.
- **Revenue:** Easy Eats earns revenue three ways: An initial free plan that brings users in, a 2.99/month premium plan, and  fees from grocery partners

## 2. Where IT creates value
Easy Eats changes the value chain for home cooking. Today, finding a recipe means searching the internet, scrolling past ads and life stories on food blogs, and piecing together YouTube videos when a step is unclear. Easy Eats replaces that with one app. In operations, AI turns a tested recipe library into plans that fit each user's budget, diet, househhold size, and kitchen.In service, the biggest change, users can get help while they cook: a swap chat for missing ingredients, step-by-step tutorials, and a skill tracker that builds confidence. Outbound, recipes arrive in one clear format instrad of scattered across sites. Groceries still matter: in marketing and sales, store deals appear inside meal plans instead of paper flyers, and across each grocery stores individualized apps and stores can pay to promote them. Every rating and swap makes recipes better for the next user. Switching costs grow as users build their pantry, profile, and skill history. Differentiation comes from combining recipes, lessons, and budgets that competitors offer separately. As a cloud-based website, Easy Eats is a low-cost distribution channel that can scale to many users at little extra cost.

## 3. Network effects
Every new user makes Easy Eats more useful for the next one. Community ratings and swap reviews ("honey instead of sugar worked for this recipe, 4.6 stars from 312 other cooks) become more trustworthy as more people cook. Shared household lists bring in roommates and partners and once a whole household is on the app, nobody will want to switch. Easy Eats is primarily a one-sided market where users aid eachother with ratings however, with enough local shoppers, Easy Eats becomes a two-sided market: grocery stores pay to reach them, which then makes the app more useful and attracts even more users.

- Where does the extra value come from as the network grows?

Every new user adds ratings, swap results, and price reports, so recipes, swaps, and deals get better for everyone. Once there are enough users, grocery stores pay the app to reach them, turning a one-sided network into a two-sided one.

- How would you solve the "empty network" problem at launch?

Easy Eats is useful even with zero other uers, because meal plans, My Pantry, the swap chat, and tutorials work for one person. It launches in one small community (for the sake of this being a school project, Antigonish, NS), seeded with tested recipes and flyer prices and early users earch free premium weeks for rating  meals and reporting prices.

- Point to the part of your prototype that shows this.

Each recipe card shows a community rating (i.e. "4.6 stars from 312 cooks), the swap chat shows how many cooks liked each swap, and the Grocery Planner has a "report a price" button. The community numbers are sample data that show how the network would work at a proper scale.

## 4. Can it be copied? (the moat question)
Anyone can build this website in AI in a weekend, so the code is not the advantage. The advantage is what users put in: ratings, swap  results, price reports, taste history, and dietary needs. That grows with every user and everyweek, meaning a copycat will start at zero.

- What about your business is **valuable, rare, hard to imitate and well-organized** (VRIN)?
Easy Eats' most valuable resouce is its community data: ratings, swap results, and local price reports that make recipes and deals better. It is rare because no competitor collects this for local home cooks, and hard to imitate because it takes months of real users to build. It is well-organized because the app collects it automatically every time someone rates a meal or reports a price. The features alone are easy to copy, the data and local community are not. There's a litter of apps that can do each  individual task Easy Eats can do, however, that is exactly the problem, multiple apps, multiple actions where instead you can access everything in one app rather than 5.

- What would a competitor with a bigger budget need to copy you, and how long would it take?

A company like Mealime or Flipp could copy the features in a few weeks. To truly catch up, it would also need thousands of local ratings, months of price history in each town and city users operate from and households willing to leave Easy Eats, which would take at least a year per community.

- Which of your advantages get *stronger* over time (data, network, brand, switching costs)?

Data grows with every meal rated and price reported. The network grows as each new user makes the app better and increases accuracy for the next. Switching costs rise as users build their pantry, profile, saved recipes, and skills progress. The brand strengthens as Easy Eats becomes the local name for cooking on a budget.
## 5. Cloud and operations

What would it take to run this for real? Which parts would you buy as cloud services (SaaS, PaaS, IaaS), and what are the risks of relying on them?

Easy Eats would need a small team made up of a founder, developer, and someone to test recipes and grow the community. The prototype's sample data would be replaced with a real database, user accounts, payments, an AI model for the swap chat, and current store prices. Since stores may not share their data, prices would come from manual search of weekly flyers and user reports at first.

For SaaS, I would include payment software for the 2.99/month subcriptions and Google maps for the store finder. The AI swap chat would use an existing AI model through an API since developping and training our own would be too expensive.

 For PaaS, Easy Eats would need a managed platform to run the code and central database. Right now, ratings, pantry and kitchen items are saved in local storage meaning they will stay in the users individual browser. This means that as of right now, users cannot sync to other devices or share with their roommate(s)/partner/families. A central database would fix this and allow for community ratings and price reports to build up.
 
 I would not use an IaaS at launch because since were starting with a small community to build the apps network, there wouldn't be enough staff or budget to set up, patch, and aquire servers. There are a few risks when relying on these services:
 1. If our PaaS provider went down, logins, synced pantries, household lists, price reports, and store comparisons would stop working. User's recipes and latest grocery list would have to be saved on their device so that they can continue to cook, plan, and shop offline.
 2. The AI could suggest an unsafe swap for someone with an allergy, unsafe ingredients would have to be blocked using the user's dietary profile, show allergy warnings, and instruct users to check labels.

## 6. Risks and ethics

What could go wrong — for your customers, their data, or society? What would you do about it?

The AI could suggest a swap that triggers an allergy, or gives unclear steps that leaves for example, chicken undercooked. Calorie and weight goals could contribute to unhealthy habits. Easy Eats would have to block ingredients that are conflicting to a user's dietary profile, add safe cooking temperatures to every meat recipe, and allow users to hide calorie counts.
Diet, health goals, religion (halal), and location is all sensitive information. A breach, or selling this data to stores, would break users' trust. Easy Eats would never sell personal data, give stores only anonympus totals, collect only what it needs, and let users delete their  accound and data at anytime, following Canadian Privacy Laws.
Paid store deals could push shoppers toward less healthy or pricier food, and fake price reports could mislead users. Small local stores could also be left out if only big chains pay. EasyEats would label every sponsored deal, never let payments change a user's budget or recommendations, flag price reports that look wrong, and list small local stores for free.

AI use: I used Claude to help edit answers to this business case and I used GitHub Copilot to build the website.
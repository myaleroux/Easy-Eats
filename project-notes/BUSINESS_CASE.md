# Business case

Easy Eats is an AI-based recipe app that helps users plan meals around their budgets, pantry items, available appliances, dietary restrictions, and local grocery deals. Users pick a budget (for example, $20 or under $100), and the app builds a weekly meal plan and grocery list that includes breakfast, lunch, and dinner. A swap chat answers "what can I use instead?" questions, and short tutorials teach beginners basic cooking skills.
The website is easy to copy, but every rating, swap review, and price report makes it smarter and more useful to the community.

## 1. The idea

- **Customer:** Easy Eats is for anyone who wants to eat well for less: students, young adults, budget-conscious families, and people learning to cook.
- **Problem:** Finding recipes is not easy. They can be hard to follow, do not cater to your budget, and do not help you cook with what you already own. Planning a cheap week of meals means researching store deals and combining multiple recipes, which takes time and effort. Easy Eats does that for you.
- **Solution:** Easy Eats puts recipes, budgets, deals, and cooking lessons in one place. A typical week set up looks like this:
    1. The user adjusts their profile according to household size, dietary needs, favourite stores, and what is in their pantry for that week.
    2. They pick a budget, and the app builds a one-week meal plan and grocery list that fits it. If the meal plan is over budget, it tells the user and provides a cross-store comparison of the grocery stores available to them.
    3. While cooking, they ask the AI chat for swaps ("no sugar? Use honey") and can refer to the tutorials throughout.
    4. They rate each meal, and the next plan adjusts accordingly.
- **Revenue:** Easy Eats earns revenue in three ways: a free plan that brings users in, a $2.99/month premium plan, and fees from grocery partners.

## 2. Where IT creates value
Easy Eats changes the value chain for home cooking. Today, finding a recipe means searching the internet, scrolling past ads and long stories on food blogs, and piecing together YouTube videos when a step is unclear. Easy Eats replaces those separate tasks with one app. In operations, AI turns a tested recipe library into plans that fit each user's budget, diet, household size, and kitchen. In service, users can get help while they cook through a swap chat for missing ingredients, step-by-step tutorials, and a skill tracker that builds confidence. Outbound, recipes arrive in one clear format instead of being scattered across websites. Groceries still matter: in marketing and sales, store deals appear inside meal plans instead of in paper flyers, or across multiple different grocery store apps and grocery stores can pay to promote their offers. Every rating and swap makes recipes better for the next user. Switching costs grow as users build their pantry, profile, and skill history. Differentiation comes from combining recipes, lessons, and budgets that competitors offer separately. As a static website hosted online, Easy Eats is a low-cost distribution channel that can scale to reach many users. A shared cloud backend would be needed before it could scale with connected accounts and community data.

## 3. Network effects
Every new user makes Easy Eats more useful for the next one. Community ratings and swap reviews ("honey instead of sugar worked for this recipe," 4.6 stars from 312 other cooks) become more trustworthy as more people cook. Shared household lists bring in roommates and partners, and once a whole household is on the app, nobody will want to switch. Easy Eats is primarily a one-sided market where users help each other with ratings. However, with enough local shoppers, Easy Eats becomes a two-sided market: grocery stores pay to reach them, which makes the app more useful and attracts more users.

- Where does the extra value come from as the network grows?

Every new user adds ratings, swap results, and price reports, so recipes, swaps, and deals get better for everyone. Once there are enough users, grocery stores pay the app to reach them, turning a one-sided network into a two-sided one.

- How would you solve the "empty network" problem at launch?

Easy Eats is useful even with zero other users because meal plans, My Pantry, the swap chat, and tutorials work for one person. It would launch in one small community (in this project, Antigonish, NS), with seeded recipes and flyer prices. Early users could earn free premium weeks by rating meals and reporting prices.

- Point to the part of your prototype that shows this.

Each recipe card shows a community rating (for example, "4.6 stars from 312 cooks"), the swap chat shows how many cooks liked each swap, and the Grocery Planner has a "report a price" button. The community numbers are sample data that show how the network would work at a proper scale.

## 4. Can it be copied? (the moat question)
Anyone can build this website with AI in a few weeks, so the code is not the advantage. The advantage is what users contribute: ratings, swap results, price reports, taste history, and dietary needs. This grows with every user and every week, meaning a copycat will start at zero.

- What about your business is **valuable, rare, hard to imitate and well-organized** (VRIN)?
Easy Eats' most valuable resource is its community data: ratings, swap results, and local price reports that make recipes and deals better. It is rare because no competitor collects this specifically for local home cooks, and it is hard to imitate because it takes months of real user activity to build. It is well-organized because the app collects data automatically whenever someone rates a meal or reports a price. The features alone are easy to copy, but the data and local community are not. Many apps can perform one task Easy Eats offers, but the problem is that users must use several apps for separate actions. Easy Eats combines those actions in one place.

- What would a competitor with a bigger budget need to copy you, and how long would it take?

A company like Mealime or Flipp could copy the features in a few weeks. To truly catch up, it would also need thousands of local ratings, months of price history in each town and city users operate from and households willing to leave Easy Eats, which would take at least a year per community.

- Which of your advantages get *stronger* over time (data, network, brand, switching costs)?

Data grows with every meal rated and price reported. The network grows as each new user makes the app better and increases accuracy for the next. Switching costs rise as users build their pantry, profile, saved recipes, and skills progress. The brand strengthens as Easy Eats becomes the local name for cooking on a budget.
## 5. Cloud and operations

What would it take to run this for real? Which parts would you buy as cloud services (SaaS, PaaS, IaaS), and what are the risks of relying on them?

The prototype is hosted on GitHub Pages, but it is not currently a cloud-based application in the full sense. It uses HTML, CSS, and JavaScript with browser local storage, so its data is saved on one device or browser rather than in a shared database. A real version would need cloud services for accounts, databases, payments, AI, and shared community data.

Easy Eats would need a small team made up of a founder, developer, and someone to test recipes and grow the community. The prototype's sample data would be replaced with a real database, user accounts, payments, an AI model for the swap chat, and current store prices. Since stores may not share their data, prices would come from manual search of weekly flyers and user reports at first.

For SaaS, I would include payment software for the $2.99/month subscriptions and Google Maps for the store finder. The AI swap chat would use an existing AI model through an API because developing and training our own would be too expensive.

 For PaaS, Easy Eats would need a managed platform to run the code and central database. Right now, ratings, pantry items, and kitchen items are saved in local storage, meaning they stay in the user's individual browser. As a result, users cannot currently sync across devices or share data with roommates, partners, or families. A central database would fix this and allow community ratings and price reports to build over time.
 
 I would not use IaaS at launch because, with a small community, there would not be enough staff or budget to set up, patch, and acquire servers. There are a few risks when relying on these services:
 1. If our PaaS provider went down, logins, synced pantries, household lists, price reports, and store comparisons would stop working. User's recipes and latest grocery list would have to be saved on their device so that they can continue to cook, plan, and shop offline.
 2. The AI could suggest an unsafe swap for someone with an allergy, unsafe ingredients would have to be blocked using the user's dietary profile, show allergy warnings, and instruct users to check labels.

## 6. Risks and ethics

What could go wrong — for your customers, their data, or society? What would you do about it?

The AI could suggest a swap that triggers an allergy or give unclear steps that leave, for example, chicken undercooked. Calorie and weight goals could contribute to unhealthy habits. Easy Eats would have to block ingredients that conflict with a user's dietary profile, add safe cooking temperatures to every meat recipe, and allow users to hide calorie counts.
Diet, health goals, religion (halal), and location are sensitive information. A breach or sale of this data to stores would break users' trust. Easy Eats would never sell personal data, give stores only anonymous totals, collect only what it needs, and let users delete their account and data at any time, following applicable Canadian privacy laws such as PIPEDA.
Paid store deals could push shoppers toward less healthy or pricier food, and fake price reports could mislead users. Small local stores could also be left out if only big chains pay. Easy Eats would label every sponsored deal, never let payments change a user's budget or recommendations, flag price reports that look wrong, and list small local stores for free.

AI use: I used Claude to help edit answers to this business case and I used GitHub Copilot to build the website.
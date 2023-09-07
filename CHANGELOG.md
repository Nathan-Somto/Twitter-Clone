#### 0.1.0 (2023-09-07)

##### Build System / Dependencies

* **deps:**  installed date-fns. (4a859405)

##### Chores

* **components/modals:**  delete unused modals folder. (2083211c)
* **features/users:**
  *  add toggleFollowers reducer  to users slice. (aa88c8eb)
  *  update users slice to allow for profile fetching. (e0824ac6)
* **utils:**  create formatJoinedAt utility function. (05966f17)
* **ui/dialog:**  customize dialog component. (a476c061)
*  add x logo. (fff4238d)
*  delete uneccessary files. (ab8996b5)
* **lib/controllers:**  update controllers. (c57f93c1)
* **lib/utils:**  add Twet type from redux to calculate Tweet Score. (3300d900)
* **styles:**  update styles. (50a3a622)
* **store:**  add updated reducers to store. (affce519)
* **features/filterTweets:**  create filter tweets slice. (849bfc11)
* **features/tweets:**  update tweets slice to match api. (b54bb366)
* **components:**  connect endpoints to tweet card. (dcff4ab0)
* **features:**  add bookmarks to Tweet type. (93b8c40f)
* **lib/config:**  add types to config. (6f594edd)
* **lib/models:**  add types to models. (a4aee9b2)

##### Documentation Changes

*  update readme with relevant data. (79e905bd)
* **readme:**  update readme (2c48d138)

##### New Features

* **components/usermodals:**  create user modals component. (01be1fa6)
* **components/usertweets:**  create user tweets component. (558db335)
* **components/profile:**  add neccessary ui logic to profile component. (69aa10e8)
* **pages/profile:**  fetch user profile data from server. (eef2ca8d)
* **tailwind:**  set xl breakpoint to 1200px. (9ffc35c3)
*  add x logo to site. (8f8b8386)
* **lib/controllers:**  create notifications controllers. (5bab50a6)
* **lib/models:**  create notification model and type. (682782b4)
* **components/usercard:**  add user follow and unfollow functionality. (905953c1)
* **components/SearchBar:**  allow client side search. (a8d55c21)
* **pages/search:**  setup server rendering in search page. (78403e7d)
* **components/commentBox:**  add comment and reply functionality. (edc9e929)
* **api:**  update api. (1b7439b1)
* **components/FilterBox:**  add tweet filtering functionality. (adfbe401)
* **pages:**
  *  add personalized feed fetch. (2a734025)
  *  add create tweet functionality. (90b78f85)
  *  integrate backend to onboarding page. (f8c37795)
* **components/TweetCard:**  make tweet buttons functional. (7f0d7d43)
* **components/layout:**  add auth check to layout component. (e93ce5d2)
* **components/sidebar:**  add tooltip to sidebar. (3b7ce174)
* **ui:**
  *  create tooltip component. (13f3eb6d)
  *  create tooltip component. (e4094f01)
* **utils:**  create formatFromNow and formatNumber utility functions. (e9e24e92)
* **pages/api:**  create bookmarks endpoints. (b6af0fc2)
* **redux:**  setup themeSlice and tweetSlice. (9ffa1b70)
* **auth:**  setup google oauth (bd153178)

##### Bug Fixes

* **api:**  fix toggle follow parameter swap bug. (8fb08de1)
*  fix api errors in controllers. (94811ff5)
* **features/theme:**  fix theme selector bug. (6145b590)
* **lib/models:**  fix reference issue on author prop. (87c04a7f)
* **components/TweetBox:**  fix status change issue. (44ae5473)
* **components/Feed:**  fix spacing issue on mobile. (20259839)
* **features/tweetsSlice:**  fix type errors and fix retweet delete count. (ebf7a0fd)
* **components/tweetcard:**  add optimistic updates to tweet card. (3c837652)
* **pages/tweet:**  make tweet page route match api. (845c09cb)
* **components/SuggestionBox:**  update dummy data to match type. (367d0b20)
* **components/profileBox:**  fix profile box layout issues on larger screens. (ed7fc290)

##### Other Changes

* //github.com/Nathan-Somto/Twitter-Clone (d8455871)

##### Refactors

* **components:**  remove redundant logic in tweet box. (36ed518d)


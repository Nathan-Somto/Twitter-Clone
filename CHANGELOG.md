#### 0.1.0 (2023-09-08)

##### Build System / Dependencies

* **deps:**  installed date-fns. (4a859405)

##### Chores

*  update tweet controllers. (a11ccfe2)
*  add x logo. (fff4238d)
*  delete uneccessary files. (ab8996b5)
* **components/layout:**  refactor layout related components to layout folder. (b731c6f3)
* **components/tweetbox:**  update tweetbox. (9f42feb7)
* **pages/settings:**  add settings component to settings page. (a3e72429)
* **components/settings:**  refactor settings components to settings folder. (f946169b)
* **components/profile:**  create profile folder. (92394282)
* **components/filters:**  create filters folder. (40942b0c)
* **component/sidebar:**  refactor sidebar component and fetch unread notifications from server. (98e6a3f5)
* **pages/onboarding:**  add seo component and x logo. (b2dd234c)
* **deps:**  add generate changelog as dev dependency. (6440276b)
* **components/modals:**  delete unused modals folder. (2083211c)
* **features/users:**
  *  add toggleFollowers reducer  to users slice. (aa88c8eb)
  *  update users slice to allow for profile fetching. (e0824ac6)
* **utils:**  create formatJoinedAt utility function. (05966f17)
* **ui/dialog:**  customize dialog component. (a476c061)
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

* **readme:**
  *  add screenshots to readme. (aa66b58a)
  *  update readme (2c48d138)
* **changelog:**  create changelog. (47b9a103)
*  update readme with relevant data. (79e905bd)

##### New Features

* **pages/onboarding:**  add not authorized dialog. (21069084)
* **pages/index:**  create custom animation for loading sequence. (e4ced513)
* **pages/wip:**  create work in progress page. (a28793c6)
* **pages/500:**  create custom 500 page. (e0aaaf69)
*  add twitter blue badge to verified users. (005af0d7)
*  add x logo to site. (8f8b8386)
* **tailwind:**
  *  update dark mode colors. (a0590a33)
  *  set xl breakpoint to 1200px. (9ffc35c3)
* **components/logout:**  implement logout. (ada47517)
* **components/TwitterBlue:**  allow users to subscribe for twitter blue. (1c56a9f9)
* **controllers/user:**  implement verify_user and delete_user_bookmarks functions. (556e65be)
* **pages/bookmark:**  implement bookmark page. (538fe87a)
* **pages/notifications:**  implement notifications page. (b81b36db)
* **components/notificationcard:**  create notification card. (e8d839ef)
* **pages/home:**  add infinite scroll to feed. (fa3a3efe)
* **components/usermodals:**  create user modals component. (01be1fa6)
* **components/usertweets:**  create user tweets component. (558db335)
* **components/profile:**  add neccessary ui logic to profile component. (69aa10e8)
* **pages/profile:**  fetch user profile data from server. (eef2ca8d)
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

* **pages/sign-in:**  fix onboarding redirect issue. (49aaf39c)
* **components/accountprofile:**  change overlay color of banner image uploader. (63dda9f8)
* **controllers/notifications:**  fix read notifications issue. (de168d7a)
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

*  delete unused files. (1e3df299)
* **components:**  remove redundant logic in tweet box. (36ed518d)

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

